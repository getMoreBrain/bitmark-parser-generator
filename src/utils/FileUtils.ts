import path from 'node:path';

import fs from 'fs-extra';

export interface GetFilenamesSyncOptions {
  match?: RegExp;
  recursive?: boolean;
  maxDepth?: number;
}

class FileUtils {
  getFilenamesSync(folder: string, options?: GetFilenamesSyncOptions): string[] {
    options = Object.assign({}, options);
    return this.getFilesRecursive(folder, options, [], 0);
  }

  private getFilesRecursive(
    folder: string,
    options: GetFilenamesSyncOptions,
    files: string[],
    depth: number,
  ): string[] {
    const atMaxDepth = options.maxDepth != null ? depth >= options.maxDepth : false;
    const thisFiles = fs.readdirSync(folder, {
      withFileTypes: true,
    });

    // Files
    for (const f of thisFiles) {
      const fullName = path.resolve(folder, f.name);
      if (f.isFile()) {
        if (!options.match || options.match.test(f.name)) {
          files.push(fullName);
        }
      }
    }

    // Sub-directories
    if (options.recursive && !atMaxDepth) {
      for (const f of thisFiles) {
        const fullName = path.resolve(folder, f.name);
        if (f.isDirectory()) {
          this.getFilesRecursive(fullName, options, files, depth + 1);
        }
      }
    }

    return files;
  }
}

const fileUtils = new FileUtils();

export { fileUtils as FileUtils };
