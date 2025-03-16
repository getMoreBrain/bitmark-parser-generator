/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';
import { InfoType } from '../../../src/model/info/enum/InfoType';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevConfig {
  async run(): Promise<void> {
    const info = await bitmarkParserGenerator.info({
      type: InfoType.all,
      // type: InfoType.bit,
      // bit: BitType.cloze,
      // outputFormat: InfoFormat.json,
      // prettify: true,
    });
    console.log(info);
  }
}

const instance = new DevConfig();

void instance.run().then(() => {
  // Done
});
