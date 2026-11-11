import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
    pool: 'vmThreads',
    testTimeout: 60000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
