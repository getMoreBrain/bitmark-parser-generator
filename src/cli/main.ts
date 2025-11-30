import process from 'node:process';

import { Command } from 'commander';

import { createBreakscapeCommand } from './commands/breakscape.ts';
import { createConvertCommand } from './commands/convert.ts';
import { createConvertTextCommand } from './commands/convertText.ts';
import { createInfoCommand } from './commands/info.ts';
import { createUnbreakscapeCommand } from './commands/unbreakscape.ts';
import { FULL_VERSION } from './utils/version.ts';

function init(): void {
  // Synchronous initialization if needed
}

async function asyncInit(): Promise<void> {
  const program = new Command();

  program.name('bitmark-parser').description('Bitmark parser command line interface');

  // Default command to handle version when no subcommand is given
  program
    .command('version', { isDefault: true, hidden: true })
    .option('-v, --version', 'output the version number')
    .action((options) => {
      if (options.version) {
        console.log(FULL_VERSION);
        process.exit(0);
      }
      // If no -v flag, show help instead
      program.outputHelp();
    });

  // Register commands
  program.addCommand(createConvertCommand());
  program.addCommand(createConvertTextCommand());
  program.addCommand(createBreakscapeCommand());
  program.addCommand(createUnbreakscapeCommand());
  program.addCommand(createInfoCommand());

  // Add help command
  program
    .command('help')
    .description('Display help for bitmark-parser.')
    .action(() => {
      program.outputHelp();
    });

  // Custom help formatting
  program.configureHelp({
    sortSubcommands: false, // Keep command order as defined
  });

  await program.parseAsync(process.argv);
}

async function cli() {
  try {
    init();
    await asyncInit();
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

export { cli };
