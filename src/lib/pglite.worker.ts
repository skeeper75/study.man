// @MX:NOTE: [AUTO] Web Worker entry point for PGlite SQL execution
// @MX:WARN: [AUTO] Runs in isolated Worker thread - no DOM access
// @MX:REASON: Worker isolation prevents main thread blocking during SQL execution

import { PGlite } from '@electric-sql/pglite';

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

let db: PGlite | null = null;

async function getDB(): Promise<PGlite> {
  if (!db) {
    db = new PGlite();
    await db.waitReady;
  }
  return db;
}

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, sql, params } = event.data;

  if (type !== 'query') return;

  try {
    const pglite = await getDB();
    const result = await pglite.query(sql, params);

    const response: WorkerResponse = {
      id,
      success: true,
      rows: result.rows as Record<string, unknown>[],
      fields: result.fields.map((f) => ({
        name: f.name,
        dataTypeID: f.dataTypeID,
      })),
    };

    self.postMessage(response);
  } catch (err) {
    const response: WorkerResponse = {
      id,
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };

    self.postMessage(response);
  }
});
