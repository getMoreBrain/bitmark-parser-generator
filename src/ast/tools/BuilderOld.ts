import { BitNode } from '../nodes/bit/BitNode';
import { BitmarkNode } from '../nodes/bitmark/BitmarkNode';
import { BodyNode, BodyNodeTypes } from '../nodes/body/BodyNode';
import { BodyTextNode } from '../nodes/body/BodyTextNode';
import { ChoiceNode } from '../nodes/choice/ChoiceNode';
import { GapNode } from '../nodes/gap/GapNode';
import { PairNode } from '../nodes/pair/PairNode';
import { QuizNode } from '../nodes/quiz/QuizNode';
import { ResponseNode } from '../nodes/response/ResponseNode';
import { SelectNode } from '../nodes/select/SelectNode';
import { SelectOptionNode } from '../nodes/select/SelectOptionNode';
import { StatementNode } from '../nodes/statement/StatementNode';
import { AttachmentTypeType } from '../types/AttachmentType';
import { BitTypeType } from '../types/BitType';
import { Property } from '../types/Property';
import { TextFormatType } from '../types/TextFormat';
import { Resource } from '../types/resources/Resource';

class Builder {
  bitmark(bits: BitNode[]): BitmarkNode {
    const node = BitmarkNode.create(bits);

    return node;
  }

  bit(
    bitType: BitTypeType,
    textFormat?: TextFormatType,
    attachmentType?: AttachmentTypeType,
    ids?: string | string[],
    ageRanges?: number | number[],
    languages?: string | string[],
    properties?: Property[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    elements?: string[],
    statements?: StatementNode[],
    choices?: ChoiceNode[],
    responses?: ResponseNode[],
    quizzes?: QuizNode[],
    pairs?: PairNode[],
    resource?: Resource,
    body?: BodyNode,
  ): BitNode {
    return BitNode.create(
      bitType,
      textFormat,
      attachmentType,
      ids,
      ageRanges,
      languages,
      properties,
      item,
      lead,
      hint,
      instruction,
      example,
      elements,
      statements,
      choices,
      responses,
      quizzes,
      pairs,
      resource,
      body,
    );
  }

  choice(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): ChoiceNode {
    return ChoiceNode.create(text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive);
  }

  response(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): ResponseNode {
    return ResponseNode.create(text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive);
  }

  quiz(
    choiceNodes?: ChoiceNode[],
    responseNodes?: ResponseNode[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
  ): QuizNode {
    return QuizNode.create(choiceNodes, responseNodes, item, lead, hint, instruction, example);
  }

  pair(
    key: string,
    values: string[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
    isLongAnswer?: boolean,
  ): PairNode {
    return PairNode.create(key, values, item, lead, hint, instruction, example, isCaseSensitive, isLongAnswer);
  }

  body(bodyParts: BodyNodeTypes[]): BodyNode {
    return BodyNode.create(bodyParts);
  }

  bodyText(text: string): BodyTextNode {
    return BodyTextNode.create(text);
  }

  gap(
    solutions: string[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): GapNode {
    return GapNode.create(solutions, item, lead, hint, instruction, example, isCaseSensitive);
  }

  select(
    optionNodes: SelectOptionNode[],
    prefix?: string,
    postfix?: string,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): SelectNode {
    return SelectNode.create(optionNodes, prefix, postfix, item, lead, hint, instruction, example, isCaseSensitive);
  }

  selectOption(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): SelectOptionNode {
    return SelectOptionNode.create(text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive);
  }

  statement(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): StatementNode {
    return StatementNode.create(text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive);
  }
}

const builder = new Builder();

export { builder as Builder };
