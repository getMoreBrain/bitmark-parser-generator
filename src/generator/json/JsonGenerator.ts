import { Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { NodeType } from '../../model/ast/NodeType';
import { AudioEmbedResource, ImageSource, Ingredient } from '../../model/ast/Nodes';
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
import { BitContentNode } from '../../parser/bitmark/peg/BitmarkPegParserTypes';
import { TextParser } from '../../parser/text/TextParser';
import { ArrayUtils } from '../../utils/ArrayUtils';
import { BooleanUtils } from '../../utils/BooleanUtils';
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
  ResponseJson,
  StatementJson,
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
  private textParser = new TextParser();

  // TODO - move to context
  private options: JsonOptions;
  private jsonPrettifySpace: number | undefined;
  private writer: Writer;

  // State
  private json: Partial<BitWrapperJson>[] = [];
  private bitWrapperJson: Partial<BitWrapperJson> = {};
  private bitJson: Partial<BitJson> = {};
  private currentBitJson: Partial<BitJson> = {};

  private cardJson: Partial<BitJson>[] = [];
  private cardSideJson: Partial<BitJson>[] = [];
  private cardVariantJson: Partial<BitJson>[] = [];
  private cardLeafJson: Partial<BitJson> = {};
  private inCard: boolean = false;

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

    this.cardJson = [];
    this.cardSideJson = [];
    this.cardVariantJson = [];
    this.cardLeafJson = {};
    this.currentBitJson = {};
    this.inCard = false;

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

    // const bitConfig = Config.getBitConfig(bit.bitType);
    // const hasRootExample = !!bitConfig.rootExampleType;
    // const isBoolean = bitConfig.rootExampleType === ExampleType.boolean;

    // if (hasRootExample) {
    //   // Calculate the value of the default example
    //   let defaultExample: string | boolean;
    //   if (isBoolean) {
    //     // Boolean example
    //     defaultExample = true;
    //     if (Config.isOfBitType(bit.bitType, BitType.trueFalse1)) {
    //       if (bit.cardNode?.statement?.isCorrect !== undefined) {
    //         defaultExample = bit.cardNode.statement.isCorrect;
    //       }
    //     }
    //   } else {
    //     // String example
    //     defaultExample = bit.sampleSolution ?? '';
    //   }

    //   const exampleRes = this.toExample(bit as ExampleNode, {
    //     defaultExample,
    //     isBoolean,
    //   });
    //   this.bitJson.isExample = exampleRes.isExample;
    //   this.bitJson.example = exampleRes.example;
    // } else if (bit.isExample) {
    //   this.bitJson.isExample = true;
    // }
  }

  protected exit_bitsValue(_node: NodeInfo, _route: NodeInfo[]): void {
    // Clean up the bit JSON, removing any unwanted values
    // this.cleanAndSetDefaultsForBitJson(this.bitJson);
  }

  // bitmarkAst -> bits -> bitsValue -> node

  protected enter_nodes(_node: NodeInfo, _route: NodeInfo[]): void {
    this.currentBitJson = this.bitJson;

    this.cardJson = [];
    this.cardSideJson = [];
    this.cardVariantJson = [];
    this.cardLeafJson = {};
    this.inCard = false;
  }

  // bitmarkAst -> bits -> bitsValue -> nodesValue

  protected enter_nodesValue(node: NodeInfo, route: NodeInfo[]): void {
    return this.enterNodeOrChainValue(node, route);
  }

  // bitmarkAst -> bits -> bitsValue -> chainValue

  protected enter_chainValue(node: NodeInfo, route: NodeInfo[]): void {
    return this.enterNodeOrChainValue(node, route);
  }

  protected enterNodeOrChainValue(node: NodeInfo, _route: NodeInfo[]): void {
    const nodeData = node.value as BitContentNode;
    const key = nodeData.key ?? 'nokey';

    if (nodeData.type === 'cardSet') {
      this.inCard = true;
      this.cardJson = [];
      this.currentBitJson[key] = this.cardJson;
    } else if (nodeData.type === 'card') {
      this.cardSideJson = [];
      this.cardJson.push(this.cardSideJson);
    } else if (nodeData.type === 'side') {
      this.cardVariantJson = [];
      this.cardSideJson.push(this.cardVariantJson);
    } else if (nodeData.type === 'variant') {
      this.cardLeafJson = {};
      this.cardVariantJson.push(this.cardLeafJson);
      this.currentBitJson = this.cardLeafJson;
    } else {
      if (nodeData.chain) {
        const chainJson = {
          [key]: nodeData?.value,
        };
        this.currentBitJson[key] = chainJson;
        this.currentBitJson = chainJson;
      } else {
        this.currentBitJson[key] = nodeData?.value;
      }
    }
  }

  protected exit_chain(node: NodeInfo, _route: NodeInfo[]): void {
    const nodeData = node.value as BitContentNode[];

    if (nodeData.length > 0) {
      const first = nodeData[0];

      if (first.type === 'cardSet') {
        this.inCard = false;
      } else if (first.type === 'card') {
        this.inCard = false;
      } else if (first.type === 'side') {
        return;
      } else if (first.type === 'variant') {
        return;
      }
    }

    if (this.inCard) {
      this.currentBitJson = this.cardLeafJson;
    } else {
      this.currentBitJson = this.bitJson;
    }
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

  // END NODE HANDLERS

  //
  // HELPER FUNCTIONS
  //

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
    if (Config.isOfBitType(bitType, [BitType.imageSeparator, BitType.pageBanner])) {
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
      return text || Breakscape.EMPTY_STRING;
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
      type: bit.bitType,
      format: bit.textFormat,

      // // Properties
      // id: undefined,
      // internalComment: undefined,
      // externalId: undefined,
      // bookId: undefined,
      // spaceId: undefined,
      // padletId: undefined,
      // jupyterId: undefined,
      // jupyterExecutionCount: undefined,
      // AIGenerated: undefined,
      // releaseVersion: undefined,
      // book: undefined,
      // ageRange: undefined,
      // lang: undefined,
      // language: undefined,
      // publisher: undefined,
      // theme: undefined,
      // computerLanguage: undefined,
      // target: undefined,
      // tag: undefined,
      // icon: undefined,
      // iconTag: undefined,
      // colorTag: undefined,
      // flashcardSet: undefined,
      // subtype: undefined,
      // bookAlias: undefined,
      // coverImage: undefined,
      // publications: undefined,
      // author: undefined,
      // subject: undefined,
      // date: undefined,
      // location: undefined,
      // kind: undefined,
      // action: undefined,
      // width: undefined,
      // height: undefined,
      // thumbImage: undefined,
      // scormSource: undefined,
      // posterImage: undefined,
      // focusX: undefined,
      // focusY: undefined,
      // pointerLeft: undefined,
      // pointerTop: undefined,
      // backgroundWallpaper: undefined,
      // deeplink: undefined,
      // externalLink: undefined,
      // externalLinkText: undefined,
      // videoCallLink: undefined,
      // vendorUrl: undefined,
      // duration: undefined,
      // list: undefined,
      // textReference: undefined,
      // isTracked: undefined,
      // isInfoOnly: undefined,
      // labelTrue: undefined,
      // labelFalse: undefined,
      // content2Buy: undefined,
      // mailingList: undefined,
      // buttonCaption: undefined,
      // quotedPerson: undefined,
      // reasonableNumOfChars: undefined,
      // resolved: undefined,
      // resolvedDate: undefined,
      // resolvedBy: undefined,
      // maxCreatedBits: undefined,
      // maxDisplayLevel: undefined,
      // product: undefined,
      // productVideo: undefined,
      // productFolder: undefined,
      // technicalTerm: undefined,
      // portions: undefined,

      // // Book data
      // title: undefined,
      // subtitle: undefined,
      // level: undefined,
      // toc: undefined,
      // progress: undefined,
      // anchor: undefined,
      // reference: undefined,
      // referenceEnd: undefined,

      // // Item, Lead, Hint, Instruction
      // item: undefined,
      // lead: undefined,
      // pageNumber: undefined,
      // marginNumber: undefined,
      // hint: undefined,
      // instruction: undefined,

      // // Example
      // isExample: undefined,
      // example: undefined,

      // // Person .conversion-xxx, page-person, etc
      // person: undefined,

      // // Marks (config)
      // marks: undefined,

      // // Extra Properties
      // extraProperties: undefined,

      // // Body
      // body: undefined,

      // // Resource
      // resource: undefined,
      // logos: undefined,

      // // Children
      // statement: undefined,
      // isCorrect: undefined,
      // sampleSolution: undefined,
      // partialAnswer: undefined,
      // elements: undefined,
      // statements: undefined,
      // responses: undefined,
      // quizzes: undefined,
      // heading: undefined,
      // pairs: undefined,
      // matrix: undefined,
      // choices: undefined,
      // questions: undefined,
      // listItems: undefined,
      // sections: undefined,

      // // Placeholders
      // placeholders: undefined,

      // // Footer
      // footer: undefined,
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

  // /**
  //  * Remove wanted properties from bit json object.
  //  * - This function defines the defaults for properties in the json.
  //  *
  //  * @param bit
  //  * @returns
  //  */
  // protected cleanAndSetDefaultsForBitJson(bitJson: Partial<BitJson>): Partial<BitJson> {
  //   const bitType = Config.getBitType(bitJson.type);
  //   const plainText = this.options.textAsPlainText;

  //   // Clear 'item' which may be an empty string if 'lead' was set but item not
  //   // Only necessary because '.article' does not include a default value for 'item'
  //   // which is totally inconsistent, but maybe is wanted.
  //   if (!bitJson.item) bitJson.item = undefined;

  //   // Add default properties to the bit.
  //   // NOTE: Not all bits have the same default properties.
  //   //       The properties used are a bit random sometimes?
  //   //       It would be better if this functionality was generated from the bit config
  //   if (Config.isOfBitType(bitType, [BitType._error, BitType._comment])) {
  //     //
  //     delete bitJson.format;
  //     //
  //   } else if (Config.isOfBitType(bitType, [BitType.article, BitType.sampleSolution, BitType.page])) {
  //     //
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (
  //     Config.isOfBitType(bitType, [
  //       BitType.cloze,
  //       BitType.multipleChoice1,
  //       BitType.multipleResponse1,
  //       BitType.multipleChoiceText,
  //       BitType.highlightText,
  //       BitType.clozeAndMultipleChoiceText,
  //       BitType.sequence,
  //       BitType.mark,
  //       BitType.flashcard,
  //     ])
  //   ) {
  //     // Default, but with no 'example' at the bit level.
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, [BitType.multipleChoice, BitType.multipleResponse])) {
  //     // Default with a card (and hence a footer possibility)
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     if (bitJson.footer == null) bitJson.footer = this.textDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.essay)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.example == null) bitJson.example = null;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     if (bitJson.partialAnswer == null) bitJson.partialAnswer = '';
  //     // if (bitJson.sampleSolution == null) bitJson.sampleSolution = '';
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.trueFalse1)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.lead == null) bitJson.lead = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.example == null) bitJson.example = null;
  //     if (bitJson.isCorrect == null) bitJson.isCorrect = false;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.trueFalse)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.lead == null) bitJson.lead = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.labelFalse == null) bitJson.labelFalse = '';
  //     if (bitJson.labelTrue == null) bitJson.labelTrue = '';
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.chapter)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.example == null) bitJson.example = null;
  //     if (bitJson.toc == null) bitJson.toc = true; // Always set on chapter bits?
  //     if (bitJson.progress == null) bitJson.progress = true; // Always set on chapter bits
  //     if (bitJson.level == null) bitJson.level = 1; // Set level 1 if none set (makes no sense, but in ANTLR parser)
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.interview)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     if (bitJson.footer == null) bitJson.footer = this.textDefault;
  //     if (bitJson.questions == null) bitJson.questions = [];
  //     //
  //   } else if (bitType === BitType.matchMatrix) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.match)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.heading == null) bitJson.heading = {} as HeadingJson;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.learningPathBook)) {
  //     //
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.example == null) bitJson.example = null;
  //     if (bitJson.isTracked == null) bitJson.isTracked = true;
  //     if (bitJson.isInfoOnly == null) bitJson.isInfoOnly = false;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else if (Config.isOfBitType(bitType, BitType.pageBuyButton)) {
  //     //
  //     if (bitJson.content2Buy == null) bitJson.content2Buy = '';
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;
  //     //
  //   } else {
  //     // Most bits have these defaults, but there are special cases (not sure if that is by error or design)
  //     if (bitJson.item == null) bitJson.item = this.textDefault;
  //     if (bitJson.hint == null) bitJson.hint = this.textDefault;
  //     if (bitJson.isExample == null) bitJson.isExample = false;
  //     if (bitJson.example == null) bitJson.example = null;
  //     if (bitJson.body == null) bitJson.body = this.bodyDefault;

  //     // Special case for 'ai' bits
  //     if (bitType === BitType.articleAi || bitType === BitType.noteAi || bitType === BitType.summaryAi) {
  //       if (bitJson.AIGenerated == null) bitJson.AIGenerated = true;
  //     }

  //     // Special case for 'review-...' bits
  //     if (Config.isOfBitType(bitType, BitType.reviewNote)) {
  //       if (bitJson.resolved == null) bitJson.resolved = false;
  //       if (bitJson.resolvedDate == null) bitJson.resolvedDate = '';
  //       if (bitJson.resolvedBy == null) bitJson.resolvedBy = '';
  //     }

  //     // Special case for 'images-logos-grave' bit
  //     if (Config.isOfBitType(bitType, BitType.imagesLogoGrave)) {
  //       if (bitJson.logos == null) bitJson.logos = [];
  //     }
  //   }

  //   // Remove unwanted properties

  //   // Properties
  //   if (bitJson.id == null) delete bitJson.id;
  //   if (bitJson.internalComment == null) delete bitJson.internalComment;
  //   if (bitJson.externalId == null) delete bitJson.externalId;
  //   if (bitJson.bookId == null) delete bitJson.bookId;
  //   if (bitJson.spaceId == null) delete bitJson.spaceId;
  //   if (bitJson.padletId == null) delete bitJson.padletId;
  //   if (bitJson.jupyterId == null) delete bitJson.jupyterId;
  //   if (bitJson.jupyterExecutionCount == null) delete bitJson.jupyterExecutionCount;
  //   if (bitJson.AIGenerated == null) delete bitJson.AIGenerated;
  //   if (bitJson.releaseVersion == null) delete bitJson.releaseVersion;
  //   if (bitJson.book == null) delete bitJson.book;
  //   if (bitJson.ageRange == null) delete bitJson.ageRange;
  //   if (bitJson.lang == null) delete bitJson.lang;
  //   if (bitJson.language == null) delete bitJson.language;
  //   if (bitJson.publisher == null) delete bitJson.publisher;
  //   if (bitJson.theme == null) delete bitJson.theme;
  //   if (bitJson.computerLanguage == null) delete bitJson.computerLanguage;
  //   if (bitJson.target == null) delete bitJson.target;
  //   if (bitJson.tag == null) delete bitJson.tag;
  //   if (bitJson.icon == null) delete bitJson.icon;
  //   if (bitJson.iconTag == null) delete bitJson.iconTag;
  //   if (bitJson.colorTag == null) delete bitJson.colorTag;
  //   if (bitJson.flashcardSet == null) delete bitJson.flashcardSet;
  //   if (bitJson.subtype == null) delete bitJson.subtype;
  //   if (bitJson.bookAlias == null) delete bitJson.bookAlias;
  //   if (bitJson.coverImage == null) delete bitJson.coverImage;
  //   if (bitJson.publications == null) delete bitJson.publications;
  //   if (bitJson.author == null) delete bitJson.author;
  //   if (bitJson.subject == null) delete bitJson.subject;
  //   if (bitJson.date == null) delete bitJson.date;
  //   if (bitJson.location == null) delete bitJson.location;
  //   if (bitJson.kind == null) delete bitJson.kind;
  //   if (bitJson.action == null) delete bitJson.action;
  //   if (bitJson.width == null) delete bitJson.width;
  //   if (bitJson.height == null) delete bitJson.height;
  //   if (bitJson.thumbImage == null) delete bitJson.thumbImage;
  //   if (bitJson.scormSource == null) delete bitJson.scormSource;
  //   if (bitJson.posterImage == null) delete bitJson.posterImage;
  //   if (bitJson.focusX == null) delete bitJson.focusX;
  //   if (bitJson.focusY == null) delete bitJson.focusY;
  //   if (bitJson.pointerLeft == null) delete bitJson.pointerLeft;
  //   if (bitJson.pointerTop == null) delete bitJson.pointerTop;
  //   if (bitJson.backgroundWallpaper == null) delete bitJson.backgroundWallpaper;
  //   if (bitJson.deeplink == null) delete bitJson.deeplink;
  //   if (bitJson.externalLink == null) delete bitJson.externalLink;
  //   if (bitJson.externalLinkText == null) delete bitJson.externalLinkText;
  //   if (bitJson.videoCallLink == null) delete bitJson.videoCallLink;
  //   if (bitJson.vendorUrl == null) delete bitJson.vendorUrl;
  //   if (bitJson.duration == null) delete bitJson.duration;
  //   if (bitJson.list == null) delete bitJson.list;
  //   if (bitJson.textReference == null) delete bitJson.textReference;
  //   if (bitJson.isTracked == null) delete bitJson.isTracked;
  //   if (bitJson.isInfoOnly == null) delete bitJson.isInfoOnly;
  //   if (bitJson.labelTrue == null) delete bitJson.labelTrue;
  //   if (bitJson.labelFalse == null) delete bitJson.labelFalse;
  //   if (bitJson.content2Buy == null) delete bitJson.content2Buy;
  //   if (bitJson.mailingList == null) delete bitJson.mailingList;
  //   if (bitJson.buttonCaption == null) delete bitJson.buttonCaption;
  //   if (bitJson.quotedPerson == null) delete bitJson.quotedPerson;
  //   if (bitJson.resolved == null) delete bitJson.resolved;
  //   if (bitJson.resolvedDate == null) delete bitJson.resolvedDate;
  //   if (bitJson.resolvedBy == null) delete bitJson.resolvedBy;
  //   if (bitJson.maxCreatedBits == null) delete bitJson.maxCreatedBits;
  //   if (bitJson.maxDisplayLevel == null) delete bitJson.maxDisplayLevel;
  //   if (bitJson.product == null) delete bitJson.product;
  //   if (bitJson.productVideo == null) delete bitJson.productVideo;
  //   if (bitJson.productFolder == null) delete bitJson.productFolder;
  //   if (bitJson.technicalTerm == null) delete bitJson.technicalTerm;
  //   if (bitJson.portions == null) delete bitJson.portions;

  //   // Book data
  //   if (bitJson.title == null) delete bitJson.title;
  //   if (bitJson.subtitle == null) delete bitJson.subtitle;
  //   if (bitJson.level == null) delete bitJson.level;
  //   if (bitJson.toc == null) delete bitJson.toc;
  //   if (bitJson.progress == null) delete bitJson.progress;
  //   if (bitJson.anchor == null) delete bitJson.anchor;
  //   if (bitJson.reference == null) delete bitJson.reference;
  //   if (bitJson.referenceEnd == null) delete bitJson.referenceEnd;

  //   // Item, Lead, Hint, Instruction
  //   if (bitJson.item == null) delete bitJson.item;
  //   if (bitJson.lead == null) delete bitJson.lead;
  //   if (bitJson.pageNumber == null) delete bitJson.pageNumber;
  //   if (bitJson.marginNumber == null) delete bitJson.marginNumber;
  //   if (bitJson.hint == null) delete bitJson.hint;
  //   if (bitJson.instruction == null) delete bitJson.instruction;

  //   // Example
  //   if (bitJson.example === undefined) delete bitJson.example;
  //   if (bitJson.isExample == null) delete bitJson.isExample;

  //   // Mark
  //   if (bitJson.marks == null) delete bitJson.marks;

  //   // Extra Properties
  //   if (bitJson.extraProperties == null) delete bitJson.extraProperties;

  //   // Body
  //   if (bitJson.body == null) delete bitJson.body;

  //   // Placeholders
  //   if (bitJson.placeholders == null || Object.keys(bitJson.placeholders).length === 0) delete bitJson.placeholders;

  //   // Resource
  //   if (bitJson.resource == null) delete bitJson.resource;
  //   if (bitJson.logos == null) delete bitJson.logos;

  //   // Children
  //   if (bitJson.statement == null) delete bitJson.statement;
  //   if (bitJson.isCorrect == null) delete bitJson.isCorrect;
  //   if (bitJson.sampleSolution == null) delete bitJson.sampleSolution;
  //   if (bitJson.partialAnswer == null) delete bitJson.partialAnswer;
  //   if (bitJson.elements == null) delete bitJson.elements;
  //   if (bitJson.statements == null) delete bitJson.statements;
  //   if (bitJson.responses == null) delete bitJson.responses;
  //   if (bitJson.quizzes == null) delete bitJson.quizzes;
  //   if (bitJson.heading == null) delete bitJson.heading;
  //   if (bitJson.pairs == null) delete bitJson.pairs;
  //   if (bitJson.matrix == null) delete bitJson.matrix;
  //   if (bitJson.choices == null) delete bitJson.choices;
  //   if (bitJson.questions == null) delete bitJson.questions;
  //   if (bitJson.listItems == null) delete bitJson.listItems;
  //   if (bitJson.sections == null) delete bitJson.sections;

  //   // Placeholders
  //   if (!plainText || bitJson.placeholders == null) delete bitJson.placeholders;

  //   // Footer
  //   if (bitJson.footer == null) delete bitJson.footer;

  //   return bitJson;
  // }

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
