import { type PathLike } from 'node:fs';

import { type FileOptions, FileWriter } from '../../ast/writer/FileWriter.ts';
import { SyncFileWriter } from '../../ast/writer/SyncFileWriter.ts';
import { type BitmarkAst } from '../../model/ast/Nodes.ts';
import { type Generator } from '../Generator.ts';
import { BitmarkGenerator, type BitmarkGeneratorOptions } from './BitmarkGenerator.ts';

/**
 * Bitmark file generator options
 */
export interface BitmarkFileGeneratorOptions extends BitmarkGeneratorOptions {
  /**
   * The options for file output.
   */
  fileOptions?: FileOptions;

  /**
   * If true, the file will be generated asynchronously - generateSync() will throw an error.
   * If false, the file will be generated synchronously.
   *
   * Defaults to false.
   */
  async?: boolean;
}

/**
 * Generate bitmark markup from a bitmark AST as a file
 */
class BitmarkFileGenerator implements Generator<BitmarkAst> {
  private generator: BitmarkGenerator;
  private async: boolean;

  /**
   * Generate bitmark markup from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param options - bitmark generation options
   */
  constructor(path: PathLike, options?: BitmarkFileGeneratorOptions) {
    this.async = options?.async ?? false;
    const writer = this.async
      ? new FileWriter(path, options?.fileOptions)
      : new SyncFileWriter(path, options?.fileOptions);
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
  public generateSync(_ast: BitmarkAst): void {
    if (this.async) {
      throw new Error('Sync operation not supported');
    }
    this.generator.generateSync(_ast);
  }
}

export { BitmarkFileGenerator };
