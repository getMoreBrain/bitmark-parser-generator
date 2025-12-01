import process from 'node:process';

import { Command, Help, Option } from 'commander';

import { createBreakscapeCommand } from './commands/breakscape.ts';
import { createConvertCommand } from './commands/convert.ts';
import { createConvertTextCommand } from './commands/convertText.ts';
import { createInfoCommand } from './commands/info.ts';
import { createUnbreakscapeCommand } from './commands/unbreakscape.ts';
import { FULL_VERSION } from './utils/version.ts';

function handleGlobalVersionFlag(argv: string[]): boolean {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-v' || arg === '--version') {
      const next = argv[i + 1];
      const isStandaloneFlag = next == null || next.startsWith('-');
      if (isStandaloneFlag) {
        console.log(FULL_VERSION);
        return true;
      }
    }
  }
  return false;
}

function init(): void {
  // Synchronous initialization if needed
}

async function asyncInit(): Promise<void> {
  if (handleGlobalVersionFlag(process.argv.slice(2))) {
    return;
  }

  const program = new Command();
  const rootVersionOption = new Option('-v, --version', 'Display version');

  program
    .name('bitmark-parser')
    .description('Convert to and from bitmark formats.')
    .helpOption('-h, --help', 'Display help for command')
    .action(() => {
      program.outputHelp();
    });

  // Register commands
  program.addCommand(createConvertCommand());
  program.addCommand(createConvertTextCommand());
  program.addCommand(createBreakscapeCommand());
  program.addCommand(createUnbreakscapeCommand());
  program.addCommand(createInfoCommand());

  program
    .command('version')
    .description('Display version')
    .action(() => {
      console.log(FULL_VERSION);
    });

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
    visibleOptions(command) {
      const options = Help.prototype.visibleOptions.call(this, command);
      if (command === program) {
        return [rootVersionOption, ...options];
      }
      return options;
    },
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
