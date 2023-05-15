import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Configuration } from 'webpack';

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
    filename: 'bitmark-parser-generator.min.js',
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
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        enforce: 'pre',
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'webpack-strip-block',
            options: {
              start: 'STRIP:START',
              end: 'STRIP:END',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2020,
        },
      }),
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      defaultSizes: 'stat',
    }),
  ],
};

// eslint-disable-next-line arca/no-default-export
export default config;
