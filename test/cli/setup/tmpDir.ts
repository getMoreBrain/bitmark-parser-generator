import { mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import fs from 'fs-extra';
import { afterAll, vi } from 'vitest';

const tempRootPrefix = path.join(os.tmpdir(), 'bitmark-cli-tests-');
const cliTmpDir = mkdtempSync(tempRootPrefix);

vi.stubGlobal('tmpDir', cliTmpDir);

afterAll(async () => {
  await fs.remove(cliTmpDir);
  vi.unstubAllGlobals();
});
