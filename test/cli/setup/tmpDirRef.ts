function resolveCliTmpDir(): string {
  const dir = (globalThis as { tmpDir?: string }).tmpDir;
  if (!dir) {
    throw new Error('tmpDir global not initialized. Ensure test/cli/setup/tmpDir.ts runs first.');
  }
  return dir;
}

const cliTmpDir = resolveCliTmpDir();

export { cliTmpDir };
