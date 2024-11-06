import { Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { Config } from '../../config/Config';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { NodeTypeType, NodeType } from '../../model/ast/NodeType';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { CardSetVersion, CardSetVersionType } from '../../model/enum/CardSetVersion';
import { PropertyAstKey } from '../../model/enum/PropertyAstKey';
import { PropertyTag } from '../../model/enum/PropertyTag';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BooleanUtils } from '../../utils/BooleanUtils';
import { ObjectUtils } from '../../utils/ObjectUtils';
import { AstWalkerGenerator } from '../AstWalkerGenerator';

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
  Person,
  Example,
  MarkConfig,
  BodyPart,
  ImageSource,
  Ingredient,
  TechnicalTerm,
  Servings,
  RatingLevelStartEnd,
} from '../../model/ast/Nodes';

const DEFAULT_OPTIONS: BitmarkOptions = {
  debugGenerationInline: false,
};

/**
 * Bitmark generation options
 */
export interface BitmarkOptions {
  /**
   * If true, always include bitmark text format even if it is the default for the bit
   * If false, only include bitmark text format if it is not the default for the bit
   */

  explicitTextFormat?: boolean;

  /**
   * Prettify the JSON in the bitmark body.
   *
   * If not set or false, JSON will not be prettified.
   * If true, JSON will be prettified with an indent of 2.
   * If a positive integer, JSON will be prettified with an indent of this number.
   */
  prettifyJson?: boolean | number;

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
class BitmarkGenerator extends AstWalkerGenerator<BitmarkAst, void> {
  protected ast = new Ast();
  private bitmarkVersion: BitmarkVersionType;
  private options: BitmarkOptions;
  private writer: Writer;
  private prettifySpace: number | undefined;

  // State
  private skipNLBetweenBitsValue = false;
  private wroteSomething = false;

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
    super();

    this.bitmarkVersion = BitmarkVersion.fromValue(options?.bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options?.bitmarkOptions,
    };

    this.debugGenerationInline = this.options.debugGenerationInline ?? false;

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

    // Calculate the prettify space
    this.prettifySpace = this.options.prettifyJson === true ? 2 : this.options.prettifyJson || undefined;

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
    this.wroteSomething = false;
    this.printed = false;
  }

  private walkAndWrite(ast: BitmarkAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, NodeType.bitmarkAst, this, undefined);

    // Ensure a blank line at end of file
    this.writeLine();
  }

  //
  // NODE HANDLERS
  //

  //
  // Non-Terminal nodes (branches)
  //

  // bitmark

  // bitmarkAst -> bits

  protected between_bits(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    const bitConfig = Config.getBitConfig(bit.bitType);
    const bitResourcesConfig = Config.getBitResourcesConfig(bit.bitType, bit.resourceType);

    // Write the bit tag opening
    this.writeOPD(bit.bitLevel);

    if (bit.isCommented) this.writeString('|');
    this.writeString(bit.bitType);

    if (bit.textFormat) {
      const write = this.isWriteTextFormat(bit.textFormat, bitConfig.textFormatDefault);

      if (write) {
        this.writeColon();
        this.writeString(bit.textFormat);
      }
    }

    // Use the bitConfig to see if we need to write the resourceType attachment
    let resourceType: ResourceTagType | undefined;
    if (bitConfig.resourceAttachmentAllowed && bit.resources && bit.resources.length > 0) {
      const comboMap = bitResourcesConfig.comboResourceTagTypesMap;

      if (bitResourcesConfig.comboResourceTagTypesMap.size > 0) {
        // The resource is a combo resource
        // Extract the resource types from the combo resource
        // NOTE: There should only ever be one combo resource per bit, but the code can handle multiple
        // except for overwriting resourceJson
        for (const comboTagType of comboMap.keys()) {
          resourceType = comboTagType;
        }
      } else {
        // Get the resourceType from the first resource and write it as the attachment resourceType
        resourceType = bit.resources[0].type;
      }
    }

    if (resourceType) {
      this.writeAmpersand();
      this.writeString(resourceType);
    }

    this.writeCL();
    this.writeNL();
  }

  protected between_bitsValue(node: NodeInfo, left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void {
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

    this.writeNlBetween(node, left, right, route, noNlKeys);
  }

  // bitmarkAst -> bits -> bitsValue -> internalComment

  protected enter_internalComment(node: NodeInfo, route: NodeInfo[]): void {
    const internalComment = node.value as BreakscapedString[];

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    for (let i = 0; i < internalComment.length; i++) {
      const comment = internalComment[i];
      const last = i === internalComment.length - 1;
      this.writeProperty('internalComment', comment);
      if (!last) this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> labelTrue / labelFalse

  protected enter_labelTrue(node: NodeInfo, route: NodeInfo[]): void {
    const value = node.value as string | undefined;

    // Ignore example that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const bit = parent?.value as Bit;
    if (bit) {
      if (value != '') this.writeProperty(PropertyTag.labelTrue, value, true);
      if (bit.labelFalse && bit.labelFalse[0] != '') this.writeProperty(PropertyTag.labelFalse, bit.labelFalse, true);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> imageSource

  protected enter_imageSource(node: NodeInfo, route: NodeInfo[]): void {
    const imageSource = node.value as ImageSource;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const { url, mockupId, size, format, trim } = imageSource;

    this.writeProperty('imageSource', url, true);
    if (url) {
      if (mockupId) this.writeProperty('mockupId', mockupId, true);
      if (size) this.writeProperty('size', size, true);
      if (format) this.writeProperty('format', format, true);
      if (BooleanUtils.isBoolean(trim)) this.writeProperty('trim', trim, true);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> technicalTerm

  protected enter_technicalTerm(node: NodeInfo, route: NodeInfo[]): void {
    const nodeValue = node.value as TechnicalTerm;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const { technicalTerm, lang } = nodeValue;

    this.writeProperty('technicalTerm', technicalTerm, true);
    if (lang != null) this.writeProperty('lang', lang);
  }

  // bitmarkAst -> bits -> bitsValue -> servings

  protected enter_servings(node: NodeInfo, route: NodeInfo[]): void {
    const nodeValue = node.value as Servings;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const { servings, unit, unitAbbr, decimalPlaces, disableCalculation } = nodeValue;

    this.writeProperty('servings', servings, true);
    if (unit != null) this.writeProperty('unit', unit);
    if (unitAbbr != null) this.writeProperty('unitAbbr', unitAbbr);
    if (decimalPlaces != null) this.writeProperty('decimalPlaces', decimalPlaces);
    if (disableCalculation != null) this.writeProperty('disableCalculation', disableCalculation);
  }

  // bitmarkAst -> bits -> bitsValue -> person

  protected enter_person(node: NodeInfo, route: NodeInfo[]): void {
    const person = node.value as Person;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const { name, title, avatarImage } = person;

    this.writeProperty('person', name, true);
    if (title) {
      this.writeProperty('title', title, true);
    }
    if (avatarImage) {
      this.writeResource(avatarImage);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> ratingLevelStart
  protected enter_ratingLevelStart(node: NodeInfo, route: NodeInfo[]): boolean {
    this.enterRatingLevelStartEndCommon(node, route);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> ratingLevelEnd
  protected enter_ratingLevelEnd(node: NodeInfo, route: NodeInfo[]): boolean {
    this.enterRatingLevelStartEndCommon(node, route);

    // Stop traversal of this branch
    return false;
  }

  // Common code for ratingLevelStart and ratingLevelEnd
  protected enterRatingLevelStartEndCommon(node: NodeInfo, route: NodeInfo[]): void {
    const n = node.value as RatingLevelStartEnd;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const { level, label } = n;
    const levelKey = node.key === NodeType.ratingLevelStart ? PropertyTag.ratingLevelStart : PropertyTag.ratingLevelEnd;

    this.writeProperty(levelKey, level, true);
    if (label) {
      this.writeProperty('label', label, true);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> markConfigValue

  protected enter_markConfigValue(node: NodeInfo, route: NodeInfo[]): void {
    const markConfig = node.value as MarkConfig;

    // Ignore values that are not at the correct level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.markConfig) return;

    const { mark, color, emphasis } = markConfig;

    if (mark) {
      this.writeProperty('mark', mark, true);
      if (color) this.writeProperty('color', color, true);
      if (emphasis) this.writeProperty('emphasis', emphasis, true);
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> partialAnswer
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> partialAnswer

  protected leaf_partialAnswer(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('partialAnswer', node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> sampleSolution
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> sampleSolution

  protected leaf_sampleSolution(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('sampleSolution', node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> reasonableNumOfChars
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> reasonableNumOfChars

  protected leaf_reasonableNumOfChars(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('reasonableNumOfChars', node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> additionalSolutions

  protected between_additionalSolutions(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.questionsValue) return;

    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> additionalSolutions -> additionalSolutionsValue

  protected leaf_additionalSolutionsValue(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route, 2);
    if (parent?.key !== NodeType.questionsValue) return;

    this.writeProperty('additionalSolutions', node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> itemLead

  protected enter_itemLead(node: NodeInfo, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    if (itemLead && (itemLead.item || itemLead.lead || itemLead.pageNumber || itemLead.marginNumber)) {
      // Always write item if item or lead is set
      this.writeOPC();
      this.writeString(itemLead.item || '');
      this.writeCL();

      if (itemLead.lead || itemLead.pageNumber || itemLead.marginNumber) {
        this.writeOPC();
        this.writeString(itemLead.lead || '');
        this.writeCL();
      }

      if (itemLead.pageNumber || itemLead.marginNumber) {
        this.writeOPC();
        this.writeString(itemLead.pageNumber || '');
        this.writeCL();
      }

      if (itemLead.marginNumber) {
        this.writeOPC();
        this.writeString(itemLead.marginNumber || '');
        this.writeCL();
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, route: NodeInfo[]): void {
    // always write a NL before the body content if there is any?
    const body = node.value as Body;
    if ((body.bodyParts && body.bodyParts.length > 0) || body.bodyJson) {
      this.writeNL();

      // Write the plain text divider if not bitmark++/-- format
      const textFormat = this.getTextFormat(route);
      const isBitmarkText = textFormat === TextFormat.bitmarkPlusPlus || textFormat === TextFormat.bitmarkMinusMinus;
      if (!isBitmarkText) {
        this.writePlainTextDivider();
        this.writeNL();
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> solutions

  protected enter_solutions(node: NodeInfo, _route: NodeInfo[]): void {
    const solutions = node.value as string[];
    if (solutions && solutions.length === 0) {
      // If there are no solutions, we need to write the special cloze gap [_] to indicate this
      this.writeOPU();
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> solution

  protected leaf_solution(node: NodeInfo, route: NodeInfo[]): void {
    const solution = node.value as string;

    // Ignore values that are not at the correct level as they might be handled elsewhere
    const bodyPartsValue: BodyPart | undefined = this.getParentNode(route, 2)?.value;
    if (bodyPartsValue?.type !== BodyBitType.mark) return;

    if (solution) {
      this.writeOPE();
      this.writeString(solution);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> mark

  protected leaf_mark(node: NodeInfo, route: NodeInfo[]): void {
    const mark = node.value as string;

    // Ignore values that are not at the correct level as they might be handled elsewhere
    const bodyPartsValue: BodyPart | undefined = this.getParentNode(route, 2)?.value;
    if (bodyPartsValue?.type !== BodyBitType.mark) return;

    if (mark) {
      this.writeProperty('mark', mark, true);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> options -> optionsValue

  protected enter_optionsValue(node: NodeInfo, _route: NodeInfo[]): void {
    const selectOption = node.value as SelectOption;
    if (selectOption.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(selectOption.text);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> texts -> textsValue

  protected enter_textsValue(node: NodeInfo, _route: NodeInfo[]): void {
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

  protected enter_cardNode(_node: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards for xxx-1
    const isBitType1 = this.isOfBitType1(route);
    if (isBitType1) return;

    this.writeCardSetStart();
    this.writeNL();
  }

  protected between_cardNode(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards for xxx-1
    const isBitType1 = this.isOfBitType1(route);
    if (isBitType1) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_cardNode(_node: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards for xxx-1
    const isBitType1 = this.isOfBitType1(route);
    if (isBitType1) return;

    this.writeNL();
    this.writeCardSetEnd();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_elements(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  protected exit_elements(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards

  protected between_flashcards(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue

  protected between_flashcardsValue(_node: NodeInfo, _left: NodeInfo, right: NodeInfo, _route: NodeInfo[]): void {
    if (right.key === NodeType.answer) {
      this.writeNL();
      this.writeCardSetSideDivider();
      this.writeNL();
    } else if (right.key === NodeType.alternativeAnswers) {
      this.writeNL();
      this.writeCardSetVariantDivider();
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> answer

  protected leaf_answer(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore responses that are not at the flashcardsValue level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.flashcardsValue) return;

    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> alternativeAnswers

  protected between_alternativeAnswers(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> alternativeAnswers -> alternativeAnswersValue

  protected leaf_alternativeAnswersValue(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore responses that are not at the alternativeAnswers level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.alternativeAnswers) return;

    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> alternativeDefinitions

  protected between_alternativeDefinitions(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> alternativeDefinitions -> alternativeDefinitionsValue

  protected leaf_alternativeDefinitionsValue(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore responses that are not at the alternativeDefinitions level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.alternativeDefinitions) return;

    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements

  protected enter_statements(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_statements(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const isTrueFalse1 = this.isOfBitType(route, BitType.trueFalse1);

    if (!isTrueFalse1) {
      this.writeNL();
      this.writeCardSetCardDivider();
    }
    this.writeNL();
  }

  protected exit_statements(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements -> statementsValue

  protected enter_statementsValue(node: NodeInfo, _route: NodeInfo[]): void {
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

  protected between_choices(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  protected exit_choices(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> choices -> choicesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices -> choicesValue

  protected enter_choicesValue(node: NodeInfo, _route: NodeInfo[]): void {
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

  protected between_responses(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  protected exit_responses(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> responses -> responsesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses -> responsesValue

  protected enter_responsesValue(node: NodeInfo, _route: NodeInfo[]): void {
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

  protected enter_quizzes(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_quizzes(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    // this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_quizzes(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue

  protected between_quizzesValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,

    _route: NodeInfo[],
  ): void {
    if (right.key === NodeType.choices || right.key === NodeType.responses) {
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(_node: NodeInfo, _route: NodeInfo[]): boolean | void {
    //
  }

  protected between_heading(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  protected exit_heading(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading -> forValues

  protected enter_forValues(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_forValues(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  protected exit_forValues(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_pairs(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_pairs(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue

  protected between_pairsValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyAudio

  protected enter_keyAudio(node: NodeInfo, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writeResource(resource);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyImage

  protected enter_keyImage(node: NodeInfo, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writeResource(resource);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix

  protected enter_matrix(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_matrix(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_matrix(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix -> matrixValue

  protected between_matrixValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> values
  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix -> matrixValue -> cells -> cellsValue -> values

  protected enter_values(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  protected between_values(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table

  protected between_table(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> rows

  protected between_rows(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.table) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> columns
  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> columns

  protected between_columns(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    const parentKey = parent?.key;
    if (parentKey !== NodeType.table && parentKey !== NodeType.captionDefinitionList) return;

    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> columns -> columnsValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> columns -> columnsValue

  protected leaf_columnsValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    if (node.value) this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> rows -> rowsValue

  protected between_rowsValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.rows) return;

    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> rows -> rowsValue -> rowsValueValue

  protected leaf_rowsValueValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) this.write(node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList

  protected between_captionDefinitionList(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions

  // protected between_definitions(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
  //   const parent = this.getParentNode(route);
  //   if (parent?.key !== NodeType.captionDefinitionList) return;

  //   this.writeNL();
  //   this.writeCardSetCardDivider();
  //   this.writeNL();
  // }

  // // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue

  // protected between_definitionsValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
  //   const parent = this.getParentNode(route);
  //   if (parent?.key !== NodeType.definitions) return;

  //   this.writeNL();
  //   this.writeCardSetSideDivider();
  //   this.writeNL();
  // }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue -> term
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> term

  protected leaf_term(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return;

    if (node.value) this.write(node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue -> description
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> description

  protected leaf_description(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return;

    if (node.value) this.write(node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions

  protected between_definitions(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode && parent?.key !== NodeType.captionDefinitionList) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue

  protected between_definitionsValue(_node: NodeInfo, _left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitions) return;

    if (right.key === NodeType.description) {
      this.writeNL();
      this.writeCardSetSideDivider();
      this.writeNL();
    } else if (right.key === NodeType.alternativeDefinitions) {
      this.writeNL();
      this.writeCardSetVariantDivider();
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_questions(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_questions(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions -> questionsValue

  protected between_questionsValue(
    node: NodeInfo,
    left: NodeInfo,
    right: NodeInfo,

    route: NodeInfo[],
  ): void {
    // The following keys are combined with other keys so don't need newlines
    const noNlKeys: NodeTypeType[] = [
      //
    ];

    this.writeNlBetween(node, left, right, route, noNlKeys);
  }

  protected exit_questionsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients

  protected enter_ingredients(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_ingredients(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_ingredients(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients -> ingredientsValue

  protected enter_ingredientsValue(node: NodeInfo, _route: NodeInfo[]): void {
    const ingredient = node.value as Ingredient;

    if (ingredient.title != null) {
      this.writeOPHASH();
      this.writeString(ingredient.title);
      this.writeCL();
      this.writeNL();
    }

    // [+] / [-]
    if (ingredient.checked) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.writeCL();

    // [!43]
    if (ingredient.quantity != null) {
      this.writeOPB();
      this.writeString(`${ingredient.quantity}`);
      this.writeCL();
    }

    // [@unit:kilograms]
    if (ingredient.unit != null) this.writeProperty('unit', ingredient.unit, true);

    // [@unitAbbr:kg]
    if (ingredient.unitAbbr != null) this.writeProperty('unitAbbr', ingredient.unitAbbr, true);

    // [@decimalPlaces:1]
    if (ingredient.decimalPlaces != null) this.writeProperty('decimalPlaces', ingredient.decimalPlaces, true);

    // [@disableCalculation]
    if (ingredient.disableCalculation) this.writeProperty('disableCalculation', true, true);

    // item
    if (ingredient.item != null) this.write(ingredient.item);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_botResponses(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_botResponses(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue

  protected between_botResponsesValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  protected exit_botResponsesValue(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> cardBits

  protected enter_cardBits(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_cardBits(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_cardBits(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> response

  protected leaf_response(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPB();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> reaction

  protected leaf_reaction(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('reaction', node.value, true);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> feedback

  protected leaf_feedback(node: NodeInfo, _route: NodeInfo[]): void {
    const feeback = node.value as string;
    if (feeback) {
      this.write(feeback);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> resources

  protected between_resources(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> resourcesValue

  protected enter_resourcesValue(node: NodeInfo, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writeResource(resource);
  }

  // bitmarkAst -> bits -> bitsValue -> imagePlaceholder
  protected enter_imagePlaceholder(node: NodeInfo, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource, so handle it with the common code
    this.writePropertyStyleResource(node.key, resource);
  }

  protected exit_imagePlaceholder(_node: NodeInfo, _route: NodeInfo[]): boolean | void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> posterImage
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage

  protected enter_posterImage(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue) {
      // Bit poster image
      const posterImage = node.value as string;
      if (posterImage) {
        this.writeProperty('posterImage', posterImage);
      }
    } else {
      // Resource poster image
      const posterImage = node.value as ImageResource;
      if (posterImage && posterImage.value) {
        this.writeProperty('posterImage', posterImage.value);
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails
  // [src1x,src2x,src3x,src4x,width,height,alt,zoomDisabled,caption]

  protected enter_thumbnails(node: NodeInfo, _route: NodeInfo[]): void {
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

  protected leaf_title(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);

    // Ensure this is at the bit level
    if (parent?.key !== NodeType.bitsValue) return;

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

  protected leaf_subtitle(node: NodeInfo, _route: NodeInfo[]): void {
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

  protected leaf_book(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
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

  protected leaf_anchor(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDANGLE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  bitmarkAst -> bits -> bitsValue -> reference

  protected leaf_reference(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
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

  protected leaf_hint(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeOPQ();
      this.writeString(text);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeOPB();
      this.writeString(text);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> example

  protected leaf_example(node: NodeInfo, route: NodeInfo[]): void {
    const value = node.value as Example | undefined;
    const parent = this.getParentNode(route);
    const isExample = parent?.value.isExample ?? false;
    const isDefaultExample = parent?.value.isDefaultExample ?? false;

    if (!isExample) return;

    if (isDefaultExample) {
      this.writeOPA();
      this.writeString('example');
      this.writeCL();
    } else if (value != null) {
      this.writeOPA();
      this.writeString('example');
      this.writeColon();

      if (value === true) {
        this.writeString('true');
      } else if (value === false) {
        this.writeString('false');
      } else {
        // String
        this.writeString(value);
      }
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> body -> bodyValue -> bodyText

  protected leaf_bodyText(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeString(text);
    }
  }

  // bitmarkAst -> bits -> body -> bodyValue -> bodyJson

  protected enter_bodyJson(node: NodeInfo, _route: NodeInfo[]): boolean {
    const value = node.value as unknown;
    if (Array.isArray(value) || ObjectUtils.isObject(value)) {
      const text = JSON.stringify(value, null, this.prettifySpace);
      if (text) {
        this.writeString(text);
      }
    }

    // Stop traversal of this branch to avoid processing the bodyJson
    return false;
  }

  // bitmarkAst -> bits -> footer

  protected enter_footer(_node: NodeInfo, _route: NodeInfo[]): void {
    this.write('~~~~');
    this.writeNL();
  }

  // bitmarkAst -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    const text = value;
    if (text) {
      this.writeString(text);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> elements -> elementsValue

  protected leaf_elementsValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value != null) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> prefix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> postfix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCaseSensitive

  protected leaf_isCaseSensitive(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('isCaseSensitive', node.value, true, false, true);
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCorrect

  // bitmarkAst -> bits -> bitsValue -> heading -> forKeys

  protected leaf_forKeys(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> heading -> forValuesValue

  protected leaf_forValuesValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> key
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> key

  protected leaf_key(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> values -> valuesValue
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> question
  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> question

  protected leaf_question(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore responses that are not at the questionsValue level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.questionsValue && parent?.key !== NodeType.flashcardsValue) return;

    if (node.value) {
      this.writeString(node.value);
      // this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> statements -> text

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,zoomDisabled,caption]

  protected leaf_src1x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src1x', node.value);
  }

  protected leaf_src2x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src2x', node.value);
  }

  protected leaf_src3x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src3x', node.value);
  }

  protected leaf_src4x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src4x', node.value);
  }

  protected leaf_width(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('width', node.value);
  }

  protected leaf_height(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('height', node.value);
  }

  protected leaf_alt(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('alt', node.value);
  }

  protected leaf_zoomDisabled(node: NodeInfo, route: NodeInfo[]): void {
    const bitType = this.getBitType(route);

    if (
      Config.isOfBitType(bitType, [
        BitType.imageSeparator,
        BitType.pageBanner,
        BitType.imagesLogoGrave,
        BitType.prototypeImages,
      ])
    ) {
      this.writeProperty('zoomDisabled', node.value, undefined, false, true);
    } else {
      this.writeProperty('zoomDisabled', node.value, undefined, true, false);
    }
  }

  protected leaf_license(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('license', node.value);
  }

  protected leaf_copyright(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('copyright', node.value);
  }

  protected leaf_provider(_node: NodeInfo, _route: NodeInfo[]): void {
    // provider is included in the url (it is the domain) and should not be written as a property
    // this.writeProperty('provider', node.value);
  }

  protected leaf_showInIndex(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('showInIndex', node.value);
  }

  protected leaf_caption(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    this.writeProperty('caption', value);
  }

  protected leaf_search(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    this.writeProperty('search', value);
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [duration,mute,autoplay,allowSubtitles,showSubtitles]

  protected leaf_duration(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore duration that IS at the bit level as there is a key clash with resource...duration / bit.duration
    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue) return;

    this.writeProperty('duration', node.value);
  }

  protected leaf_mute(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('mute', node.value);
  }

  protected leaf_autoplay(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('autoplay', node.value);
  }

  protected leaf_allowSubtitles(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('allowSubtitles', node.value);
  }

  protected leaf_showSubtitles(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('showSubtitles', node.value);
  }

  //
  // Generated Node Handlers
  //

  /**
   * Generate the handlers for properties, as they are mostly the same, but not quite
   */

  // protected enter_labelTrue(node: NodeInfo, _route: NodeInfo[],
  // ): void {
  //   const bit = parent?.value as Bit;
  //   if (bit) {
  //     this.writeProperty('labelTrue', node.value ?? '', true);
  //     this.writeProperty('labelFalse', bit.labelFalse ?? '', true);
  //   }
  // }

  protected generatePropertyHandlers() {
    const propertiesConfig = Config.getRawPropertiesConfig();

    for (const propertyConfig of Object.values(propertiesConfig)) {
      const astKey = propertyConfig.astKey ?? propertyConfig.tag;

      // Special cases (handled outside of the automatically generated handlers)
      if (astKey === PropertyTag.internalComment) continue;
      if (astKey === PropertyTag.example) continue;
      if (astKey === PropertyTag.labelTrue) continue;
      if (astKey === PropertyTag.labelFalse) continue;
      if (astKey === PropertyTag.posterImage) continue;
      if (astKey === PropertyTag.imageSource) continue;
      if (astKey === PropertyTag.imagePlaceholder) continue;
      if (astKey === PropertyTag.technicalTerm) continue;
      if (astKey === PropertyTag.servings) continue;
      if (astKey === PropertyTag.person) continue;
      if (astKey === PropertyAstKey.ast_markConfig) continue;
      if (astKey === PropertyTag.ratingLevelStart) continue;
      if (astKey === PropertyTag.ratingLevelEnd) continue;

      const enterFuncName = `enter_${astKey}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[enterFuncName] = (node: NodeInfo, route: NodeInfo[]) => {
        const value = node.value as unknown[] | undefined;
        if (value == null) return;

        // if (propertyConfig.tag === 'progress') debugger;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        const parent = this.getParentNode(route);
        if (parent?.key !== NodeType.bitsValue) return;

        // Write the property
        this.writeProperty(
          propertyConfig.tag,
          node.value,
          propertyConfig.single,
          propertyConfig.defaultValue === 'false',
          propertyConfig.defaultValue === 'true',
        );
      };

      // Bind this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[enterFuncName] = (this as any)[enterFuncName].bind(this);
    }
  }

  protected writeNlBetween(
    node: NodeInfo,
    left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
    // The following keys are combined with other keys so don't need newlines
    noNlKeys: NodeTypeType[],
  ): void {
    const bit = node.value as Bit;
    if (bit.book) {
      // If the book node exists, remove the newline caused by reference as it will be bound to book
      noNlKeys.push(NodeType.reference);
    }

    // Check if a no newline key is to the left in this 'between' callback
    const noNl = ((): boolean => {
      if (!this.wroteSomething || this.skipNLBetweenBitsValue) {
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

    this.skipNLBetweenBitsValue = false;
    this.wroteSomething = false;
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

  protected writeOPD(level: number): void {
    this.write(`[${'.'.repeat(level)}`);
  }

  protected writeOPU(): void {
    this.write('[_');
  }

  protected writeOPE(): void {
    this.write('[=');
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
    // HACK to fix breakscaping when string ends with a ^ (must add a space)
    this.writer.getLastWrite().endsWith('^') ? this.write(' ]') : this.write(']');
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

  protected writePlainTextDivider(): void {
    this.write('$$$$');
  }

  protected writeCardSetStart(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('\n===');
    } else {
      this.write('\n====');
    }
  }

  protected writeCardSetEnd(): void {
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      // this.write('~~~~'); // Written by the footer
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
      this.write('++');
    }
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
  }

  protected writePropertyStyleResource(key: string, resource: Resource): boolean | void {
    const resourceAsArticle = resource as ArticleResource;

    if (key && resource) {
      this.writeOPA();
      this.writeString(key);
      if (resource.type === ResourceTag.article && resourceAsArticle.value) {
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

      // Standard case
      this.writeOPAMP();
      this.writeString(resource.typeAlias ?? resource.type);
      if (resource.type === ResourceTag.article && resourceAsArticle.value) {
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

        let propertyIndex = 0;
        for (const val of valuesArray) {
          if (val !== undefined) {
            if (ignoreFalse && val === false) continue;
            if (ignoreTrue && val === true) continue;
            if (propertyIndex > 0) this.writeNL();
            this.writeOPA();
            this.writeString(name);
            this.writeColon();
            this.writeString(`${val}`);
            this.writeCL();
            wroteSomething = true;
            propertyIndex++;
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

  //
  // Helper functions
  //

  protected isWriteTextFormat(bitsValue: string, textFormatDefault: TextFormatType): boolean {
    const isDefault = TextFormat.fromValue(bitsValue) === textFormatDefault;
    const writeFormat = !isDefault || this.options.explicitTextFormat;
    return !!writeFormat;
  }

  protected getTextFormat(route: NodeInfo[]): TextFormatType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.textFormat;
      }
    }

    return undefined;
  }

  protected isOfBitType1(route: NodeInfo[]): boolean {
    return this.isOfBitType(route, [BitType.trueFalse1, BitType.multipleChoice1, BitType.multipleResponse1]);
  }

  protected isOfBitType(route: NodeInfo[], baseBitType: BitTypeType | BitTypeType[]): boolean {
    const bt = this.getBitType(route);
    return Config.isOfBitType(bt, baseBitType);
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
    if (value) this.wroteSomething = true;
    this.writer.write(value);
    return this;
  }

  /**
   * Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.
   * @param value - The line to write. When omitted, only the endOfLineString is written.
   */
  writeLine(value?: string): this {
    if (value) this.wroteSomething = true;
    this.writer.writeLine(value);
    return this;
  }

  /**
   * Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.
   * @param values - The lines to write.
   * @param delimiter - An optional delimiter to be written at the end of each line, except for the last one.
   */
  writeLines(values: string[], delimiter?: string): this {
    if (values.length > 0 && values.reduce((acc, v) => (v ? true : acc), false)) this.wroteSomething = true;
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
