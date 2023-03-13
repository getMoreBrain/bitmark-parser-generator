import { BitNode } from '../nodes/BitNode';
import { BitmarkNode } from '../nodes/BitmarkNode';
import { BodyNode, BodyNodeTypes } from '../nodes/BodyNode';
import { BodyTextNode } from '../nodes/BodyTextNode';
import { ChoiceNode } from '../nodes/ChoiceNode';
import { GapNode } from '../nodes/GapNode';
import { QuizNode } from '../nodes/QuizNode';
import { ResponseNode } from '../nodes/ResponseNode';
import { SelectNode } from '../nodes/SelectNode';
import { SelectOptionNode } from '../nodes/SelectOptionNode';
import { StatementNode } from '../nodes/StatementNode';
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
