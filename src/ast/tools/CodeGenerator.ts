import { AstNodeTypeType } from '../AstNodeType';
import { Node } from '../nodes/BitmarkNodes';

export interface CodeGenerator {
  generate: (root: Node, rootType?: AstNodeTypeType) => Promise<void | string>;
}
