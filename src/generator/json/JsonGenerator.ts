import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeType } from '../../model/ast/NodeType';
import { BodyBit, BodyPart, BodyText, Flashcard, ImageLinkResource, Mark, MarkConfig } from '../../model/ast/Nodes';
import { AudioEmbedResource } from '../../model/ast/Nodes';
import { AudioLinkResource } from '../../model/ast/Nodes';
import { VideoEmbedResource } from '../../model/ast/Nodes';
import { VideoLinkResource } from '../../model/ast/Nodes';
import { StillImageFilmResource } from '../../model/ast/Nodes';
import { DocumentResource } from '../../model/ast/Nodes';
import { DocumentEmbedResource } from '../../model/ast/Nodes';
import { DocumentLinkResource } from '../../model/ast/Nodes';
import { DocumentDownloadResource } from '../../model/ast/Nodes';
import { StillImageFilmEmbedResource } from '../../model/ast/Nodes';
import { StillImageFilmLinkResource } from '../../model/ast/Nodes';
import { Text, TextAst } from '../../model/ast/TextNodes';
import { AliasBitType, RootBitType, RootBitTypeMetadata, BitTypeUtils, BitType } from '../../model/enum/BitType';
import { BitmarkVersion, BitmarkVersionType, DEFAULT_BITMARK_VERSION } from '../../model/enum/BitmarkVersion';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';
import { ResourceType } from '../../model/enum/ResourceType';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { ParserInfo } from '../../model/parser/ParserInfo';
import { TextParser } from '../../parser/text/TextParser';
import { ArrayUtils } from '../../utils/ArrayUtils';
import { BooleanUtils } from '../../utils/BooleanUtils';
import { StringUtils } from '../../utils/StringUtils';
import { UrlUtils } from '../../utils/UrlUtils';
import { Generator } from '../Generator';

import {
  BotResponse,
  Example,
  ExtraProperties,
  Highlight,
  Matrix,
  Pair,
  Partner,
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
  MarkConfigJson,
  MatrixCellJson,
  MatrixJson,
  PairJson,
  PartnerJson,
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
  ResourceJson,
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
  hint?: string;
  instruction?: string;
}

interface ItemLeadHintInstuction {
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
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
 * TODO: NOT IMPLEMENTED!
 */
class JsonGenerator implements Generator<BitmarkAst>, AstWalkCallbacks {
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
  private textDefault: Text = '';
  private bodyDefault: Text = '';

  // Debug
  private printed: boolean = false;

  /**
   * Generate bitmark JSON from a bitmark AST
   *
   * @param writer - destination for the output
   * @param options - JSON generation options
   */
  constructor(writer: Writer, options?: JsonGeneratorOptions) {
    this.bitmarkVersion = BitmarkVersion.fromValue(options?.bitmarkVersion) ?? DEFAULT_BITMARK_VERSION;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options?.jsonOptions,
    };

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
    this.textDefault = this.options.textAsPlainText ? '' : [];
    this.bodyDefault = this.options.textAsPlainText ? '' : [];

    this.printed = false;
  }

  private walkAndWrite(ast: BitmarkAst): void {
    // Walk the bitmark AST
    this.ast.walk(ast, NodeType.bitmarkAst, this, undefined);
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

  protected enter_bitmarkAst(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // Reset the JSON
    this.json = [];
  }

  // bitmarkAst -> bits

  // bitmarkAst -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
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

    const meta = RootBitType.getMetadata<RootBitTypeMetadata>(bit.bitType.root);
    const hasRootExample = !!meta?.rootExampleType;
    const isBoolean = meta?.rootExampleType === ExampleType.boolean;

    if (hasRootExample) {
      // Calculate the value of the default example
      let defaultExample: string | boolean;
      if (isBoolean) {
        // Boolean example
        defaultExample = true;
        if (bit.bitType.root === RootBitType.trueFalse1) {
          if (bit.cardNode?.statement?.isCorrect !== undefined) {
            defaultExample = bit.cardNode.statement.isCorrect;
          }
        }
      } else {
        // String example
        defaultExample = ArrayUtils.asSingle(bit.sampleSolution) ?? '';
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

  protected exit_bitsValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // Clean up the bit JSON, removing any unwanted values
    this.cleanAndSetDefaultsForBitJson(this.bitJson);
  }

  // bitmarkAst -> bits -> bitsValue -> partner

  protected enter_partner(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const partner = node.value as Partner;

    // Ignore example that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    const { name, avatarImage } = partner;

    const partnerJson = {} as PartnerJson;
    this.addProperty(partnerJson, 'name', name ?? '', true);
    if (avatarImage) {
      const res = this.parseResourceToJson(avatarImage);
      if (res && res.type === ResourceType.image) {
        partnerJson.avatarImage = res.image;
      }
    }

    this.bitJson.partner = partnerJson;
  }

  // bitmarkAst -> bits -> bitsValue -> markConfig -> markConfigValue

  protected enter_markConfigValue(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const markConfig = node.value as MarkConfig;

    // Ignore example that is not at the correct level
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

  protected enter_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'sampleSolution', node.value, true);
  }

  // bitmarkAst -> bits -> bitsValue -> itemLead

  protected enter_itemLead(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    const { item, lead } = itemLead;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (item != null) {
      this.bitJson.item = this.toTextAstOrString(item);
    }
    if (lead != null) {
      this.bitJson.lead = this.toTextAstOrString(lead);
    }
  }

  // bitmarkAst -> bits -> bitsValue -> extraProperties

  protected enter_extraProperties(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
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

  // bitmarkAst -> bits -> bitsValue -> body -> bodyParts

  protected enter_bodyParts(node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): boolean {
    const bodyParts = node.value as BodyPart[];
    const plainText = this.options.textAsPlainText;
    const textFormat = this.getTextFormat(route);
    let fullBodyTextStr = '';
    let placeholderIndex = 0;

    // Ensure body exists
    if (this.bitJson.body == null) this.bitJson.body = this.bodyDefault;

    // Function for creating the placeholder keys
    const createPlaceholderKeys = (i: number): { legacyPlaceholderKey: string; placeholderKey: string } => {
      return {
        // Old placeholder style (for backwards compatibility) = {0}
        legacyPlaceholderKey: `{${i}}`,

        // New placeholder style (cannot clash as bitmark parser would have removed it) = [!0]
        placeholderKey: `[!${i}]`,
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
        fullBodyTextStr += bodyTextPart;
      } else {
        const { legacyPlaceholderKey, placeholderKey } = createPlaceholderKeys(placeholderIndex);

        // Append the placeholder to the full text body
        fullBodyTextStr += plainText ? legacyPlaceholderKey : placeholderKey;

        placeholderIndex++;
      }
    }

    // Add string or AST to the body
    this.bitJson.body = this.toTextAstOrString(fullBodyTextStr, textFormat);
    const bodyAst = this.bitJson.body as TextAst;

    // Loop the body parts again to create the body bits:
    // - For text output the body bits are inserted into the 'placeholders' object
    // - For JSON output the body bits are inserted into body AST, replacing the placeholders created by the text parser
    placeholderIndex = 0;
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

    // Stop traversal of this branch for efficiency
    return false;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> elements

  protected enter_elements(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const elements = node.value as string[];

    // Ignore elements that are not at the bit level as they are handled elsewhere as quizzes
    // if (parent?.key !== NodeType.bitsValue) return;

    if (elements && elements.length > 0) {
      this.bitJson.elements = elements;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> flashcards -> flashcardsValue

  protected enter_flashcards(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const flashcards = node.value as Flashcard[];

    // Ignore responses that are not at the correct level as they are potentially handled elsewhere
    if (parent?.key !== NodeType.cardNode) return;

    const flashcardsJson: FlashcardJson[] = [];
    if (flashcards) {
      for (const c of flashcards) {
        // Create the flashcard
        const flashcardJson: Partial<FlashcardJson> = {
          question: c.question ?? '',
          answer: c.answer ?? '',
          alternativeAnswers: c.alternativeAnswers ?? [],
          ...this.toItemLeadHintInstruction(c),
          ...this.toExample(c, {
            defaultExample: c.isDefaultExample,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (c.itemLead?.lead == null) delete flashcardJson.lead;

        flashcardsJson.push(flashcardJson as FlashcardJson);
      }
    }

    if (flashcardsJson.length > 0) {
      this.bitJson.cards = flashcardsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> statement

  protected enter_statement(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statement = node.value as Statement;

    // Ignore statement that is not at the cardNode level as it is handled elsewhere
    if (parent?.key !== NodeType.cardNode) return;

    if (statement) {
      this.bitJson.statement = statement.text ?? '';
      this.bitJson.isCorrect = statement.isCorrect ?? false;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> statements -> statementsValue

  protected enter_statements(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statements = node.value as Statement[];

    // Ignore statements that are not at the card node level as they are handled elsewhere
    if (parent?.key !== NodeType.cardNode) return;

    const statementsJson: StatementJson[] = [];
    if (statements) {
      for (const s of statements) {
        // Create the statement
        const statementJson: Partial<StatementJson> = {
          statement: s.text ?? '',
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

  protected enter_choices(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const choices = node.value as Choice[];

    // Ignore choices that are not at the bit level as they are handled elsewhere as quizzes
    if (parent?.key !== NodeType.cardNode) return;

    const choicesJson: ChoiceJson[] = [];
    if (choices) {
      for (const c of choices) {
        // Create the choice
        const choiceJson: Partial<ChoiceJson> = {
          choice: c.text ?? '',
          isCorrect: c.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(c),
          ...this.toExample(c, {
            defaultExample: !!c.isCorrect,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (c.itemLead?.lead == null) delete choiceJson.lead;

        choicesJson.push(choiceJson as ChoiceJson);
      }
    }

    if (choicesJson.length > 0) {
      this.bitJson.choices = choicesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> responses
  // X bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes -> quizzesValue -> responses

  protected enter_responses(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const responses = node.value as Response[];

    // Ignore responses that are not at the correct level as they are handled elsewhere as quizzes
    if (parent?.key !== NodeType.cardNode) return;

    const responsesJson: ResponseJson[] = [];
    if (responses) {
      for (const r of responses) {
        // Create the response
        const responseJson: Partial<ResponseJson> = {
          response: r.text ?? '',
          isCorrect: r.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(r),
          ...this.toExample(r, {
            defaultExample: !!r.isCorrect,
            isBoolean: true,
          }),
        };

        // Delete unwanted properties
        if (r.itemLead?.lead == null) delete responseJson.lead;

        responsesJson.push(responseJson as ResponseJson);
      }
    }

    if (responsesJson.length > 0) {
      this.bitJson.responses = responsesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> quizzes

  protected enter_quizzes(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
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
              choice: c.text ?? '',
              isCorrect: c.isCorrect ?? false,
              ...this.toItemLeadHintInstruction(c),
              ...this.toExample(c, {
                defaultExample: !!c.isCorrect,
                isBoolean: true,
              }),
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete choiceJson.lead;

            choicesJson.push(choiceJson as ChoiceJson);
          }
        }

        // Responses
        const responsesJson: ResponseJson[] = [];
        if (q.responses) {
          for (const r of q.responses) {
            // Create the choice
            const responseJson: Partial<ResponseJson> = {
              response: r.text ?? '',
              isCorrect: r.isCorrect ?? false,
              ...this.toItemLeadHintInstruction(r),
              ...this.toExample(r, {
                defaultExample: !!r.isCorrect,
                isBoolean: true,
              }),
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete responseJson.lead;

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

        quizzesJson.push(quizJson as QuizJson);
      }
    }

    if (quizzesJson.length > 0) {
      this.bitJson.quizzes = quizzesJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> heading

  protected enter_heading(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const heading = node.value as Heading;

    // Ensure the heading is valid for writing out (it will be valid, but if it is empty, it should not be written)
    let valid = false;
    if (heading && heading.forKeys /*&& heading.forValues && heading.forValues.length > 0*/) {
      valid = true;
    }

    if (!valid) return false;

    // Create the heading
    const headingJson: Partial<HeadingJson> = {
      forKeys: heading.forKeys ?? '',
    };

    // TODO: Should probably check wether bit is a match or a matrix and add a string for match and array for matrix
    if (Array.isArray(heading.forValues)) {
      if (heading.forValues.length > 1) {
        headingJson.forValues = heading.forValues;
      } else if (heading.forValues.length === 1) {
        headingJson.forValues = heading.forValues[0];
      } else {
        headingJson.forValues = heading.forValues;
      }
    } else {
      headingJson.forValues = heading.forValues ?? '';
    }

    this.bitJson.heading = headingJson as HeadingJson;
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> pairs

  protected enter_pairs(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const pairs = node.value as Pair[];
    const pairsJson: PairJson[] = [];

    if (pairs) {
      for (const p of pairs) {
        // Get default example
        const defaultExample = Array.isArray(p.values) && p.values.length > 0 && p.values[0];

        // Create the question
        const pairJson: Partial<PairJson> = {
          key: p.key ?? '',
          keyAudio: p.keyAudio ? this.addAudioResource(p.keyAudio) : undefined,
          keyImage: p.keyImage ? this.addImageResource(p.keyImage) : undefined,
          values: p.values ?? [],
          ...this.toItemLeadHintInstruction(p),
          isCaseSensitive: p.isCaseSensitive ?? true,
          isLongAnswer: !p.isShortAnswer ?? false,
          ...this.toExample(p, {
            defaultExample,
            isBoolean: false,
          }),
        };

        // Delete unwanted properties
        if (p.itemLead?.lead == null) delete pairJson.lead;
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

  protected enter_matrix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
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
              values: c.values ?? [],
              ...this.toItemLeadHintInstruction(c),
              ...this.toExample(c, {
                defaultExample,
                isBoolean: false,
              }),
            };

            // Delete unwanted properties
            if (c.itemLead?.lead == null) delete matrixCellJson.lead;
            if (c.hint == null) delete matrixCellJson.hint;

            matrixCellsJson.push(matrixCellJson as MatrixCellJson);
          }
        }

        // Create the matrix
        const matrixJson: Partial<MatrixJson> = {
          key: m.key ?? '',
          cells: matrixCellsJson ?? [],
          ...this.toItemLeadHintInstruction(m),
          // ...this.toExample(m.example, m.isExample),
          isCaseSensitive: m.isCaseSensitive ?? true,
          isLongAnswer: !m.isShortAnswer ?? false,
          isExample: m.isExample ?? false,
        };

        // Delete unwanted properties
        if (m.itemLead?.lead == null) delete matrixJson.lead;
        if (m.instruction == null) delete matrixJson.instruction;

        matrixJsonArray.push(matrixJson as MatrixJson);
      }
    }

    if (matrixJsonArray.length > 0) {
      this.bitJson.matrix = matrixJsonArray;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> questions

  protected enter_questions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const questions = node.value as Question[];
    const questionsJson: QuestionJson[] = [];

    if (questions) {
      for (const q of questions) {
        // Create the question
        const questionJson: Partial<QuestionJson> = {
          question: q.question ?? '',
          partialAnswer: ArrayUtils.asSingle(q.partialAnswer) ?? '',
          sampleSolution: q.sampleSolution ?? '',
          ...this.toItemLeadHintInstruction(q),
          // isCaseSensitive: q.isCaseSensitive ?? true,
          isShortAnswer: q.isShortAnswer ?? true,
          ...this.toExample(q, {
            defaultExample: q.sampleSolution || '',
            isBoolean: false,
          }),
        };

        // Delete unwanted properties
        if (q.itemLead?.lead == null) delete questionJson.lead;

        questionsJson.push(questionJson as QuestionJson);
      }
    }

    if (questionsJson.length > 0) {
      this.bitJson.questions = questionsJson;
    }
  }

  // bitmarkAst -> bits -> bitsValue -> cardNode -> botResponses

  protected enter_botResponses(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const botResponses = node.value as BotResponse[];

    // Ignore responses that are not at the cardNode level as they are handled elsewhere
    if (parent?.key !== NodeType.cardNode) return;

    const responsesJson: BotResponseJson[] = [];
    if (botResponses) {
      for (const r of botResponses) {
        // Create the response
        const responseJson: Partial<BotResponseJson> = {
          response: r.response ?? '',
          reaction: r.reaction ?? '',
          feedback: r.feedback ?? '',
          ...this.toItemLeadHintInstruction(r),
          // ...this.toExampleAndIsExample(r.example),
        };

        // Delete unwanted properties
        if (r.itemLead?.lead == null) delete responseJson.lead;
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

  // bitmarkAst -> bits -> bitsValue -> resource

  protected enter_resource(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource - handle it with the common code
    this.bitJson.resource = this.parseResourceToJson(resource);
  }

  //
  // Terminal nodes (leaves)
  //

  // bitmarkAst -> bits -> bitsValue -> title

  protected leaf_title(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.bitJson.title = this.toTextAstOrString(node.value);
  }

  //  bitmarkAst -> bits -> bitsValue -> subtitle

  protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.bitJson.subtitle = this.toTextAstOrString(node.value);
  }

  // //  bitmarkAst -> bits -> bitsValue -> level

  protected leaf_level(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'level', node.value ?? 1, true);
  }

  // bitmarkAst -> bits -> bitsValue -> book

  protected leaf_book(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'book', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'anchor', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> reference

  protected leaf_reference(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'reference', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue -> referenceEnd

  protected leaf_referenceEnd(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'referenceEnd', node.value, true);
  }

  //  bitmarkAst -> bits -> bitsValue ->  * -> hint

  protected leaf_hint(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const hint = node.value as string;

    // Ignore hint that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.hint = this.toTextAstOrString(hint);
  }

  // bitmarkAst -> bits -> bitsValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const instruction = node.value as string;

    // Ignore instruction that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    this.bitJson.instruction = this.toTextAstOrString(instruction);
  }

  // bitmarkAst -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const footer = node.value as string;

    this.bitJson.footer = this.toTextAstOrString(footer);
  }

  // bitmarkAst -> bits -> bitsValue -> markup

  protected leaf_markup(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bitmark = node.value as string | undefined;
    if (bitmark) this.bitWrapperJson.bitmark = bitmark;
  }

  // bitmarkAst -> bits -> bitsValue -> parser

  protected enter_parser(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const parser = node.value as ParserInfo | undefined;
    if (parser) {
      const { version, excessResources: parserExcessResources, warnings, errors, ...parserRest } = parser;
      const bitmarkVersion = `${this.bitmarkVersion}`;

      // Parse resources to JSON from AST
      let excessResources: ResourceJson[] | undefined;
      if (Array.isArray(parserExcessResources) && parserExcessResources.length > 0) {
        excessResources = [];
        for (const r of parserExcessResources) {
          const rJson = this.parseResourceToJson(r as Resource);
          if (rJson) excessResources.push(rJson);
        }
      }

      if (parent?.key === NodeType.bitsValue) {
        // Bit level parser information
        this.bitWrapperJson.parser = {
          version,
          bitmarkVersion,
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

  // protected enter_errors(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[],
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
    for (const key of PropertyKey.values()) {
      const validatedKey = PropertyKey.fromValue(key);
      const meta = PropertyKey.getMetadata<PropertyKeyMetadata>(validatedKey) ?? {};
      const astKey = meta.astKey ? meta.astKey : key;
      const funcName = `enter_${astKey}`;

      // Special cases (handled outside of the automatically generated handlers)
      if (astKey === PropertyKey.example) continue;
      if (astKey === PropertyKey.partner) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)[funcName] = (node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]) => {
        const value = node.value as unknown[] | undefined;
        if (value == null) return;

        // if (key === 'progress') debugger;

        // Ignore any property that is not at the bit level as that will be handled by a different handler
        if (parent?.key !== NodeType.bitsValue) return;

        // Convert key as needed
        let jsonKey = key as string;
        if (meta.jsonKey) jsonKey = meta.jsonKey;

        // Add the property
        this.addProperty(this.bitJson, jsonKey, value, meta.isSingle);
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
      solutions: data.solutions,
    };

    // Remove unwanted properties
    if (!gapJson.lead) delete gapJson.lead;

    return gapJson as GapJson;
  }

  protected createMarkJson(mark: Mark): MarkJson {
    const data = mark.data;

    // Create the mark
    const markJson: Partial<MarkJson> = {
      type: 'mark',
      solution: data.solution,
      mark: data.mark,
      ...this.toItemLeadHintInstruction(data),
      ...this.toExample(data, {
        defaultExample: true,
        isBoolean: true,
      }),
      //
    };

    // Remove unwanted properties
    if (!markJson.lead) delete markJson.lead;

    return markJson as MarkJson;
  }

  protected createSelectJson(select: Select): SelectJson {
    const data = select.data;

    // Create the select options
    const options: SelectOptionJson[] = [];
    for (const option of data.options) {
      const optionJson: Partial<SelectOptionJson> = {
        text: option.text,
        isCorrect: option.isCorrect ?? false,
        ...this.toItemLeadHintInstruction(option),
        ...this.toExample(option, {
          defaultExample: !!option.isCorrect,
          isBoolean: true,
        }),
      };

      // Remove unwanted properties
      if (!optionJson.item) delete optionJson.item;
      if (!optionJson.lead) delete optionJson.lead;
      if (!optionJson.instruction) delete optionJson.instruction;
      if (!optionJson.isCaseSensitive) delete optionJson.isCaseSensitive;

      options.push(optionJson as SelectOptionJson);
    }

    // Create the select
    const selectJson: Partial<SelectJson> = {
      type: 'select',
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      ...this.toItemLeadHintInstruction(data),
      isExample: data.isExample ?? false,
      options,
    };

    // Remove unwanted properties
    if (!selectJson.lead) delete selectJson.lead;

    return selectJson as SelectJson;
  }

  protected createHighlightJson(highlight: Highlight): HighlightJson {
    const data = highlight.data;

    // Create the highlight options
    const texts: HighlightTextJson[] = [];
    for (const text of data.texts) {
      const textJson: Partial<HighlightTextJson> = {
        text: text.text,
        isCorrect: text.isCorrect ?? false,
        isHighlighted: text.isHighlighted ?? false,
        ...this.toItemLeadHintInstruction(text),
        ...this.toExample(text, {
          defaultExample: !!text.isCorrect,
          isBoolean: true,
        }),
      };

      // Remove unwanted properties
      if (!textJson.item) delete textJson.item;
      if (!textJson.lead) delete textJson.lead;
      if (!textJson.hint) delete textJson.hint;
      if (!textJson.isCaseSensitive) delete textJson.isCaseSensitive;

      texts.push(textJson as HighlightTextJson);
    }

    // Create the select
    const highlightJson: Partial<HighlightJson> = {
      type: 'highlight',
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      ...this.toItemLeadHintInstruction(data),
      isExample: data.isExample ?? false,
      texts,
    };

    // Remove unwanted properties
    if (!highlightJson.lead) delete highlightJson.lead;

    return highlightJson as HighlightJson;
  }

  protected parseResourceToJson(resource: Resource | undefined): ResourceJson | undefined {
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
      case ResourceType.image:
        resourceJson = {
          type: ResourceType.image,
          image: this.addImageResource(resource as ImageResource),
        };
        break;

      case ResourceType.imageLink:
        resourceJson = {
          type: ResourceType.imageLink,
          imageLink: this.addImageLinkResource(resource as ImageLinkResource),
        };
        break;

      case ResourceType.audio:
        resourceJson = {
          type: ResourceType.audio,
          audio: this.addAudioResource(resource as AudioResource),
        };
        break;

      case ResourceType.audioEmbed:
        resourceJson = {
          type: ResourceType.audioEmbed,
          audioEmbed: this.addAudioEmbedResource(resource as AudioEmbedResource),
        };
        break;

      case ResourceType.audioLink:
        resourceJson = {
          type: ResourceType.audioLink,
          audioLink: this.addAudioLinkResource(resource as AudioLinkResource),
        };
        break;

      case ResourceType.video:
        resourceJson = {
          type: ResourceType.video,
          video: this.addVideoResource(resource as VideoResource),
        };
        break;

      case ResourceType.videoEmbed:
        resourceJson = {
          type: ResourceType.videoEmbed,
          videoEmbed: this.addVideoEmbedResource(resource as VideoEmbedResource),
        };
        (resourceJson as VideoEmbedResourceWrapperJson).videoEmbed = this.addVideoLinkResource(
          resource as VideoLinkResource,
        );
        break;

      case ResourceType.videoLink:
        resourceJson = {
          type: ResourceType.videoLink,
          videoLink: this.addVideoLinkResource(resource as VideoLinkResource),
        };
        break;

      case ResourceType.stillImageFilm: {
        const stillImageFilmResource = resource as StillImageFilmResource;
        // Only write the resource if it has both an image and audio
        if (stillImageFilmResource.image.value != null && stillImageFilmResource.audio.value != null) {
          resourceJson = {
            type: ResourceType.stillImageFilm,
            image: this.addImageResource(stillImageFilmResource.image),
            audio: this.addAudioResource(stillImageFilmResource.audio),
          };
        }
        break;
      }

      case ResourceType.stillImageFilmEmbed:
        resourceJson = {
          type: ResourceType.stillImageFilmEmbed,
          stillImageFilmEmbed: this.addStillImageFilmEmbedResource(resource as StillImageFilmEmbedResource),
        };
        break;

      case ResourceType.stillImageFilmLink:
        resourceJson = {
          type: ResourceType.stillImageFilmLink,
          stillImageFilmLink: this.addStillImageFilmLinkResource(resource as StillImageFilmLinkResource),
        };
        break;

      case ResourceType.article:
        resourceJson = {
          type: ResourceType.article,
          article: this.addArticleResource(resource as ArticleResource),
        };
        break;

      case ResourceType.document:
        resourceJson = {
          type: ResourceType.document,
          document: this.addDocumentResource(resource as DocumentResource),
        };
        break;

      case ResourceType.documentEmbed:
        resourceJson = {
          type: ResourceType.documentEmbed,
          documentEmbed: this.addDocumentEmbedResource(resource as DocumentEmbedResource),
        };
        break;

      case ResourceType.documentLink:
        resourceJson = {
          type: ResourceType.documentLink,
          documentLink: this.addDocumentLinkResource(resource as DocumentLinkResource),
        };
        break;

      case ResourceType.documentDownload:
        resourceJson = {
          type: ResourceType.documentDownload,
          documentDownload: this.addDocumentDownloadResource(resource as DocumentDownloadResource),
        };
        break;

      case ResourceType.appLink:
        resourceJson = {
          type: ResourceType.appLink,
          appLink: this.addAppLinkResource(resource as AppLinkResource),
        };
        break;

      case ResourceType.websiteLink:
        resourceJson = {
          type: ResourceType.websiteLink,
          websiteLink: this.addWebsiteLinkResource(resource as WebsiteLinkResource),
        };
        break;

      default:
    }

    return resourceJson;
  }

  protected addImageResource(resource: ImageResource | string): ImageResourceJson {
    const resourceJson: Partial<ImageResourceJson> = {};

    if (StringUtils.isString(resource)) {
      const value = resource as string;
      resource = {
        type: ResourceType.image,
        value,
        format: UrlUtils.fileExtensionFromUrl(value),
        provider: UrlUtils.domainFromUrl(value),
      };
    }

    resource = resource as ImageResource; // Keep TS compiler happy

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.src = resource.value;
    if (resource.src1x != null) resourceJson.src1x = resource.src1x;
    if (resource.src2x != null) resourceJson.src2x = resource.src2x;
    if (resource.src3x != null) resourceJson.src3x = resource.src3x;
    if (resource.src4x != null) resourceJson.src4x = resource.src4x;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;
    resourceJson.alt = resource.alt ?? '';

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ImageResourceJson;
  }

  protected addImageLinkResource(resource: ImageLinkResource | string): ImageLinkResourceJson {
    const resourceJson: Partial<ImageLinkResourceJson> = {};

    if (StringUtils.isString(resource)) {
      const value = resource as string;
      resource = {
        type: ResourceType.imageLink,
        value,
        format: UrlUtils.fileExtensionFromUrl(value),
        provider: UrlUtils.domainFromUrl(value),
      };
    }

    resource = resource as ImageLinkResource; // Keep TS compiler happy

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    if (resource.src1x != null) resourceJson.src1x = resource.src1x;
    if (resource.src2x != null) resourceJson.src2x = resource.src2x;
    if (resource.src3x != null) resourceJson.src3x = resource.src3x;
    if (resource.src4x != null) resourceJson.src4x = resource.src4x;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;
    resourceJson.alt = resource.alt ?? '';

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ImageLinkResourceJson;
  }

  protected addAudioResource(resource: AudioResource): AudioResourceJson {
    const resourceJson: Partial<AudioResourceJson | AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.src = resource.value;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as AudioResourceJson;
  }

  protected addAudioEmbedResource(resource: AudioEmbedResource): AudioEmbedResourceJson {
    const resourceJson: Partial<AudioEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.src = resource.value;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as AudioEmbedResourceJson;
  }

  protected addAudioLinkResource(resource: AudioLinkResource): AudioLinkResourceJson {
    const resourceJson: Partial<AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson, true);

    return resourceJson as AudioLinkResourceJson;
  }

  protected addVideoResource(resource: VideoResource): VideoResourceJson {
    const resourceJson: Partial<VideoResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.src = resource.value;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoResourceJson;
  }

  protected addVideoEmbedResource(resource: VideoEmbedResource): VideoEmbedResourceJson {
    const resourceJson: Partial<VideoEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.src = resource.value;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoEmbedResourceJson;
  }

  protected addVideoLinkResource(resource: VideoLinkResource): VideoLinkResourceJson {
    const resourceJson: Partial<VideoLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoLinkResourceJson;
  }

  protected addStillImageFilmEmbedResource(resource: StillImageFilmEmbedResource): StillImageFilmEmbedResourceJson {
    const resourceJson: Partial<StillImageFilmEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as StillImageFilmEmbedResourceJson;
  }

  protected addStillImageFilmLinkResource(resource: StillImageFilmLinkResource): StillImageFilmLinkResourceJson {
    const resourceJson: Partial<StillImageFilmLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as StillImageFilmLinkResourceJson;
  }

  protected addArticleResource(resource: ArticleResource): ArticleResourceJson {
    const resourceJson: Partial<ArticleResourceJson | DocumentResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.body = resource.value;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected addDocumentResource(resource: DocumentResource): DocumentResourceJson {
    const resourceJson: Partial<DocumentResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentResourceJson;
  }

  protected addDocumentEmbedResource(resource: DocumentEmbedResource): DocumentEmbedResourceJson {
    const resourceJson: Partial<DocumentEmbedResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentEmbedResourceJson;
  }

  protected addDocumentLinkResource(resource: DocumentLinkResource): DocumentLinkResourceJson {
    const resourceJson: Partial<DocumentLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentLinkResourceJson;
  }

  protected addDocumentDownloadResource(resource: DocumentDownloadResource): DocumentDownloadResourceJson {
    const resourceJson: Partial<DocumentDownloadResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.value != null) resourceJson.url = resource.value;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as DocumentDownloadResourceJson;
  }

  protected addAppLinkResource(resource: AppLinkResource): AppLinkResourceJson {
    const resourceJson: Partial<AppLinkResourceJson> = {};

    // if (resource.format != null) resourceJson.format = resource.format;
    if (resource.value != null) resourceJson.url = resource.value;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as AppLinkResourceJson;
  }

  protected addWebsiteLinkResource(resource: WebsiteLinkResource): WebsiteLinkResourceJson {
    const resourceJson: Partial<WebsiteLinkResourceJson> = {};

    // if (resource.format != null) resourceJson.format = resource.format;
    if (resource.value != null) resourceJson.url = resource.value;
    if (resource.siteName != null) resourceJson.siteName = resource.siteName;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as WebsiteLinkResourceJson;
  }

  protected addGenericResourceProperties(resource: Resource, resourceJson: BaseResourceJson, noDefaults?: boolean) {
    if (noDefaults) {
      if (resource.license != null) resourceJson.license = resource.license ?? '';
      if (resource.copyright != null) resourceJson.copyright = resource.copyright ?? '';
      if (resource.provider != null) resourceJson.provider = resource.provider;
      if (resource.showInIndex != null) resourceJson.showInIndex = resource.showInIndex ?? false;
      if (resource.caption != null) resourceJson.caption = this.toTextAstOrString(resource.caption ?? '');
    } else {
      resourceJson.license = resource.license ?? '';
      resourceJson.copyright = resource.copyright ?? '';
      if (resource.provider != null) resourceJson.provider = resource.provider;
      resourceJson.showInIndex = resource.showInIndex ?? false;
      resourceJson.caption = this.toTextAstOrString(resource.caption ?? '');
    }

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected toItemLeadHintInstruction(item: ItemLeadHintInstructionNode): ItemLeadHintInstuction {
    return {
      item: this.toTextAstOrString(item.itemLead?.item ?? ''),
      lead: this.toTextAstOrString(item.itemLead?.lead ?? ''),
      hint: this.toTextAstOrString(item.hint ?? ''),
      instruction: this.toTextAstOrString(item.instruction ?? ''),
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
        : this.toTextAstOrString(defaultExample as string);
    } else {
      exampleValue = isBoolean ? BooleanUtils.toBoolean(example) : this.toTextAstOrString(example as string);
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
      if (!Array.isArray(values)) values = [values];

      if (Array.isArray(values) && values.length > 0) {
        if (singleWithoutArray && values.length >= 1) {
          target[name] = values[values.length - 1];
        } else {
          target[name] = values;
        }
      }
    }
  }

  /**
   * Get the bit type from any node
   *
   * @param route the route to the node
   * @returns the bit type
   */
  protected getBitType(route: NodeInfo[]): BitType | undefined {
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
   * @param route the route to the node
   * @returns the text format
   */
  protected getTextFormat(route: NodeInfo[]): TextFormatType | undefined {
    for (const node of route) {
      if (node.key === NodeType.bitsValue) {
        const n = node.value as Bit;
        return TextFormat.fromValue(n?.textFormat);
      }
    }

    return undefined;
  }

  /**
   * Convert parse a string to TextAst if required, otherwise just return the string as is.
   * @param text
   * @returns
   */
  protected toTextAstOrString(text: string | undefined, format: TextFormatType = TextFormat.bitmarkMinusMinus): Text {
    if (!text) undefined;

    if (this.options.textAsPlainText) {
      return text as string;
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
      type: bit.bitType.alias,
      format: bit.textFormat,

      // Properties
      id: undefined,
      externalId: undefined,
      spaceId: undefined,
      padletId: undefined,
      AIGenerated: undefined,
      releaseVersion: undefined,
      book: undefined,
      ageRange: undefined,
      language: undefined,
      computerLanguage: undefined,
      target: undefined,
      tag: undefined,
      icon: undefined,
      iconTag: undefined,
      colorTag: undefined,
      flashcardSet: undefined,
      subtype: undefined,
      coverImage: undefined,
      publisher: undefined,
      publications: undefined,
      author: undefined,
      subject: undefined,
      date: undefined,
      location: undefined,
      theme: undefined,
      kind: undefined,
      action: undefined,
      thumbImage: undefined,
      focusX: undefined,
      focusY: undefined,
      deeplink: undefined,
      externalLink: undefined,
      externalLinkText: undefined,
      videoCallLink: undefined,
      duration: undefined,
      list: undefined,
      textReference: undefined,
      isTracked: undefined,
      isInfoOnly: undefined,
      labelTrue: undefined,
      labelFalse: undefined,
      quotedPerson: undefined,
      partialAnswer: undefined,

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
      hint: undefined,
      instruction: undefined,

      // Example
      isExample: undefined,
      example: undefined,

      // Partner .conversion-xxx only
      partner: undefined,

      // Marks (config)
      marks: undefined,

      // Extra Properties
      extraProperties: undefined,

      // Body
      body: undefined,

      // Resource
      resource: undefined,

      // Children
      statement: undefined,
      isCorrect: undefined,
      sampleSolution: undefined,
      elements: undefined,
      statements: undefined,
      responses: undefined,
      quizzes: undefined,
      heading: undefined,
      pairs: undefined,
      matrix: undefined,
      choices: undefined,
      questions: undefined,

      // Placeholders
      placeholders: undefined,

      // Footer
      footer: undefined,
    };

    // Add the resource template if there should be a resource (indicated by resourceType) but there is none defined.
    // if (bit.resourceType && !bitJson.resource) {
    //   const jsonKey = ResourceType.keyFromValue(bit.resourceType);
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
    const bitType = BitTypeUtils.getBitType(bitJson.type);
    const plainText = this.options.textAsPlainText;

    // Clear 'item' which may be an empty string if 'lead' was set but item not
    // Only necessary because '.article' does not include a default value for 'item'
    // which is totally inconsistent, but maybe is wanted.
    if (!bitJson.item) bitJson.item = undefined;

    // Add default properties to the bit.
    // NOTE: Not all bits have the same default properties.
    //       The properties used in the antlr parser are a bit random sometimes?
    switch (bitType.root) {
      case RootBitType._error:
        break;

      case RootBitType.article:
      case RootBitType.sampleSolution:
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      default: // Most bits have these defaults, but there are special cases (not sure if that is by error or design)
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = null;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;

        // Special case for 'ai' bits
        if (
          bitType.alias === AliasBitType.articleAi ||
          bitType.alias === AliasBitType.noteAi ||
          bitType.alias === AliasBitType.summaryAi
        ) {
          if (bitJson.AIGenerated == null) bitJson.AIGenerated = true;
        }
        break;

      // Default, but with no 'example' at the bit level.
      case RootBitType.cloze:
      case RootBitType.multipleChoice1:
      case RootBitType.multipleResponse1:
      case RootBitType.multipleChoiceText:
      case RootBitType.highlightText:
      case RootBitType.clozeAndMultipleChoiceText:
      case RootBitType.sequence:
      case RootBitType.mark:
      case RootBitType.flashcard:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      // Default with a card (and hence a footer possibility)
      case RootBitType.multipleChoice:
      case RootBitType.multipleResponse:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        if (bitJson.footer == null) bitJson.footer = this.textDefault;
        break;

      case RootBitType.essay:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = null;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        if (bitJson.partialAnswer == null) bitJson.partialAnswer = '';
        // if (bitJson.sampleSolution == null) bitJson.sampleSolution = '';
        break;

      case RootBitType.trueFalse1:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.lead == null) bitJson.lead = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = null;
        if (bitJson.isCorrect == null) bitJson.isCorrect = false;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      case RootBitType.trueFalse:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.lead == null) bitJson.lead = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.labelFalse == null) bitJson.labelFalse = '';
        if (bitJson.labelTrue == null) bitJson.labelTrue = '';
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      case RootBitType.chapter:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = null;
        if (bitJson.toc == null) bitJson.toc = true; // Always set on chapter bits?
        if (bitJson.progress == null) bitJson.progress = true; // Always set on chapter bits
        if (bitJson.level == null) bitJson.level = 1; // Set level 1 if none set (makes no sense, but in ANTLR parser)
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      case RootBitType.interview:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.instruction == null) bitJson.instruction = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        if (bitJson.footer == null) bitJson.footer = this.textDefault;
        if (bitJson.questions == null) bitJson.questions = [];
        break;

      case RootBitType.match:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.heading == null) bitJson.heading = {} as HeadingJson;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      case RootBitType.matchMatrix:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;

      case RootBitType.learningPathBook:
      case RootBitType.learningPathExternalLink:
      case RootBitType.learningPathVideoCall:
        if (bitJson.item == null) bitJson.item = this.textDefault;
        if (bitJson.hint == null) bitJson.hint = this.textDefault;
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = null;
        if (bitJson.isTracked == null) bitJson.isTracked = true;
        if (bitJson.isInfoOnly == null) bitJson.isInfoOnly = false;
        if (bitJson.body == null) bitJson.body = this.bodyDefault;
        break;
    }

    // Remove unwanted properties

    // Properties
    if (bitJson.id == null) delete bitJson.id;
    if (bitJson.externalId == null) delete bitJson.externalId;
    if (bitJson.spaceId == null) delete bitJson.spaceId;
    if (bitJson.padletId == null) delete bitJson.padletId;
    if (bitJson.AIGenerated == null) delete bitJson.AIGenerated;
    if (bitJson.releaseVersion == null) delete bitJson.releaseVersion;
    if (bitJson.book == null) delete bitJson.book;
    if (bitJson.ageRange == null) delete bitJson.ageRange;
    if (bitJson.language == null) delete bitJson.language;
    if (bitJson.computerLanguage == null) delete bitJson.computerLanguage;
    if (bitJson.target == null) delete bitJson.target;
    if (bitJson.tag == null) delete bitJson.tag;
    if (bitJson.icon == null) delete bitJson.icon;
    if (bitJson.iconTag == null) delete bitJson.iconTag;
    if (bitJson.colorTag == null) delete bitJson.colorTag;
    if (bitJson.flashcardSet == null) delete bitJson.flashcardSet;
    if (bitJson.subtype == null) delete bitJson.subtype;
    if (bitJson.coverImage == null) delete bitJson.coverImage;
    if (bitJson.publisher == null) delete bitJson.publisher;
    if (bitJson.publications == null) delete bitJson.publications;
    if (bitJson.author == null) delete bitJson.author;
    if (bitJson.subject == null) delete bitJson.subject;
    if (bitJson.date == null) delete bitJson.date;
    if (bitJson.location == null) delete bitJson.location;
    if (bitJson.theme == null) delete bitJson.theme;
    if (bitJson.kind == null) delete bitJson.kind;
    if (bitJson.action == null) delete bitJson.action;
    if (bitJson.thumbImage == null) delete bitJson.thumbImage;
    if (bitJson.deeplink == null) delete bitJson.deeplink;
    if (bitJson.externalLink == null) delete bitJson.externalLink;
    if (bitJson.externalLinkText == null) delete bitJson.externalLinkText;
    if (bitJson.videoCallLink == null) delete bitJson.videoCallLink;
    if (bitJson.duration == null) delete bitJson.duration;
    if (bitJson.list == null) delete bitJson.list;
    if (bitJson.textReference == null) delete bitJson.textReference;
    if (bitJson.isTracked == null) delete bitJson.isTracked;
    if (bitJson.isInfoOnly == null) delete bitJson.isInfoOnly;
    if (bitJson.labelTrue == null) delete bitJson.labelTrue;
    if (bitJson.labelFalse == null) delete bitJson.labelFalse;
    if (bitJson.quotedPerson == null) delete bitJson.quotedPerson;

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
    if (bitJson.body == null) delete bitJson.body;

    // Placeholders
    if (bitJson.placeholders == null || Object.keys(bitJson.placeholders).length === 0) delete bitJson.placeholders;

    // Resource
    if (bitJson.resource == null) delete bitJson.resource;

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
    if (bitJson.choices == null) delete bitJson.choices;
    if (bitJson.questions == null) delete bitJson.questions;

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
