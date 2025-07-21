/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevConfig {
  async run(): Promise<void> {
    const info = await bitmarkParserGenerator.generateConfig({
      //
    });
    console.log(info);
  }
}

const instance = new DevConfig();

void instance.run().then(() => {
  // Done
});
