import * as fs from 'fs-extra';

import { FileOptions, FileWriter } from '../../ast/writer/FileWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { JsonGenerator, JsonOptions } from './JsonGenerator';

/**
 * Generate bitmark JSON from a bitmark AST as a file
 *
 * TODO: NOT IMPLEMENTED!
 */
class JsonFileGenerator implements Generator<BitmarkAst, void> {
  private generator: JsonGenerator;

  /**
   * Generate bitmark JSON from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param fileOptions - file options
   * @param bitmarkOptions - bitmark generation options
   */
  constructor(path: fs.PathLike, fileOptions?: FileOptions, jsonOptions?: JsonOptions) {
    const writer = new FileWriter(path, fileOptions);
    this.generator = new JsonGenerator(writer, jsonOptions);
  }

  /**
   * Generate bitmark JSON from bitmark AST as a file
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<void> {
    return this.generator.generate(ast);
  }
}

export { JsonFileGenerator };
