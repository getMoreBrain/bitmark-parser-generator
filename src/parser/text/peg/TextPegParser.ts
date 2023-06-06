import { parse as _parse } from '@getmorebrain/bitmark-peg-parse-helpers';

interface ParseOptions {
  startRule?: string;
}
type Parse = (str: string, options?: ParseOptions) => unknown;

const parse: Parse = _parse;

export { parse };
