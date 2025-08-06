const path = require('node:path');

const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const dirname = __dirname;

const root = dirname;
const entry = path.resolve(root, './dist/browser/cjs/index.cjs');
const outputFilename = path.resolve(root, './dist/browser/');

const MAX_ASSET_SIZE = 1024 * 1204 * 50; // 50 MB!!

const config = {
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

module.exports = config;
