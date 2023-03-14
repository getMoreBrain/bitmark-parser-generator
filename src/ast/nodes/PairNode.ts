import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { ExampleNode } from './ExampleNode';
import { HintNode } from './HintNode';
import { InstructionNode } from './InstructionNode';
import { IsCaseSensitiveNode } from './IsCaseSensitiveNode';
import { IsLongAnswerNode } from './IsLongAnswerNode';
import { ItemLeadNode } from './ItemLeadNode';
import { PairKeyNode } from './PairKeyNode';
import { PairValuesNode } from './PairValuesNode';

type Children = (
  | PairKeyNode
  | PairValuesNode
  | ItemLeadNode
  | HintNode
  | InstructionNode
  | ExampleNode
  | IsCaseSensitiveNode
  | IsLongAnswerNode
)[];

class PairNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.pair;
  key: PairKeyNode;
  values?: PairValuesNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;
  isCaseSensitive?: IsCaseSensitiveNode;
  isLongAnswer?: IsLongAnswerNode;

  static create(
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
    const keyNode = PairKeyNode.create(key);
    const valuesNode = PairValuesNode.create(values);
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);
    const isCaseSensitiveNode = IsCaseSensitiveNode.create(isCaseSensitive);
    const isLongAnswerNode = IsLongAnswerNode.create(isLongAnswer ?? false);

    const node = new PairNode(
      keyNode,
      valuesNode,
      itemLeadNode,
      hintNode,
      instructionNode,
      exampleNode,
      isCaseSensitiveNode,
      isLongAnswerNode,
    );

    node.validate();

    return node;
  }

  protected constructor(
    key: PairKeyNode,
    values?: PairValuesNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
    isCaseSensitive?: IsCaseSensitiveNode,
    isLongAnswer?: IsLongAnswerNode,
  ) {
    super();
    this.key = key;
    this.values = values;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
    this.isCaseSensitive = isCaseSensitive;
    this.isLongAnswer = isLongAnswer;
  }

  protected buildChildren(): Children {
    const children: Children = [];

    // NOTE: values should go at the end (they are like the 'body' of the pair)
    if (this.itemLead) children.push(this.itemLead);
    children.push(this.key);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.isCaseSensitive) children.push(this.isCaseSensitive);
    if (this.isLongAnswer) children.push(this.isLongAnswer);
    if (this.values) children.push(this.values);

    return children;
  }

  protected validate(): void {
    NodeValidator.isRequired(this.key, 'key');
    NodeValidator.isRequired(this.values, 'values');
  }
}

export { PairNode };
