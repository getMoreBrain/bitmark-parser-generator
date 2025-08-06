import { type EnumType, superenum } from '@ncoderz/superenum';

import { Ast } from './ast/Ast.ts';
import { Config } from './config/Config.ts';
import { type BitmarkOptions } from './generator/bitmark/BitmarkGenerator.ts';
import { BitmarkStringGenerator } from './generator/bitmark/BitmarkStringGenerator.ts';
import { type JsonOptions } from './generator/json/JsonGenerator.ts';
import { JsonObjectGenerator } from './generator/json/JsonObjectGenerator.ts';
// import { TextFormat, TextFormatType } from './model/enum/TextFormat.ts';
import { TextGenerator } from './generator/text/TextGenerator.ts';
import { InfoBuilder, type SupportedBit } from './info/InfoBuilder.ts';
import { type BitmarkAst } from './model/ast/Nodes.ts';
import { BitmarkParserType, type BitmarkParserTypeType } from './model/enum/BitmarkParserType.ts';
import { type BitmarkVersionType } from './model/enum/BitmarkVersion.ts';
import { InfoFormat, type InfoFormatType } from './model/info/enum/InfoFormat.ts';
import { InfoType, type InfoTypeType } from './model/info/enum/InfoType.ts';
import { BitmarkParser } from './parser/bitmark/BitmarkParser.ts';
import { JsonParser } from './parser/json/JsonParser.ts';
import { TextParser } from './parser/text/TextParser.ts';
import { env } from './utils/env/Env.ts';

/*
 * NOTE:
 *
 * We want to be able to strip out the NodeJS specific functions from the final bundle.
 * Any code between the comments STRIP:START and STRIP:END will be removed.
 *
 * However, the prettifier will move comments that it does not believe are associated with code.
 *
 * Therefore we have to use some dummy code to prevent it from removing the STRIP stripping comments.
 */
const STRIP = 0;

/* STRIP:START */
STRIP; // eslint-disable-line @typescript-eslint/no-unused-expressions

import path from 'node:path';

import fs from 'fs-extra';

import { type FileOptions } from './ast/writer/FileWriter.ts';
import { Breakscape } from './breakscaping/Breakscape.ts';
import { BitmarkFileGenerator } from './generator/bitmark/BitmarkFileGenerator.ts';
import { JsonFileGenerator } from './generator/json/JsonFileGenerator.ts';
import { ConfigBuilder } from './info/ConfigBuilder.ts';
import { type BreakscapedString } from './model/ast/BreakscapedString.ts';
import type { _BitConfig, _GroupsConfig } from './model/config/_Config.ts';
import { type BodyTextFormatType } from './model/enum/BodyTextFormat.ts';
import { TextFormat, type TextFormatType } from './model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from './model/enum/TextLocation.ts';

/* STRIP:END */
STRIP; // eslint-disable-line @typescript-eslint/no-unused-expressions

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
 * Config generation options for the parser
 */
export interface GenerateConfigOptions {
  //
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
  outputFile?: string;
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
  outputFile?: string;

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
  outputFile?: string;

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
  outputFile?: string;

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
  outputFile?: string;

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
  public info(options?: InfoOptions): unknown {
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
  public generateConfig(options?: GenerateConfigOptions): void {
    const opts: GenerateConfigOptions = Object.assign({}, options);
    const builder = new ConfigBuilder();
    // let res: unknown;
    // const outputString = !opts.outputFormat || opts.outputFormat === InfoFormat.text;
    // const outputJson = opts.outputFormat === InfoFormat.json;
    // const all = opts.type === InfoType.all;
    // const deprecated = opts.type === InfoType.deprecated;
    // const includeNonDeprecated = all || !deprecated;
    // const includeDeprecated = all || deprecated;

    builder.build(opts);
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
   * @returns A string if converting to bitmark, a plain JS object if converting to JSON, or
   * void if writing to a file
   * @throws Error if any error occurs
   */
  public convert(input: string | unknown, options?: ConvertOptions): string | unknown | void {
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
    const inputIsString = typeof input === 'string';

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (inputIsString && fs.existsSync(inStr)) {
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
    const isBitmark = inputIsString && !isJson && !isAst; // Assume bitmark since not AST or JSON

    // Helper conversion functions
    const bitmarkToBitmark = (bitmarkStr: string) => {
      // Validate and prettify
      bitmarkToAst(bitmarkStr);
      astToBitmark(res as BitmarkAst);
    };

    const bitmarkToAst = (bitmarkStr: string) => {
      res = this.bitmarkParser.toAst(bitmarkStr, {
        parserType: bitmarkParserType,
      });
    };

    const bitmarkToJson = (bitmarkStr: string) => {
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
          generator.generateSync(ast);
        } else {
          // Generate JSON object
          const generator = new JsonObjectGenerator(opts);
          const json = generator.generateSync(ast);

          // Return JSON as object or string depending on prettify/stringify option
          res = this.jsonStringifyPrettify(json, jsonOptions);
        }
      }
    };

    const astToBitmark = (astJson: BitmarkAst) => {
      // Convert the AST to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, opts);
        generator.generateSync(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(opts);
        res = generator.generateSync(astJson);
      }
    };

    const astToAst = (astJson: BitmarkAst) => {
      // Return JSON as object or string depending on prettify/stringify option
      res = this.jsonStringifyPrettify(astJson, jsonOptions);
    };

    const astToJson = (astJson: BitmarkAst) => {
      // Convert the AST to JSON
      if (opts.outputFile) {
        // Write JSON file
        const generator = new JsonFileGenerator(opts.outputFile, opts);
        generator.generateSync(astJson);
      } else {
        // Generate JSON object
        const generator = new JsonObjectGenerator(opts);
        const json = generator.generateSync(astJson);

        // Return JSON as object or string depending on prettify/stringify option
        res = this.jsonStringifyPrettify(json, jsonOptions);
      }
    };

    const jsonToBitmark = (astJson: BitmarkAst) => {
      // We already have the ast from detecting the input type, so use the AST we already have

      // Convert the JSON to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, opts);
        generator.generateSync(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(opts);
        res = generator.generateSync(astJson);
      }
    };

    const jsonToAst = (astJson: BitmarkAst) => {
      // We already have the ast from detecting the input type, so just return the AST we already have

      // Return JSON as object or string depending on prettify/stringify option
      res = this.jsonStringifyPrettify(astJson, jsonOptions);
    };

    const jsonToJson = (astJson: BitmarkAst) => {
      // Validate and prettify
      astToJson(astJson);
    };

    // Convert
    if (isBitmark) {
      // Input was Bitmark
      if (outputBitmark) {
        // Bitmark ==> Bitmark
        bitmarkToBitmark(inStr);
      } else if (outputAst) {
        // Bitmark ==> AST
        bitmarkToAst(inStr);
      } else {
        // Bitmark ==> JSON
        bitmarkToJson(inStr);
      }
    } else if (isAst) {
      // Input was AST
      ast = ast as BitmarkAst;
      if (outputAst) {
        // AST ==> AST
        astToAst(ast);
      } else if (outputJson) {
        // AST ==> JSON
        astToJson(ast);
      } else {
        // AST ==> Bitmark
        astToBitmark(ast);
      }
    } else if (isJson) {
      // Input was JSON
      ast = ast as BitmarkAst;
      if (outputJson) {
        // JSON ==> JSON
        jsonToJson(ast);
      } else if (outputAst) {
        // JSON ==> AST
        jsonToAst(ast);
      } else {
        // JSON ==> Bitmark
        jsonToBitmark(ast);
      }
    } else {
      // Input was not recognised, return an empty string
      res = '';
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
  public upgrade(input: string | unknown, options?: UpgradeOptions): string | unknown | void {
    let res: string | unknown | void;
    const opts: UpgradeOptions = Object.assign({}, options);
    // const fileOptions = Object.assign({}, opts.fileOptions);
    // const bitmarkOptions = Object.assign({}, opts.bitmarkOptions);
    const jsonOptions = Object.assign({}, opts.jsonOptions);

    const bitmarkParserType = opts.bitmarkParserType;

    let inStr: string = input as string;
    const inputIsString = typeof input === 'string';

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (inputIsString && fs.existsSync(inStr)) {
          inStr = fs.readFileSync(inStr, {
            encoding: 'utf8',
          });
        }
      }
    }

    // Process as JSON to see if we have JSON
    let ast = this.jsonParser.toAst(inStr);

    const isJson = !!ast?.bits;
    const isBitmark = inputIsString && !isJson; // Assume bitmark since not JSON

    // Helper conversion functions
    const bitmarkToBitmark = (bitmarkStr: string) => {
      // Validate and upgrade
      const astJson = this.bitmarkParser.toAst(bitmarkStr, {
        parserType: bitmarkParserType,
      });

      // Convert the AST to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, opts);
        generator.generateSync(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(opts);
        res = generator.generateSync(astJson);
      }
    };

    const jsonToJson = (astJson: BitmarkAst) => {
      // Validate and upgrade

      // Convert the AST to JSON
      if (opts.outputFile) {
        // Write JSON file
        const generator = new JsonFileGenerator(opts.outputFile, opts);
        generator.generateSync(astJson);
      } else {
        // Generate JSON object
        const generator = new JsonObjectGenerator(opts);
        const json = generator.generateSync(astJson);

        // Return JSON as object or string depending on prettify/stringify option
        res = this.jsonStringifyPrettify(json, jsonOptions);
      }
    };

    // Validate and Upgrade
    if (isBitmark) {
      // Bitmark ==> Bitmark
      bitmarkToBitmark(inStr);
    } else if (isJson) {
      // JSON ==> JSON
      ast = ast as BitmarkAst;
      jsonToJson(ast);
    } else {
      // Input was not recognised
      return;
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
    const inputIsString = typeof input === 'string';
    const opts: CreateAstOptions = Object.assign({}, options);

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (inputIsString && fs.existsSync(inStr)) {
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
    const isBitmark = inputIsString && !isJson && !isAst; // Assume bitmark since not AST or JSON

    if (isBitmark) {
      // Bitmark ==> AST
      res = this.bitmarkParser.toAst(inStr);
    } else if (isJson) {
      // JSON / AST ==> AST
      res = ast as BitmarkAst;
    } else {
      // Input was not recognised, return an empty AST
      res = {};
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
  public convertText(
    input: string | unknown,
    options?: ConvertTextOptions,
  ): string | unknown | void {
    let res: string | unknown | void;
    let preRes: string | unknown | void;
    const opts: ConvertTextOptions = Object.assign({}, options);
    const fileOptions = Object.assign({}, opts.fileOptions);
    const jsonOptions = Object.assign({}, opts.jsonOptions);
    const textFormat: TextFormatType =
      TextFormat.fromValue(opts.textFormat) ?? TextFormat.bitmarkText;
    const textLocation = opts.textLocation ?? TextLocation.body;

    let inStr: string = input as string;
    const inputIsString = typeof input === 'string';

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (inputIsString && fs.existsSync(inStr)) {
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
      preRes = this.textGenerator.generateSync(ast, textFormat, textLocation);
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
    const textFormat: TextFormatType =
      TextFormat.fromValue(opts.textFormat) ?? TextFormat.bitmarkText;
    const textLocation = opts.textLocation ?? TextLocation.body;

    let inStr: string = input as string;
    const inputIsString = typeof input === 'string';

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (inputIsString && fs.existsSync(inStr)) {
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
    const textFormat: TextFormatType =
      TextFormat.fromValue(opts.textFormat) ?? TextFormat.bitmarkText;
    const textLocation = opts.textLocation ?? TextLocation.body;

    let inStr: BreakscapedString = input as BreakscapedString;
    const inputIsString = typeof input === 'string';

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (!opts.inputFormat || opts.inputFormat === Input.file) {
      if (env.isNode) {
        if (inputIsString && fs.existsSync(inStr)) {
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
  private jsonStringifyPrettify = (
    json: unknown,
    options: JsonOptions,
    forceStringify?: boolean,
  ): unknown => {
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
