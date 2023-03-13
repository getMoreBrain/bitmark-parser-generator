import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { ExampleNode } from './ExampleNode';
import { HintNode } from './HintNode';
import { InstructionNode } from './InstructionNode';
import { IsCaseSensitiveNode } from './IsCaseSensitiveNode';
import { ItemLeadNode } from './ItemLeadNode';
import { PostfixNode } from './PostfixNode';
import { PrefixNode } from './PrefixNode';
import { SelectOptionsNode } from './SelectOptionsNode';

type Children = (
  | SelectOptionsNode
  | PrefixNode
  | PostfixNode
  | ItemLeadNode
  | HintNode
  | InstructionNode
  | ExampleNode
  | IsCaseSensitiveNode
)[];

class SelectNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.select;
  optionsNode: SelectOptionsNode;
  prefix?: PrefixNode;
  postfix?: PostfixNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;
  isCaseSensitive?: IsCaseSensitiveNode;

  static create(
    optionsNode: SelectOptionsNode,
    prefix?: string,
    postfix?: string,
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
    isCaseSensitive?: boolean,
  ): SelectNode {
    const prefixNode = PrefixNode.create(prefix);
    const postfixNode = PostfixNode.create(postfix);
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);
    const isCaseSensitiveNode = IsCaseSensitiveNode.create(isCaseSensitive);
    const node = new SelectNode(
      optionsNode,
      prefixNode,
      postfixNode,
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
    optionsNode: SelectOptionsNode,
    prefix?: PrefixNode,
    postfix?: PostfixNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
    isCaseSensitive?: IsCaseSensitiveNode,
  ) {
    super();
    this.optionsNode = optionsNode;
    this.prefix = prefix;
    this.postfix = postfix;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
    this.isCaseSensitive = isCaseSensitive;
  }

  protected buildChildren(): Children {
    const children: Children = [this.optionsNode];

    if (this.prefix) children.push(this.prefix);
    if (this.postfix) children.push(this.postfix);
    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.isCaseSensitive) children.push(this.isCaseSensitive);

    return children;
  }

  protected validate(): void {
    // Check
    NodeValidator.isRequired(this.optionsNode, 'optionsNode');
  }
}

export { SelectNode };
