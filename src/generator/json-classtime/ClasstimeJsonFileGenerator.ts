import * as fs from 'fs-extra';

import { FileWriter } from '../../ast/writer/FileWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';
import { JsonFileGeneratorOptions } from '../json/JsonFileGenerator';

import { ClasstimeJsonGenerator } from './ClasstimeJsonGenerator';

/**
 * Generate classtime JSON from a bitmark AST as a file
 *
 */
class ClasstimeJsonFileGenerator implements Generator<BitmarkAst> {
  private generator: ClasstimeJsonGenerator;

  /**
   * Generate classtime JSON from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param bitmarkVersion - bitmark version, use null to use latest version
   * @param fileOptions - file options
   * @param bitmarkOptions - bitmark generation options
   */
  constructor(path: fs.PathLike, options?: JsonFileGeneratorOptions) {
    const writer = new FileWriter(path, options?.fileOptions);
    this.generator = new ClasstimeJsonGenerator(writer, options);
  }

  /**
   * Generate classtime JSON from bitmark AST as a file
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<void> {
    return this.generator.generate(ast);
  }

  /**
   * Generate classtime JSON from bitmark AST as a file synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(_ast: BitmarkAst): string {
    throw new Error('Sync operation not supported');
  }
}

export { ClasstimeJsonFileGenerator };
