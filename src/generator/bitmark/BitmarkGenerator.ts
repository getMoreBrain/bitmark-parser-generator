import { Ast, type NodeInfo } from '../../ast/Ast.ts';
import { StringWriter } from '../../ast/writer/StringWriter.ts';
import { type Writer } from '../../ast/writer/Writer.ts';
import { Breakscape } from '../../breakscaping/Breakscape.ts';
import { Config } from '../../config/Config.ts';
import { type BreakscapedString } from '../../model/ast/BreakscapedString.ts';
import {
  type Bit,
  type BitmarkAst,
  type Body,
  type BodyPart,
  type Footer,
} from '../../model/ast/Nodes.ts';
import { NodeType } from '../../model/ast/NodeType.ts';
import { type JsonText, type TextAst } from '../../model/ast/TextNodes.ts';
import {
  configKeyToPropertyType,
  configKeyToResourceType,
} from '../../model/config/enum/ConfigKey.ts';
import type { PropertyTagConfig } from '../../model/config/PropertyTagConfig.ts';
import {
  BitmarkVersion,
  type BitmarkVersionType,
  DEFAULT_BITMARK_VERSION,
} from '../../model/enum/BitmarkVersion.ts';
import { BitType, type BitTypeType } from '../../model/enum/BitType.ts';
import { BodyBitType } from '../../model/enum/BodyBitType.ts';
import { CardSetVersion, type CardSetVersionType } from '../../model/enum/CardSetVersion.ts';
import { PropertyKey } from '../../model/enum/PropertyKey.ts';
import { ResourceType, type ResourceTypeType } from '../../model/enum/ResourceType.ts';
import { TagFormat, type TagFormatType } from '../../model/enum/TagFormat.ts';
import { TextFormat, type TextFormatType } from '../../model/enum/TextFormat.ts';
import { TextLocation, type TextLocationType } from '../../model/enum/TextLocation.ts';
import {
  type BookJson,
  type ChoiceJson,
  type FeedbackChoiceJson,
  type GroupTagJson,
  type ImageSourceJson,
  type IngredientJson,
  type MarkConfigJson,
  type PersonJson,
  type PronunciationTableCellJson,
  type RatingLevelStartEndJson,
  type ResponseJson,
  type ServingsJson,
  type StatementJson,
  type TechnicalTermJson,
} from '../../model/json/BitJson.ts';
import {
  type BodyBitJson,
  type GapJson,
  type HighlightTextJson,
  type MarkJson,
  type SelectOptionJson,
} from '../../model/json/BodyBitJson.ts';
import {
  type AudioResourceWrapperJson,
  type ImageResourceJson,
  type ImageResourceWrapperJson,
  type ResourceDataJson,
  type ResourceJson,
} from '../../model/json/ResourceJson.ts';
import { BooleanUtils } from '../../utils/BooleanUtils.ts';
import { ObjectUtils } from '../../utils/ObjectUtils.ts';
import { StringUtils } from '../../utils/StringUtils.ts';
import { AstWalkerGenerator } from '../AstWalkerGenerator.ts';
import { type GenerateOptions, TextGenerator } from '../text/TextGenerator.ts';

const DEFAULT_OPTIONS: BitmarkOptions = {
  debugGenerationInline: false,
};

const DEFAULT_SPACES_AROUND_VALUES = 1;
const MAX_SPACES_AROUND_VALUES = 10;

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
   * The number of spaces to insert around values in the bitmark.
   * If set to true, will use the default of 1 space.
   * If set to false, will not insert any spaces.
   * If set to a number, will insert that many spaces, up to a limit of 10.
   *
   * default: true
   */
  spacesAroundValues?: number | boolean;

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
 *
 * NOTE: Newlines - a newline is written BEFORE each content that requries a newline
 *
 */
class BitmarkGenerator extends AstWalkerGenerator<BitmarkAst, void> {
  protected ast = new Ast();
  protected textGenerator: TextGenerator;
  private bitmarkVersion: BitmarkVersionType;
  private options: BitmarkOptions;
  private mainWriter: Writer; // Used for writing the bitmark
  private partWriter: StringWriter; // Used for writing parts which need to be assembled before writing to the main writer
  private writer: Writer; // The current writer being used
  private prettifySpace: number | undefined;
  private spacesAroundValues: number;
  private spacesAroundValuesStr: string;

  // State
  private bitType: BitTypeType = BitType._error;
  private textFormat: TextFormatType = TextFormat.bitmarkText;
  private isBodyBitmarkText = false;
  private isCardAllowed = false;
  private firstBit = true;
  private hasCardSet = false;
  private hasFooter = false;
  private inTag = true;

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

    // // Keep TS happy
    // this.inTag;

    // Bind callbacks
    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);
    this.write = this.write.bind(this);
    this.bodyBitCallback = this.bodyBitCallback.bind(this);

    // Set options
    this.bitmarkVersion =
      BitmarkVersion.fromValue(options?.bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
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
    this.prettifySpace =
      this.options.prettifyJson === true ? 2 : this.options.prettifyJson || undefined;

    // Calculate the spaces around values
    this.spacesAroundValues = this.calcSpacesAroundValues();
    this.spacesAroundValuesStr = ' '.repeat(this.spacesAroundValues);

    // Create the text generator
    this.textGenerator = new TextGenerator(this.bitmarkVersion, {
      writeCallback: this.write,
      bodyBitCallback: this.bodyBitCallback,
      debugGenerationInline: this.debugGenerationInline,
    });

    this.mainWriter = writer;
    this.partWriter = new StringWriter();
    this.writer = this.mainWriter;

    this.generateResourceHandlers();
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
    this.bitType = BitType._error;
    this.textFormat = TextFormat.bitmarkText;
    this.isBodyBitmarkText = false;
    this.isCardAllowed = false;
    this.firstBit = true;
    this.hasCardSet = false;
    this.hasFooter = false;
    this.inTag = true;
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

  // bitmarkAst -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const bit = node.value as Bit;

    const bitConfig = Config.getBitConfig(bit.bitType);
    const bitResourcesConfig = Config.getBitResourcesConfig(bit.bitType, bit.resourceType);

    // Set state variables
    this.bitType = bit.bitType;
    this.textFormat = bit.textFormat ?? bitConfig.textFormatDefault;
    this.isBodyBitmarkText = this.textFormat === TextFormat.bitmarkText;
    this.isCardAllowed = this.calculateIsCardAllowed();

    this.hasCardSet = this.haveValidCardSet(bit);
    this.hasFooter = this.haveValidFooter(bit);

    // Separate the bits with 3 newlines
    if (!this.firstBit) {
      this.writeNL();
      this.writeNL();
      this.writeNL();
    }

    // Write the bit tag opening
    this.writeOPD(bit.bitLevel);

    if (bit.isCommented) this.writeString('|');
    this.writeTagKey(bit.bitType);

    if (bit.textFormat) {
      const write = this.isWriteTextFormat(bit.textFormat, bitConfig.textFormatDefault);

      if (write) {
        this.writeColon();
        this.writeTagKey(bit.textFormat);
      }
    }

    // Use the bitConfig to see if we need to write the resourceType attachment
    let resourceType: ResourceTypeType | undefined;
    if (bitConfig.resourceAttachmentAllowed && bit.resources && bit.resources.length > 0) {
      const comboMap = bitResourcesConfig.comboResourceConfigKeysMap;

      if (bitResourcesConfig.comboResourceConfigKeysMap.size > 0) {
        // The resource is a combo resource
        // Extract the resource types from the combo resource
        // NOTE: There should only ever be one combo resource per bit, but the code can handle multiple
        // except for overwriting resourceJson
        for (const comboTagType of comboMap.keys()) {
          resourceType = configKeyToResourceType(comboTagType);
        }
      } else {
        // Get the resourceType from the first resource and write it as the attachment resourceType
        resourceType = bit.resources[0].type;
      }
    }

    if (resourceType) {
      this.writeAmpersand();
      this.writeTagKey(resourceType);
    }

    this.writeCL();
    // this.writeNL();

    // Continue traversal
    return true;
  }

  protected exit_bitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    this.firstBit = false;
  }

  // bitmarkAst -> bits -> bitsValue -> internalComment

  protected enter_internalComment(node: NodeInfo, route: NodeInfo[]): boolean {
    const internalComment = node.value as BreakscapedString[];

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    for (let i = 0; i < internalComment.length; i++) {
      const comment = internalComment[i];

      this.writeNL();
      this.writeProperty('internalComment', comment, route, {
        format: TagFormat.plainText,
        array: true,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> groupTag

  protected enter_groupTag(node: NodeInfo, route: NodeInfo[]): boolean {
    const groupTag = node.value as GroupTagJson[];

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    for (const gt of groupTag) {
      const { name, tags } = gt;

      this.writeNL();
      this.writeProperty('groupTag', name, route, {
        format: TagFormat.plainText,
        writeEmpty: true,
      });
      if (tags && tags.length > 0) {
        for (const t of tags) {
          this.writeProperty('tag', t, route, {
            format: TagFormat.plainText,
            writeEmpty: true,
          });
        }
      }
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> labelTrue / labelFalse

  protected enter_labelTrue(node: NodeInfo, route: NodeInfo[]): boolean {
    const value = node.value as string | undefined;

    // Ignore example that is not at the bit level as it are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const bit = parent?.value as Bit;
    if (bit) {
      const haveTrue = value != '';
      const haveFalse = bit.labelFalse && bit.labelFalse != '';
      if (haveTrue || haveFalse) {
        this.writeNL();
      }
      if (haveTrue)
        this.writeProperty('labelTrue', value, route, {
          format: TagFormat.plainText,
        });
      if (haveFalse)
        this.writeProperty('labelFalse', bit.labelFalse, route, {
          format: TagFormat.plainText,
        });
    }

    // Stop traversal of this branch
    return false;
  }

  protected enter_labelFalse(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Handled above in enter_labelTrue(), but this function needed to block automatic property handling
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> imageSource

  protected enter_imageSource(node: NodeInfo, route: NodeInfo[]): boolean {
    const imageSource = node.value as ImageSourceJson;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const { url, mockupId, size, format, trim } = imageSource;

    this.writeNL();
    this.writeProperty('imageSource', url, route, {
      format: TagFormat.plainText,
    });
    if (url) {
      if (mockupId)
        this.writeProperty('mockupId', mockupId, route, {
          format: TagFormat.plainText,
        });
      if (size)
        this.writeProperty('size', size, route, {
          format: TagFormat.plainText,
        });
      if (format)
        this.writeProperty('format', format, route, {
          format: TagFormat.plainText,
        });
      if (BooleanUtils.isBoolean(trim))
        this.writeProperty('trim', trim, route, {
          format: TagFormat.plainText,
        });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> technicalTerm

  protected enter_technicalTerm(node: NodeInfo, route: NodeInfo[]): boolean {
    const nodeValue = node.value as TechnicalTermJson;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const { technicalTerm, lang } = nodeValue;

    this.writeNL();
    this.writeProperty('technicalTerm', technicalTerm, route, {
      format: TagFormat.plainText,
    });
    if (lang != null) {
      this.writeProperty('lang', lang, route, {
        format: TagFormat.plainText,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> servings

  protected enter_servings(node: NodeInfo, route: NodeInfo[]): boolean {
    const nodeValue = node.value as ServingsJson;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const { servings, unit, unitAbbr, decimalPlaces, disableCalculation, hint } = nodeValue;

    this.writeNL();
    this.writeProperty('servings', servings, route, {
      format: TagFormat.plainText,
    });
    if (unit != null) {
      this.writeProperty('unit', unit, route, {
        format: TagFormat.plainText,
      });
    }
    if (unitAbbr != null) {
      this.writeProperty('unitAbbr', unitAbbr, route, {
        format: TagFormat.plainText,
      });
    }
    if (decimalPlaces != null) {
      this.writeProperty('decimalPlaces', decimalPlaces, route, {
        format: TagFormat.plainText,
      });
    }
    if (disableCalculation != null) {
      this.writeProperty('disableCalculation', disableCalculation, route, {
        format: TagFormat.plainText,
      });
    }
    if (hint != null) {
      this.writeOPQ();
      this.writeTextOrValue(hint, TextFormat.plainText, TextLocation.tag);
      this.writeCL();
    }

    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> person

  protected enter_person(node: NodeInfo, route: NodeInfo[]): boolean {
    const person = node.value as PersonJson;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const { name, title, avatarImage } = person;

    this.writeNL();
    this.writeProperty('person', name, route, {
      format: TagFormat.plainText,
    });
    if (title) {
      this.writeProperty('title', title, route, {
        format: TagFormat.plainText,
      });
    }
    if (avatarImage) {
      this.writeResource(ResourceType.image, avatarImage.image.src);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> term -> text
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> definition -> text
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> alternativeDefinitions
  // -> alternativeDefinitionsValue -> text
  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> question -> text
  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> answer -> text
  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> alternativeAnswers ->
  // -> alternativeAnswersValue -> text

  protected enter_text(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (
      !parent ||
      (parent.key !== NodeType.term &&
        parent.key !== NodeType.definition &&
        parent.key !== NodeType.alternativeDefinitionsValue &&
        parent.key !== NodeType.question &&
        parent.key !== NodeType.answer &&
        parent.key !== NodeType.alternativeAnswersValue)
    ) {
      return true;
    }

    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }

    // Stop traversal of this branch
    return false;
  }

  protected leaf_text(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (
      !parent ||
      (parent.key !== NodeType.term &&
        parent.key !== NodeType.definition &&
        parent.key !== NodeType.alternativeDefinitionsValue &&
        parent.key !== NodeType.question &&
        parent.key !== NodeType.answer &&
        parent.key !== NodeType.alternativeAnswersValue &&
        parent.key !== NodeType.reason)
    ) {
      return true;
    }

    if (StringUtils.isString(node.value)) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> * -> term -> icon
  // bitmarkAst -> bits -> bitsValue -> * -> definition -> icon
  // bitmarkAst -> bits -> bitsValue -> * -> alternativeDefinitionsValue -> icon
  protected enter_icon(node: NodeInfo, route: NodeInfo[]): boolean {
    const resource = node.value as ImageResourceWrapperJson;

    const parent = this.getParentNode(route);
    if (!parent) return true;

    if (
      parent.key !== NodeType.term &&
      parent.key !== NodeType.definition &&
      parent.key !== NodeType.alternativeDefinitionsValue &&
      parent.key !== NodeType.question &&
      parent.key !== NodeType.answer &&
      parent.key !== NodeType.alternativeAnswersValue
    ) {
      // Continue traversal of this branch
      return true;
    }

    // This is a resource, so handle it with the common code
    this.writeNL();
    this.writeResource(ResourceType.icon, resource.image.src);
    // this.writePropertyStyleResource(ResourceType.icon, resource as ResourceJson);

    // Continue traversal of this branch (for the chained properties)
    return true;
  }

  protected leaf_iconValue(node: NodeInfo, route: NodeInfo[]): boolean {
    // Handle as a standard icon property
    this.writeNL();
    this.writeProperty('icon', node.value, route, {
      format: TagFormat.plainText,
    });

    // Stop traversal of this branch
    return false;
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
  protected enterRatingLevelStartEndCommon(node: NodeInfo, route: NodeInfo[]): boolean {
    const n = node.value as RatingLevelStartEndJson;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const { level, label } = n;
    const levelKey = node.key === NodeType.ratingLevelStart ? 'ratingLevelStart' : 'ratingLevelEnd';

    this.writeNL();
    this.writeProperty(levelKey, level, route, {
      format: TagFormat.plainText,
    });
    if (label) {
      this.writeProperty('label', label, route, {
        format: TagFormat.bitmarkText,
      });
    }

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
    const markConfig = node.value as MarkConfigJson;

    // Ignore values that are not at the correct level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.markConfig) return true;

    const { mark, color, emphasis } = markConfig;

    if (mark) {
      this.writeNL();
      this.writeProperty('mark', mark, route, {
        format: TagFormat.plainText,
      });
      if (color) {
        this.writeProperty('color', color, route, {
          format: TagFormat.plainText,
        });
      }
      if (emphasis) {
        this.writeProperty('emphasis', emphasis, route, {
          format: TagFormat.plainText,
        });
      }
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> partialAnswer

  protected enter_partialAnswer(node: NodeInfo, route: NodeInfo[]): boolean {
    if (node.value) {
      this.writeNL();
      this.writeProperty('partialAnswer', node.value, route, {
        format: TagFormat.plainText,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> partialAnswer

  protected leaf_partialAnswer(node: NodeInfo, route: NodeInfo[]): boolean {
    if (node.value) {
      this.writeNL();
      this.writeProperty('partialAnswer', node.value, route, {
        format: TagFormat.plainText,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> sampleSolution
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> sampleSolution

  protected enter_sampleSolution(node: NodeInfo, route: NodeInfo[]): boolean {
    if (node.value) {
      this.writeNL();
      this.writeProperty('sampleSolution', node.value, route, {
        format: TagFormat.plainText,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  protected leaf_sampleSolution(node: NodeInfo, route: NodeInfo[]): boolean {
    if (node.value) {
      this.writeNL();
      this.writeProperty('sampleSolution', node.value, route, {
        format: TagFormat.plainText,
      });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> reasonableNumOfChars
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> reasonableNumOfChars

  protected leaf_reasonableNumOfChars(node: NodeInfo, route: NodeInfo[]): void {
    this.writeNL();
    this.writeProperty('reasonableNumOfChars', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> additionalSolutions -> additionalSolutionsValue

  protected leaf_additionalSolutionsValue(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route, 2);
    if (parent?.key !== NodeType.questionsValue) return;

    this.writeNL();
    this.writeProperty('additionalSolutions', node.value, route, {
      format: TagFormat.plainText,
      array: true,
      writeEmpty: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> item

  protected enter_item(node: NodeInfo, route: NodeInfo[]): boolean {
    const item = node.value as TextAst;
    const parent = this.getParentNode(route);
    if (this.isEmptyText(item)) return false; // Ignore empty
    if (!this.isEmptyText(parent?.value?.lead)) return true; // Will be handled by lead
    if (!this.isEmptyText(parent?.value?.pageNumber)) return true; // Will be handled by pageNumber
    if (!this.isEmptyText(parent?.value?.marginNumber)) return true; // Will be handled by marginNumber

    this.writeNL_IfNotChain(route);
    this.writeOPC();
    this.writeTextOrValue(item, TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> lead

  protected enter_lead(node: NodeInfo, route: NodeInfo[]): boolean {
    const lead = node.value as TextAst;
    const parent = this.getParentNode(route);
    if (this.isEmptyText(lead)) return false; // Ignore empty
    if (!this.isEmptyText(parent?.value?.pageNumber)) return true; // Will be handled by pageNumber
    if (!this.isEmptyText(parent?.value?.marginNumber)) return true; // Will be handled by marginNumber

    this.writeNL_IfNotChain(route);
    this.writeOPC();
    this.writeTextOrValue(parent?.value?.item ?? '', TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();
    this.writeOPC();
    this.writeTextOrValue(lead, TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> pageNumber

  protected enter_pageNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    const pageNumber = node.value as TextAst;
    const parent = this.getParentNode(route);
    if (this.isEmptyText(pageNumber)) return false; // Ignore empty
    if (!this.isEmptyText(parent?.value?.marginNumber)) return true; // Will be handled by marginNumber

    this.writeNL_IfNotChain(route);
    this.writeOPC();
    this.writeTextOrValue(parent?.value?.item ?? '', TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();
    this.writeOPC();
    this.writeTextOrValue(parent?.value?.lead ?? '', TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();
    this.writeOPC();
    this.writeTextOrValue(pageNumber ?? '', TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> marginNumber

  protected enter_marginNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    const marginNumber = node.value as TextAst;
    const parent = this.getParentNode(route);
    if (this.isEmptyText(marginNumber)) return false; // Ignore empty

    this.writeNL_IfNotChain(route);
    this.writeOPC();
    this.writeTextOrValue(parent?.value?.item ?? '', TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();
    this.writeOPC();
    this.writeTextOrValue(parent?.value?.lead ?? '', TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();
    this.writeOPC();
    this.writeTextOrValue(
      parent?.value?.pageNumber ?? '',
      TextFormat.bitmarkText,
      TextLocation.tag,
    );
    this.writeCL();
    this.writeOPC();
    this.writeTextOrValue(marginNumber, TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue && parent?.key !== NodeType.cardBitsValue) return true;

    this.inTag = false;

    // Always write a NL before the body content if there is any (see Handle body)
    const body = node.value as Body;

    // Handle body
    if (this.textFormat === TextFormat.json) {
      const json = body.body ?? null;
      if (Array.isArray(json) || ObjectUtils.isObject(json)) {
        const text = JSON.stringify(json, null, this.prettifySpace);
        if (text) {
          this.writePlainTextDivider();
          this.writeNL();
          this.writeTextOrValue(text, TextFormat.plainText, TextLocation.body);
        }
      }
    } else if (this.isBodyBitmarkText) {
      // handle bitmark text
      const plainTextDividerAllowed = !(this.hasCardSet || this.hasFooter);
      this.writeNL();
      // The text generator will write to the writer
      const b = (Array.isArray(body.body) ? body.body : []) as TextAst;
      this.writeTextOrValue(b, this.textFormat, TextLocation.body, {
        plainTextDividerAllowed,
      });
    } else {
      // handle plain text
      this.writePlainTextDivider();
      this.writeNL();
      const s = (StringUtils.isString(body.body) ? body.body : '') as string;
      this.writeTextOrValue(`${s}`, TextFormat.plainText, TextLocation.body);
    }

    // Stop traversal of this branch
    return false;
  }

  protected exit_body(_node: NodeInfo, _route: NodeInfo[]): void {
    this.inTag = true;
  }

  protected bodyBitCallback(bodyBit: BodyBitJson, _index: number, _route: NodeInfo[]): string {
    // console.log('bodyBitCallback', bodyBit, index, route);

    // Walk the body bit AST
    const nodeType = NodeType.fromValue(bodyBit.type) ?? NodeType.bodyBit;
    this.ast.walk(bodyBit, nodeType, this, undefined);

    return ''; // Return empty string as we are writing to the writer
  }

  // bodyBit -> gap

  protected enter_gap(node: NodeInfo, _route: NodeInfo[]): boolean {
    const gap = node.value as GapJson;

    if (gap.solutions && gap.solutions.length === 0) {
      // If there are no solutions, we need to write the special cloze gap [_] to indicate this
      this.writeOPU();
      this.writeCL();
    } else {
      for (const solution of gap.solutions) {
        this.writeOPU();
        this.writeTextOrValue(solution, TextFormat.plainText, TextLocation.tag);
        this.writeCL();
      }
    }

    // Continue traversal
    return true;
  }

  // bodyBit -> mark

  protected enter_mark(node: NodeInfo, _route: NodeInfo[]): boolean {
    const mark = node.value as MarkJson;

    this.writeOPE();
    this.writeTextOrValue(mark.solution, TextFormat.plainText, TextLocation.tag);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bodyBit -> select

  protected enter_select(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Continue traversal
    return true;
  }

  // bodyBit -> highlight

  protected enter_highlight(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> footer

  protected enter_footer(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const footer = node.value as Footer;

    // Handle footer
    if (this.textFormat === TextFormat.json) {
      // Json footer?!
      // Not valid, ignore
    } else if (footer.footer && footer.footer.length > 0) {
      if (this.isBodyBitmarkText) {
        // handle bitmark text
        this.writeNL();
        this.writeTextOrValue('==== footer ====', TextFormat.plainText, TextLocation.body);
        this.writeNL();
        // The text generator will write to the writer
        this.writeTextOrValue(footer.footer, this.textFormat, TextLocation.body, {
          plainTextDividerAllowed: true, // Always allowed for the footer.
        });
      } else {
        // Plain text footer?!
        // Not valid, ignore (plain text cannot have a card set / footer marker, so cannot have a footer!
      }
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> solutions

  protected enter_solutions(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const solutions = node.value as string[];
    if (solutions && solutions.length === 0) {
      // If there are no solutions, we need to write the special cloze gap [_] to indicate this
      this.writeOPU();
      this.writeCL();
    }

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> solution

  protected leaf_solution(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return;

    const solution = node.value as string;

    // Ignore values that are not at the correct level as they might be handled elsewhere
    const bodyPartsValue: BodyPart | undefined = this.getParentNode(route, 2)?.value;
    if (bodyPartsValue?.type !== BodyBitType.mark) return;

    if (solution) {
      this.writeOPE();
      this.writeTextOrValue(solution, TextFormat.plainText, TextLocation.tag);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyBit -> mark -> mark

  protected leaf_mark(node: NodeInfo, route: NodeInfo[]): void {
    const root = route[0];
    if (root?.key !== NodeType.mark) return;

    const mark = node.value as string;

    if (mark) {
      this.writeProperty('mark', mark, route, {
        format: TagFormat.plainText,
      });
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> options -> optionsValue

  protected enter_optionsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const selectOption = node.value as SelectOptionJson;
    if (selectOption.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.writeTextOrValue(selectOption.text, TextFormat.plainText, TextLocation.tag);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts -> bodyPartsValue -> data -> texts -> textsValue

  protected enter_textsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const highlightText = node.value as HighlightTextJson;
    if (highlightText.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.writeTextOrValue(highlightText.text, TextFormat.plainText, TextLocation.tag);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode

  protected enter_cardNode(_node: NodeInfo, _route: NodeInfo[]): boolean {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return true;

    this.writeCardSetStart();

    // Continue traversal
    return true;
  }

  protected between_cardNode(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetCardDivider();
  }

  protected exit_cardNode(_node: NodeInfo, _route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetEnd();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      // this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_elements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetVariantDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards

  protected between_flashcards(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue

  protected between_flashcardsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    if (right.key === NodeType.answer) {
      this.writeCardSetSideDivider();
    } else if (right.key === NodeType.alternativeAnswers && right.value?.length !== 0) {
      this.writeCardSetVariantDivider();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> alternativeAnswers

  protected between_alternativeAnswers(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeCardSetVariantDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> alternativeDefintions

  protected between_alternativeDefinitions(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeCardSetVariantDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements

  protected enter_statements(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_statements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    const isTrueFalse1 = this.isOfBitType(BitType.trueFalse1);

    if (!isTrueFalse1) {
      this.writeCardSetCardDivider();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements -> statementsValue

  protected enter_statementsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const statement = node.value as StatementJson;

    this.writeNL();
    if (statement.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.writeTextOrValue(statement.statement, TextFormat.plainText, TextLocation.tag);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> choices -> choicesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> choices -> choicesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> feedbacks -> feedbacksValue -> choices -> choicesValue

  protected enter_choicesValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const choice = node.value as ChoiceJson & FeedbackChoiceJson;

    this.writeNL();
    if (choice.isCorrect || choice.requireReason) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.writeTextOrValue(choice.choice, TextFormat.plainText, TextLocation.tag);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> responses -> responsesValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses -> responsesValue

  protected enter_responsesValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const response = node.value as ResponseJson;

    this.writeNL();
    if (response.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.writeTextOrValue(response.response, TextFormat.plainText, TextLocation.tag);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> feedbacks

  protected between_feedbacks(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> feedbacks -> feedbacksValue -> reason

  protected enter_reason(_node: NodeInfo, _route: NodeInfo[]): boolean {
    this.writeCardSetSideDivider();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes

  protected enter_quizzes(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_quizzes(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(_node: NodeInfo, _route: NodeInfo[]): boolean | void {
    //
  }

  protected between_heading(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetSideDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading -> forValues

  protected enter_forValues(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_forValues(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetSideDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_pairs(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyAudio

  protected enter_keyAudio(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as AudioResourceWrapperJson;

    // This is a resource, so handle it with the common code
    this.writeNL();
    this.writeResource(ResourceType.audio, resource.audio.src);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyImage

  protected enter_keyImage(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as ImageResourceWrapperJson;

    // This is a resource, so handle it with the common code
    this.writeNL();
    this.writeResource(ResourceType.image, resource.image.src);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix

  protected enter_matrix(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_matrix(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> values
  // bitmarkAst -> bits -> bitsValue -> cardNode -> matrix -> matrixValue -> cells -> cellsValue -> values

  protected enter_values(_node: NodeInfo, _route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetSideDivider();
  }

  protected between_values(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetVariantDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable

  protected between_pronunciationTable(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table

  protected between_table(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data
  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable -> data

  protected between_data(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.table && parent?.key !== NodeType.pronunciationTable) return;

    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> columns
  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> columns

  protected between_columns(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    const parentKey = parent?.key;
    if (parentKey !== NodeType.table && parentKey !== NodeType.captionDefinitionList) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetSideDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> columns -> columnsValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> columns -> columnsValue

  protected leaf_columnsValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeOPHASH();
    this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
    this.writeCL();
  }

  protected enter_columnsValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeOPHASH();
    this.writeTextOrValue(node.value, TextFormat.bitmarkText, TextLocation.tag);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data -> dataValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable -> data -> dataValue

  protected between_dataValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route, 2);
    if (parent?.key !== NodeType.table && parent?.key !== NodeType.pronunciationTable) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    this.writeCardSetSideDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data -> dataValue -> dataValueValue

  protected leaf_dataValueValue(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route, 3);
    if (parent?.key !== NodeType.table) return;

    this.writeNL();
    this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data -> dataValue -> dataValueValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable -> data -> dataValue -> dataValueValue

  protected enter_dataValueValue(node: NodeInfo, route: NodeInfo[]): void | boolean {
    const parent = this.getParentNode(route, 3);
    if (parent?.key !== NodeType.table && parent?.key !== NodeType.pronunciationTable) return;

    if (node.value) {
      if (parent?.key === NodeType.pronunciationTable) {
        // Pronunciation Table
        const cell = node.value as PronunciationTableCellJson;
        if (cell.title) {
          this.writeNL();
          this.writeOP();
          this.writeHash();
          this.writeTextOrValue(cell.title, TextFormat.bitmarkText, TextLocation.tag);
          this.writeCL();
        }
        if (cell.audio) {
          this.writeNL();
          this.writeResource(ResourceType.audio, cell.audio.audio.src);
        }
        if (cell.body) {
          this.writeNL();
          this.writeTextOrValue(cell.body, this.textFormat, TextLocation.body);
        }

        // Stop traversal of this branch
        return false;
      } else {
        // Table
        this.writeNL();
        this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
      }
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList

  protected between_captionDefinitionList(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue -> term

  protected leaf_term(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return true;

    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue -> definition

  protected leaf_definition(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return true;

    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions
  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions

  protected between_definitions(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode && parent?.key !== NodeType.captionDefinitionList) return;

    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue

  protected between_definitionsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,
    route: NodeInfo[],
  ): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitions) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed) return;

    if (right.key === NodeType.definition) {
      this.writeCardSetSideDivider();
    } else if (right.key === NodeType.alternativeDefinitions && right.value?.length > 0) {
      this.writeCardSetVariantDivider();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_questions(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients

  protected enter_ingredients(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_ingredients(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> ingredients -> ingredientsValue

  protected enter_ingredientsValue(node: NodeInfo, route: NodeInfo[]): boolean {
    const ingredient = node.value as IngredientJson;

    if (ingredient.title != null) {
      this.writeNL();
      this.writeOPHASH();
      this.writeTextOrValue(ingredient.title, TextFormat.bitmarkText, TextLocation.tag);
      this.writeCL();
      // this.writeNL();
    }

    if (ingredient.ingredient != null) {
      this.writeNL();

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
        this.writeTextOrValue(`${ingredient.quantity}`, TextFormat.plainText, TextLocation.tag);
        this.writeCL();
      }

      // [@unit:kilograms]
      if (ingredient.unit != null)
        this.writeProperty('unit', ingredient.unit, route, {
          format: TagFormat.plainText,
        });

      // [@unitAbbr:kg]
      if (ingredient.unitAbbr != null)
        this.writeProperty('unitAbbr', ingredient.unitAbbr, route, {
          format: TagFormat.plainText,
        });

      // [@decimalPlaces:1]
      if (ingredient.decimalPlaces != null)
        this.writeProperty('decimalPlaces', ingredient.decimalPlaces, route, {
          format: TagFormat.plainText,
        });

      // [@disableCalculation]
      if (ingredient.disableCalculation)
        this.writeProperty('disableCalculation', true, route, {
          format: TagFormat.plainText,
        });

      // item

      this.writeNL();
      this.writeTextOrValue(ingredient.ingredient, this.textFormat, TextLocation.body);
    }

    // Continue traversal of this branch (item, lead, etc)
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_botResponses(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> cardBits

  protected enter_cardBits(_node: NodeInfo, _route: NodeInfo[]): void {
    //
  }

  protected between_cardBits(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _route: NodeInfo[],
  ): void {
    this.writeCardSetCardDivider();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> response

  protected leaf_response(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.botResponsesValue) return;

    this.writeNL();
    this.writeOPB();
    this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> reaction

  protected leaf_reaction(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.botResponsesValue) return;

    this.writeNL();
    this.writeProperty('reaction', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> feedback

  protected leaf_feedback(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.botResponsesValue) return;

    const feedback = node.value as string;
    if (feedback) {
      this.writeNL();
      this.writeTextOrValue(feedback, this.textFormat, TextLocation.body);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> backgroundWallpaper
  protected enter_backgroundWallpaper(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as ResourceJson;

    // This is a resource, so handle it with the common code
    this.writeNL();
    this.writePropertyStyleResource(node.key, resource);

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> imagePlaceholder
  protected enter_imagePlaceholder(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as ResourceJson;

    // This is a resource, so handle it with the common code
    this.writeNL();
    this.writePropertyStyleResource(node.key, resource);

    // Continue traversal
    return true;
  }

  protected exit_imagePlaceholder(_node: NodeInfo, _route: NodeInfo[]): void {
    // this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> posterImage
  // bitmarkAst -> bits -> bitsValue -> resource -> * -> posterImage

  protected enter_posterImage(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue) {
      // Bit poster image
      const posterImage = node.value as string;
      if (posterImage) {
        this.writeProperty('posterImage', posterImage, route, {
          format: TagFormat.plainText,
        });
      }
    } else {
      // Resource poster image
      const posterImage = node.value as ImageResourceJson;
      if (posterImage && posterImage.src) {
        this.writeProperty('posterImage', posterImage.src, route, {
          format: TagFormat.plainText,
        });
      }
    }

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails
  // [src1x,src2x,src3x,src4x,width,height,alt,zoomDisabled,caption]

  protected enter_thumbnails(node: NodeInfo, route: NodeInfo[]): boolean {
    const thumbnails = node.value as ImageResourceJson[];

    if (Array.isArray(thumbnails)) {
      const thumbnailKeys = ['src1x', 'src2x', 'src3x', 'src4x'];

      for (let i = 0; i < thumbnails.length; i++) {
        // Can only handle 4 thumbnails
        if (i === thumbnailKeys.length) break;
        const thumbnail = thumbnails[i];
        const key = thumbnailKeys[i];
        this.writeProperty(key, thumbnail.src, route, {
          format: TagFormat.plainText,
        });
      }
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> bitType

  // bitmarkAst -> bits -> bitsValue -> textFormat

  //  bitmarkAst -> bits -> level

  protected leaf_level(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ensure this is at the bit level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    // Ensure this is a chapter bit
    if (!Config.isOfBitType(this.bitType, [BitType.chapter])) return true;

    const level = node.value as number;
    const bit = parent?.value as Bit;

    if (level > 0 && bit.title == null) {
      // If the level is set, but there is no title, this is a [.chapter] bit with an empty title.
      // We need to write an empty title tag at the correct level.
      this.writeNL();
      this.writeOP();
      for (let i = 0; i < +level; i++) this.writeHash();
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  //  bitmarkAst -> bits -> title

  protected enter_title(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ensure this is at the bit level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const value = node.value as TextAst;
    const title = value;
    const bit = parent?.value as Bit;
    const level = bit.level || 1;

    if (level && title) {
      this.writeNL();
      this.writeOP();
      for (let i = 0; i < +level; i++) this.writeHash();
      this.writeTextOrValue(title, TextFormat.bitmarkText, TextLocation.tag);
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  //  bitmarkAst -> bits -> subtitle

  protected enter_subtitle(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ensure this is at the bit level
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const value = node.value as TextAst;
    const subtitle = value;
    const level = 2;
    if (level && subtitle) {
      this.writeNL();
      this.writeOP();
      for (let i = 0; i < level; i++) this.writeHash();
      this.writeTextOrValue(subtitle, TextFormat.bitmarkText, TextLocation.tag);
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> book (array)
  // bitmarkAst -> bits -> bitsValue -> book (array) -> bookValue

  protected enter_book(_node: NodeInfo, _route: NodeInfo[]): void {
    // Block standard property handling
  }

  protected enter_bookValue(node: NodeInfo, route: NodeInfo[]): boolean {
    const book = node.value as BookJson;
    // const parent = this.getParentNode(route);
    // const bit = parent?.value as Bit;

    if (book) {
      this.writeNL();
      this.writeProperty('book', book.book, route, {
        format: TagFormat.plainText,
        writeEmpty: true,
      });
      if (book.reference) {
        this.writeOPRANGLE();
        this.writeTextOrValue(book.reference, TextFormat.plainText, TextLocation.tag);
        this.writeCL();

        if (book.referenceEnd) {
          this.writeOPRANGLE();
          this.writeTextOrValue(book.referenceEnd, TextFormat.plainText, TextLocation.tag);
          this.writeCL();
        }
      }
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> book (single)

  protected leaf_book(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    const bit = parent?.value as Bit;

    if (bit && node.value) {
      this.writeNL();
      this.writeProperty('book', node.value, route, {
        format: TagFormat.plainText,
        writeEmpty: true,
      });
      if (bit.reference) {
        this.writeOPRANGLE();
        this.writeTextOrValue(bit.reference, TextFormat.plainText, TextLocation.tag);
        this.writeCL();

        if (bit.referenceEnd) {
          this.writeOPRANGLE();
          this.writeTextOrValue(bit.referenceEnd, TextFormat.plainText, TextLocation.tag);
          this.writeCL();
        }
      }
    }
  }

  //  bitmarkAst -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeNL();
      this.writeOPDANGLE();
      this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
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
        this.writeNL();
        this.writeOPRANGLE();
        this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
        this.writeCL();
      }
    }
  }

  //  * -> itemLead --> item

  //  * -> itemLead --> lead

  //  * -> hint

  protected enter_hint(node: NodeInfo, route: NodeInfo[]): boolean {
    const value = node.value as TextAst;
    const text = value;
    if (!this.isEmptyText(text)) {
      this.writeNL_IfNotChain(route);
      this.writeOPQ();
      this.writeTextOrValue(text, TextFormat.bitmarkText, TextLocation.tag);
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> instruction

  protected enter_instruction(node: NodeInfo, route: NodeInfo[]): boolean {
    const value = node.value as TextAst;
    const text = value;
    if (!this.isEmptyText(text)) {
      this.writeNL_IfNotChain(route);
      this.writeOPB();
      this.writeTextOrValue(text, TextFormat.bitmarkText, TextLocation.tag);
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> lang

  protected leaf_lang(node: NodeInfo, route: NodeInfo[]): void {
    if (!node.value) return;

    this.writeNL();
    this.writeProperty('lang', node.value, route, {
      format: TagFormat.boolean,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refAuthor

  protected enter_refAuthor(node: NodeInfo, route: NodeInfo[]): void {
    if (!node.value) return;

    this.writeNL();
    this.writeProperty('refAuthor', node.value, route, {
      format: TagFormat.plainText,
      array: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refBookTitle

  protected leaf_refBookTitle(node: NodeInfo, route: NodeInfo[]): void {
    if (!node.value) return;

    this.writeNL();
    this.writeProperty('refBookTitle', node.value, route, {
      format: TagFormat.plainText,
      array: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refPublisher

  protected enter_refPublisher(node: NodeInfo, route: NodeInfo[]): void {
    if (!node.value) return;

    this.writeNL();
    this.writeProperty('refPublisher', node.value, route, {
      format: TagFormat.plainText,
      array: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refPublicationYear

  protected leaf_refPublicationYear(node: NodeInfo, route: NodeInfo[]): void {
    if (!node.value) return;

    this.writeNL();
    this.writeProperty('refPublicationYear', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> citationStyle

  protected leaf_citationStyle(node: NodeInfo, route: NodeInfo[]): void {
    if (!node.value) return;

    this.writeNL();
    this.writeProperty('citationStyle', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isExample / example

  protected leaf_isExample(node: NodeInfo, route: NodeInfo[]): void {
    const isExample = node.value as boolean | undefined;
    if (!isExample) return;

    const parent = this.getParentNode(route);
    const example = parent?.value.example ?? null;
    // const __isDefaultExample = parent?.value.__isDefaultExample ?? false;

    if (example != null && example !== '') {
      // Write a newline if not in a chain
      this.writeNL_IfNotChain(route);

      this.writeOPA();
      this.writeString('example');
      this.writeColon();

      if (example === true) {
        this.writeString(' true ');
      } else if (example === false) {
        this.writeString(' false ');
      } else if (Array.isArray(example)) {
        // TextAst
        this.writeTextOrValue(example, TextFormat.bitmarkText, TextLocation.tag);
      } else {
        // String
        this.writeTextOrValue(example, TextFormat.plainText, TextLocation.tag);
      }
      this.writeCL();
    } else {
      // Don't write example if it is null.
      // this.writeOPA();
      // this.writeString('example');
      // this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> elements -> elementsValue

  protected leaf_elementsValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route, 2);
    if (parent?.key !== NodeType.bitsValue) return;

    if (node.value != null) {
      this.writeOPU();
      this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> prefix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> postfix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCaseSensitive

  protected leaf_isCaseSensitive(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('isCaseSensitive', node.value, route, {
      format: TagFormat.boolean,
      writeEmpty: true,
      ignoreFalse: false,
      ignoreTrue: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCorrect

  // bitmarkAst -> bits -> bitsValue -> heading -> forKeys

  protected leaf_forKeys(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeOPHASH();
    this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> heading -> forValues

  protected leaf_forValues(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeOPHASH();
    this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> heading -> forValuesValue

  protected leaf_forValuesValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeOPHASH();
    this.writeTextOrValue(node.value, TextFormat.plainText, TextLocation.tag);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> key
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> key

  protected leaf_key(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> values -> valuesValue
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> question
  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> question

  protected leaf_question(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore responses that are not at the questionsValue level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.questionsValue && parent?.key !== NodeType.flashcardsValue) return;

    if (node.value) {
      this.writeNL();
      this.writeTextOrValue(node.value, this.textFormat, TextLocation.body);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> statements -> text

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,zoomDisabled,caption]

  protected leaf_src1x(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('src1x', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_src2x(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('src2x', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_src3x(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('src3x', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_src4x(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('src4x', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_width(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('width', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_height(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('height', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_alt(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('alt', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_zoomDisabled(node: NodeInfo, route: NodeInfo[]): void {
    if (
      Config.isOfBitType(this.bitType, [
        BitType.imageSeparator,
        BitType.pageBanner,
        BitType.imagesLogoGrave,
        BitType.prototypeImages,
      ])
    ) {
      this.writeProperty('zoomDisabled', node.value, route, {
        format: TagFormat.boolean,
        writeEmpty: true,
        ignoreFalse: false,
        ignoreTrue: true,
      });
    } else {
      this.writeProperty('zoomDisabled', node.value, route, {
        format: TagFormat.boolean,
        writeEmpty: true,
        ignoreFalse: true,
        ignoreTrue: false,
      });
    }
  }

  protected leaf_license(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('license', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_copyright(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('copyright', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_provider(_node: NodeInfo, _route: NodeInfo[]): void {
    // provider is included in the url (it is the domain) and should not be written as a property
    // this.writeProperty('provider', node.value);
  }

  protected leaf_showInIndex(node: NodeInfo, route: NodeInfo[]): void {
    if (node.value == null) return;

    this.writeNL_IfNotChain(route);
    this.writeProperty('showInIndex', node.value, route, {
      format: TagFormat.boolean,
      ignoreFalse: true,
    });
  }

  protected enter_caption(node: NodeInfo, route: NodeInfo[]): boolean {
    const value = node.value as string;

    this.writeNL_IfNotChain(route);
    this.writeProperty('caption', value, route, {
      format: TagFormat.bitmarkText,
    });

    // Stop traversal of this branch
    return false;
  }

  protected leaf_search(node: NodeInfo, route: NodeInfo[]): void {
    const value = node.value as string;

    if (!value) return;

    this.writeNL_IfNotChain(route);
    this.writeProperty('search', value, route, {
      format: TagFormat.plainText,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [duration,mute,autoplay,allowSubtitles,showSubtitles]

  protected leaf_duration(node: NodeInfo, route: NodeInfo[]): void {
    // If duration is at the bit level write a NL before the property, otherwise it is part of a chain
    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue) {
      this.writeNL();
    }

    this.writeProperty('duration', node.value, route, {
      format: TagFormat.plainText,
    });
  }

  protected leaf_mute(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('mute', node.value, route, {
      format: TagFormat.boolean,
    });
  }

  protected leaf_autoplay(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('autoplay', node.value, route, {
      format: TagFormat.boolean,
    });
  }

  protected leaf_allowSubtitles(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('allowSubtitles', node.value, route, {
      format: TagFormat.boolean,
    });
  }

  protected leaf_showSubtitles(node: NodeInfo, route: NodeInfo[]): void {
    this.writeProperty('showSubtitles', node.value, route, {
      format: TagFormat.boolean,
    });
  }

  //
  // Resources
  //

  //
  // Generated Node Handlers
  //

  /**
   * Generate the handlers for resources, as they are mostly the same, but not quite
   */

  protected generateResourceHandlers() {
    for (const tag of ResourceType.keys()) {
      // skip unknown
      if (tag === ResourceType.keyFromValue(ResourceType.unknown)) continue;

      const enterFuncName = `enter_${tag}`;

      // Skip if the function already exists, allows for custom handlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (this as any)[enterFuncName] === 'function') {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[enterFuncName] = (node: NodeInfo, route: NodeInfo[]): boolean => {
        const resource = node.value as ResourceDataJson | undefined;
        if (resource == null) return false;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        const parent = this.getParentNode(route);
        if (parent?.key !== NodeType.resourcesValue) return true;

        // Get the resource alias
        const alias = ResourceType.fromValue(parent.value.__typeAlias);
        const type = alias ?? ResourceType.fromValue(parent.value.type);
        if (!type) return false;

        // url / src / href / app
        const url = resource.url || resource.src || resource.body || '';

        // Write the resource
        this.writeNL();
        this.writeResource(type, url);

        // Continue traversal
        return true;
      };

      // Bind this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[enterFuncName] = (this as any)[enterFuncName].bind(this);
    }

    // for (const tag of ResourceTag.keys()) {
    //   // skip unknown
    //   if (tag === ResourceTag.keyFromValue(ResourceTag.unknown)) continue;

    //   const enterFuncName = `enter_${tag}`;

    //   // Skip if the function already exists, allows for custom handlers
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   if (typeof (this as any)[enterFuncName] === 'function') {
    //     continue;
    //   }

    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this as any)[enterFuncName] = (node: NodeInfo, route: NodeInfo[]): boolean => {
    //     const resource = node.value as ResourceDataJson | undefined;
    //     if (resource == null) return false;

    //     // Ignore any property that is not at the bit level as that will be handled by a different handler
    //     const parent = this.getParentNode(route);
    //     if (parent?.key !== NodeType.resourcesValue) return true;

    //     // Get the resource alias
    //     const alias = ResourceTag.fromValue(parent.value.__typeAlias);
    //     const type = alias ?? ResourceTag.fromValue(parent.value.type);
    //     if (!type) return false;

    //     // url / src / href / app
    //     const url = resource.url || resource.src || resource.body || '';

    //     // Write the resource
    //     this.writeNL();
    //     this.writeResource(type, url);

    //     // Continue traversal
    //     return true;
    //   };

    //   // Bind this
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this as any)[enterFuncName] = (this as any)[enterFuncName].bind(this);
    // }
  }

  /**
   * Generate the handlers for properties, as they are mostly the same, but not quite
   */

  protected generatePropertyHandlers() {
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

          // Ignore any property that is not at the bit level as that will be handled by a different handler
          const parent = this.getParentNode(route);
          if (parent?.key !== NodeType.bitsValue) return;

          const bitType = this.getBitType(route);
          if (!bitType) return;

          const config = Config.getBitConfig(bitType);
          const propertyConfig = Config.getTagConfigForTag(config.tags, propertyConfigKey) as
            | PropertyTagConfig
            | undefined;
          if (!propertyConfig) return;

          // Write the property
          this.writeNL_IfNotChain(route); // Only if NOT in chain
          this.writeProperty(propertyConfig.tag, node.value, route, {
            format: propertyConfig.format ?? TagFormat.plainText,
            array: propertyConfig.array ?? false,
            writeEmpty: true,
            ignoreFalse: propertyConfig.defaultValue === 'false',
            ignoreTrue: propertyConfig.defaultValue === 'true',
          });
        };

        // Bind this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[funcName] = (this as any)[funcName].bind(this);
      }
    }

    // const propertiesConfig = Config.getRawPropertiesConfig();

    // for (const propertyConfig of Object.values(propertiesConfig)) {
    //   const astKey = propertyConfig.astKey ?? propertyConfig.tag;

    //   const enterFuncName = `enter_${astKey}`;

    //   // Skip if the function already exists, allows for custom handlers
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   if (typeof (this as any)[enterFuncName] === 'function') {
    //     continue;
    //   }

    //   // Skip 'example' property as it is non-standard and handled elsewhere
    //   if (astKey === 'example') continue;

    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this as any)[enterFuncName] = (node: NodeInfo, route: NodeInfo[]) => {
    //     const value = node.value as unknown[] | undefined;
    //     if (value == null) return;

    //     // Ignore any property that is not at the bit level as that will be handled by a different handler
    //     const parent = this.getParentNode(route);
    //     if (parent?.key !== NodeType.bitsValue) return;

    //     // Write the property
    //     this.writeNL_IfNotChain(route); // Only if NOT in chain
    //     this.writeProperty(propertyConfig.tag, node.value, {
    //       format: propertyConfig.format ?? TagFormat.plainText,
    //       single: propertyConfig.single ?? false,
    //       writeEmpty: true,
    //       ignoreFalse: propertyConfig.defaultValue === 'false',
    //       ignoreTrue: propertyConfig.defaultValue === 'true',
    //     });
    //   };

    //   // Bind this
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   (this as any)[enterFuncName] = (this as any)[enterFuncName].bind(this);
    // }
  }

  // END NODE HANDLERS

  //
  // UTILITY FUNCTIONS
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
   * Check if in a chain.
   *
   * Return false if at the root of the bit or a card bit, otherwise true.
   * This is useful to determine if a newline should be written before certain properties.
   *
   * @param route
   * @returns
   */
  protected isChain(route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    // Root of bit
    if (parent?.key === NodeType.bitsValue) return false;

    // Root of card bits
    if (parent?.key === NodeType.cardBitsValue) return false;
    if (parent?.key === NodeType.feedbacksValue) return false;
    if (parent?.key === NodeType.quizzesValue) return false;
    if (parent?.key === NodeType.pairsValue) return false;
    if (parent?.key === NodeType.matrixValue) return false;
    if (parent?.key === NodeType.definitionsValue) return false;
    if (parent?.key === NodeType.questionsValue) return false;

    // Root of sub-card bits
    if (parent?.key === NodeType.reason) return false;

    return true;
  }

  protected haveValidCardSet(bit: Bit): boolean {
    const bitConfig = Config.getBitConfig(bit.bitType);
    if (!bitConfig) return false;

    // There is no easy way to determine if a card set is valid, so we will just check if the bit has a card set
    // and if so, assume it is valid.

    // This information is used for automatically generating the '==== text ====' divider, so this will not be
    // generated for any bit that has a card set unless this function is improved, however, a bit that has a
    // card set in the configuration does not make any sense without a card set, so this is a reasonable behaviour.

    return !!bitConfig.cardSet;
  }

  protected haveValidFooter(bit: Bit): boolean {
    const footer = bit.footer;
    if (!footer) return false;
    const textFormat = bit.textFormat;

    // Handle footer
    if (textFormat === TextFormat.json) {
      // Json footer?!
      // Not valid, ignore
      return false;
    } else if (footer.footer && footer.footer.length > 0) {
      if (this.isBodyBitmarkText) {
        // handle bitmark text
        return true;
      } else {
        // Plain text footer?!
        // Not valid, ignore (plain text cannot have a card set / footer marker, so cannot have a footer!
        return false;
      }
    }
    return false;
  }

  /**
   * Calculate the number of spaces around values from the options.
   *
   * This function should only be called from the constructor.
   * Otherwise use this.spacesAroundValues.
   *
   * @returns
   */
  protected calcSpacesAroundValues(): number {
    const val = this.options.spacesAroundValues;
    let spaces = DEFAULT_SPACES_AROUND_VALUES;
    if (val != null) {
      if (val === true) {
        spaces = DEFAULT_SPACES_AROUND_VALUES;
      } else if (val === false) {
        spaces = 0;
      } else {
        spaces = val;
      }
    }
    spaces = Math.min(Math.max(spaces, 0), MAX_SPACES_AROUND_VALUES);

    return spaces;
  }

  // END UTILITY FUNCTIONS

  //
  // WRITE FUNCTIONS
  //

  /**
   * Helper function to write a tag key, breakscaping appropriately.
   * Use only to write a tag key.
   *
   * @param s
   */
  protected writeTagKey<T extends string>(s?: T): void {
    if (s != null) {
      this.write(
        Breakscape.breakscape(`${s}`, {
          format: TextFormat.plainText,
          location: TextLocation.tag,
        }),
      );
    }
  }

  /**
   * Write text or value, handling:
   *  - the format and location (i.e. conversion to text and breakscaping).
   *  - the spaces around values (if tag value).
   *
   * @param text
   * @param format
   * @param location
   * @param options
   */
  protected writeTextOrValue(
    text: JsonText,
    format: TextFormatType,
    location: TextLocationType,
    options?: GenerateOptions,
  ) {
    const isTagValue = location === TextLocation.tag;
    const s = typeof text === 'string' ? text : undefined;
    const ast = Array.isArray(text) ? (text as TextAst) : undefined;
    const spaces = isTagValue ? this.spacesAroundValuesStr : '';

    // For plain strings use TextFormat.text, otherwise keep the requested format for breakscaping.
    const breakscapeFormat = format === TextFormat.bitmarkText ? format : TextFormat.plainText;

    /** Wrap a piece of text in the required padding (only for tag values). */
    const wrap = (content: string) => (isTagValue ? `${spaces}${content}${spaces}` : content);

    /**
     * Capture everything written by `action` into `partWriter`,
     * then restore the original writer and return the trimmed text.
     */
    const writeToPartWriter = (action: () => void): string => {
      const originalWriter = this.writer;

      this.writer = this.partWriter;
      this.partWriter.openSync();

      action();

      this.partWriter.closeSync();
      const result = this.partWriter.getString().trim();

      this.writer = originalWriter;
      return result;
    };

    /* String */
    if (s != null) {
      const writeString = () =>
        this.write(
          Breakscape.breakscape(s, {
            format: breakscapeFormat,
            location,
          }),
        );

      if (isTagValue) {
        const written = writeToPartWriter(writeString);
        if (written) this.write(wrap(written));
      } else {
        writeString(); // already writes directly to main writer
      }
      return; // nothing more to do for string input
    }

    /* AST */
    if (ast != null) {
      const generateAst = () => this.textGenerator.generateSync(ast, format, location, options);

      if (isTagValue) {
        const written = writeToPartWriter(generateAst);
        if (written) this.write(wrap(written));
      } else {
        generateAst();
      }
    }
  }

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
    // HACK to fix breakscaping when string ends with a ^ (must add a space) if
    // options.spacesAroundValues is 0
    if (this.spacesAroundValues === 0) {
      if (this.writer.getLastWrite().endsWith('^')) {
        this.write(' ]');
      } else {
        this.write(']');
      }
    } else {
      this.write(']');
    }
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

  protected writeSpacesAroundValues(): void {
    this.write(this.spacesAroundValuesStr);
  }

  protected writePlainTextDivider(): void {
    this.writeNL();
    this.write('==== text ====');
  }

  protected writeCardSetStart(): void {
    this.writeNL();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      this.write('====');
    }
  }

  protected writeCardSetEnd(): void {
    this.writeNL();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      // this.write('==== footer ===='); // Written by the footer
    }
  }

  protected writeCardSetCardDivider(): void {
    this.writeNL();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('===');
    } else {
      this.write('====');
    }
  }

  protected writeCardSetSideDivider(): void {
    this.writeNL();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('==');
    } else {
      this.write('--');
    }
  }

  protected writeCardSetVariantDivider(): void {
    this.writeNL();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.write('--');
    } else {
      this.write('++');
    }
  }

  protected writeNL_IfNotChain(route: NodeInfo[]): void {
    if (!this.isChain(route)) {
      this.writeNL();
    }
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
  }

  protected writePropertyStyleResource(
    key: string,
    resource: ResourceJson,
    deprecated_writeAsProperty = false,
  ): boolean | void {
    if (key && resource) {
      const resourceTag = ResourceType.keyFromValue(resource.type) ?? '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resourceData = (resource as any)[resourceTag];
      const src = resourceData
        ? resourceData.src || resourceData.url || resourceData.body || ''
        : '';

      if (deprecated_writeAsProperty) {
        this.writeOPA();
      } else {
        this.writeOPAMP();
      }
      this.writeTagKey(key);
      this.writeColon();
      this.writeTextOrValue(src, TextFormat.plainText, TextLocation.tag);

      if (resource.type === ResourceType.article) {
        // this.writeNL();
      }
      this.writeCL();
    }
  }

  protected writeResource(type: ResourceTypeType, value: string): void {
    // const resourceAsArticle = resource as ArticleResource;

    if (type) {
      // Standard case
      this.writeOPAMP();
      this.writeTagKey(type);
      this.writeColon();
      this.writeTextOrValue(value, TextFormat.plainText, TextLocation.tag);

      if (type === ResourceType.article) {
        // this.writeNL();
      }
      this.writeCL();
    }
  }

  protected writeProperty(
    name: string,
    values: unknown | unknown[] | undefined,
    route: NodeInfo[],
    options: {
      format: TagFormatType;
      array?: boolean;
      ignoreFalse?: boolean;
      ignoreTrue?: boolean;
      writeEmpty?: boolean;
    },
  ): void {
    let valuesArray: unknown[];

    if (values !== undefined) {
      const isBitmarkText = options.format === TagFormat.bitmarkText;

      if (isBitmarkText) {
        // Write bitmark text
        if (!options.writeEmpty && isBitmarkText && this.isEmptyText(values as TextAst)) return;
        this.writeOPA();
        this.writeTagKey(name);
        this.writeColon();
        this.writeTextOrValue(values as TextAst, TextFormat.bitmarkText, TextLocation.tag);
        this.writeCL();
      } else {
        // Write any other property type
        if (!Array.isArray(values)) {
          valuesArray = [values];
        } else {
          valuesArray = values;
        }

        if (valuesArray.length > 0) {
          if (!options.array) valuesArray = valuesArray.slice(valuesArray.length - 1);

          let propertyIndex = 0;
          for (const val of valuesArray) {
            if (val !== undefined) {
              if (options.ignoreFalse && val === false) continue;
              if (options.ignoreTrue && val === true) continue;
              if (!options.writeEmpty && val === '') continue;
              if (propertyIndex > 0) this.writeNL_IfNotChain(route);
              this.writeOPA();
              this.writeTagKey(name);
              this.writeColon();
              this.writeTextOrValue(`${val}`, TextFormat.plainText, TextLocation.tag);
              this.writeCL();
              propertyIndex++;
            }
          }
        }
      } // isBitmarkText
    }
  }

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

  //
  // Helper functions
  //

  protected isEmptyText(text: TextAst | undefined): boolean {
    if (!text) return true;
    if (Array.isArray(text)) return text.length === 0;
    return true; // true as not valid TextAst?
  }

  protected isWriteTextFormat(bitsValue: string, textFormatDefault: TextFormatType): boolean {
    const isDefault = TextFormat.fromValue(bitsValue) === textFormatDefault;
    const writeFormat = !isDefault || this.options.explicitTextFormat;
    return !!writeFormat;
  }

  protected calculateIsCardAllowed(): boolean {
    return this.isBodyBitmarkText && !this.isOfBitType1();
  }

  protected isOfBitType1(): boolean {
    return this.isOfBitType([
      BitType.trueFalse1,
      BitType.multipleChoice1,
      BitType.multipleResponse1,
    ]);
  }

  protected isOfBitType(baseBitType: BitTypeType | BitTypeType[]): boolean {
    return Config.isOfBitType(this.bitType, baseBitType);
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
