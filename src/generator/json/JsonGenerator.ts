import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeType } from '../../model/ast/NodeType';
import { ImageLinkResource } from '../../model/ast/Nodes';
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
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';
import { ResourceType } from '../../model/enum/ResourceType';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { GapJson, HighlightJson, HighlightTextJson, SelectJson, SelectOptionJson } from '../../model/json/BodyBitJson';
import { ParserInfo } from '../../model/parser/ParserInfo';
import { ArrayUtils } from '../../utils/ArrayUtils';
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
  HeadingJson,
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
   * Include extra properties in the output.
   *
   * If not set or false, extra properties will NOT be included in the JSON output
   * It true, extra properties will be included in the JSON output.
   *
   */
  includeExtraProperties?: boolean;

  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
}

interface ItemLeadHintInstructionNode {
  itemLead?: ItemLead;
  hint?: string;
  instruction?: string;
}

interface ItemLeadHintInstuction {
  item: string;
  lead: string;
  hint: string;
  instruction: string;
}

interface ExampleAndIsExample {
  isExample: boolean;
  example: string;
}

/**
 * Generate bitmark JSON from a bitmark AST
 *
 * TODO: NOT IMPLEMENTED!
 */
class JsonGenerator implements Generator<void>, AstWalkCallbacks {
  protected ast = new Ast();
  private options: JsonOptions;
  private jsonPrettifySpace: number | undefined;
  private writer: Writer;
  private printed = false;

  // Variables used by the parser
  private json!: Partial<BitWrapperJson>[];
  private bitWrapperJson!: Partial<BitWrapperJson>;
  private bitJson!: Partial<BitJson>;
  private placeholderIndex = 0;

  /**
   * Generate bitmark JSON from a bitmark AST
   *
   * @param writer - destination for the output
   * @param options - bitmark generation options
   */
  constructor(writer: Writer, options?: JsonOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
    this.jsonPrettifySpace = this.options.prettify === true ? 2 : this.options.prettify || undefined;

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

    // Write the JSON object to file
    this.write(JSON.stringify(this.json, null, this.jsonPrettifySpace));

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

  protected enter_bitmark(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // Reset the JSON
    this.json = [];
  }

  // bitmark -> bits

  // bitmark -> bits -> bitsValue

  protected enter_bitsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    // Reset
    this.placeholderIndex = 0;

    this.bitWrapperJson = {
      //
    };
    this.json.push(this.bitWrapperJson);

    this.bitJson = this.createBitJson(bit);
    this.bitWrapperJson.bit = this.bitJson as BitJson;
  }

  protected exit_bitsValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // Clean up the bit JSON, removing any unwanted values
    this.cleanAndSetDefaultsForBitJson(this.bitJson);
  }

  // bitmark -> bits -> bitsValue -> example

  protected enter_example(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const example = node.value as boolean | undefined;

    // Ignore example that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (Array.isArray(example) && example.length > 0) {
      this.addProperty(this.bitJson, 'isExample', true, true);
      let exampleStr = example[example.length - 1];
      exampleStr = (StringUtils.isString(exampleStr) ? exampleStr : '') ?? '';
      this.addProperty(this.bitJson, PropertyKey.example, exampleStr, true);
    }
  }

  // bitmark -> bits -> bitsValue -> partner

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

  // bitmark -> bits -> bitsValue -> sampleSolution

  protected enter_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'sampleSolution', node.value, true);
  }

  // bitmark -> bits -> bitsValue -> itemLead

  protected enter_itemLead(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    const { item, lead } = itemLead;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (item != null) this.addProperty(this.bitJson, 'item', item ?? '', true);
    if (lead != null) this.addProperty(this.bitJson, 'lead', lead ?? '', true);
  }

  // bitmark -> bits -> bitsValue -> extraProperties

  protected enter_extraProperties(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const extraProperties = node.value as ExtraProperties | undefined;

    if (this.options.includeExtraProperties && extraProperties) {
      for (const [key, values] of Object.entries(extraProperties)) {
        let k = key;
        if (Object.prototype.hasOwnProperty.call(this.bitJson, key)) {
          k = `_${key}`;
        }
        this.addProperty(this.bitJson, k, values);
      }
    }
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> gap

  protected enter_gap(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const gap = node.value as Gap['gap'];

    // Ensure placeholders exists
    if (!this.bitJson.placeholders) this.bitJson.placeholders = {};

    // Ensure body exists
    if (this.bitJson.body == null) this.bitJson.body = '';

    // Add the placeholder to the body
    const placeholder = `{${this.placeholderIndex}}`;
    this.bitJson.body += placeholder;
    this.placeholderIndex++;

    // Create the gap
    const gapJson: Partial<GapJson> = {
      type: 'gap',
      solutions: gap.solutions,
      ...this.toItemLeadHintInstruction(gap),
      ...this.toExampleAndIsExample(gap.example),
      isCaseSensitive: gap.isCaseSensitive ?? true,
      //
    };

    // Remove unwanted properties
    if (!gapJson.lead) delete gapJson.lead;

    // Add the gap to the placeholders
    this.bitJson.placeholders[placeholder] = gapJson as GapJson;
  }

  // bitmark -> bits -> bitsValue -> elements

  protected enter_elements(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const elements = node.value as string[];

    // Ignore elements that are not at the bit level as they are handled elsewhere as quizzes
    // if (parent?.key !== NodeType.bitsValue) return;

    if (elements && elements.length > 0) {
      this.bitJson.elements = elements;
    }
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> highlight

  protected enter_highlight(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const highlight = node.value as Highlight['highlight'];

    // Ensure placeholders exists
    if (!this.bitJson.placeholders) this.bitJson.placeholders = {};

    // Ensure body exists
    if (this.bitJson.body == null) this.bitJson.body = '';

    // Add the placeholder to the body
    const placeholder = `{${this.placeholderIndex}}`;
    this.bitJson.body += placeholder;
    this.placeholderIndex++;

    // Create the select options
    const texts: HighlightTextJson[] = [];
    for (const text of highlight.texts) {
      const textJson: Partial<HighlightTextJson> = {
        text: text.text,
        isCorrect: text.isCorrect ?? false,
        isHighlighted: text.isHighlighted ?? false,
        ...this.toItemLeadHintInstruction(text),
        ...this.toExampleAndIsExample(text.example),
      };

      // Remove unwanted properties
      if (!textJson.item) delete textJson.item;
      if (!textJson.lead) delete textJson.lead;
      if (!textJson.hint) delete textJson.hint;
      if (!textJson.example) delete textJson.example;
      if (!textJson.isExample) delete textJson.isExample;
      if (!textJson.isCaseSensitive) delete textJson.isCaseSensitive;

      texts.push(textJson as HighlightTextJson);
    }

    // Create the select
    const highlightJson: Partial<HighlightJson> = {
      type: 'highlight',
      prefix: highlight.prefix ?? '',
      texts,
      postfix: highlight.postfix ?? '',
      ...this.toItemLeadHintInstruction(highlight),
      ...this.toExampleAndIsExample(highlight.example),
    };

    // Remove unwanted properties
    if (!highlightJson.lead) delete highlightJson.lead;

    // Add the gap to the placeholders
    this.bitJson.placeholders[placeholder] = highlightJson as HighlightJson;
  }

  // bitmark -> bits -> bitsValue -> body -> bodyValue -> select

  protected enter_select(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const select = node.value as Select['select'];

    // Ensure placeholders exists
    if (!this.bitJson.placeholders) this.bitJson.placeholders = {};

    // Ensure body exists
    if (this.bitJson.body == null) this.bitJson.body = '';

    // Add the placeholder to the body
    const placeholder = `{${this.placeholderIndex}}`;
    this.bitJson.body += placeholder;
    this.placeholderIndex++;

    // Create the select options
    const options: SelectOptionJson[] = [];
    for (const option of select.options) {
      const optionJson: Partial<SelectOptionJson> = {
        text: option.text,
        isCorrect: option.isCorrect ?? false,
        ...this.toItemLeadHintInstruction(option),
        ...this.toExampleAndIsExample(option.example),
      };

      // Remove unwanted properties
      if (!optionJson.item) delete optionJson.item;
      if (!optionJson.lead) delete optionJson.lead;
      if (!optionJson.instruction) delete optionJson.instruction;
      if (!optionJson.example) delete optionJson.example;
      if (!optionJson.isExample) delete optionJson.isExample;
      if (!optionJson.isCaseSensitive) delete optionJson.isCaseSensitive;

      options.push(optionJson as SelectOptionJson);
    }

    // Create the select
    const selectJson: Partial<SelectJson> = {
      type: 'select',
      prefix: select.prefix ?? '',
      options,
      postfix: select.postfix ?? '',
      ...this.toItemLeadHintInstruction(select),
      ...this.toExampleAndIsExample(select.example),
    };

    // Remove unwanted properties
    if (!selectJson.lead) delete selectJson.lead;

    // Add the gap to the placeholders
    this.bitJson.placeholders[placeholder] = selectJson as SelectJson;
  }

  // bitmark -> bits -> bitsValue -> statement

  protected enter_statement(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statement = node.value as Statement;

    // Ignore statement that is not at the bit level as it is handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (statement) {
      this.bitJson.statement = statement.text ?? '';
      this.bitJson.isCorrect = statement.isCorrect ?? false;
    }
  }

  // bitmark -> bits -> bitsValue -> statements

  protected enter_statements(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statements = node.value as Statement[];

    // Ignore choices that are not at the bit level as they are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    const statementsJson: StatementJson[] = [];
    if (statements) {
      for (const s of statements) {
        // Create the statement
        const statementJson: Partial<StatementJson> = {
          statement: s.text ?? '',
          isCorrect: s.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(s),
          ...this.toExampleAndIsExample(s.example),
        };

        // Delete unwanted properties
        if (s.itemLead?.item == null) delete statementJson.item;
        if (s.itemLead?.lead == null) delete statementJson.lead;
        if (s?.hint == null) delete statementJson.hint;
        if (s?.instruction == null) delete statementJson.instruction;
        if (s?.example == null) delete statementJson.example;

        statementsJson.push(statementJson as StatementJson);
      }
    }

    if (statementsJson.length > 0) {
      this.bitJson.statements = statementsJson;
    }
  }

  // bitmark -> bits -> bitsValue -> choices

  protected enter_choices(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const choices = node.value as Choice[];

    // Ignore choices that are not at the bit level as they are handled elsewhere as quizzes
    if (parent?.key !== NodeType.bitsValue) return;

    const choicesJson: ChoiceJson[] = [];
    if (choices) {
      for (const c of choices) {
        // Create the choice
        const choiceJson: Partial<ChoiceJson> = {
          choice: c.text ?? '',
          isCorrect: c.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(c),
          // ...this.toExampleAndIsExample(c.example),
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

  // bitmark -> bits -> bitsValue -> responses

  protected enter_responses(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const responses = node.value as Response[];

    // Ignore responses that are not at the bit level as they are handled elsewhere as quizzes
    if (parent?.key !== NodeType.bitsValue) return;

    const responsesJson: ResponseJson[] = [];
    if (responses) {
      for (const r of responses) {
        // Create the response
        const responseJson: Partial<ResponseJson> = {
          response: r.text ?? '',
          isCorrect: r.isCorrect ?? false,
          ...this.toItemLeadHintInstruction(r),
          // ...this.toExampleAndIsExample(r.example),
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

  // bitmark -> bits -> bitsValue -> quizzes

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
              // ...this.toExampleAndIsExample(c.example),
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete choiceJson.lead;

            choicesJson.push(choiceJson as ChoiceJson);
          }
        }

        // Responses
        const responsesJson: ResponseJson[] = [];
        if (q.responses) {
          for (const c of q.responses) {
            // Create the choice
            const responseJson: Partial<ResponseJson> = {
              response: c.text ?? '',
              isCorrect: c.isCorrect ?? false,
              ...this.toItemLeadHintInstruction(c),
              // ...this.toExampleAndIsExample(c.example),
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete responseJson.lead;

            responsesJson.push(responseJson as ResponseJson);
          }
        }

        // Create the quiz
        const quizJson: Partial<QuizJson> = {
          ...this.toItemLeadHintInstruction(q),
          ...this.toExampleAndIsExample(q.example),
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

  // bitmark -> bits -> bitsValue -> heading

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
      headingJson.forValues = heading.forValues;
    }

    this.bitJson.heading = headingJson as HeadingJson;
  }

  // bitmark -> bits -> bitsValue -> pairs

  protected enter_pairs(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const pairs = node.value as Pair[];
    const pairsJson: PairJson[] = [];

    if (pairs) {
      for (const p of pairs) {
        // Create the question
        const pairJson: Partial<PairJson> = {
          key: p.key ?? '',
          keyAudio: p.keyAudio ? this.addAudioResource(p.keyAudio) : undefined,
          keyImage: p.keyImage ? this.addImageResource(p.keyImage) : undefined,
          values: p.values ?? [],
          ...this.toItemLeadHintInstruction(p),
          ...this.toExampleAndIsExample(p.example),
          isCaseSensitive: p.isCaseSensitive ?? true,
          isLongAnswer: !p.isShortAnswer ?? false,
          //
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

  // bitmark -> bits -> bitsValue -> matrix

  protected enter_matrix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const matrix = node.value as Matrix[];
    const matrixJsonArray: MatrixJson[] = [];

    if (matrix) {
      for (const m of matrix) {
        // Choices
        const matrixCellsJson: MatrixCellJson[] = [];
        if (m.cells) {
          for (const c of m.cells) {
            // Create the choice
            const matrixCellJson: Partial<MatrixCellJson> = {
              values: c.values ?? [],
              ...this.toItemLeadHintInstruction(c),
              ...this.toExampleAndIsExample(c.example),
            };

            // Delete unwanted properties
            if (c.itemLead?.lead == null) delete matrixCellJson.lead;
            if (c.hint == null) delete matrixCellJson.hint;
            if (c.example == null) delete matrixCellJson.isExample;
            if (c.example == null) delete matrixCellJson.example;

            matrixCellsJson.push(matrixCellJson as MatrixCellJson);
          }
        }

        // Create the matrix
        const matrixJson: Partial<MatrixJson> = {
          key: m.key ?? '',
          cells: matrixCellsJson ?? [],
          ...this.toItemLeadHintInstruction(m),
          ...this.toExampleAndIsExample(m.example),
          isCaseSensitive: m.isCaseSensitive ?? true,
          isLongAnswer: !m.isShortAnswer ?? false,
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

  // bitmark -> bits -> bitsValue -> questions

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
          ...this.toExampleAndIsExample(q.example),
          // isCaseSensitive: q.isCaseSensitive ?? true,
          isShortAnswer: q.isShortAnswer ?? true,
          //
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

  // bitmark -> bits -> bitsValue -> botResponses

  protected enter_botResponses(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const botResponses = node.value as BotResponse[];

    // Ignore responses that are not at the bit level as they are handled elsewhere as quizzes
    if (parent?.key !== NodeType.bitsValue) return;

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

  // bitmark -> bits -> bitsValue -> resource

  protected enter_resource(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;

    // This is a resource - handle it with the common code
    this.bitJson.resource = this.parseResourceToJson(resource);
  }

  //
  // Terminal nodes (leaves)
  //

  // bitmark -> bits -> bitsValue -> title

  protected leaf_title(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'title', node.value, true);
  }

  //  bitmark -> bits -> bitsValue -> subtitle

  protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'subtitle', node.value, true);
  }

  // //  bitmark -> bits -> bitsValue -> level

  protected leaf_level(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'level', node.value ?? 1, true);
  }

  // bitmark -> bits -> bitsValue -> book

  protected leaf_book(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'book', node.value, true);
  }

  //  bitmark -> bits -> bitsValue -> anchor

  protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'anchor', node.value, true);
  }

  //  bitmark -> bits -> bitsValue -> reference

  protected leaf_reference(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'reference', node.value, true);
  }

  //  bitmark -> bits -> bitsValue -> referenceEnd

  protected leaf_referenceEnd(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'referenceEnd', node.value, true);
  }

  //  bitmark -> bits -> bitsValue ->  * -> hint

  protected leaf_hint(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const hint = node.value as string;

    // Ignore hint that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (hint != null) this.addProperty(this.bitJson, 'hint', hint ?? '', true);
  }

  // bitmark -> bits -> bitsValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const instruction = node.value as string;

    // Ignore instruction that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (instruction != null) this.addProperty(this.bitJson, 'instruction', instruction ?? '', true);
  }

  // bitmark -> bits -> body -> bodyValue -> bodyText

  protected leaf_bodyText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      if (this.bitJson.body == null) this.bitJson.body = '';
      this.bitJson.body += node.value;
    }
  }

  // bitmark -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      if (this.bitJson.footer == null) this.bitJson.footer = '';
      this.bitJson.footer += node.value;
    }
  }

  // bitmark -> bits -> bitsValue -> bitmark

  protected leaf_bitmark(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bitmark = node.value as string | undefined;
    if (bitmark) this.bitWrapperJson.bitmark = bitmark;
  }

  // bitmark -> bits -> bitsValue -> parser

  protected enter_parser(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const parser = node.value as ParserInfo | undefined;
    if (parser) {
      // Warnings and Errors don't need parsing from AST
      const version = parser.version;
      const warnings = parser.warnings;
      const errors = parser.errors;

      // Parse resources to JSON from AST
      let excessResources: ResourceJson[] | undefined;
      if (Array.isArray(parser.excessResources) && parser.excessResources.length > 0) {
        excessResources = [];
        for (const r of parser.excessResources) {
          const rJson = this.parseResourceToJson(r);
          if (rJson) excessResources.push(rJson);
        }
      }

      if (parent?.key === NodeType.bitsValue) {
        // Bit level parser information
        this.bitWrapperJson.parser = {
          version,
          warnings,
          errors,
          excessResources,
        };
      } else {
        // Top level parser information (not specific to a bit)
        // TODO - not sure where this error can be written
        // this.bitWrapperJson.parser = {
        //   errors,
        // };
      }
    }
  }

  // bitmark -> errors

  // protected enter_errors(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
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

  // //
  // // WRITE FUNCTIONS
  // //

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
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
      if (resource.caption != null) resourceJson.caption = resource.caption ?? '';
    } else {
      resourceJson.license = resource.license ?? '';
      resourceJson.copyright = resource.copyright ?? '';
      if (resource.provider != null) resourceJson.provider = resource.provider;
      resourceJson.showInIndex = resource.showInIndex ?? false;
      resourceJson.caption = resource.caption ?? '';
    }

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected toItemLeadHintInstruction(item: ItemLeadHintInstructionNode): ItemLeadHintInstuction {
    return {
      item: item.itemLead?.item ?? '',
      lead: item.itemLead?.lead ?? '',
      hint: item.hint ?? '',
      instruction: item.instruction ?? '',
    };
  }

  protected toExampleAndIsExample(example: Example | undefined): ExampleAndIsExample {
    return {
      isExample: !!example,
      example: StringUtils.isString(example) ? (example as string) : '',
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

      // Properties
      id: undefined,
      externalId: undefined,
      padletId: undefined,
      releaseVersion: undefined,
      book: undefined,
      ageRange: undefined,
      language: undefined,
      computerLanguage: undefined,
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
      example: undefined,
      isExample: undefined,

      // Partner .conversion-xxx only
      partner: undefined,

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
    // Clear 'item' which may be an empty string if 'lead' was set but item not
    // Only necessary because '.article' does not include a default value for 'item'
    // which is totally inconsistent, but maybe is wanted.
    if (!bitJson.item) bitJson.item = undefined;

    // Add default properties to the bit.
    // NOTE: Not all bits have the same default properties.
    //       The properties used in the antlr parser are a bit random sometimes?
    switch (bitJson.type) {
      case BitType._error:
        break;

      case BitType.article:
      case BitType.highlightText:
      case BitType.message:
      case BitType.sampleSolution:
      case BitType.page:
      case BitType.statement:
        if (bitJson.body == null) bitJson.body = '';
        break;

      default: // Most bits have these defaults, but there are special cases (not sure if that is by error or design)
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.multipleChoice1:
      case BitType.multipleResponse1:
      case BitType.sequence:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.instruction == null) bitJson.instruction = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.essay:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.instruction == null) bitJson.instruction = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.body == null) bitJson.body = '';
        if (bitJson.partialAnswer == null) bitJson.partialAnswer = '';
        break;

      case BitType.trueFalse1:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.lead == null) bitJson.lead = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.instruction == null) bitJson.instruction = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.isCorrect == null) bitJson.isCorrect = false;
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.trueFalse:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.lead == null) bitJson.lead = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.instruction == null) bitJson.instruction = '';
        if (bitJson.labelFalse == null) bitJson.labelFalse = '';
        if (bitJson.labelTrue == null) bitJson.labelTrue = '';
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.chapter:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.toc == null) bitJson.toc = true; // Always set on chapter bits?
        if (bitJson.progress == null) bitJson.progress = true; // Always set on chapter bits
        if (bitJson.level == null) bitJson.level = 1; // Set level 1 if none set (makes no sense, but in ANTLR parser)
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.multipleChoice:
      case BitType.multipleResponse:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.instruction == null) bitJson.instruction = '';
        if (bitJson.body == null) bitJson.body = '';
        if (bitJson.footer == null) bitJson.footer = '';
        break;

      case BitType.interview:
      case BitType.interviewInstructionGrouped:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.instruction == null) bitJson.instruction = '';
        if (bitJson.body == null) bitJson.body = '';
        if (bitJson.footer == null) bitJson.footer = '';
        if (bitJson.questions == null) bitJson.questions = [];
        break;

      case BitType.match:
      case BitType.matchReverse:
      case BitType.matchSolutionGrouped:
      case BitType.matchAll:
      case BitType.matchAllReverse:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.heading == null) bitJson.heading = {} as HeadingJson;
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.matchMatrix:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.learningPathBook:
      case BitType.learningPathBotTraining:
      case BitType.learningPathClassroomEvent:
      case BitType.learningPathClassroomTraining:
      case BitType.learningPathClosing:
      case BitType.learningPathExternalLink:
      case BitType.learningPathFeedback:
      case BitType.learningPathLearningGoal:
      case BitType.learningPathLti:
      case BitType.learningPathSign:
      case BitType.learningPathStep:
      case BitType.learningPathVideoCall:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.isTracked == null) bitJson.isTracked = true;
        if (bitJson.isInfoOnly == null) bitJson.isInfoOnly = false;
        if (bitJson.body == null) bitJson.body = '';
        break;
    }

    // Remove unwanted properties

    // Properties
    if (bitJson.id == null) delete bitJson.id;
    if (bitJson.externalId == null) delete bitJson.externalId;
    if (bitJson.padletId == null) delete bitJson.padletId;
    if (bitJson.releaseVersion == null) delete bitJson.releaseVersion;
    if (bitJson.book == null) delete bitJson.book;
    if (bitJson.ageRange == null) delete bitJson.ageRange;
    if (bitJson.language == null) delete bitJson.language;
    if (bitJson.computerLanguage == null) delete bitJson.computerLanguage;
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
    if (bitJson.example == null) delete bitJson.example;
    if (bitJson.isExample == null) delete bitJson.isExample;

    // Extra Properties
    if (bitJson.extraProperties == null) delete bitJson.extraProperties;

    // Body
    if (bitJson.body == null) delete bitJson.body;

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
    if (bitJson.placeholders == null) delete bitJson.placeholders;

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
