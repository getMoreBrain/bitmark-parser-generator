/**
 * This script uses esbuild to build the project to an intermediate code
 * for use with webpack.
 *
 * It performs some code stripping to remove code not wanted in the browser
 *
 */
import esbuild, { type Plugin } from 'esbuild';

/**
 * Strip block comments from the code.
 *
 * Code between the block comments 'STRIP:START' and 'STRIP:END' will be removed.
 *
 * @returns
 */
const stripBlock = (): Plugin => ({
  name: 'strip-block',
  setup(build) {
    const pattern = /\/\*\s*STRIP:START\s*\*\/[\s\S]*?\/\*\s*STRIP:END\s*\*\//g;

    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      const fs = await import('fs/promises');
      let code = await fs.readFile(args.path, 'utf8');

      code = code.replace(pattern, '');
      return { contents: code, loader: args.path.endsWith('.ts') ? 'ts' : 'js' };
    });
  },
});

/**
 * import 'node:path' is not supported by webpack, so we replace it with 'path'.
 *
 * @returns
 */
const replaceNodePathImports = (): Plugin => ({
  name: 'replace-node-path-imports',
  setup(build) {
    build.onResolve({ filter: /^node:path$/ }, (_args) => {
      // If the import path is 'node:path', resolve it to 'path'
      return { path: 'path', external: true };
    });
  },
});

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'build/browser/index.cjs',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'es2020',
    sourcemap: true,
    treeShaking: true,
    plugins: [stripBlock(), replaceNodePathImports()],
  })
  .catch(() => process.exit(1));
