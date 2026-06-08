import { Enum } from '@ncoderz/superenum';
import { Command, Option } from 'commander';

import {
  BitmarkParserGenerator,
  type HtmlTableFormat,
  InputFormat,
  type OutputType,
} from '../../index.ts';
import { formatJson, readInput, writeOutput } from '../utils/io.ts';

const OUTPUT_FORMAT_CHOICES = ['html', 'bitmark', 'json', 'ast'];
const INPUT_FORMAT_CHOICES = ['html', 'bitmark', 'json'];
const TABLE_FORMAT_CHOICES = ['table', 'table-extended'];

export function createConvertHtmlTableCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('convertHtmlTable')
    .description('Convert between HTML tables and bitmark tables')
    .argument(
      '[input]',
      'file to read, or HTML / bitmark / json string. If not specified, input will be from <stdin>',
    )
    .addOption(
      new Option(
        '-f, --format <format>',
        'output format (default: bitmark for HTML input, html for bitmark/json input)',
      ).choices(OUTPUT_FORMAT_CHOICES),
    )
    .addOption(
      new Option('--inputFormat <format>', 'force input format (auto-detected by default)').choices(
        INPUT_FORMAT_CHOICES,
      ),
    )
    .addOption(
      new Option('--tableFormat <format>', 'bit type to emit for HTML input')
        .choices(TABLE_FORMAT_CHOICES)
        .default('table-extended'),
    )
    .option('--keepUnknownTags', 'keep unmappable HTML tags as literal text (HTML input only)')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default: 2 when --pretty is set)', (v) =>
      Number.parseInt(v, 10),
    )
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);
        const prettify = options.pretty ? (options.indent ?? 2) : undefined;

        // Map CLI input format to the API: 'html' forces HTML, anything else forces bits input.
        const inputFormat =
          options.inputFormat === 'html'
            ? InputFormat.html
            : options.inputFormat != null
              ? InputFormat.bitmark
              : undefined;

        const result = bpg.convertHtmlTable(dataIn, {
          inputFormat,
          outputFormat: options.format as OutputType | 'html' | undefined,
          tableFormat: Enum({ table: 'table', 'table-extended': 'table-extended' }).fromValue(
            options.tableFormat,
          ) as HtmlTableFormat | undefined,
          keepUnknownTags: options.keepUnknownTags,
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
  $ bitmark-parser convertHtmlTable '<table><tr><th>Name</th></tr><tr><td>John</td></tr></table>'

  $ bitmark-parser convertHtmlTable input.html -o output.bitmark

  $ bitmark-parser convertHtmlTable input.html -f json -p -o output.json

  $ bitmark-parser convertHtmlTable input.bitmark -o output.html

  $ bitmark-parser convertHtmlTable --tableFormat table input.html`,
    );

  return cmd;
}
