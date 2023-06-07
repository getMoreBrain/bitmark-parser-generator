import { parse as _parse } from '../../../generated/parser/text/text-peggy-parser.js';
import { TextAst } from '../../../model/ast/TextNodes.js';

interface ParseOptions {
  startRule?: string;
}
type Parse = (str: string, options?: ParseOptions) => TextAst;

const parse: Parse = _parse;

export { parse };
