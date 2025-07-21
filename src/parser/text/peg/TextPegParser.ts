import { parse as _parse } from '../../../generated/parser/text/text-peggy-parser.js';
import { type TextAst } from '../../../model/ast/TextNodes.ts';

interface ParseOptions {
  startRule?: string;
}

type Parse = (str: string, options?: ParseOptions) => TextAst | string;

const parse: Parse = _parse;

export { parse };
