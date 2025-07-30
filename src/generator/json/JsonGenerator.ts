import { Ast, type NodeInfo } from '../../ast/Ast.ts';
import { type Writer } from '../../ast/writer/Writer.ts';
import { Breakscape } from '../../breakscaping/Breakscape.ts';
import { Config } from '../../config/Config.ts';
import { type BreakscapedString } from '../../model/ast/BreakscapedString.ts';
import { type Bit, type BitmarkAst } from '../../model/ast/Nodes.ts';
import { type Example, type ExtraProperties } from '../../model/ast/Nodes.ts';
import { type Body, type CardBit } from '../../model/ast/Nodes.ts';
import { NodeType, type NodeTypeType } from '../../model/ast/NodeType.ts';
import {
  type JsonText,
  type TextAst,
  type TextNode,
  type TextNodeAttibutes,
} from '../../model/ast/TextNodes.ts';
import {
  configKeyToPropertyType,
  configKeyToResourceType,
} from '../../model/config/enum/ConfigKey.ts';
import {
  BitmarkVersion,
  type BitmarkVersionType,
  DEFAULT_BITMARK_VERSION,
} from '../../model/enum/BitmarkVersion.ts';
import { BitType, type BitTypeType } from '../../model/enum/BitType.ts';
import { BodyBitType, type BodyBitTypeType } from '../../model/enum/BodyBitType.ts';
import { ExampleType } from '../../model/enum/ExampleType.ts';
import { PropertyKey } from '../../model/enum/PropertyKey.ts';
import { ResourceType, type ResourceTypeType } from '../../model/enum/ResourceType.ts';
import { TextFormat, type TextFormatType } from '../../model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from '../../model/enum/TextLocation.ts';
import { TextNodeType } from '../../model/enum/TextNodeType.ts';
import {
  type BitJson,
  type BookReferenceJson,
  type ExampleJson,
  type HeadingJson,
  type ListItemJson,
  type MarkConfigJson,
  type StatementJson,
} from '../../model/json/BitJson.ts';
import { type BitWrapperJson } from '../../model/json/BitWrapperJson.ts';
import { type BodyBitJson } from '../../model/json/BodyBitJson.ts';
import {
  type ImageResourceWrapperJson,
  type ResourceJson,
  type ResourceWrapperJson,
} from '../../model/json/ResourceJson.ts';
import { type ParserInfo } from '../../model/parser/ParserInfo.ts';
import { TextParser } from '../../parser/text/TextParser.ts';
import { BooleanUtils } from '../../utils/BooleanUtils.ts';
import { NumberUtils } from '../../utils/NumberUtils.ts';
import { AstWalkerGenerator } from '../AstWalkerGenerator.ts';
import { TextGenerator } from '../text/TextGenerator.ts';

const MOVE_BODY_RECURSION_LIMIT = 5000;

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
  __isDefaultExample: boolean;
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
  protected textGenerator: TextGenerator;
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
  private placeholderIndex = 0;

  /**
   * Generate bitmark JSON from a bitmark AST
   *
   * @param writer - destination for the output
   * @param options - JSON generation options
   */
  constructor(writer: Writer, options?: JsonGeneratorOptions) {
    super();

    // Bind callbacks
    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);
    this.bodyBitCallback = this.bodyBitCallback.bind(this);

    this.bitmarkVersion =
      BitmarkVersion.fromValue(options?.bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.textParserVersion = this.textParser.version();
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options?.jsonOptions,
    };

    this.debugGenerationInline = this.options.debugGenerationInline ?? false;
    this.jsonPrettifySpace =
      this.options.prettify === true ? 2 : this.options.prettify || undefined;

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

    // Create the text generator for generating v2 texts
    this.textGenerator = new TextGenerator(BitmarkVersion.v2, {
      // writeCallback: this.write,
      bodyBitCallback: this.bodyBitCallback,
      debugGenerationInline: this.debugGenerationInline,
    });

    this.writer = writer;

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

    // Write the JSON object to file
    this.write(JSON.stringify(this.json, null, this.jsonPrettifySpace));

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
    this.listItem = undefined;
    this.placeholderIndex = 0;

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

  protected exit_bitmarkAst(_node: NodeInfo, _route: NodeInfo[]): void {
    // Convert all bitmark text to plain text if required
    if (this.options.textAsPlainText) {
      // Convert all bitmark text to plain text
      this.convertAllBitmarkTextsToStringsForPlainText(this.json);
    }

    // Walk the entire json object and remove all' '_xxx' properties
    // (which are used to store temporary data during the generation process)
    this.removeTemporaryProperties(this.json);
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
    const textFormat = this.getTextFormat(_route);
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
        // Don't use sampleSolution as the default example for conversation bits
        // See: https://github.com/getMoreBrain/cosmic/issues/7293
        // defaultExample = (ArrayUtils.asSingle(bit.sampleSolution) as string) ?? '';
        defaultExample = 'true';
      }

      const exampleRes = this.toExample(bit as ExampleNode, {
        defaultExample,
        isBoolean,
        textFormat,
      });
      this.bitJson.isExample = exampleRes.isExample;
      this.bitJson.example = exampleRes.example;
    } else if (bit.isExample) {
      this.bitJson.isExample = true;
    }

    // Reset the placeholder index
    this.placeholderIndex = 0;
  }

  protected exit_bitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    // Move isExample / example to end of bit JSON from beginning
    const isExample = this.bitJson.isExample;
    const example = this.bitJson.example;
    delete this.bitJson.isExample;
    delete this.bitJson.example;
    this.bitJson.isExample = isExample;
    this.bitJson.example = example;

    // Clean up the bit JSON, removing any unwanted values
    this.cleanBitJson(this.bitJson);
  }

  // bitmarkAst -> bits -> bitsValue -> imageSource

  protected enter_imageSource(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> person

  protected enter_person(node: NodeInfo, route: NodeInfo[]): boolean {
    const bitType = this.getBitType(route);

    let keyOverride = 'person';
    if (Config.isOfBitType(bitType, BitType.conversationLeft1)) {
      // Use the legacy partner property in the JSON for conversation bits, so change to person is backwards compatible
      keyOverride = 'partner';
    }

    return this.standardHandler(node, route, NodeType.bitsValue, { array: false, keyOverride });
  }

  // bitmarkAst -> bits -> bitsValue -> ratingLevelStart

  protected enter_ratingLevelStart(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> ratingLevelEnd

  protected enter_ratingLevelEnd(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> productId

  protected enter_productId(node: NodeInfo, route: NodeInfo[]): boolean {
    const productIds = node.value as string[];

    // Ignore item that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const bitType = this.getBitType(route);

    if (bitType === BitType.module) {
      this.addProperty(this.bitJson, 'productId', productIds, { array: true });
    } else if (productIds.length > 0) {
      this.addProperty(this.bitJson, 'productId', productIds[productIds.length - 1], {
        array: false,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> markConfig

  protected enter_markConfig(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Handler so markConfig is not processed by the default property handler
    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> markConfig -> markConfigValue

  protected enter_markConfigValue(node: NodeInfo, route: NodeInfo[]): boolean {
    const markJson = node.value as MarkConfigJson;

    // Ignore item that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.markConfig) return true;

    if (!this.bitJson.marks) this.bitJson.marks = [];
    this.bitJson.marks.push(markJson);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> item

  protected enter_item(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> lead

  protected enter_lead(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> pageNumber

  protected enter_pageNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> marginNumber

  protected enter_marginNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> hint

  protected enter_hint(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> instruction

  protected enter_instruction(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> title

  protected enter_title(node: NodeInfo, route: NodeInfo[]): boolean {
    // // Ignore title that are not at the bit or card node level as they are handled elsewhere
    // const parent = this.getParentNode(route);
    // if (parent?.key !== NodeType.bitsValue && parent?.key !== NodeType.cardNode) return;

    // this.bitJson.title = node.value;
    return this.standardHandler(node, route, [NodeType.bitsValue, NodeType.cardNode], {
      array: true,
    });
  }

  //  bitmarkAst -> bits -> bitsValue -> subtitle

  protected enter_subtitle(node: NodeInfo, route: NodeInfo[]): boolean {
    // this.bitJson.subtitle = node.value;
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  //  bitmarkAst -> bits -> bitsValue -> caption

  protected enter_caption(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
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
    return this.standardHandler(node, route, undefined, { array: false, valueOverride: value });
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
    return this.standardHandler(node, route, undefined, { array: false, valueOverride: value });
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
        this.addProperty(this.bitJson, k, values, { array: true });
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> cardBits -> cardBitsValue

  protected enter_cardBitsValue(node: NodeInfo, route: NodeInfo[]): void {
    const cardBit = node.value as CardBit;

    // How cardBits are handled depends on the bit type
    const bitType = this.getBitType(route);
    if (!bitType) return;

    let listItems: ListItemJson[] | undefined;

    if (bitType === BitType.bookReferenceList) {
      if (!this.bitJson.bookReferences) this.bitJson.bookReferences = [];
      const bookReference: Partial<BookReferenceJson> = {};

      this.addProperty(bookReference, 'lang', cardBit.lang, { array: false });
      this.addProperty(bookReference, 'refAuthor', cardBit.refAuthor ?? [], { array: true });
      this.addProperty(bookReference, 'refBookTitle', cardBit.refBookTitle ?? [], { array: false });
      this.addProperty(bookReference, 'refPublisher', cardBit.refPublisher ?? [], { array: true });
      this.addProperty(bookReference, 'refPublicationYear', cardBit.refPublicationYear ?? [], {
        array: false,
      });
      this.addProperty(bookReference, 'citationStyle', cardBit.citationStyle ?? [], {
        array: false,
      });

      this.bitJson.bookReferences.push(bookReference as BookReferenceJson);
    } else {
      // Create the listItems / sections if not already created
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
  }

  protected exit_cardBitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    this.listItem = undefined;
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, route: NodeInfo[]): boolean {
    const value = node.value as Body;

    const parent = this.getParentNode(route);
    if (!parent) return false;

    const textFormat = this.getTextFormat(route);
    const isBitmarkText = textFormat === TextFormat.bitmarkText;

    this.bodyJson = value.body as JsonText;

    // Set the correct body property
    if (parent.key === NodeType.bitsValue) {
      // Body is at the bit level
      this.bitJson.body = this.bodyJson;

      const bodyIsBitmarkText = isBitmarkText && this.isBitmarkText(this.bodyJson);

      // Convert the body to plain text if required
      if (this.options.textAsPlainText && bodyIsBitmarkText) {
        const textBody = this.textGenerator.generateSync(
          this.bodyJson as TextAst,
          textFormat,
          TextLocation.body,
          {
            noBreakscaping: true,
          },
        );
        this.bitJson.body = (textBody ?? '').trim();
      } else if (bodyIsBitmarkText) {
        // If the body is bitmark text, convert the body bits to move their attributes to the attrs property
        this.bitJson.body = this.moveBodyBitPropertiesToAttrs(this.bodyJson as TextAst);
      }
    } else if (parent.key === NodeType.cardBitsValue) {
      // Body is at the list item (card bit) level
      if (this.listItem) this.listItem.body = this.bodyJson;
    }

    // Stop traversal of this branch
    return false;
  }

  protected bodyBitCallback(bodyBit: BodyBitJson, _index: number, _route: NodeInfo[]): string {
    // console.log('bodyBitCallback', bodyBit, index, route);

    const placeholder = `{${this.placeholderIndex}}`;
    this.placeholderIndex++;
    this.bitJson.placeholders = this.bitJson.placeholders ?? {};
    this.bitJson.placeholders[placeholder] = bodyBit;

    return placeholder;
  }

  /**
   * Move all properties of body bits to the attrs property.
   * This function is called recursively to process all body bits in the body tree.
   *
   * NOTE: Internally, the body bit is stored as it appears in bitmark v2, but in v3 all the properties
   * should be in the `attrs` property. The properies are only moved to 'attrs' for the JSON output
   *
   * The original body bit is not modified.
   * The function returns a new body bit with the properties moved.
   *
   * @param nodes the body to process, or the subtree to process
   * @param recursion leave as default, used for recursion only
   * @returns
   */
  protected moveBodyBitPropertiesToAttrs(nodes: TextAst, recursion: number = 0): TextAst {
    if (recursion === 0) {
      nodes = structuredClone(nodes);
    } else if (recursion > MOVE_BODY_RECURSION_LIMIT) {
      throw new Error('Recursion limit exceeded');
    }
    for (const node of nodes) {
      if (
        node.type !== BodyBitType.text &&
        BodyBitType.values().includes(node.type as BodyBitTypeType)
      ) {
        const bodyBit = node as unknown as BodyBitJson;
        bodyBit.attrs = {} as Record<string, unknown>;

        // Move all properties except type to the attrs property
        for (const [key, value] of Object.entries(bodyBit)) {
          if (key === 'type' || key === 'attrs') continue;
          bodyBit.attrs[key] = value;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (bodyBit as any)[key];
        }
      } else if (Array.isArray(node.content)) {
        recursion++;
        this.moveBodyBitPropertiesToAttrs(node.content as TextAst, recursion);
      }
    }

    return nodes;
  }

  // bitmarkAst -> bits -> bitsValue -> footer

  protected enter_footer(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, undefined, {
      array: true,
      valueOverride: node.value.footer,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, undefined, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards

  protected enter_flashcards(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, {
      array: true,
      keyOverride: 'cards',
    });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions

  protected enter_definitions(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
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

  protected enter_statements(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> choices
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> feedbacks -> feedbacksValue -> choices

  protected enter_choices(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> responses
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses

  protected enter_responses(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> feedbacks

  protected enter_feedbacks(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes

  protected enter_quizzes(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, undefined, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix

  protected enter_matrix(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable

  protected enter_pronunciationTable(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table

  protected enter_table(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, {
      array: true,
      keyOverride: 'responses',
    });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients -> ingredientsValue
  protected enter_ingredients(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList

  protected enter_captionDefinitionList(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.cardNode, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> backgroundWallpaper

  protected enter_backgroundWallpaper(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> imagePlaceholder

  protected enter_imagePlaceholder(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> resources

  protected enter_resources(node: NodeInfo, route: NodeInfo[]): boolean {
    const resources = node.value as ResourceJson[];
    const bitType = this.getBitType(route);
    const resourceType = this.getResourceType(route);

    if (!resources || !bitType) return true;

    let resourceJson: ResourceJson | undefined;

    const bitConfig = Config.getBitConfig(bitType);
    const bitResourcesConfig = Config.getBitResourcesConfig(bitType, resourceType);
    const comboMap = bitResourcesConfig.comboResourceConfigKeysMap;

    if (comboMap.size > 0) {
      // The resource is a combo resource
      // Extract the resource types from the combo resource
      // NOTE: There should only ever be one combo resource per bit, but the code can handle multiple
      // except for overwriting resourceJson
      for (const [comboConfigKey, resourceConfigKeys] of comboMap.entries()) {
        // Convert the config key to a ResourceType
        const comboTagType = configKeyToResourceType(comboConfigKey);

        // Create the combo resource wrapper
        const wrapper: ResourceWrapperJson = {
          type: comboTagType,
          __typeAlias: comboTagType,
          __configKey: comboConfigKey,
        };

        // For each of the resources in this combo resource, find the actual resource and add it to the JSON
        for (const ck of resourceConfigKeys) {
          const r = resources.find((r) => r.__configKey === ck);
          // Extract everything except the type from the resource
          if (r) {
            const tagConfig = Config.getTagConfigForTag(bitConfig.tags, r.__configKey);
            if (tagConfig) {
              const key = tagConfig.jsonKey ?? tagConfig.tag;
              const configKey = tagConfig.configKey ?? r.__configKey;
              const json = r.__configKey === configKey ? r : undefined;
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
        }
        resourceJson = wrapper as ResourceJson;
      }
    } else if (Config.isOfBitType(bitType, [BitType.imagesLogoGrave, BitType.prototypeImages])) {
      // The resource is a logo-grave  / prototpye-images resource
      const images: ImageResourceWrapperJson[] = [];
      for (const r of resources) {
        if (r.type === ResourceType.image) {
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

    return false;
  }

  //  bitmarkAst -> bits -> bitsValue -> level

  protected leaf_level(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> book (array)

  protected enter_book(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: true });
  }

  // bitmarkAst -> bits -> bitsValue -> book (single)

  protected leaf_book(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  //  bitmarkAst -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  //  bitmarkAst -> bits -> bitsValue -> reference

  protected leaf_reference(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  //  bitmarkAst -> bits -> bitsValue -> referenceEnd

  protected leaf_referenceEnd(node: NodeInfo, route: NodeInfo[]): boolean {
    return this.standardHandler(node, route, NodeType.bitsValue, { array: false });
  }

  // bitmarkAst -> bits -> bitsValue -> markup

  protected leaf_markup(node: NodeInfo, _route: NodeInfo[]): boolean {
    const bitmark = node.value as string | undefined;
    if (bitmark) this.bitWrapperJson.bitmark = bitmark;

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> * -> internalComment

  protected enter_internalComment(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Stop traversal of this branch, handled in enter_parser()
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> parser

  protected enter_parser(node: NodeInfo, route: NodeInfo[]): void {
    const parser = node.value as ParserInfo | undefined;
    const bitType = this.getBitType(route);
    const parent = this.getParentNode(route);

    if (parser && bitType) {
      const {
        version,
        excessResources: parserExcessResources,
        warnings,
        errors,
        ...parserRest
      } = parser;
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

  //
  // Generated Node Handlers
  //

  /**
   * Generate the handlers for properties, as they are mostly the same, but not quite
   */
  protected generatePropertyHandlers() {
    // TODO
    // const propertiesConfig = Config.getRawPropertiesConfig();
    // for (const propertyConfig of Object.values(propertiesConfig)) {
    //   const astKey = propertyConfig.astKey ?? propertyConfig.tag;
    //   const funcName = `enter_${astKey}`;
    //   // Skip if the function already exists, allows for custom handlers
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   if (typeof (this as any)[funcName] === 'function') {
    //     continue;
    //   }
    //   // Skip 'example' property as it is non-standard and handled elsewhere
    //   if (astKey === 'example') continue;
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this as any)[funcName] = (node: NodeInfo, route: NodeInfo[]) => {
    //     const value = node.value as unknown[] | undefined;
    //     if (value == null) return;
    //     // if (key === 'progress') debugger;
    //     // Ignore any property that is not at the bit level as that will be handled by a different handler
    //     const parent = this.getParentNode(route);
    //     if (parent?.key !== NodeType.bitsValue) return;
    //     // Convert key as needed
    //     const jsonKey = propertyConfig.jsonKey ?? propertyConfig.tag;
    //     // Add the property
    //     this.addProperty(this.bitJson, jsonKey, value, { array: !propertyConfig.single });
    //   };
    //   // Bind this
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this as any)[funcName] = (this as any)[funcName].bind(this);
    // }

    for (const propertyConfigKey of PropertyKey.values()) {
      const propertyTag = configKeyToPropertyType(propertyConfigKey);

      const funcNames = [`enter_${propertyTag}`, `leaf_${propertyTag}`];
      for (const funcName of funcNames) {
        // Skip if the function already exists, allows for custom handlers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (this as any)[funcName] === 'function') {
          continue;
        }
        // Skip 'example' property as it is non-standard and handled elsewhere
        if (propertyTag === 'example') continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[funcName] = (node: NodeInfo, route: NodeInfo[]) => {
          const value = node.value as unknown[] | undefined;
          if (value == null) return;
          // if (key === 'progress') debugger;
          // Ignore any property that is not at the bit level as that will be handled by a different handler
          const parent = this.getParentNode(route);
          if (parent?.key !== NodeType.bitsValue) return;
          // // Convert key as needed
          // const jsonKey = propertyConfig.jsonKey ?? propertyConfig.tag;
          // // Add the property
          // this.addProperty(this.bitJson, jsonKey, value, { array: !propertyConfig.single });

          // Add the property
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this.bitJson as any)[propertyTag] = value;
        };
        // Bind this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[funcName] = (this as any)[funcName].bind(this);
      }
    }
  }

  // // END NODE HANDLERS

  //
  // HELPER FUNCTIONS
  //

  /**
   * Default handler for properties.
   *
   * @param node the node
   * @param route  the route to the node
   * @param parentNodeTypes the parent node types for which to handle the node
   * @returns
   */
  protected standardHandler(
    node: NodeInfo,
    route: NodeInfo[],
    parentNodeTypes: NodeTypeType | NodeTypeType[] | undefined,
    options: {
      array: boolean;
      allowNull?: boolean;
      keyOverride?: string;
      valueOverride?: unknown;
    },
  ): boolean {
    // Ignore items not at the nodeType level
    if (parentNodeTypes) {
      const nodeTypeArray = Array.isArray(parentNodeTypes) ? parentNodeTypes : [parentNodeTypes];
      const parent = this.getParentNode(route);
      if (!parent?.key || !nodeTypeArray.includes(parent?.key)) return true;
    }

    // Add the property
    this.addProperty(
      this.bitJson,
      options.keyOverride ?? node.key,
      options.valueOverride ?? node.value,
      options,
    );

    // Stop traversal of this branch
    return false;
  }

  protected addProperty(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    name: string,
    values: unknown | unknown[] | undefined,
    options: {
      array: boolean;
      allowNull?: boolean;
    },
  ): void {
    if (values !== undefined) {
      let finalValue: unknown | unknown[] | undefined;
      if (!Array.isArray(values)) values = [values];
      const valuesArr = values as unknown[];

      // if (valuesArr.length > 0) {
      if (!options.array && valuesArr.length >= 1) {
        finalValue = valuesArr[valuesArr.length - 1];
      } else {
        finalValue = valuesArr;
      }
      // }

      if (options.allowNull || finalValue != null) {
        target[name] = finalValue;
      }
    }
  }

  protected toExample(
    node: ExampleNode,
    options: {
      defaultExample: string | boolean | null;
      isBoolean: boolean;
      textFormat: TextFormatType;
    },
  ): ExampleJsonWrapper {
    const { isExample, example, __isDefaultExample } = node;
    const { defaultExample, isBoolean } = options;

    if (!isExample) {
      return {
        isExample: false,
        example: null,
      };
    }

    let exampleValue;
    if (__isDefaultExample) {
      exampleValue = isBoolean
        ? BooleanUtils.toBoolean(defaultExample)
        : this.convertBreakscapedStringToJsonText(
            defaultExample as BreakscapedString,
            options.textFormat,
            TextLocation.tag,
          );
    } else {
      exampleValue = isBoolean
        ? BooleanUtils.toBoolean(example)
        : this.convertBreakscapedStringToJsonText(
            example as BreakscapedString,
            options.textFormat,
            TextLocation.tag,
          );
    }

    return {
      isExample: true,
      example: exampleValue,
    };
  }

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

    return TextFormat.bitmarkText;
  }

  /**
   * Get the bit resourceType atttachment from any node
   *
   * @param route the route to the current node
   * @returns the bit type
   */
  protected getResourceType(route: NodeInfo[]): ResourceTypeType | undefined {
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
    format: TextFormatType,
    textLocation: TextLocationType,
  ): JsonText {
    if (!text) return '';

    const isBitmarkText = format === TextFormat.bitmarkText;

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
      format,
      location: textLocation,
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
  protected concatenatePlainTextWithJsonTexts(
    text: JsonText,
    extraBreaks: number,
    textPlain: string,
  ): JsonText {
    if (Array.isArray(text)) {
      textPlain = textPlain.trim();
      if (textPlain) {
        const splitText = textPlain.split('\n');
        const content: TextNode[] = [];

        for (let i = 0; i < extraBreaks; i++) {
          content.push({
            type: TextNodeType.hardBreak,
          });
        }

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

    return `${text ?? ''}${'\n'.repeat(extraBreaks)}${textPlain ?? ''}`;
  }

  /**
   * Check if an object is bitmark text
   * The check looks for a special tag on the array (__tag: 'text')
   *
   * @param obj object that might be bitmark text
   * @returns
   */
  protected isBitmarkText(obj: unknown): boolean {
    if (obj == null) return false;
    if (!Array.isArray(obj)) return false;

    // Check for the hidden text tag
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((obj as any).__tag === 'text') return true;

    return false;
  }

  //
  // WRITE FUNCTIONS
  //

  protected writeInlineDebug(
    key: string,
    state: { open?: boolean; close?: boolean; single?: boolean },
  ) {
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
    const format: string = bit.textFormat as string;

    const bitJson: Partial<BitJson> = {
      type: bit.isCommented ? BitType._comment : bit.bitType,
      originalType: bit.isCommented ? bit.bitType : undefined,
      format,
      bitLevel: bit.bitLevel,
    };

    return bitJson;
  }

  /**
   * Remove wanted properties from bit json object.
   * - This function defines the defaults for properties in the json.
   *
   * TODO: All these defaults should come from the config and be set in the Builder.
   *
   * @param bit
   * @returns
   */
  protected cleanBitJson(bitJson: Partial<BitJson>): Partial<BitJson> {
    const bitType = Config.getBitType(bitJson.type);
    const bitConfig = Config.getBitConfig(bitType);
    // const textFormat = bitJson.format;
    // const plainText = this.options.textAsPlainText;

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
      // Special case for _error and _comment bits
      delete bitJson.format;
      delete bitJson.item;
      delete bitJson.lead;
      delete bitJson.pageNumber;
      delete bitJson.marginNumber;
      delete bitJson.hint;
      delete bitJson.instruction;
      //
    } else {
      let isTopLevelExample = false;
      let isTopLevelExampleValue = false;

      // Most bits have these defaults, but there are special cases (not sure if that is by error or design)
      if (Config.isOfBitType(bitType, [BitType.page])) {
        // Bits without item, lead, etc
        if (bitJson.item == null || bitJson.item?.length === 0) delete bitJson.item;
        if (bitJson.lead == null || bitJson.lead?.length === 0) delete bitJson.lead;
        if (bitJson.pageNumber == null || bitJson.pageNumber?.length === 0)
          delete bitJson.pageNumber;
        if (bitJson.marginNumber == null || bitJson.marginNumber?.length === 0)
          delete bitJson.marginNumber;
        if (bitJson.hint == null || bitJson.hint?.length === 0) delete bitJson.hint;
        if (bitJson.instruction == null || bitJson.instruction?.length === 0)
          delete bitJson.instruction;
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
          BitType.definitionList,
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
          if (bitJson.quizStrikethroughSolutions == null)
            bitJson.quizStrikethroughSolutions = false;
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
        if (bitJson.tableHeaderWhitespaceNoWrap == null) bitJson.tableHeaderWhitespaceNoWrap = true;
        if (bitJson.tableSearch == null) bitJson.tableSearch = false;
        if (bitJson.tableSort == null) bitJson.tableSort = false;
        if (bitJson.tablePagination == null) bitJson.tablePagination = false;
        if (bitJson.tablePaginationLimit == null) bitJson.tablePaginationLimit = 0;
        if (bitJson.tableHeight == null) bitJson.tableHeight = 0;
        if (bitJson.tableWhitespaceNoWrap == null) bitJson.tableWhitespaceNoWrap = false;
        if (bitJson.tableAutoWidth == null) bitJson.tableAutoWidth = true;
        if (bitJson.tableResizableColumns == null) bitJson.tableResizableColumns = false;
        if (bitJson.tableColumnMinWidth == null) bitJson.tableColumnMinWidth = 0;
        //
      }

      if (Config.isOfBitType(bitType, BitType.bookReference)) {
        //
        if (bitJson.refAuthor == null) bitJson.refAuthor = [];
        if (bitJson.refBookTitle == null) bitJson.refBookTitle = '';
        if (bitJson.refPublisher == null) bitJson.refPublisher = [];
        if (bitJson.refPublicationYear == null) bitJson.refPublicationYear = '';
        //
      }

      // Page bits
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

      // Special case for 'toc-resource' bits
      if (Config.isOfBitType(bitType, BitType.tocResource)) {
        if (bitJson.tocResource == null) bitJson.tocResource = [];
      }

      // Special case for 'toc-content' bits
      if (Config.isOfBitType(bitType, BitType.tocContent)) {
        if (bitJson.tocContent == null) bitJson.tocContent = [];
      }

      // Special case for 'book' bits
      if (Config.isOfBitType(bitType, BitType.book)) {
        if (bitJson.maxTocChapterLevel == null) bitJson.maxTocChapterLevel = -1;
        if (bitJson.hasMarkAsDone == null) bitJson.hasMarkAsDone = false;
        if (bitJson.processHandIn == null) bitJson.processHandIn = false;
        if (bitJson.isPublic == null) bitJson.isPublic = false;
        if (bitJson.chatWithBook == null) bitJson.chatWithBook = false;
        if (bitJson.chatWithBookBrainKey == null) bitJson.chatWithBookBrainKey = '';
      }

      // Special case for 'ai' bits
      if (
        bitType === BitType.articleAi ||
        bitType === BitType.noteAi ||
        bitType === BitType.summaryAi
      ) {
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
      if (
        Config.isOfBitType(bitType, [BitType.stepImageScreenshotWithPointer, BitType.surveyMatrix])
      ) {
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

      // Special case for 'hand-in-file' bits
      if (Config.isOfBitType(bitType, BitType.handInFile)) {
        if (bitJson.handInAcceptFileType == null) bitJson.handInAcceptFileType = [];
      }

      // Special case for 'hand-in-submit' bits
      if (Config.isOfBitType(bitType, BitType.handInSubmit)) {
        if (bitJson.handInRequirement == null) bitJson.handInRequirement = [];
        if (bitJson.handInInstruction == null) bitJson.handInInstruction = '';
        if (bitJson.buttonCaption == null) bitJson.buttonCaption = '';
      }

      // Special case for 'module' bits
      if (Config.isOfBitType(bitType, BitType.module)) {
        if (bitJson.hasBookNavigation == null) bitJson.hasBookNavigation = true;
      }

      // Special case for 'container' bits
      if (Config.isOfBitType(bitType, BitType.container)) {
        if (bitJson.allowedBit == null) bitJson.allowedBit = [];
      }

      // Special case for 'quiz' bits
      if (bitConfig.quizBit) {
        if (bitJson.revealSolutions == null) bitJson.revealSolutions = false;
      }

      // Special case for 'platform-path' bits
      if (Config.isOfBitType(bitType, BitType.platformPath)) {
        if (bitJson.path == null) bitJson.path = '';
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

    return bitJson;
  }

  /**
   * Convert any bitmark texts to strings.
   */
  protected convertAllBitmarkTextsToStringsForPlainText(
    json: Record<string, unknown> | unknown[],
  ): void {
    if (!this.options.textAsPlainText) return;

    const obj = json as Record<string, unknown>;
    for (const key in obj) {
      const val = obj[key];
      if (this.isBitmarkText(val)) {
        const s = this.textGenerator.generateSync(
          val as TextAst,
          TextFormat.bitmarkText,
          TextLocation.tag,
          {
            noBreakscaping: true,
          },
        );
        obj[key] = (s ?? '').trim();
      } else if (typeof obj[key] === 'object') {
        this.convertAllBitmarkTextsToStringsForPlainText(obj[key] as Record<string, unknown>);
      }
    }
  }

  /**
   * Remove any property with a key starting with an double underscore.
   *
   * @param json
   */
  protected removeTemporaryProperties(json: Record<string, unknown> | unknown[]): void {
    const obj = json as Record<string, unknown>;
    for (const key in obj) {
      if (key.startsWith('__')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        this.removeTemporaryProperties(obj[key] as Record<string, unknown>);
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
