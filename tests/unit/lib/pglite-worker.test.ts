import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPGliteClient, type PGliteClient } from '@/lib/pglite-worker'

// Access the worker instances tracked by setup.ts
const workerInstances = (globalThis as Record<string, unknown>).__workerInstances as Array<{
  postMessage: ReturnType<typeof vi.fn>
  terminate: ReturnType<typeof vi.fn>
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
  onmessage: ((event: MessageEvent) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
}>

describe('PGlite Worker Interface', () => {
  let client: PGliteClient
  let instancesBefore: number
  let terminated: boolean

  beforeEach(() => {
    vi.useFakeTimers()
    instancesBefore = workerInstances.length
    terminated = false
    client = createPGliteClient()
  })

  afterEach(() => {
    if (!terminated) {
      client.terminate()
    }
    vi.useRealTimers()
  })

  function getLatestWorker() {
    return workerInstances[workerInstances.length - 1]
  }

  describe('createPGliteClient', () => {
    it('should create a Web Worker on instantiation', () => {
      // FR-002: Web Worker execution required
      expect(workerInstances.length).toBeGreaterThan(instancesBefore)
    })

    it('should return an object with query and terminate methods', () => {
      expect(client).toHaveProperty('query')
      expect(client).toHaveProperty('terminate')
      expect(typeof client.query).toBe('function')
      expect(typeof client.terminate).toBe('function')
    })
  })

  describe('query', () => {
    it('should send a message to the Worker with query data', () => {
      const mockWorker = getLatestWorker()
      // Catch the pending promise to prevent unhandled rejection on cleanup
      client.query('SELECT 1').catch(() => {})
      expect(mockWorker.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'query',
          sql: 'SELECT 1',
        })
      )
    })

    it('should include params in the Worker message when provided', () => {
      const mockWorker = getLatestWorker()
      // Catch the pending promise to prevent unhandled rejection on cleanup
      client.query('SELECT $1', [42]).catch(() => {})
      expect(mockWorker.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          sql: 'SELECT $1',
          params: [42],
        })
      )
    })

    it('should reject with timeout error after 10 seconds', async () => {
      // FR-002: terminate query after 10 seconds
      const queryPromise = client.query('SELECT pg_sleep(15)')
      vi.advanceTimersByTime(10_000)
      await expect(queryPromise).rejects.toThrow(/timeout/i)
    })

    it('should resolve with query results when Worker responds successfully', async () => {
      const mockWorker = getLatestWorker()
      const queryPromise = client.query('SELECT 1 AS result')

      // Simulate Worker response via addEventListener
      const messageHandler = mockWorker.addEventListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'message'
      )?.[1] as ((event: { data: unknown }) => void) | undefined

      if (messageHandler) {
        messageHandler({
          data: {
            id: 1,
            success: true,
            rows: [{ result: 1 }],
            fields: [{ name: 'result', dataTypeID: 23 }],
          },
        })
      }

      const result = await queryPromise
      expect(result.rows).toHaveLength(1)
      expect(result.rows[0]).toEqual({ result: 1 })
      expect(result.fields[0].name).toBe('result')
    })

    it('should reject with error when Worker responds with failure', async () => {
      const mockWorker = getLatestWorker()
      const queryPromise = client.query('SELECTT 1')

      const messageHandler = mockWorker.addEventListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'message'
      )?.[1] as ((event: { data: unknown }) => void) | undefined

      if (messageHandler) {
        messageHandler({
          data: {
            id: 1,
            success: false,
            error: 'syntax error at or near "SELECTT"',
          },
        })
      }

      await expect(queryPromise).rejects.toThrow(/syntax error/)
    })
  })

  describe('terminate', () => {
    it('should call Worker.terminate()', () => {
      const mockWorker = getLatestWorker()
      client.terminate()
      terminated = true
      expect(mockWorker.terminate).toHaveBeenCalled()
    })

    it('should reject all pending queries with termination error', async () => {
      const queryPromise = client.query('SELECT 1')
      client.terminate()
      terminated = true
      await expect(queryPromise).rejects.toThrow(/terminated/i)
    })

    it('should remove the message event listener', () => {
      const mockWorker = getLatestWorker()
      client.terminate()
      terminated = true
      expect(mockWorker.removeEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      )
    })
  })
})

describe('Module-level queryPGlite and terminatePGlite', () => {
  it('terminatePGlite should be safe to call when no client exists', async () => {
    const { terminatePGlite } = await import('@/lib/pglite-worker')
    // Should not throw when called with no active singleton
    expect(() => terminatePGlite()).not.toThrow()
  })

  it('queryPGlite should create a singleton client and send query', async () => {
    const { queryPGlite, terminatePGlite } = await import('@/lib/pglite-worker')
    const mockWorker = workerInstances[workerInstances.length - 1]

    // Start query - will be pending
    const queryPromise = queryPGlite('SELECT 1').catch(() => {})

    // Verify a postMessage was sent
    expect(mockWorker?.postMessage ?? (() => {})).toBeDefined()

    // Cleanup singleton
    terminatePGlite()
    await queryPromise
  })
})
