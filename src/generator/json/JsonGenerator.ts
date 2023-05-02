import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeType } from '../../model/ast/NodeType';
import { ExtraProperties, Matrix, Pair, Question, Quiz } from '../../model/ast/Nodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { GapJson, SelectJson, SelectOptionJson } from '../../model/json/BodyBitJson';
import { ParserError } from '../../model/parser/ParserError';
import { StringUtils } from '../../utils/StringUtils';
import { UrlUtils } from '../../utils/UrlUtils';
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
  Heading,
  Body,
  ImageResource,
  Resource,
  ArticleResource,
  Gap,
  AudioResource,
  VideoResource,
  AppResource,
  WebsiteLinkResource,
  Select,
} from '../../model/ast/Nodes';
import {
  BitJson,
  ChoiceJson,
  HeadingJson,
  MatrixCellJson,
  MatrixJson,
  PairJson,
  QuestionJson,
  QuizJson,
  ResponseJson,
  StatementJson,
} from '../../model/json/BitJson';
import {
  AppLikeResourceJson,
  AppLinkResourceJson,
  AppLinkResourceWrapperJson,
  AppResourceJson,
  AppResourceWrapperJson,
  ArticleLikeResourceJson,
  ArticleLinkResourceWrapperJson,
  ArticleResourceJson,
  ArticleResourceWrapperJson,
  AudioLinkResourceJson,
  AudioLinkResourceWrapperJson,
  AudioResourceJson,
  AudioResourceWrapperJson,
  BaseResourceJson,
  DocumentLinkResourceJson,
  DocumentLinkResourceWrapperJson,
  DocumentResourceJson,
  DocumentResourceWrapperJson,
  ImageLinkResourceJson,
  ImageLinkResourceWrapperJson,
  ImageResourceJson,
  ImageResourceWrapperJson,
  ResourceJson,
  ResourceWrapperJson,
  StillImageFilmLinkResourceWrapperJson,
  StillImageFilmResourceWrapperJson,
  VideoLinkResourceJson,
  VideoLinkResourceWrapperJson,
  VideoResourceJson,
  VideoResourceWrapperJson,
  WebsiteLinkResourceJson,
  WebsiteLinkResourceWrapperJson,
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
   * If not set, JSON will not be prettified.
   * If true, JSON will be prettified with an indent of 2.
   * If a positive integer, JSON will be prettified with an indent of this number.
   */
  prettify?: boolean | number;

  /**
   * [development only]
   * Generate debug information in the output.
   */
  debugGenerationInline?: boolean;
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

  // bitmark -> bits -> bitValue

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

  // bitmark -> bits -> bitValue -> ids

  protected enter_ids(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'id', node.value);
  }

  // bitmark -> bits -> bitValue -> externalIds

  protected enter_externalIds(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'externalId', node.value);
  }

  // bitmark -> bits -> bitValue -> ageRanges

  protected enter_ageRanges(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'ageRange', node.value);
  }

  // bitmark -> bits -> bitValue -> languages

  protected enter_languages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'language', node.value);
  }

  // bitmark -> bits -> bitValue -> computerLanguages

  protected enter_computerLanguages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'computerLanguage', node.value);
  }

  // bitmark -> bits -> bitValue -> coverImages

  protected enter_coverImages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'coverImage', node.value);
  }

  // bitmark -> bits -> bitValue -> publishers

  protected enter_publishers(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'publisher', node.value);
  }

  // bitmark -> bits -> bitValue -> publications

  protected enter_publications(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'publications', node.value);
  }

  // bitmark -> bits -> bitValue -> authors

  protected enter_authors(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'author', node.value);
  }

  // bitmark -> bits -> bitValue -> dates

  protected enter_dates(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'date', node.value);
  }

  // bitmark -> bits -> bitValue -> locations

  protected enter_locations(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'location', node.value);
  }

  // bitmark -> bits -> bitValue -> themes

  protected enter_themes(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'theme', node.value);
  }

  // bitmark -> bits -> bitValue -> kinds

  protected enter_kinds(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'kind', node.value);
  }

  // bitmark -> bits -> bitValue -> actions

  protected enter_actions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'action', node.value, true);
  }

  // bitmark -> bits -> bitValue -> thumbImages

  protected enter_thumbImages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'thumbImage', node.value);
  }

  // bitmark -> bits -> bitValue -> durations

  protected enter_durations(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'duration', node.value);
  }

  // bitmark -> bits -> bitValue -> deepLinks

  protected enter_deepLinks(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'deeplink', node.value);
  }

  // bitmark -> bits -> bitValue -> videoCallLinks

  protected enter_videoCallLinks(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'videoCallLink', node.value);
  }

  // bitmark -> bits -> bitValue -> bots

  protected enter_bots(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'bot', node.value);
  }

  //  bitmark -> bits -> referenceProperties

  protected enter_referenceProperties(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'reference', node.value);
  }

  // bitmark -> bits -> bitValue -> lists

  protected enter_lists(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'list', node.value);
  }

  // bitmark -> bits -> bitValue -> sampleSolutions

  protected enter_sampleSolutions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'sampleSolution', node.value);
  }

  // bitmark -> bits -> bitValue -> itemLead

  protected enter_itemLead(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    const { item, lead } = itemLead;

    // Ignore item / lead that are not at the bit level as they are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (item != null) this.addProperty(this.bitJson, 'item', item ?? '', true);
    if (lead != null) this.addProperty(this.bitJson, 'lead', lead ?? '', true);
  }

  // bitmark -> bits -> bitValue -> extraProperties

  protected enter_extraProperties(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const extraProperties = node.value as ExtraProperties | undefined;

    if (extraProperties) {
      for (const [key, values] of Object.entries(extraProperties)) {
        this.addProperty(this.bitJson, key, values);
      }
    }
  }

  // bitmark -> bits -> bitValue -> body

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap

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
      item: gap.itemLead?.item ?? '',
      lead: gap.itemLead?.lead ?? '',
      hint: gap.hint ?? '',
      instruction: gap.instruction ?? '',
      isExample: !!gap.example,
      example: StringUtils.isString(gap.example) ? (gap.example as string) : '',
      isCaseSensitive: gap.isCaseSensitive ?? true,
      //
    };

    // Remove unwanted properties
    if (!gapJson.lead) delete gapJson.lead;

    // Add the gap to the placeholders
    this.bitJson.placeholders[placeholder] = gapJson as GapJson;
  }

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions

  // bitmark -> bits -> bitValue -> elements

  protected enter_elements(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const elements = node.value as string[];

    // Ignore elements that are not at the bit level as they are handled elsewhere as quizzes
    // if (parent?.key !== NodeType.bitsValue) return;

    if (elements && elements.length > 0) {
      this.bitJson.elements = elements;
    }
  }

  // protected between_elements(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeElementDivider();
  //   this.writeNL();
  // }

  // protected exit_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeMajorDivider();
  // }

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions

  // bitmark -> bits -> bitValue -> body -> bodyValue -> select

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
        // item: select.itemLead?.item ?? '',
        // lead: select.itemLead?.lead ?? '',
        // hint: select.hint ?? '',
        // instruction: select.instruction ?? '',
        // isExample: !!select.example,
        // example: StringUtils.isString(select.example) ? (select.example as string) : '',
        item: option.itemLead?.item ?? '',
        lead: option.itemLead?.lead ?? '',
        hint: option.hint ?? '',
        instruction: option.instruction ?? '',
        isExample: !!option.example,
        example: StringUtils.isString(option.example) ? (option.example as string) : '',
        // isCaseSensitive: select.isCaseSensitive ?? true,
        //
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
      item: select.itemLead?.item ?? '',
      lead: select.itemLead?.lead ?? '',
      hint: select.hint ?? '',
      instruction: select.instruction ?? '',
      isExample: !!select.example,
      example: StringUtils.isString(select.example) ? (select.example as string) : '',
      //
    };

    // Remove unwanted properties
    if (!selectJson.lead) delete selectJson.lead;

    // Add the gap to the placeholders
    this.bitJson.placeholders[placeholder] = selectJson as SelectJson;
  }

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> select -> options

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> select -> options -> optionsValue

  // protected enter_optionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const selectOption = node.value as SelectOption;
  //   if (selectOption.isCorrect) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(selectOption.text);
  //   this.writeCL();
  // }

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> highlight

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> highlight -> texts

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> highlight -> texts -> textsValue

  // protected enter_textsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const highlightText = node.value as HighlightText;
  //   if (highlightText.isCorrect) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(highlightText.text);
  //   this.writeCL();
  // }

  // bitmark -> bits -> bitValue -> statement

  protected enter_statement(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statement = node.value as Statement;

    // Ignore statement that is not at the bit level as it is handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (statement) {
      this.bitJson.statement = statement.text ?? '';
      this.bitJson.isCorrect = statement.isCorrect ?? false;
    }
  }

  // bitmark -> bits -> bitValue -> statements

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
          item: s.itemLead?.item ?? '',
          lead: s.itemLead?.lead ?? '',
          hint: s.hint ?? '',
          instruction: s.instruction ?? '',
          isExample: !!s.example,
          example: StringUtils.isString(s.example) ? (s.example as string) : '',
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

  // bitmark -> bits -> bitValue -> choices

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
          item: c.itemLead?.item ?? '',
          lead: c.itemLead?.lead ?? '',
          hint: c.hint ?? '',
          instruction: c.instruction ?? '',
          // isExample: !!c.example,
          // example: StringUtils.isString(c.example) ? (c.example as string) : '',
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

  // bitmark -> bits -> bitValue -> responses

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
          item: r.itemLead?.item ?? '',
          lead: r.itemLead?.lead ?? '',
          hint: r.hint ?? '',
          instruction: r.instruction ?? '',
          // isExample: !!c.example,
          // example: StringUtils.isString(c.example) ? (c.example as string) : '',
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

  // protected between_responses(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  // }

  // protected exit_responses(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> responses -> responsesValue

  // protected enter_responsesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const response = node.value as Response;
  //   if (response.isCorrect) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(response.text);
  //   this.writeCL();
  // }

  // bitmark -> bits -> bitValue -> quizzes

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
              item: c.itemLead?.item ?? '',
              lead: c.itemLead?.lead ?? '',
              hint: c.hint ?? '',
              instruction: c.instruction ?? '',
              // isExample: !!c.example,
              // example: StringUtils.isString(c.example) ? (c.example as string) : '',
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
              item: c.itemLead?.item ?? '',
              lead: c.itemLead?.lead ?? '',
              hint: c.hint ?? '',
              instruction: c.instruction ?? '',
              // isExample: !!c.example,
              // example: StringUtils.isString(c.example) ? (c.example as string) : '',
            };

            // Delete unwanted properties
            if (q.itemLead?.lead == null) delete responseJson.lead;

            responsesJson.push(responseJson as ResponseJson);
          }
        }

        // Create the quiz
        const quizJson: Partial<QuizJson> = {
          item: q.itemLead?.item ?? '',
          lead: q.itemLead?.lead ?? '',
          hint: q.hint ?? '',
          instruction: q.instruction ?? '',
          isExample: !!q.example,
          example: StringUtils.isString(q.example) ? (q.example as string) : '',
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

  // protected between_quizzes(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   // this.writeNL();
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // protected exit_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> quizzes -> quizzesValue

  // protected between_quizzesValue(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   if (right.key === NodeType.choices || right.key === NodeType.responses) {
  //     this.writeNL();
  //   }
  // }

  // bitmark -> bits -> bitValue -> heading

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

  // protected between_heading(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeMinorDivider();
  //   this.writeNL();
  // }

  // protected exit_heading(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   // this.writeMajorDivider();
  //   // this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> heading -> forValues

  // protected enter_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // protected between_forValues(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeMinorDivider();
  //   this.writeNL();
  // }

  // protected exit_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   //
  // }

  // bitmark -> bits -> bitValue -> pairs

  protected enter_pairs(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const pairs = node.value as Pair[];
    const pairsJson: PairJson[] = [];

    if (pairs) {
      for (const p of pairs) {
        // Create the question
        const pairJson: Partial<PairJson> = {
          key: p.key ?? '',
          values: p.values ?? [],
          item: p.itemLead?.item ?? '',
          lead: p.itemLead?.lead ?? '',
          hint: p.hint ?? '',
          instruction: p.instruction ?? '',
          isExample: !!p.example,
          example: StringUtils.isString(p.example) ? (p.example as string) : '',
          isCaseSensitive: p.isCaseSensitive ?? true,
          isLongAnswer: p.isLongAnswer ?? false,
          //
        };

        // Delete unwanted properties
        if (p.itemLead?.lead == null) delete pairJson.lead;

        pairsJson.push(pairJson as PairJson);
      }
    }

    if (pairsJson.length > 0) {
      this.bitJson.pairs = pairsJson;
    }
  }

  // protected between_pairs(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // protected exit_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> pairs -> pairsValue

  // protected between_pairsValue(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   // this.writeNL();
  //   // this.writeMinorDivider();
  //   // this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> pairs -> pairsValue -> keyAudio

  // protected enter_keyAudio(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
  //   // This is a resource, so handle it with the common code
  //   this.writeResource(node, parent, route);
  // }

  // // bitmark -> bits -> bitValue -> pairs -> pairsValue -> keyImage

  // protected enter_keyImage(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
  //   // This is a resource, so handle it with the common code
  //   this.writeResource(node, parent, route);
  // }

  // bitmark -> bits -> bitValue -> matrix

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
              item: c.itemLead?.item ?? '',
              lead: c.itemLead?.lead ?? '',
              hint: c.hint ?? '',
              instruction: c.instruction ?? '',
              isExample: !!c.example,
              example: StringUtils.isString(c.example) ? (c.example as string) : '',
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
          item: m.itemLead?.item ?? '',
          lead: m.itemLead?.lead ?? '',
          hint: m.hint ?? '',
          instruction: m.instruction ?? '',
          isExample: !!m.example,
          example: StringUtils.isString(m.example) ? (m.example as string) : '',
          isCaseSensitive: m.isCaseSensitive ?? true,
          isLongAnswer: m.isLongAnswer ?? false,
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

  // bitmark -> bits -> bitValue -> matrix -> matrixValue
  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values
  // bitmark -> bits -> bitValue -> matrix -> matrixValue -> cells -> cellsValue -> values

  // bitmark -> bits -> bitValue -> questions

  protected enter_questions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const questions = node.value as Question[];
    const questionsJson: QuestionJson[] = [];

    if (questions) {
      for (const q of questions) {
        // Create the question
        const questionJson: Partial<QuestionJson> = {
          question: q.question ?? '',
          partialAnswer: q.partialAnswer ?? '',
          sampleSolution: q.sampleSolution ?? '',
          item: q.itemLead?.item ?? '',
          lead: q.itemLead?.lead ?? '',
          hint: q.hint ?? '',
          instruction: q.instruction ?? '',
          isExample: !!q.example,
          example: StringUtils.isString(q.example) ? (q.example as string) : '',
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

  // bitmark -> bits -> bitValue -> questions -> questionsValue

  // bitmark -> bits -> bitValue -> resource

  protected enter_resource(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.addResource(node, parent, route);
  }

  // // bitmark -> bits -> bitValue -> resource -> posterImage

  // protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const posterImage = node.value as ImageResource;
  //   if (posterImage && posterImage.url) {
  //     this.writeProperty('posterImage', posterImage.url);
  //   }
  // }

  // // bitmark -> bits -> bitValue -> resource -> ...
  // // bitmark -> bits -> bitValue -> resource -> posterImage -> ...
  // // bitmark -> bits -> bitValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  // // protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  // //   this.writeProperty('posterImage', node.value);
  // // }

  //
  // Terminal nodes (leaves)
  //

  // bitmark -> bits -> bitValue -> bitType

  // bitmark -> bits -> bitValue -> textFormat

  //  bitmark -> bits -> title

  protected leaf_title(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'title', node.value, true);
  }

  //  bitmark -> bits -> subtitle

  protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'subtitle', node.value, true);
  }

  //  bitmark -> bits -> level

  protected leaf_level(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'level', node.value ?? 1, true);
  }

  //  bitmark -> bits -> toc

  protected leaf_toc(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'toc', node.value, true);
  }

  // bitmark -> bits -> bitValue -> book

  protected leaf_book(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'book', node.value, true);
  }

  //  bitmark -> bits -> bitValue -> anchor

  protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'anchor', node.value, true);
  }

  //  bitmark -> bits -> bitValue -> reference

  protected leaf_reference(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'reference', node.value, true);
  }

  //  bitmark -> bits -> bitValue -> referenceEnd

  protected leaf_referenceEnd(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'referenceEnd', node.value, true);
  }

  //  bitmark -> bits -> bitValue -> externalLink

  protected leaf_externalLink(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'externalLink', node.value, true);
  }

  //  bitmark -> bits -> bitValue -> externalLinkText

  protected leaf_externalLinkText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'externalLinkText', node.value, true);
  }

  //  bitmark -> bits -> bitValue -> labelTrue

  protected leaf_labelTrue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'labelTrue', node.value ?? '', true);
  }

  //  bitmark -> bits -> bitValue -> labelFalse

  protected leaf_labelFalse(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'labelFalse', node.value ?? '', true);
  }

  //  bitmark -> bits -> bitValue -> quotedPerson

  protected leaf_quotedPerson(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value != null) this.addProperty(this.bitJson, 'quotedPerson', node.value, true);
  }

  //  * -> itemLead --> item

  //  * -> itemLead --> lead

  //  bitmark -> bits -> bitValue ->  * -> hint

  protected leaf_hint(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const hint = node.value as string;

    // Ignore hint that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (hint != null) this.addProperty(this.bitJson, 'hint', hint ?? '', true);
  }

  // bitmark -> bits -> bitValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const instruction = node.value as string;

    // Ignore instruction that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (instruction != null) this.addProperty(this.bitJson, 'instruction', instruction ?? '', true);
  }

  // bitmark -> bits -> bitValue ->  * -> example

  protected leaf_example(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const example = node.value as boolean | undefined;

    // Ignore example that is not at the bit level as it are handled elsewhere
    if (parent?.key !== NodeType.bitsValue) return;

    if (example != null) this.addProperty(this.bitJson, 'example', example ?? true, true);
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
  // bitmark -> bits -> bitValue -> elements -> elementsValue

  // protected leaf_elementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  // protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPU();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // bitmark -> bits -> bitValue-> body -> bodyValue -> select -> options -> prefix
  // bitmark -> bits -> bitValue-> body -> bodyValue -> highlight -> options -> prefix

  // protected leaf_prefix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPPRE();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue-> body -> bodyValue -> select -> options -> postfix
  // // bitmark -> bits -> bitValue-> body -> bodyValue -> highlight -> options -> postfix

  // protected leaf_postfix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPPOST();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue ->  * -> isCaseSensitive

  // // bitmark -> bits -> bitValue ->  * -> isLongAnswer

  // // bitmark -> bits -> bitValue ->  * -> isCorrect

  // // bitmark -> bits -> bitValue -> heading -> forKeys

  // protected leaf_forKeys(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeOPHASH();
  //   this.writeString(node.value);
  //   this.writeCL();
  // }

  // // bitmark -> bits -> bitValue -> heading -> forValuesValue

  // protected leaf_forValuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeOPHASH();
  //   this.writeString(node.value);
  //   this.writeCL();
  // }

  // // bitmark -> bits -> bitValue -> pairs -> pairsValue -> key
  // // bitmark -> bits -> bitValue -> matrix -> matrixValue -> key

  // protected leaf_key(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values -> valuesValue
  // // bitmark -> bits -> bitValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  // protected leaf_valuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // bitmark -> bits -> bitValue -> questions -> questionsValue -> question

  // protected leaf_question(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //     // this.writeNL();
  //   }
  // }

  // // bitmark -> bits -> bitValue -> questions -> questionsValue -> sampleSolution

  // protected leaf_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPDOLLAR();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue -> questions -> questionsValue -> question -> isShortAnswer

  // protected leaf_isShortAnswer(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value === true) {
  //     this.writeOPA();
  //     this.writeString('shortAnswer');
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue -> statements -> text

  // // bitmark -> bits -> bitValue -> resource -> ...
  // // bitmark -> bits -> bitValue -> resource -> posterImage -> ...
  // // bitmark -> bits -> bitValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  // protected leaf_src1x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('src1x', node.value);
  // }

  // protected leaf_src2x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('src2x', node.value);
  // }

  // protected leaf_src3x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('src3x', node.value);
  // }

  // protected leaf_src4x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('src4x', node.value);
  // }

  // protected leaf_width(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('width', node.value);
  // }

  // protected leaf_height(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('height', node.value);
  // }

  // protected leaf_alt(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('alt', node.value);
  // }

  // protected leaf_license(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('license', node.value);
  // }

  // protected leaf_copyright(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('copyright', node.value);
  // }

  // protected leaf_provider(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   // provider is included in the url (it is the domain) and should not be written as a property
  //   // this.writeProperty('provider', node.value);
  // }

  // protected leaf_showInIndex(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('showInIndex', node.value);
  // }

  // protected leaf_caption(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('caption', node.value);
  // }

  // // bitmark -> bits -> bitValue -> resource -> ...
  // // bitmark -> bits -> bitValue -> resource -> posterImage -> ...
  // // bitmark -> bits -> bitValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // // [duration,mute,autoplay,allowSubtitles,showSubtitles]

  // protected leaf_duration(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('duration', node.value);
  // }

  // protected leaf_mute(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('mute', node.value);
  // }

  // protected leaf_autoplay(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('autoplay', node.value);
  // }

  // protected leaf_allowSubtitles(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('allowSubtitles', node.value);
  // }

  // protected leaf_showSubtitles(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('showSubtitles', node.value);
  // }

  // bitmark -> bits -> bitValue -> bitmark

  protected leaf_bitmark(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bitmark = node.value as string | undefined;
    if (bitmark) this.bitWrapperJson.bitmark = bitmark;
  }

  // bitmark -> bits -> bitValue -> errors

  protected leaf_errors(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const errors = node.value as ParserError[] | undefined;
    if (errors && errors.length > 0) {
      this.bitWrapperJson.parser = {
        errors,
      };
    }
  }

  // // END NODE HANDLERS

  // //
  // // WRITE FUNCTIONS
  // //

  protected writeString(s?: string): void {
    if (s != null) this.write(`${s}`);
  }

  protected addResource(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const resource = node.value as Resource;
    const resourceAsArticle = resource as ArticleResource;

    if (resource) {
      // Check if a resource has a value, if not, we should not write it (or any of its chained properties)
      let valid = false;
      if (resource.type === ResourceType.article && resourceAsArticle.body) {
        // Article with body
        valid = true;
      } else if (resource.url) {
        // Other resource with a url (url / src / app / ...etc)
        valid = true;
      }

      // Resource is not valid, cancel walking it's tree.
      if (!valid) return false;

      // Resource is valid, write it.
      const resourceJson: ResourceWrapperJson = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: resource.type as any,
      };
      this.bitJson.resource = resourceJson as ResourceJson;

      switch (resource.type) {
        case ResourceType.image:
          (resourceJson as ImageResourceWrapperJson).image = this.addImageLikeResource(resource as ImageResource);
          break;

        case ResourceType.imageLink:
          (resourceJson as ImageLinkResourceWrapperJson).imageLink = this.addImageLikeResource(
            resource as ImageResource,
          );
          break;

        case ResourceType.audio:
          (resourceJson as AudioResourceWrapperJson).audio = this.addAudioLikeResource(resource as AudioResource);
          break;

        case ResourceType.audioLink:
          (resourceJson as AudioLinkResourceWrapperJson).audioLink = this.addAudioLinkLikeResource(
            resource as AudioResource,
          );
          break;

        case ResourceType.video:
          (resourceJson as VideoResourceWrapperJson).video = this.addVideoLikeResource(resource as VideoResource);
          break;

        case ResourceType.videoLink:
          (resourceJson as VideoLinkResourceWrapperJson).videoLink = this.addVideoLinkLikeResource(
            resource as VideoResource,
          );
          break;

        case ResourceType.stillImageFilm:
          (resourceJson as StillImageFilmResourceWrapperJson).stillImageFilm = this.addVideoLikeResource(
            resource as VideoResource,
          );
          break;

        case ResourceType.stillImageFilmLink:
          (resourceJson as StillImageFilmLinkResourceWrapperJson).stillImageFilmLink = this.addVideoLikeResource(
            resource as VideoResource,
          );
          break;

        case ResourceType.article:
          (resourceJson as ArticleResourceWrapperJson).article = this.addArticleLikeResource(
            resource as ArticleResource,
          );
          break;

        case ResourceType.articleLink:
          (resourceJson as ArticleLinkResourceWrapperJson).articleLink = this.addArticleLinkLikeResource(
            resource as ArticleResource,
          );
          break;

        case ResourceType.document:
          (resourceJson as DocumentResourceWrapperJson).document = this.addArticleLikeResource(
            resource as ArticleResource,
          );
          break;

        case ResourceType.documentLink:
          (resourceJson as DocumentLinkResourceWrapperJson).documentLink = this.addArticleLinkLikeResource(
            resource as ArticleResource,
          );
          break;

        case ResourceType.app:
          (resourceJson as AppResourceWrapperJson).app = resource.url ?? '';
          break;

        case ResourceType.appLink:
          (resourceJson as AppLinkResourceWrapperJson).appLink = this.addAppLinkLikeResource(resource as AppResource);
          break;

        case ResourceType.websiteLink:
          (resourceJson as WebsiteLinkResourceWrapperJson).websiteLink = this.addWebsiteLikeResource(
            resource as WebsiteLinkResource,
          );
          break;

        default:
      }
    }
  }

  protected addImageLikeResource(resource: ImageResource | string): ImageResourceJson | ImageLinkResourceJson {
    const resourceJson: Partial<ImageResourceJson | ImageLinkResourceJson> = {};

    if (StringUtils.isString(resource)) {
      const url = resource as string;
      resource = {
        type: ResourceType.image,
        url,
        format: UrlUtils.fileExtensionFromUrl(url),
        provider: UrlUtils.domainFromUrl(url),
      };
    }

    resource = resource as ImageResource; // Keep TS compiler happy

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.src = resource.url;
    if (resource.src1x != null) resourceJson.src1x = resource.src1x;
    if (resource.src2x != null) resourceJson.src2x = resource.src2x;
    if (resource.src3x != null) resourceJson.src3x = resource.src3x;
    if (resource.src4x != null) resourceJson.src4x = resource.src4x;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;
    resourceJson.alt = resource.alt ?? '';

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ImageResourceJson | ImageLinkResourceJson;
  }

  protected addAudioLikeResource(resource: AudioResource): AudioResourceJson {
    const resourceJson: Partial<AudioResourceJson | AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.src = resource.url;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as AudioResourceJson;
  }

  protected addAudioLinkLikeResource(resource: AudioResource): AudioLinkResourceJson {
    const resourceJson: Partial<AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.url = resource.url;

    // Properties that are always added that do not come from the markup
    resourceJson.duration = '';
    resourceJson.autoplay = true;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson, true);

    return resourceJson as AudioLinkResourceJson;
  }

  protected addVideoLikeResource(resource: VideoResource): VideoResourceJson {
    const resourceJson: Partial<VideoResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.src = resource.url;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageLikeResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageLikeResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoResourceJson | VideoLinkResourceJson;
  }

  protected addVideoLinkLikeResource(resource: VideoResource): VideoLinkResourceJson {
    const resourceJson: Partial<VideoLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.url = resource.url;
    resourceJson.width = resource.width ?? null;
    resourceJson.height = resource.height ?? null;

    if (resource.duration != null) resourceJson.duration = resource.duration;
    if (resource.mute != null) resourceJson.mute = resource.mute;
    if (resource.autoplay != null) resourceJson.autoplay = resource.autoplay;
    if (resource.allowSubtitles != null) resourceJson.allowSubtitles = resource.allowSubtitles;
    if (resource.showSubtitles != null) resourceJson.showSubtitles = resource.showSubtitles;

    if (resource.alt != null) resourceJson.alt = resource.alt;

    if (resource.posterImage != null) resourceJson.posterImage = this.addImageLikeResource(resource.posterImage);
    if (resource.thumbnails != null && resource.thumbnails.length > 0) {
      resourceJson.thumbnails = [];
      for (const thumbnail of resource.thumbnails) {
        resourceJson.thumbnails.push(this.addImageLikeResource(thumbnail));
      }
    }

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as VideoLinkResourceJson;
  }

  protected addArticleLikeResource(resource: ArticleResource): ArticleResourceJson | DocumentResourceJson {
    const resourceJson: Partial<ArticleResourceJson | DocumentResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.body = resource.url;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected addArticleLinkLikeResource(resource: ArticleResource): ArticleLikeResourceJson | DocumentLinkResourceJson {
    const resourceJson: Partial<ArticleLikeResourceJson | DocumentLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.provider != null) resourceJson.provider = resource.provider;
    if (resource.url != null) resourceJson.url = resource.url;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ArticleLikeResourceJson | DocumentLinkResourceJson;
  }

  protected addAppLinkLikeResource(resource: AppResource): AppLinkResourceJson {
    const resourceJson: Partial<AppLinkResourceJson> = {};

    // if (resource.format != null) resourceJson.format = resource.format;
    if (resource.url != null) resourceJson.app = resource.url;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as AppLinkResourceJson;
  }

  protected addWebsiteLikeResource(resource: WebsiteLinkResource): WebsiteLinkResourceJson {
    const resourceJson: Partial<WebsiteLinkResourceJson> = {};

    // if (resource.format != null) resourceJson.format = resource.format;
    if (resource.url != null) resourceJson.url = resource.url;
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
        if (singleWithoutArray && values.length === 1) {
          target[name] = values[0];
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

  // protected isWriteTextFormat(bitValue: string): boolean {
  //   const isMinusMinus = TextFormat.fromValue(bitValue) === TextFormat.bitmarkMinusMinus;
  //   const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
  //   return !!writeFormat;
  // }

  // protected isStatementDivider(route: NodeInfo[]) {
  //   const bitType = this.getBitType(route);
  //   return !(bitType === BitType.trueFalse1);
  // }

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
      book: undefined,
      ageRange: undefined,
      language: undefined,
      computerLanguage: undefined,
      coverImage: undefined,
      publisher: undefined,
      publications: undefined,
      author: undefined,
      date: undefined,
      location: undefined,
      theme: undefined,
      kind: undefined,
      action: undefined,
      thumbImage: undefined,
      deeplink: undefined,
      externalLink: undefined,
      externalLinkText: undefined,
      videoCallLink: undefined,
      duration: undefined,
      list: undefined,
      labelTrue: undefined,
      labelFalse: undefined,
      quotedPerson: undefined,

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

      // Only .learningPathExternalLink?
      isTracked: undefined,
      isInfoOnly: undefined,

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

      // Placeholders
      placeholders: undefined,

      // Footer
      footer: undefined,
    };

    // Add the resource template if there should be a resource (indicated by resourceType) but there is none defined.
    if (bit.resourceType && !bitJson.resource) {
      const jsonKey = ResourceType.keyFromValue(bit.resourceType);
      bitJson.resource = {
        type: bit.resourceType,
      } as ResourceJson;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (jsonKey) (bitJson.resource as any)[jsonKey] = {};
    }

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
      case BitType.article:
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.assignment:
      case BitType.book:
      case BitType.cloze:
      case BitType.clozeInstructionGrouped:
      case BitType.clozeSolutionGrouped:
      case BitType.example:
      case BitType.help:
      case BitType.hint:
      case BitType.info:
      case BitType.internalLink:
      case BitType.note:
      case BitType.preparationNote:
      case BitType.quote:
      case BitType.remark:
      case BitType.sideNote:
      case BitType.takePicture:
      case BitType.video:
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
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.heading == null) bitJson.heading = {} as HeadingJson;
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.matchMatrix:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.body == null) bitJson.body = '';
        break;

      case BitType.learningPathExternalLink:
        if (bitJson.item == null) bitJson.item = '';
        if (bitJson.hint == null) bitJson.hint = '';
        if (bitJson.isExample == null) bitJson.isExample = false;
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.example == null) bitJson.example = '';
        if (bitJson.isTracked == null) bitJson.isTracked = true;
        if (bitJson.isInfoOnly == null) bitJson.isInfoOnly = false;
        if (bitJson.body == null) bitJson.body = '';
        break;

      default:
    }

    // Remove unwanted properties

    // Properties
    if (bitJson.id == null) delete bitJson.id;
    if (bitJson.externalId == null) delete bitJson.externalId;
    if (bitJson.book == null) delete bitJson.book;
    if (bitJson.ageRange == null) delete bitJson.ageRange;
    if (bitJson.language == null) delete bitJson.language;
    if (bitJson.computerLanguage == null) delete bitJson.computerLanguage;
    if (bitJson.coverImage == null) delete bitJson.coverImage;
    if (bitJson.publisher == null) delete bitJson.publisher;
    if (bitJson.publications == null) delete bitJson.publications;
    if (bitJson.author == null) delete bitJson.author;
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
