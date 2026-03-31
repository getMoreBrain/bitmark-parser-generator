import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['test/cli/setup/tmpDir.ts'],
    exclude: ['submodules/**', '**/node_modules/**'],
  },
});
