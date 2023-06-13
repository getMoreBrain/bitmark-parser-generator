import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { Generator } from '../Generator';

import { JsonGenerator, JsonGeneratorOptions } from './JsonGenerator';

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
   * @param options - JSON generation options
   */
  constructor(options?: JsonGeneratorOptions) {
    this.writer = new StringWriter();
    this.generator = new JsonGenerator(this.writer, options);
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

  /**
   * Generate bitmark JSON from bitmark AST as a plain JS object synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(ast: BitmarkAst): BitWrapperJson[] {
    this.generator.generateSync(ast);
    return JSON.parse(this.writer.getString());
  }
}

export { JsonObjectGenerator };
