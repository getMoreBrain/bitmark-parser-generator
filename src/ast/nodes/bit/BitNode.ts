import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { AttachmentTypeType } from '../../types/AttachmentType';
import { BitTypeType } from '../../types/BitType';
import { Property } from '../../types/Property';
import { TextFormatType } from '../../types/TextFormat';
import { Resource } from '../../types/resources/Resource';
import { BaseBranchNode } from '../BaseBranchNode';
import { BodyNode } from '../body/BodyNode';
import { ChoiceNode } from '../choice/ChoiceNode';
import { ChoicesNode } from '../choice/ChoicesNode';
import { ElementsNode } from '../element/ElementsNode';
import { ExampleNode } from '../generic/ExampleNode';
import { HintNode } from '../generic/HintNode';
import { InstructionNode } from '../generic/InstructionNode';
import { ItemLeadNode } from '../generic/ItemLeadNode';
import { PairNode } from '../pair/PairNode';
import { PairsNode } from '../pair/PairsNode';
import { PropertiesNode } from '../property/PropertiesNode';
import { AgeRangesNode } from '../property/specific/AgeRangesNode';
import { IdsNode } from '../property/specific/IdsNode';
import { LanguagesNode } from '../property/specific/LanguagesNode';
import { QuizNode } from '../quiz/QuizNode';
import { QuizzesNode } from '../quiz/QuizzesNode';
import { ResourceNode } from '../resource/ResourceNode';
import { ResponseNode } from '../response/ResponseNode';
import { ResponsesNode } from '../response/ResponsesNode';
import { StatementNode } from '../statement/StatementNode';
import { StatementsNode } from '../statement/StatementsNode';

import { AttachmentTypeNode } from './AttachmentTypeNode';
import { BitTypeNode } from './BitTypeNode';
import { TextFormatNode } from './TextFormatNode';

type Children = (
  | BitTypeNode
  | TextFormatNode
  | AttachmentTypeNode
  | IdsNode
  | AgeRangesNode
  | LanguagesNode
  | PropertiesNode
  | ItemLeadNode
  | HintNode
  | InstructionNode
  | ExampleNode
  | ElementsNode
  | StatementsNode
  | ChoicesNode
  | ResponsesNode
  | QuizzesNode
  | PairsNode
  | ResourceNode
  | BodyNode
)[];

class BitNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.bit;
  bitType: BitTypeNode;
  textFormat: TextFormatNode;
  attachmentType?: AttachmentTypeNode;
  ids?: IdsNode;
  ageRanges?: AgeRangesNode;
  languages?: LanguagesNode;
  properties?: PropertiesNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;
  elements?: ElementsNode;
  statements?: StatementsNode;
  choices?: ChoicesNode;
  responses?: ResponsesNode;
  quizzes?: QuizzesNode;
  pairs?: PairsNode;
  resource?: ResourceNode;
  body?: BodyNode;

  static create(
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
    const bitTypeNode = BitTypeNode.create(bitType);
    const textFormatNode = TextFormatNode.create(textFormat);
    const attachmentTypeNode = AttachmentTypeNode.create(attachmentType);
    const idsNode = IdsNode.create(ids);
    const ageRangesNode = AgeRangesNode.create(ageRanges);
    const languagesNode = LanguagesNode.create(languages);
    const propertiesNode = PropertiesNode.create(properties);
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);
    const elementsNode = ElementsNode.create(elements);
    const statementsNode = StatementsNode.create(statements);
    const choicesNode = ChoicesNode.create(choices);
    const responsesNode = ResponsesNode.create(responses);
    const quizzesNode = QuizzesNode.create(quizzes);
    const pairsNode = PairsNode.create(pairs);
    const resourceNode = ResourceNode.create(resource);
    const node = new BitNode(
      bitTypeNode,
      textFormatNode,
      attachmentTypeNode,
      idsNode,
      ageRangesNode,
      languagesNode,
      propertiesNode,
      itemLeadNode,
      hintNode,
      instructionNode,
      exampleNode,
      elementsNode,
      statementsNode,
      choicesNode,
      responsesNode,
      quizzesNode,
      pairsNode,
      resourceNode,
      body,
    );

    node.validate();

    return node;
  }

  protected constructor(
    bitType: BitTypeNode,
    textFormat: TextFormatNode,
    attachmentType?: AttachmentTypeNode,
    ids?: IdsNode,
    ageRanges?: AgeRangesNode,
    languages?: LanguagesNode,
    properties?: PropertiesNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
    elementsNode?: ElementsNode,
    statementsNode?: StatementsNode,
    choicesNode?: ChoicesNode,
    responsesNode?: ResponsesNode,
    quizzesNode?: QuizzesNode,
    pairsNode?: PairsNode,
    resource?: ResourceNode,
    body?: BodyNode,
  ) {
    super();
    this.bitType = bitType;
    this.textFormat = textFormat;
    this.attachmentType = attachmentType;
    this.ids = ids;
    this.ageRanges = ageRanges;
    this.languages = languages;
    this.properties = properties;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
    this.elements = elementsNode;
    this.statements = statementsNode;
    this.choices = choicesNode;
    this.responses = responsesNode;
    this.quizzes = quizzesNode;
    this.pairs = pairsNode;
    this.resource = resource;
    this.body = body;
  }

  protected buildChildren(): Children {
    const children: Children = [this.bitType, this.textFormat];

    if (this.attachmentType) children.push(this.attachmentType);
    if (this.ids) children.push(this.ids);
    if (this.ageRanges) children.push(this.ageRanges);
    if (this.languages) children.push(this.languages);
    if (this.properties) children.push(this.properties);
    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.elements) children.push(this.elements);
    if (this.statements) children.push(this.statements);
    if (this.choices) children.push(this.choices);
    if (this.responses) children.push(this.responses);
    if (this.quizzes) children.push(this.quizzes);
    if (this.pairs) children.push(this.pairs);
    if (this.resource) children.push(this.resource);
    if (this.body) children.push(this.body);

    return children;
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.bitType, 'bitType');
    NodeValidator.isRequired(this.textFormat, 'textFormat');
  }
}

export { BitNode };
