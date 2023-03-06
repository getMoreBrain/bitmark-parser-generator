/*

ISC License

Copyright ©2023 Get More Brain

*/

import fs from 'fs-extra';

import { BitmarkJson } from './ast/tools/BitmarkJson';
import { StreamBitmarkGenerator } from './ast/tools/StreamBitmarkGenerator';

class Bmg {
  helloWorld(): void {
    console.log('Hello World\n\n');
  }

  async test(): Promise<void> {
    // const json = await fs.readJson('./assets/example/article.json');
    const json = await fs.readJson('./assets/example/cloze-solution-grouped.json');

    // Convert the bitmark JSON to bitmark AST
    const bitmarkAst = BitmarkJson.toAst(json);

    // Generate markup code from AST
    const generator = new StreamBitmarkGenerator(
      './bitmark.txt',
      {
        flags: 'w',
      },
      {
        explicitTextFormat: true,
      },
    );

    generator.generate(bitmarkAst);
  }
}

const bmg = new Bmg();
bmg.helloWorld();

bmg.test().then(() => {
  console.log('END');
});

export { bmg };
export type { Bmg };
