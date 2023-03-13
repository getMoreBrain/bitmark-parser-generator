import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';
import { AttachmentTypeType } from '../types/AttachmentType';
import { BitTypeType } from '../types/BitType';
import { Property } from '../types/Property';
import { TextFormatType } from '../types/TextFormat';
import { Resource } from '../types/resources/Resource';

import { AgeRangesNode } from './AgeRangesNode';
import { BaseBranchNode } from './BaseBranchNode';
import { BitHeaderNode } from './BitHeaderNode';
import { BodyNode } from './BodyNode';
import { ChoiceNode } from './ChoiceNode';
import { ChoicesNode } from './ChoicesNode';
import { ExampleNode } from './ExampleNode';
import { HintNode } from './HintNode';
import { IdsNode } from './IdsNode';
import { InstructionNode } from './InstructionNode';
import { ItemLeadNode } from './ItemLeadNode';
import { LanguagesNode } from './LanguagesNode';
import { PropertiesNode } from './PropertiesNode';
import { ResourceNode } from './ResourceNode';

type Children = (
  | BitHeaderNode
  | IdsNode
  | AgeRangesNode
  | LanguagesNode
  | PropertiesNode
  | ItemLeadNode
  | HintNode
  | InstructionNode
  | ExampleNode
  | ChoicesNode
  | ResourceNode
  | BodyNode
)[];

class BitNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.bit;
  bitHeaderNode: BitHeaderNode;
  ids?: IdsNode;
  ageRanges?: AgeRangesNode;
  languages?: LanguagesNode;
  properties?: PropertiesNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;
  choices?: ChoicesNode;
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
    choices?: ChoiceNode[],
    resource?: Resource,
    body?: BodyNode,
  ): BitNode {
    const bitHeaderNode = BitHeaderNode.create(bitType, textFormat, attachmentType);
    const idsNode = IdsNode.create(ids);
    const ageRangesNode = AgeRangesNode.create(ageRanges);
    const languagesNode = LanguagesNode.create(languages);
    const propertiesNode = PropertiesNode.create(properties);
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);
    const choicesNode = ChoicesNode.create(choices);
    const resourceNode = ResourceNode.create(resource);
    const node = new BitNode(
      bitHeaderNode,
      idsNode,
      ageRangesNode,
      languagesNode,
      propertiesNode,
      itemLeadNode,
      hintNode,
      instructionNode,
      exampleNode,
      choicesNode,
      resourceNode,
      body,
    );

    node.validate();

    return node;
  }

  protected constructor(
    bitHeaderNode: BitHeaderNode,
    ids?: IdsNode,
    ageRanges?: AgeRangesNode,
    languages?: LanguagesNode,
    properties?: PropertiesNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
    choicesNode?: ChoicesNode,
    resource?: ResourceNode,
    body?: BodyNode,
  ) {
    super();
    this.bitHeaderNode = bitHeaderNode;
    this.ids = ids;
    this.ageRanges = ageRanges;
    this.languages = languages;
    this.properties = properties;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
    this.choices = choicesNode;
    this.resource = resource;
    this.body = body;
  }

  protected buildChildren(): Children {
    const children: Children = [this.bitHeaderNode];

    if (this.ids) children.push(this.ids);
    if (this.ageRanges) children.push(this.ageRanges);
    if (this.languages) children.push(this.languages);
    if (this.properties) children.push(this.properties);
    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.choices) children.push(this.choices);
    if (this.resource) children.push(this.resource);
    if (this.body) children.push(this.body);

    return children;
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.bitHeaderNode, 'bitHeaderNode');
  }
}

export { BitNode };
