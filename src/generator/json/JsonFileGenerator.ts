import { type PathLike } from 'node:fs';

import { type FileOptions, FileWriter } from '../../ast/writer/FileWriter.ts';
import { SyncFileWriter } from '../../ast/writer/SyncFileWriter.ts';
import { type BitmarkAst } from '../../model/ast/Nodes.ts';
import { type Generator } from '../Generator.ts';
import { JsonGenerator, type JsonGeneratorOptions } from './JsonGenerator.ts';

/**
 * JSON file generator options
 */
export interface JsonFileGeneratorOptions extends JsonGeneratorOptions {
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
 * Generate bitmark JSON from a bitmark AST as a file
 *
 */
class JsonFileGenerator implements Generator<BitmarkAst> {
  private generator: JsonGenerator;
  private async: boolean;

  /**
   * Generate bitmark JSON from a bitmark AST as a file
   *
   * @param path - path of file to generate
   * @param bitmarkVersion - bitmark version, use null to use latest version
   * @param fileOptions - file options
   * @param bitmarkOptions - bitmark generation options
   */
  constructor(path: PathLike, options?: JsonFileGeneratorOptions) {
    this.async = options?.async ?? false;
    const writer = this.async
      ? new FileWriter(path, options?.fileOptions)
      : new SyncFileWriter(path, options?.fileOptions);
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
  public generateSync(_ast: BitmarkAst): void {
    if (this.async) {
      throw new Error('Sync operation not supported');
    }
    this.generator.generateSync(_ast);
  }
}

export { JsonFileGenerator };
