import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

export type ExampleType = string | boolean;

class ExampleNode extends BaseValueNode<ExampleType> implements AstNode {
  type = AstNodeType.example;

  static create(example?: ExampleType): ExampleNode | undefined {
    const node = example ? new ExampleNode(example) : undefined;

    if (node) node.validate();

    return node;
  }

  protected constructor(example: ExampleType) {
    super(example);
  }

  protected validate(): void {
    NodeValidator.isNonEmptyStringOrBoolean(this.value, 'example');
  }
}

export { ExampleNode };
