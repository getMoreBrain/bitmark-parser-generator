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

/*
 * NOTE:
 *
 * We want to be able to strip out the NodeJS specific functions from the final bundle.
 * Any code between the comments STRIP:START and STRIP:END will be removed.
 *
 * However, the Typescript compiler will remove comments that it does not believe are associated with code.
 * Therefore we have to use some dummy code to prevent it from removing the ANTLR stripping comments.
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

/* STRIP:END */
STRIP;

/**
 * Conversion options for bitmark / JSON conversion
 */
export interface ConvertOptions {
  /**
   * Specify the bitmark parser to use, overriding the default
   */
  bitmarkParserType?: BitmarkParserTypeType;
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
 * Bitmark tool for manipulating bitmark in all its formats.
 *
 */
class BitmarkParserGenerator {
  protected ast = new Ast();
  protected jsonParser = new JsonParser();
  protected bitmarkParser = new BitmarkParser();

  /**
   * Get the version of the bitmark-parser-generator library
   */
  version(): string {
    return env.appVersion.full;
  }

  /**
   * Convert bitmark from bitmark to JSON, or JSON to bitmark.
   *
   * Input type is detected automatically and may be string, object (JSON or AST), or file
   *
   * Output type is selected automatically based on input type detection:
   * - input(JSON/AST) ==> output(bitmark)
   * - input(bitmark)  ==> output(JSON)
   *
   * By default, the result is returned as a string for bitmark, or a plain JS object for JSON/AST.
   *
   * The options can be used to write the output to a file and to set conversion options or override defaults.
   *
   * @param input - bitmark or JSON as a string, JSON or AST as plain JS object, or path to a file containing
   * JSON, AST, or bitmark.
   * @param options - the conversion options
   * @returns Promise that resolves to string if converting to bitmark, a plain JS object if converting to JSON, or
   * void if writing to a file
   * @throws Error if any error occurs
   */
  async convert(input: string | fs.PathLike | unknown, options?: ConvertOptions): Promise<string | unknown | void> {
    let res: string | unknown | void;
    const opts: ConvertOptions = Object.assign({}, options);
    const fileOptions = Object.assign({}, opts.fileOptions);
    const bitmarkOptions = Object.assign({}, opts.bitmarkOptions);
    const jsonOptions = Object.assign({}, opts.jsonOptions);
    const jsonPrettifySpace = jsonOptions.prettify === true ? 2 : jsonOptions.prettify || undefined;
    const outputFormat = opts.outputFormat;
    const outputBitmark = outputFormat === Output.bitmark;
    const outputJson = outputFormat === Output.json;
    const outputAst = outputFormat === Output.ast;
    const bitmarkParserType = opts.bitmarkParserType;

    let inStr: string = input as string;

    // Check if we are trying to write to a file in the browser
    if (env.isBrowser && opts.outputFile) {
      throw new Error('Cannot write to file in browser environment');
    }

    // If a file, read the file in
    if (env.isNode) {
      if (fs.existsSync(inStr)) {
        inStr = fs.readFileSync(inStr, {
          encoding: 'utf8',
        });
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
      // Return the original bitmark (TODO - validate it)
      res = bitmarkStr;
    };

    const bitmarkToAst = async (bitmarkStr: string) => {
      res = this.bitmarkParser.toAst(bitmarkStr, {
        parserType: bitmarkParserType,
      });
    };

    const bitmarkToJSON = async (bitmarkStr: string) => {
      if (bitmarkParserType === BitmarkParserType.antlr) {
        // Convert the bitmark to JSON using the antlr parser
        const json = this.bitmarkParser.parseUsingAntlr(bitmarkStr);

        if (opts.outputFile) {
          const jsonStr = JSON.stringify(json, undefined, jsonPrettifySpace);

          // Write JSON to file
          const flag = fileOptions.append ? 'a' : 'w';
          fs.ensureDirSync(path.dirname(opts.outputFile.toString()));
          fs.writeFileSync(opts.outputFile, jsonStr, {
            flag,
          });
        } else {
          // Return JSON as object
          res = json;
        }
      } else {
        // Convert the bitmark to JSON using the peggy parser

        // Generate AST from the Bitmark markup
        ast = this.bitmarkParser.toAst(bitmarkStr, {
          parserType: bitmarkParserType,
        });

        // Convert the AST to JSON
        if (opts.outputFile) {
          // Write JSON file
          const generator = new JsonFileGenerator(opts.outputFile, fileOptions, bitmarkOptions);
          await generator.generate(ast);
        } else {
          // Generate JSON object
          const generator = new JsonObjectGenerator(bitmarkOptions);
          res = await generator.generate(ast);
        }
      }
    };

    const astToBitmark = async (astJson: BitmarkAst) => {
      // Convert the AST to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, fileOptions, bitmarkOptions);
        await generator.generate(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(bitmarkOptions);
        res = await generator.generate(astJson);
      }
    };

    const astToAst = async (astJson: BitmarkAst) => {
      res = astJson;
    };

    const astToJSON = async (astJson: BitmarkAst) => {
      // Convert the AST to JSON
      if (opts.outputFile) {
        // Write JSON file
        const generator = new JsonFileGenerator(opts.outputFile, fileOptions, bitmarkOptions);
        await generator.generate(astJson);
      } else {
        // Generate JSON object
        const generator = new JsonObjectGenerator(bitmarkOptions);
        res = await generator.generate(astJson);
      }
    };

    const jsonToBitmark = async (astJson: BitmarkAst) => {
      // We already have the ast from detecting the input type, so use the AST we already have

      // Convert the JSON to bitmark
      if (opts.outputFile) {
        // Write markup file
        const generator = new BitmarkFileGenerator(opts.outputFile, fileOptions, bitmarkOptions);
        await generator.generate(astJson);
      } else {
        // Generate markup string
        const generator = new BitmarkStringGenerator(bitmarkOptions);
        res = await generator.generate(astJson);
      }
    };

    const jsonToAst = async (astJson: BitmarkAst) => {
      // We already have the ast from detecting the input type, so just return the AST we already have
      res = astJson;
    };

    const jsonToJSON = async (jsonStr: string) => {
      // Return the original input as JSON (TODO - validate it)
      res = this.jsonParser.preprocessJson(jsonStr);
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
        await bitmarkToJSON(inStr);
      }
    } else if (isAst) {
      // Input was AST
      ast = ast as BitmarkAst;
      if (outputAst) {
        // AST ==> AST
        await astToAst(ast);
      } else if (outputJson) {
        // AST ==> JSON
        await astToJSON(ast);
      } else {
        // AST ==> Bitmark
        await astToBitmark(ast);
      }
    } else {
      // Input was JSON
      ast = ast as BitmarkAst;
      if (outputJson) {
        // JSON ==> JSON
        await jsonToJSON(inStr);
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
   * Create a bitmark AST (Abstract Syntax Tree) from bitmark or JSON or AST
   *
   * Input type is detected automatically and may be string, object (JSON or AST), or file
   *
   * @param input the JSON or bitmark to convert to a bitmark AST
   * @returns bitmark AST
   * @throws Error if any error occurs
   */
  createAst(input: unknown): BitmarkAst {
    let res: BitmarkAst;
    let inStr: string = input as string;

    // If a file, read the file in
    if (fs.existsSync(inStr)) {
      inStr = fs.readFileSync(inStr, {
        encoding: 'utf8',
      });
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
}

export { BitmarkParserGenerator, Output };
