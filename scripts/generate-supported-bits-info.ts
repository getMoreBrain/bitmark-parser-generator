/*

ISC License

Copyright ©2023 Get More Brain

*/

import * as fs from 'fs-extra';

import { BitmarkParserGenerator } from '../src/BitmarkParserGenerator';
import { InfoType } from '../src/model/info/enum/InfoType';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class GeneratedSupportedBitsInfo {
  async run(): Promise<void> {
    const version = bitmarkParserGenerator.version();

    const info = bitmarkParserGenerator.info({
      type: InfoType.all,
      // type: InfoType.bit,
      // bit: RootBitType.cloze,
      // outputFormat: InfoFormat.json,
      // prettify: true,
    });

    await fs.writeFile(
      'SUPPORTED_BITS.md',
      `# bitmark-parser-generator

Version: ${version}
## Supported Bits
<pre>\n${info}\n</pre>`,
    );
  }
}

const instance = new GeneratedSupportedBitsInfo();

instance.run().then(() => {
  // Done
});
