import { Bitmark } from './model/Nodes';

export interface CodeGenerator {
  generate: (bitmark: Bitmark) => Promise<void | string>;
}
