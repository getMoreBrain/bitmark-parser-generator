import * as fs from 'fs-extra';

import { FileOptions, FileWriter } from '../../ast/writer/FileWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { BitmarkGenerator, BitmarkOptions } from './BitmarkGenerator';

/**
 * Generate bitmark markup from a bitmark AST as a file
 */
class BitmarkFileGenerator implements Generator<BitmarkAst, void> {
  private generator: BitmarkGenerator;

  /**
   * Generate bitmark markup from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param fileOptions - file options
   * @param bitmarkOptions - bitmark generation options
   */
  constructor(path: fs.PathLike, fileOptions?: FileOptions, bitmarkOptions?: BitmarkOptions) {
    const writer = new FileWriter(path, fileOptions);
    this.generator = new BitmarkGenerator(writer, bitmarkOptions);
  }

  /**
   * Generate bitmark markup from bitmark AST as a file
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<void> {
    return this.generator.generate(ast);
  }
}

export { BitmarkFileGenerator };
