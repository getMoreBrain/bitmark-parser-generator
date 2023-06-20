import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeTypeType, NodeType } from '../../model/ast/NodeType';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { CardSetVersion, CardSetVersionType } from '../../model/enum/CardSetVersion';
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
  Body,
  ImageResource,
  Resource,
  ArticleResource,
  StillImageFilmResource,
  Partner,
  Example,
} from '../../model/ast/Nodes';

const DEFAULT_OPTIONS: BitmarkOptions = {
  debugGenerationInline: false,
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
   * Card set version to generate:
   * 1: === / == / --
   * 2: ++==== / ==== / -- / ~~ / ====++
   */
  cardSetVersion?: CardSetVersionType;

  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

/**
 * Bitmark generator options
 */
export interface BitmarkGeneratorOptions {
  /**
   * bitmarkVersion - The version of bitmark to output.
   * If not specified, the version will default to 3.
   *
   * Specifying the version will set defaults for other options.
   * - Bitmark v2:
   *   - cardSetVersion: 1
   * - Bitmark v3:
   *   - cardSetVersion: 2
   */
  bitmarkVersion?: BitmarkVersionType;

  /**
   * The options for JSON generation.
   */
  bitmarkOptions?: BitmarkOptions;
}

/**
 * Generate bitmark markup from a bitmark AST
 */
class BitmarkGenerator implements Generator<BitmarkAst>, AstWalkCallbacks {
  protected ast = new Ast();
  private bitmarkVersion: BitmarkVersionType;
  private options: BitmarkOptions;
  private writer: Writer;

  // State
  private skipNLBetweenBitsValue = false;

  // Debug
  private printed = false;

  /**
   * Generate bitmark markup from a bitmark AST
   *
   * @param writer - destination for the output
   * @param bitmarkVersion - The version of bitmark to output.
   * If not specified, the version will default to 3.
   *
   * Specifying the version will set defaults for other options.
   * - Bitmark v2:
   *   - cardSetVersion: 1
   * - Bitmark v3:
   *   - cardSetVersion: 2
   *
   * @param options - bitmark generation options
   */
  constructor(writer: Writer, options?: BitmarkGeneratorOptions) {
    this.bitmarkVersion = BitmarkVersion.fromValue(options?.bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options?.bitmarkOptions,
    };

    // Set defaults according to bitmark version
    if (this.bitmarkVersion === BitmarkVersion.v2) {
      if (this.options.cardSetVersion === undefined) {
        this.options.cardSetVersion = CardSetVersion.v1;
      }
    } else {
      if (this.options.cardSetVersion === undefined) {
        this.options.cardSetVersion = CardSetVersion.v2;
      }
    }

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
    // Reset the state
    this.resetState();

    // Open the writer
    await this.writer.open();

    // Walk the bitmark AST
    this.walkAndWrite(ast);

    // Ensure a blank line at end of file
    this.writeLine();

    // Close the writer
    await this.writer.close();
  }

  /**
   * Generate text from a bitmark text AST synchronously
   *
   * @param ast bitmark text AST
   */
  public generateSync(ast: BitmarkAst): void {
    // Reset the state
    this.resetState();

    // Open the writer
    this.writer.openSync();

    // Walk the bitmark AST
    this.walkAndWrite(ast);

    // Close the writer
    this.writer.closeSync();
  }

  private resetState(): void {
    this.skipNLBetweenBitsValue = false;
    this.printed = false;
  }

  private walkAndWrite(ast: BitmarkAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, NodeType.bitmarkAst, this, undefined);

    // Ensure a blank line at end of file
    this.writeLine();
  }

  enter(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    let res: boolean | void = void 0;
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
    let res: boolean | void = void 0;
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

  // bitmarkAst -> bits

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

  // bitmarkAst -> bits -> bitsValue

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
      if (this.skipNLBetweenBitsValue) {
        this.skipNLBetweenBitsValue = false;
        return true;
      }
      for (const keyType of noNlKeys) {
        if (left.key === keyType /*|| right.key === keyType*/) return true;
      }
      return false;
    })();

    if (!noNl) {
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> labelTrue / labelFalse

  protected enter_labelTrue(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as string | undefined;

    // Ignore example that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    const bit = parent?.value as Bit;
    if (bit) {
      this.writeProperty(PropertyKey.labelTrue, value, true);
      this.writeProperty(PropertyKey.labelFalse, bit.labelFalse, true);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> partner

  protected enter_partner(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const partner = node.value as Partner;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    const { name, avatarImage } = partner;

    this.writeProperty('partner', name, true);
    if (avatarImage) {
      this.writeResource(avatarImage);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> sampleSolution

  protected enter_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('sampleSolution', node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> itemLead

  protected enter_itemLead(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    if (itemLead && (itemLead.item || itemLead.lead)) {
      // Always write item if item or lead is set
      this.writeOPC();
      this.writeString(itemLead.item || '');
      this.writeCL();

      if (itemLead.lead) {
        this.writeOPC();
        this.writeString(itemLead.lead);
        this.writeCL();
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // always write a NL before the body content if there is any?
    const body = node.value as Body;
    if (body.bodyParts.length > 0) {
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions

  protected enter_solutions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const solutions = node.value as string[];
    if (solutions && solutions.length === 0) {
      // If there are no solutions, we need to write the special cloze gap [_] to indicate this
      this.writeOPU();
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> select

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> select -> options

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> select -> options -> optionsValue

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

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> highlight

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> highlight -> texts

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> highlight -> texts -> textsValue

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

  // bitmarkAst -> bits -> bitsValue -> cardNode

  protected enter_cardNode(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
    // Ignore cards for true-false-1
    const isTrueFalse1 = this.isTrueFalse1(route);
    if (isTrueFalse1) return;

    this.writeCardSetStart();
    this.writeNL();
  }

  protected between_cardNode(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    route: NodeInfo[],
  ): void {
    // Ignore cards for true-false-1
    const isTrueFalse1 = this.isTrueFalse1(route);
    if (isTrueFalse1) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_cardNode(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
    // Ignore cards for true-false-1
    const isTrueFalse1 = this.isTrueFalse1(route);
    if (isTrueFalse1) return;

    this.writeNL();
    this.writeCardSetEnd();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_elements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  protected exit_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements

  protected enter_statements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_statements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    route: NodeInfo[],
  ): void {
    const isTrueFalse1 = this.isTrueFalse1(route);

    if (!isTrueFalse1) {
      this.writeNL();
      this.writeCardSetCardDivider();
    }
    this.writeNL();
  }

  protected exit_statements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements -> statementsValue

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

  // bitmarkAst -> bits -> bitsValue -> choices
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices

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

  // bitmarkAst -> bits -> bitsValue -> choices -> choicesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices -> choicesValue

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

  // bitmarkAst -> bits -> bitsValue -> responses
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses

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

  // bitmarkAst -> bits -> bitsValue -> responses -> responsesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses -> responsesValue

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

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes

  protected enter_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_quizzes(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue

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

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    //
  }

  protected between_heading(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  protected exit_heading(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading -> forValues

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
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  protected exit_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_pairs(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue

  protected between_pairsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyAudio

  protected enter_keyAudio(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writeResource(resource);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyImage

  protected enter_keyImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writeResource(resource);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix

  protected enter_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_matrix(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix -> matrixValue

  protected between_matrixValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> values
  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix -> matrixValue -> cells -> cellsValue -> values

  protected enter_values(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetSideDivider();
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
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_questions(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions -> questionsValue

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

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_botResponses(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_botResponses(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue

  protected between_botResponsesValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  protected exit_botResponsesValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> response

  protected leaf_response(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPB();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> reaction

  protected leaf_reaction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('reaction', node.value, true);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> feedback

  protected leaf_feedback(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const feeback = node.value as string;
    if (feeback) {
      this.write(feeback);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> resource

  protected enter_resource(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writeResource(resource);
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage

  protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const posterImage = node.value as ImageResource;
    if (posterImage && posterImage.value) {
      this.writeProperty('posterImage', posterImage.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails
  // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  protected enter_thumbnails(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const thumbnails = node.value as ImageResource[];

    if (Array.isArray(thumbnails)) {
      const thumbnailKeys = ['src1x', 'src2x', 'src3x', 'src4x'];

      for (let i = 0; i < thumbnails.length; i++) {
        // Can only handle 4 thumbnails
        if (i === thumbnailKeys.length) break;
        const thumbnail = thumbnails[i];
        const key = thumbnailKeys[i];
        this.writeProperty(key, thumbnail.value, true);
      }
    }
  }

  //
  // Terminal nodes (leaves)
  //

  // bitmarkAst -> bits -> bitsValue -> bitType

  // bitmarkAst -> bits -> bitsValue -> textFormat

  //  bitmarkAst -> bits -> title

  protected leaf_title(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as string;
    const title = value;
    const bit = parent?.value as Bit;
    const level = bit.level || 1;
    if (level && title) {
      this.writeOP();
      for (let i = 0; i < +level; i++) this.writeHash();
      this.writeString(title);
      this.writeCL();
    }
  }

  //  bitmarkAst -> bits -> subtitle

  protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as string;
    const subtitle = value;
    const level = 2;
    if (level && subtitle) {
      this.writeOP();
      for (let i = 0; i < level; i++) this.writeHash();
      this.writeString(subtitle);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> book

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

  //  bitmarkAst -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDANGLE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  bitmarkAst -> bits -> bitsValue -> reference

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
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeOPQ();
      this.writeString(text);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeOPB();
      this.writeString(text);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> example

  protected leaf_example(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as Example | undefined;

    if (value === true) {
      this.writeOPA();
      this.writeString('example');
      this.writeCL();
    } else if (value) {
      this.writeOPA();
      this.writeString('example');

      if (value !== '') {
        this.writeColon();
        this.writeString(value);
      }

      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> body -> bodyValue -> bodyText

  protected leaf_bodyText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeString(text);
    }
  }

  // bitmarkAst -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeString(text);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> elements -> elementsValue

  protected leaf_elementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> prefix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> postfix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCaseSensitive

  // bitmarkAst -> bits -> bitsValue ->  * -> isLongAnswer

  // bitmarkAst -> bits -> bitsValue ->  * -> isCorrect

  // bitmarkAst -> bits -> bitsValue -> heading -> forKeys

  protected leaf_forKeys(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> heading -> forValuesValue

  protected leaf_forValuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> key
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> key

  protected leaf_key(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> values -> valuesValue
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> question

  protected leaf_question(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
      // this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> sampleSolution

  protected leaf_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDOLLAR();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> question -> isShortAnswer

  protected leaf_isShortAnswer(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // Generally, shortAnswer is the default.
    // Write long answer if shortAnswer is specifically false.
    if (node.value === false) {
      this.writeOPA();
      this.writeString('longAnswer');
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> statements -> text

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
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
    const value = node.value as string;
    this.writeProperty('caption', value);
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
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

  // protected enter_labelTrue(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[],
  // ): void {
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

      // Special cases (handled outside of the automatically generated handlers)
      if (astKey === PropertyKey.example) continue;
      if (astKey === PropertyKey.labelTrue) continue;
      if (astKey === PropertyKey.labelFalse) continue;
      if (astKey === PropertyKey.posterImage) continue;
      if (astKey === PropertyKey.partner) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[funcName] = (node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]) => {
        const value = node.value as unknown[] | undefined;
        if (value == null) return;

        // if (key === 'progress') debugger;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        if (parent?.key !== NodeType.bitsValue) return;

        // Write the property
        this.writeProperty(key, node.value, meta.isSingle, meta.ignoreFalse, meta.ignoreTrue);
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

  protected writeCardSetStart(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      this.write('++\n====');
    }
  }

  protected writeCardSetEnd(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      this.write('====\n++');
    }
  }

  protected writeCardSetCardDivider(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      this.write('====');
    }
  }

  protected writeCardSetSideDivider(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('==');
    } else {
      this.write('--');
    }
  }

  protected writeCardSetVariantDivider(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('--');
    } else {
      this.write('~~');
    }
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
  }

  protected writeResource(resource: Resource): boolean | void {
    const resourceAsArticle = resource as ArticleResource;

    if (resource) {
      // All resources should now be valid as they are validated in the AST
      // TODO: remove code below

      // // Check if a resource has a value, if not, we should not write it (or any of its chained properties)
      // let valid = false;
      // if (resource.value) {
      //   valid = true;
      // }

      // // Resource is not valid, cancel walking it's tree.
      // if (!valid) return false;

      // Special case for embedded resources
      if (resource.type === ResourceType.stillImageFilm) {
        const r = resource as StillImageFilmResource;
        this.writeResource(r.image);
        this.writeNL();
        this.writeResource(r.audio);
      } else {
        // Standard case
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
  }

  protected writeProperty(
    name: string,
    values?: unknown | unknown[],
    singleOnly?: boolean,
    ignoreFalse?: boolean,
    ignoreTrue?: boolean,
  ): void {
    let valuesArray: unknown[];
    let wroteSomething = false;

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
            if (ignoreTrue && val === true) continue;
            this.writeOPA();
            this.writeString(name);
            this.writeColon();
            this.writeString(`${val}`);
            this.writeCL();
            wroteSomething = true;
          }
        }
      }
    }

    if (!wroteSomething) {
      this.skipNLBetweenBitsValue = true;
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

  protected isTrueFalse1(route: NodeInfo[]) {
    const bitType = this.getBitType(route);
    return bitType === BitType.trueFalse1;
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
