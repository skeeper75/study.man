import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    pool: 'forks',
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'tests/**/*.{test,spec}.{ts,tsx}',
      'tests/**/*.test.{ts,tsx}',
    ],
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/content/**',
        'src/app/**',
        'src/lib/**/*.test.ts',
        'src/lib/datasets/*.sql',
        'src/lib/pglite.worker.ts',
        'src/mdx-components.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})
