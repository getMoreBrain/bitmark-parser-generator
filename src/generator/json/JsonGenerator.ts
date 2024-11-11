import { Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { NodeType } from '../../model/ast/NodeType';
import { BitmarkAst, Bit } from '../../model/ast/Nodes';
import { Example, ExtraProperties } from '../../model/ast/Nodes';
import { Body, CardBit, Footer } from '../../model/ast/Nodes';
import { BitmarkTextNode, JsonText, TextAst, TextNode, TextNodeAttibutes } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyAstKey } from '../../model/enum/PropertyAstKey';
import { PropertyTag } from '../../model/enum/PropertyTag';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { TextNodeType } from '../../model/enum/TextNodeType';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { ImageResourceWrapperJson, ResourceJson, ResourceWrapperJson } from '../../model/json/ResourceJson';
import { ParserInfo } from '../../model/parser/ParserInfo';
import { TextParser } from '../../parser/text/TextParser';
import { ArrayUtils } from '../../utils/ArrayUtils';
import { BooleanUtils } from '../../utils/BooleanUtils';
import { NumberUtils } from '../../utils/NumberUtils';
import { StringUtils } from '../../utils/StringUtils';
import { AstWalkerGenerator } from '../AstWalkerGenerator';

import {
  BitJson,
  BotResponseJson,
  CaptionDefinitionListJson,
  ChoiceJson,
  DescriptionListItemJson as DescriptionListItemJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  ImageSourceJson,
  IngredientJson,
  ListItemJson,
  MarkConfigJson,
  MatrixJson,
  PairJson,
  PersonJson,
  QuestionJson,
  QuizJson,
  RatingLevelStartEndJson,
  ResponseJson,
  StatementJson,
  TableJson,
} from '../../model/json/BitJson';

const DEFAULT_OPTIONS: JsonOptions = {
  // debugGenerationInline: true,
};

/**
 * JSON output options
 */
export interface JsonOptions {
  /**
   * Enable parser warnings.
   *
   * If not set or false, parser warnings will not be included in the output.
   * If true, any parser warnings will be included in the output.
   */
  enableWarnings?: boolean | number;

  /**
   * Prettify the JSON.
   *
   * If not set or false, JSON will not be prettified.
   * If true, JSON will be prettified with an indent of 2.
   * If a positive integer, JSON will be prettified with an indent of this number.
   *
   * If prettify is set, a string will be returned if possible.
   */
  prettify?: boolean | number;

  /**
   * Stringify the JSON.
   *
   * If not set or false, JSON will be returned as a plain JS object.
   * It true, JSON will be stringified.
   *
   * If prettify is set, it will override this setting.
   */
  stringify?: boolean;

  /**
   * Output text as plain text rather than parsed bitmark text
   *
   * If not set, the default for the bitmark version will be used.
   * If false, text will be output as parsed bitmark text.
   * It true, text will be output as plain text strings.
   */
  textAsPlainText?: boolean;

  /**
   * Exclude unknown properties in the output.
   *
   * If not set or false, unknown properties will be included in the JSON output.
   * It true, unknown properties will NOT be included in the JSON output.
   *
   */
  excludeUnknownProperties?: boolean;

  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

/**
 * JSON generator options
 */
export interface JsonGeneratorOptions {
  /**
   * bitmarkVersion - The version of bitmark to output.
   * If not specified, the version will default to 3.
   *
   * Specifying the version will set defaults for other options.
   * - Bitmark v2:
   *   - textAsPlainText: true
   * - Bitmark v3:
   *   - textAsPlainText: false
   */
  bitmarkVersion?: BitmarkVersionType;

  /**
   * The options for JSON generation.
   */
  jsonOptions?: JsonOptions;
}

interface ExampleNode {
  isExample: boolean;
  example?: Example | undefined;
  isDefaultExample: boolean;
}

interface ExampleJsonWrapper {
  isExample: boolean;
  example: ExampleJson;
}

/**
 * Generate bitmark JSON from a bitmark AST
 *
 *
 */
class JsonGenerator extends AstWalkerGenerator<BitmarkAst, void> {
  protected ast = new Ast();
  private bitmarkVersion: BitmarkVersionType;
  private textParserVersion: string;
  private textParser = new TextParser();

  // TODO - move to context
  private options: JsonOptions;
  private jsonPrettifySpace: number | undefined;
  private writer: Writer;

  // State
  private json: Partial<BitWrapperJson>[] = [];
  private bitWrapperJson: Partial<BitWrapperJson> = {};
  private bitJson: Partial<BitJson> = {};
  private textDefault: JsonText = Breakscape.EMPTY_STRING;
  private bodyDefault: JsonText = Breakscape.EMPTY_STRING;
  private bodyJson: JsonText = this.bodyDefault;
  private listItem: ListItemJson | undefined;

  /**
   * Generate bitmark JSON from a bitmark AST
   *
   * @param writer - destination for the output
   * @param options - JSON generation options
   */
  constructor(writer: Writer, options?: JsonGeneratorOptions) {
    super();

    this.bitmarkVersion = BitmarkVersion.fromValue(options?.bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.textParserVersion = this.textParser.version();
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options?.jsonOptions,
    };

    this.debugGenerationInline = this.options.debugGenerationInline ?? false;
    this.jsonPrettifySpace = this.options.prettify === true ? 2 : this.options.prettify || undefined;

    // Set defaults according to bitmark version
    if (this.bitmarkVersion === BitmarkVersion.v2) {
      if (this.options.textAsPlainText === undefined) {
        this.options.textAsPlainText = true;
      }
    } else {
      if (this.options.textAsPlainText === undefined) {
        this.options.textAsPlainText = false;
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

    // Write the JSON object to file
    this.write(JSON.stringify(this.json, null, this.jsonPrettifySpace));

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
    this.json = [];
    this.bitWrapperJson = {};
    this.bitJson = {};
    this.textDefault = this.options.textAsPlainText ? Breakscape.EMPTY_STRING : [];
    this.bodyDefault = this.options.textAsPlainText ? Breakscape.EMPTY_STRING : [];
    this.bodyJson = this.bodyDefault;

    this.printed = false;
  }

  private walkAndWrite(ast: BitmarkAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, NodeType.bitmarkAst, this, undefined);
  }

  //
  // NODE HANDLERS
  //

  //
  // Non-Terminal nodes (branches)
  //

  // bitmark

  protected enter_bitmarkAst(_node: NodeInfo, _route: NodeInfo[]): void {
    // Reset the JSON
    this.json = [];
  }

  // bitmarkAst -> bits

  // bitmarkAst -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    // Reset
    this.bitWrapperJson = {
      //
    };
    this.json.push(this.bitWrapperJson);

    this.bitJson = this.createBitJson(bit);
    this.bitWrapperJson.bit = this.bitJson as BitJson;

    // Handle example at the root level - this is bit dependent; configuration is in the bit metadata
    // There is same logic here to select the correct default value of the example is the default is
    // required, and this is bit depenedent.
    // This is ugly, but it is even uglier if the defaults at set in the AST.

    const bitConfig = Config.getBitConfig(bit.bitType);
    const hasRootExample = !!bitConfig.rootExampleType;
    const isBoolean = bitConfig.rootExampleType === ExampleType.boolean;

    if (hasRootExample) {
      // Calculate the value of the default example
      let defaultExample: string | boolean;
      if (isBoolean) {
        // Boolean example
        defaultExample = true;
        if (Config.isOfBitType(bit.bitType, BitType.trueFalse1)) {
          if (bit.cardNode?.statement?.isCorrect !== undefined) {
            defaultExample = bit.cardNode.statement.isCorrect;
          }
        }
      } else {
        // String example
        defaultExample = (ArrayUtils.asSingle(bit.sampleSolution) as string) ?? '';
      }

      const exampleRes = this.toExample(bit as ExampleNode, {
        defaultExample,
        isBoolean,
      });
      this.bitJson.isExample = exampleRes.isExample;
      this.bitJson.example = exampleRes.example;
    } else if (bit.isExample) {
      this.bitJson.isExample = true;
    }
  }

  protected exit_bitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    // Clean up the bit JSON, removing any unwanted values
    this.cleanAndSetDefaultsForBitJson(this.bitJson);
  }

  // bitmarkAst -> bits -> bitsValue -> imageSource

  protected enter_imageSource(node: NodeInfo, route: NodeInfo[]): void {
    const imageSourceJson = node.value as ImageSourceJson;
    // const imageSource = node.value as ImageSource;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    // const { url, mockupId, size, format, trim } = imageSource;

    // const imageSourceJson = {} as ImageSourceJson;
    // this.addProperty(imageSourceJson, 'url', url ?? '', true);
    // this.addProperty(imageSourceJson, 'mockupId', mockupId ?? '', true);
    // this.addProperty(imageSourceJson, 'size', size ?? null, true);
    // this.addProperty(imageSourceJson, 'format', format ?? null, true);
    // this.addProperty(imageSourceJson, 'trim', BooleanUtils.isBoolean(trim) ? trim : null, true);

    this.bitJson.imageSource = imageSourceJson;
  }

  // bitmarkAst -> bits -> bitsValue -> person

  protected enter_person(node: NodeInfo, route: NodeInfo[]): boolean {
    const personJson = node.value as PersonJson;
    // const person = node.value as Person;
    const bitType = this.getBitType(route);

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue || !bitType) return true;

    // const { name, title, avatarImage } = person;

    // const personJson = {} as PersonJson;
    // this.addProperty(personJson, 'name', name ?? '', true);
    // if (title) {
    //   this.addProperty(personJson, 'title', title, true);
    // }
    // if (avatarImage) {
    //   personJson.avatarImage = avatarImage.image;
    // }

    if (Config.isOfBitType(bitType, BitType.conversationLeft1)) {
      // Use the legacy partner property in the JSON for conversation bits, so change to person is backwards compatible
      this.bitJson.partner = personJson;
    } else {
      this.bitJson.person = personJson;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> ratingLevelStart

  protected enter_ratingLevelStart(node: NodeInfo, route: NodeInfo[]): boolean {
    const json = this.enterRatingLevelStartEndCommon(node, route);
    if (json) this.bitJson.ratingLevelStart = json;

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> ratingLevelEnd

  protected enter_ratingLevelEnd(node: NodeInfo, route: NodeInfo[]): boolean {
    const json = this.enterRatingLevelStartEndCommon(node, route);
    if (json) this.bitJson.ratingLevelEnd = json;

    // Stop traversal of this branch
    return false;
  }

  // Common code for ratingLevelStart and ratingLevelEnd
  protected enterRatingLevelStartEndCommon(node: NodeInfo, route: NodeInfo[]): RatingLevelStartEndJson | undefined {
    const json = node.value as RatingLevelStartEndJson;
    // const n = node.value as RatingLevelStartEnd;

    // Ignore statements that are not at the bit level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    // const json: Partial<RatingLevelStartEndJson> = {};
    // this.addProperty(json, 'level', n.level, true);

    // if (n.label) {
    //   json.label = this.getBitmarkTextAst(n.label);
    // }

    // // Delete unwanted properties
    // if (json?.label == null) delete json.label;

    return json as RatingLevelStartEndJson;
  }

  // bitmarkAst -> bits -> bitsValue -> productId

  protected enter_productId(node: NodeInfo, route: NodeInfo[]): boolean {
    const productIds = node.value as string[];

    // Ignore item that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const bitType = this.getBitType(route);

    if (bitType === BitType.module) {
      this.addProperty(this.bitJson, 'productId', productIds);
    } else if (productIds.length > 0) {
      this.addProperty(this.bitJson, 'productId', productIds[productIds.length - 1], true);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> markConfig -> markConfigValue

  protected enter_markConfigValue(node: NodeInfo, route: NodeInfo[]): boolean {
    const markJson = node.value as MarkConfigJson;
    // const markConfig = node.value as MarkConfig;

    // Ignore item that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.markConfig) return true;

    // const { mark, color, emphasis } = markConfig;

    // const markJson = {} as Partial<MarkConfigJson>;

    // this.addProperty(markJson, 'mark', mark ?? 'unknown', true);
    // if (color) this.addProperty(markJson, 'color', color ?? '', true);
    // if (emphasis) this.addProperty(markJson, 'emphasis', emphasis ?? '', true);

    if (!this.bitJson.marks) this.bitJson.marks = [];
    this.bitJson.marks.push(markJson);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> item

  protected enter_item(node: NodeInfo, route: NodeInfo[]): boolean {
    const item = node.value as TextAst;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    if (item != null) {
      this.bitJson.item = item;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> lead

  protected enter_lead(node: NodeInfo, route: NodeInfo[]): boolean {
    const lead = node.value as TextAst;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    if (lead != null) {
      this.bitJson.lead = lead;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> pageNumber

  protected enter_pageNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    const pageNumber = node.value as TextAst;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    if (pageNumber != null) {
      this.bitJson.pageNumber = pageNumber;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> marginNumber

  protected enter_marginNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    const marginNumber = node.value as TextAst;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    if (marginNumber != null) {
      this.bitJson.marginNumber = marginNumber;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> hint

  protected enter_hint(node: NodeInfo, route: NodeInfo[]): boolean {
    const hint = node.value as TextAst;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    if (hint != null) {
      this.bitJson.hint = hint;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> instruction

  protected enter_instruction(node: NodeInfo, route: NodeInfo[]): boolean {
    const instruction = node.value as TextAst;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    if (instruction != null) {
      this.bitJson.instruction = instruction;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> width

  protected enter_width(node: NodeInfo, route: NodeInfo[]): boolean {
    let value = node.value as string | number;
    const bitType = this.getBitType(route);

    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue && Config.isOfBitType(bitType, BitType.extractorBlock)) {
      value = NumberUtils.asNumber(value, 0) ?? 0;
    }

    // Add the property
    this.addProperty(this.bitJson, 'width', value, true);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> height

  protected enter_height(node: NodeInfo, route: NodeInfo[]): boolean {
    let value = node.value as string | number;
    const bitType = this.getBitType(route);

    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue && Config.isOfBitType(bitType, BitType.extractorBlock)) {
      value = NumberUtils.asNumber(value, 0) ?? 0;
    }

    // Add the property
    this.addProperty(this.bitJson, 'height', value, true);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> extraProperties

  protected enter_extraProperties(node: NodeInfo, _route: NodeInfo[]): void {
    const extraProperties = node.value as ExtraProperties | undefined;

    if (!this.options.excludeUnknownProperties && extraProperties) {
      for (const [key, values] of Object.entries(extraProperties)) {
        let k = key;
        if (Object.prototype.hasOwnProperty.call(this.bitJson, key)) {
          k = `_${key}`;
        }
        this.addProperty(this.bitJson, k, values);
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> cardBits -> cardBitsValue

  protected enter_cardBitsValue(node: NodeInfo, route: NodeInfo[]): void {
    const cardBit = node.value as CardBit;

    // How cardBits are handled depends on the bit type
    const bitType = this.getBitType(route);
    if (!bitType) return;

    // Create the listItems / sections if not already created
    let listItems: ListItemJson[] | undefined;
    if (bitType === BitType.pageFooter) {
      if (!this.bitJson.sections) this.bitJson.sections = [];
      listItems = this.bitJson.sections;
    } else {
      if (!this.bitJson.listItems) this.bitJson.listItems = [];
      listItems = this.bitJson.listItems;
    }

    // Create this list item
    this.listItem = {
      item: (cardBit.item ?? []) as JsonText,
      lead: (cardBit.lead ?? []) as JsonText,
      hint: (cardBit.hint ?? []) as JsonText,
      instruction: (cardBit.instruction ?? []) as JsonText,
      // ...this.toItemLeadHintInstruction(node.value),
      body: this.bodyDefault,
    };

    // Delete unwanted properties
    // const nv = node.value;
    // const li: Partial<ListItemJson> = this.listItem;

    listItems.push(this.listItem);
  }

  protected exit_cardBitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    this.listItem = undefined;
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, route: NodeInfo[]): boolean {
    const value = node.value as Body;

    const parent = this.getParentNode(route);
    if (!parent) return false;

    if (value.bodyJson) {
      // Body is JSON
      this.bodyJson = value.bodyJson as JsonText;
    } else {
      const isString = StringUtils.isString(value.body);
      const bodyString: string | undefined = isString ? (value.body as string) : undefined;

      this.bodyJson = (isString ? bodyString : this.getBitmarkTextAst(value.body as BitmarkTextNode)) as JsonText;
    }

    // Set the correct body property
    if (parent.key === NodeType.bitsValue) {
      // Body is at the bit level
      this.bitJson.body = this.bodyJson;
    } else if (parent.key === NodeType.cardBitsValue) {
      // Body is at the list item (card bit) level
      if (this.listItem) this.listItem.body = this.bodyJson;
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> footer

  protected enter_footer(node: NodeInfo, _route: NodeInfo[]): boolean {
    const value = node.value as Footer;

    const isString = StringUtils.isString(value.footer);
    const footerString: string | undefined = isString ? (value.footer as string) : undefined;

    this.bitJson.footer = isString ? footerString : this.getBitmarkTextAst(value.footer as BitmarkTextNode);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(node: NodeInfo, _route: NodeInfo[]): void {
    const elements = node.value as BreakscapedString[];

    // Ignore elements that are not at the bit level as they are handled elsewhere as quizzes
    // if (parent?.key !== NodeType.bitsValue) return;

    if (elements && elements.length > 0) {
      this.bitJson.elements = elements;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards

  protected enter_flashcards(node: NodeInfo, route: NodeInfo[]): void {
    // const flashcards = node.value as Flashcard[];
    const flashcardsJson = node.value as FlashcardJson[];

    // Ignore responses that are not at the correct level as they are potentially handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (flashcardsJson.length > 0) {
      this.bitJson.cards = flashcardsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> descriptions

  protected enter_descriptions(node: NodeInfo, route: NodeInfo[]): void {
    // const descriptionListItem = node.value as DescriptionListItem[];
    const descriptionsJson = node.value as DescriptionListItemJson[];

    // Ignore responses that are not at the correct level as they are potentially handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (descriptionsJson.length > 0) {
      this.bitJson.descriptions = descriptionsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> statement

  protected enter_statement(node: NodeInfo, route: NodeInfo[]): void {
    const statement = node.value as StatementJson;

    // Ignore statement that is not at the cardNode level as it is handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (statement) {
      this.bitJson.statement = statement.statement ?? '';
      this.bitJson.isCorrect = statement.isCorrect ?? false;
      this.bitJson.example = statement.example;
      this.bitJson.isExample = statement.isExample;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements -> statementsValue

  protected enter_statements(node: NodeInfo, route: NodeInfo[]): void {
    // const statements = node.value as Statement[];
    const statementsJson = node.value as StatementJson[];

    // Ignore statements that are not at the card node level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (statementsJson.length > 0) {
      this.bitJson.statements = statementsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> choices
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices

  protected enter_choices(node: NodeInfo, route: NodeInfo[]): void {
    // const choices = node.value as Choice[];
    const choicesJson = node.value as ChoiceJson[];

    // Ignore choices that are not at the bit level as they are handled elsewhere as quizzes
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (choicesJson.length > 0) {
      this.bitJson.choices = choicesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> responses
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses

  protected enter_responses(node: NodeInfo, route: NodeInfo[]): void {
    // const responses = node.value as Response[];
    const responsesJson = node.value as ResponseJson[];

    // Ignore responses that are not at the correct level as they are handled elsewhere as quizzes
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (responsesJson.length > 0) {
      this.bitJson.responses = responsesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes

  protected enter_quizzes(node: NodeInfo, _route: NodeInfo[]): void {
    // const quizzes = node.value as Quiz[];
    // const quizzesJson: QuizJson[] = [];
    const quizzesJson: QuizJson[] = node.value as QuizJson[];

    if (quizzesJson.length > 0) {
      this.bitJson.quizzes = quizzesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(node: NodeInfo, _route: NodeInfo[]): boolean | void {
    const headingJson = node.value as HeadingJson;

    this.bitJson.heading = headingJson as HeadingJson;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(node: NodeInfo, _route: NodeInfo[]): void {
    const pairsJson = node.value as PairJson[];

    if (pairsJson.length > 0) {
      this.bitJson.pairs = pairsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix

  protected enter_matrix(node: NodeInfo, _route: NodeInfo[]): void {
    const matrixJsonArray = node.value as MatrixJson[];

    if (matrixJsonArray.length > 0) {
      this.bitJson.matrix = matrixJsonArray;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table

  protected enter_table(node: NodeInfo, _route: NodeInfo[]): boolean {
    const tableJson = node.value as TableJson;
    this.bitJson.table = tableJson;

    // Stop traversal of this branch to avoid unnecessary processing
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(node: NodeInfo, _route: NodeInfo[]): void {
    const questionsJson = node.value as QuestionJson[];

    if (questionsJson.length > 0) {
      this.bitJson.questions = questionsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(node: NodeInfo, route: NodeInfo[]): void {
    const responsesJson = node.value as BotResponseJson[];
    // const botResponses = node.value as BotResponse[];

    // Ignore responses that are not at the cardNode level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (responsesJson.length > 0) {
      this.bitJson.responses = responsesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients -> ingredientsValue
  protected enter_ingredients(node: NodeInfo, route: NodeInfo[]): void {
    const ingredientsJson = node.value as IngredientJson[];
    // const ingredients = node.value as Ingredient[];

    // Ignore statements that are not at the card node level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (ingredientsJson.length > 0) {
      this.bitJson.ingredients = ingredientsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList

  protected enter_captionDefinitionList(node: NodeInfo, _route: NodeInfo[]): boolean {
    const listJson = node.value as CaptionDefinitionListJson;

    this.bitJson.captionDefinitionList = listJson;

    // Stop traversal of this branch to avoid unnecessary processing
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> imagePlaceholder

  protected enter_imagePlaceholder(node: NodeInfo, route: NodeInfo[]): boolean | void {
    // Ignore imagePlaceholder that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.imagePlaceholder = node.value as ImageResourceWrapperJson;
  }

  // bitmarkAst -> bits -> bitsValue -> resources

  protected enter_resources(node: NodeInfo, route: NodeInfo[]): boolean | void {
    const resources = node.value as ResourceJson[];
    const bitType = this.getBitType(route);
    const resourceType = this.getResourceType(route);

    if (!resources || !bitType) return;

    let resourceJson: ResourceJson | undefined;

    const bitConfig = Config.getBitConfig(bitType);
    const bitResourcesConfig = Config.getBitResourcesConfig(bitType, resourceType);
    const comboMap = bitResourcesConfig.comboResourceTagTypesMap;

    if (bitResourcesConfig.comboResourceTagTypesMap.size > 0) {
      // The resource is a combo resource
      // Extract the resource types from the combo resource
      // NOTE: There should only ever be one combo resource per bit, but the code can handle multiple
      // except for overwriting resourceJson
      for (const [comboTagType, resourceTags] of comboMap.entries()) {
        // Create the combo resource wrapper
        const wrapper: ResourceWrapperJson = {
          type: comboTagType,
          _typeAlias: comboTagType,
        };

        // For each of the resources in this combo resource, find the actual resource and add it to the JSON
        for (const rt of resourceTags) {
          const r = resources.find((r) => r._typeAlias === rt);
          // Extract everything except the type from the resource
          if (r) {
            const tagConfig = Config.getTagConfigForTag(bitConfig.tags, r._typeAlias);
            const key = tagConfig?.jsonKey ?? r._typeAlias;
            const tag = tagConfig?.tag ?? r._typeAlias;
            const json = r._typeAlias === tag ? r : undefined;
            if (json) {
              for (const [k, v] of Object.entries(json)) {
                if (k !== 'type') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (wrapper as any)[key] = v;
                }
              }
            }
          }
        }
        resourceJson = wrapper as ResourceJson;
      }
    } else if (Config.isOfBitType(bitType, [BitType.imagesLogoGrave, BitType.prototypeImages])) {
      // The resource is a logo-grave  / prototpye-images resource
      const images: ImageResourceWrapperJson[] = [];
      for (const r of resources) {
        if (r.type === ResourceTag.image) {
          images.push(r);
        }
      }
      if (bitType === BitType.imagesLogoGrave) {
        this.bitJson.logos = images;
      } else {
        this.bitJson.images = images;
      }
    } else {
      // This is a standard resource. If there is more than one resource, use the first one.
      // There should not be more than one because of validation
      if (resources.length >= 1) {
        resourceJson = resources[0]; // this.parseResourceToJson(bitType, resources[0]);
      }
    }

    this.bitJson.resource = resourceJson;
  }

  //
  // Terminal nodes (leaves)
  //

  // bitmarkAst -> bits -> bitsValue -> title

  protected enter_title(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore title that are not at the bit or card node level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue && parent?.key !== NodeType.cardNode) return;

    this.bitJson.title = node.value;
  }

  //  bitmarkAst -> bits -> bitsValue -> subtitle

  protected enter_subtitle(node: NodeInfo, _route: NodeInfo[]): void {
    this.bitJson.subtitle = node.value;
  }

  // //  bitmarkAst -> bits -> bitsValue -> level

  protected leaf_level(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'level', node.value ?? 1, true);
  }

  // bitmarkAst -> bits -> bitsValue -> book

  protected leaf_book(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'book', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'anchor', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> reference

  protected leaf_reference(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'reference', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> referenceEnd

  protected leaf_referenceEnd(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'referenceEnd', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> caption

  protected enter_caption(node: NodeInfo, route: NodeInfo[]): void {
    const caption = node.value as BitmarkTextNode;

    // Ignore caption that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.caption = caption;
  }

  // bitmarkAst -> bits -> bitsValue -> markup

  protected leaf_markup(node: NodeInfo, _route: NodeInfo[]): void {
    const bitmark = node.value as string | undefined;
    if (bitmark) this.bitWrapperJson.bitmark = bitmark;
  }

  // bitmarkAst -> bits -> bitsValue -> parser
  // bitmarkAst -> bits -> bitsValue -> * -> internalComment

  protected enter_parser(node: NodeInfo, route: NodeInfo[]): void {
    const parser = node.value as ParserInfo | undefined;
    const bitType = this.getBitType(route);
    const parent = this.getParentNode(route);

    if (parser && bitType) {
      const { version, excessResources: parserExcessResources, warnings, errors, ...parserRest } = parser;
      const bitmarkVersion = `${this.bitmarkVersion}`;
      const textParserVersion = this.textParserVersion;

      // Parse resources to JSON from AST
      let excessResources: ResourceJson[] | undefined;
      if (Array.isArray(parserExcessResources) && parserExcessResources.length > 0) {
        excessResources = [];
        for (const r of parserExcessResources) {
          excessResources.push(r as ResourceJson);
        }
      }

      // Extract internal comments from the AST and add to the parser
      const internalComments = this.getInternalComments(route);

      if (parent?.key === NodeType.bitsValue) {
        // Bit level parser information
        this.bitWrapperJson.parser = {
          version,
          bitmarkVersion,
          textParserVersion,
          internalComments,
          ...parserRest,
          warnings,
          errors,
          excessResources,
        };

        if (!this.options.enableWarnings) {
          // Remove warnings if not enabled
          delete this.bitWrapperJson.parser.warnings;
        }
      } else {
        // Top level parser information (not specific to a bit)
        // TODO - not sure where this error can be written
        // this.bitWrapperJson.parser = {
        //   errors,
        // };
      }
    }
  }

  // bitmarkAst -> errors

  // protected enter_errors(node: NodeInfo, _route: NodeInfo[],
  // context: Context): void {
  //   const errors = node.value as ParserError[] | undefined;
  //   if (errors && errors.length > 0) {
  //     // Complete bit is invalid
  //     // TODO - not sure where this error can be written
  //     // this.bitWrapperJson.parser = {
  //     //   errors,
  //     // };
  //   }
  // }

  // bitmarkAst -> bits -> bitsValue -> * -> __text__

  protected enter____text__(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Ignore text that is not at the bit level as it are handled elsewhere

    // Do not traverse further
    return false;
  }

  //
  // Generated Node Handlers
  //

  /**
   * Generate the handlers for properties, as they are mostly the same, but not quite
   */
  protected generatePropertyHandlers() {
    const propertiesConfig = Config.getRawPropertiesConfig();

    for (const propertyConfig of Object.values(propertiesConfig)) {
      const astKey = propertyConfig.astKey ?? propertyConfig.tag;

      // Special cases (handled outside of the automatically generated handlers)
      if (astKey === PropertyTag.internalComment) continue;
      if (astKey === PropertyTag.caption) continue;
      if (astKey === PropertyTag.example) continue;
      if (astKey === PropertyTag.imageSource) continue;
      if (astKey === PropertyTag.person) continue;
      if (astKey === PropertyTag.imagePlaceholder) continue;
      if (astKey === PropertyTag.width) continue;
      if (astKey === PropertyTag.height) continue;
      if (astKey === PropertyAstKey.ast_markConfig) continue;
      if (astKey === PropertyTag.ratingLevelStart) continue;
      if (astKey === PropertyTag.ratingLevelEnd) continue;
      if (astKey === PropertyTag.productId) continue;
      if (astKey === PropertyTag.tag_title) continue;

      const funcName = `enter_${astKey}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[funcName] = (node: NodeInfo, route: NodeInfo[]) => {
        const value = node.value as unknown[] | undefined;
        if (value == null) return;

        // if (key === 'progress') debugger;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        const parent = this.getParentNode(route);
        if (parent?.key !== NodeType.bitsValue) return;

        // Convert key as needed
        const jsonKey = propertyConfig.jsonKey ?? propertyConfig.tag;

        // Add the property
        this.addProperty(this.bitJson, jsonKey, value, propertyConfig.single);
      };

      // Bind this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[funcName] = (this as any)[funcName].bind(this);
    }
  }

  // // END NODE HANDLERS

  //
  // HELPER FUNCTIONS
  //

  protected toExample(
    node: ExampleNode,
    options: {
      defaultExample: string | boolean | null;
      isBoolean: boolean;
    },
  ): ExampleJsonWrapper {
    const { isExample, example, isDefaultExample } = node;
    const { defaultExample, isBoolean } = options;

    if (!isExample) {
      return {
        isExample: false,
        example: null,
      };
    }

    let exampleValue;
    if (isDefaultExample) {
      exampleValue = isBoolean
        ? BooleanUtils.toBoolean(defaultExample)
        : this.convertBreakscapedStringToJsonText(defaultExample as BreakscapedString, TextFormat.bitmarkMinusMinus);
    } else {
      exampleValue = isBoolean
        ? BooleanUtils.toBoolean(example)
        : this.convertBreakscapedStringToJsonText(example as BreakscapedString, TextFormat.bitmarkMinusMinus);
    }

    return {
      isExample: true,
      example: exampleValue,
    };
  }

  protected addProperty(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    name: string,
    values: unknown | unknown[] | undefined,
    singleWithoutArray?: boolean,
  ): void {
    if (values !== undefined) {
      let finalValue: unknown | unknown[] | undefined;
      if (!Array.isArray(values)) values = [values];

      if (Array.isArray(values) && values.length > 0) {
        if (Array.isArray(values) && singleWithoutArray && values.length >= 1) {
          finalValue = values[values.length - 1];
        } else {
          finalValue = values;
        }
      }

      target[name] = finalValue;
    }
  }

  //
  // Helper functions
  //

  /**
   * Get the bit type from any node
   *
   * @param route the route to the current node
   * @returns the bit type
   */
  protected getBitType(route: NodeInfo[]): BitTypeType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.bitType;
      }
    }

    return undefined;
  }

  /**
   * Get the text format from any node
   *
   * @param route the route to the current node
   * @returns the text format
   */
  protected getTextFormat(route: NodeInfo[]): TextFormatType {
    const bitType = this.getBitType(route);

    if (bitType) {
      const bitConfig = Config.getBitConfig(bitType);
      for (const node of route) {
        if (node.key === NodeType.bitsValue) {
          const n = node.value as Bit;
          return TextFormat.fromValue(n?.textFormat) ?? bitConfig.textFormatDefault;
        }
      }
    }

    return TextFormat.bitmarkMinusMinus;
  }

  /**
   * Get the bit resourceType atttachment from any node
   *
   * @param route the route to the current node
   * @returns the bit type
   */
  protected getResourceType(route: NodeInfo[]): ResourceTagType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.resourceType;
      }
    }

    return undefined;
  }

  /**
   * Get the internal comments from any node
   *
   * @param route the route to the current node
   * @returns the text format
   */
  protected getInternalComments(route: NodeInfo[]): BreakscapedString[] | undefined {
    const bitType = this.getBitType(route);

    if (bitType) {
      for (const node of route) {
        if (node.key === NodeType.bitsValue) {
          const n = node.value as Bit;
          return n.internalComment as BreakscapedString[];
        }
      }
    }

    return undefined;
  }

  protected getBitmarkTextAst(textNode: BitmarkTextNode | undefined): TextAst {
    if (textNode != null) {
      if (Array.isArray(textNode.__text__)) {
        return textNode.__text__;
      }
    }

    return [];
  }

  /**
   * Convert the text from the AST to the JSON format:
   * Input:
   *  - breakscaped string
   * Output:
   *  - text: plain text
   *  - json: bitmark text JSON
   *  - Bitmark v2: breakscaped string
   *  - Bitmark v3: bitmark text JSON (TextAst)
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param text
   * @returns
   */
  protected convertBreakscapedStringToJsonText(
    text: BreakscapedString | undefined,
    format: TextFormatType, // = TextFormat.bitmarkMinusMinus,
  ): JsonText {
    if (!text) undefined;

    const isBitmarkText = format === TextFormat.bitmarkMinusMinus || format === TextFormat.bitmarkPlusPlus;

    if (!isBitmarkText) {
      // Not bitmark text, so plain text, so  unbreakscape only the start of bit tags
      return text || '';
    }

    const asPlainText = this.options.textAsPlainText;
    if (asPlainText) {
      return text || '';
    }

    // Use the text parser to parse the text
    const textAst = this.textParser.toAst(text, {
      textFormat: format,
    });

    return textAst;
  }

  /**
   * Concatenates a plain JSON text with a JsonText that may be plain (v2) or BitmarkText (v3)
   * Returns the combined text.
   *
   * @param text the text to concatenate
   * @param textPlain the plain text to concatenate
   */
  protected concatenatePlainTextWithJsonTexts(text: JsonText, textPlain: string): JsonText {
    if (Array.isArray(text)) {
      if (textPlain) {
        const splitText = textPlain.split('\n');
        const content: TextNode[] = [];
        for (let i = 0; i < splitText.length; i++) {
          const t = splitText[i];
          if (t) {
            content.push({
              text: t,
              type: TextNodeType.text,
            });
          }
          // Add a hard break after each paragraph, except the last one
          if (i < splitText.length - 1) {
            content.push({
              type: TextNodeType.hardBreak,
            });
          }
        }

        // Add the content to the final paragraph, or create a new one if there none
        const lastNode = text[text.length - 1];
        if (lastNode && lastNode.type === TextNodeType.paragraph) {
          lastNode.content = [...(lastNode.content ?? []), ...content];
        } else {
          text.push({
            type: TextNodeType.paragraph,
            content,
            attrs: {} as TextNodeAttibutes,
          });
        }
      }
      return text;
    }

    return `${text ?? ''}${textPlain ?? ''}`;
  }

  // /**
  //  * Walk the body AST to find the placeholder and replace it with the body bit.
  //  *
  //  * @param bodyAst the body AST
  //  * @param bodyBitJson the body bit json to insert at the placeholder position
  //  * @param index the index of the placeholder to replace
  //  */
  // protected replacePlaceholderWithBodyBit(bodyAst: TextAst, bodyBitJson: BodyBitJson, index: number) {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const walkRecursive = (node: any, parent: any, parentKey: any): boolean => {
  //     if (Array.isArray(node)) {
  //       // Walk the array of nodes
  //       for (let i = 0; i < node.length; i++) {
  //         const child = node[i];
  //         const done = walkRecursive(child, node, i);
  //         if (done) return true;
  //       }
  //     } else {
  //       if (node.type === 'bit' && node.index === index) {
  //         // Found the placeholder, replace it with the body bit
  //         parent[parentKey] = bodyBitJson;
  //         return true;
  //       }
  //       if (node.content) {
  //         // Walk the child content
  //         const done = walkRecursive(node.content, node, 'content');
  //         if (done) return true;
  //       }
  //     }
  //     return false;
  //   };

  //   walkRecursive(bodyAst, null, null);
  // }

  //
  // WRITE FUNCTIONS
  //

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

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
  }

  /**
   * Create a new bit json object.
   * - This function defines the order of the properties in the json.
   *
   * @param bit
   * @returns
   */
  protected createBitJson(bit: Bit): Partial<BitJson> {
    const bitJson: Partial<BitJson> = {
      type: bit.isCommented ? BitType._comment : bit.bitType,
      originalType: bit.isCommented ? bit.bitType : undefined,
      format: bit.textFormat,
      bitLevel: bit.bitLevel,

      // Properties
      id: undefined,
      internalComment: undefined,
      externalId: undefined,
      spaceId: undefined,
      padletId: undefined,
      jupyterId: undefined,
      jupyterExecutionCount: undefined,
      isPublic: undefined,
      aiGenerated: undefined,
      machineTranslated: undefined,
      analyticsTag: undefined,
      feedbackEngine: undefined,
      feedbackType: undefined,
      disableFeedback: undefined,
      releaseVersion: undefined,
      releaseKind: undefined,
      releaseDate: undefined,
      book: undefined,
      ageRange: undefined,
      lang: undefined,
      language: undefined,
      publisher: undefined,
      publisherName: undefined,
      theme: undefined,
      computerLanguage: undefined,
      target: undefined,
      slug: undefined,
      tag: undefined,
      reductionTag: undefined,
      bubbleTag: undefined,
      levelCEFRp: undefined,
      levelCEFR: undefined,
      levelILR: undefined,
      levelACTFL: undefined,
      icon: undefined,
      iconTag: undefined,
      colorTag: undefined,
      flashcardSet: undefined,
      subtype: undefined,
      bookAlias: undefined,
      coverImage: undefined,
      coverColor: undefined,
      publications: undefined,
      author: undefined,
      subject: undefined,
      date: undefined,
      dateEnd: undefined,
      location: undefined,
      kind: undefined,
      hasMarkAsDone: undefined,
      processHandIn: undefined,
      action: undefined,
      showInIndex: undefined,
      blockId: undefined,
      pageNo: undefined,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      index: undefined,
      classification: undefined,
      availableClassifications: undefined,
      allowedBit: undefined,
      tableFixedHeader: undefined,
      tableSearch: undefined,
      tableSort: undefined,
      tablePagination: undefined,
      tablePaginationLimit: undefined,
      tableHeight: undefined,
      tableWhitespaceNoWrap: undefined,
      tableAutoWidth: undefined,
      tableResizableColumns: undefined,
      quizCountItems: undefined,
      quizStrikethroughSolutions: undefined,
      codeLineNumbers: undefined,
      codeMinimap: undefined,
      stripePricingTableId: undefined,
      stripePublishableKey: undefined,
      thumbImage: undefined,
      scormSource: undefined,
      posterImage: undefined,
      focusX: undefined,
      focusY: undefined,
      pointerLeft: undefined,
      pointerTop: undefined,
      listItemIndent: undefined,
      backgroundWallpaper: undefined,
      hasBookNavigation: undefined,
      duration: undefined,
      deeplink: undefined,
      externalLink: undefined,
      externalLinkText: undefined,
      videoCallLink: undefined,
      vendorUrl: undefined,
      search: undefined,
      list: undefined,
      textReference: undefined,
      isTracked: undefined,
      isInfoOnly: undefined,
      imageFirst: undefined,
      activityType: undefined,
      labelTrue: undefined,
      labelFalse: undefined,
      content2Buy: undefined,
      mailingList: undefined,
      buttonCaption: undefined,
      callToActionUrl: undefined,
      caption: undefined,
      quotedPerson: undefined,
      reasonableNumOfChars: undefined,
      resolved: undefined,
      resolvedDate: undefined,
      resolvedBy: undefined,
      maxCreatedBits: undefined,
      maxDisplayLevel: undefined,
      page: undefined,
      productId: undefined,
      product: undefined,
      productVideo: undefined,
      productFolder: undefined,
      technicalTerm: undefined,
      servings: undefined,
      ratingLevelStart: undefined,
      ratingLevelEnd: undefined,
      ratingLevelSelected: undefined,

      // Book data
      title: undefined,
      subtitle: undefined,
      level: undefined,
      toc: undefined,
      progress: undefined,
      anchor: undefined,
      reference: undefined,
      referenceEnd: undefined,

      // Item, Lead, Hint, Instruction
      item: undefined,
      lead: undefined,
      pageNumber: undefined,
      marginNumber: undefined,
      hint: undefined,
      instruction: undefined,

      // Example
      isExample: undefined,
      example: undefined,

      // Person .conversion-xxx, page-person, etc
      person: undefined,

      // Marks (config)
      marks: undefined,

      // Extra Properties
      extraProperties: undefined,

      // Body
      body: undefined,

      // Resource
      imagePlaceholder: undefined,
      resource: undefined,
      logos: undefined,
      images: undefined,

      // Children
      statement: undefined,
      isCorrect: undefined,
      sampleSolution: undefined,
      additionalSolutions: undefined,
      partialAnswer: undefined,
      elements: undefined,
      cards: undefined,
      descriptions: undefined,
      statements: undefined,
      responses: undefined,
      quizzes: undefined,
      heading: undefined,
      pairs: undefined,
      matrix: undefined,
      choices: undefined,
      questions: undefined,
      captionDefinitionList: undefined,
      listItems: undefined,
      sections: undefined,

      // Placeholders
      placeholders: undefined,

      // Footer
      footer: undefined,
    };

    // Add the resource template if there should be a resource (indicated by resourceType) but there is none defined.
    // if (bit.resourceType && !bitJson.resource) {
    //   const jsonKey = ResourceTag.keyFromValue(bit.resourceType);
    //   bitJson.resource = {
    //     type: bit.resourceType,
    //   } as ResourceJson;
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   if (jsonKey) (bitJson.resource as any)[jsonKey] = {};
    // }

    return bitJson;
  }

  /**
   * Remove wanted properties from bit json object.
   * - This function defines the defaults for properties in the json.
   *
   * @param bit
   * @returns
   */
  protected cleanAndSetDefaultsForBitJson(bitJson: Partial<BitJson>): Partial<BitJson> {
    const bitType = Config.getBitType(bitJson.type);
    const textFormat = bitJson.format;
    const plainText = this.options.textAsPlainText;

    // Clear 'originalType' if not set
    if (bitJson.originalType == null) bitJson.originalType = undefined;

    // Clear 'item' which may be an empty string if 'lead' was set but item not
    // Only necessary because '.article' does not include a default value for 'item'
    // which is totally inconsistent, but maybe is wanted.
    if (!bitJson.item) bitJson.item = undefined;

    // Add default properties to the bit.
    // NOTE: Not all bits have the same default properties.
    //       The properties used are a bit random sometimes?
    //       It would be better if this functionality was generated from the bit config
    if (Config.isOfBitType(bitType, [BitType._error, BitType._comment])) {
      // Special caes for _error and _comment bits
      delete bitJson.format;
      //
    } else {
      let isTopLevelExample = false;
      let isTopLevelExampleValue = false;

      // Most bits have these defaults, but there are special cases (not sure if that is by error or design)
      if (Config.isOfBitType(bitType, [BitType.page])) {
        // Bits without item, lead, etc
      } else {
        // Majority of bits
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.lead == null) bitJson.lead = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.pageNumber == null) bitJson.pageNumber = this.textDefault;
        if (bitJson.marginNumber == null) bitJson.marginNumber = this.textDefault;
      }
      if (bitJson.body == null) bitJson.body = this.bodyDefault;

      if (Config.isOfBitType(bitType, [BitType.article])) {
        //
      }

      if (Config.isOfBitType(bitType, [BitType.example])) {
        // With 'example' value at the bit level.
        isTopLevelExample = true;
        isTopLevelExampleValue = true;
      }

      if (
        Config.isOfBitType(bitType, [
          BitType.multipleChoice1,
          BitType.multipleResponse1,
          BitType.multipleChoiceText,
          BitType.highlightText,
          BitType.gapText,
          BitType.gapTextInstructionGrouped,
          BitType.clozeAndMultipleChoiceText,
          BitType.sequence,
          BitType.mark,
          BitType.flashcard,
          BitType.descriptionList,
        ])
      ) {
        // With no 'example' value at the bit level.
        isTopLevelExample = true;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
      }

      if (Config.isOfBitType(bitType, [BitType.sequence])) {
        // With 'example' value at the bit level.
        isTopLevelExample = true;
        isTopLevelExampleValue = true;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
      }

      if (Config.isOfBitType(bitType, BitType.cloze)) {
        // With no 'example' value at the bit level.
        isTopLevelExample = true;

        if (Config.isOfBitType(bitType, BitType.clozeSolutionGrouped)) {
          // Solution grouped
          if (bitJson.quizCountItems == null) bitJson.quizCountItems = true;
          if (bitJson.quizStrikethroughSolutions == null) bitJson.quizStrikethroughSolutions = true;
        } else if (Config.isOfBitType(bitType, BitType.clozeInstructionGrouped)) {
          // Instruction grouped
          if (bitJson.quizCountItems == null) bitJson.quizCountItems = true;
          if (bitJson.quizStrikethroughSolutions == null) bitJson.quizStrikethroughSolutions = false;
        }
      }

      if (Config.isOfBitType(bitType, [BitType.multipleChoice, BitType.multipleResponse])) {
        // Default with a card (and hence a footer possibility)
        isTopLevelExample = true;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        if (bitJson.footer == null) bitJson.footer = this.textDefault;
      }

      if (Config.isOfBitType(bitType, BitType.essay)) {
        // With 'example' value at the bit level.
        isTopLevelExample = true;
        isTopLevelExampleValue = true;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        if (bitJson.partialAnswer == null) bitJson.partialAnswer = '';
        // if (bitJson.sampleSolution == null) bitJson.sampleSolution = '';
      }

      if (Config.isOfBitType(bitType, BitType.trueFalse1)) {
        // With 'example' value at the bit level.
        isTopLevelExample = true;
        isTopLevelExampleValue = true;
        if (bitJson.isCorrect == null) bitJson.isCorrect = false;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
      }

      if (Config.isOfBitType(bitType, BitType.trueFalse)) {
        // With no 'example' value at the bit level.
        isTopLevelExample = true;
        if (bitJson.labelFalse == null) bitJson.labelFalse = '';
        if (bitJson.labelTrue == null) bitJson.labelTrue = '';
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
      }

      if (Config.isOfBitType(bitType, BitType.chapter)) {
        //
        if (bitJson.toc == null) bitJson.toc = true; // Always set on chapter bits?
        if (bitJson.progress == null) bitJson.progress = true; // Always set on chapter bits
        if (bitJson.level == null) bitJson.level = 1; // Set level 1 if none set (makes no sense, but in ANTLR parser)
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        //
      }

      if (Config.isOfBitType(bitType, BitType.interview)) {
        // With no 'example' value at the bit level.
        isTopLevelExample = true;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        if (bitJson.footer == null) bitJson.footer = this.textDefault;
        if (bitJson.questions == null) bitJson.questions = [];
      }

      if (bitType === BitType.matchMatrix) {
        // With no 'example' value at the bit level.
        isTopLevelExample = true;
      }

      if (Config.isOfBitType(bitType, BitType.match)) {
        // With no 'example' value at the bit level.
        isTopLevelExample = true;
        if (bitJson.heading == null) bitJson.heading = {} as HeadingJson;
      }

      if (Config.isOfBitType(bitType, BitType.learningPathBook)) {
        //
        if (bitJson.isTracked == null) bitJson.isTracked = true;
        if (bitJson.isInfoOnly == null) bitJson.isInfoOnly = false;
        //
      }

      if (Config.isOfBitType(bitType, BitType.table)) {
        //
        // if (bitJson.content2Buy == null) bitJson.content2Buy = '';
        if (bitJson.tableFixedHeader == null) bitJson.tableFixedHeader = false;
        if (bitJson.tableSearch == null) bitJson.tableSearch = false;
        if (bitJson.tableSort == null) bitJson.tableSort = false;
        if (bitJson.tablePagination == null) bitJson.tablePagination = false;
        if (bitJson.tablePaginationLimit == null) bitJson.tablePaginationLimit = 0;
        if (bitJson.tableHeight == null) bitJson.tableHeight = 0;
        if (bitJson.tableWhitespaceNoWrap == null) bitJson.tableWhitespaceNoWrap = true;
        if (bitJson.tableAutoWidth == null) bitJson.tableAutoWidth = true;
        if (bitJson.tableResizableColumns == null) bitJson.tableResizableColumns = false;
        //
      }

      if (
        Config.isOfBitType(bitType, [
          BitType.pageBanner,
          BitType.pageBuyButton,
          BitType.pageBuyButtonAlt,
          BitType.pageBuyButtonPromotion,
          BitType.pageFooter,
          BitType.pageOpenBook,
          BitType.pagePerson,
          BitType.pageProduct,
          BitType.pageProductList,
          BitType.pageProductVideo,
          BitType.pageProductVideoList,
          BitType.pageSectionFolder,
          BitType.pageSubscribe,
          BitType.pageSubpage,
        ])
      ) {
        //
        if (bitJson.slug == null) bitJson.slug = '';
        if (bitJson.body == null) bitJson.body = this.bodyDefault;

        if (Config.isOfBitType(bitType, BitType.pageBuyButton)) {
          if (bitJson.content2Buy == null) bitJson.content2Buy = '';
        }
      }

      // Special case for 'book' bits
      if (Config.isOfBitType(bitType, BitType.book)) {
        if (bitJson.hasMarkAsDone == null) bitJson.hasMarkAsDone = false;
        if (bitJson.processHandIn == null) bitJson.processHandIn = false;
        if (bitJson.isPublic == null) bitJson.isPublic = false;
      }

      // Special case for 'ai' bits
      if (bitType === BitType.articleAi || bitType === BitType.noteAi || bitType === BitType.summaryAi) {
        if (bitJson.aiGenerated == null) bitJson.aiGenerated = true;
      }

      // Special case for '-responsive...' bits
      if (Config.isOfBitType(bitType, [BitType.articleResponsive, BitType.pageArticleResponsive])) {
        if (bitJson.imageFirst == null) bitJson.imageFirst = true;
      }

      // Special case for 'review-...' bits
      if (Config.isOfBitType(bitType, BitType.reviewNote)) {
        if (bitJson.resolved == null) bitJson.resolved = false;
        if (bitJson.resolvedDate == null) bitJson.resolvedDate = '';
        if (bitJson.resolvedBy == null) bitJson.resolvedBy = '';
      }

      // Special case for 'images-logos-grave' / 'prototype-images' / etc bits
      if (Config.isOfBitType(bitType, [BitType.imagesLogoGrave, BitType.prototypeImages])) {
        if (bitType === BitType.imagesLogoGrave) {
          if (bitJson.logos == null) {
            bitJson.logos = [];
          }
        } else {
          if (bitJson.images == null) bitJson.images = [];
        }
      }

      // Special case for 'stepImageScreenshotWithPointer' / surveyMatrix / etc bits
      if (Config.isOfBitType(bitType, [BitType.stepImageScreenshotWithPointer, BitType.surveyMatrix])) {
        if (bitJson.pointerTop == null) bitJson.pointerTop = '';
        if (bitJson.pointerLeft == null) bitJson.pointerLeft = '';
        if (Config.isOfBitType(bitType, [BitType.surveyMatrix])) {
          if (bitJson.buttonCaption == null) bitJson.buttonCaption = '';
        }
      }

      if (Config.isOfBitType(bitType, [BitType.listItem])) {
        if (bitJson.listItemIndent == null) bitJson.listItemIndent = 0;
      }

      // Special case for 'survey-rating-*' bits
      if (Config.isOfBitType(bitType, BitType.surveyRating)) {
        //
        if (bitJson.ratingLevelStart == null) {
          bitJson.ratingLevelStart = {
            level: 0,
          };
        }
        if (bitJson.ratingLevelEnd == null) {
          bitJson.ratingLevelEnd = {
            level: 0,
          };
        }
      }

      // Special case for 'vendor-stripe-pricing-table' bits
      if (Config.isOfBitType(bitType, BitType.vendorStripePricingTable)) {
        if (bitJson.stripePricingTableId == null) bitJson.stripePricingTableId = '';
        if (bitJson.stripePublishableKey == null) bitJson.stripePublishableKey = '';
      }

      // Special case for 'call-to-action' bits
      if (Config.isOfBitType(bitType, BitType.callToAction)) {
        if (bitJson.buttonCaption == null) bitJson.buttonCaption = '';
        if (bitJson.callToActionUrl == null) bitJson.callToActionUrl = '';
      }

      // Special case for 'module' bits
      if (Config.isOfBitType(bitType, BitType.module)) {
        if (bitJson.hasBookNavigation == null) bitJson.hasBookNavigation = true;
      }

      // Special case for 'container' bits
      if (Config.isOfBitType(bitType, BitType.container)) {
        if (bitJson.allowedBit == null) bitJson.allowedBit = [];
      }

      // Remove top level example if it is not required
      if (isTopLevelExample) {
        if (bitJson.isExample == null) bitJson.isExample = false;
      } else {
        // Remove example
        delete bitJson.isExample;
        delete bitJson.example;
      }
      if (isTopLevelExampleValue) {
        if (bitJson.example == null) bitJson.example = null;
      } else {
        // Remove example value
        delete bitJson.example;
      }
    }

    // Remove unwanted properties

    // Properties
    if (bitJson.id == null) delete bitJson.id;
    if (bitJson.internalComment == null) delete bitJson.internalComment;
    if (bitJson.externalId == null) delete bitJson.externalId;
    if (bitJson.spaceId == null) delete bitJson.spaceId;
    if (bitJson.padletId == null) delete bitJson.padletId;
    if (bitJson.jupyterId == null) delete bitJson.jupyterId;
    if (bitJson.jupyterExecutionCount == null) delete bitJson.jupyterExecutionCount;
    if (bitJson.isPublic == null) delete bitJson.isPublic;
    if (bitJson.aiGenerated == null) delete bitJson.aiGenerated;
    if (bitJson.machineTranslated == null) delete bitJson.machineTranslated;
    if (bitJson.analyticsTag == null) delete bitJson.analyticsTag;
    if (bitJson.feedbackEngine == null) delete bitJson.feedbackEngine;
    if (bitJson.feedbackType == null) delete bitJson.feedbackType;
    if (bitJson.disableFeedback == null) delete bitJson.disableFeedback;
    if (bitJson.releaseVersion == null) delete bitJson.releaseVersion;
    if (bitJson.releaseKind == null) delete bitJson.releaseKind;
    if (bitJson.releaseDate == null) delete bitJson.releaseDate;
    if (bitJson.book == null) delete bitJson.book;
    if (bitJson.ageRange == null) delete bitJson.ageRange;
    if (bitJson.lang == null) delete bitJson.lang;
    if (bitJson.language == null) delete bitJson.language;
    if (bitJson.publisher == null) delete bitJson.publisher;
    if (bitJson.publisherName == null) delete bitJson.publisherName;
    if (bitJson.theme == null) delete bitJson.theme;
    if (bitJson.computerLanguage == null) delete bitJson.computerLanguage;
    if (bitJson.target == null) delete bitJson.target;
    if (bitJson.slug == null) delete bitJson.slug;
    if (bitJson.tag == null) delete bitJson.tag;
    if (bitJson.reductionTag == null) delete bitJson.reductionTag;
    if (bitJson.bubbleTag == null) delete bitJson.bubbleTag;
    if (bitJson.levelCEFRp == null) delete bitJson.levelCEFRp;
    if (bitJson.levelCEFR == null) delete bitJson.levelCEFR;
    if (bitJson.levelILR == null) delete bitJson.levelILR;
    if (bitJson.levelACTFL == null) delete bitJson.levelACTFL;
    if (bitJson.icon == null) delete bitJson.icon;
    if (bitJson.iconTag == null) delete bitJson.iconTag;
    if (bitJson.colorTag == null) delete bitJson.colorTag;
    if (bitJson.flashcardSet == null) delete bitJson.flashcardSet;
    if (bitJson.subtype == null) delete bitJson.subtype;
    if (bitJson.bookAlias == null) delete bitJson.bookAlias;
    if (bitJson.coverImage == null) delete bitJson.coverImage;
    if (bitJson.coverColor == null) delete bitJson.coverColor;
    if (bitJson.publications == null) delete bitJson.publications;
    if (bitJson.author == null) delete bitJson.author;
    if (bitJson.subject == null) delete bitJson.subject;
    if (bitJson.date == null) delete bitJson.date;
    if (bitJson.dateEnd == null) delete bitJson.dateEnd;
    if (bitJson.location == null) delete bitJson.location;
    if (bitJson.kind == null) delete bitJson.kind;
    if (bitJson.hasMarkAsDone == null) delete bitJson.hasMarkAsDone;
    if (bitJson.processHandIn == null) delete bitJson.processHandIn;
    if (bitJson.action == null) delete bitJson.action;
    if (bitJson.showInIndex == null) delete bitJson.showInIndex;
    if (bitJson.blockId == null) delete bitJson.blockId;
    if (bitJson.pageNo == null) delete bitJson.pageNo;
    if (bitJson.x == null) delete bitJson.x;
    if (bitJson.y == null) delete bitJson.y;
    if (bitJson.width == null) delete bitJson.width;
    if (bitJson.height == null) delete bitJson.height;
    if (bitJson.index == null) delete bitJson.index;
    if (bitJson.classification == null) delete bitJson.classification;
    if (bitJson.availableClassifications == null) delete bitJson.availableClassifications;
    if (bitJson.allowedBit == null) delete bitJson.allowedBit;
    if (bitJson.tableFixedHeader == null) delete bitJson.tableFixedHeader;
    if (bitJson.tableSearch == null) delete bitJson.tableSearch;
    if (bitJson.tableSort == null) delete bitJson.tableSort;
    if (bitJson.tablePagination == null) delete bitJson.tablePagination;
    if (bitJson.tablePaginationLimit == null) delete bitJson.tablePaginationLimit;
    if (bitJson.tableHeight == null) delete bitJson.tableHeight;
    if (bitJson.tableWhitespaceNoWrap == null) delete bitJson.tableWhitespaceNoWrap;
    if (bitJson.tableAutoWidth == null) delete bitJson.tableAutoWidth;
    if (bitJson.tableResizableColumns == null) delete bitJson.tableResizableColumns;
    if (bitJson.quizCountItems == null) delete bitJson.quizCountItems;
    if (bitJson.quizStrikethroughSolutions == null) delete bitJson.quizStrikethroughSolutions;
    if (bitJson.codeLineNumbers == null) delete bitJson.codeLineNumbers;
    if (bitJson.codeMinimap == null) delete bitJson.codeMinimap;
    if (bitJson.stripePricingTableId == null) delete bitJson.stripePricingTableId;
    if (bitJson.stripePublishableKey == null) delete bitJson.stripePublishableKey;
    if (bitJson.thumbImage == null) delete bitJson.thumbImage;
    if (bitJson.scormSource == null) delete bitJson.scormSource;
    if (bitJson.posterImage == null) delete bitJson.posterImage;
    if (bitJson.focusX == null) delete bitJson.focusX;
    if (bitJson.focusY == null) delete bitJson.focusY;
    if (bitJson.pointerLeft == null) delete bitJson.pointerLeft;
    if (bitJson.pointerTop == null) delete bitJson.pointerTop;
    if (bitJson.listItemIndent == null) delete bitJson.listItemIndent;
    if (bitJson.backgroundWallpaper == null) delete bitJson.backgroundWallpaper;
    if (bitJson.hasBookNavigation == null) delete bitJson.hasBookNavigation;
    if (bitJson.duration == null) delete bitJson.duration;
    if (bitJson.deeplink == null) delete bitJson.deeplink;
    if (bitJson.externalLink == null) delete bitJson.externalLink;
    if (bitJson.externalLinkText == null) delete bitJson.externalLinkText;
    if (bitJson.videoCallLink == null) delete bitJson.videoCallLink;
    if (bitJson.vendorUrl == null) delete bitJson.vendorUrl;
    if (bitJson.search == null) delete bitJson.search;
    if (bitJson.list == null) delete bitJson.list;
    if (bitJson.textReference == null) delete bitJson.textReference;
    if (bitJson.isTracked == null) delete bitJson.isTracked;
    if (bitJson.isInfoOnly == null) delete bitJson.isInfoOnly;
    if (bitJson.imageFirst == null) delete bitJson.imageFirst;
    if (bitJson.activityType == null) delete bitJson.activityType;
    if (bitJson.labelTrue == null) delete bitJson.labelTrue;
    if (bitJson.labelFalse == null) delete bitJson.labelFalse;
    if (bitJson.content2Buy == null) delete bitJson.content2Buy;
    if (bitJson.mailingList == null) delete bitJson.mailingList;
    if (bitJson.buttonCaption == null) delete bitJson.buttonCaption;
    if (bitJson.callToActionUrl == null) delete bitJson.callToActionUrl;
    if (bitJson.caption == null) delete bitJson.caption;
    if (bitJson.quotedPerson == null) delete bitJson.quotedPerson;
    if (bitJson.resolved == null) delete bitJson.resolved;
    if (bitJson.resolvedDate == null) delete bitJson.resolvedDate;
    if (bitJson.resolvedBy == null) delete bitJson.resolvedBy;
    if (bitJson.maxCreatedBits == null) delete bitJson.maxCreatedBits;
    if (bitJson.maxDisplayLevel == null) delete bitJson.maxDisplayLevel;
    if (bitJson.page == null) delete bitJson.page;
    if (bitJson.productId == null) delete bitJson.productId;
    if (bitJson.product == null) delete bitJson.product;
    if (bitJson.productVideo == null) delete bitJson.productVideo;
    if (bitJson.productFolder == null) delete bitJson.productFolder;
    if (bitJson.technicalTerm == null) delete bitJson.technicalTerm;
    if (bitJson.servings == null) delete bitJson.servings;
    if (bitJson.ratingLevelStart == null) delete bitJson.ratingLevelStart;
    if (bitJson.ratingLevelEnd == null) delete bitJson.ratingLevelEnd;
    if (bitJson.ratingLevelSelected == null) delete bitJson.ratingLevelSelected;

    // Book data
    if (bitJson.title == null) delete bitJson.title;
    if (bitJson.subtitle == null) delete bitJson.subtitle;
    if (bitJson.level == null) delete bitJson.level;
    if (bitJson.toc == null) delete bitJson.toc;
    if (bitJson.progress == null) delete bitJson.progress;
    if (bitJson.anchor == null) delete bitJson.anchor;
    if (bitJson.reference == null) delete bitJson.reference;
    if (bitJson.referenceEnd == null) delete bitJson.referenceEnd;

    // Item, Lead, Hint, Instruction
    if (bitJson.item == null) delete bitJson.item;
    if (bitJson.lead == null) delete bitJson.lead;
    if (bitJson.pageNumber == null) delete bitJson.pageNumber;
    if (bitJson.marginNumber == null) delete bitJson.marginNumber;
    if (bitJson.hint == null) delete bitJson.hint;
    if (bitJson.instruction == null) delete bitJson.instruction;

    // Example
    if (bitJson.example === undefined) delete bitJson.example;
    if (bitJson.isExample == null) delete bitJson.isExample;

    // Mark
    if (bitJson.marks == null) delete bitJson.marks;

    // Extra Properties
    if (bitJson.extraProperties == null) delete bitJson.extraProperties;

    // Body
    if (bitJson.body == null && textFormat !== TextFormat.json) delete bitJson.body;

    // Placeholders
    if (bitJson.placeholders == null || Object.keys(bitJson.placeholders).length === 0) delete bitJson.placeholders;

    // Resource
    if (bitJson.imagePlaceholder == null) delete bitJson.imagePlaceholder;
    if (bitJson.resource == null) delete bitJson.resource;
    if (bitJson.logos == null) delete bitJson.logos;
    if (bitJson.images == null) delete bitJson.images;

    // Children
    if (bitJson.statement == null) delete bitJson.statement;
    if (bitJson.isCorrect == null) delete bitJson.isCorrect;
    if (bitJson.sampleSolution == null) delete bitJson.sampleSolution;
    if (bitJson.additionalSolutions == null) delete bitJson.additionalSolutions;
    if (bitJson.partialAnswer == null) delete bitJson.partialAnswer;
    if (bitJson.elements == null) delete bitJson.elements;
    if (bitJson.cards == null) delete bitJson.cards;
    if (bitJson.descriptions == null) delete bitJson.descriptions;
    if (bitJson.statements == null) delete bitJson.statements;
    if (bitJson.responses == null) delete bitJson.responses;
    if (bitJson.quizzes == null) delete bitJson.quizzes;
    if (bitJson.heading == null) delete bitJson.heading;
    if (bitJson.pairs == null) delete bitJson.pairs;
    if (bitJson.matrix == null) delete bitJson.matrix;
    if (bitJson.table == null) delete bitJson.table;
    if (bitJson.choices == null) delete bitJson.choices;
    if (bitJson.questions == null) delete bitJson.questions;
    if (bitJson.captionDefinitionList == null) delete bitJson.captionDefinitionList;
    if (bitJson.listItems == null) delete bitJson.listItems;
    if (bitJson.sections == null) delete bitJson.sections;

    // Placeholders
    if (!plainText || bitJson.placeholders == null) delete bitJson.placeholders;

    // Footer
    if (bitJson.footer == null) delete bitJson.footer;

    // Walk the entire json object and remove all' '_xxx' properties
    // (which are used to store temporary data during the generation process)
    this.removeTemporaryProperties(bitJson);

    return bitJson;
  }

  /**
   * Remove any property with a key starting with an underscore.
   *
   * @param json
   */
  protected removeTemporaryProperties(json: Record<string, unknown>): void {
    for (const key in json) {
      if (key.startsWith('_')) {
        delete json[key];
      } else if (typeof json[key] === 'object') {
        this.removeTemporaryProperties(json[key] as Record<string, unknown>);
      }
    }
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

export { JsonGenerator };
