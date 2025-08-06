import { type PathLike } from 'node:fs';
import path from 'node:path';

import fs from 'fs-extra';

import { StreamWriter } from './StreamWriter.ts';

/**
 * Options for file writing
 */
export interface FileOptions {
  /**
   * Append to a file if true, otherwise overwrite
   */
  append?: boolean;
  /**
   * Character encoding, defaults to 'utf8'
   */
  encoding?: BufferEncoding;
}

/**
 * Writer to write to a file.
 */
class FileWriter extends StreamWriter {
  private _path: PathLike;
  private _append: boolean;
  private _encoding: BufferEncoding;

  /**
   * Create a writer to write to a file.
   *
   * @param path - path of file to write
   * @param options - options for file writing
   */
  constructor(path: PathLike, options?: FileOptions) {
    super();
    const opts = Object.assign({}, options);

    this._path = path;
    this._append = !!opts.append;
    this._encoding = opts.encoding ?? 'utf8';
  }

  public get path(): PathLike {
    return this._path;
  }

  public get append(): boolean {
    return this._append;
  }

  public get encoding(): BufferEncoding {
    return this._encoding;
  }

  public async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const flags = this._append ? 'a' : 'w';

      fs.ensureDirSync(path.dirname(this._path.toString()));

      const stream = fs.createWriteStream(this._path, {
        flags,
        encoding: 'utf8',
      });
      // Set StreamWriter stream
      this.stream = stream;

      if (!stream) reject(new Error('stream undefined'));

      stream.once('open', (_fd: number) => {
        resolve();
      });

      stream.once('error', (e: Error) => {
        reject(e);
      });
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = this.stream as NodeJS.WritableStream;
      if (!stream) reject(new Error('stream not set'));

      stream.once('close', (_fd: number) => {
        resolve();
      });
      stream.once('error', (e: Error) => {
        reject(e);
      });

      stream.end();
    });
  }
}

export { FileWriter };
