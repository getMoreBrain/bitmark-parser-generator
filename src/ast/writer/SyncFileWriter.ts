import { type PathLike } from 'node:fs';
import path from 'node:path';

import fs from 'fs-extra';
import os from 'os';

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
 * Writer to write to a file synchronously.
 */
class SyncFileWriter {
  private _path: PathLike;
  private _append: boolean;
  private _encoding: BufferEncoding;
  private _open: boolean;

  public endOfLineString = os.EOL;
  private lastWrite = '';

  /**
   * Create a writer to write to a file.
   *
   * @param path - path of file to write
   * @param options - options for file writing
   */
  constructor(path: PathLike, options?: FileOptions) {
    const opts = Object.assign({}, options);

    this._path = path;
    this._append = !!opts.append;
    this._encoding = opts.encoding ?? 'utf8';
    this._open = false;
  }

  public get isSync() {
    return true;
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
    this.openSync();
    return Promise.resolve();
  }

  public async close(): Promise<void> {
    try {
      this.closeSync();
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve();
  }

  public openSync(): void {
    const flag = this._append ? 'a' : 'w';

    fs.ensureDirSync(path.dirname(this._path.toString()));

    fs.writeFileSync(this._path, '', {
      flag,
      encoding: this._encoding,
    });

    this._open = true;
  }

  public closeSync(): void {
    this._open = false;
  }

  public writeLine(value?: string): this {
    if (!this._open) return this;

    let line: string;

    if (value != null) {
      line = value + this.endOfLineString;
    } else {
      line = this.endOfLineString;
    }

    // Write the line to the file
    fs.appendFileSync(this._path, line, {
      encoding: this._encoding,
    });

    this.lastWrite = line;

    return this;
  }

  public writeLines(values: string[], delimiter?: string): this {
    if (!this._open) return this;

    if (!values) return this;
    let str = '';

    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i];
      str += value;
      if (delimiter && i < len - 1) {
        str += delimiter;
      }
      str += this.endOfLineString;
    }

    // Write the line to the file
    fs.appendFileSync(this._path, str, {
      encoding: this._encoding,
    });

    this.lastWrite = str;

    return this;
  }

  public write(value: string): this {
    if (!this._open) return this;
    if (value == null) return this;
    if (value) this.lastWrite = value;

    // Write the line to the file
    fs.appendFileSync(this._path, value, {
      encoding: this._encoding,
    });

    return this;
  }

  public writeWhiteSpace(): this {
    this.write(' ');
    return this;
  }

  public getLastWrite(): string {
    return this.lastWrite;
  }
}

export { SyncFileWriter };
