import process from 'node:process';

import { Command } from 'commander';

import { PACKAGE_INFO } from '../generated/package_info.ts';
import { BitmarkParserGenerator } from '../index.ts';

function init(): void {
  //
}

async function asyncInit(): Promise<void> {
  const program = new Command();

  program.name(PACKAGE_INFO.name);
  // program.description(bme.getAppDescription());
  program.version(`v${PACKAGE_INFO.version}`);
}

async function cli() {
  try {
    init();
    await asyncInit();
  } catch (_e) {
    process.exitCode = 1; // Set exit code to 1 to indicate an error
  }
}

export { cli };
