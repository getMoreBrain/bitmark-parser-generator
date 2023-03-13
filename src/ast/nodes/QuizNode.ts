import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { ChoiceNode } from './ChoiceNode';
import { ChoicesNode } from './ChoicesNode';
import { ExampleNode } from './ExampleNode';
import { HintNode } from './HintNode';
import { InstructionNode } from './InstructionNode';
import { ItemLeadNode } from './ItemLeadNode';

type Children = (ChoicesNode | ItemLeadNode | HintNode | InstructionNode | ExampleNode)[];

class QuizNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.quiz;
  choices: ChoicesNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;

  static create(
    choiceNodes: ChoiceNode[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
  ): QuizNode {
    const choicesNode = ChoicesNode.create(choiceNodes) as ChoicesNode;
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);

    const node = new QuizNode(choicesNode, itemLeadNode, hintNode, instructionNode, exampleNode);

    node.validate();

    return node;
  }

  protected constructor(
    choices: ChoicesNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
  ) {
    super();
    this.choices = choices;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
  }

  protected buildChildren(): Children {
    const children: Children = [];

    // NOTE: choices should go at the end (they are like the 'body' of the quiz)
    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    children.push(this.choices);

    return children;
  }

  protected validate(): void {
    NodeValidator.isRequired(this.choices, 'choices');
  }
}

export { QuizNode };
