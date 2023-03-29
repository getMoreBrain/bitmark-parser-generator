import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

const config = defineConfig({
  resolve: {
    alias: [{ find: /^antlr4ts\/(.*)/, replacement: 'antlr4ts/dist/$1' }],
  },
  plugins: [tsconfigPaths()],
});

// eslint-disable-next-line arca/no-default-export
export default config;
