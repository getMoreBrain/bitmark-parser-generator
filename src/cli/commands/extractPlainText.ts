import { Enum } from '@ncoderz/superenum';
import { Command, Option } from 'commander';

import { BitmarkParserGenerator, InputFormat } from '../../index.ts';
import { readInput, writeOutput } from '../utils/io.ts';
import { enumChoices } from '../utils/options.ts';

const INPUT_FORMAT_CHOICES = enumChoices(InputFormat);

export function createExtractPlainTextCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('extractPlainText')
    .description('Extract plain text from bitmark, bitmark text, or JSON')
    .argument(
      '[input]',
      'file to read, or text or json string. If not specified, input will be from <stdin>',
    )
    .addOption(
      new Option(
        '-f, --inputFormat <format>',
        'force input format (auto-detected by default)',
      ).choices([...INPUT_FORMAT_CHOICES]),
    )
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);

        const result = bpg.extractPlainText(dataIn, {
          inputFormat: Enum(InputFormat).fromValue(options.inputFormat),
        });

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
  $ bitmark-parser extractPlainText '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]'

  $ bitmark-parser extractPlainText input.json

  $ bitmark-parser extractPlainText input.json -o output.txt

  $ bitmark-parser extractPlainText -f bitmark input.bitmark`,
    );

  return cmd;
}
