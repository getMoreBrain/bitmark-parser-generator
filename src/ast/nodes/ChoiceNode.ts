import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { ChoiceTextNode } from './ChoiceTextNode';
import { ExampleNode } from './ExampleNode';
import { HintNode } from './HintNode';
import { InstructionNode } from './InstructionNode';
import { IsCaseSensitiveNode } from './IsCaseSensitiveNode';
import { IsCorrectNode } from './IsCorrectNode';
import { ItemLeadNode } from './ItemLeadNode';

type Children = (
  | ChoiceTextNode
  | IsCorrectNode
  | ItemLeadNode
  | HintNode
  | InstructionNode
  | ExampleNode
  | IsCaseSensitiveNode
)[];

class ChoiceNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.choice;
  text: ChoiceTextNode;
  isCorrect: IsCorrectNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;
  isCaseSensitive?: IsCaseSensitiveNode;

  static create(
    text: string,
    isCorrect: boolean,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): ChoiceNode {
    const choiceTextNode = ChoiceTextNode.create(text);
    const isCorrectNode = IsCorrectNode.create(isCorrect ?? false) as IsCorrectNode;
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);
    const isCaseSensitiveNode = IsCaseSensitiveNode.create(isCaseSensitive);
    const node = new ChoiceNode(
      choiceTextNode,
      isCorrectNode,
      itemLeadNode,
      hintNode,
      instructionNode,
      exampleNode,
      isCaseSensitiveNode,
    );

    node.validate();

    return node;
  }

  protected constructor(
    text: ChoiceTextNode,
    isCorrect: IsCorrectNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
    isCaseSensitive?: IsCaseSensitiveNode,
  ) {
    super();
    this.text = text;
    this.isCorrect = isCorrect;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
    this.isCaseSensitive = isCaseSensitive;
  }

  protected buildChildren(): Children {
    const children: Children = [this.text];

    if (this.isCorrect) children.push(this.isCorrect);
    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.isCaseSensitive) children.push(this.isCaseSensitive);

    return children;
  }

  protected validate(): void {
    NodeValidator.isRequired(this.text, 'text');
    NodeValidator.isRequired(this.isCorrect, 'isCorrect');
  }
}

export { ChoiceNode };
