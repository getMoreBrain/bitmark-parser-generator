import fs from 'fs-extra';
import * as promises from 'node:fs/promises';

import { Ast, AstNode, AstNodeInfo } from '../Ast';

import { BitmarkGenerator, BitmarkGeneratorOptions } from './BitmarkGenerator';
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

class StreamBitmarkGenerator implements CodeGenerator {
  // TODO - make Ast class a singleton
  private ast = new Ast();
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

  public generate(root: AstNode): void {
    const writeStream = fs.createWriteStream(this.path, this.streamOptions);
    writeStream.once('open', (fd: number) => {
      const cw = new StreamWriter(writeStream);
      const bitmarkGenerator = new BitmarkGenerator(cw, this.bitmarkOptions);

      bitmarkGenerator.writeLine('Hello World');
      bitmarkGenerator.writeLine();

      this.ast.walk(root, {
        enter: (node: AstNode, parent: AstNode | undefined, route: AstNodeInfo[]) => {
          const routeStr = this.ast.routeToString(route);

          bitmarkGenerator.writeLine(`${routeStr}`);
        },
      });
      bitmarkGenerator.writeLine();

      bitmarkGenerator.generate(root);

      writeStream.end();
      // console.log('Generator: Finished generating \'%s\'...', fullOutputFileName);
    });
  }
}

export { StreamBitmarkGenerator };
