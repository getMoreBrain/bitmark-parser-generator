/*

ISC License

Copyright ©2023 Get More Brain

*/

import fs from 'fs-extra';

import { AstNodeType } from './ast/AstNodeType';
import { Ast, AstNode, AstNodeInfo } from './ast/Ast';
import { BitType } from './ast/json/bitType';
import { Bit } from './ast/json/bit';
import { Builder } from './ast/tools/Builder';
import { StreamBitmarkGenerator } from './ast/tools/StreamBitmarkGenerator';
import { BitmarkWriter } from './ast/tools/writer/BitmarkWriter';
import { StreamWriter } from './ast/tools/writer/StreamWriter';
import { Format } from './ast/types/Format';
import { bitmarkUtils } from './utils/bitmarkUtils';

// this.deserializer.process(message);
// this.converter.process(message);
// this.fragmenter.process(message);
// this.layouter.process(message);
// this.tokenizer.process(message);
// this.writer.process(message);

class Bmg {
  private ast = new Ast();

  helloWorld(): void {
    console.log('Hello World\n\n');
  }

  async test(): Promise<void> {
    debugger;

    const json = await fs.readJson('./assets/example/article.json');

    const bitWrappers = bitmarkUtils.preprocessJson(json);

    for (const bitWrapper of bitWrappers) {
      const { bit, bitmark } = bitWrapper;

      console.log(`${bitmark ?? ''}`);
      console.log('\n\n');

      // Transform to AST
      const rootNode = this.generateAst(bit);

      // Generate markup code from AST
      this.generateMarkup(rootNode);
    }
  }

  generateAst1(bit: Bit): AstNode {
    const ast = this.ast;
    const { type, body, format, id } = bit;

    // Root
    const rootNode = ast.createNode(AstNodeType.bitmark);

    // typeFormat
    const typeFormatNode = ast.createNode(AstNodeType.opd);
    ast.addNode(rootNode, typeFormatNode);

    // Type
    if (!BitType.fromValue(type)) {
      throw new Error(`Invalid bit type: ${type}`);
    }
    const typeNode = ast.createNode(AstNodeType.type);
    typeNode.value = type;
    ast.addNode(typeFormatNode, typeNode);

    const nlNode = ast.createNode(AstNodeType.nl);
    ast.addNode(rootNode, nlNode);

    // @Id
    if (id) {
      const addAtIdNode = (id: string | number): void => {
        const opaNode = ast.createNode(AstNodeType.opa);
        ast.addNode(rootNode, opaNode);

        const atKeyNode = ast.createNode(AstNodeType.text);
        atKeyNode.value = 'id';
        ast.addNode(opaNode, atKeyNode);

        const atKeySeparator = ast.createNode(AstNodeType.text);
        atKeySeparator.value = ':';
        ast.addNode(opaNode, atKeySeparator);

        const atValueNode = ast.createNode(AstNodeType.text);
        atValueNode.value = id;
        ast.addNode(opaNode, atValueNode);

        const nlNode = ast.createNode(AstNodeType.nl);
        ast.addNode(rootNode, nlNode);
      };
      if (Array.isArray(id)) {
        for (const i of id) {
          addAtIdNode(i);
        }
      } else {
        addAtIdNode(id);
      }
    }

    // Body
    if (body) {
      const textNode = ast.createNode(AstNodeType.text);
      textNode.value = body;
      ast.addNode(rootNode, textNode);
    }

    return rootNode;
  }

  generateAst(bit: Bit): AstNode {
    const ast = this.ast;
    const { type, body, format, id } = bit;

    // Check type
    const bitType = BitType.fromValue(type);
    if (!bitType) {
      throw new Error(`Invalid bit type: ${type}`);
    }

    // Get format
    const textFormat = Format.fromValue(format) ?? Format.bitmarkMinusMinus;

    const rootNode = Builder.bitmark(
      Builder.bit(
        Builder.bitHeader(Builder.bitType(bitType), Builder.format(textFormat)),
        Builder.bitElementArray([Builder.text(body)]),
      ),
    );

    return rootNode;
  }

  generateMarkup(root: AstNode): void {
    // console.log(JSON.stringify(root, null, 2));

    const flags = 'w';
    const generator = new StreamBitmarkGenerator(
      './bitmark.txt',
      {
        flags: flags,
      },
      {
        explicitTextFormat: true,
      },
    );

    generator.generate(root);
  }
}

const bmg = new Bmg();
bmg.helloWorld();

bmg.test().then(() => {
  console.log('END');
});

export { bmg };
export type { Bmg };
