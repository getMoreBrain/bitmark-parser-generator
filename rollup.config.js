const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const terser = require('rollup-plugin-terser').terser;
// const pkg = require('./package.json');

module.exports = [
  {
    input: 'dist/cjs/bmg.js',
    output: {
      name: 'bmg',
      file: 'dist/browser/bmg.min.js',
      format: 'umd',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), terser()],
    // plugins: [resolve(), commonjs()],
  },
];
