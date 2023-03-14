import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { NodeValidator } from '../../tools/NodeValidator';
import { BaseBranchNode } from '../BaseBranchNode';
import { ChoiceNode } from '../choice/ChoiceNode';
import { ChoicesNode } from '../choice/ChoicesNode';
import { ExampleNode } from '../generic/ExampleNode';
import { HintNode } from '../generic/HintNode';
import { InstructionNode } from '../generic/InstructionNode';
import { ItemLeadNode } from '../generic/ItemLeadNode';
import { ResponseNode } from '../response/ResponseNode';
import { ResponsesNode } from '../response/ResponsesNode';

type Children = (ChoicesNode | ResponsesNode | ItemLeadNode | HintNode | InstructionNode | ExampleNode)[];

class QuizNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.quiz;
  choices?: ChoicesNode;
  responses?: ResponsesNode;
  itemLead?: ItemLeadNode;
  hint?: HintNode;
  instruction?: InstructionNode;
  example?: ExampleNode;

  static create(
    choiceNodes?: ChoiceNode[],
    responsesNodes?: ResponseNode[],
    item?: string,
    lead?: string,
    hint?: string,
    instruction?: string,
    example?: string | boolean,
  ): QuizNode {
    const choicesNode = ChoicesNode.create(choiceNodes);
    const responsesNode = ResponsesNode.create(responsesNodes);
    const itemLeadNode = ItemLeadNode.create(item, lead);
    const hintNode = HintNode.create(hint);
    const instructionNode = InstructionNode.create(instruction);
    const exampleNode = ExampleNode.create(example);

    const node = new QuizNode(choicesNode, responsesNode, itemLeadNode, hintNode, instructionNode, exampleNode);

    node.validate();

    return node;
  }

  protected constructor(
    choices?: ChoicesNode,
    responses?: ResponsesNode,
    itemLead?: ItemLeadNode,
    hint?: HintNode,
    instruction?: InstructionNode,
    example?: ExampleNode,
  ) {
    super();
    this.choices = choices;
    this.responses = responses;
    this.itemLead = itemLead;
    this.hint = hint;
    this.instruction = instruction;
    this.example = example;
  }

  protected buildChildren(): Children {
    const children: Children = [];

    // NOTE: choices/responses should go at the end (they are like the 'body' of the quiz)
    if (this.itemLead) children.push(this.itemLead);
    if (this.hint) children.push(this.hint);
    if (this.instruction) children.push(this.instruction);
    if (this.example) children.push(this.example);
    if (this.choices) children.push(this.choices);
    if (this.responses) children.push(this.responses);

    return children;
  }

  protected validate(): void {
    NodeValidator.isOneOfRequired([this.choices, this.responses], ['choices', 'responses']);
  }
}

export { QuizNode };
