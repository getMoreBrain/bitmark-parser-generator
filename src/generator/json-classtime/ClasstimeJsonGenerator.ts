import { NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { ClasstimeJson } from '../../model/json-classtime/ClasstimeJson';
import { JsonGenerator, JsonGeneratorOptions } from '../json/JsonGenerator';

/**
 * Generate Classtime JSON from a bitmark AST
 *
 */
class ClasstimeJsonGenerator extends JsonGenerator {
  // State
  private classtimeJson: Partial<ClasstimeJson> = {};

  /**
   * Generate Classtime JSON from a bitmark AST
   *
   * @param writer - destination for the output
   * @param options - JSON generation options
   */
  constructor(writer: Writer, options?: JsonGeneratorOptions) {
    super(writer, options);
  }

  protected enter_bitmarkAst(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
    super.enter_bitmarkAst(node, parent, route);

    this.classtimeJson = {
      questions: [],
    };
  }

  protected exit_bitmarkAst(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // super.exit_bitmarkAst(node, parent, route);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.json = this.classtimeJson as any;
  }

  // protected enter_bitsValue(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
  //   super.enter_bitsValue(node, parent, route);
  // }

  protected exit_bitsValue(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
    super.exit_bitsValue(node, parent, route);

    if (!this.classtimeJson.questions) this.classtimeJson.questions = [];

    // TODO - convert the bitJson to Classtime question json
    this.classtimeJson.questions.push(this.bitWrapperJson);
  }
}

export { ClasstimeJsonGenerator };
