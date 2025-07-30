// import fs from 'fs-extra';
import type { Plugin } from 'esbuild';
import { defineConfig } from 'tsup';

/**
 * This plugin strips code blocks marked with block comments STRIP:START and STRIP:END.
 *
 * It is used to remove node specific code from the browser builds.
 *
 * @returns {Plugin} An esbuild plugin that strips code blocks marked with block comments STRIP:START and STRIP:END.
 */
const stripBlock = (): Plugin => ({
  name: 'strip-block',
  setup(build) {
    const pattern = /\/\*\s*STRIP:START\s*\*\/[\s\S]*?\/\*\s*STRIP:END\s*\*\//g;

    console.log('[strip-block] plugin setup');

    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      const fs = await import('fs/promises');
      let code = await fs.readFile(args.path, 'utf8');

      // console.log(`Stripping code in ${args.path}`);

      code = code.replace(pattern, '');
      return { contents: code, loader: args.path.endsWith('.ts') ? 'ts' : 'js' };
    });
  },
});

const browserDefines = {
  'process.env.BPG_ENV': JSON.stringify('production'),
};

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
    // However, using 'import.meta.url' will break bundle builds (e.g. using esbuild) because it will not be defined.
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
  // Browser build (CJS)
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    target: 'es2020',
    outDir: 'dist/browser/cjs',
    define: browserDefines,
    shims: true,
    dts: true,
    sourcemap: true,
    minify: false,
    splitting: false,
    treeshake: false,
    clean: true,
    // plugins: [],
    esbuildPlugins: [stripBlock()],
    // esbuildOptions(options) {
    //   // This is required so that webpack plugin 'webpack-strip-block' can strip the code correctly.
    //   // (otherwise the strip comments are removed or moved by esbuild)
    //   options.legalComments = 'inline';
    // },
  },
  // Browser build (ESM)
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    target: 'es2020',
    outDir: 'dist/browser/esm',
    define: browserDefines,
    shims: true,
    dts: true,
    sourcemap: true,
    minify: false,
    splitting: false,
    treeshake: false,
    clean: true,
    // plugins: [],
    esbuildPlugins: [stripBlock()],
    // esbuildOptions(options) {
    //   // This is required so that webpack plugin 'webpack-strip-block' can strip the code correctly.
    //   // (otherwise the strip comments are removed or moved by esbuild)
    //   options.legalComments = 'inline';
    // },
  },
]);
