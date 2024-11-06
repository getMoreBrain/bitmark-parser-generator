/**
 * Simple writer to write text or code.
 */
export interface Writer {
  /**
   * If true, the writer is synchronous.
   * If false, the writer is asynchronous.
   *
   * When the writer is synchronous, the openSync() and closeSync() methods can be used, and
   * the output can be generated synchrounously.
   */
  readonly isSync: boolean;

  /**
   * Open the writer for writing.
   *
   * Must be called before any calls to writeXXX();
   *
   * This method can be used regardless of the value of isSync.
   */
  open(): Promise<void>;

  /**
   * Close the writer for writing.
   *
   * Must be called after any calls to writeXXX();
   *
   * This method can be used regardless of the value of isSync.
   */
  close(): Promise<void>;

  /**
   * Open the writer for writing.
   *
   * Must be called before any calls to writeXXX();
   *
   * This method is only available when isSync is true.
   */
  openSync(): void;

  /**
   * Close the writer for writing.
   *
   * Must be called after any calls to writeXXX();
   *
   * This method is only available when isSync is true.
   */
  closeSync(): void;

  /**
   * Writes a string value to the output.
   * @param value - The string value to be written.
   */
  write(value: string): this;

  /**
   * Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.
   * @param value - The line to write. When omitted, only the endOfLineString is written.
   */
  writeLine(value?: string): this;

  /**
   * Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.
   * @param values - The lines to write.
   * @param delimiter - An optional delimiter to be written at the end of each line, except for the last one.
   */
  writeLines(values: string[], delimiter?: string): this;

  /**
   * Writes a single whitespace character to the output.
   */
  writeWhiteSpace(): this;

  /**
   * Get the last string non-empty that was written.
   *
   * @returns The last non-empty string that was written, or an empty string if nothing has been written.
   */
  getLastWrite(): string;
}
