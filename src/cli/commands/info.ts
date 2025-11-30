import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

import { BitmarkParserGenerator, InfoFormat, InfoType } from '../../index.ts';

export function createInfoCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('info')
    .description('Display information about bitmark')
    .argument(
      '[info]',
      'information to return. If not specified, a list of bits will be returned',
      'list',
    )
    .option(
      '-f, --format <format>',
      'output format. If not specified, the ouput will be text',
      'text',
    )
    .option('--all', 'output all bits including deprecated')
    .option('--bit <value>', 'bit to filter. If not specified, all bits will be returned')
    .option('--deprecated', 'output deprecated bits')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default:2)', (v) => parseInt(v))
    .action(async (info, options) => {
      try {
        const prettify = options.pretty ? (options.indent ?? 2) : undefined;
        const outputFormat = InfoFormat.fromValue(options.format) ?? InfoFormat.text;

        // Determine info type based on arguments and flags
        let type = InfoType.fromValue(info) ?? InfoType.list;
        if (type === InfoType.list) {
          if (options.all) type = InfoType.all;
          else if (options.deprecated) type = InfoType.deprecated;
        }

        const result: string = bpg.info({
          type,
          bit: options.bit,
          outputFormat,
          prettify,
        }) as string;

        if (options.output) {
          // Write to file
          const flag = options.append ? 'a' : 'w';
          await fs.ensureDir(path.dirname(options.output));
          await fs.writeFile(options.output, result, { flag });
        } else {
          console.log(result);
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return cmd;
}
