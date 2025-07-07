/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';
import { InfoType } from '../../../src/model/info/enum/InfoType.ts';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevConfig {
  async run(): Promise<void> {
    const info = bitmarkParserGenerator.info({
      type: InfoType.all,
      // type: InfoType.bit,
      // bit: RootBitType.cloze,
      // outputFormat: InfoFormat.json,
      // prettify: true,
    });
    console.log(`<pre>\n${info}\n</pre>`);
  }
}

const instance = new DevConfig();

void instance.run().then(() => {
  // Done
});
