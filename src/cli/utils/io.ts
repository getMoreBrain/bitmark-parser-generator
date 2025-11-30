import fs from 'fs-extra';
import path from 'path';

/**
 * Read input from arg (file or string) or stdin
 */
export async function readInput(input?: string): Promise<string> {
  if (input !== undefined) {
    // Check if file exists
    if (await fs.pathExists(input)) {
      return fs.readFile(input, 'utf8');
    }
    // Treat as literal string
    return input;
  }

  // Read from stdin
  const chunks: Uint8Array[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Write output to file or stdout
 */
export async function writeOutput(
  content: string | unknown,
  outputFile?: string,
  append = false,
): Promise<void> {
  const text = typeof content === 'string' ? content : JSON.stringify(content);

  if (outputFile) {
    await fs.ensureDir(path.dirname(outputFile));
    await fs.writeFile(outputFile, text, { flag: append ? 'a' : 'w' });
  } else {
    console.log(text);
  }
}

/**
 * Format value as JSON string
 */
export function formatJson(value: unknown, pretty?: boolean, indent?: number): string {
  const space = pretty ? (indent ?? 2) : undefined;
  return JSON.stringify(value, null, space);
}
