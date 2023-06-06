import { StringWriter } from '../../ast/writer/StringWriter';
import { TextAst } from '../../model/ast/TextNodes';
import { Generator } from '../Generator';

import { TextGenerator, TextOptions } from './TextGenerator';

/**
 * Generate bitmark text from a bitmark text AST as a string
 */
class TextStringGenerator implements Generator<TextAst, string> {
  private generator: TextGenerator;
  private writer: StringWriter;

  /**
   * Generate bitmark text from a bitmark text AST as a string
   *
   * @param options - bitmark generation options
   */
  constructor(generatorOptions?: TextOptions) {
    this.writer = new StringWriter();
    this.generator = new TextGenerator(this.writer, generatorOptions);
  }

  /**
   * Generate bitmark text from a bitmark text AST as a string
   *
   * @param ast bitmark text AST
   */
  public async generate(ast: TextAst): Promise<string> {
    await this.generator.generate(ast);
    return this.writer.getString();
  }
}

export { TextStringGenerator };
