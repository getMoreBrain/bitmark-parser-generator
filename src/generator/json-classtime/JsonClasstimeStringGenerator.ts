import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { JsonClasstimeGenerator, JsonGeneratorOptions } from './JsonClasstimeGenerator';

/**
 * Generate classtime JSON from a bitmark AST as a string
 */
class JsonClasstimeStringGenerator implements Generator<BitmarkAst, string> {
  private generator: JsonClasstimeGenerator;
  private writer: StringWriter;

  /**
   * Generate classtime JSON from a bitmark AST as a string
   *
   * @param options - JSON generation options
   */
  constructor(options?: JsonGeneratorOptions) {
    this.writer = new StringWriter();
    this.generator = new JsonClasstimeGenerator(this.writer, options);
  }

  /**
   * Generate classtime JSON from bitmark AST as a string
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<string> {
    await this.generator.generate(ast);
    return this.writer.getString();
  }

  /**
   * Generate classtime JSON from bitmark AST as a string synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(ast: BitmarkAst): string {
    this.generator.generateSync(ast);
    return this.writer.getString();
  }
}

export { JsonClasstimeStringGenerator };
