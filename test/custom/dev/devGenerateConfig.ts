/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator.ts';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevConfig {
  async run(): Promise<void> {
    bitmarkParserGenerator.generateConfig({
      //
    });
  }
}

const instance = new DevConfig();

void instance.run().then(() => {
  // Done
});
