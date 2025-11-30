import { Command } from 'commander';

import { BitmarkParserGenerator, BodyTextFormat } from '../../index.ts';
import { formatJson, readInput } from '../utils/io.ts';

export function createConvertTextCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('convertText')
    .description('Convert between bitmark text formats')
    .argument(
      '[input]',
      'file to read, or text or json string. If not specified, input will be from <stdin>',
    )
    .option('-f, --textFormat <format>', 'conversion format', 'bitmark++')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default:2)', (v) => parseInt(v))
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);
        const prettify = options.pretty ? (options.indent ?? 2) : undefined;

        // Bitmark tool text conversion
        const result = bpg.convertText(dataIn, {
          textFormat: BodyTextFormat.fromValue(options.textFormat),
          outputFile: options.output,
          fileOptions: {
            append: options.append,
          },
          jsonOptions: {
            prettify,
          },
        });

        if (!options.output) {
          if (typeof result !== 'string') {
            const output = formatJson(result, options.pretty, options.indent);
            console.log(output);
          } else {
            console.log(result);
          }
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return cmd;
}
