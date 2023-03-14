import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';
import { ExampleNode } from '../generic/ExampleNode';
import { HintNode } from '../generic/HintNode';
import { InstructionNode } from '../generic/InstructionNode';
import { IsCaseSensitiveNode } from '../generic/IsCaseSensitiveNode';
import { ItemLeadNode } from '../generic/ItemLeadNode';

import { SolutionsNode } from './SolutionsNode';

type Children = (SolutionsNode | ItemLeadNode | HintNode | InstructionNode | ExampleNode | IsCaseSensitiveNode)[];

class GapNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.gap;
  solutionsNode: SolutionsNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;
  isCaseSensitive?: IsCaseSensitiveNode;

  static create(
    solutions: string[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): GapNode {
    const solutionsNode = SolutionsNode.create(solutions);
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);
    const isCaseSensitiveNode = IsCaseSensitiveNode.create(isCaseSensitive);

    const node = new GapNode(solutionsNode, itemLeadNode, hintNode, instructionNode, exampleNode, isCaseSensitiveNode);

    node.validate();

    return node;
  }

  protected constructor(
    solutionsNode: SolutionsNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
    isCaseSensitive?: IsCaseSensitiveNode,
  ) {
    super();
    this.solutionsNode = solutionsNode;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
    this.isCaseSensitive = isCaseSensitive;
  }

  protected buildChildren(): Children {
    const children: Children = [this.solutionsNode];

    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.isCaseSensitive) children.push(this.isCaseSensitive);

    return children;
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.solutionsNode, 'solutionsNode');
  }
}

export { GapNode };
