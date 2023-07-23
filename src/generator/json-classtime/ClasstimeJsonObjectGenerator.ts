import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { Generator } from '../Generator';
import { JsonGeneratorOptions } from '../json/JsonGenerator';

import { ClasstimeJsonGenerator } from './ClasstimeJsonGenerator';

/**
 * Generate classtime JSON from a bitmark AST as a plain JS object
 *
 */
class ClasstimeJsonObjectGenerator implements Generator<BitmarkAst, BitWrapperJson[]> {
  private generator: ClasstimeJsonGenerator;
  private writer: StringWriter;

  /**
   * Generate classtime JSON from a bitmark AST as a string
   *
   * @param options - JSON generation options
   */
  constructor(options?: JsonGeneratorOptions) {
    this.writer = new StringWriter();
    this.generator = new ClasstimeJsonGenerator(this.writer, options);
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

export { ClasstimeJsonObjectGenerator };
