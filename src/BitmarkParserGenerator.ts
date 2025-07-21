/* eslint-disable arca/import-ordering */
import { EnumType, superenum } from '@ncoderz/superenum';

import { Ast } from './ast/Ast';
import { BitmarkOptions } from './generator/bitmark/BitmarkGenerator';
import { BitmarkStringGenerator } from './generator/bitmark/BitmarkStringGenerator';
import { JsonOptions } from './generator/json/JsonGenerator';
import { JsonObjectGenerator } from './generator/json/JsonObjectGenerator';
import { BitmarkAst } from './model/ast/Nodes';
import { BitmarkParserType, BitmarkParserTypeType } from './model/enum/BitmarkParserType';
import { BitmarkParser } from './parser/bitmark/BitmarkParser';
import { JsonParser } from './parser/json/JsonParser';
import { env } from './utils/env/Env';
import { BitmarkVersionType } from './model/enum/BitmarkVersion';
import { InfoBuilder, SupportedBit } from './info/InfoBuilder';
import { InfoType, InfoTypeType } from './model/info/enum/InfoType';
import { InfoFormat, InfoFormatType } from './model/info/enum/InfoFormat';
import { Config } from './config/Config';
// import { TextFormat, TextFormatType } from './model/enum/TextFormat';
import { TextGenerator } from './generator/text/TextGenerator';
import { TextParser } from './parser/text/TextParser';

/*
 * NOTE:
 *
 * We want to be able to strip out the NodeJS specific functions from the final bundle.
 * Any code between the comments STRIP:START and STRIP:END will be removed.
 *
 * However, the Typescript compiler will remove comments that it does not believe are associated with code.
 * Therefore we have to use some dummy code to prevent it from removing the STRIP stripping comments.
 */
const STRIP = 0;

/* STRIP:START */
STRIP;

/* eslint-disable arca/import-ordering */
import * as fs from 'fs-extra';
import path from 'path';

import { FileOptions } from './ast/writer/FileWriter';
import { BitmarkFileGenerator } from './generator/bitmark/BitmarkFileGenerator';
import { JsonFileGenerator } from './generator/json/JsonFileGenerator';
import { Breakscape } from './breakscaping/Breakscape';
import { BreakscapedString } from './model/ast/BreakscapedString';
import { BitType, BitTypeType } from './model/enum/BitType';
import { BitTagType } from './model/enum/BitTagType';
import { PropertyFormat } from './model/enum/PropertyFormat';
import { PropertyTagConfig } from './model/config/PropertyTagConfig';
import { BITS } from './config/raw/bits';
import { _BitConfig, _GroupsConfig } from './model/config/_Config';
import { TAGS } from './config/raw/tags';
import { PROPERTIES } from './config/raw/properties';
import { GROUPS } from './config/raw/groups';
import { TextLocation, TextLocationType } from './model/enum/TextLocation';
import { BodyTextFormatType } from './model/enum/BodyTextFormat';
import { TextFormat, TextFormatType } from './model/enum/TextFormat';

/* STRIP:END */
STRIP;

/**
 * Info options for the parser
 */
export interface InfoOptions {
  /**
   * Specify the type of information to return, overriding the default (list)
   * - list: list of supported bits
   * - deprecated: list of deprecated bits
   * - all: list of supported bits and deprecated bits
   * - bit: configuration for a specific bit, or all bits
   */
  type?: InfoTypeType;

  /**
   * Specify the bit type to return, overriding the default (all)
   */
  bit?: string;

  /**
   * Specify the output format, overriding the default (text)
   */
  outputFormat?: InfoFormatType;

  /**
   * Prettify the JSON.
   *
   * If not set or false, JSON will not be prettified.
   * If true, JSON will be prettified with an indent of 2.
   * If a positive integer, JSON will be prettified with an indent of this number.
   *
   * If prettify is set, a string will be returned if possible.
   */
  prettify?: boolean | number;
}

/**
 * Conversion options for bitmark / JSON conversion
 */
export interface ConvertOptions {
  /**
   * The version of bitmark to output.
   * If not specified, the version will be 3.
   *
   * Specifying the version will set defaults for other options.
   * - Bitmark v2:
   *   - bitmarkOptions.cardSetVersion: 1
   *   - jsonOptions.textAsPlainText: true
   * - Bitmark v3:
   *   - bitmarkOptions.cardSetVersion: 2
   *   - jsonOptions.textAsPlainText: false
   *
   */
  bitmarkVersion?: BitmarkVersionType;

  /**
   * Specify the bitmark parser to use, overriding the default
   */
  bitmarkParserType?: BitmarkParserTypeType;

  /**
   * Set to force input to be interpreted as a particular format, overriding the auto-detection
   * Auto-detection can fail or open unwanted files for strings that look like paths
   */
  inputFormat?: InputType;
  /**
   * Specify the output format, overriding the default
   */
  outputFormat?: OutputType;
  /**
   * Specify a file to write the output to
   */
  outputFile?: fs.PathLike;
  /**
   * Options for the output file
   */
  fileOptions?: FileOptions;
  /**
   * Options for bitmark generation
   */
  bitmarkOptions?: BitmarkOptions;
  /**
   * Options for JSON generation
   */
  jsonOptions?: JsonOptions;
}

/**
 * Prettify options for bitmark / JSON prettify / validate
 */
export interface UpgradeOptions {
  /**
   * The version of bitmark to output.
   * If not specified, the version will be 3.
   *
   * Specifying the version will set defaults for other options.
   * - Bitmark v2:
   *   - bitmarkOptions.cardSetVersion: 1
   *   - jsonOptions.textAsPlainText: true
   * - Bitmark v3:
   *   - bitmarkOptions.cardSetVersion: 2
   *   - jsonOptions.textAsPlainText: false
   *
   */
  bitmarkVersion?: BitmarkVersionType;

  /**
   * Specify the bitmark parser to use, overriding the default
   */
  bitmarkParserType?: BitmarkParserTypeType;

  /**
   * Set to force input to be interpreted as a particular format, overriding the auto-detection
   * Auto-detection can fail or open unwanted files for strings that look like paths
   */
  inputFormat?: InputType;

  /**
   * Specify a file to write the output to
   */
  outputFile?: fs.PathLike;

  /**
   * Options for the output file
   */
  fileOptions?: FileOptions;

  /**
   * Options for bitmark generation
   */
  bitmarkOptions?: BitmarkOptions;

  /**
   * Options for JSON generation
   */
  jsonOptions?: JsonOptions;
}

/**
 * Conversion options for bitmark text / JSON conversion
 */
export interface ConvertTextOptions {
  /**
   * Specify the text format (default: bitmark++)
   */
  textFormat?: BodyTextFormatType;

  /**
   * Specify the text location (default: body)
   */
  textLocation?: TextLocationType;

  /**
   * Set to force input to be interpreted as a particular format, overriding the auto-detection
   * Auto-detection can fail or open unwanted files for strings that look like paths
   */
  inputFormat?: InputType;

  /**
   * Specify a file to write the output to
   */
  outputFile?: fs.PathLike;

  /**
   * Options for the output file
   */
  fileOptions?: FileOptions;

  /**
   * Options for JSON generation
   */
  jsonOptions?: TextJsonOptions;
}

/**
 * Create AST options
 */
export interface CreateAstOptions {
  /**
   * Set to force input to be interpreted as a particular format, overriding the auto-detection
   * Auto-detection can fail or open unwanted files for strings that look like paths
   */
  inputFormat?: InputType;
}

/**
 * Breakscape options
 */
export interface BreakscapeOptions {
  /**
   * Set to force input to be interpreted as a particular format, overriding the auto-detection
   * Auto-detection can fail or open unwanted files for strings that look like paths
   */
  inputFormat?: InputType;

  /**
   * Specify a file to write the output to
   */
  outputFile?: fs.PathLike;

  /**
   * Options for the output file
   */
  fileOptions?: FileOptions;

  /**
   * Specify the text format (default:  bitmark++)
   */
  textFormat?: BodyTextFormatType;

  /**
   * Specify the text location (default: body)
   */
  textLocation?: TextLocationType;
}

/**
 * Unbreakscape options
 */
export interface UnbreakscapeOptions {
  /**
   * Set to force input to be interpreted as a particular format, overriding the auto-detection
   * Auto-detection can fail or open unwanted files for strings that look like paths
   */
  inputFormat?: InputType;

  /**
   * Specify a file to write the output to
   */
  outputFile?: fs.PathLike;

  /**
   * Options for the output file
   */
  fileOptions?: FileOptions;

  /**
   * Specify the text format (default: bitmark++)
   */
  textFormat?: BodyTextFormatType;

  /**
   * Specify the text location (default: body)
   */
  textLocation?: TextLocationType;
}

/**
 * Input type enumeration
 */
const Input = superenum({
  /**
   * Input is as a string
   */
  string: 'string',

  /**
   * Input is as a file path
   */
  file: 'file',
});

export type InputType = EnumType<typeof Input>;

/**
 * Output type enumeration
 */
const Output = superenum({
  /**
   * Output bitmark string
   */
  bitmark: 'bitmark',

  /**
   * Output JSON as a plain JS object, or a file
   */
  json: 'json',

  /**
   * Output AST as a plain JS object, or a file
   */
  ast: 'ast',
});

export type OutputType = EnumType<typeof Output>;

/**
 * Options for bitmark text JSON generation
 */
export interface TextJsonOptions {
  /**
   * Prettify the JSON.
   *
   * If not set or false, JSON will not be prettified.
   * If true, JSON will be prettified with an indent of 2.
   * If a positive integer, JSON will be prettified with an indent of this number.
   *
   * If prettify is set, a string will be returned if possible.
   */
  prettify?: boolean | number;

  /**
   * Stringify the JSON.
   *
   * If not set or false, JSON will be returned as a plain JS object.
   * It true, JSON will be stringified.
   *
   * If prettify is set, it will override this setting.
   */
  stringify?: boolean;

  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

/**
 * Bitmark tool for manipulating bitmark in all its formats.
 *
 */
class BitmarkParserGenerator {
  protected ast = new Ast();
  protected jsonParser = new JsonParser();
  protected bitmarkParser = new BitmarkParser();
  protected textParser = new TextParser();
  protected textGenerator = new TextGenerator();

  /**
   * Get the version of the bitmark-parser-generator library
   */
  public version(): string {
    return env.appVersion.full;
  }

  /**
   * Get information about the bitmark-parser-generator library
   */
  public async info(options?: InfoOptions): Promise<unknown> {
    const opts: InfoOptions = Object.assign({}, options);
    const builder = new InfoBuilder();
    let res: unknown;
    const outputString = !opts.outputFormat || opts.outputFormat === InfoFormat.text;
    const outputJson = opts.outputFormat === InfoFormat.json;
    const all = opts.type === InfoType.all;
    const deprecated = opts.type === InfoType.deprecated;
    const includeNonDeprecated = all || !deprecated;
    const includeDeprecated = all || deprecated;

    if (opts.type === InfoType.bit) {
      const bitConfigs = builder.getSupportedBitConfigs().filter((b) => {
        if (!opts.bit) return true;
        const bitType = Config.getBitType(opts.bit);
        return bitType === b.bitType;
      });
      if (outputString) {
        res = bitConfigs
          .map((b) =>
            b.toString({
              includeChains: true,
              includeConfigs: true,
            }),
          )
          .join('\n\n--------------\n\n');
      } else {
        res = bitConfigs;
      }
    } else {
      // List / List Deprecated
      const supportedBits = builder
        .getSupportedBits({
          includeNonDeprecated,
          includeDeprecated,
        })
        .filter((b) => {
          if (!opts.bit) return true;
          const bitType = Config.getBitType(opts.bit);
          if (b.name === bitType) return true;
        });
      if (outputString) {
        res = this.supportedBitsAsString(supportedBits);
      } else {
        res = supportedBits;
      }
    }

    if (outputJson) {
      const prettifySpace = opts.prettify === true ? 2 : opts.prettify || undefined;
      res = JSON.stringify(res, null, prettifySpace);
    }

    return res;
  }

  /**
   * Generate the new configuration for the bitmark parser.
   */
  public async generateConfig(_options?: InfoOptions): Promise<unknown> {
    // const opts: InfoOptions = Object.assign({}, options);
    // const builder = new InfoBuilder();
    // let res: unknown;
    // const outputString = !opts.outputFormat || opts.outputFormat === InfoFormat.text;
    // const outputJson = opts.outputFormat === InfoFormat.json;
    // const all = opts.type === InfoType.all;
    // const deprecated = opts.type === InfoType.deprecated;
    // const includeNonDeprecated = all || !deprecated;
    // const includeDeprecated = all || deprecated;

    const bitConfigs: (_BitConfig & { bitType: BitTypeType })[] = [];
    const groupConfigs: (_GroupsConfig & { key: string })[] = [];

    for (const bt of BitType.values()) {
      const bitType = Config.getBitType(bt);

      const _bitConfig: _BitConfig & { bitType: BitTypeType } = BITS[bitType] as _BitConfig & { bitType: BitTypeType };
      if (_bitConfig) {
        _bitConfig.bitType = bitType;
        bitConfigs.push(_bitConfig);
      }

      // const config: BitConfig = Config.getBitConfig(bitType);
      // bitConfigs.push(config);
    }

    for (const [k, g] of Object.entries(GROUPS)) {
      const g2 = g as unknown as _GroupsConfig & { key: string };
      let k2 = k as string;
      if (k.startsWith('group_')) k2 = k2.substring(6);
      k2 = '_' + k2;
      g2.key = k2;
      groupConfigs.push(g2);
    }

    const outputFolder = 'tmp';
    const outputFolderBits = path.join(outputFolder, 'bits');
    const outputFolderGroups = path.join(outputFolder, 'groups');
    fs.ensureDirSync(outputFolderBits);
    fs.ensureDirSync(outputFolderGroups);

    const fileWrites: Promise<void>[] = [];

    // BitConfigs
    for (const b of bitConfigs) {
      const inherits = [];
      const tags = [];

      const tagEntriesTypeOrder = [BitTagType.tag, BitTagType.property, BitTagType.resource, BitTagType.group];
      const tagEntries = Object.entries(b.tags ?? []).sort((a, b) => {
        const tagA = a[1];
        const tagB = b[1];
        const typeOrder = tagEntriesTypeOrder.indexOf(tagA.type) - tagEntriesTypeOrder.indexOf(tagB.type);
        return typeOrder;
      });

      if (b.baseBitType) inherits.push(b.baseBitType);

      for (const [tagKey, tag] of tagEntries) {
        let tagName = tagKey;
        let tagKeyPrefix = '';
        let format = '';
        let description = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let chain: any = undefined;

        if (tag.type === BitTagType.tag) {
          const resolvedTag = TAGS[tag.configKey];
          tagName = resolvedTag.tag;

          if (tagName === '%') {
            description = 'Item';
            chain = {
              key: '%',
              format,
              min: tag.minCount,
              max: tag.maxCount,
              description: 'Lead',
              chain: {
                key: '%',
                format,
                min: tag.minCount,
                max: tag.maxCount,
                description: 'Page number',
                chain: {
                  key: '%',
                  format,
                  min: tag.minCount,
                  max: tag.maxCount,
                  description: 'Margin number',
                },
              },
            };
          } else if (tagName === '!') {
            description = 'Instruction';
          } else if (tagName === '?') {
            description = 'Hint';
          } else if (tagName === '#') {
            description = 'Title';
          } else if (tagName === '##') {
            description = 'Sub-title';
          } else if (tagName === '▼') {
            description = 'Anchor';
          } else if (tagName === '►') {
            description = 'Reference';
          } else if (tagName === '$') {
            description = 'Sample solution';
          } else if (tagName === '&') {
            description = 'Resource';
          } else if (tagName === '+') {
            description = 'True statement';
          } else if (tagName === '-') {
            description = 'False statement';
          } else if (tagName === '_') {
            description = 'Gap';
          } else if (tagName === '=') {
            description = 'Mark';
          }

          format = 'bitmark--';
        } else if (tag.type === BitTagType.property) {
          const resolvedProperty = PROPERTIES[tag.configKey];
          tagName = resolvedProperty.tag;

          tagKeyPrefix = '@';

          const property = resolvedProperty as PropertyTagConfig;

          // format
          if (property.format === PropertyFormat.plainText) {
            format = 'string';
          } else if (property.format === PropertyFormat.boolean) {
            format = 'bool';
          } else if (property.format === PropertyFormat.bitmarkText) {
            format = 'bitmark';
          } else if (property.format === PropertyFormat.number) {
            format = 'number';
          }
        } else if (tag.type === BitTagType.resource) {
          tagKeyPrefix = '&';
        } else if (tag.type === BitTagType.group) {
          tagKeyPrefix = '@';
          let k = tag.configKey as string;
          if (k.startsWith('group_')) k = k.substring(6);
          k = '_' + k;
          inherits.push(k);
          continue;
        }

        const t = {
          key: tagKeyPrefix + tagName,
          format,
          default: null,
          alwaysInclude: false,
          min: tag.minCount == null ? 0 : tag.minCount,
          max: tag.maxCount == null ? 1 : tag.maxCount,
          description,
          chain,
          // raw: {
          //   ...tag,
          // },
        };
        tags.push(t);
      }

      const bitJson = {
        name: b.bitType,
        description: '',
        since: b.since,
        deprecated: b.deprecated,
        history: [
          {
            version: b.since,
            changes: ['Initial version'],
          },
        ],
        format: b.textFormatDefault ?? 'bitmark--',
        bodyAllowed: b.bodyAllowed ?? true,
        bodyRequired: b.bodyRequired ?? false,
        footerAllowed: b.footerAllowed ?? true,
        footerRequired: b.footerRequired ?? false,
        resourceAttachmentAllowed: b.resourceAttachmentAllowed ?? true,
        inherits,
        tags,
      };

      const output = path.join(outputFolderBits, `${b.bitType}.jsonc`);
      const str = JSON.stringify(bitJson, null, 2);
      fileWrites.push(fs.writeFile(output, str));

      // const bitType = b.bitType;
      // const bitType2 = Config.getBitType(bitType);
      // if (bitType !== bitType2) {
      //   console.log(`BitType: ${bitType} => ${bitType2}`);
      // }
    }

    // GroupConfigs
    const writeGroupConfigs = (groupConfigs: (_GroupsConfig & { key: string })[]) => {
      for (const g of groupConfigs) {
        const inherits = [];
        const tags = [];

        // if (g.key == '_resourceImage') debugger;

        const tagEntriesTypeOrder = [BitTagType.tag, BitTagType.property, BitTagType.resource, BitTagType.group];
        const tagEntries = Object.entries(g.tags ?? []).sort((a, b) => {
          const tagA = a[1];
          const tagB = b[1];
          const typeOrder = tagEntriesTypeOrder.indexOf(tagA.type) - tagEntriesTypeOrder.indexOf(tagB.type);
          return typeOrder;
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_tagKey, tag] of tagEntries) {
          let tagName = tag.configKey as string;
          let tagKeyPrefix = '';
          let format = '';
          let description = '';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let chain: any = undefined;

          if (tag.type === BitTagType.tag) {
            const resolvedTag = TAGS[tag.configKey];
            tagName = resolvedTag.tag;

            if (tagName === '%') {
              description = 'Item';
              chain = {
                key: '%',
                format,
                min: tag.minCount,
                max: tag.maxCount,
                description: 'Lead',
                chain: {
                  key: '%',
                  format,
                  min: tag.minCount,
                  max: tag.maxCount,
                  description: 'Page number',
                  chain: {
                    key: '%',
                    format,
                    min: tag.minCount,
                    max: tag.maxCount,
                    description: 'Margin number',
                  },
                },
              };
            } else if (tagName === '!') {
              description = 'Instruction';
            } else if (tagName === '?') {
              description = 'Hint';
            } else if (tagName === '#') {
              description = 'Title';
            } else if (tagName === '##') {
              description = 'Sub-title';
            } else if (tagName === '▼') {
              description = 'Anchor';
            } else if (tagName === '►') {
              description = 'Reference';
            } else if (tagName === '$') {
              description = 'Sample solution';
            } else if (tagName === '&') {
              description = 'Resource';
            } else if (tagName === '+') {
              description = 'True statement';
            } else if (tagName === '-') {
              description = 'False statement';
            } else if (tagName === '_') {
              description = 'Gap';
            } else if (tagName === '=') {
              description = 'Mark';
            }

            format = 'bitmark--';
          } else if (tag.type === BitTagType.property) {
            const resolvedProperty = PROPERTIES[tag.configKey];
            tagName = resolvedProperty.tag;

            tagKeyPrefix = '@';

            const property = resolvedProperty as PropertyTagConfig;

            // format
            if (property.format === PropertyFormat.plainText) {
              format = 'string';
            } else if (property.format === PropertyFormat.boolean) {
              format = 'bool';
            } else if (property.format === PropertyFormat.bitmarkText) {
              format = 'bitmark';
            } else if (property.format === PropertyFormat.number) {
              format = 'number';
            }
          } else if (tag.type === BitTagType.resource) {
            tagKeyPrefix = '&';
            format = 'string';
          } else if (tag.type === BitTagType.group) {
            tagKeyPrefix = '@';
            let k = tag.configKey as string;
            if (k.startsWith('group_')) k = k.substring(6);
            k = '_' + k;
            inherits.push(k);
            continue;
          }

          const t = {
            key: tagKeyPrefix + tagName,
            format,
            default: null,
            alwaysInclude: false,
            min: tag.minCount == null ? 0 : tag.minCount,
            max: tag.maxCount == null ? 1 : tag.maxCount,
            description,
            chain,
            // raw: {
            //   ...tag,
            // },
          };
          tags.push(t);
        }

        const bitJson = {
          name: g.key,
          description: '',
          since: 'UNKNOWN',
          deprecated: g.deprecated,
          history: [
            {
              version: 'UNKNOWN',
              changes: ['Initial version'],
            },
          ],
          inherits,
          tags,
          // cards: [
          //   {
          //     card: null,
          //     side: 1,
          //     variant: null,
          //     description: '',
          //     tags: [],
          //   },
          //   {
          //     card: null,
          //     side: 2,
          //     variant: 1,
          //     description: '',
          //     tags: [],
          //   },
          //   {
          //     card: null,
          //     side: 2,
          //     variant: null,
          //     description: '',
          //     tags: [],
          //   },
          // ],
        };

        const output = path.join(outputFolderGroups, `${g.key}.jsonc`);
        const str = JSON.stringify(bitJson, null, 2);
        fileWrites.push(fs.writeFile(output, str));

        // const bitType = b.bitType;
        // const bitType2 = Config.getBitType(bitType);
        // if (bitType !== bitType2) {
        //   console.log(`BitType: ${bitType} => ${bitType2}`);
        // }
      }
    };
    writeGroupConfigs(groupConfigs);

    await Promise.all(fileWrites);

    return void 0;
  }

  /**
   * Convert bitmark from bitmark to JSON, or JSON to bitmark.
   *
   * Input type is detected automatically and may be:
   * - string: bitmark, JSON, or AST
   * - object: JSON or AST
   * - file: bitmark, JSON, or AST
   *
   * Output type is selected automatically based on input type detection:
   * - input(JSON/AST) ==> output(bitmark)
   * - input(bitmark)  ==> output(JSON)
   *
   * By default, the result is returned as a string for bitmark, or a plain JS object for JSON/AST.
   *
   * The options can be used to write the output to a file and to set conversion options or override defaults.
   *
   * If both the input and output formats are the same, the input will be validated and rewritten.
   * This feature be used to upgrade bitmark or JSON to the latest version.
   *
   * @param input - bitmark or JSON or AST as a string, JSON or AST as plain JS object, or path to a file containing
   * bitmark, JSON, or AST.
   * @param options - the conversion options
   * @returns Promise that resolves to string if converting to bitmark, a plain JS object if converting to JSON, or
   * void if writing to a file
   * @throws Error if any error occurs
   */
  public async convert(
    input: string | fs.PathLike | unknown,
    options?: ConvertOptions,
  ): Promise<string | unknown | void> {
    let res: string | unknown | void;
    const opts: ConvertOptions = Object.assign({}, options);
    // const fileOptions = Object.assign({}, opts.fileOptions);
    // const bitmarkOptions = Object.assign({}, opts.bitmarkOptions);
    const jsonOptions = Object.assign({}, opts.jsonOptions);

    const outputFormat = opts.outputFormat;
    const outputBitmark = outputFormat === Output.bitmark;
    const outputJson = outputFormat === Output.json;
    const outputAst = outputFormat === Output.ast;
    const bitmarkParserType = BitmarkParserType.peggy; // Option is no longer used as only Peggy parser supported

    let inStr: string = input as string;

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          });
        }
      }
    }

    // Preprocess as AST to see if AST
    let ast = this.ast.preprocessAst(inStr);
    const isAst = !!ast;

    if (!isAst) {
      // Not AST, so process as JSON to see if we have JSON
      ast = this.jsonParser.toAst(inStr);
    }
    const isJson = !!ast?.bits;
    const isBitmark = !isJson && !isAst; // Assume bitmark since not AST or JSON

    // Helper conversion functions
    const bitmarkToBitmark = async (bitmarkStr: string) => {
      // Validate and prettify
      await bitmarkToAst(bitmarkStr);
      await astToBitmark(res as BitmarkAst);
    };

    const bitmarkToAst = async (bitmarkStr: string) => {
      res = this.bitmarkParser.toAst(bitmarkStr, {
        parserType: bitmarkParserType,
      });
    };

    const bitmarkToJson = async (bitmarkStr: string) => {
      if (bitmarkParserType === BitmarkParserType.peggy) {
        // Convert the bitmark to JSON using the peggy parser (aways true, only peggy parser supported)

        // Generate AST from the Bitmark markup
        ast = this.bitmarkParser.toAst(bitmarkStr, {
          parserType: bitmarkParserType,
        });

        // Convert the AST to JSON
        if (opts.outputFile) {
          // Write JSON file
          const generator = new JsonFileGenerator(opts.outputFile, opts);
          await generator.generate(ast);
        } else {
          // Generate JSON object
          const generator = new JsonObjectGenerator(opts);
          const json = await generator.generate(ast);

          // Return JSON as object or string depending on prettify/stringify option
          res = this.jsonStringifyPrettify(json, jsonOptions);
        }
      }
    };

    const astToBitmark = async (astJson: BitmarkAst) => {
      // Convert the AST to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, opts);
        await generator.generate(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(opts);
        res = await generator.generate(astJson);
      }
    };

    const astToAst = async (astJson: BitmarkAst) => {
      // Return JSON as object or string depending on prettify/stringify option
      res = this.jsonStringifyPrettify(astJson, jsonOptions);
    };

    const astToJson = async (astJson: BitmarkAst) => {
      // Convert the AST to JSON
      if (opts.outputFile) {
        // Write JSON file
        const generator = new JsonFileGenerator(opts.outputFile, opts);
        await generator.generate(astJson);
      } else {
        // Generate JSON object
        const generator = new JsonObjectGenerator(opts);
        const json = await generator.generate(astJson);

        // Return JSON as object or string depending on prettify/stringify option
        res = this.jsonStringifyPrettify(json, jsonOptions);
      }
    };

    const jsonToBitmark = async (astJson: BitmarkAst) => {
      // We already have the ast from detecting the input type, so use the AST we already have

      // Convert the JSON to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, opts);
        await generator.generate(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(opts);
        res = await generator.generate(astJson);
      }
    };

    const jsonToAst = async (astJson: BitmarkAst) => {
      // We already have the ast from detecting the input type, so just return the AST we already have

      // Return JSON as object or string depending on prettify/stringify option
      res = this.jsonStringifyPrettify(astJson, jsonOptions);
    };

    const jsonToJson = async (astJson: BitmarkAst) => {
      // Validate and prettify
      await astToJson(astJson);
    };

    // Convert
    if (isBitmark) {
      // Input was Bitmark
      if (outputBitmark) {
        // Bitmark ==> Bitmark
        await bitmarkToBitmark(inStr);
      } else if (outputAst) {
        // Bitmark ==> AST
        await bitmarkToAst(inStr);
      } else {
        // Bitmark ==> JSON
        await bitmarkToJson(inStr);
      }
    } else if (isAst) {
      // Input was AST
      ast = ast as BitmarkAst;
      if (outputAst) {
        // AST ==> AST
        await astToAst(ast);
      } else if (outputJson) {
        // AST ==> JSON
        await astToJson(ast);
      } else {
        // AST ==> Bitmark
        await astToBitmark(ast);
      }
    } else {
      // Input was JSON
      ast = ast as BitmarkAst;
      if (outputJson) {
        // JSON ==> JSON
        await jsonToJson(ast);
      } else if (outputAst) {
        // JSON ==> AST
        await jsonToAst(ast);
      } else {
        // JSON ==> Bitmark
        await jsonToBitmark(ast);
      }
    }

    return res;
  }

  /**
   * Upgrade bitmark or JSON, upgrading to the latest supported syntax, removing unrecognised data in the process.
   *
   * THIS FEATURE SHOULD BE USED WITH CAUTION. IT WILL POTENTIALLY DELETE DATA.
   *
   * Input type is detected automatically and may be:
   * - string: bitmark, JSON
   * - object: JSON
   * - file: bitmark, JSON
   *
   * Output type is the same as the detected input type
   *
   * By default, the result is returned as a string for bitmark, or a plain JS object for JSON.
   *
   * The options can be used to write the output to a file and to set conversion options or override defaults.
   *
   * If both the input and output formats are the same, the input will be validated and rewritten.
   *
   * @param input - bitmark or JSON or AST as a string, JSON or AST as plain JS object, or path to a file containing
   * bitmark, JSON, or AST.
   * @param options - the conversion options
   * @returns Promise that resolves to string if upgrading to bitmark, a plain JS object if converting to JSON, or
   * void if writing to a file
   * @throws Error if any error occurs
   */
  public async upgrade(
    input: string | fs.PathLike | unknown,
    options?: UpgradeOptions,
  ): Promise<string | unknown | void> {
    let res: string | unknown | void;
    const opts: UpgradeOptions = Object.assign({}, options);
    // const fileOptions = Object.assign({}, opts.fileOptions);
    // const bitmarkOptions = Object.assign({}, opts.bitmarkOptions);
    const jsonOptions = Object.assign({}, opts.jsonOptions);

    const bitmarkParserType = opts.bitmarkParserType;

    let inStr: string = input as string;

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          });
        }
      }
    }

    // Process as JSON to see if we have JSON
    let ast = this.jsonParser.toAst(inStr);

    const isJson = !!ast?.bits;
    const isBitmark = !isJson; // Assume bitmark since not JSON

    // Helper conversion functions
    const bitmarkToBitmark = async (bitmarkStr: string) => {
      // Validate and upgrade
      const astJson = this.bitmarkParser.toAst(bitmarkStr, {
        parserType: bitmarkParserType,
      });

      // Convert the AST to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, opts);
        await generator.generate(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(opts);
        res = await generator.generate(astJson);
      }
    };

    const jsonToJson = async (astJson: BitmarkAst) => {
      // Validate and upgrade

      // Convert the AST to JSON
      if (opts.outputFile) {
        // Write JSON file
        const generator = new JsonFileGenerator(opts.outputFile, opts);
        await generator.generate(astJson);
      } else {
        // Generate JSON object
        const generator = new JsonObjectGenerator(opts);
        const json = await generator.generate(astJson);

        // Return JSON as object or string depending on prettify/stringify option
        res = this.jsonStringifyPrettify(json, jsonOptions);
      }
    };

    // Validate and Upgrade
    if (isBitmark) {
      // Bitmark ==> Bitmark
      await bitmarkToBitmark(inStr);
    } else {
      // JSON ==> JSON
      ast = ast as BitmarkAst;
      await jsonToJson(ast);
    }

    return res;
  }

  /**
   * Create a bitmark AST (Abstract Syntax Tree) from bitmark or JSON or AST
   *
   * Input type is detected automatically and may be string, object (JSON or AST), or file
   *
   * @param input the JSON or bitmark to convert to a bitmark AST
   * @param options - the create AST options
   * @returns bitmark AST
   * @throws Error if any error occurs
   */
  public createAst(input: unknown, options?: CreateAstOptions): BitmarkAst {
    let res: BitmarkAst;
    let inStr: string = input as string;
    const opts: CreateAstOptions = Object.assign({}, options);

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          });
        }
      }
    }

    // Preprocess as AST to see if AST
    let ast = this.ast.preprocessAst(inStr);
    const isAst = !!ast;

    if (!isAst) {
      // Not AST, so process as JSON to see if we have JSON
      ast = this.jsonParser.toAst(inStr);
    }
    const isJson = !!ast?.bits;
    const isBitmark = !isJson && !isAst; // Assume bitmark since not AST or JSON

    if (isBitmark) {
      // Bitmark ==> AST
      res = this.bitmarkParser.toAst(inStr);
    } else {
      // JSON / AST ==> AST
      res = ast as BitmarkAst;
    }

    return res;
  }

  /**
   * Convert bitmark text from JSON, or JSON to bitmark text.
   *
   * Input type is detected automatically and may be:
   * - string: bitmark text or JSON
   * - object: JSON
   * - file: bitmark text or JSON
   *
   * Output type is selected automatically based on input type detection:
   * - input(JSON) ==> output(bitmark text)
   * - input(bitmark text)  ==> output(JSON)
   *
   * By default, the result is returned as a string for bitmark text, or a plain JS object for JSON.
   *
   * The options can be used to write the output to a file and to set conversion options or override defaults.
   *
   * @param input - bitmark text or JSON as a string, JSON as plain JS object, or path to a file containing
   * bitmark text or JSON.
   * @param options - the conversion options
   * @returns Promise that resolves to string if converting to bitmark text, a plain JS object if converting to JSON, or
   * void if writing to a file
   * @throws Error if any error occurs
   */
  public async convertText(
    input: string | fs.PathLike | unknown,
    options?: ConvertTextOptions,
  ): Promise<string | unknown | void> {
    let res: string | unknown | void;
    let preRes: string | unknown | void;
    const opts: ConvertTextOptions = Object.assign({}, options);
    const fileOptions = Object.assign({}, opts.fileOptions);
    const jsonOptions = Object.assign({}, opts.jsonOptions);
    const textFormat: TextFormatType = TextFormat.fromValue(opts.textFormat) ?? TextFormat.bitmarkText;
    const textLocation = opts.textLocation ?? TextLocation.body;

    let inStr: string = input as string;

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          });
        }
      }
    }

    // Preprocess as text AST to see if text AST
    const ast = this.textParser.preprocessAst(inStr);
    const isAst = !!ast;

    if (!isAst) {
      preRes = this.textParser.toAst(inStr, {
        format: textFormat,
        location: TextLocation.body,
      });
    } else {
      preRes = await this.textGenerator.generate(ast, textFormat, textLocation);
    }

    if (opts.outputFile) {
      const output = opts.outputFile.toString();
      let strRes: string = preRes as string;
      if (!isAst) {
        strRes = this.jsonStringifyPrettify(preRes, jsonOptions, true) as string;
      }

      // Write JSON to file
      const flag = fileOptions.append ? 'a' : 'w';
      fs.ensureDirSync(path.dirname(output));
      fs.writeFileSync(output, strRes, {
        flag,
      });
    } else {
      if (!isAst) {
        res = this.jsonStringifyPrettify(preRes, jsonOptions) as string;
      } else {
        res = preRes;
      }
    }

    return res;
  }

  /**
   * Breakscape bitmark text.
   *
   * Input type is detected automatically and may be:
   * - string: text
   * - file: path to a file containing text
   *
   * By default, the result is returned as a string.
   * By default, the text is breakscaped as if it was bitmark text in the body.
   * Use the options to change this behaviour.
   *
   * The options can be used to write the output to a file.
   *
   * @param input - text, or path to a file containing text.
   * @param options - the conversion options
   * @returns breakscaped string, or void if writing to a file
   * @throws Error if any error occurs
   */
  public breakscapeText(input: string, options?: BreakscapeOptions): string | void {
    if (!input) return input;

    const opts: BreakscapeOptions = Object.assign({}, options);
    const fileOptions = Object.assign({}, opts.fileOptions);
    const textFormat: TextFormatType = TextFormat.fromValue(opts.textFormat) ?? TextFormat.bitmarkText;
    const textLocation = opts.textLocation ?? TextLocation.body;

    let inStr: string = input as string;

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          });
        }
      }
    }

    // Do the breakscape
    const res = Breakscape.breakscape(inStr, {
      format: textFormat,
      location: textLocation,
    });

    if (opts.outputFile) {
      const output = opts.outputFile.toString();

      // Write JSON to file
      const flag = fileOptions.append ? 'a' : 'w';
      fs.ensureDirSync(path.dirname(output));
      fs.writeFileSync(output, res, {
        flag,
      });
    } else {
      return res;
    }
  }

  /**
   * Unescape (unbreakscape) bitmark text
   *
   * Input type is detected automatically and may be:
   * - string: text
   * - file: path to a file containing text
   *
   * By default, the result is returned as a string.
   * By default, the text is unbreakscaped as if it was bitmark text in the body.
   * Use the options to change this behaviour.
   *
   * The options can be used to write the output to a file.
   *
   * @param input - text, or path to a file containing text.
   * @param options - the conversion options
   * @returns unbreakscaped string, or void if writing to a file
   * @throws Error if any error occurs
   */
  public unbreakscapeText(input: string, options?: UnbreakscapeOptions): string | void {
    if (!input) return input;

    const opts: UnbreakscapeOptions = Object.assign({}, options);
    const fileOptions = Object.assign({}, opts.fileOptions);
    const textFormat: TextFormatType = TextFormat.fromValue(opts.textFormat) ?? TextFormat.bitmarkText;
    const textLocation = opts.textLocation ?? TextLocation.body;

    let inStr: BreakscapedString = input as BreakscapedString;

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          }) as BreakscapedString;
        }
      }
    }

    // Do the unbreakscape
    const res = Breakscape.unbreakscape(inStr, {
      format: textFormat,
      location: textLocation,
    });

    if (opts.outputFile) {
      const output = opts.outputFile.toString();

      // Write JSON to file
      const flag = fileOptions.append ? 'a' : 'w';
      fs.ensureDirSync(path.dirname(output));
      fs.writeFileSync(output, res, {
        flag,
      });
    } else {
      return res;
    }

    return;
  }

  /**
   * Stringify / prettify a plain JS object to a JSON string, depending on the JSON options
   *
   * @param json
   * @param options
   * @param forceStringify
   * @returns
   */
  private jsonStringifyPrettify = (json: unknown, options: JsonOptions, forceStringify?: boolean): unknown => {
    const prettifySpace = options.prettify === true ? 2 : options.prettify || undefined;
    const stringify = forceStringify || options.stringify === true || prettifySpace !== undefined;

    if (stringify) {
      return JSON.stringify(json, null, prettifySpace);
    }
    return json;
  };

  /**
   * Get the supported bits as a formatted strings
   *
   * @param supportedBits
   * @returns
   */
  private supportedBitsAsString(supportedBits: SupportedBit[]): string {
    let res = '';

    for (const rootBit of supportedBits) {
      res += `${rootBit.name} (since: ${rootBit.since}`;
      if (rootBit.deprecated) res += `, deprecated: ${rootBit.deprecated}`;
      res += ')\n';
    }

    return res;
  }
}

export { BitmarkParserGenerator, Input, Output };
