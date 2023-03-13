import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseBranchNode } from './BaseBranchNode';
import { QuizNode } from './QuizNode';

type Children = QuizNode[];

class QuizzesNode extends BaseBranchNode<Children> implements AstNode {
  type = AstNodeType.quizzes;
  quizNodes: QuizNode[];

  static create(quizNodes?: QuizNode[]): QuizzesNode | undefined {
    if (!quizNodes || quizNodes.length === 0) return undefined;

    const node = new QuizzesNode(quizNodes);

    node.validate();

    return node;
  }

  protected constructor(quizNodes: QuizNode[]) {
    super();
    this.quizNodes = quizNodes;
  }

  protected buildChildren(): Children {
    const children: Children = [...this.quizNodes];

    return children;
  }

  protected validate(): void {
    NodeValidator.isNonEmptyArray(this.quizNodes, 'quizNodes');
  }
}

export { QuizzesNode };
