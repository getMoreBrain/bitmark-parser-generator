import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '..');
// const nodeModulesDir = path.join(rootDir, 'node_modules');
const distDir = path.join(rootDir, 'dist');
const buildDir = path.join(rootDir, 'build');

const dirsToRemove = [distDir, buildDir];

for (const dir of dirsToRemove) {
  try {
    await fs.rm(dir, { recursive: true, force: true });
    console.log(`✅ Cleaned: ${path.basename(dir)}`);
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code?: string }).code === 'ENOENT'
    ) {
      console.log(`ℹ️ Not present: ${path.basename(dir)}`);
    } else {
      console.error(`❌ Error: ${path.basename(dir)}:`, err);
      process.exit(1);
    }
  }
}
