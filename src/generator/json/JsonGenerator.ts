import { Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { NodeType } from '../../model/ast/NodeType';
import { AudioLinkResource } from '../../model/ast/Nodes';
import { VideoEmbedResource } from '../../model/ast/Nodes';
import { VideoLinkResource } from '../../model/ast/Nodes';
import { DocumentResource } from '../../model/ast/Nodes';
import { DocumentEmbedResource } from '../../model/ast/Nodes';
import { DocumentLinkResource } from '../../model/ast/Nodes';
import { DocumentDownloadResource } from '../../model/ast/Nodes';
import { StillImageFilmEmbedResource } from '../../model/ast/Nodes';
import { StillImageFilmLinkResource } from '../../model/ast/Nodes';
import { BodyBit, BodyPart, BodyText, Flashcard, ImageLinkResource, Mark, MarkConfig } from '../../model/ast/Nodes';
import { AudioEmbedResource, ImageSource, Ingredient, RatingLevelStartEnd, Table } from '../../model/ast/Nodes';
import { JsonText, TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyAstKey } from '../../model/enum/PropertyAstKey';
import { PropertyTag } from '../../model/enum/PropertyTag';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { ParserInfo } from '../../model/parser/ParserInfo';
import { TextParser } from '../../parser/text/TextParser';
import { ArrayUtils } from '../../utils/ArrayUtils';
import { BooleanUtils } from '../../utils/BooleanUtils';
import { NumberUtils } from '../../utils/NumberUtils';
import { StringUtils } from '../../utils/StringUtils';
import { UrlUtils } from '../../utils/UrlUtils';
import { AstWalkerGenerator } from '../AstWalkerGenerator';

import {
  BotResponse,
  Example,
  ExtraProperties,
  Highlight,
  Matrix,
  Pair,
  Person,
  Question,
  Quiz,
} from '../../model/ast/Nodes';
import {
  BitmarkAst,
  Bit,
  ItemLead,
  Response,
  Statement,
  Choice,
  Heading,
  ImageResource,
  Resource,
  ArticleResource,
  Gap,
  AudioResource,
  VideoResource,
  AppLinkResource,
  WebsiteLinkResource,
  Select,
} from '../../model/ast/Nodes';
import {
  BitJson,
  BotResponseJson,
  ChoiceJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  ImageSourceJson,
  IngredientJson,
  ListItemJson,
  MarkConfigJson,
  MatrixCellJson,
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
import {
  BodyBitJson,
  GapJson,
  HighlightJson,
  HighlightTextJson,
  MarkJson,
  SelectJson,
  SelectOptionJson,
} from '../../model/json/BodyBitJson';
import {
  AppLinkResourceJson,
  ArticleResourceJson,
  AudioEmbedResourceJson,
  AudioLinkResourceJson,
  AudioResourceJson,
  BaseResourceJson,
  DocumentDownloadResourceJson,
  DocumentEmbedResourceJson,
  DocumentLinkResourceJson,
  DocumentResourceJson,
  ImageLinkResourceJson,
  ImageResourceJson,
  ImageResourceWrapperJson,
  ResourceJson,
  ResourceWrapperJson,
  StillImageFilmEmbedResourceJson,
  StillImageFilmLinkResourceJson,
  VideoEmbedResourceJson,
  VideoEmbedResourceWrapperJson,
  VideoLinkResourceJson,
  VideoResourceJson,
  WebsiteLinkResourceJson,
} from '../../model/json/ResourceJson';

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

interface ItemLeadHintInstructionNode {
  itemLead?: ItemLead;
  hint?: BreakscapedString;
  instruction?: BreakscapedString;
}

interface ItemLeadHintInstuction {
  item: JsonText;
  lead: JsonText;
  pageNumber: JsonText;
  marginNumber: JsonText;
  hint: JsonText;
  instruction: JsonText;
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
  private startPlaceholderIndex = 0;

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
    this.startPlaceholderIndex = 0;

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
        defaultExample = bit.sampleSolution ?? '';
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
    const imageSource = node.value as ImageSource;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const { url, mockupId, size, format, trim } = imageSource;

    const imageSourceJson = {} as ImageSourceJson;
    this.addProperty(imageSourceJson, 'url', url ?? '', true);
    this.addProperty(imageSourceJson, 'mockupId', mockupId ?? '', true);
    this.addProperty(imageSourceJson, 'size', size ?? null, true);
    this.addProperty(imageSourceJson, 'format', format ?? null, true);
    this.addProperty(imageSourceJson, 'trim', BooleanUtils.isBoolean(trim) ? trim : null, true);

    this.bitJson.imageSource = imageSourceJson;
  }

  // bitmarkAst -> bits -> bitsValue -> person

  protected enter_person(node: NodeInfo, route: NodeInfo[]): void {
    const person = node.value as Person;
    const bitType = this.getBitType(route);

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue || !bitType) return;

    const { name, title, avatarImage } = person;

    const personJson = {} as PersonJson;
    this.addProperty(personJson, 'name', name ?? '', true);
    if (title) {
      this.addProperty(personJson, 'title', title, true);
    }
    if (avatarImage) {
      const res = this.parseResourceToJson(bitType, avatarImage);
      if (res && res.type === ResourceTag.image) {
        personJson.avatarImage = res.image;
      }
    }

    if (Config.isOfBitType(bitType, BitType.conversationLeft1)) {
      // Use the legacy partner property in the JSON for conversation bits, so change to person is backwards compatible
      this.bitJson.partner = personJson;
    } else {
      this.bitJson.person = personJson;
    }
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
    const n = node.value as RatingLevelStartEnd;

    // Ignore statements that are not at the bit level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const json: Partial<RatingLevelStartEndJson> = {};
    this.addProperty(json, 'level', n.level, true);

    if (n.label) {
      json.label = this.convertBreakscapedStringToJsonText(n.label, TextFormat.bitmarkMinusMinus);
    }

    // Delete unwanted properties
    if (json?.label == null) delete json.label;

    return json as RatingLevelStartEndJson;
  }

  // bitmarkAst -> bits -> bitsValue -> productId

  protected enter_productId(node: NodeInfo, route: NodeInfo[]): void {
    const productIds = node.value as string[];

    // Ignore item that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;
    const bitType = this.getBitType(route);

    if (bitType === BitType.module) {
      this.addProperty(this.bitJson, 'productId', productIds);
    } else if (productIds.length > 0) {
      this.addProperty(this.bitJson, 'productId', productIds[productIds.length - 1], true);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> markConfig -> markConfigValue

  protected enter_markConfigValue(node: NodeInfo, route: NodeInfo[]): void {
    const markConfig = node.value as MarkConfig;

    // Ignore item that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.markConfig) return;

    const { mark, color, emphasis } = markConfig;

    const markJson = {} as Partial<MarkConfigJson>;

    this.addProperty(markJson, 'mark', mark ?? 'unknown', true);
    if (color) this.addProperty(markJson, 'color', color ?? '', true);
    if (emphasis) this.addProperty(markJson, 'emphasis', emphasis ?? '', true);

    if (!this.bitJson.marks) this.bitJson.marks = [];
    this.bitJson.marks.push(markJson as MarkConfigJson);
  }

  // bitmarkAst -> bits -> bitsValue -> sampleSolution

  protected leaf_sampleSolution(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore example that is not at the correct level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    if (node.value != null) this.addProperty(this.bitJson, 'sampleSolution', node.value, true);
  }

  // bitmarkAst -> bits -> bitsValue -> itemLead

  protected enter_itemLead(node: NodeInfo, route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    const { item, lead, pageNumber, marginNumber } = itemLead;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    if (item != null) {
      this.bitJson.item = this.convertBreakscapedStringToJsonText(item, TextFormat.bitmarkMinusMinus);
    }
    if (lead != null) {
      this.bitJson.lead = this.convertBreakscapedStringToJsonText(lead, TextFormat.bitmarkMinusMinus);
    }
    if (pageNumber != null) {
      this.bitJson.pageNumber = this.convertBreakscapedStringToJsonText(pageNumber, TextFormat.bitmarkMinusMinus);
    }
    if (marginNumber != null) {
      this.bitJson.marginNumber = this.convertBreakscapedStringToJsonText(marginNumber, TextFormat.bitmarkMinusMinus);
    }
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
      ...this.toItemLeadHintInstruction(node.value),
      body: this.bodyDefault,
    };

    // Delete unwanted properties
    const nv = node.value;
    const li: Partial<ListItemJson> = this.listItem;
    if (nv.pageNumber == null) delete li.pageNumber;
    if (nv.marginNumber == null) delete li.marginNumber;

    listItems.push(this.listItem);
  }

  protected exit_cardBitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    this.listItem = undefined;
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(_node: NodeInfo, _route: NodeInfo[]): void {
    // Override the bodyDefault if the textFormat is json
    const textFormat = this.getTextFormat(_route);
    if (textFormat === TextFormat.json) this.bodyDefault = null as unknown as JsonText;

    this.bodyJson = this.bodyDefault;
  }

  protected exit_body(_node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (!parent) return;

    if (parent.key === NodeType.bitsValue) {
      // Body is at the bit level
      this.bitJson.body = this.bodyJson;
    } else if (parent.key === NodeType.cardBitsValue) {
      // Body is at the list item (card bit) level
      if (this.listItem) this.listItem.body = this.bodyJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> * -> bodyParts (body, cardBody (e.g. cloze-list, page-footer))

  protected enter_bodyParts(node: NodeInfo, route: NodeInfo[]): boolean {
    const bodyParts = node.value as BodyPart[];
    const plainText = this.options.textAsPlainText;
    const textFormat = this.getTextFormat(route);
    let fullBodyTextStr: BreakscapedString = '' as BreakscapedString;
    let placeholderIndex = this.startPlaceholderIndex;

    // Function for creating the placeholder keys
    const createPlaceholderKeys = (
      i: number,
    ): { legacyPlaceholderKey: BreakscapedString; placeholderKey: BreakscapedString } => {
      return {
        // Old placeholder style (for backwards compatibility) = {0}
        legacyPlaceholderKey: `{${i}}` as BreakscapedString,

        // New placeholder style (cannot clash as bitmark parser would have removed it) = [!0]
        placeholderKey: `[!${i}]` as BreakscapedString,
      };
    };

    // Loop the text bodyParts creating full body text with the correct placeholders
    //
    // For text output 'fullBodyTextStr:
    // - is created and written to the JSON
    // - has placeholders inserted into 'fullBodyTextStr' in the format {0}
    //
    // For JSON output 'fullBodyTextStr:
    // - is created and passed into the text parser to create the body text AST
    // - has placeholders inserted into 'fullBodyTextStr' in the format [!0] to allow the text parser to identify
    //   where the body bits should be inserted
    //
    for (let i = 0; i < bodyParts.length; i++) {
      const bodyPart = bodyParts[i];

      const isText = bodyPart.type === BodyBitType.text;

      if (isText) {
        const asText = bodyPart as BodyText;
        const bodyTextPart = asText.data.bodyText;

        // Append the text part to the full text body
        fullBodyTextStr = Breakscape.concatenate(fullBodyTextStr, bodyTextPart);
      } else {
        const { legacyPlaceholderKey, placeholderKey } = createPlaceholderKeys(placeholderIndex);

        // Append the placeholder to the full text body
        fullBodyTextStr = Breakscape.concatenate(fullBodyTextStr, plainText ? legacyPlaceholderKey : placeholderKey);

        placeholderIndex++;
      }
    }

    // Add string or AST to the body
    this.bodyJson = this.convertBreakscapedStringToJsonText(fullBodyTextStr, textFormat);
    const bodyAst = this.bodyJson as TextAst;

    // Loop the body parts again to create the body bits:
    // - For text output the body bits are inserted into the 'placeholders' object
    // - For JSON output the body bits are inserted into body AST, replacing the placeholders created by the text parser
    placeholderIndex = this.startPlaceholderIndex;
    for (let i = 0; i < bodyParts.length; i++) {
      const bodyPart = bodyParts[i];

      // Skip text body parts as they are handled above
      const isText = bodyPart.type === BodyBitType.text;
      if (isText) continue;

      const bodyBit = bodyPart as BodyBit;
      let bodyBitJson: BodyBitJson | undefined;

      const { legacyPlaceholderKey } = createPlaceholderKeys(placeholderIndex);

      switch (bodyPart.type) {
        case BodyBitType.gap: {
          const gap = bodyBit as Gap;
          bodyBitJson = this.createGapJson(gap);
          break;
        }

        case BodyBitType.mark: {
          const mark = bodyBit as Mark;
          bodyBitJson = this.createMarkJson(mark);
          break;
        }

        case BodyBitType.select: {
          const select = bodyBit as Select;
          bodyBitJson = this.createSelectJson(select);
          break;
        }

        case BodyBitType.highlight: {
          const highlight = bodyBit as Highlight;
          bodyBitJson = this.createHighlightJson(highlight);
          break;
        }
      }

      // Add the gap to the placeholders
      if (bodyBitJson) {
        if (plainText) {
          // Ensure placeholders exists
          if (!this.bitJson.placeholders) this.bitJson.placeholders = {};

          // Add the body bit to the placeholders
          this.bitJson.placeholders[legacyPlaceholderKey] = bodyBitJson;
        } else {
          // Insert the body bit into the body AST
          this.replacePlaceholderWithBodyBit(bodyAst, bodyBitJson, placeholderIndex);
        }
      }

      placeholderIndex++;
    }

    // Save the current placeholder index for the next body (body, card bodies)
    this.startPlaceholderIndex = placeholderIndex;

    // Stop traversal of this branch for efficiency
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> * -> bodyJson (body when textFormat === TextFormat.json)

  protected enter_bodyJson(node: NodeInfo, _route: NodeInfo[]): boolean {
    const bodyJson = node.value as unknown;

    // NOTE: type is not really JsonText, but unknown, but it is better for type checking to use JsonText for
    // the bodyJson property in the BitJson interface
    this.bodyJson = bodyJson as JsonText;

    // Stop traversal of this branch to avoid processing the bodyJson
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(node: NodeInfo, _route: NodeInfo[]): void {
    const elements = node.value as BreakscapedString[];

    // Ignore elements that are not at the bit level as they are handled elsewhere as quizzes
    // if (parent?.key !== NodeType.bitsValue) return;

    if (elements && elements.length > 0) {
      this.bitJson.elements = Breakscape.unbreakscape(elements);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue

  protected enter_flashcards(node: NodeInfo, route: NodeInfo[]): void {
    const flashcards = node.value as Flashcard[];

    // Ignore responses that are not at the correct level as they are potentially handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    const flashcardsJson: FlashcardJson[] = [];
    if (flashcards) {
      for (const c of flashcards) {
        // Create the flashcard
        const flashcardJson: Partial<FlashcardJson> = {
          question: this.convertBreakscapedStringToJsonText(
            c.question ?? Breakscape.EMPTY_STRING,
            TextFormat.bitmarkMinusMinus,
          ),
          answer: this.convertBreakscapedStringToJsonText(
            c.answer ?? Breakscape.EMPTY_STRING,
            TextFormat.bitmarkMinusMinus,
          ),
          alternativeAnswers: (c.alternativeAnswers ?? []).map((a) =>
            this.convertBreakscapedStringToJsonText(a ?? Breakscape.EMPTY_STRING, TextFormat.bitmarkMinusMinus),
          ),
          ...this.toItemLeadHintInstruction(c),
          ...this.toExample(c, {
            defaultExample: c.isDefaultExample,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (c.itemLead?.lead == null) delete flashcardJson.lead;
        if (c.itemLead?.pageNumber == null) delete flashcardJson.pageNumber;
        if (c.itemLead?.marginNumber == null) delete flashcardJson.marginNumber;

        flashcardsJson.push(flashcardJson as FlashcardJson);
      }
    }

    if (flashcardsJson.length > 0) {
      this.bitJson.cards = flashcardsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> statement

  protected enter_statement(node: NodeInfo, route: NodeInfo[]): void {
    const statement = node.value as Statement;

    // Ignore statement that is not at the cardNode level as it is handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    if (statement) {
      this.bitJson.statement = Breakscape.unbreakscape(statement.text) ?? '';
      this.bitJson.isCorrect = statement.isCorrect ?? false;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements -> statementsValue

  protected enter_statements(node: NodeInfo, route: NodeInfo[]): void {
    const statements = node.value as Statement[];

    // Ignore statements that are not at the card node level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    const statementsJson: StatementJson[] = [];
    if (statements) {
      for (const s of statements) {
        // Create the statement
        const statementJson: Partial<StatementJson> = {
          statement: Breakscape.unbreakscape(s.text) ?? '',
          isCorrect: !!s.isCorrect,
          ...this.toItemLeadHintInstruction(s),
          ...this.toExample(s, {
            defaultExample: !!s.isCorrect,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (s.itemLead?.item == null) delete statementJson.item;
        if (s.itemLead?.lead == null) delete statementJson.lead;
        if (s.itemLead?.pageNumber == null) delete statementJson.pageNumber;
        if (s.itemLead?.marginNumber == null) delete statementJson.marginNumber;
        if (s?.hint == null) delete statementJson.hint;
        if (s?.instruction == null) delete statementJson.instruction;

        statementsJson.push(statementJson as StatementJson);
      }
    }

    if (statementsJson.length > 0) {
      this.bitJson.statements = statementsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> choices
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices

  protected enter_choices(node: NodeInfo, route: NodeInfo[]): void {
    const choices = node.value as Choice[];

    // Ignore choices that are not at the bit level as they are handled elsewhere as quizzes
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    const choicesJson: ChoiceJson[] = [];
    if (choices) {
      for (const c of choices) {
        // Create the choice
        const choiceJson: Partial<ChoiceJson> = {
          choice: Breakscape.unbreakscape(c.text) ?? '',
          isCorrect: c.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(c),
          ...this.toExample(c, {
            defaultExample: !!c.isCorrect,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (c.itemLead?.lead == null) delete choiceJson.lead;
        if (c.itemLead?.pageNumber == null) delete choiceJson.pageNumber;
        if (c.itemLead?.marginNumber == null) delete choiceJson.marginNumber;

        choicesJson.push(choiceJson as ChoiceJson);
      }
    }

    if (choicesJson.length > 0) {
      this.bitJson.choices = choicesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> responses
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses

  protected enter_responses(node: NodeInfo, route: NodeInfo[]): void {
    const responses = node.value as Response[];

    // Ignore responses that are not at the correct level as they are handled elsewhere as quizzes
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    const responsesJson: ResponseJson[] = [];
    if (responses) {
      for (const r of responses) {
        // Create the response
        const responseJson: Partial<ResponseJson> = {
          response: Breakscape.unbreakscape(r.text) ?? '',
          isCorrect: r.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(r),
          ...this.toExample(r, {
            defaultExample: !!r.isCorrect,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (r.itemLead?.lead == null) delete responseJson.lead;
        if (r.itemLead?.pageNumber == null) delete responseJson.pageNumber;
        if (r.itemLead?.marginNumber == null) delete responseJson.marginNumber;

        responsesJson.push(responseJson as ResponseJson);
      }
    }

    if (responsesJson.length > 0) {
      this.bitJson.responses = responsesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes

  protected enter_quizzes(node: NodeInfo, _route: NodeInfo[]): void {
    const quizzes = node.value as Quiz[];
    const quizzesJson: QuizJson[] = [];

    if (quizzes) {
      for (const q of quizzes) {
        // Choices
        const choicesJson: ChoiceJson[] = [];
        if (q.choices) {
          for (const c of q.choices) {
            // Create the choice
            const choiceJson: Partial<ChoiceJson> = {
              choice: Breakscape.unbreakscape(c.text) ?? '',
              isCorrect: c.isCorrect ?? false,
              ...this.toItemLeadHintInstruction(c),
              ...this.toExample(c, {
                defaultExample: !!c.isCorrect,
                isBoolean: true,
              }),
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete choiceJson.lead;
            if (q.itemLead?.pageNumber == null) delete choiceJson.pageNumber;
            if (q.itemLead?.marginNumber == null) delete choiceJson.marginNumber;

            choicesJson.push(choiceJson as ChoiceJson);
          }
        }

        // Responses
        const responsesJson: ResponseJson[] = [];
        if (q.responses) {
          for (const r of q.responses) {
            // Create the choice
            const responseJson: Partial<ResponseJson> = {
              response: Breakscape.unbreakscape(r.text) ?? '',
              isCorrect: r.isCorrect ?? false,
              ...this.toItemLeadHintInstruction(r),
              ...this.toExample(r, {
                defaultExample: !!r.isCorrect,
                isBoolean: true,
              }),
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete responseJson.lead;
            if (q.itemLead?.pageNumber == null) delete responseJson.pageNumber;
            if (q.itemLead?.marginNumber == null) delete responseJson.marginNumber;

            responsesJson.push(responseJson as ResponseJson);
          }
        }

        // Create the quiz
        const quizJson: Partial<QuizJson> = {
          ...this.toItemLeadHintInstruction(q),
          isExample: q.isExample ?? false,
          choices: q.choices ? choicesJson : undefined,
          responses: q.responses ? responsesJson : undefined,
        };

        // Delete unwanted properties
        if (q.itemLead?.lead == null) delete quizJson.lead;
        if (q.itemLead?.pageNumber == null) delete quizJson.pageNumber;
        if (q.itemLead?.marginNumber == null) delete quizJson.marginNumber;

        quizzesJson.push(quizJson as QuizJson);
      }
    }

    if (quizzesJson.length > 0) {
      this.bitJson.quizzes = quizzesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(node: NodeInfo, _route: NodeInfo[]): boolean | void {
    const heading = node.value as Heading;

    // Check if the heading is for a match or a match matrix
    const bitType = this.getBitType(_route);
    const isMatrix = Config.isOfBitType(bitType, BitType.matchMatrix);

    // Create the heading
    const headingJson: Partial<HeadingJson> = {
      forKeys: Breakscape.unbreakscape(heading.forKeys) ?? '',
    };

    if (isMatrix) {
      // Matrix match, forValues is an array
      headingJson.forValues = [];
      if (Array.isArray(heading.forValues)) {
        if (heading.forValues.length >= 1) {
          headingJson.forValues = Breakscape.unbreakscape(heading.forValues);
        }
      }
    } else {
      // Standard match, forValues is a string
      headingJson.forValues = '';
      if (Array.isArray(heading.forValues)) {
        if (heading.forValues.length >= 1) {
          headingJson.forValues = Breakscape.unbreakscape(heading.forValues[heading.forValues.length - 1]);
        }
      }
    }

    this.bitJson.heading = headingJson as HeadingJson;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(node: NodeInfo, route: NodeInfo[]): void {
    const pairs = node.value as Pair[];
    const pairsJson: PairJson[] = [];
    const bitType = this.getBitType(route);

    if (pairs && bitType) {
      for (const p of pairs) {
        // Get default example
        const defaultExample = Array.isArray(p.values) && p.values.length > 0 && p.values[0];

        // Create the question
        const pairJson: Partial<PairJson> = {
          key: Breakscape.unbreakscape(p.key) ?? '',
          keyAudio: p.keyAudio ? this.addAudioResource(bitType, p.keyAudio) : undefined,
          keyImage: p.keyImage ? this.addImageResource(bitType, p.keyImage) : undefined,
          values: Breakscape.unbreakscape(p.values) ?? [],
          ...this.toItemLeadHintInstruction(p),
          isCaseSensitive: p.isCaseSensitive ?? true,
          ...this.toExample(p, {
            defaultExample,
            isBoolean: false,
          }),
        };

        // Delete unwanted properties
        if (p.itemLead?.lead == null) delete pairJson.lead;
        if (p.itemLead?.pageNumber == null) delete pairJson.pageNumber;
        if (p.itemLead?.marginNumber == null) delete pairJson.marginNumber;
        if (pairJson.key) {
          delete pairJson.keyAudio;
          delete pairJson.keyImage;
        }
        if (pairJson.keyAudio != null) {
          delete pairJson.key;
          delete pairJson.keyImage;
        }
        if (pairJson.keyImage != null) {
          delete pairJson.key;
          delete pairJson.keyAudio;
        }

        pairsJson.push(pairJson as PairJson);
      }
    }

    if (pairsJson.length > 0) {
      this.bitJson.pairs = pairsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix

  protected enter_matrix(node: NodeInfo, _route: NodeInfo[]): void {
    const matrix = node.value as Matrix[];
    const matrixJsonArray: MatrixJson[] = [];

    if (matrix) {
      for (const m of matrix) {
        // Choices
        const matrixCellsJson: MatrixCellJson[] = [];
        if (m.cells) {
          for (const c of m.cells) {
            // Get default example
            const defaultExample = Array.isArray(c.values) && c.values.length > 0 && c.values[0];

            // Create the choice
            const matrixCellJson: Partial<MatrixCellJson> = {
              values: Breakscape.unbreakscape(c.values) ?? [],
              ...this.toItemLeadHintInstruction(c),
              isCaseSensitive: c.isCaseSensitive ?? true,
              ...this.toExample(c, {
                defaultExample,
                isBoolean: false,
              }),
            };

            // Delete unwanted properties
            if (c.itemLead?.lead == null) delete matrixCellJson.lead;
            if (c.itemLead?.pageNumber == null) delete matrixCellJson.pageNumber;
            if (c.itemLead?.marginNumber == null) delete matrixCellJson.marginNumber;
            if (c.hint == null) delete matrixCellJson.hint;

            matrixCellsJson.push(matrixCellJson as MatrixCellJson);
          }
        }

        // Create the matrix
        const matrixJson: Partial<MatrixJson> = {
          key: Breakscape.unbreakscape(m.key) ?? '',
          cells: matrixCellsJson ?? [],
          ...this.toItemLeadHintInstruction(m),
          // ...this.toExample(m.example, m.isExample),
          isExample: m.isExample ?? false,
        };

        // Delete unwanted properties
        if (m.itemLead?.lead == null) delete matrixJson.lead;
        if (m.itemLead?.pageNumber == null) delete matrixJson.pageNumber;
        if (m.itemLead?.marginNumber == null) delete matrixJson.marginNumber;
        if (m.instruction == null) delete matrixJson.instruction;

        matrixJsonArray.push(matrixJson as MatrixJson);
      }
    }

    if (matrixJsonArray.length > 0) {
      this.bitJson.matrix = matrixJsonArray;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table

  protected enter_table(node: NodeInfo, _route: NodeInfo[]): void {
    const table = node.value as Table;

    if (table) {
      const tableJson: Partial<TableJson> = {
        columns: Breakscape.unbreakscape(table.columns),
        data: table.rows.map((row) => Breakscape.unbreakscape(row)),
      };
      this.bitJson.table = tableJson as TableJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(node: NodeInfo, _route: NodeInfo[]): void {
    const questions = node.value as Question[];
    const questionsJson: QuestionJson[] = [];

    if (questions) {
      for (const q of questions) {
        // Create the question
        const questionJson: Partial<QuestionJson> = {
          question: Breakscape.unbreakscape(q.question) ?? '',
          partialAnswer: Breakscape.unbreakscape(ArrayUtils.asSingle(q.partialAnswer)) ?? '',
          sampleSolution: Breakscape.unbreakscape(q.sampleSolution) ?? '',
          ...this.toItemLeadHintInstruction(q),
          reasonableNumOfChars: q.reasonableNumOfChars,
          ...this.toExample(q, {
            defaultExample: q.sampleSolution || '',
            isBoolean: false,
          }),
        };

        // Delete unwanted properties
        if (q.itemLead?.lead == null) delete questionJson.lead;
        if (q.itemLead?.pageNumber == null) delete questionJson.pageNumber;
        if (q.itemLead?.marginNumber == null) delete questionJson.marginNumber;

        questionsJson.push(questionJson as QuestionJson);
      }
    }

    if (questionsJson.length > 0) {
      this.bitJson.questions = questionsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(node: NodeInfo, route: NodeInfo[]): void {
    const botResponses = node.value as BotResponse[];

    // Ignore responses that are not at the cardNode level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    const responsesJson: BotResponseJson[] = [];
    if (botResponses) {
      for (const r of botResponses) {
        // Create the response
        const responseJson: Partial<BotResponseJson> = {
          response: Breakscape.unbreakscape(r.response) ?? '',
          reaction: Breakscape.unbreakscape(r.reaction) ?? '',
          feedback: Breakscape.unbreakscape(r.feedback) ?? '',
          ...this.toItemLeadHintInstruction(r),
          // ...this.toExampleAndIsExample(r.example),
        };

        // Delete unwanted properties
        if (r.itemLead?.lead == null) delete responseJson.lead;
        if (r.itemLead?.pageNumber == null) delete responseJson.pageNumber;
        if (r.itemLead?.marginNumber == null) delete responseJson.marginNumber;
        if (r.hint == null) delete responseJson.hint;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (responseJson as any).instruction;

        responsesJson.push(responseJson as BotResponseJson);
      }
    }

    if (responsesJson.length > 0) {
      this.bitJson.responses = responsesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients -> ingredientsValue
  protected enter_ingredients(node: NodeInfo, route: NodeInfo[]): void {
    const ingredients = node.value as Ingredient[];

    // Ignore statements that are not at the card node level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    const ingredientsJson: IngredientJson[] = [];
    if (ingredients) {
      for (const i of ingredients) {
        // Create the ingredient
        const ingredientJson: Partial<IngredientJson> = {
          title: Breakscape.unbreakscape(i.title) ?? '',
          checked: i.checked ?? false,
          item: Breakscape.unbreakscape(i.item) ?? '',
          quantity: i.quantity ?? 0,
          unit: Breakscape.unbreakscape(i.unit) ?? '',
          unitAbbr: Breakscape.unbreakscape(i.unitAbbr) ?? '',
          decimalPlaces: i.decimalPlaces ?? 1,
          disableCalculation: i.disableCalculation ?? false,
        };

        // Delete unwanted properties
        if (i?.title == null) delete ingredientJson.title;
        // if (i?.unit == null) delete ingredientJson.unit;
        if (i?.unitAbbr == null) delete ingredientJson.unitAbbr;
        // if (i?.instruction == null) delete ingredientJson.instruction;

        ingredientsJson.push(ingredientJson as IngredientJson);
      }
    }

    if (ingredientsJson.length > 0) {
      this.bitJson.ingredients = ingredientsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> resources

  protected enter_resources(node: NodeInfo, route: NodeInfo[]): boolean | void {
    const resources = node.value as Resource[];
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
        };

        // For each of the resources in this combo resource, find the actual resource and add it to the JSON
        for (const rt of resourceTags) {
          const r = resources.find((r) => r.typeAlias === rt);
          // Extract everything except the type from the resource
          if (r) {
            const tagConfig = Config.getTagConfigForTag(bitConfig.tags, r.typeAlias);
            const key = tagConfig?.jsonKey ?? r.typeAlias;
            const json = this.parseResourceToJson(bitType, r);
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
        const json = this.parseResourceToJson(bitType, r) as ImageResourceWrapperJson;
        if (json) {
          images.push(json);
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
        resourceJson = this.parseResourceToJson(bitType, resources[0]);
      }
    }

    this.bitJson.resource = resourceJson;
  }

  //
  // Terminal nodes (leaves)
  //

  // bitmarkAst -> bits -> bitsValue -> title

  protected leaf_title(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore title that are not at the bit or card node level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue && parent?.key !== NodeType.cardNode) return;

    this.bitJson.title = this.convertBreakscapedStringToJsonText(node.value, TextFormat.bitmarkMinusMinus);
  }

  //  bitmarkAst -> bits -> bitsValue -> subtitle

  protected leaf_subtitle(node: NodeInfo, _route: NodeInfo[]): void {
    this.bitJson.subtitle = this.convertBreakscapedStringToJsonText(node.value, TextFormat.bitmarkMinusMinus);
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

  protected leaf_caption(node: NodeInfo, route: NodeInfo[]): void {
    const caption = node.value as BreakscapedString;

    // Ignore caption that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.caption = this.convertBreakscapedStringToJsonText(caption, TextFormat.bitmarkMinusMinus);
  }

  //  bitmarkAst -> bits -> bitsValue ->  * -> hint

  protected leaf_hint(node: NodeInfo, route: NodeInfo[]): void {
    const hint = node.value as BreakscapedString;

    // Ignore hint that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.hint = this.convertBreakscapedStringToJsonText(hint, TextFormat.bitmarkMinusMinus);
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, route: NodeInfo[]): void {
    const instruction = node.value as BreakscapedString;

    // Ignore instruction that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.instruction = this.convertBreakscapedStringToJsonText(instruction, TextFormat.bitmarkMinusMinus);
  }

  // bitmarkAst -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _route: NodeInfo[]): void {
    const footer = node.value as BreakscapedString;

    this.bitJson.footer = this.convertBreakscapedStringToJsonText(footer, TextFormat.bitmarkMinusMinus);
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
          const rJson = this.parseResourceToJson(bitType, r as Resource);
          if (rJson) excessResources.push(rJson);
        }
      }

      // Extract internal comments from the AST and add to the parser
      const internalComments = Breakscape.unbreakscape(this.getInternalComments(route));

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
    const propertiesConfig = Config.getRawPropertiesConfig();

    for (const propertyConfig of Object.values(propertiesConfig)) {
      const astKey = propertyConfig.astKey ?? propertyConfig.tag;

      // Special cases (handled outside of the automatically generated handlers)
      if (astKey === PropertyTag.internalComment) continue;
      if (astKey === PropertyTag.caption) continue;
      if (astKey === PropertyTag.example) continue;
      if (astKey === PropertyTag.imageSource) continue;
      if (astKey === PropertyTag.person) continue;
      if (astKey === PropertyTag.width) continue;
      if (astKey === PropertyTag.height) continue;
      if (astKey === PropertyAstKey.ast_markConfig) continue;
      if (astKey === PropertyTag.ratingLevelStart) continue;
      if (astKey === PropertyTag.ratingLevelEnd) continue;
      if (astKey === PropertyTag.productId) continue;

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

  protected createGapJson(gap: Gap): GapJson {
    const data = gap.data;

    const defaultExample = data.solutions && data.solutions.length > 0 ? data.solutions[0] : '';

    // Create the gap
    const gapJson: Partial<GapJson> = {
      type: 'gap',
      ...this.toItemLeadHintInstruction(data),
      isCaseSensitive: data.isCaseSensitive ?? true,
      ...this.toExample(data, {
        defaultExample,
        isBoolean: false,
      }),
      solutions: Breakscape.unbreakscape(data.solutions),
    };

    // Remove unwanted properties
    // if (!data.itemLead?.lead) delete gapJson.lead;
    // if (!data.itemLead?.pageNumber) delete gapJson.pageNumber;
    // if (!data.itemLead?.marginNumber) delete gapJson.marginNumber;

    return gapJson as GapJson;
  }

  protected createMarkJson(mark: Mark): MarkJson {
    const data = mark.data;

    // Create the mark
    const markJson: Partial<MarkJson> = {
      type: 'mark',
      solution: Breakscape.unbreakscape(data.solution),
      mark: Breakscape.unbreakscape(data.mark),
      ...this.toItemLeadHintInstruction(data),
      ...this.toExample(data, {
        defaultExample: true,
        isBoolean: true,
      }),
      //
    };

    // Remove unwanted properties
    // if (!data.itemLead?.lead) delete markJson.lead;
    // if (!data.itemLead?.pageNumber) delete markJson.pageNumber;
    // if (!data.itemLead?.marginNumber) delete markJson.marginNumber;

    return markJson as MarkJson;
  }

  protected createSelectJson(select: Select): SelectJson {
    const data = select.data;

    // Create the select options
    const options: SelectOptionJson[] = [];
    for (const option of data.options) {
      const optionJson: Partial<SelectOptionJson> = {
        text: Breakscape.unbreakscape(option.text),
        isCorrect: option.isCorrect ?? false,
        ...this.toItemLeadHintInstruction(option),
        ...this.toExample(option, {
          defaultExample: !!option.isCorrect,
          isBoolean: true,
        }),
      };

      // Remove unwanted properties
      // if (!option.itemLead?.item) delete optionJson.item;
      // if (!option.itemLead?.lead) delete optionJson.lead;
      // if (!option.itemLead?.pageNumber) delete optionJson.pageNumber;
      // if (!option.itemLead?.marginNumber) delete optionJson.marginNumber;
      // if (!option.instruction) delete optionJson.instruction;

      options.push(optionJson as SelectOptionJson);
    }

    // Create the select
    const selectJson: Partial<SelectJson> = {
      type: 'select',
      prefix: Breakscape.unbreakscape(data.prefix) ?? '',
      postfix: Breakscape.unbreakscape(data.postfix) ?? '',
      ...this.toItemLeadHintInstruction(data),
      isExample: data.isExample ?? false,
      options,
    };

    // Remove unwanted properties
    // if (!data.itemLead?.lead) delete selectJson.lead;
    // if (!data.itemLead?.pageNumber) delete selectJson.pageNumber;
    // if (!data.itemLead?.marginNumber) delete selectJson.marginNumber;

    return selectJson as SelectJson;
  }

  protected createHighlightJson(highlight: Highlight): HighlightJson {
    const data = highlight.data;

    // Create the highlight options
    const texts: HighlightTextJson[] = [];
    for (const text of data.texts) {
      const textJson: Partial<HighlightTextJson> = {
        text: Breakscape.unbreakscape(text.text),
        isCorrect: text.isCorrect ?? false,
        isHighlighted: text.isHighlighted ?? false,
        ...this.toItemLeadHintInstruction(text),
        ...this.toExample(text, {
          defaultExample: !!text.isCorrect,
          isBoolean: true,
        }),
      };

      // Remove unwanted properties
      // if (!text.itemLead?.item) delete textJson.item;
      // if (!text.itemLead?.lead) delete textJson.lead;
      // if (!text.itemLead?.pageNumber) delete textJson.pageNumber;
      // if (!text.itemLead?.marginNumber) delete textJson.marginNumber;
      // if (!text.hint) delete textJson.hint;

      texts.push(textJson as HighlightTextJson);
    }

    // Create the select
    const highlightJson: Partial<HighlightJson> = {
      type: 'highlight',
      prefix: Breakscape.unbreakscape(data.prefix) ?? '',
      postfix: Breakscape.unbreakscape(data.postfix) ?? '',
      ...this.toItemLeadHintInstruction(data),
      isExample: data.isExample ?? false,
      texts,
    };

    // Remove unwanted properties
    // if (!data.itemLead?.lead) delete highlightJson.lead;

    return highlightJson as HighlightJson;
  }

  protected parseResourceToJson(bitType: BitTypeType, resource: Resource | undefined): ResourceJson | undefined {
    if (!resource) return undefined;

    // All resources should now be valid as they are validated in the AST
    // TODO: remove code below

    // // Check if a resource has a value, if not, we should not write it (or any of its chained properties)
    // let valid = false;
    // if (resource.value) {
    //   valid = true;
    // }

    // // Resource is not valid, return undefined
    // if (!valid) return undefined;

    // // Resource is valid, write it.

    let resourceJson: ResourceJson | undefined;

    switch (resource.type) {
      case ResourceTag.image:
        resourceJson = {
          type: ResourceTag.image,
          image: this.addImageResource(bitType, resource as ImageResource),
        };
        break;

      case ResourceTag.imageLink:
        resourceJson = {
          type: ResourceTag.imageLink,
          imageLink: this.addImageLinkResource(bitType, resource as ImageLinkResource),
        };
        break;

      case ResourceTag.audio:
        resourceJson = {
          type: ResourceTag.audio,
          audio: this.addAudioResource(bitType, resource as AudioResource),
        };
        break;

      case ResourceTag.audioEmbed:
        resourceJson = {
          type: ResourceTag.audioEmbed,
          audioEmbed: this.addAudioEmbedResource(bitType, resource as AudioEmbedResource),
        };
        break;

      case ResourceTag.audioLink:
        resourceJson = {
          type: ResourceTag.audioLink,
          audioLink: this.addAudioLinkResource(bitType, resource as AudioLinkResource),
        };
        break;

      case ResourceTag.video:
        resourceJson = {
          type: ResourceTag.video,
          video: this.addVideoResource(bitType, resource as VideoResource),
        };
        break;

      case ResourceTag.videoEmbed:
        resourceJson = {
          type: ResourceTag.videoEmbed,
          videoEmbed: this.addVideoEmbedResource(bitType, resource as VideoEmbedResource),
        };
        (resourceJson as VideoEmbedResourceWrapperJson).videoEmbed = this.addVideoLinkResource(
          bitType,
          resource as VideoLinkResource,
        );
        break;

      case ResourceTag.videoLink:
        resourceJson = {
          type: ResourceTag.videoLink,
          videoLink: this.addVideoLinkResource(bitType, resource as VideoLinkResource),
        };
        break;

      case ResourceTag.stillImageFilmEmbed:
        resourceJson = {
          type: ResourceTag.stillImageFilmEmbed,
          stillImageFilmEmbed: this.addStillImageFilmEmbedResource(bitType, resource as StillImageFilmEmbedResource),
        };
        break;

      case ResourceTag.stillImageFilmLink:
        resourceJson = {
          type: ResourceTag.stillImageFilmLink,
          stillImageFilmLink: this.addStillImageFilmLinkResource(bitType, resource as StillImageFilmLinkResource),
        };
        break;

      case ResourceTag.article:
        resourceJson = {
          type: ResourceTag.article,
          article: this.addArticleResource(bitType, resource as ArticleResource),
        };
        break;

      case ResourceTag.document:
        resourceJson = {
          type: ResourceTag.document,
          document: this.addDocumentResource(bitType, resource as DocumentResource),
        };
        break;

      case ResourceTag.documentEmbed:
        resourceJson = {
          type: ResourceTag.documentEmbed,
          documentEmbed: this.addDocumentEmbedResource(bitType, resource as DocumentEmbedResource),
        };
        break;

      case ResourceTag.documentLink:
        resourceJson = {
          type: ResourceTag.documentLink,
          documentLink: this.addDocumentLinkResource(bitType, resource as DocumentLinkResource),
        };
        break;

      case ResourceTag.documentDownload:
        resourceJson = {
          type: ResourceTag.documentDownload,
          documentDownload: this.addDocumentDownloadResource(bitType, resource as DocumentDownloadResource),
        };
        break;

      case ResourceTag.appLink:
        resourceJson = {
          type: ResourceTag.appLink,
          appLink: this.addAppLinkResource(bitType, resource as AppLinkResource),
        };
        break;

      case ResourceTag.websiteLink:
        resourceJson = {
          type: ResourceTag.websiteLink,
          websiteLink: this.addWebsiteLinkResource(bitType, resource as WebsiteLinkResource),
        };
        break;

      default:
    }

    return resourceJson;
  }

  protected addImageResource(bitType: BitTypeType, resource: ImageResource | BreakscapedString): ImageResourceJson {
    const resourceJson: Partial<ImageResourceJson> = {};

    if (StringUtils.isString(resource)) {
      const value = resource as BreakscapedString;
      resource = {
        type: ResourceTag.image,
        typeAlias: ResourceTag.image,
        value: value,
        format: UrlUtils.fileExtensionFromUrl(value) as BreakscapedString,
        provider: UrlUtils.domainFromUrl(value) as BreakscapedString,
      };
    }

    resource = resource as ImageResource; // Keep TS compiler happy

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.src = Breakscape.unbreakscape(resource.value);
    if (resource.src1x != null) resourceJson.src1x = Breakscape.unbreakscape(resource.src1x);
    if (resource.src2x != null) resourceJson.src2x = Breakscape.unbreakscape(resource.src2x);
    if (resource.src3x != null) resourceJson.src3x = Breakscape.unbreakscape(resource.src3x);
    if (resource.src4x != null) resourceJson.src4x = Breakscape.unbreakscape(resource.src4x);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;
    resourceJson.alt = Breakscape.unbreakscape(resource.alt) ?? '';
    resourceJson.zoomDisabled = this.getZoomDisabled(bitType, resource.zoomDisabled);

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as ImageResourceJson;
  }

  protected addImageLinkResource(
    bitType: BitTypeType,
    resource: ImageLinkResource | BreakscapedString,
  ): ImageLinkResourceJson {
    const resourceJson: Partial<ImageLinkResourceJson> = {};

    if (StringUtils.isString(resource)) {
      const value = resource as BreakscapedString;
      resource = {
        type: ResourceTag.imageLink,
        typeAlias: ResourceTag.imageLink,
        value,
        format: UrlUtils.fileExtensionFromUrl(value) as BreakscapedString,
        provider: UrlUtils.domainFromUrl(value) as BreakscapedString,
      };
    }

    resource = resource as ImageLinkResource; // Keep TS compiler happy

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    if (resource.src1x != null) resourceJson.src1x = Breakscape.unbreakscape(resource.src1x);
    if (resource.src2x != null) resourceJson.src2x = Breakscape.unbreakscape(resource.src2x);
    if (resource.src3x != null) resourceJson.src3x = Breakscape.unbreakscape(resource.src3x);
    if (resource.src4x != null) resourceJson.src4x = Breakscape.unbreakscape(resource.src4x);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;
    resourceJson.alt = Breakscape.unbreakscape(resource.alt) ?? '';
    resourceJson.zoomDisabled = this.getZoomDisabled(bitType, resource.zoomDisabled);

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as ImageLinkResourceJson;
  }

  protected addAudioResource(bitType: BitTypeType, resource: AudioResource): AudioResourceJson {
    const resourceJson: Partial<AudioResourceJson | AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.src = Breakscape.unbreakscape(resource.value);

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as AudioResourceJson;
  }

  protected addAudioEmbedResource(bitType: BitTypeType, resource: AudioEmbedResource): AudioEmbedResourceJson {
    const resourceJson: Partial<AudioEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.src = Breakscape.unbreakscape(resource.value);

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as AudioEmbedResourceJson;
  }

  protected addAudioLinkResource(bitType: BitTypeType, resource: AudioLinkResource): AudioLinkResourceJson {
    const resourceJson: Partial<AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson, true);

    return resourceJson as AudioLinkResourceJson;
  }

  protected addVideoResource(bitType: BitTypeType, resource: VideoResource): VideoResourceJson {
    const resourceJson: Partial<VideoResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.src = Breakscape.unbreakscape(resource.value);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = Breakscape.unbreakscape(resource.alt);

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(bitType, resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(bitType, thumbnail));
      }
    }

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoResourceJson;
  }

  protected addVideoEmbedResource(bitType: BitTypeType, resource: VideoEmbedResource): VideoEmbedResourceJson {
    const resourceJson: Partial<VideoEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.src = Breakscape.unbreakscape(resource.value);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = Breakscape.unbreakscape(resource.alt);

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(bitType, resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(bitType, thumbnail));
      }
    }

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoEmbedResourceJson;
  }

  protected addVideoLinkResource(bitType: BitTypeType, resource: VideoLinkResource): VideoLinkResourceJson {
    const resourceJson: Partial<VideoLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = Breakscape.unbreakscape(resource.alt);

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(bitType, resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(bitType, thumbnail));
      }
    }

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoLinkResourceJson;
  }

  protected addStillImageFilmEmbedResource(
    bitType: BitTypeType,
    resource: StillImageFilmEmbedResource,
  ): StillImageFilmEmbedResourceJson {
    const resourceJson: Partial<StillImageFilmEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = Breakscape.unbreakscape(resource.alt);

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(bitType, resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(bitType, thumbnail));
      }
    }

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as StillImageFilmEmbedResourceJson;
  }

  protected addStillImageFilmLinkResource(
    bitType: BitTypeType,
    resource: StillImageFilmLinkResource,
  ): StillImageFilmLinkResourceJson {
    const resourceJson: Partial<StillImageFilmLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = Breakscape.unbreakscape(resource.alt);

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(bitType, resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(bitType, thumbnail));
      }
    }

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as StillImageFilmLinkResourceJson;
  }

  protected addArticleResource(bitType: BitTypeType, resource: ArticleResource): ArticleResourceJson {
    const resourceJson: Partial<ArticleResourceJson | DocumentResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.body = Breakscape.unbreakscape(resource.value);
    // if (resource.href != null) resourceJson.href = BreakscapeUtils.unbreakscape(resource.href); // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected addDocumentResource(bitType: BitTypeType, resource: DocumentResource): DocumentResourceJson {
    const resourceJson: Partial<DocumentResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    // if (resource.href != null) resourceJson.href = BreakscapeUtils.unbreakscape(resource.href); // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentResourceJson;
  }

  protected addDocumentEmbedResource(bitType: BitTypeType, resource: DocumentEmbedResource): DocumentEmbedResourceJson {
    const resourceJson: Partial<DocumentEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    // if (resource.href != null) resourceJson.href = BreakscapeUtils.unbreakscape(resource.href); // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentEmbedResourceJson;
  }

  protected addDocumentLinkResource(bitType: BitTypeType, resource: DocumentLinkResource): DocumentLinkResourceJson {
    const resourceJson: Partial<DocumentLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    // if (resource.href != null) resourceJson.href = BreakscapeUtils.unbreakscape(resource.href); // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentLinkResourceJson;
  }

  protected addDocumentDownloadResource(
    bitType: BitTypeType,
    resource: DocumentDownloadResource,
  ): DocumentDownloadResourceJson {
    const resourceJson: Partial<DocumentDownloadResourceJson> = {};

    if (resource.format != null) resourceJson.format = Breakscape.unbreakscape(resource.format);
    if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentDownloadResourceJson;
  }

  protected addAppLinkResource(bitType: BitTypeType, resource: AppLinkResource): AppLinkResourceJson {
    const resourceJson: Partial<AppLinkResourceJson> = {};

    // if (resource.format != null) resourceJson.format = BreakscapeUtils.unbreakscape(resource.format);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as AppLinkResourceJson;
  }

  protected addWebsiteLinkResource(bitType: BitTypeType, resource: WebsiteLinkResource): WebsiteLinkResourceJson {
    const resourceJson: Partial<WebsiteLinkResourceJson> = {};

    // if (resource.format != null) resourceJson.format = BreakscapeUtils.unbreakscape(resource.format);
    if (resource.value != null) resourceJson.url = Breakscape.unbreakscape(resource.value);
    if (resource.siteName != null) resourceJson.siteName = Breakscape.unbreakscape(resource.siteName);

    this.addGenericResourceProperties(bitType, resource, resourceJson as BaseResourceJson);

    return resourceJson as WebsiteLinkResourceJson;
  }

  protected addGenericResourceProperties(
    _bitType: BitTypeType,
    resource: Resource,
    resourceJson: BaseResourceJson,
    noDefaults?: boolean,
  ) {
    if (noDefaults) {
      if (resource.license != null) resourceJson.license = Breakscape.unbreakscape(resource.license) ?? '';
      if (resource.copyright != null) resourceJson.copyright = Breakscape.unbreakscape(resource.copyright) ?? '';
      if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
      if (resource.showInIndex != null) resourceJson.showInIndex = resource.showInIndex ?? false;
      if (resource.caption != null)
        resourceJson.caption = this.convertBreakscapedStringToJsonText(
          resource.caption ?? '',
          TextFormat.bitmarkMinusMinus,
        );
    } else {
      resourceJson.license = Breakscape.unbreakscape(resource.license) ?? '';
      resourceJson.copyright = Breakscape.unbreakscape(resource.copyright) ?? '';
      if (resource.provider != null) resourceJson.provider = Breakscape.unbreakscape(resource.provider);
      resourceJson.showInIndex = resource.showInIndex ?? false;
      resourceJson.caption = this.convertBreakscapedStringToJsonText(
        resource.caption ?? Breakscape.EMPTY_STRING,
        TextFormat.bitmarkMinusMinus,
      );
    }

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected toItemLeadHintInstruction(item: ItemLeadHintInstructionNode): ItemLeadHintInstuction {
    return {
      item: this.convertBreakscapedStringToJsonText(
        item.itemLead?.item ?? Breakscape.EMPTY_STRING,
        TextFormat.bitmarkMinusMinus,
      ),
      lead: this.convertBreakscapedStringToJsonText(
        item.itemLead?.lead ?? Breakscape.EMPTY_STRING,
        TextFormat.bitmarkMinusMinus,
      ),
      pageNumber: this.convertBreakscapedStringToJsonText(
        item.itemLead?.pageNumber ?? Breakscape.EMPTY_STRING,
        TextFormat.bitmarkMinusMinus,
      ),
      marginNumber: this.convertBreakscapedStringToJsonText(
        item.itemLead?.marginNumber ?? Breakscape.EMPTY_STRING,
        TextFormat.bitmarkMinusMinus,
      ),
      hint: this.convertBreakscapedStringToJsonText(item.hint ?? Breakscape.EMPTY_STRING, TextFormat.bitmarkMinusMinus),
      instruction: this.convertBreakscapedStringToJsonText(
        item.instruction ?? Breakscape.EMPTY_STRING,
        TextFormat.bitmarkMinusMinus,
      ),
    };
  }

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
        // Unbreakscape values that are strings
        values = Breakscape.unbreakscape(values);

        if (Array.isArray(values) && singleWithoutArray && values.length >= 1) {
          finalValue = values[values.length - 1];
        } else {
          finalValue = values;
        }
      }

      // if (finalValue != null) {
      target[name] = finalValue;
      // }
    }
  }

  //
  // Helper functions
  //

  /**
   * Get the value for the zoomDisabled property, setting the appropriate default value if no value is set.
   *
   * @param bitType
   * @param zoomDisabled
   * @returns
   */
  protected getZoomDisabled(bitType: BitTypeType, zoomDisabled: boolean | undefined): boolean {
    if (zoomDisabled != null) return zoomDisabled;

    // The default value in the JSON is hardcoded, because there is currently no good way to set a different
    // default per bit in the BitConfig.
    if (
      Config.isOfBitType(bitType, [
        BitType.imageSeparator,
        BitType.pageBanner,
        BitType.imagesLogoGrave,
        BitType.prototypeImages,
      ])
    ) {
      return true;
    }

    return false;
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

    const asPlainText = this.options.textAsPlainText || format === TextFormat.text || format === TextFormat.json;

    if (asPlainText) {
      return Breakscape.unbreakscape(text) || Breakscape.EMPTY_STRING;
    }

    // Use the text parser to parse the text
    const textAst = this.textParser.toAst(text, {
      textFormat: format,
    });

    return textAst;
  }

  /**
   * Walk the body AST to find the placeholder and replace it with the body bit.
   *
   * @param bodyAst the body AST
   * @param bodyBitJson the body bit json to insert at the placeholder position
   * @param index the index of the placeholder to replace
   */
  protected replacePlaceholderWithBodyBit(bodyAst: TextAst, bodyBitJson: BodyBitJson, index: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walkRecursive = (node: any, parent: any, parentKey: any): boolean => {
      if (Array.isArray(node)) {
        // Walk the array of nodes
        for (let i = 0; i < node.length; i++) {
          const child = node[i];
          const done = walkRecursive(child, node, i);
          if (done) return true;
        }
      } else {
        if (node.type === 'bit' && node.index === index) {
          // Found the placeholder, replace it with the body bit
          parent[parentKey] = bodyBitJson;
          return true;
        }
        if (node.content) {
          // Walk the child content
          const done = walkRecursive(node.content, node, 'content');
          if (done) return true;
        }
      }
      return false;
    };

    walkRecursive(bodyAst, null, null);
  }

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
      AIGenerated: undefined,
      analyticsTag: undefined,
      feedbackEngine: undefined,
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
      location: undefined,
      kind: undefined,
      hasMarkAsDone: undefined,
      processHandIn: undefined,
      action: undefined,
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
      thumbImage: undefined,
      scormSource: undefined,
      posterImage: undefined,
      focusX: undefined,
      focusY: undefined,
      pointerLeft: undefined,
      pointerTop: undefined,
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
      resource: undefined,
      logos: undefined,
      images: undefined,

      // Children
      statement: undefined,
      isCorrect: undefined,
      sampleSolution: undefined,
      partialAnswer: undefined,
      elements: undefined,
      statements: undefined,
      responses: undefined,
      quizzes: undefined,
      heading: undefined,
      pairs: undefined,
      matrix: undefined,
      choices: undefined,
      questions: undefined,
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
      //
      delete bitJson.format;
      //
    } else if (Config.isOfBitType(bitType, [BitType.article, BitType.sampleSolution, BitType.page])) {
      //
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (
      Config.isOfBitType(bitType, [
        BitType.multipleChoice1,
        BitType.multipleResponse1,
        BitType.multipleChoiceText,
        BitType.highlightText,
        BitType.clozeAndMultipleChoiceText,
        BitType.sequence,
        BitType.mark,
        BitType.flashcard,
      ])
    ) {
      // Default, but with no 'example' at the bit level.
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.cloze)) {
      // Default, but with no 'example' at the bit level.
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      if (Config.isOfBitType(bitType, BitType.clozeSolutionGrouped)) {
        // Solution grouped
        if (bitJson.quizCountItems == null) bitJson.quizCountItems = true;
        if (bitJson.quizStrikethroughSolutions == null) bitJson.quizStrikethroughSolutions = true;
      } else if (Config.isOfBitType(bitType, BitType.clozeInstructionGrouped)) {
        // Instruction grouped
        if (bitJson.quizCountItems == null) bitJson.quizCountItems = true;
        if (bitJson.quizStrikethroughSolutions == null) bitJson.quizStrikethroughSolutions = false;
      }
      //
    } else if (Config.isOfBitType(bitType, [BitType.multipleChoice, BitType.multipleResponse])) {
      // Default with a card (and hence a footer possibility)
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      if (bitJson.footer == null) bitJson.footer = this.textDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.essay)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.example == null) bitJson.example = null;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      if (bitJson.partialAnswer == null) bitJson.partialAnswer = '';
      // if (bitJson.sampleSolution == null) bitJson.sampleSolution = '';
      //
    } else if (Config.isOfBitType(bitType, BitType.trueFalse1)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.lead == null) bitJson.lead = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.example == null) bitJson.example = null;
      if (bitJson.isCorrect == null) bitJson.isCorrect = false;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.trueFalse)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.lead == null) bitJson.lead = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.labelFalse == null) bitJson.labelFalse = '';
      if (bitJson.labelTrue == null) bitJson.labelTrue = '';
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.chapter)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.example == null) bitJson.example = null;
      if (bitJson.toc == null) bitJson.toc = true; // Always set on chapter bits?
      if (bitJson.progress == null) bitJson.progress = true; // Always set on chapter bits
      if (bitJson.level == null) bitJson.level = 1; // Set level 1 if none set (makes no sense, but in ANTLR parser)
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.interview)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      if (bitJson.footer == null) bitJson.footer = this.textDefault;
      if (bitJson.questions == null) bitJson.questions = [];
      //
    } else if (bitType === BitType.matchMatrix) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.match)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.heading == null) bitJson.heading = {} as HeadingJson;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.learningPathBook)) {
      //
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.example == null) bitJson.example = null;
      if (bitJson.isTracked == null) bitJson.isTracked = true;
      if (bitJson.isInfoOnly == null) bitJson.isInfoOnly = false;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (Config.isOfBitType(bitType, BitType.table)) {
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
      if (bitJson.body == null) bitJson.body = this.bodyDefault;
      //
    } else if (
      Config.isOfBitType(bitType, BitType.pageBanner) ||
      Config.isOfBitType(bitType, BitType.pageBuyButton) ||
      Config.isOfBitType(bitType, BitType.pageBuyButtonPromotion) ||
      Config.isOfBitType(bitType, BitType.pageFooter) ||
      Config.isOfBitType(bitType, BitType.pageOpenBook) ||
      Config.isOfBitType(bitType, BitType.pagePerson) ||
      Config.isOfBitType(bitType, BitType.pageProduct) ||
      Config.isOfBitType(bitType, BitType.pageProductList) ||
      Config.isOfBitType(bitType, BitType.pageProductVideo) ||
      Config.isOfBitType(bitType, BitType.pageProductVideoList) ||
      Config.isOfBitType(bitType, BitType.pageSectionFolder) ||
      Config.isOfBitType(bitType, BitType.pageSubscribe) ||
      Config.isOfBitType(bitType, BitType.pageSubpage)
    ) {
      //
      if (bitJson.slug == null) bitJson.slug = '';
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.example == null) bitJson.example = null;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;

      if (Config.isOfBitType(bitType, BitType.pageBuyButton)) {
        if (bitJson.content2Buy == null) bitJson.content2Buy = '';
      }
    } else {
      // Most bits have these defaults, but there are special cases (not sure if that is by error or design)
      if (bitJson.item == null) bitJson.item = this.textDefault;
      if (bitJson.hint == null) bitJson.hint = this.textDefault;
      if (bitJson.isExample == null) bitJson.isExample = false;
      if (bitJson.example == null) bitJson.example = null;
      if (bitJson.body == null) bitJson.body = this.bodyDefault;

      // Special case for 'book' bits
      if (Config.isOfBitType(bitType, BitType.book)) {
        if (bitJson.hasMarkAsDone == null) bitJson.hasMarkAsDone = false;
        if (bitJson.processHandIn == null) bitJson.processHandIn = false;
        if (bitJson.isPublic == null) bitJson.isPublic = false;
      }

      // Special case for 'ai' bits
      if (bitType === BitType.articleAi || bitType === BitType.noteAi || bitType === BitType.summaryAi) {
        if (bitJson.AIGenerated == null) bitJson.AIGenerated = true;
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
    if (bitJson.AIGenerated == null) delete bitJson.AIGenerated;
    if (bitJson.analyticsTag == null) delete bitJson.analyticsTag;
    if (bitJson.feedbackEngine == null) delete bitJson.feedbackEngine;
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
    if (bitJson.location == null) delete bitJson.location;
    if (bitJson.kind == null) delete bitJson.kind;
    if (bitJson.hasMarkAsDone == null) delete bitJson.hasMarkAsDone;
    if (bitJson.processHandIn == null) delete bitJson.processHandIn;
    if (bitJson.action == null) delete bitJson.action;
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
    if (bitJson.thumbImage == null) delete bitJson.thumbImage;
    if (bitJson.scormSource == null) delete bitJson.scormSource;
    if (bitJson.posterImage == null) delete bitJson.posterImage;
    if (bitJson.focusX == null) delete bitJson.focusX;
    if (bitJson.focusY == null) delete bitJson.focusY;
    if (bitJson.pointerLeft == null) delete bitJson.pointerLeft;
    if (bitJson.pointerTop == null) delete bitJson.pointerTop;
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
    if (bitJson.resource == null) delete bitJson.resource;
    if (bitJson.logos == null) delete bitJson.logos;
    if (bitJson.images == null) delete bitJson.images;

    // Children
    if (bitJson.statement == null) delete bitJson.statement;
    if (bitJson.isCorrect == null) delete bitJson.isCorrect;
    if (bitJson.sampleSolution == null) delete bitJson.sampleSolution;
    if (bitJson.partialAnswer == null) delete bitJson.partialAnswer;
    if (bitJson.elements == null) delete bitJson.elements;
    if (bitJson.statements == null) delete bitJson.statements;
    if (bitJson.responses == null) delete bitJson.responses;
    if (bitJson.quizzes == null) delete bitJson.quizzes;
    if (bitJson.heading == null) delete bitJson.heading;
    if (bitJson.pairs == null) delete bitJson.pairs;
    if (bitJson.matrix == null) delete bitJson.matrix;
    if (bitJson.table == null) delete bitJson.table;
    if (bitJson.choices == null) delete bitJson.choices;
    if (bitJson.questions == null) delete bitJson.questions;
    if (bitJson.listItems == null) delete bitJson.listItems;
    if (bitJson.sections == null) delete bitJson.sections;

    // Placeholders
    if (!plainText || bitJson.placeholders == null) delete bitJson.placeholders;

    // Footer
    if (bitJson.footer == null) delete bitJson.footer;

    return bitJson;
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
