import { StringWriter } from '../../ast/writer/StringWriter';
import { BitmarkAst } from '../../model/ast/Nodes';
import { Generator } from '../Generator';

import { BitmarkGenerator, BitmarkGeneratorOptions } from './BitmarkGenerator';

/**
 * Generate bitmark markup from a bitmark AST as a string
 */
class BitmarkStringGenerator implements Generator<BitmarkAst, string> {
  private generator: BitmarkGenerator;
  private writer: StringWriter;

  /**
   * Generate bitmark markup from a bitmark AST as a string
   *
   * @param bitmarkVersion - bitmark version, use null to use latest version
   * @param options - bitmark generation options
   */
  constructor(options?: BitmarkGeneratorOptions) {
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

  /**
   * Generate bitmark markup from bitmark AST as a string synchronously
   *
   * @param ast bitmark AST
   */
  public generateSync(ast: BitmarkAst): string {
    this.generator.generateSync(ast);
    return this.writer.getString();
  }
}

export { BitmarkStringGenerator };
