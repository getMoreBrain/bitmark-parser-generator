import { Command } from 'commander';

import { BitmarkParserGenerator } from '../../index.ts';
import { readInput, writeOutput } from '../utils/io.ts';

export function createUnbreakscapeCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('unbreakscape')
    .description('Unbreakscape text')
    .argument('[input]', 'file to read, or text. If not specified, input will be from <stdin>')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);

        // Bitmark tool unbreakscape
        const result = bpg.unbreakscapeText(dataIn);
        await writeOutput(result ?? '', options.output, options.append);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    })
    .addHelpText(
      'after',
      `
Examples:
  $ bitmark-parser unbreakscape '[^.article] Hello World'

  $ bitmark-parser unbreakscape input.txt -o output.txt`,
    );

  return cmd;
}
