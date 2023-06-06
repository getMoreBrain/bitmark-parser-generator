import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { Generator } from '../Generator';

import { JsonGenerator, JsonOptions } from './JsonGenerator';

/**
 * Generate bitmark JSON from a bitmark AST as a plain JS object
 *
 */
class JsonObjectGenerator implements Generator<BitmarkAst, BitWrapperJson[]> {
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
   * Generate bitmark JSON from bitmark AST as a plain JS object
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<BitWrapperJson[]> {
    await this.generator.generate(ast);
    return JSON.parse(this.writer.getString());
  }
}

export { JsonObjectGenerator };
