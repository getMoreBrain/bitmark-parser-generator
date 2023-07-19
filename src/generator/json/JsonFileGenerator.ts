import * as fs from 'fs-extra';

import { FileOptions, FileWriter } from '../../ast/writer/FileWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { JsonGenerator, JsonGeneratorOptions } from './JsonGenerator';

/**
 * JSON file generator options
 */
export interface JsonFileGeneratorOptions extends JsonGeneratorOptions {
  /**
   * The options for file output.
   */
  fileOptions?: FileOptions;
}

/**
 * Generate bitmark JSON from a bitmark AST as a file
 *
 * TODO: NOT IMPLEMENTED!
 */
class JsonFileGenerator implements Generator<BitmarkAst> {
  private generator: JsonGenerator;

  /**
   * Generate bitmark JSON from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param bitmarkVersion - bitmark version, use null to use latest version
   * @param fileOptions - file options
   * @param bitmarkOptions - bitmark generation options
   */
  constructor(path: fs.PathLike, options?: JsonFileGeneratorOptions) {
    const writer = new FileWriter(path, options?.fileOptions);
    this.generator = new JsonGenerator(writer, options);
  }

  /**
   * Generate bitmark JSON from bitmark AST as a file
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<void> {
    return this.generator.generate(ast);
  }

  /**
   * Generate bitmark JSON from bitmark AST as a file synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(_ast: BitmarkAst): string {
    throw new Error('Sync operation not supported');
  }
}

export { JsonFileGenerator };
