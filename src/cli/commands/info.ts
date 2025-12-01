import { Argument, Command, InvalidArgumentError, Option } from 'commander';

import {
  BitmarkParserGenerator,
  InfoFormat,
  type InfoFormatType,
  InfoType,
  type InfoTypeType,
} from '../../index.ts';
import { writeOutput } from '../utils/io.ts';
import { enumChoices } from '../utils/options.ts';

const INFO_TYPE_CHOICES: InfoTypeType[] = (() => {
  const choices = new Set(enumChoices(InfoType) as InfoTypeType[]);
  const ordered: InfoTypeType[] = [];
  const preferredOrder: InfoTypeType[] = [
    InfoType.list,
    InfoType.bit,
    InfoType.all,
    InfoType.deprecated,
  ];

  for (const value of preferredOrder) {
    if (choices.delete(value)) ordered.push(value);
  }

  return [...ordered, ...choices];
})();

const INFO_FORMAT_CHOICES: InfoFormatType[] = (enumChoices(InfoFormat) as InfoFormatType[]).filter(
  (value) => value !== InfoFormat.pojo,
);

function parseInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError('Indent must be an integer.');
  }
  return parsed;
}

export function createInfoCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('info')
    .description('Display information about bitmark')
    .addArgument(
      new Argument(
        '[info]',
        'information to return. If not specified, a list of bits will be returned',
      )
        .choices([...INFO_TYPE_CHOICES])
        .default(InfoType.list),
    )
    .addOption(
      new Option('-f, --format <format>', 'output format. If not specified, the ouput will be text')
        .choices([...INFO_FORMAT_CHOICES])
        .default(InfoFormat.text),
    )
    .option('--all', 'output all bits including deprecated')
    .option('--bit <value>', 'bit to filter. If not specified, all bits will be returned')
    .option('--deprecated', 'output deprecated bits')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default: 2 when --pretty is set)', (v) =>
      parseInteger(v),
    )
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

        await writeOutput(result, options.output, options.append);
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    })
    .addHelpText(
      'after',
      `
Examples:
  $ bitmark-parser info

  $ bitmark-parser info --all

  $ bitmark-parser info list --deprecated

  $ bitmark-parser info bit --bit=cloze

  $ bitmark-parser info -f json -p bit --bit=still-image-film`,
    );

  return cmd;
}
