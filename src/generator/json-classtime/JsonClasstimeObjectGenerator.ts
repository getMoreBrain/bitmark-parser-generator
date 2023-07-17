import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { Generator } from '../Generator';

import { JsonClasstimeGenerator, JsonGeneratorOptions } from './JsonClasstimeGenerator';

/**
 * Generate classtime JSON from a bitmark AST as a plain JS object
 *
 */
class JsonClasstimeObjectGenerator implements Generator<BitmarkAst, BitWrapperJson[]> {
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
   * Generate classtime JSON from bitmark AST as a plain JS object
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<BitWrapperJson[]> {
    await this.generator.generate(ast);
    return JSON.parse(this.writer.getString());
  }

  /**
   * Generate classtime JSON from bitmark AST as a plain JS object synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(ast: BitmarkAst): BitWrapperJson[] {
    this.generator.generateSync(ast);
    return JSON.parse(this.writer.getString());
  }
}

export { JsonClasstimeObjectGenerator };
