import { Command } from 'commander';

import {
  BitmarkParserGenerator,
  BitmarkParserType,
  BitmarkVersion,
  CardSetVersion,
  Output,
} from '../../index.ts';
import { formatJson, readInput, writeOutput } from '../utils/io.ts';

export function createConvertCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('convert')
    .description('Convert between bitmark formats')
    .argument(
      '[input]',
      'file to read, or bitmark or json string. If not specified, input will be from <stdin>',
    )
    .option('-v, --version <version>', 'version of bitmark to use (default: latest)', (v) =>
      parseInt(v),
    )
    .option(
      '-f, --format <format>',
      'output format. If not specified, bitmark is converted to JSON, and JSON / AST is converted to bitmark',
    )
    .option('-w, --warnings', 'enable warnings in the output')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default:2)', (v) => parseInt(v))
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
      (v) => parseInt(v),
    )
    .option(
      '--cardSetVersion <version>',
      'version of card set to use in bitmark (default: set by bitmark version)',
      (v) => parseInt(v),
    )
    .option('--parser <parser>', 'parser to use', 'peggy')
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

            if (options.output) {
              const jsonPrettyStr = formatJson(result, options.pretty, options.indent);
              await writeOutput(jsonPrettyStr, options.output, options.append);
              return;
            }
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
            outputFile: options.output,
            outputFormat: Output.fromValue(options.format),
            fileOptions: {
              append: options.append,
            },
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

        // Output to stdout if no file specified
        if (!options.output) {
          if (typeof result !== 'string') {
            result = formatJson(result, options.pretty, options.indent);
          }
          console.log(result);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return cmd;
}
