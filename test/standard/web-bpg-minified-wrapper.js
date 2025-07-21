/**
 * This file is a wrapper around the compiled, minified version of the Bitmark Parser Generator library.
 * It is required to import the built library in tests.
 * This file is ignored by the TypeScript compiler and the linter, otherwise building the tests would fail.
 */
export * from '../../dist/browser/bitmark-parser-generator.min.js';
