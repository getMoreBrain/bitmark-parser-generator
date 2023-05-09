import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeTypeType, NodeType } from '../../model/ast/NodeType';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';
import { ResourceType } from '../../model/enum/ResourceType';
import { TextFormat } from '../../model/enum/TextFormat';
import { Generator } from '../Generator';

import {
  BitmarkAst,
  Bit,
  ItemLead,
  SelectOption,
  HighlightText,
  Response,
  Statement,
  Choice,
  Heading,
  Body,
  ImageResource,
  Resource,
  ArticleResource,
} from '../../model/ast/Nodes';

const DEFAULT_OPTIONS: BitmarkOptions = {
  // debugGenerationInline: true,
};

/**
 * Bitmark generation options
 */
export interface BitmarkOptions {
  /**
   * If true, always include bitmark text format even if it is 'bitmark--'
   * If false, only include bitmark text format if it is not 'bitmark--'
   */
  explicitTextFormat?: boolean;
  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

/**
 * Generate bitmark markup from a bitmark AST
 */
class BitmarkGenerator implements Generator<void>, AstWalkCallbacks {
  protected ast = new Ast();
  private options: BitmarkOptions;
  private writer: Writer;
  private printed = false;

  /**
   * Generate bitmark markup from a bitmark AST
   *
   * @param writer - destination for the output
   * @param options - bitmark generation options
   */
  constructor(writer: Writer, options?: BitmarkOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.writer = writer;

    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);

    this.generatePropertyHandlers();
  }

  /**
   * Generate bitmark markup from bitmark AST
   *
   * @param ast bitmark AST
   */
  public async generate(ast: BitmarkAst): Promise<void> {
    // Open the writer
    await this.writer.open();

    // Walk the bitmark AST
    this.ast.walk(ast, this);

    // Ensure a blank line at end of file
    this.writeLine();

    // Close the writer
    await this.writer.close();
  }

  enter(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    let res: boolean | void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `enter_${node.key}`;

    if (!this.printed) {
      this.printed = true;
    }

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { open: true });

    if (typeof gen[funcName] === 'function') {
      res = gen[funcName](node, parent, route);
    }

    return res;
  }

  between(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,
    parent: NodeInfo | undefined,
    route: NodeInfo[],
  ): boolean | void {
    let res: boolean | void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `between_${node.key}`;

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { single: true });

    if (typeof gen[funcName] === 'function') {
      res = gen[funcName](node, left, right, parent, route);
    }

    return res;
  }

  exit(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `exit_${node.key}`;

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { close: true });

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }
  }

  leaf(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gen = this as any;
    const funcName = `leaf_${node.key}`;

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { open: true });

    if (typeof gen[funcName] === 'function') {
      gen[funcName](node, parent, route);
    }

    if (this.options.debugGenerationInline) this.writeInlineDebug(node.key, { close: true });
  }

  //
  // NODE HANDLERS
  //

  //
  // Non-Terminal nodes (branches)
  //

  // bitmark

  // bitmark -> bits

  protected between_bits(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    this.writeOPD();
    this.writeString(bit.bitType);

    if (bit.textFormat) {
      const write = this.isWriteTextFormat(bit.textFormat);

      if (write) {
        this.writeColon();
        this.writeString(bit.textFormat);
      }
    }

    // Write the resource type if there is a resource (unless the bit itself is the resource)
    const resourceType = bit.resource?.type;
    if (resourceType && resourceType !== bit.bitType) {
      this.writeAmpersand();
      this.writeString(bit.resource?.type);
    }

    this.writeCL();
    this.writeNL();
  }

  protected between_bitsValue(
    node: NodeInfo,
    left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // The following keys are combined with other keys so don't need newlines
    const noNlKeys: NodeTypeType[] = [
      NodeType.bitType,
      NodeType.textFormat,
      NodeType.level,
      NodeType.progress,
      NodeType.toc,
      NodeType.referenceEnd,
      NodeType.labelFalse,
    ];

    const bit = node.value as Bit;
    if (bit.book) {
      // If the book node exists, remove the newline caused by reference as it will be bound to book
      noNlKeys.push(NodeType.reference);
    }

    // Check if a no newline key is to the left in this 'between' callback
    const noNl = ((): boolean => {
      for (const keyType of noNlKeys) {
        if (left.key === keyType /*|| right.key === keyType*/) return true;
      }
      return false;
    })();

    if (!noNl) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitsValue -> sampleSolution

  protected enter_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('sampleSolution', node.value);
  }

  // bitmark -> bits -> bitsValue -> itemLead

  protected enter_itemLead(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    if (itemLead && (itemLead.item || itemLead.lead)) {
      // Always write item if item or lead is set
      this.writeOPC();
      this.writeString(itemLead.item);
      this.writeCL();

      if (itemLead.lead) {
        this.writeOPC();
        this.writeString(itemLead.lead);
        this.writeCL();
      }
    }
  }

  // bitmark -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // always write a NL before the body content if there is any?
    const body = node.value as Body;
    if (body.length > 0) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> gap

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions

  protected enter_solutions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const solutions = node.value as string[];
    if (solutions && solutions.length === 0) {
      // If there are no solutions, we need to write the special cloze gap [_] to indicate this
      this.writeOPU();
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue -> elements

  protected enter_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_elements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  protected exit_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMajorDivider();
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> select

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> select -> options

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> select -> options -> optionsValue

  protected enter_optionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const selectOption = node.value as SelectOption;
    if (selectOption.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(selectOption.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> highlight

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> highlight -> texts

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> highlight -> texts -> textsValue

  protected enter_textsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const highlightText = node.value as HighlightText;
    if (highlightText.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(highlightText.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> statements

  protected enter_statements(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
    const isStatementDivider = this.isStatementDivider(route);

    if (isStatementDivider) {
      this.writeMajorDivider();
      this.writeNL();
    }
  }

  protected between_statements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    route: NodeInfo[],
  ): void {
    const isStatementDivider = this.isStatementDivider(route);

    if (isStatementDivider) {
      this.writeNL();
      this.writeMajorDivider();
    }
    this.writeNL();
  }

  protected exit_statements(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
    const isStatementDivider = this.isStatementDivider(route);

    if (isStatementDivider) {
      this.writeNL();
      this.writeMajorDivider();
    }
  }

  // bitmark -> bits -> bitsValue -> statements -> statementsValue

  protected enter_statementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statement = node.value as Statement;
    if (statement.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(statement.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> choices
  // bitmark -> bits -> bitsValue -> quizzes -> quizzesValue -> choices

  protected between_choices(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  protected exit_choices(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> choices -> choicesValue

  protected enter_choicesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const choice = node.value as Choice;
    if (choice.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(choice.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> responses

  protected between_responses(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  protected exit_responses(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> responses -> responsesValue

  protected enter_responsesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const response = node.value as Response;
    if (response.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(response.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> quizzes

  protected enter_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_quizzes(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> quizzes -> quizzesValue

  protected between_quizzesValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    if (right.key === NodeType.choices || right.key === NodeType.responses) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitsValue -> heading

  protected enter_heading(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const heading = node.value as Heading;

    // Ensure the heading is valid for writing out (it will be valid, but if it is empty, it should not be written)
    let valid = false;
    if (heading && heading.forKeys /*&& heading.forValues && heading.forValues.length > 0*/) {
      valid = true;
    }

    if (!valid) return false;

    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_heading(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMinorDivider();
    this.writeNL();
  }

  protected exit_heading(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // this.writeMajorDivider();
    // this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> heading -> forValues

  protected enter_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_forValues(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMinorDivider();
    this.writeNL();
  }

  protected exit_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmark -> bits -> bitsValue -> pairs

  protected enter_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_pairs(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> pairs -> pairsValue

  protected between_pairsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    // this.writeMinorDivider();
    // this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> pairs -> pairsValue -> keyAudio

  protected enter_keyAudio(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.writeResource(node, parent, route);
  }

  // bitmark -> bits -> bitsValue -> pairs -> pairsValue -> keyImage

  protected enter_keyImage(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.writeResource(node, parent, route);
  }

  // bitmark -> bits -> bitsValue -> matrix

  protected enter_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_matrix(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> matrix -> matrixValue

  protected between_matrixValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    // this.writeMinorDivider();
    // this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> pairs -> pairsValue -> values
  // bitmark -> bits -> bitsValue -> matrix -> matrixValue -> cells -> cellsValue -> values

  protected enter_values(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMinorDivider();
    this.writeNL();
  }

  protected between_values(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> questions

  protected enter_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_questions(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> questions -> questionsValue

  protected between_questionsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    if (right.key === NodeType.sampleSolution) {
      this.writeNL();
    }
  }

  protected exit_questionsValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitsValue -> resource

  protected enter_resource(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.writeResource(node, parent, route);
  }

  // bitmark -> bits -> bitsValue -> resource -> posterImage

  protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const posterImage = node.value as ImageResource;
    if (posterImage && posterImage.value) {
      this.writeProperty('posterImage', posterImage.value);
    }
  }

  // bitmark -> bits -> bitsValue -> resource -> ...
  // bitmark -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmark -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  // protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('posterImage', node.value);
  // }

  //
  // Terminal nodes (leaves)
  //

  // bitmark -> bits -> bitsValue -> bitType

  // bitmark -> bits -> bitsValue -> textFormat

  //  bitmark -> bits -> title

  protected leaf_title(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const title = node.value;
    const bit = parent?.value as Bit;
    const level = bit.level || 1;
    if (level && title) {
      this.writeOP();
      for (let i = 0; i < +level; i++) this.writeHash();
      this.writeString(title);
      this.writeCL();
    }
  }

  //  bitmark -> bits -> subtitle

  protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const subtitle = node.value;
    const level = 2;
    if (level && subtitle) {
      this.writeOP();
      for (let i = 0; i < level; i++) this.writeHash();
      this.writeString(subtitle);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue -> book

  protected leaf_book(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = parent?.value as Bit;

    if (bit && node.value) {
      this.writeProperty('book', node.value);
      if (bit.reference) {
        this.writeOPRANGLE();
        this.writeString(bit.reference);
        this.writeCL();

        if (bit.referenceEnd) {
          this.writeOPRANGLE();
          this.writeString(bit.referenceEnd);
          this.writeCL();
        }
      }
    }
  }

  //  bitmark -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDANGLE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  bitmark -> bits -> bitsValue -> reference

  protected leaf_reference(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = parent?.value as Bit;

    if (bit && node.value) {
      // Only write reference if it is not chained to 'book'
      if (!bit.book) {
        this.writeOPRANGLE();
        this.writeString(node.value);
        this.writeCL();
      }
    }
  }

  //  * -> itemLead --> item

  //  * -> itemLead --> lead

  //  * -> hint

  protected leaf_hint(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPQ();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue ->  * -> example

  protected leaf_example(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const example = node.value;

    if (example) {
      this.writeOPA();
      this.writeString('example');

      if (example !== true && example !== '') {
        this.writeColon();
        this.writeString(example as string);
      }

      this.writeCL();
    }
  }

  // bitmark -> bits -> body -> bodyValue -> bodyText

  protected leaf_bodyText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitsValue -> elements -> elementsValue

  protected leaf_elementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue-> body -> bodyValue -> select -> options -> prefix
  // bitmark -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue-> body -> bodyValue -> select -> options -> postfix
  // bitmark -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue ->  * -> isCaseSensitive

  // bitmark -> bits -> bitsValue ->  * -> isLongAnswer

  // bitmark -> bits -> bitsValue ->  * -> isCorrect

  // bitmark -> bits -> bitsValue -> heading -> forKeys

  protected leaf_forKeys(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> heading -> forValuesValue

  protected leaf_forValuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmark -> bits -> bitsValue -> pairs -> pairsValue -> key
  // bitmark -> bits -> bitsValue -> matrix -> matrixValue -> key

  protected leaf_key(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitsValue -> pairs -> pairsValue -> values -> valuesValue
  // bitmark -> bits -> bitsValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitsValue -> questions -> questionsValue -> question

  protected leaf_question(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
      // this.writeNL();
    }
  }

  // bitmark -> bits -> bitsValue -> questions -> questionsValue -> sampleSolution

  protected leaf_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDOLLAR();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue -> questions -> questionsValue -> question -> isShortAnswer

  protected leaf_isShortAnswer(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value === true) {
      // Writing [@shortAnswer] after the 'question' causes newlines in the body to change.
      // This is likely a parser bug.
      // this.writeOPA();
      // this.writeString('shortAnswer');
      // this.writeCL();
    }
  }

  // bitmark -> bits -> bitsValue -> statements -> text

  // bitmark -> bits -> bitsValue -> resource -> ...
  // bitmark -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmark -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  protected leaf_src1x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src1x', node.value);
  }

  protected leaf_src2x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src2x', node.value);
  }

  protected leaf_src3x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src3x', node.value);
  }

  protected leaf_src4x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src4x', node.value);
  }

  protected leaf_width(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('width', node.value);
  }

  protected leaf_height(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('height', node.value);
  }

  protected leaf_alt(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('alt', node.value);
  }

  protected leaf_license(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('license', node.value);
  }

  protected leaf_copyright(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('copyright', node.value);
  }

  protected leaf_provider(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // provider is included in the url (it is the domain) and should not be written as a property
    // this.writeProperty('provider', node.value);
  }

  protected leaf_showInIndex(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('showInIndex', node.value);
  }

  protected leaf_caption(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('caption', node.value);
  }

  // bitmark -> bits -> bitsValue -> resource -> ...
  // bitmark -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmark -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [duration,mute,autoplay,allowSubtitles,showSubtitles]

  protected leaf_duration(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // Ignore duration that IS at the bit level as there is a key clash with resource...duration / bit.duration
    if (parent?.key === NodeType.bitsValue) return;

    this.writeProperty('duration', node.value);
  }

  protected leaf_mute(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('mute', node.value);
  }

  protected leaf_autoplay(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('autoplay', node.value);
  }

  protected leaf_allowSubtitles(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('allowSubtitles', node.value);
  }

  protected leaf_showSubtitles(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('showSubtitles', node.value);
  }

  //
  // Generated Node Handlers
  //

  /**
   * Generate the handlers for properties, as they are mostly the same, but not quite
   */

  // protected enter_labelTrue(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const bit = parent?.value as Bit;
  //   if (bit) {
  //     this.writeProperty('labelTrue', node.value ?? '', true);
  //     this.writeProperty('labelFalse', bit.labelFalse ?? '', true);
  //   }
  // }

  protected generatePropertyHandlers() {
    for (const key of PropertyKey.values()) {
      const meta = PropertyKey.getMetadata<PropertyKeyMetadata>(PropertyKey.fromValue(key)) ?? {};
      const astKey = meta.astKey ? meta.astKey : key;
      const funcName = `enter_${astKey}`;

      // Special cases
      if (astKey === PropertyKey.labelFalse) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[funcName] = (node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]) => {
        const value = node.value as unknown[] | undefined;
        if (value == null) return;

        // if (key === 'progress') debugger;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        if (parent?.key !== NodeType.bitsValue) return;

        if (astKey === 'labelTrue') {
          // Special case
          const bit = parent?.value as Bit;
          if (bit) {
            this.writeProperty(PropertyKey.labelTrue, value, meta.isSingle);
            this.writeProperty(PropertyKey.labelFalse, bit.labelFalse, meta.isSingle);
          }
        } else if (astKey === PropertyKey.example) {
          // Special case
          this.writeProperty('example', value, meta.isSingle, true);
        } else {
          // Standard case
          this.writeProperty(key, node.value, meta.isSingle);
        }
      };

      // Bind this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[funcName] = (this as any)[funcName].bind(this);
    }
  }

  // END NODE HANDLERS

  //
  // WRITE FUNCTIONS
  //

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
  }

  protected writeOPBUL(): void {
    this.write('[•');
  }

  protected writeOPESC(): void {
    this.write('[^');
  }

  protected writeOPRANGLE(): void {
    this.write('[►');
  }

  protected writeOPDANGLE(): void {
    this.write('[▼');
  }

  protected writeOPD(): void {
    this.write('[.');
  }

  protected writeOPU(): void {
    this.write('[_');
  }

  protected writeOPB(): void {
    this.write('[!');
  }

  protected writeOPQ(): void {
    this.write('[?');
  }

  protected writeOPA(): void {
    this.write('[@');
  }

  protected writeOPP(): void {
    this.write('[+');
  }

  protected writeOPM(): void {
    this.write('[-');
  }

  protected writeOPS(): void {
    this.write('[\\');
  }

  protected writeOPR(): void {
    this.write('[*');
  }

  protected writeOPC(): void {
    this.write('[%');
  }

  protected writeOPAMP(): void {
    this.write('[&');
  }

  protected writeOPDOLLAR(): void {
    this.write('[$');
  }

  protected writeOPHASH(): void {
    this.write('[#');
  }

  protected writeOPPRE(): void {
    this.write("['");
  }

  protected writeOPPOST(): void {
    this.write('['); // TODO - not sure what symbol is for postfix
  }

  protected writeOP(): void {
    this.write('[');
  }

  protected writeCL(): void {
    this.write(']');
  }

  protected writeAmpersand(): void {
    this.write('&');
  }

  protected writeColon(): void {
    this.write(':');
  }

  // protected writeDoubleColon(): void {
  //   this.write('::');
  // }

  protected writeHash(): void {
    this.write('#');
  }

  protected writeMajorDivider(): void {
    this.write('===');
  }

  protected writeMinorDivider(): void {
    this.write('==');
  }

  protected writeElementDivider(): void {
    this.write('--');
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
  }

  protected writeResource(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;
    const resourceAsArticle = resource as ArticleResource;

    if (resource) {
      // Check if a resource has a value, if not, we should not write it (or any of its chained properties)
      let valid = false;
      if (resource.value) {
        valid = true;
      }

      // Resource is not valid, cancel walking it's tree.
      if (!valid) return false;

      this.writeOPAMP();
      this.writeString(resource.type);
      if (resource.type === ResourceType.article && resourceAsArticle.value) {
        this.writeColon();
        // this.writeNL();
        this.writeString(resourceAsArticle.value);
        this.writeNL();
      } else if (resource.value) {
        this.writeColon();
        this.writeString(resource.value);
      }
      this.writeCL();
    }
  }

  protected writeProperty(
    name: string,
    values?: unknown | unknown[],
    singleOnly?: boolean,
    ignoreFalse?: boolean,
  ): void {
    let valuesArray: unknown[];

    if (values !== undefined) {
      if (!Array.isArray(values)) {
        valuesArray = [values];
      } else {
        valuesArray = values;
      }

      if (valuesArray.length > 0) {
        if (singleOnly) valuesArray = valuesArray.slice(valuesArray.length - 1);

        for (const val of valuesArray) {
          if (val !== undefined) {
            if (ignoreFalse && val === false) continue;
            this.writeOPA();
            this.writeString(name);
            this.writeColon();
            this.writeString(`${val}`);
            this.writeCL();
          }
        }
      }
    }
  }

  protected writeInlineDebug(key: string, state: { open?: boolean; close?: boolean; single?: boolean }) {
    let tag = key;
    if (state.open) {
      tag = `<${key}>`;
    } else if (state.close) {
      tag = `</${key}>`;
    } else if (state.single) {
      tag = `<${key} />`;
    }

    this.writeString(tag);
  }

  protected isWriteTextFormat(bitsValue: string): boolean {
    const isMinusMinus = TextFormat.fromValue(bitsValue) === TextFormat.bitmarkMinusMinus;
    const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
    return !!writeFormat;
  }

  protected isStatementDivider(route: NodeInfo[]) {
    const bitType = this.getBitType(route);
    return !(bitType === BitType.trueFalse1);
  }

  protected getBitType(route: NodeInfo[]): BitTypeType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.bitType;
      }
    }

    return undefined;
  }

  //
  // Writer interface
  //

  /**
   * Writes a string value to the output.
   * @param value - The string value to be written.
   */
  write(value: string): this {
    this.writer.write(value);
    return this;
  }

  /**
   * Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.
   * @param value - The line to write. When omitted, only the endOfLineString is written.
   */
  writeLine(value?: string): this {
    this.writer.writeLine(value);
    return this;
  }

  /**
   * Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.
   * @param values - The lines to write.
   * @param delimiter - An optional delimiter to be written at the end of each line, except for the last one.
   */
  writeLines(values: string[], delimiter?: string): this {
    this.writer.writeLines(values, delimiter);
    return this;
  }

  /**
   * Writes a single whitespace character to the output.
   */
  writeWhiteSpace(): this {
    this.writer.writeWhiteSpace();
    return this;
  }
}

export { BitmarkGenerator };
