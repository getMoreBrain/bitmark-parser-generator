import { AstWalkCallbacks, Ast, NodeInfo } from '../../ast/Ast';
import { Writer } from '../../ast/writer/Writer';
import { NodeTypeType, NodeType } from '../../model/ast/NodeType';
import { Matrix, Pair, Question, Quiz } from '../../model/ast/Nodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { GapJson, SelectJson, SelectOptionJson } from '../../model/json/BodyBitJson';
import { StringUtils } from '../../utils/StringUtils';
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

    // Add properties
    if (bit.ids != null) this.addProperty(this.bitJson, 'id', bit.ids);
    if (bit.externalIds != null) this.addProperty(this.bitJson, 'externalId', bit.externalIds);
    if (bit.book != null) this.addProperty(this.bitJson, 'id', bit.book);
    if (bit.ageRanges != null) this.addProperty(this.bitJson, 'ageRange', bit.ageRanges);
    if (bit.languages != null) this.addProperty(this.bitJson, 'language', bit.languages);
    if (bit.computerLanguages != null) this.addProperty(this.bitJson, 'computerLanguage', bit.computerLanguages);
    if (bit.coverImages != null) this.addProperty(this.bitJson, 'coverImage', bit.coverImages);
    if (bit.publishers != null) this.addProperty(this.bitJson, 'publisher', bit.publishers);
    if (bit.publications != null) this.addProperty(this.bitJson, 'publications', bit.publications);
    if (bit.authors != null) this.addProperty(this.bitJson, 'author', bit.authors);
    if (bit.dates != null) this.addProperty(this.bitJson, 'date', bit.dates);
    if (bit.locations != null) this.addProperty(this.bitJson, 'location', bit.locations);
    if (bit.themes != null) this.addProperty(this.bitJson, 'theme', bit.themes);
    if (bit.kinds != null) this.addProperty(this.bitJson, 'kind', bit.kinds);
    if (bit.actions != null) this.addProperty(this.bitJson, 'action', bit.actions);
    if (bit.thumbImages != null) this.addProperty(this.bitJson, 'thumbImage', bit.thumbImages);
    if (bit.deepLinks != null) this.addProperty(this.bitJson, 'deeplink', bit.deepLinks);
    if (bit.externalLink != null) this.addProperty(this.bitJson, 'externalLink', bit.externalLink);
    if (bit.externalLinkText != null) this.addProperty(this.bitJson, 'externalLinkText', bit.externalLinkText);
    if (bit.videoCallLinks != null) this.addProperty(this.bitJson, 'videoCallLink', bit.videoCallLinks);
    if (bit.durations != null) this.addProperty(this.bitJson, 'duration', bit.durations);
    if (bit.referenceProperties != null) this.addProperty(this.bitJson, 'reference', bit.referenceProperties); // Important for property order, do not remove
    if (bit.lists != null) this.addProperty(this.bitJson, 'list', bit.lists);
    if (bit.labelTrue != null) this.addProperty(this.bitJson, 'labelTrue', bit.labelTrue);
    if (bit.labelFalse != null) this.addProperty(this.bitJson, 'labelFalse', bit.labelFalse);
    if (bit.quotedPerson != null) this.bitJson.quotedPerson = bit.quotedPerson;

    // Book data - Title, subtile, level, toc, progress, anchor, reference, etc
    if (bit.title != null) this.bitJson.title = bit.title ?? '';
    if (bit.subtitle != null) this.bitJson.subtitle = bit.subtitle ?? '';
    if (bit.level != null) this.bitJson.level = bit.level ?? 1;
    if (bit.toc != null) this.bitJson.toc = bit.toc ?? '';
    // ??? if (bit.progress != null) this.bitJson.progress = bit.progress ?? '';
    if (bit.anchor != null) this.bitJson.anchor = bit.anchor ?? '';
    if (bit.reference != null) this.bitJson.reference = bit.reference ?? ''; // Important for property order, do not remove
    if (bit.referenceEnd != null) this.bitJson.referenceEnd = bit.referenceEnd ?? '';

    // Item, Lead, Hint, Instruction
    // if (bit.itemLead?.item != null) this.bitJson.item = bit.itemLead?.item ?? '';
    if (bit.itemLead?.item) this.bitJson.item = bit.itemLead?.item ?? '';
    if (bit.itemLead?.lead != null) this.bitJson.lead = bit.itemLead?.lead ?? '';
    if (bit.hint != null) this.bitJson.hint = bit.hint ?? '';
    if (bit.instruction != null) this.bitJson.instruction = bit.instruction ?? '';

    // Example
    if (bit.example != null) this.addProperty(this.bitJson, 'toc', bit.example ?? true);

    // Extra properties
    if (bit.extraProperties) {
      for (const [key, values] of Object.entries(bit.extraProperties)) {
        this.addProperty(this.bitJson, key, values);
      }
    }

    // Body (filled in by enter_body)
    this.bitJson.body = '';

    //   resource,
    //   body,
    //   sampleSolutions: this.asArray(sampleSolutions),
    //   elements,
    //   statements,
    //   responses,
    //   quizzes,
    //   heading,
    //   pairs,
    //   matrix,
    //   choices,
    //   questions,
    //   footer,

    // bitmark
    if (bit.bitmark) {
      this.bitWrapperJson.bitmark = bit.bitmark;
    }

    // errors
    if (bit.errors) {
      this.bitWrapperJson.parser = {
        errors: bit.errors,
      };
    }
  }

  // bitmark -> bits -> bitValue -> ids

  protected enter_ids(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.addProperty(this.bitJson, 'id', node.value);
  }

  // // bitmark -> bits -> bitValue -> externalIds

  // protected enter_externalIds(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('externalId', node.value);
  // }

  // // bitmark -> bits -> bitValue -> ageRanges

  // protected enter_ageRanges(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('ageRange', node.value);
  // }

  // // bitmark -> bits -> bitValue -> languages

  // protected enter_languages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('language', node.value);
  // }

  // // bitmark -> bits -> bitValue -> computerLanguages

  // protected enter_computerLanguages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('computerLanguage', node.value);
  // }

  // // bitmark -> bits -> bitValue -> coverImages

  // protected enter_coverImages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('coverImage', node.value);
  // }

  // // bitmark -> bits -> bitValue -> publishers

  // protected enter_publishers(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('publisher', node.value);
  // }

  // // bitmark -> bits -> bitValue -> publications

  // protected enter_publications(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('publications', node.value);
  // }

  // // bitmark -> bits -> bitValue -> authors

  // protected enter_authors(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('author', node.value);
  // }

  // // bitmark -> bits -> bitValue -> dates

  // protected enter_dates(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('date', node.value);
  // }

  // // bitmark -> bits -> bitValue -> locations

  // protected enter_locations(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('location', node.value);
  // }

  // // bitmark -> bits -> bitValue -> themes

  // protected enter_themes(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('theme', node.value);
  // }

  // // bitmark -> bits -> bitValue -> kinds

  // protected enter_kinds(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('kind', node.value);
  // }

  // // bitmark -> bits -> bitValue -> actions

  // protected enter_actions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('action', node.value);
  // }

  // // bitmark -> bits -> bitValue -> thumbImages

  // protected enter_thumbImages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('thumbImage', node.value);
  // }

  // // bitmark -> bits -> bitValue -> durations

  // protected enter_durations(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('duration', node.value);
  // }

  // // bitmark -> bits -> bitValue -> deepLinks

  // protected enter_deepLinks(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('deeplink', node.value);
  // }

  // // bitmark -> bits -> bitValue -> videoCallLinks

  // protected enter_videoCallLinks(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('videoCallLink', node.value);
  // }

  // // bitmark -> bits -> bitValue -> bots

  // protected enter_bots(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('bot', node.value);
  // }

  // //  bitmark -> bits -> referenceProperties

  // protected enter_referenceProperties(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('reference', node.value);
  // }

  // // bitmark -> bits -> bitValue -> lists

  // protected enter_lists(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('list', node.value);
  // }

  // // bitmark -> bits -> bitValue -> sampleSolutions

  // protected enter_sampleSolutions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('sampleSolution', node.value);
  // }

  // // bitmark -> bits -> bitValue -> itemLead

  // protected enter_itemLead(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const itemLead = node.value as ItemLead;
  //   if (itemLead && (itemLead.item || itemLead.lead)) {
  //     // Always write item if item or lead is set
  //     this.writeOPC();
  //     this.writeString(itemLead.item);
  //     this.writeCL();

  //     if (itemLead.lead) {
  //       this.writeOPC();
  //       this.writeString(itemLead.lead);
  //       this.writeCL();
  //     }
  //   }
  // }

  // bitmark -> bits -> bitValue -> body

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap

  protected enter_gap(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const gap = node.value as Gap['gap'];

    // Ensure placeholders exists
    if (!this.bitJson.placeholders) this.bitJson.placeholders = {};

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

  // // bitmark -> bits -> bitValue -> elements

  // protected enter_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

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

  // // bitmark -> bits -> bitValue -> statements

  // protected enter_statements(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
  //   const isStatementDivider = this.isStatementDivider(route);

  //   if (isStatementDivider) {
  //     this.writeMajorDivider();
  //     this.writeNL();
  //   }
  // }

  // protected between_statements(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   route: NodeInfo[],
  // ): void {
  //   const isStatementDivider = this.isStatementDivider(route);

  //   if (isStatementDivider) {
  //     this.writeNL();
  //     this.writeMajorDivider();
  //   }
  //   this.writeNL();
  // }

  // protected exit_statements(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
  //   const isStatementDivider = this.isStatementDivider(route);

  //   if (isStatementDivider) {
  //     this.writeNL();
  //     this.writeMajorDivider();
  //   }
  // }

  // // bitmark -> bits -> bitValue -> statements -> statementsValue

  // protected enter_statementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const statement = node.value as Statement;
  //   if (statement.isCorrect) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(statement.text);
  //   this.writeCL();
  // }

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

  // // bitmark -> bits -> bitValue -> quizzes -> quizzesValue -> choices

  // protected between_choices(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeNL();
  // }

  // protected exit_choices(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> choices -> choicesValue

  // protected enter_choicesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const choice = node.value as Choice;
  //   if (choice.isCorrect) {
  //     this.writeOPP();
  //   } else {
  //     this.writeOPM();
  //   }
  //   this.write(choice.text);
  //   this.writeCL();
  // }

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

        // Create the quiz
        const quizJson: Partial<QuizJson> = {
          item: q.itemLead?.item ?? '',
          lead: q.itemLead?.lead ?? '',
          hint: q.hint ?? '',
          instruction: q.instruction ?? '',
          isExample: !!q.example,
          example: StringUtils.isString(q.example) ? (q.example as string) : '',
          choices: choicesJson,
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

  // protected between_matrix(
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

  // protected exit_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> matrix -> matrixValue

  // protected between_matrixValue(
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

  // // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values
  // // bitmark -> bits -> bitValue -> matrix -> matrixValue -> cells -> cellsValue -> values

  // protected enter_values(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  //   this.writeMinorDivider();
  //   this.writeNL();
  // }

  // protected between_values(
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

  // protected between_questions(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   _right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // protected exit_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeMajorDivider();
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> questions -> questionsValue

  // protected between_questionsValue(
  //   _node: NodeInfo,
  //   _left: NodeInfo,
  //   right: NodeInfo,
  //   _parent: NodeInfo | undefined,
  //   _route: NodeInfo[],
  // ): void {
  //   if (right.key === NodeType.sampleSolution) {
  //     this.writeNL();
  //   }
  // }

  // protected exit_questionsValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeNL();
  // }

  // // bitmark -> bits -> bitValue -> resource

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

  // //
  // // Terminal nodes (leaves)
  // //

  // // bitmark -> bits -> bitValue -> bitType

  // // bitmark -> bits -> bitValue -> textFormat

  // //  bitmark -> bits -> title

  // protected leaf_title(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const title = node.value;
  //   const bit = parent?.value as Bit;
  //   const level = bit.level || 1;
  //   if (level && title) {
  //     this.writeOP();
  //     for (let i = 0; i < level; i++) this.writeHash();
  //     this.writeString(title);
  //     this.writeCL();
  //   }
  // }

  // //  bitmark -> bits -> subtitle

  // protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const subtitle = node.value;
  //   const level = 2;
  //   if (level && subtitle) {
  //     this.writeOP();
  //     for (let i = 0; i < level; i++) this.writeHash();
  //     this.writeString(subtitle);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue -> book

  // protected leaf_book(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const bit = parent?.value as Bit;

  //   if (bit && node.value) {
  //     this.writeProperty('book', node.value);
  //     if (bit.reference) {
  //       this.writeOPRANGLE();
  //       this.writeString(bit.reference);
  //       this.writeCL();

  //       if (bit.referenceEnd) {
  //         this.writeOPRANGLE();
  //         this.writeString(bit.referenceEnd);
  //         this.writeCL();
  //       }
  //     }
  //   }
  // }

  // //  bitmark -> bits -> bitValue -> anchor

  // protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPDANGLE();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // //  bitmark -> bits -> bitValue -> reference

  // protected leaf_reference(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const bit = parent?.value as Bit;

  //   if (bit && node.value) {
  //     // Only write reference if it is not chained to 'book'
  //     if (!bit.book) {
  //       this.writeOPRANGLE();
  //       this.writeString(node.value);
  //       this.writeCL();
  //     }
  //   }
  // }

  // //  bitmark -> bits -> bitValue -> externalLink

  // protected leaf_externalLink(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeProperty('externalLink', node.value);
  //   }
  // }

  // //  bitmark -> bits -> bitValue -> externalLinkText

  // protected leaf_externalLinkText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeProperty('externalLinkText', node.value);
  //   }
  // }

  // //  bitmark -> bits -> bitValue -> labelTrue

  // protected leaf_labelTrue(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const bit = parent?.value as Bit;
  //   if (bit) {
  //     this.writeProperty('labelTrue', node.value ?? '');
  //     this.writeProperty('labelFalse', bit.labelFalse ?? '');
  //   }
  // }

  // //  bitmark -> bits -> bitValue -> quotedPerson

  // protected leaf_quotedPerson(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeProperty('quotedPerson', node.value);
  //   }
  // }

  // //  * -> itemLead --> item

  // //  * -> itemLead --> lead

  // //  * -> hint

  // protected leaf_hint(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPQ();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue ->  * -> instruction

  // protected leaf_instruction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPB();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue ->  * -> example

  // protected leaf_example(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   const example = node.value;

  //   if (example) {
  //     this.writeOPA();
  //     this.writeString('example');

  //     if (example !== true && example !== '') {
  //       this.writeColon();
  //       this.writeString(example as string);
  //     }

  //     this.writeCL();
  //   }
  // }

  // bitmark -> bits -> body -> bodyValue -> bodyText

  protected leaf_bodyText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      // if (!this.bitJson.body) this.bitJson.body = '';
      this.bitJson.body += node.value;
    }
  }

  // // bitmark -> bits -> footer -> footerText

  // protected leaf_footerText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // bitmark -> bits -> bitValue -> elements -> elementsValue

  // protected leaf_elementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeString(node.value);
  //   }
  // }

  // // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions -> solution
  // // ? -> solutions -> solution

  // protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   if (node.value) {
  //     this.writeOPU();
  //     this.writeString(node.value);
  //     this.writeCL();
  //   }
  // }

  // // bitmark -> bits -> bitValue-> body -> bodyValue -> select -> options -> prefix
  // // bitmark -> bits -> bitValue-> body -> bodyValue -> highlight -> options -> prefix

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
          (resourceJson as VideoLinkResourceWrapperJson).videoLink = this.addVideoLikeResource(
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

  protected addImageLikeResource(resource: ImageResource): ImageResourceJson | ImageLinkResourceJson {
    const resourceJson: Partial<ImageResourceJson | ImageLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
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
    if (resource.url != null) resourceJson.src = resource.url;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as AudioResourceJson;
  }

  protected addAudioLinkLikeResource(resource: AudioResource): AudioLinkResourceJson {
    const resourceJson: Partial<AudioLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.url != null) resourceJson.url = resource.url;

    // Properties that are always added that do not come from the markup
    resourceJson.duration = '';
    resourceJson.autoplay = true;

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson, true);

    return resourceJson as AudioLinkResourceJson;
  }

  protected addVideoLikeResource(resource: VideoResource): VideoResourceJson | VideoLinkResourceJson {
    const resourceJson: Partial<VideoResourceJson | VideoLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
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

  protected addArticleLikeResource(resource: ArticleResource): ArticleResourceJson | DocumentResourceJson {
    const resourceJson: Partial<ArticleResourceJson | DocumentResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
    if (resource.url != null) resourceJson.body = resource.url;
    // if (resource.href != null) resourceJson.href = resource.href; // It is never used (and doesn't exist in the AST model)

    this.addGenericResourceProperties(resource, resourceJson as BaseResourceJson);

    return resourceJson as ArticleResourceJson | DocumentResourceJson;
  }

  protected addArticleLinkLikeResource(resource: ArticleResource): ArticleLikeResourceJson | DocumentLinkResourceJson {
    const resourceJson: Partial<ArticleLikeResourceJson | DocumentLinkResourceJson> = {};

    if (resource.format != null) resourceJson.format = resource.format;
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

  // TODD - it would be better to remove the unwanted defaults, rather than adding them.
  // Then it would be easy to stop doing it (and correct all the defaults) and also the order would be correct in the
  // generated JSON.
  protected createBitJson(bit: Bit): Partial<BitJson> {
    const bitJson: Partial<BitJson> = {
      type: bit.bitType,
      format: bit.textFormat,
    };

    // Add default properties to the bit.
    // NOTE: Not all bits have the same default properties.
    //       The properties used in the antlr parser are a bit random sometimes.
    switch (bit.bitType) {
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
        bitJson.item = '';
        bitJson.hint = '';
        bitJson.isExample = false;
        bitJson.example = '';
        break;

      case BitType.multipleChoice1:
      case BitType.multipleResponse1:
        bitJson.item = '';
        bitJson.hint = '';
        bitJson.instruction = '';
        bitJson.isExample = false;
        bitJson.example = '';
        break;

      case BitType.chapter:
        bitJson.item = '';
        bitJson.hint = '';
        bitJson.isExample = false;
        bitJson.example = '';
        bitJson.toc = true; // Always set on chapter bits?
        bitJson.progress = true; // Always set on chapter bits
        break;

      case BitType.interview:
      case BitType.multipleChoice:
      case BitType.multipleResponse:
        bitJson.item = '';
        bitJson.hint = '';
        bitJson.instruction = '';
        bitJson.footer = '';
        break;

      case BitType.match:
      case BitType.matchReverse:
        bitJson.item = '';
        bitJson.heading = {} as HeadingJson;
        break;

      case BitType.matchMatrix:
        bitJson.item = '';
        break;

      default:
    }

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
