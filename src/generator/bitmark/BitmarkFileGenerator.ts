import * as fs from 'fs-extra';

import { FileOptions, FileWriter } from '../../ast/writer/FileWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { BitmarkGenerator, BitmarkGeneratorOptions } from './BitmarkGenerator';

/**
 * Bitmark file generator options
 */
export interface BitmarkFileGeneratorOptions extends BitmarkGeneratorOptions {
  /**
   * The options for file output.
   */
  fileOptions?: FileOptions;
}

/**
 * Generate bitmark markup from a bitmark AST as a file
 */
class BitmarkFileGenerator implements Generator<BitmarkAst> {
  private generator: BitmarkGenerator;

  /**
   * Generate bitmark markup from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param options - bitmark generation options
   */
  constructor(path: fs.PathLike, options?: BitmarkFileGeneratorOptions) {
    const writer = new FileWriter(path, options?.fileOptions);
    this.generator = new BitmarkGenerator(writer, options);
  }

  /**
   * Generate bitmark markup from bitmark AST as a file
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<void> {
    return this.generator.generate(ast);
  }

  /**
   * Generate bitmark markup from bitmark AST as a file synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(_ast: BitmarkAst): string {
    throw new Error('Sync operation not supported');
  }
}

export { BitmarkFileGenerator };
