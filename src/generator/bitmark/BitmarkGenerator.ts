import { Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { NodeTypeType, NodeType } from '../../model/ast/NodeType';
import { BitmarkAst, Bit, Body, BodyPart, Footer } from '../../model/ast/Nodes';
import { TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { CardSetVersion, CardSetVersionType } from '../../model/enum/CardSetVersion';
import { PropertyFormat, PropertyFormatType } from '../../model/enum/PropertyFormat';
import { PropertyTag } from '../../model/enum/PropertyTag';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BodyBitJson, GapJson, HighlightTextJson, MarkJson, SelectOptionJson } from '../../model/json/BodyBitJson';
import { AudioResourceJson, ImageResourceJson, ResourceDataJson, ResourceJson } from '../../model/json/ResourceJson';
import { BooleanUtils } from '../../utils/BooleanUtils';
import { ObjectUtils } from '../../utils/ObjectUtils';
import { StringUtils } from '../../utils/StringUtils';
import { AstWalkerGenerator } from '../AstWalkerGenerator';
import { TextGenerator } from '../text/TextGenerator';

import {
  BookJson,
  ChoiceJson,
  ImageSourceJson,
  IngredientJson,
  MarkConfigJson,
  PersonJson,
  PronunciationTableCellJson,
  RatingLevelStartEndJson,
  ResponseJson,
  ServingsJson,
  StatementJson,
  TechnicalTermJson,
} from '../../model/json/BitJson';

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
  protected textGenerator: TextGenerator;
  private bitmarkVersion: BitmarkVersionType;
  private options: BitmarkOptions;
  private writer: Writer;
  private prettifySpace: number | undefined;

  // State
  private hasCardSet = false;
  private hasFooter = false;
  private skipNLBetweenBitsValue = false;
  private wroteSomething = false;
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

    // Keep TS happy
    this.inTag;

    // Bind callbacks
    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);
    this.write = this.write.bind(this);
    this.bodyBitCallback = this.bodyBitCallback.bind(this);

    // Set options
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

    // Create the text generator
    this.textGenerator = new TextGenerator(this.bitmarkVersion, {
      writeCallback: this.write,
      bodyBitCallback: this.bodyBitCallback,
      debugGenerationInline: this.debugGenerationInline,
    });

    this.writer = writer;

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
    this.hasCardSet = false;
    this.hasFooter = false;
    this.skipNLBetweenBitsValue = false;
    this.wroteSomething = false;
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

  // bitmarkAst -> bits

  protected between_bits(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const bit = node.value as Bit;

    const bitConfig = Config.getBitConfig(bit.bitType);
    const bitResourcesConfig = Config.getBitResourcesConfig(bit.bitType, bit.resourceType);

    this.hasCardSet = this.haveValidCardSet(bit);
    this.hasFooter = this.haveValidFooter(bit);

    // Write the bit tag opening
    this.writeOPD(bit.bitLevel);

    if (bit.isCommented) this.writeString('|');
    this.writeBreakscapedTagString(bit.bitType);

    if (bit.textFormat) {
      const write = this.isWriteTextFormat(bit.textFormat, bitConfig.textFormatDefault);

      if (write) {
        this.writeColon();
        this.writeBreakscapedTagString(bit.textFormat);
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
      this.writeBreakscapedTagString(resourceType);
    }

    this.writeCL();
    this.writeNL();

    // Continue traversal
    return true;
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

  protected enter_internalComment(node: NodeInfo, route: NodeInfo[]): boolean {
    const internalComment = node.value as BreakscapedString[];

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    for (let i = 0; i < internalComment.length; i++) {
      const comment = internalComment[i];
      const last = i === internalComment.length - 1;
      this.writeProperty('internalComment', comment, {
        format: PropertyFormat.trimmedString,
        single: false,
        ignoreEmpty: true,
      });
      if (!last) this.writeNL();
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
      if (value != '')
        this.writeProperty(PropertyTag.labelTrue, value, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      if (bit.labelFalse && bit.labelFalse[0] != '')
        this.writeProperty(PropertyTag.labelFalse, bit.labelFalse, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> imageSource

  protected enter_imageSource(node: NodeInfo, route: NodeInfo[]): boolean {
    const imageSource = node.value as ImageSourceJson;

    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue) return true;

    const { url, mockupId, size, format, trim } = imageSource;

    this.writeProperty('imageSource', url, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
    if (url) {
      if (mockupId)
        this.writeProperty('mockupId', mockupId, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      if (size)
        this.writeProperty('size', size, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      if (format)
        this.writeProperty('format', format, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      if (BooleanUtils.isBoolean(trim))
        this.writeProperty('trim', trim, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
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

    this.writeProperty('technicalTerm', technicalTerm, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
    if (lang != null) {
      this.writeProperty('lang', lang, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
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

    this.writeProperty('servings', servings, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
    if (unit != null) {
      this.writeProperty('unit', unit, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });
    }
    if (unitAbbr != null) {
      this.writeProperty('unitAbbr', unitAbbr, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });
    }
    if (decimalPlaces != null) {
      this.writeProperty('decimalPlaces', decimalPlaces, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });
    }
    if (disableCalculation != null) {
      this.writeProperty('disableCalculation', disableCalculation, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });
    }
    if (hint != null) {
      this.writeOPQ();
      this.writeBreakscapedTagString(hint);
      this.writeCL();
      // this.writeProperty('hint', hint, {
      //   format: PropertyFormat.trimmedString,
      //   single: true,
      //   ignoreEmpty: true,
      // });
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

    this.writeProperty('person', name, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
    if (title) {
      this.writeProperty('title', title, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });
    }
    if (avatarImage) {
      this.writeResource(ResourceTag.image, avatarImage.src);
    }

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
    const levelKey = node.key === NodeType.ratingLevelStart ? PropertyTag.ratingLevelStart : PropertyTag.ratingLevelEnd;

    this.writeProperty(levelKey, level, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
    if (label) {
      this.writeProperty('label', label, {
        format: PropertyFormat.bitmarkMinusMinus,
        single: true,
        ignoreEmpty: true,
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
      this.writeProperty('mark', mark, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });
      if (color) {
        this.writeProperty('color', color, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      }
      if (emphasis) {
        this.writeProperty('emphasis', emphasis, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      }
      this.writeNL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> partialAnswer

  protected enter_partialAnswer(node: NodeInfo, _route: NodeInfo[]): boolean {
    this.writeProperty('partialAnswer', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> partialAnswer

  protected leaf_partialAnswer(node: NodeInfo, _route: NodeInfo[]): boolean {
    this.writeProperty('partialAnswer', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> sampleSolution
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> sampleSolution

  protected enter_sampleSolution(node: NodeInfo, _route: NodeInfo[]): boolean {
    this.writeProperty('sampleSolution', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });

    // Stop traversal of this branch
    return false;
  }

  protected leaf_sampleSolution(node: NodeInfo, _route: NodeInfo[]): boolean {
    this.writeProperty('sampleSolution', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> reasonableNumOfChars
  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> reasonableNumOfChars

  protected leaf_reasonableNumOfChars(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('reasonableNumOfChars', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
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

    this.writeProperty('additionalSolutions', node.value, {
      format: PropertyFormat.trimmedString,
      single: false,
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

    this.writeOPC();
    this.textGenerator.generateSync(item, TextFormat.bitmarkMinusMinus);
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

    this.writeOPC();
    this.textGenerator.generateSync(parent?.value?.item ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();
    this.writeOPC();
    this.textGenerator.generateSync(lead, TextFormat.bitmarkMinusMinus);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> pageNumber

  protected enter_pageNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    const pageNumber = node.value as TextAst;
    const parent = this.getParentNode(route);
    if (this.isEmptyText(pageNumber)) return false; // Ignore empty
    if (!this.isEmptyText(parent?.value?.marginNumber)) return true; // Will be handled by marginNumber

    this.writeOPC();
    this.textGenerator.generateSync(parent?.value?.item ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();
    this.writeOPC();
    this.textGenerator.generateSync(parent?.value?.lead ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();
    this.writeOPC();
    this.textGenerator.generateSync(pageNumber ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> marginNumber

  protected enter_marginNumber(node: NodeInfo, route: NodeInfo[]): boolean {
    const marginNumber = node.value as TextAst;
    const parent = this.getParentNode(route);
    if (this.isEmptyText(marginNumber)) return false; // Ignore empty

    this.writeOPC();
    this.textGenerator.generateSync(parent?.value?.item ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();
    this.writeOPC();
    this.textGenerator.generateSync(parent?.value?.lead ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();
    this.writeOPC();
    this.textGenerator.generateSync(parent?.value?.pageNumber ?? '', TextFormat.bitmarkMinusMinus);
    this.writeCL();
    this.writeOPC();
    this.textGenerator.generateSync(marginNumber, TextFormat.bitmarkMinusMinus);
    this.writeCL();

    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> body

  protected enter_body(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore values that are not at the bit level as they might be handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.bitsValue && parent?.key !== NodeType.cardBitsValue) return true;

    this.inTag = false;

    // always write a NL before the body content if there is any?
    const body = node.value as Body;
    const textFormat = this.getTextFormat(route);
    const isBitmarkText = textFormat === TextFormat.bitmarkPlusPlus || textFormat === TextFormat.bitmarkMinusMinus;

    // Handle body
    if (textFormat === TextFormat.json) {
      const json = body.body ?? null;
      if (Array.isArray(json) || ObjectUtils.isObject(json)) {
        const text = JSON.stringify(json, null, this.prettifySpace);
        if (text) {
          this.writeNL();
          this.writePlainTextDivider();
          this.writeNL();
          this.write(
            Breakscape.breakscape(text, {
              textFormat: TextFormat.text,
            }),
          );
        }
      }
    } else if (isBitmarkText) {
      // handle bitmark text
      const plainTextDividerAllowed = !(this.hasCardSet || this.hasFooter);
      this.writeNL();
      // The text generator will write to the writer
      const b = (Array.isArray(body.body) ? body.body : []) as TextAst;
      this.textGenerator.generateSync(b as TextAst, textFormat, {
        plainTextDividerAllowed,
      });
    } else {
      // handle plain text
      this.writeNL();
      this.writePlainTextDivider();
      this.writeNL();
      const s = (StringUtils.isString(body.body) ? body.body : '') as string;
      this.write(
        Breakscape.breakscape(`${s}`, {
          textFormat: TextFormat.text,
        }),
      );
      this.writeNL();
    }

    // Stop traversal of this branch
    return false;

    // if ((body.body && body.body.length > 0) || body.bodyJson) {
    //   this.writeNL();

    //   // Write the plain text divider if not bitmark++/-- format
    //   const textFormat = this.getTextFormat(route);
    //   const isBitmarkText = textFormat === TextFormat.bitmarkPlusPlus || textFormat === TextFormat.bitmarkMinusMinus;
    //   if (!isBitmarkText) {
    //     this.writePlainTextDivider();
    //     this.writeNL();
    //   }
    // }
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
        this.writeBreakscapedTagString(solution);
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
    this.writeBreakscapedTagString(mark.solution);
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

    const textFormat = this.getTextFormat(route);

    // Handle footer
    if (textFormat === TextFormat.json) {
      // Json footer?!
      // Not valid, ignore
    } else if (footer.footer && footer.footer.length > 0) {
      const isBitmarkText = textFormat === TextFormat.bitmarkPlusPlus || textFormat === TextFormat.bitmarkMinusMinus;
      if (isBitmarkText) {
        // handle bitmark text
        this.write('==== footer ====');
        this.writeNL();
        // The text generator will write to the writer
        this.textGenerator.generateSync(footer.footer as TextAst, textFormat, {
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
      this.writeBreakscapedTagString(solution);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyBit -> mark -> mark

  protected leaf_mark(node: NodeInfo, route: NodeInfo[]): void {
    const root = route[0];
    if (root?.key !== NodeType.mark) return;

    const mark = node.value as string;

    if (mark) {
      this.writeProperty('mark', mark, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
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
    this.write(selectOption.text);
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
    this.write(highlightText.text);
    this.writeCL();

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode

  protected enter_cardNode(_node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return true;

    this.writeCardSetStart();
    this.writeNL();

    // Continue traversal
    return true;
  }

  protected between_cardNode(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  protected exit_cardNode(_node: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetEnd();
    if (this.options.cardSetVersion === CardSetVersion.v1) {
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> cardBitsValue

  protected between_cardBitsValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
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

  protected between_flashcardsValue(_node: NodeInfo, _left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    if (right.key === NodeType.answer) {
      this.writeNL();
      this.writeCardSetSideDivider();
      this.writeNL();
    } else if (right.key === NodeType.alternativeAnswers && right.value?.length !== 0) {
      this.writeNL();
      this.writeCardSetVariantDivider();
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> answer

  protected enter_answer(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore responses that are not at the flashcardsValue level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.flashcardsValue) return true;

    if (node.value) {
      this.textGenerator.generateSync(node.value as TextAst, TextFormat.bitmarkMinusMinus);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> alternativeAnswers

  protected between_alternativeAnswers(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> alternativeAnswers -> alternativeAnswersValue

  protected enter_alternativeAnswersValue(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore responses that are not at the alternativeAnswers level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.alternativeAnswers) return true;

    if (node.value) {
      // this.writeBreakscapedTagString(node.value);
      this.textGenerator.generateSync(node.value as TextAst, TextFormat.bitmarkMinusMinus);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> alternativeDefintions

  protected between_alternativeDefinitions(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> alternativeDefinitions -> alternativeDefinitionsValue

  protected enter_alternativeDefinitionsValue(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore responses that are not at the alternativeAnswers level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.alternativeDefinitions) return true;

    if (node.value) {
      // this.writeNL();
      // this.writeCardSetVariantDivider();
      // this.writeNL();
      this.textGenerator.generateSync(node.value as TextAst, TextFormat.bitmarkMinusMinus);
    }

    // Stop traversal of this branch
    return false;
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

  protected enter_statementsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const statement = node.value as StatementJson;
    if (statement.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(statement.statement);
    this.writeCL();

    // Continue traversal
    return true;
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

  protected enter_choicesValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const choice = node.value as ChoiceJson;
    if (choice.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(choice.choice);
    this.writeCL();

    // Continue traversal
    return true;
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

  protected enter_responsesValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const response = node.value as ResponseJson;
    if (response.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(response.response);
    this.writeCL();

    // Continue traversal
    return true;
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

  protected between_heading(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

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

  protected between_forValues(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

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

  protected enter_keyAudio(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as AudioResourceJson;

    // This is a resource, so handle it with the common code
    this.writeResource(ResourceTag.audio, resource.src);

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs -> pairsValue -> keyImage

  protected enter_keyImage(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as ImageResourceJson;

    // This is a resource, so handle it with the common code
    this.writeResource(ResourceTag.image, resource.src);

    // Stop traversal of this branch
    return false;
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

  protected enter_values(_node: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  protected between_values(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetVariantDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable

  protected between_pronunciationTable(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table

  protected between_table(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.cardNode) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetCardDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data
  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable -> data

  protected between_data(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.table && parent?.key !== NodeType.pronunciationTable) return;

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

    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> columns -> columnsValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> columns -> columnsValue

  protected leaf_columnsValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    if (node.value) this.writeBreakscapedTagString(node.value);
    this.writeCL();
  }

  protected enter_columnsValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    if (node.value) {
      this.textGenerator.generateSync(node.value, TextFormat.bitmarkMinusMinus);
    }
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data -> dataValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable -> data -> dataValue

  protected between_dataValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route, 2);
    if (parent?.key !== NodeType.table && parent?.key !== NodeType.pronunciationTable) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    this.writeNL();
    this.writeCardSetSideDivider();
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data -> dataValue -> dataValueValue

  protected leaf_dataValueValue(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route, 3);
    if (parent?.key !== NodeType.table) return;

    this.write(node.value);
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> table -> data -> dataValue -> dataValueValue
  // bitmarkAst -> bits -> bitsValue -> cardNode -> pronunciationTable -> data -> dataValue -> dataValueValue

  protected enter_dataValueValue(node: NodeInfo, route: NodeInfo[]): void | boolean {
    const parent = this.getParentNode(route, 3);
    if (parent?.key !== NodeType.table && parent?.key !== NodeType.pronunciationTable) return;

    const textFormat = this.getTextFormat(route) ?? TextFormat.bitmarkMinusMinus;

    if (node.value) {
      if (parent?.key === NodeType.pronunciationTable) {
        // Pronunciation Table
        const cell = node.value as PronunciationTableCellJson;
        if (cell.title) {
          this.writeOP();
          this.writeHash();
          this.textGenerator.generateSync(cell.title as TextAst, TextFormat.bitmarkMinusMinus);
          this.writeCL();
          this.writeNL();
        }
        if (cell.audio) {
          this.writeResource(ResourceTag.audio, cell.audio.src);
          this.writeNL();
        }
        if (cell.body) {
          this.textGenerator.generateSync(cell.body as TextAst, textFormat);
        }

        // Stop traversal of this branch
        return false;
      } else {
        // Table
        this.textGenerator.generateSync(node.value, textFormat);
      }
    }
    // this.write(node.value);
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

  // // Ignore cards if not allowed
  // if (!this.isCardAllowed(route)) return;

  //   this.writeNL();
  //   this.writeCardSetSideDivider();
  //   this.writeNL();
  // }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> term

  protected enter_term(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return true;

    if (node.value) {
      this.textGenerator.generateSync(node.value as TextAst, TextFormat.bitmarkMinusMinus);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue -> term

  protected leaf_term(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return true;

    if (node.value) {
      this.write(node.value);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue -> definition

  protected enter_definition(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return true;

    if (node.value) {
      this.textGenerator.generateSync(node.value as TextAst, TextFormat.bitmarkMinusMinus);
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue -> definition

  protected leaf_definition(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitionsValue) return true;

    if (node.value) {
      this.write(node.value);
    }

    // Stop traversal of this branch
    return false;
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

  // bitmarkAst -> bits -> bitsValue -> cardNode -> definitions -> definitionsValue

  protected between_definitionsValue(_node: NodeInfo, _left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.definitions) return;

    // Ignore cards if not allowed
    if (!this.isCardAllowed(route)) return;

    if (right.key === NodeType.definition) {
      this.writeNL();
      this.writeCardSetSideDivider();
      this.writeNL();
    } else if (right.key === NodeType.alternativeDefinitions && right.value?.length > 0) {
      this.writeNL();
      this.writeCardSetVariantDivider();
      this.writeNL();
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> captionDefinitionList -> definitions -> definitionsValue

  // protected between_definitionsValue(_node: NodeInfo, _left: NodeInfo, right: NodeInfo, route: NodeInfo[]): void {
  //   const parent = this.getParentNode(route);
  //   if (parent?.key !== NodeType.definitions) return;

  // // Ignore cards if not allowed
  // if (!this.isCardAllowed(route)) return;

  //   if (right.key === NodeType.definition) {
  //     this.writeNL();
  //     this.writeCardSetSideDivider();
  //     this.writeNL();
  //   } else if (right.key === NodeType.alternativeDefinitions && right.value?.length > 0) {
  //     this.writeNL();
  //     this.writeCardSetVariantDivider();
  //     this.writeNL();
  //   }
  // }

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

  protected enter_ingredientsValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const ingredient = node.value as IngredientJson;

    if (ingredient.title != null) {
      this.writeOPHASH();
      this.writeBreakscapedTagString(ingredient.title);
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
      this.writeBreakscapedTagString(`${ingredient.quantity}`);
      this.writeCL();
    }

    // [@unit:kilograms]
    if (ingredient.unit != null)
      this.writeProperty('unit', ingredient.unit, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });

    // [@unitAbbr:kg]
    if (ingredient.unitAbbr != null)
      this.writeProperty('unitAbbr', ingredient.unitAbbr, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });

    // [@decimalPlaces:1]
    if (ingredient.decimalPlaces != null)
      this.writeProperty('decimalPlaces', ingredient.decimalPlaces, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });

    // [@disableCalculation]
    if (ingredient.disableCalculation)
      this.writeProperty('disableCalculation', true, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: true,
      });

    // item
    if (ingredient.item != null) this.write(ingredient.item);

    // Stop traversal of this branch
    return false;
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

  protected leaf_response(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.botResponsesValue) return;

    this.writeOPB();
    this.writeBreakscapedTagString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> reaction

  protected leaf_reaction(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.botResponsesValue) return;

    this.writeProperty('reaction', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses -> botResponsesValue -> feedback

  protected leaf_feedback(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.botResponsesValue) return;

    const feeback = node.value as string;
    if (feeback) {
      this.write(feeback);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> imagePlaceholder
  protected enter_imagePlaceholder(node: NodeInfo, _route: NodeInfo[]): boolean {
    const resource = node.value as ResourceJson;

    // This is a resource, so handle it with the common code
    this.writePropertyStyleResource(node.key, resource);

    // Continue traversal
    return true;
  }

  protected exit_imagePlaceholder(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> posterImage
  // bitmarkAst -> bits -> bitsValue -> resource -> * -> posterImage

  protected enter_posterImage(node: NodeInfo, route: NodeInfo[]): boolean {
    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue) {
      // Bit poster image
      const posterImage = node.value as string;
      if (posterImage) {
        this.writeProperty('posterImage', posterImage, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      }
    } else {
      // Resource poster image
      const posterImage = node.value as ImageResourceJson;
      if (posterImage && posterImage.src) {
        this.writeProperty('posterImage', posterImage.src, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      }
    }

    // Continue traversal
    return true;
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails
  // [src1x,src2x,src3x,src4x,width,height,alt,zoomDisabled,caption]

  protected enter_thumbnails(node: NodeInfo, _route: NodeInfo[]): boolean {
    const thumbnails = node.value as ImageResourceJson[];

    if (Array.isArray(thumbnails)) {
      const thumbnailKeys = ['src1x', 'src2x', 'src3x', 'src4x'];

      for (let i = 0; i < thumbnails.length; i++) {
        // Can only handle 4 thumbnails
        if (i === thumbnailKeys.length) break;
        const thumbnail = thumbnails[i];
        const key = thumbnailKeys[i];
        this.writeProperty(key, thumbnail.src, {
          format: PropertyFormat.trimmedString,
          single: true,
          ignoreEmpty: true,
        });
      }
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> bitType

  // bitmarkAst -> bits -> bitsValue -> textFormat

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
      this.writeOP();
      for (let i = 0; i < +level; i++) this.writeHash();
      this.textGenerator.generateSync(title, TextFormat.bitmarkMinusMinus);
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
      this.writeOP();
      for (let i = 0; i < level; i++) this.writeHash();
      this.textGenerator.generateSync(subtitle, TextFormat.bitmarkMinusMinus);
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

  protected between_book(_node: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  protected enter_bookValue(node: NodeInfo, _route: NodeInfo[]): boolean {
    const book = node.value as BookJson;
    // const parent = this.getParentNode(route);
    // const bit = parent?.value as Bit;

    if (book) {
      this.writeProperty('book', book.book, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: false,
      });
      if (book.reference) {
        this.writeOPRANGLE();
        this.writeBreakscapedTagString(book.reference);
        this.writeCL();

        if (book.referenceEnd) {
          this.writeOPRANGLE();
          this.writeBreakscapedTagString(book.referenceEnd);
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
      this.writeProperty('book', node.value, {
        format: PropertyFormat.trimmedString,
        single: true,
        ignoreEmpty: false,
      });
      if (bit.reference) {
        this.writeOPRANGLE();
        this.writeBreakscapedTagString(bit.reference);
        this.writeCL();

        if (bit.referenceEnd) {
          this.writeOPRANGLE();
          this.writeBreakscapedTagString(bit.referenceEnd);
          this.writeCL();
        }
      }
    }
  }

  //  bitmarkAst -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDANGLE();
      this.writeBreakscapedTagString(node.value);
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
        this.writeBreakscapedTagString(node.value);
        this.writeCL();
      }
    }
  }

  //  * -> itemLead --> item

  //  * -> itemLead --> lead

  //  * -> hint

  protected enter_hint(node: NodeInfo, _route: NodeInfo[]): boolean {
    const value = node.value as TextAst;
    const text = value;
    if (!this.isEmptyText(text)) {
      this.writeOPQ();
      this.textGenerator.generateSync(text, TextFormat.bitmarkMinusMinus);
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> instruction

  protected enter_instruction(node: NodeInfo, _route: NodeInfo[]): boolean {
    const value = node.value as TextAst;
    const text = value;
    if (!this.isEmptyText(text)) {
      this.writeOPB();
      this.textGenerator.generateSync(text, TextFormat.bitmarkMinusMinus);
      this.writeCL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> lang

  protected enter_lang(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('lang', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreEmpty: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refAuthor

  protected enter_refAuthor(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('refAuthor', node.value, {
      format: PropertyFormat.trimmedString,
      single: false,
      ignoreEmpty: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refBookTitle

  protected enter_refBookTitle(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('refBookTitle', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> refPublisher

  protected enter_refPublisher(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('refPublisher', node.value, {
      format: PropertyFormat.trimmedString,
      single: false,
      ignoreEmpty: true,
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
      this.writeOPA();
      this.writeString('example');
      this.writeColon();

      if (example === true) {
        this.writeString('true');
      } else if (example === false) {
        this.writeString('false');
      } else if (Array.isArray(example)) {
        // TextAst
        this.textGenerator.generateSync(example, TextFormat.bitmarkMinusMinus);
      } else {
        // String
        this.writeBreakscapedTagString(example);
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
      this.writeBreakscapedTagString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, route: NodeInfo[]): void {
    const parent = this.getParentNode(route, 2);
    if (parent?.key !== NodeType.bitsValue) return;

    if (node.value != null) {
      this.writeOPU();
      this.writeBreakscapedTagString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> prefix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeBreakscapedTagString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> select -> options -> postfix
  // bitmarkAst -> bits -> bitsValue-> body -> bodyValue -> highlight -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeBreakscapedTagString(node.value);
      this.writeCL();
    }
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCaseSensitive

  protected leaf_isCaseSensitive(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('isCaseSensitive', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreFalse: false,
      ignoreTrue: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> isCorrect

  // bitmarkAst -> bits -> bitsValue -> heading -> forKeys

  protected leaf_forKeys(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeBreakscapedTagString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> heading -> forValues

  protected leaf_forValues(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeBreakscapedTagString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> heading -> forValuesValue

  protected leaf_forValuesValue(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeBreakscapedTagString(node.value);
    this.writeCL();
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> key
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> key

  protected leaf_key(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeBreakscapedTagString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> pairs -> pairsValue -> values -> valuesValue
  // bitmarkAst -> bits -> bitsValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeBreakscapedTagString(node.value);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> questions -> questionsValue -> question
  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue -> question

  protected leaf_question(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore responses that are not at the questionsValue level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.questionsValue && parent?.key !== NodeType.flashcardsValue) return;

    if (node.value) {
      this.writeBreakscapedTagString(node.value);
      // this.writeNL();
    }
  }

  protected enter_question(node: NodeInfo, route: NodeInfo[]): boolean {
    // Ignore responses that are not at the questionsValue level as they are handled elsewhere
    const parent = this.getParentNode(route);
    if (parent?.key !== NodeType.questionsValue && parent?.key !== NodeType.flashcardsValue) return true;

    if (node.value) {
      this.textGenerator.generateSync(node.value as TextAst, TextFormat.bitmarkMinusMinus);
      // this.writeString(node.value);
      // this.writeNL();
    }

    // Stop traversal of this branch
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> statements -> text

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,zoomDisabled,caption]

  protected leaf_src1x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src1x', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_src2x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src2x', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_src3x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src3x', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_src4x(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('src4x', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_width(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('width', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_height(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('height', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_alt(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('alt', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
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
      this.writeProperty('zoomDisabled', node.value, {
        format: PropertyFormat.boolean,
        single: true,
        ignoreFalse: false,
        ignoreTrue: true,
      });
    } else {
      this.writeProperty('zoomDisabled', node.value, {
        format: PropertyFormat.boolean,
        single: true,
        ignoreFalse: true,
        ignoreTrue: false,
      });
    }
  }

  protected leaf_license(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('license', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_copyright(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('copyright', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_provider(_node: NodeInfo, _route: NodeInfo[]): void {
    // provider is included in the url (it is the domain) and should not be written as a property
    // this.writeProperty('provider', node.value);
  }

  protected leaf_showInIndex(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('showInIndex', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreEmpty: true,
      ignoreFalse: true,
    });
  }

  protected enter_caption(node: NodeInfo, _route: NodeInfo[]): boolean {
    const value = node.value as string;
    this.writeProperty('caption', value, {
      format: PropertyFormat.bitmarkMinusMinus,
      single: true, // ??
      ignoreEmpty: true,
    });

    // Stop traversal of this branch
    return false;
  }

  protected leaf_search(node: NodeInfo, _route: NodeInfo[]): void {
    const value = node.value as string;
    this.writeProperty('search', value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  // bitmarkAst -> bits -> bitsValue -> resource -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> posterImage -> ...
  // bitmarkAst -> bits -> bitsValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [duration,mute,autoplay,allowSubtitles,showSubtitles]

  protected leaf_duration(node: NodeInfo, route: NodeInfo[]): void {
    // Ignore duration that IS at the bit level as there is a key clash with resource...duration / bit.duration
    const parent = this.getParentNode(route);
    if (parent?.key === NodeType.bitsValue) return;

    this.writeProperty('duration', node.value, {
      format: PropertyFormat.trimmedString,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_mute(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('mute', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_autoplay(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('autoplay', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_allowSubtitles(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('allowSubtitles', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreEmpty: true,
    });
  }

  protected leaf_showSubtitles(node: NodeInfo, _route: NodeInfo[]): void {
    this.writeProperty('showSubtitles', node.value, {
      format: PropertyFormat.boolean,
      single: true,
      ignoreEmpty: true,
    });
  }

  //
  // Resources
  //

  // bitmarkAst -> bits -> bitsValue -> resources

  protected between_resources(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  protected exit_resources(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmarkAst -> bits -> bitsValue -> resourcesValue

  protected between_resourcesValue(_node: NodeInfo, _left: NodeInfo, _right: NodeInfo, _route: NodeInfo[]): void {
    this.writeNL();
  }

  //
  // Generated Node Handlers
  //

  /**
   * Generate the handlers for resources, as they are mostly the same, but not quite
   */

  protected generateResourceHandlers() {
    for (const tag of ResourceTag.keys()) {
      // skip unknown
      if (tag === ResourceTag.keyFromValue(ResourceTag.unknown)) continue;

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
        const alias = ResourceTag.fromValue(parent.value.__typeAlias);
        const type = alias ?? ResourceTag.fromValue(parent.value.type);
        if (!type) return false;

        // url / src / href / app
        const url = resource.url || resource.src || resource.body || '';

        // Write the resource
        this.writeResource(type, url);

        // Continue traversal
        return true;
      };

      // Bind this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[enterFuncName] = (this as any)[enterFuncName].bind(this);
    }
  }

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

      const enterFuncName = `enter_${astKey}`;

      // Skip if the function already exists, allows for custom handlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (this as any)[enterFuncName] === 'function') {
        continue;
      }

      // Skip 'example' property as it is non-standard and handled elsewhere
      if (astKey === 'example') continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[enterFuncName] = (node: NodeInfo, route: NodeInfo[]) => {
        const value = node.value as unknown[] | undefined;
        if (value == null) return;

        // if (propertyConfig.tag === 'progress') debugger;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        const parent = this.getParentNode(route);
        if (parent?.key !== NodeType.bitsValue) return;

        // Write the property
        this.writeProperty(propertyConfig.tag, node.value, {
          format: propertyConfig.format ?? PropertyFormat.trimmedString,
          single: propertyConfig.single ?? false,
          ignoreFalse: propertyConfig.defaultValue === 'false',
          ignoreTrue: propertyConfig.defaultValue === 'true',
        });
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
  // UTILITY FUNCTIONS
  //

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
      const isBitmarkText = textFormat === TextFormat.bitmarkPlusPlus || textFormat === TextFormat.bitmarkMinusMinus;
      if (isBitmarkText) {
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

  // END UTILITY FUNCTIONS

  //
  // WRITE FUNCTIONS
  //

  protected writeBreakscapedTagString<T extends string>(s?: T): void {
    if (s != null) {
      this.write(
        Breakscape.breakscape(`${s}`, {
          textFormat: TextFormat.bitmarkMinusMinus,
        }),
      );
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
    this.write('==== text ====');
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
      // this.write('==== footer ===='); // Written by the footer
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

  protected writePropertyStyleResource(key: string, resource: ResourceJson): boolean | void {
    if (key && resource) {
      const resourceTag = ResourceTag.keyFromValue(resource.type) ?? '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resourceData = (resource as any)[resourceTag];
      const src = resourceData ? resourceData.src || resourceData.url || resourceData.body || '' : '';

      this.writeOPA();
      this.writeBreakscapedTagString(key);
      this.writeColon();
      this.writeBreakscapedTagString(src);

      if (resource.type === ResourceTag.article) {
        this.writeNL();
      }
      this.writeCL();
    }
  }

  protected writeResource(type: ResourceTagType, value: string): void {
    // const resourceAsArticle = resource as ArticleResource;

    if (type) {
      // Standard case
      this.writeOPAMP();
      this.writeBreakscapedTagString(type);
      this.writeColon();
      this.writeBreakscapedTagString(value);

      if (type === ResourceTag.article) {
        this.writeNL();
      }
      this.writeCL();
    }
  }

  protected writeProperty(
    name: string,
    values: unknown | unknown[] | undefined,
    options: {
      format: PropertyFormatType;
      single: boolean;
      ignoreFalse?: boolean;
      ignoreTrue?: boolean;
      ignoreEmpty?: boolean;
    },
  ): void {
    let valuesArray: unknown[];
    let wroteSomething = false;

    if (values !== undefined) {
      const isBitmarkText =
        options.format === PropertyFormat.bitmarkMinusMinus || options.format === PropertyFormat.bitmarkPlusPlus;

      if (isBitmarkText) {
        // Write bitmark text
        if (options.ignoreEmpty && isBitmarkText && this.isEmptyText(values as TextAst)) return;
        this.writeOPA();
        this.writeBreakscapedTagString(name);
        this.writeColon();
        this.textGenerator.generateSync(
          values as TextAst,
          TextFormat.fromValue(options.format) ?? TextFormat.bitmarkMinusMinus,
        );
        this.writeCL();
        wroteSomething = true;
      } else {
        // Write any other property type
        if (!Array.isArray(values)) {
          valuesArray = [values];
        } else {
          valuesArray = values;
        }

        if (valuesArray.length > 0) {
          if (options.single) valuesArray = valuesArray.slice(valuesArray.length - 1);

          let propertyIndex = 0;
          for (const val of valuesArray) {
            if (val !== undefined) {
              if (options.ignoreFalse && val === false) continue;
              if (options.ignoreTrue && val === true) continue;
              if (options.ignoreEmpty && val === '') continue;
              if (propertyIndex > 0) this.writeNL();
              this.writeOPA();
              this.writeBreakscapedTagString(name);
              this.writeColon();
              this.writeBreakscapedTagString(`${val}`);
              this.writeCL();
              wroteSomething = true;
              propertyIndex++;
            }
          }
        }
      } // isBitmarkText
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

  protected getTextFormat(route: NodeInfo[]): TextFormatType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.textFormat;
      }
    }

    return undefined;
  }

  protected isCardAllowed(route: NodeInfo[]): boolean {
    const textFormat = this.getTextFormat(route);
    const isBitmarkText = textFormat === TextFormat.bitmarkMinusMinus || textFormat === TextFormat.bitmarkPlusPlus;

    return isBitmarkText && !this.isOfBitType1(route);
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
