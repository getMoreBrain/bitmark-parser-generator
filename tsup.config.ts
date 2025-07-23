// import fs from 'fs-extra';
import type { Plugin } from 'esbuild';
import { defineConfig } from 'tsup';

const stripBlock = (): Plugin => ({
  name: 'strip-block',
  setup(build) {
    const pattern = /\/\*\s*STRIP:START\s*\*\/[\s\S]*?\/\*\s*STRIP:END\s*\*\//g;

    console.log('[strip-block] plugin setup');

    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      const fs = await import('fs/promises');
      let code = await fs.readFile(args.path, 'utf8');

      console.log(`Stripping code in ${args.path}`);

      code = code.replace(pattern, '');
      return { contents: code, loader: args.path.endsWith('.ts') ? 'ts' : 'js' };
    });
  },
});

export default defineConfig([
  // Node builds (ESM / CJS)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    target: 'es2020',
    outDir: 'dist',
    shims: true,
    dts: true,
    sourcemap: true,
    minify: false,
    splitting: false,
    treeshake: false,
    clean: true,
    // The banner code below is useful when createRequire is needed in ESM.
    // However, using createRequire will break bundle builds (e.g. using esbuild).
    // banner: ({ format }) => {
    //   if (format === 'esm')
    //     return {
    //       js: `import { createRequire as _banner_createRequire } from 'module'; const require = _banner_createRequire(import.meta.url);`,
    //     };
    //   return {};
    // },
    // onSuccess: async () => {
    //   // Copy file(s) to dist
    //   fs.cpSync('prompts', 'dist/prompts', {
    //     recursive: true,
    //   });
    // },
  },
  // Webpack pre-build (CJS)
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    target: 'es2020',
    outDir: 'build/browser',
    shims: true,
    dts: false,
    sourcemap: true,
    minify: false,
    splitting: false,
    treeshake: false,
    clean: true,
    // plugins: [stripBlock()],
    esbuildOptions(options) {
      // This is required so that webpack plugin 'webpack-strip-block' can strip the code correctly.
      // (otherwise the strip comments are removed or moved by esbuild)
      options.legalComments = 'inline';
      this.plugins = this.plugins || [];
      this.plugins.unshift(stripBlock());
    },
    // onSuccess: async () => {
    //   // Copy file(s) to dist
    //   fs.cpSync('prompts', 'dist/prompts', {
    //     recursive: true,
    //   });
    // },
  },
]);
