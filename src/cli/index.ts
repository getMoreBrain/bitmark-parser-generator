#!/usr/bin/env node

/**
 * CLI entry point for bitmark-parser-generator
 *
 * This file is built separately from the main library to dist/cli/
 * and is NOT included in browser builds.
 */

export { cli } from './main.ts';
