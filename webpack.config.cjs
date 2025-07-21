const path = require('node:path');

const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const dirname = __dirname;

const root = dirname;
const entry = path.resolve(root, './build/browser/index.cjs');
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
  resolve: {
    fallback: {
      fs: require.resolve('./src/web-polyfills/fs.js'),
      // os: require.resolve('os-browserify/browser'),
      os: false,
      path: false,
      stream: false,
      constants: false,
    },
  },
  module: {
    // rules: [
    //   {
    //     test: /\.[jt]sx?$/,
    //     enforce: 'pre',
    //     exclude: /(node_modules)/,
    //     use: [
    //       {
    //         loader: 'webpack-strip-block',
    //         options: {
    //           start: 'STRIP:START',
    //           end: 'STRIP:END',
    //         },
    //       },
    //     ],
    //   },
    // ],
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
    new DefinePlugin({
      'process.env.BPG_ENV': JSON.stringify('production'),
    }),
  ],
};

module.exports = config;
