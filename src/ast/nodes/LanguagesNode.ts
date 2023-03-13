import { AstNodeType } from '../AstNodeType';
import { AstNode } from '../Ast';
import { NodeValidator } from '../tools/NodeValidator';

import { BaseValueNode } from './BaseLeafNode';

class LanguagesNode extends BaseValueNode<string[]> implements AstNode {
  type = AstNodeType.languages;

  static create(langs?: string | string[]): LanguagesNode | undefined {
    if (!langs || langs.length === 0) return undefined;
    if (!Array.isArray(langs)) langs = [langs];

    // Ensure langs are strings, converting if necessary
    langs = langs.map((lang) => `${lang}`);

    const node = new LanguagesNode(langs);

    node.validate();

    return node;
  }

  protected constructor(langs: string | string[]) {
    if (!Array.isArray(langs)) langs = [langs];

    super(langs);
  }

  protected validate(): void {
    // TODO - ensure valid languages
    NodeValidator.isNonEmptyArray(this.value, 'langs');
    for (const lang of this.value) {
      NodeValidator.isNonEmptyString(lang, 'lang');
    }
  }
}

export { LanguagesNode };
