import { Command, InvalidArgumentError, Option } from 'commander';

import {
  BitmarkParserGenerator,
  BitmarkParserType,
  BitmarkVersion,
  CardSetVersion,
  Output,
} from '../../index.ts';
import { formatJson, readInput, writeOutput } from '../utils/io.ts';
import { enumChoices } from '../utils/options.ts';

const BITMARK_VERSION_CHOICES = enumChoices(BitmarkVersion);
const OUTPUT_FORMAT_CHOICES = enumChoices(Output);
const CARD_SET_VERSION_CHOICES = enumChoices(CardSetVersion);
const PARSER_CHOICES = Array.from(new Set([...enumChoices(BitmarkParserType), 'antlr']));

function parseInteger(value: string, label: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError(`${label} must be an integer.`);
  }
  return parsed;
}

function parseNonNegativeInteger(value: string, label: string): number {
  const parsed = parseInteger(value, label);
  if (parsed < 0) {
    throw new InvalidArgumentError(`${label} must be zero or greater.`);
  }
  return parsed;
}

export function createConvertCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('convert')
    .description('Convert between bitmark formats')
    .argument(
      '[input]',
      'file to read, or bitmark or json string. If not specified, input will be from <stdin>',
    )
    .addOption(
      new Option('-v, --version <version>', 'version of bitmark to use (default: latest)')
        .choices([...BITMARK_VERSION_CHOICES])
        .argParser((value) => parseInteger(value, 'Version')),
    )
    .addOption(
      new Option(
        '-f, --format <format>',
        'output format. If not specified, bitmark is converted to JSON, and JSON / AST is converted to bitmark',
      ).choices([...OUTPUT_FORMAT_CHOICES]),
    )
    .option('-w, --warnings', 'enable warnings in the output')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default: 2 when --pretty is set)', (v) =>
      parseInteger(v, 'Indent'),
    )
    .option(
      '--plainText',
      'output text as plain text rather than JSON (default: set by bitmark version)',
    )
    .option('--excludeUnknownProperties', 'exclude unknown properties in the JSON output')
    .option(
      '--explicitTextFormat',
      'include bitmark text format in bitmark even if it is the default (bitmark++)',
    )
    .option(
      '--spacesAroundValues <value>',
      'number of spaces around values in bitmark (default: 1)',
      (v) => parseNonNegativeInteger(v, 'spacesAroundValues'),
    )
    .addOption(
      new Option(
        '--cardSetVersion <version>',
        'version of card set to use in bitmark (default: set by bitmark version)',
      )
        .choices([...CARD_SET_VERSION_CHOICES])
        .argParser((value) => parseInteger(value, 'cardSetVersion')),
    )
    .addOption(
      new Option('--parser <parser>', 'parser to use')
        .choices([...PARSER_CHOICES])
        .default('peggy'),
    )
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);
        const prettify = options.pretty ? (options.indent ?? 2) : undefined;
        const spacesAroundValues =
          options.spacesAroundValues != null ? Math.max(0, options.spacesAroundValues) : undefined;

        let result: string | unknown;

        // Handle antlr parser (legacy)
        if (options.parser === 'antlr') {
          try {
            // Attempt to import legacy parser (optional dependency)
            // @ts-expect-error - bitmark-grammar is an optional dependency
            const { parse: antlrParse } = await import('bitmark-grammar');
            const jsonStr = antlrParse(dataIn);
            result = JSON.parse(jsonStr);
          } catch (_err) {
            throw new Error(
              'ANTLR parser not available. Install bitmark-grammar package or use --parser=peggy',
            );
          }
        } else {
          // Use Peggy parser via BitmarkParserGenerator
          result = bpg.convert(dataIn, {
            bitmarkVersion: BitmarkVersion.fromValue(options.version),
            bitmarkParserType: BitmarkParserType.fromValue(options.parser),
            outputFormat: Output.fromValue(options.format),
            jsonOptions: {
              enableWarnings: options.warnings,
              prettify,
              textAsPlainText: options.plainText ?? undefined,
              excludeUnknownProperties: options.excludeUnknownProperties,
            },
            bitmarkOptions: {
              explicitTextFormat: options.explicitTextFormat,
              spacesAroundValues,
              cardSetVersion: CardSetVersion.fromValue(options.cardSetVersion),
            },
          });
        }

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
  $ bitmark-parser convert '[.article] Hello World'

  $ bitmark-parser convert '[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++", "body": "Hello World" }}]'

  $ bitmark-parser convert input.json -o output.bitmark

  $ bitmark-parser convert input.bitmark -o output.json

  $ bitmark-parser convert -f ast input.json -o output.ast.json`,
    );

  return cmd;
}
