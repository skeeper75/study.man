// @MX:ANCHOR: [AUTO] Primary PGlite interface - 3+ components depend on this
// @MX:REASON: SPEC-PGSTU-001 FR-002 core dependency
// @MX:WARN: [AUTO] Web Worker lifecycle management - terminate() must be called on unmount
// @MX:REASON: Memory leak risk if Worker is not terminated

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  fields: { name: string; dataTypeID: number }[];
}

interface WorkerMessage {
  id: number;
  type: 'query';
  sql: string;
  params?: unknown[];
}

interface WorkerResponse {
  id: number;
  success: boolean;
  rows?: Record<string, unknown>[];
  fields?: { name: string; dataTypeID: number }[];
  error?: string;
}

interface PendingQuery {
  resolve: (result: QueryResult) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const QUERY_TIMEOUT_MS = 10_000;

export interface PGliteClient {
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<QueryResult<T>>;
  terminate: () => void;
}

export function createPGliteClient(): PGliteClient {
  const worker = new Worker(new URL('./pglite.worker.ts', import.meta.url), {
    type: 'module',
  });

  const pending = new Map<number, PendingQuery>();
  let nextId = 1;

  const handleMessage = (event: MessageEvent<WorkerResponse>): void => {
    const { id, success, rows, fields, error } = event.data;
    const query = pending.get(id);
    if (!query) return;

    clearTimeout(query.timer);
    pending.delete(id);

    if (success) {
      query.resolve({ rows: rows ?? [], fields: fields ?? [] });
    } else {
      query.reject(new Error(error ?? 'Unknown query error'));
    }
  };

  worker.addEventListener('message', handleMessage);

  function query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return new Promise<QueryResult<T>>((resolve, reject) => {
      const id = nextId++;

      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Query timeout after ${QUERY_TIMEOUT_MS}ms`));
      }, QUERY_TIMEOUT_MS);

      pending.set(id, {
        resolve: resolve as (result: QueryResult) => void,
        reject,
        timer,
      });

      const message: WorkerMessage = { id, type: 'query', sql, params };
      worker.postMessage(message);
    });
  }

  function terminate(): void {
    for (const [, { reject, timer }] of pending) {
      clearTimeout(timer);
      reject(new Error('Worker terminated'));
    }
    pending.clear();
    worker.removeEventListener('message', handleMessage);
    worker.terminate();
  }

  return { query, terminate };
}

let singletonClient: PGliteClient | null = null;

function getClient(): PGliteClient {
  if (!singletonClient) {
    singletonClient = createPGliteClient();
  }
  return singletonClient;
}

export async function queryPGlite<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return getClient().query<T>(sql, params);
}

export function terminatePGlite(): void {
  if (singletonClient) {
    singletonClient.terminate();
    singletonClient = null;
  }
}
