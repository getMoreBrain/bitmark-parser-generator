import { Enum } from '@ncoderz/superenum';
import { Command, InvalidArgumentError, Option } from 'commander';

import { BitmarkParserGenerator, BodyTextFormat } from '../../index.ts';
import { formatJson, readInput, writeOutput } from '../utils/io.ts';
import { enumChoices } from '../utils/options.ts';

const TEXT_FORMAT_CHOICES = (() => {
  const choices = enumChoices(BodyTextFormat);
  const preferred = BodyTextFormat.bitmarkPlusPlus;
  return [preferred, ...choices.filter((choice) => choice !== preferred)];
})();

function parseInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError('Indent must be an integer.');
  }
  return parsed;
}

export function createConvertTextCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('convertText')
    .description('Convert between bitmark text formats')
    .argument(
      '[input]',
      'file to read, or text or json string. If not specified, input will be from <stdin>',
    )
    .addOption(
      new Option('-f, --textFormat <format>', 'conversion format')
        .choices([...TEXT_FORMAT_CHOICES])
        .default(BodyTextFormat.bitmarkPlusPlus),
    )
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default: 2 when --pretty is set)', (v) =>
      parseInteger(v),
    )
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);
        const prettify = options.pretty ? (options.indent ?? 2) : undefined;

        // Bitmark tool text conversion
        const result = bpg.convertText(dataIn, {
          textFormat: Enum(BodyTextFormat).fromValue(options.textFormat),
          jsonOptions: {
            prettify,
          },
        });

        let outputValue: string | unknown = result ?? '';
        if (typeof outputValue !== 'string') {
          outputValue = formatJson(outputValue, options.pretty, options.indent);
        }

        await writeOutput(outputValue, options.output, options.append);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    })
    .addHelpText(
      'after',
      `
Examples:
  $ bitmark-parser convertText 'Hello World'

  $ bitmark-parser convertText '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]'

  $ bitmark-parser convertText input.json -o output.txt

  $ bitmark-parser convertText input.txt -o output.json`,
    );

  return cmd;
}
