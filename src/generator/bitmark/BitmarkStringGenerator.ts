import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { BitmarkGenerator, BitmarkOptions } from './BitmarkGenerator';

/**
 * Generate bitmark markup from a bitmark AST as a string
 */
class BitmarkStringGenerator implements Generator<BitmarkAst, string> {
  private generator: BitmarkGenerator;
  private writer: StringWriter;

  /**
   * Generate bitmark markup from a bitmark AST as a string
   *
   * @param options - bitmark generation options
   */
  constructor(options?: BitmarkOptions) {
    this.writer = new StringWriter();
    this.generator = new BitmarkGenerator(this.writer, options);
  }

  /**
   * Generate bitmark markup from bitmark AST as a string
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<string> {
    await this.generator.generate(ast);
    return this.writer.getString();
  }
}

export { BitmarkStringGenerator };
