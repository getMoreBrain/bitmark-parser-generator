import { AstNodeType, AstNodeTypeType } from '../AstNodeType';
import { Ast, AstWalkCallbacks, NodeInfo } from '../Ast';
import { BitType, BitTypeType } from '../types/BitType';
import { TextFormat } from '../types/TextFormat';
import { ResourceType } from '../types/resources/ResouceType';

import { CodeWriter } from './writer/CodeWriter';
import { TextWriter } from './writer/TextWriter';

import {
  ArticleResource,
  Bit,
  Bitmark,
  Body,
  Choice,
  Heading,
  HighlightText,
  ImageResource,
  ItemLead,
  Node,
  Resource,
  Response,
  SelectOption,
  Solution,
  Statement,
} from '../nodes/BitmarkNodes';

const DEFAULT_OPTIONS: BitmarkGeneratorOptions = {
  // debugGenerationInline: true,
};

export interface BitmarkGeneratorOptions {
  explicitTextFormat?: boolean;
  debugGenerationInline?: boolean;
}

class BitmarkMarkupGenerator extends CodeWriter implements AstWalkCallbacks {
  private options: BitmarkGeneratorOptions;
  private printed = false;

  constructor(writer: TextWriter, options?: BitmarkGeneratorOptions) {
    super(writer);

    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.enter = this.enter.bind(this);
    this.between = this.between.bind(this);
    this.exit = this.exit.bind(this);
    this.leaf = this.leaf.bind(this);
  }

  public generate(bitmark: Bitmark): void {
    Ast.walk(bitmark, this);

    this.writeEndOfLine();
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

  // bitmark -> bits

  protected between_bits(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeNL();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue

  protected enter_bitsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = node.value as Bit;

    this.writeOPD();
    this.writeString(bit.bitType);

    if (bit.textFormat) {
      const write = this.isWriteTextFormat(bit.textFormat);

      if (write) {
        this.writeColon();
        this.writeString(bit.textFormat);
      }
    }

    // Write the resource type if there is a resource (unless the bit itself is the resource)
    const resourceType = bit.resource?.type;
    if (resourceType && resourceType !== bit.bitType) {
      this.writeAmpersand();
      this.writeString(bit.resource?.type);
    }

    this.writeCL();
    this.writeNL();
  }

  protected between_bitsValue(
    node: NodeInfo,
    left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // The following keys are combined with other keys so don't need newlines
    const noNlKeys: AstNodeTypeType[] = [
      AstNodeType.bitType,
      AstNodeType.textFormat,
      AstNodeType.level,
      AstNodeType.progress,
      AstNodeType.toc,
      AstNodeType.referenceEnd,
      AstNodeType.labelFalse,
    ];

    const bit = node.value as Bit;
    if (bit.book) {
      // If the book node exists, remove the newline caused by reference as it will be bound to book
      noNlKeys.push(AstNodeType.reference);
    }

    // Check if a no newline key is to the left in this 'between' callback
    const noNl = ((): boolean => {
      for (const keyType of noNlKeys) {
        if (left.key === keyType /*|| right.key === keyType*/) return true;
      }
      return false;
    })();

    if (!noNl) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitValue -> ids

  protected enter_ids(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('id', node.value);
  }

  // bitmark -> bits -> bitValue -> externalIds

  protected enter_externalIds(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('externalId', node.value);
  }

  // bitmark -> bits -> bitValue -> ageRanges

  protected enter_ageRanges(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('ageRange', node.value);
  }

  // bitmark -> bits -> bitValue -> languages

  protected enter_languages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('language', node.value);
  }

  // bitmark -> bits -> bitValue -> computerLanguages

  protected enter_computerLanguages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('computerLanguage', node.value);
  }

  // bitmark -> bits -> bitValue -> coverImages

  protected enter_coverImages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('coverImage', node.value);
  }

  // bitmark -> bits -> bitValue -> publishers

  protected enter_publishers(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('publisher', node.value);
  }

  // bitmark -> bits -> bitValue -> publications

  protected enter_publications(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('publication', node.value);
  }

  // bitmark -> bits -> bitValue -> authors

  protected enter_authors(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('author', node.value);
  }

  // bitmark -> bits -> bitValue -> dates

  protected enter_dates(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('date', node.value);
  }

  // bitmark -> bits -> bitValue -> locations

  protected enter_locations(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('location', node.value);
  }

  // bitmark -> bits -> bitValue -> themes

  protected enter_themes(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('theme', node.value);
  }

  // bitmark -> bits -> bitValue -> kinds

  protected enter_kinds(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('kind', node.value);
  }

  // bitmark -> bits -> bitValue -> actions

  protected enter_actions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('action', node.value);
  }

  // bitmark -> bits -> bitValue -> thumbImages

  protected enter_thumbImages(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('thumbImage', node.value);
  }

  // bitmark -> bits -> bitValue -> durations

  protected enter_durations(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('duration', node.value);
  }

  // bitmark -> bits -> bitValue -> deepLinks

  protected enter_deepLinks(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('deeplink', node.value);
  }

  // bitmark -> bits -> bitValue -> videoCallLinks

  protected enter_videoCallLinks(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('videoCallLink', node.value);
  }

  // bitmark -> bits -> bitValue -> bots

  protected enter_bots(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('bot', node.value);
  }

  //  bitmark -> bits -> referenceProperties

  protected enter_referenceProperties(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('reference', node.value);
  }

  // bitmark -> bits -> bitValue -> lists

  protected enter_lists(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('list', node.value);
  }

  // bitmark -> bits -> bitValue -> itemLead

  protected enter_itemLead(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const itemLead = node.value as ItemLead;
    if (itemLead && (itemLead.item || itemLead.lead)) {
      // Always write item if item or lead is set
      this.writeOPC();
      this.writeString(itemLead.item);
      this.writeCL();

      if (itemLead.lead) {
        this.writeOPC();
        this.writeString(itemLead.lead);
        this.writeCL();
      }
    }
  }

  // bitmark -> bits -> bitValue -> body

  protected enter_body(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // always write a NL before the body content if there is any?
    const body = node.value as Body;
    if (body.length > 0) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions

  protected enter_solutions(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const solutions = node.value as Solution[];
    if (solutions && solutions.length === 0) {
      // If there are no solutions, we need to write the special cloze gap [_] to indicate this
      this.writeOPU();
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue -> elements

  protected enter_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_elements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  protected exit_elements(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMajorDivider();
  }

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions

  // bitmark -> bits -> bitValue -> body -> bodyValue -> select

  // bitmark -> bits -> bitValue -> body -> bodyValue -> select -> options

  // bitmark -> bits -> bitValue -> body -> bodyValue -> select -> options -> optionsValue

  protected enter_optionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const selectOption = node.value as SelectOption;
    if (selectOption.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(selectOption.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> body -> bodyValue -> highlight

  // bitmark -> bits -> bitValue -> body -> bodyValue -> highlight -> texts

  // bitmark -> bits -> bitValue -> body -> bodyValue -> highlight -> texts -> textsValue

  protected enter_textsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const highlightText = node.value as HighlightText;
    if (highlightText.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(highlightText.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> statements

  protected enter_statements(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
    const isStatementDivider = this.isStatementDivider(route);

    if (isStatementDivider) {
      this.writeMajorDivider();
      this.writeNL();
    }
  }

  protected between_statements(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    route: NodeInfo[],
  ): void {
    const isStatementDivider = this.isStatementDivider(route);

    if (isStatementDivider) {
      this.writeNL();
      this.writeMajorDivider();
    }
    this.writeNL();
  }

  protected exit_statements(_node: NodeInfo, _parent: NodeInfo | undefined, route: NodeInfo[]): void {
    const isStatementDivider = this.isStatementDivider(route);

    if (isStatementDivider) {
      this.writeNL();
      this.writeMajorDivider();
    }
  }

  // bitmark -> bits -> bitValue -> statements -> statementsValue

  protected enter_statementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const statement = node.value as Statement;
    if (statement.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(statement.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> choices
  // bitmark -> bits -> bitValue -> quizzes -> quizzesValue -> choices

  protected between_choices(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  protected exit_choices(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> choices -> choicesValue

  protected enter_choicesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const choice = node.value as Choice;
    if (choice.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(choice.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> responses

  protected between_responses(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
  }

  protected exit_responses(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> responses -> responsesValue

  protected enter_responsesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const response = node.value as Response;
    if (response.isCorrect) {
      this.writeOPP();
    } else {
      this.writeOPM();
    }
    this.write(response.text);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> quizzes

  protected enter_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_quizzes(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_quizzes(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> quizzes -> quizzesValue

  protected between_quizzesValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    if (right.key === AstNodeType.choices || right.key === AstNodeType.responses) {
      this.writeNL();
    }
  }

  // bitmark -> bits -> bitValue -> heading

  protected enter_heading(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
    const heading = node.value as Heading;

    // Ensure the heading is valid for writing out (it will be valid, but if it is empty, it should not be written)
    let valid = false;
    if (heading && heading.forKeys /*&& heading.forValues && heading.forValues.length > 0*/) {
      valid = true;
    }

    if (!valid) return false;

    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_heading(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMinorDivider();
    this.writeNL();
  }

  protected exit_heading(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    // this.writeMajorDivider();
    // this.writeNL();
  }

  // bitmark -> bits -> bitValue -> heading -> forValues

  protected enter_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  protected between_forValues(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMinorDivider();
    this.writeNL();
  }

  protected exit_forValues(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    //
  }

  // bitmark -> bits -> bitValue -> pairs

  protected enter_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_pairs(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_pairs(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue

  protected between_pairsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    // this.writeMinorDivider();
    // this.writeNL();
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> keyAudio

  protected enter_keyAudio(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.writeResource(node, parent, route);
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> keyImage

  protected enter_keyImage(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.writeResource(node, parent, route);
  }

  // bitmark -> bits -> bitValue -> matrix

  protected enter_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_matrix(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_matrix(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> matrix -> matrixValue

  protected between_matrixValue(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    // this.writeNL();
    // this.writeMinorDivider();
    // this.writeNL();
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values
  // bitmark -> bits -> bitValue -> matrix -> matrixValue -> cells -> cellsValue -> values

  protected enter_values(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
    this.writeMinorDivider();
    this.writeNL();
  }

  protected between_values(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeNL();
    this.writeElementDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> questions

  protected enter_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected between_questions(
    _node: NodeInfo,
    _left: NodeInfo,
    _right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  protected exit_questions(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeMajorDivider();
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> questions -> questionsValue

  protected between_questionsValue(
    _node: NodeInfo,
    _left: NodeInfo,
    right: NodeInfo,
    _parent: NodeInfo | undefined,
    _route: NodeInfo[],
  ): void {
    if (right.key === AstNodeType.sampleSolution) {
      this.writeNL();
    }
  }

  protected exit_questionsValue(_node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeNL();
  }

  // bitmark -> bits -> bitValue -> resource

  protected enter_resource(node: NodeInfo, parent: NodeInfo | undefined, route: NodeInfo[]): boolean | void {
    // This is a resource, so handle it with the common code
    this.writeResource(node, parent, route);
  }

  // bitmark -> bits -> bitValue -> resource -> posterImage

  protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const posterImage = node.value as ImageResource;
    if (posterImage && posterImage.url) {
      this.writeProperty('posterImage', posterImage.url);
    }
  }

  // bitmark -> bits -> bitValue -> resource -> ...
  // bitmark -> bits -> bitValue -> resource -> posterImage -> ...
  // bitmark -> bits -> bitValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  // protected enter_posterImage(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
  //   this.writeProperty('posterImage', node.value);
  // }

  //
  // Terminal nodes (leaves)
  //

  // bitmark -> bits -> bitValue -> bitType

  // bitmark -> bits -> bitValue -> textFormat

  //  bitmark -> bits -> title

  protected leaf_title(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const title = node.value;
    const bit = parent?.value as Bit;
    const level = bit.level || 1;
    if (level && title) {
      this.writeOP();
      for (let i = 0; i < level; i++) this.writeHash();
      this.writeString(title);
      this.writeCL();
    }
  }

  //  bitmark -> bits -> subtitle

  protected leaf_subtitle(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const subtitle = node.value;
    const level = 2;
    if (level && subtitle) {
      this.writeOP();
      for (let i = 0; i < level; i++) this.writeHash();
      this.writeString(subtitle);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue -> book

  protected leaf_book(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = parent?.value as Bit;

    if (bit && node.value) {
      this.writeProperty('book', node.value);
      if (bit.reference) {
        this.writeOPRANGLE();
        this.writeString(bit.reference);
        this.writeCL();

        if (bit.referenceEnd) {
          this.writeOPRANGLE();
          this.writeString(bit.referenceEnd);
          this.writeCL();
        }
      }
    }
  }

  //  bitmark -> bits -> bitValue -> anchor

  protected leaf_anchor(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDANGLE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  //  bitmark -> bits -> bitValue -> reference

  protected leaf_reference(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = parent?.value as Bit;

    if (bit && node.value) {
      // Only write reference if it is not chained to 'book'
      if (!bit.book) {
        this.writeOPRANGLE();
        this.writeString(node.value);
        this.writeCL();
      }
    }
  }

  //  bitmark -> bits -> bitValue -> externalLink

  protected leaf_externalLink(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeProperty('externalLink', node.value);
    }
  }

  //  bitmark -> bits -> bitValue -> externalLinkText

  protected leaf_externalLinkText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeProperty('externalLinkText', node.value);
    }
  }

  //  bitmark -> bits -> bitValue -> labelTrue

  protected leaf_labelTrue(node: NodeInfo, parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const bit = parent?.value as Bit;
    if (bit) {
      this.writeProperty('labelTrue', node.value ?? '');
      this.writeProperty('labelFalse', bit.labelFalse ?? '');
    }
  }

  //  bitmark -> bits -> bitValue -> quotedPerson

  protected leaf_quotedPerson(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeProperty('quotedPerson', node.value);
    }
  }

  //  * -> itemLead --> item

  //  * -> itemLead --> lead

  //  * -> hint

  protected leaf_hint(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPQ();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue ->  * -> instruction

  protected leaf_instruction(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPB();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue ->  * -> example

  protected leaf_example(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    const example = node.value;

    if (example) {
      this.writeOPA();
      this.writeString('example');

      if (example !== true && example !== '') {
        this.writeColon();
        this.writeString(example as string);
      }

      this.writeCL();
    }
  }

  // bitmark -> bits -> body -> bodyValue -> bodyText

  protected leaf_bodyText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> footer -> footerText

  protected leaf_footerText(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitValue -> elements -> elementsValue

  protected leaf_elementsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitValue -> body -> bodyValue -> gap -> solutions -> solution
  // ? -> solutions -> solution

  protected leaf_solutionsValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPU();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue-> body -> bodyValue -> select -> options -> prefix
  // bitmark -> bits -> bitValue-> body -> bodyValue -> highlight -> options -> prefix

  protected leaf_prefix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPRE();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue-> body -> bodyValue -> select -> options -> postfix
  // bitmark -> bits -> bitValue-> body -> bodyValue -> highlight -> options -> postfix

  protected leaf_postfix(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPPOST();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue ->  * -> isCaseSensitive

  // bitmark -> bits -> bitValue ->  * -> isLongAnswer

  // bitmark -> bits -> bitValue ->  * -> isCorrect

  // bitmark -> bits -> bitValue -> heading -> forKeys

  protected leaf_forKeys(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> heading -> forValuesValue

  protected leaf_forValuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeOPHASH();
    this.writeString(node.value);
    this.writeCL();
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> key
  // bitmark -> bits -> bitValue -> matrix -> matrixValue -> key

  protected leaf_key(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitValue -> pairs -> pairsValue -> values -> valuesValue
  // bitmark -> bits -> bitValue -> matrix -> matrixValue -> cells -> cellsValue -> values -> valuesValue

  protected leaf_valuesValue(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
    }
  }

  // bitmark -> bits -> bitValue -> questions -> questionsValue -> question

  protected leaf_question(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeString(node.value);
      // this.writeNL();
    }
  }

  // bitmark -> bits -> bitValue -> questions -> questionsValue -> sampleSolution

  protected leaf_sampleSolution(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value) {
      this.writeOPDOLLAR();
      this.writeString(node.value);
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue -> questions -> questionsValue -> question -> isShortAnswer

  protected leaf_isShortAnswer(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    if (node.value === true) {
      this.writeOPA();
      this.writeString('shortAnswer');
      this.writeCL();
    }
  }

  // bitmark -> bits -> bitValue -> statements -> text

  // bitmark -> bits -> bitValue -> resource -> ...
  // bitmark -> bits -> bitValue -> resource -> posterImage -> ...
  // bitmark -> bits -> bitValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [src1x,src2x,src3x,src4x,width,height,alt,caption]

  protected leaf_src1x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src1x', node.value);
  }

  protected leaf_src2x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src2x', node.value);
  }

  protected leaf_src3x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src3x', node.value);
  }

  protected leaf_src4x(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('src4x', node.value);
  }

  protected leaf_width(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('width', node.value);
  }

  protected leaf_height(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('height', node.value);
  }

  protected leaf_alt(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('alt', node.value);
  }

  protected leaf_caption(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('caption', node.value);
  }

  // bitmark -> bits -> bitValue -> resource -> ...
  // bitmark -> bits -> bitValue -> resource -> posterImage -> ...
  // bitmark -> bits -> bitValue -> resource -> thumbnails -> thumbnailsValue -> ...
  // [duration,mute,autoplay,allowSubtitles,showSubtitles]

  protected leaf_duration(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('duration', node.value);
  }

  protected leaf_mute(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('mute', node.value);
  }

  protected leaf_autoplay(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('autoplay', node.value);
  }

  protected leaf_allowSubtitles(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('allowSubtitles', node.value);
  }

  protected leaf_showSubtitles(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): void {
    this.writeProperty('showSubtitles', node.value);
  }

  // END NODE HANDLERS

  //
  // WRITE FUNCTIONS
  //

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

  protected writeOPD(): void {
    this.write('[.');
  }

  protected writeOPU(): void {
    this.write('[_');
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
    this.write(']');
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

  protected writeMajorDivider(): void {
    this.write('===');
  }

  protected writeMinorDivider(): void {
    this.write('==');
  }

  protected writeElementDivider(): void {
    this.write('--');
  }

  protected writeNL(): void {
    if (this.options.debugGenerationInline) {
      this.write('\\n');
      return;
    }
    this.write('\n');
  }

  protected writeResource(node: NodeInfo, _parent: NodeInfo | undefined, _route: NodeInfo[]): boolean | void {
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

      this.writeOPAMP();
      this.writeString(resource.type);
      if (resource.type === ResourceType.article && resourceAsArticle.body) {
        this.writeColon();
        // this.writeNL();
        this.writeString(resourceAsArticle.body);
        this.writeNL();
      } else if (resource.url) {
        this.writeColon();
        this.writeString(resource.url);
      }
      this.writeCL();
    }
  }

  protected writeProperty(name: string, values?: unknown | unknown[]): void {
    if (values !== undefined) {
      if (!Array.isArray(values)) {
        values = [values];
      }

      for (const val of values as []) {
        if (val !== undefined) {
          this.writeOPA();
          this.writeString(name);
          this.writeColon();
          this.writeString(`${val}`);
          this.writeCL();
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

  protected isWriteTextFormat(bitValue: string): boolean {
    const isMinusMinus = TextFormat.fromValue(bitValue) === TextFormat.bitmarkMinusMinus;
    const writeFormat = !isMinusMinus || this.options.explicitTextFormat;
    return !!writeFormat;
  }

  protected isStatementDivider(route: NodeInfo[]) {
    const bitType = this.getBitType(route);
    return !(bitType === BitType.trueFalse1);
  }

  protected getBitType(route: NodeInfo[]): BitTypeType | undefined {
    for (const node of route) {
      if (node.key === AstNodeType.bitsValue) {
        const n = node.value as Bit;
        return n?.bitType;
      }
    }

    return undefined;
  }
}

export { BitmarkMarkupGenerator };
