import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { JsonGenerator, JsonOptions } from './JsonGenerator';

/**
 * Generate bitmark JSON from a bitmark AST as a string
 */
class JsonStringGenerator implements Generator<BitmarkAst, string> {
  private generator: JsonGenerator;
  private writer: StringWriter;

  /**
   * Generate bitmark JSON from a bitmark AST as a string
   *
   * @param options - bitmark generation options
   */
  constructor(generatorOptions?: JsonOptions) {
    this.writer = new StringWriter();
    this.generator = new JsonGenerator(this.writer, generatorOptions);
  }

  /**
   * Generate bitmark JSON from bitmark AST as a string
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<string> {
    await this.generator.generate(ast);
    return this.writer.getString();
  }
}

export { JsonStringGenerator };
