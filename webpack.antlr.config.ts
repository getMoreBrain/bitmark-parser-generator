import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';

const root = __dirname;
const entry = path.resolve(root, './dist/cjs/index.js');
const outputFilename = path.resolve(root, './dist/browser/');

const MAX_ASSET_SIZE = 1024 * 1204 * 50; // 50 MB!!

const config: Configuration = {
  target: 'browserslist:modern',
  mode: 'production',
  // mode: 'development',
  // devtool: 'inline-source-map',
  performance: {
    maxAssetSize: MAX_ASSET_SIZE,
    maxEntrypointSize: MAX_ASSET_SIZE,
    hints: 'error',
  },
  entry,
  output: {
    path: outputFilename,
    filename: 'bitmark-parser-generator-antlr.min.js',
    library: {
      type: 'umd',
      name: 'bitmarkParserGenerator',
    },
    // prevent error: `Uncaught ReferenceError: self is not define`
    globalObject: 'this',
  },
  resolve: {
    fallback: {
      fs: require.resolve('./dist/cjs/utils/polyfill/fs.js'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2020,
          format: {
            ascii_only: true, // Required for Anltr 'serialized ATN segments'
          },
        },
        // exclude: /node_modules\/bitmark-grammar/ /*[new RegExp('node_modules/bitmark-grammar/.+')],*/,
      }),
    ],
  },
  plugins: [
    new NodePolyfillPlugin({
      includeAliases: ['constants', 'os', 'path', 'process', 'stream', 'console'],
    }),
    new DefinePlugin({
      'process.env.BPG_ENV': JSON.stringify('production'),
    }),
  ],
};

// eslint-disable-next-line arca/no-default-export
export default config;
