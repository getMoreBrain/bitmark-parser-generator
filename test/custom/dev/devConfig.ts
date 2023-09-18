/*

ISC License

Copyright ©2023 Get More Brain

*/

import { BitmarkParserGenerator } from '../../../src/BitmarkParserGenerator';

const bitmarkParserGenerator = new BitmarkParserGenerator();

class DevConfig {
  async run(): Promise<void> {
    const config = bitmarkParserGenerator.config();
    const configJson = JSON.stringify(config, undefined, 2);
    console.log(configJson);
  }
}

const instance = new DevConfig();

instance.run().then(() => {
  // Done
});
