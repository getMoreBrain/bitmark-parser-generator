import fs from 'fs-extra';
import * as promises from 'node:fs/promises';

import { AstNodeTypeType } from '../AstNodeType';
import { Node } from '../nodes/BitmarkNodes';

import { BitmarkMarkupGenerator, BitmarkGeneratorOptions } from './BitmarkMarkupGenerator';
import { CodeGenerator } from './CodeGenerator';
import { StreamWriter } from './writer/StreamWriter';

interface StreamOptions {
  flags?: string | undefined;
  encoding?: BufferEncoding | undefined;
  fd?: number | promises.FileHandle | undefined;
  mode?: number | undefined;
  autoClose?: boolean | undefined;
  /**
   * @default false
   */
  emitClose?: boolean | undefined;
  start?: number | undefined;
  highWaterMark?: number | undefined;
}

class FileBitmapMarkupGenerator implements CodeGenerator {
  private path: fs.PathLike;
  private streamOptions?: BufferEncoding | StreamOptions;
  private bitmarkOptions?: BitmarkGeneratorOptions;

  constructor(
    path: fs.PathLike,
    streamOptions?: BufferEncoding | StreamOptions,
    bitmarkOptions?: BitmarkGeneratorOptions,
  ) {
    this.path = path;
    this.streamOptions = streamOptions;
    this.bitmarkOptions = bitmarkOptions;
  }

  public async generate(root: Node, rootType?: AstNodeTypeType): Promise<void | string> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(this.path, this.streamOptions);
      writeStream.once('open', (_fd: number) => {
        const cw = new StreamWriter(writeStream);
        const bitmarkGenerator = new BitmarkMarkupGenerator(cw, this.bitmarkOptions);

        // bitmarkGenerator.writeLine('Hello World');
        // bitmarkGenerator.writeLine();

        // this.ast.walk(root, {
        //   enter: (node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) => {
        //     const routeStr = this.ast.routeToString(route);

        //     if (node.value != null) {
        //       bitmarkGenerator.writeLine(`${routeStr}`);
        //     }
        //   },
        // });
        // bitmarkGenerator.writeLine();

        bitmarkGenerator.generate(root, rootType);

        writeStream.end();
        // console.log('Generator: Finished generating \'%s\'...', fullOutputFileName);
      });
      writeStream.once('error', (_fd: number) => {
        reject();
      });
      writeStream.once('close', (_fd: number) => {
        resolve();
      });
    });
  }
}

export { FileBitmapMarkupGenerator };
