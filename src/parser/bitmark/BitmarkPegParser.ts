import { parse as _parse } from '../../generated/parser/bitmark/bitmark-peggy-parser.js';
import { BitmarkAst } from '../../model/ast/Nodes.js';

interface ParseOptions {
  startRule?: string;
}
type Parse = (str: string, options?: ParseOptions) => BitmarkAst;

const parse: Parse = _parse;

export { parse };
