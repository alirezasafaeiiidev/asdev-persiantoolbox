import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['tests/e2e/**', '**/node_modules/**', '**/.next/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts', '**/*.config.*', '**/mockData', '**/types'],
      include: [
        'app/api/analytics/route.ts',
        'lib/server/csrf.ts',
        'lib/monitoring.ts',
        'shared/utils/**/*.{ts,tsx}',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/features': path.resolve(__dirname, './features'),
      '@/shared': path.resolve(__dirname, './shared'),
      '@/lib': path.resolve(__dirname, './lib'),
    },
  },
});
