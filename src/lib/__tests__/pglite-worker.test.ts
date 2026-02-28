import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Worker since jsdom doesn't support it
const mockPostMessage = vi.fn();
const mockTerminate = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

class MockWorker {
  postMessage = mockPostMessage;
  terminate = mockTerminate;
  addEventListener = mockAddEventListener;
  removeEventListener = mockRemoveEventListener;
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
}

vi.stubGlobal('Worker', MockWorker);

describe('PGliteWorkerClient', () => {
  let client: Awaited<ReturnType<typeof import('../pglite-worker').createPGliteClient>>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamically import to pick up the mocked Worker
    const mod = await import('../pglite-worker');
    client = mod.createPGliteClient();
  });

  afterEach(() => {
    client.terminate();
  });

  it('should create a client instance', () => {
    expect(client).toBeDefined();
    expect(client.query).toBeInstanceOf(Function);
    expect(client.terminate).toBeInstanceOf(Function);
  });

  it('should send query messages to worker', async () => {
    const queryPromise = client.query('SELECT 1');

    // Simulate worker responding
    const call = mockAddEventListener.mock.calls.find((c) => c[0] === 'message');
    if (call) {
      const handler = call[1];
      handler({
        data: {
          id: 1,
          success: true,
          rows: [{ '?column?': 1 }],
          fields: [{ name: '?column?', dataTypeID: 23 }],
        },
      } as MessageEvent);
    }

    const result = await queryPromise;
    expect(result.rows).toEqual([{ '?column?': 1 }]);
    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'query',
        sql: 'SELECT 1',
      }),
    );
  });

  it('should handle query errors from worker', async () => {
    const queryPromise = client.query('INVALID SQL');

    const call = mockAddEventListener.mock.calls.find((c) => c[0] === 'message');
    if (call) {
      const handler = call[1];
      handler({
        data: {
          id: 1,
          success: false,
          error: 'syntax error at or near "INVALID"',
        },
      } as MessageEvent);
    }

    await expect(queryPromise).rejects.toThrow('syntax error');
  });

  it('should terminate the worker', () => {
    client.terminate();
    expect(mockTerminate).toHaveBeenCalled();
  });

  it('should handle query timeout', async () => {
    vi.useFakeTimers();

    const queryPromise = client.query('SELECT pg_sleep(30)');

    // Advance past the 10-second timeout
    vi.advanceTimersByTime(10_001);

    await expect(queryPromise).rejects.toThrow('timeout');

    vi.useRealTimers();
  });

  it('should support parameterized queries', async () => {
    const queryPromise = client.query('SELECT $1::int + $2::int', [1, 2]);

    const call = mockAddEventListener.mock.calls.find((c) => c[0] === 'message');
    if (call) {
      const handler = call[1];
      handler({
        data: {
          id: 1,
          success: true,
          rows: [{ '?column?': 3 }],
          fields: [{ name: '?column?', dataTypeID: 23 }],
        },
      } as MessageEvent);
    }

    const result = await queryPromise;
    expect(result.rows).toEqual([{ '?column?': 3 }]);
    expect(mockPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'query',
        sql: 'SELECT $1::int + $2::int',
        params: [1, 2],
      }),
    );
  });
});
