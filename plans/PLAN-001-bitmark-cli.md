# PLAN-001 Bitmark CLI

## Overview
Create a Commander-based CLI for bitmark-parser-generator (v4.20.0) that exposes bitmark conversion, text conversion, breakscaping, and info capabilities through a command-line interface. The CLI must match the exact help text specification provided and integrate seamlessly with the existing BitmarkParserGenerator API.

## Context

### Project Structure
Current version: `4.20.0` (from `package.json`)

Key source files:
- **BitmarkParserGenerator API**: `src/BitmarkParserGenerator.ts` - main entry class with methods:
  - `convert(input, options?)` - bidirectional bitmark ↔ JSON conversion
  - `convertText(input, options?)` - text format conversion (bitmark++ ↔ JSON)
  - `breakscapeText(input, options?)` - escape bitmark syntax
  - `unbreakscapeText(input, options?)` - unescape bitmark syntax
  - `info(options?)` - introspection API for bit information
  - `version()` - returns version string
- **Public exports**: `src/index.ts` - exports all public types and classes
- **Build config**: `tsup.config.ts` - uses tsup with esbuild for Node (ESM/CJS) and browser builds

### CLI Bootstrap (Already Implemented)
The project already has CLI bootstrap infrastructure in place:

**Binary entry points** (`bin/` directory):
- `bin/run` - Production entry point (calls compiled code via `@getmorebrain/bitmark-extractor-ai` - needs updating)
- `bin/run.cmd` - Windows wrapper for `bin/run`
- `bin/dev` - Development entry point (uses tsx to run TypeScript directly from `src/cli/main.ts`)
- `bin/dev.cmd` - Windows wrapper for `bin/dev`

**CLI source** (`src/cli/` directory):
- `src/cli/main.ts` - Main CLI implementation with Commander.js setup (partially implemented)
  - Currently imports `PACKAGE_INFO` from `src/generated/package_info.ts`
  - Has `init()`, `asyncInit()`, and `cli()` functions stubbed out
  - Uses Commander.js for CLI framework
- `src/cli/launcher.ts` - Dynamic import wrapper (reserved for future use)

**Package configuration**:
- `package.json` has `"bin": { "bitmark-parser": "bin/run" }` configured
- Binary name is `bitmark-parser` (not `bitmark` as originally specified)

**Build infrastructure**:
- `scripts/create_package_info.ts` - Generates `src/generated/package_info.ts` with package metadata
- Run via `npm run init` (called by `scripts/init.ts`)
- Creates `PACKAGE_INFO` constant with name, version, author, license, description

### Architecture Principles (from `/specs/ARCHITECTURE.md`)
- **Layered design**: Grammar → Parser → AST → Generator → Output
- **CLI as orchestration**: CLI should be thin wrapper calling BitmarkParserGenerator API
- **No CLI in browser**: CLI code must be excluded from browser builds using STRIP comments
- **Stateless operations**: All methods are stateless, no side effects between calls
- **File I/O**: Node-only, guarded by `env.isNode` checks; throws error in browser

### Key Enums & Types (from `src/index.ts`)
- `BitmarkVersion` - enum for bitmark version (2, 3)
- `BitmarkParserType` - enum for parser type ('peggy', 'antlr' deprecated)
- `Output` - enum for output format ('bitmark', 'json', 'ast')
- `BodyTextFormat` - enum for text format ('bitmark++', others)
- `CardSetVersion` - enum for card set version (1, 2)
- `InfoType` - enum for info type ('list', 'all', 'deprecated', 'bit')
- `InfoFormat` - enum for info format ('text', 'json')

### Legacy CLI Reference
From old oclif-based implementation (provided in user request):
- Used `@oclif/core` with `Command`, `Args`, `Flags`
- Commands: convert, convertText, breakscape, unbreakscape, info
- Each command had stdin fallback via `readStream(process.stdin)`
- File output used `fs-extra` with `ensureDirSync` + `writeFileSync`
- Included special handling for `antlr` parser (legacy `bitmark-grammar` package)

## Functional Requirements

### CLI Structure & Versioning
1. **Binary name**: `bitmark-parser` (as configured in package.json bin field)
2. **Version display**: `bitmark-parser v4.19.0`
3. **Help structure**: Root help must show (adapted for `bitmark-parser` command name):
   ```
   Bitmark command line interface

   VERSION
     bitmark-parser v4.19.0

   USAGE
     $ bitmark-parser [COMMAND]

   COMMANDS
     convert       Convert between bitmark formats
     convertText   Convert between bitmark text formats
     breakscape    Breakscape text
     unbreakscape  Unbreakscape text
     info          Display information about bitmark
     help          Display help for bitmark-parser.
   ```

### Command: convert

**Interface** (exact match required):
```
Convert between bitmark formats

USAGE
  $ bitmark-parser convert [INPUT] [-v 2|3] [-f bitmark|json|ast] [-w] [--indent INDENT -p] [--plainText] [--excludeUnknownProperties] [--explicitTextFormat] [--spacesAroundValues <value>] [--cardSetVersion 1|2] [-a -o FILE] [--parser peggy|antlr]

ARGUMENTS
  [INPUT]  file to read, or bitmark or json string. If not specified, input will be from <stdin>

FLAGS
  -f, --format=<option>   output format. If not specified, bitmark is converted to JSON, and JSON / AST is converted to bitmark
                          <options: bitmark|json|ast>
  -v, --version=<option>  version of bitmark to use (default: latest)
                          <options: 2|3>
  -w, --warnings          enable warnings in the output

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

JSON FORMATTING FLAGS
  -p, --pretty                    prettify the JSON output with indent
      --excludeUnknownProperties  exclude unknown properties in the JSON output
      --indent=INDENT             prettify indent (default:2)
      --plainText                 output text as plain text rather than JSON (default: set by bitmark version)

BITMARK FORMATTING FLAGS
  --cardSetVersion=<option>     version of card set to use in bitmark (default: set by bitmark version)
                                <options: 1|2>
  --explicitTextFormat          include bitmark text format in bitmark even if it is the default (bitmark++)
  --spacesAroundValues=<value>  number of spaces around values in bitmark (default: 1)

PARSER OPTIONS FLAGS
  --parser=<option>  [default: peggy] parser to use
                     <options: peggy|antlr>

DESCRIPTION
  Convert between bitmark formats

EXAMPLES
  $ bitmark-parser convert '[.article] Hello World'

  $ bitmark-parser convert '[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++", "body": "Hello World" }}]'

  $ bitmark-parser convert input.json -o output.bitmark

  $ bitmark-parser convert input.bitmark -o output.json

  $ bitmark-parser convert -f ast input.json -o output.ast.json
```

**Implementation notes**:
- Input detection: Check if file exists → read file; else treat as literal string; else read stdin
- Parser option `antlr` requires fallback to legacy `bitmark-grammar` package's `parse()` function
- Map Commander flags to `ConvertOptions` interface for `BitmarkParserGenerator.convert()`
- Output: stdout if no `-o`, else write to file with append/overwrite

### Command: convertText

**Interface** (exact match required):
```
Convert between bitmark text formats

USAGE
  $ bitmark-parser convertText [INPUT] [-f bitmark++] [--indent INDENT -p] [-a -o FILE]

ARGUMENTS
  [INPUT]  file to read, or text or json string. If not specified, input will be from <stdin>

FLAGS
  -f, --textFormat=<option>  [default: bitmark++] conversion format
                             <options: bitmark++>

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

JSON FORMATTING FLAGS
  -p, --pretty         prettify the JSON output with indent
      --indent=INDENT  prettify indent (default:2)

DESCRIPTION
  Convert between bitmark text formats

EXAMPLES
  $ bitmark-parser convertText 'Hello World'

  $ bitmark-parser convertText '[{"type":"paragraph","content":[{"text":"Hello World","type":"text"}],"attrs":{}}]'

  $ bitmark-parser convertText input.json -o output.txt

  $ bitmark-parser convertText input.txt -o output.json
```

**Implementation notes**:
- Delegates to `BitmarkParserGenerator.convertText(input, options)`
- Simpler than convert—only text format and JSON output options

### Command: breakscape

**Interface** (exact match required):
```
Breakscape text

USAGE
  $ bitmark-parser breakscape [INPUT] [-a -o FILE]

ARGUMENTS
  [INPUT]  file to read, or text. If not specified, input will be from <stdin>

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

DESCRIPTION
  Breakscape text

EXAMPLES
  $ bitmark-parser breakscape '[.article] Hello World'

  $ bitmark-parser breakscape input.txt -o output.txt
```

**Implementation notes**:
- Delegates to `BitmarkParserGenerator.breakscapeText(input, options)`
- Returns string, outputs to stdout or file

### Command: unbreakscape

**Interface** (exact match required):
```
Unbreakscape text

USAGE
  $ bitmark-parser unbreakscape [INPUT] [-a -o FILE]

ARGUMENTS
  [INPUT]  file to read, or text. If not specified, input will be from <stdin>

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

DESCRIPTION
  Unbreakscape text

EXAMPLES
  $ bitmark-parser unbreakscape '[^.article] Hello World'

  $ bitmark-parser unbreakscape input.txt -o output.txt
```

**Implementation notes**:
- Delegates to `BitmarkParserGenerator.unbreakscapeText(input, options)`
- Returns string, outputs to stdout or file

### Command: info

**Interface** (exact match required):
```
Display information about bitmark

USAGE
  $ bitmark-parser info [INFO] [-f text|json] [--bit <value> | --all | --deprecated] [--indent INDENT -p] [-a -o FILE]

ARGUMENTS
  [INFO]  (list|bit) [default: list] information to return. If not specified, a list of bits will be returned

FLAGS
  -f, --format=<option>  [default: text] output format. If not specified, the ouput will be text
                         <options: text|json>
      --all              output all bits including deprecated
      --bit=<value>      bit to filter. If not specified, all bits will be returned
      --deprecated       output deprecated bits

FILE OUTPUT FLAGS
  -a, --append       append to the output file (default is to overwrite)
  -o, --output=FILE  output file. If not specified, output will be to <stdout>

JSON FORMATTING FLAGS
  -p, --pretty         prettify the JSON output with indent
      --indent=INDENT  prettify indent (default:2)

DESCRIPTION
  Display information about bitmark

EXAMPLES
  $ bitmark-parser info

  $ bitmark-parser info --all

  $ bitmark-parser info list --deprecated

  $ bitmark-parser info bit --bit=cloze

  $ bitmark-parser info -f json -p bit --bit=still-image-film
```

**Implementation notes**:
- Maps `[INFO]` arg to `InfoType` enum (default 'list')
- Flags `--all` / `--deprecated` modify type selection
- Delegates to `BitmarkParserGenerator.info(options)`
- Output already returns string (text) or stringified JSON

### Help Command
- Must respond to `bitmark-parser help` (alias for `--help`)
- Each command help must render with exact section headings and formatting

## Non-Functional Requirements

### Architecture Alignment
- CLI resides in `src/cli/` directory
- CLI is **Node-only** code—must be excluded from browser builds
- Use `/* STRIP:START */` and `/* STRIP:END */` comments around CLI exports in index (or better, do not add CLI exports to index!)
- CLI calls `BitmarkParserGenerator` API only—no direct parser/generator access - only import from index!

### Code Organization
Create shared utilities in `src/cli/utils/`:
1. **Input handler**: `readInput(input?: string): Promise<string>`
   - If `input` is undefined → read from stdin
   - Else if file exists → read file with `fs-extra`
   - Else treat as literal string
2. **Output handler**: `writeOutput(content: string | unknown, outputFile?: string, append?: boolean): void`
   - If `outputFile` → ensure dir exists, write with append/overwrite mode
   - Else → `console.log(content)`
3. **JSON formatter**: `formatJson(value: unknown, pretty?: boolean, indent?: number): string`
   - Handle prettify logic consistently across commands

### Dependencies
- **Commander.js**: Use `commander` package for CLI framework
- **fs-extra**: Already in dependencies, use for file operations
- **Legacy antlr support**: `bitmark-grammar` package may not be installed—handle gracefully with error message if parser=antlr selected - make this package an optional dependency.

### Build Integration
1. Add new tsup entry in `tsup.config.ts`:
   ```typescript
   // CLI build (Node ESM/CJS only, with shebang)
   {
     entry: ['src/cli/index.ts'],
     format: ['esm', 'cjs'],
     target: 'node20',
     outDir: 'dist/cli',
     shims: true,
     dts: false,
     sourcemap: true,
     minify: false,
     splitting: false,
     treeshake: true,
     clean: true,
     outExtension: ({ format }) => ({
       js: format === 'esm' ? '.mjs' : '.cjs'
     }),
   }
   ```
2. Add `bin` field to `package.json`:
   ```json
   "bin": {
     "bitmark": "./dist/cli/index.mjs"
   }
   ```
3. Add shebang to CLI entry: `#!/usr/bin/env node`

### Testing Strategy
1. **Unit tests** for CLI utilities (input/output handlers)
2. **Integration tests** using Vitest + `execa` to spawn CLI process:
   - Test each command with representative flags
   - Test stdin input via piping
   - Test file I/O (read from file, write to file, append mode)
   - Test error cases (invalid flags, missing files, parser errors)
3. **Test location**: `test/cli/` directory
4. **Manual verification checklist** (document in PR, not in docs):
   - Development testing: `./bin/dev --help` (uses tsx, no build needed)
   - Build and link: `npm run build && npm link`
   - Test globally: `bitmark-parser --help`
   - Run all help commands
   - Test stdin: `echo '[.article] Test' | bitmark-parser convert`
   - Test file I/O across all commands
   - Verify version output
   - Test on Windows: `bin\run.cmd --help` and `bin\dev.cmd --help`

## Implementation Steps

### Step 1: Project Setup

**Status**: ✅ PARTIALLY COMPLETE

Commander.js is already installed. The following structure exists:

**Existing**:
```
bin/
├── run              # Production entry (needs update)
├── run.cmd          # Windows production entry
├── dev              # Development entry (working)
└── dev.cmd          # Windows development entry
src/cli/
├── main.ts          # Main CLI with Commander stub
└── launcher.ts      # Dynamic import wrapper (reserved)
src/generated/
└── package_info.ts  # Auto-generated by npm run init
```

**To create**:
```
src/cli/
├── commands/         # Command implementations
│   ├── convert.ts
│   ├── convertText.ts
│   ├── breakscape.ts
│   ├── unbreakscape.ts
│   └── info.ts
└── utils/           # Shared utilities
    ├── io.ts        # Input/output helpers
    └── version.ts   # Version string formatting
test/cli/
├── convert.test.ts
├── convertText.test.ts
├── breakscape.test.ts
├── unbreakscape.test.ts
└── info.test.ts
```

**Required actions**:
1. Update `bin/run` to call local CLI instead of `@getmorebrain/bitmark-extractor-ai`
2. Complete `src/cli/main.ts` implementation
3. Create command and utility modules

### Step 2: Shared Utilities (`src/cli/utils/`)

#### io.ts
```typescript
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
  append = false
): Promise<void> {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
#### version.ts
```typescript
import { PACKAGE_INFO } from '../../generated/package_info.ts';

// Use hardcoded version per requirements (override package.json 4.20.0)
export const CLI_VERSION = '4.19.0';
export const PACKAGE_VERSION = PACKAGE_INFO.version; // For reference
export const FULL_VERSION = `Bitmark CLI v${CLI_VERSION} (bitmark-parser-generator v${CLI_VERSION})`;
``` console.log(text);
  }
}

/**
 * Format value as JSON string
 */
export function formatJson(
  value: unknown,
  pretty?: boolean,
  indent?: number
): string {
  const space = pretty ? (indent ?? 2) : undefined;
  return JSON.stringify(value, null, space);
}
```

#### version.ts
```typescript
// Use hardcoded version per requirements
export const CLI_VERSION = '4.19.0';
export const FULL_VERSION = `Bitmark CLI v${CLI_VERSION} (bitmark-parser-generator v${CLI_VERSION})`;
```

### Step 3: Command Implementations

Each command in `src/cli/commands/` follows this pattern:
1. Import BitmarkParserGenerator
2. Define Commander command with exact flags/args from spec
3. Call readInput helper
4. Call appropriate BitmarkParserGenerator method
5. Call writeOutput helper
6. Handle errors with friendly messages

#### Example: convert.ts (full implementation)
```typescript
import { Command } from 'commander';
import { BitmarkParserGenerator, BitmarkVersion, Output, CardSetVersion, BitmarkParserType } from '../../index.ts';
import { readInput, writeOutput, formatJson } from '../utils/io.ts';

export function createConvertCommand(): Command {
  const bpg = new BitmarkParserGenerator();

  const cmd = new Command('convert')
    .description('Convert between bitmark formats')
    .argument('[input]', 'file to read, or bitmark or json string. If not specified, input will be from <stdin>')
    .option('-v, --version <version>', 'version of bitmark to use (default: latest)', (v) => parseInt(v))
    .option('-f, --format <format>', 'output format. If not specified, bitmark is converted to JSON, and JSON / AST is converted to bitmark')
    .option('-w, --warnings', 'enable warnings in the output')
    .option('-a, --append', 'append to the output file (default is to overwrite)')
    .option('-o, --output <file>', 'output file. If not specified, output will be to <stdout>')
    .option('-p, --pretty', 'prettify the JSON output with indent')
    .option('--indent <indent>', 'prettify indent (default:2)', (v) => parseInt(v))
    .option('--plainText', 'output text as plain text rather than JSON (default: set by bitmark version)')
    .option('--excludeUnknownProperties', 'exclude unknown properties in the JSON output')
    .option('--explicitTextFormat', 'include bitmark text format in bitmark even if it is the default (bitmark++)')
    .option('--spacesAroundValues <value>', 'number of spaces around values in bitmark (default: 1)', (v) => parseInt(v))
    .option('--cardSetVersion <version>', 'version of card set to use in bitmark (default: set by bitmark version)', (v) => parseInt(v))
    .option('--parser <parser>', 'parser to use', 'peggy')
    .action(async (input, options) => {
      try {
        const dataIn = await readInput(input);
        const prettify = options.pretty ? (options.indent ?? 2) : undefined;
        const spacesAroundValues = options.spacesAroundValues != null ? Math.max(0, options.spacesAroundValues) : undefined;

        let result: string | unknown;

        // Handle antlr parser (legacy)
        if (options.parser === 'antlr') {
          try {
            // Attempt to import legacy parser
            const { parse: antlrParse } = await import('bitmark-grammar');
            const jsonStr = antlrParse(dataIn);
            result = JSON.parse(jsonStr);

            if (options.output) {
              const jsonPrettyStr = formatJson(result, options.pretty, options.indent);
              await writeOutput(jsonPrettyStr, options.output, options.append);
              return;
            }
          } catch (err) {
            throw new Error('ANTLR parser not available. Install bitmark-grammar package or use --parser=peggy');
          }
        } else {
          // Use Peggy parser via BitmarkParserGenerator
          result = bpg.convert(dataIn, {
            bitmarkVersion: BitmarkVersion.fromValue(options.version),
            bitmarkParserType: BitmarkParserType.fromValue(options.parser),
            outputFile: options.output,
            outputFormat: Output.fromValue(options.format),
            fileOptions: {
              append: options.append,
            },
            jsonOptions: {
              enableWarnings: options.warnings,
              prettify,
              textAsPlainText: options.plainText ?? undefined,
              excludeUnknownProperties: options.excludeUnknownProperties,
            },
            bitmarkOptions: {
              explicitTextFormat: options.explicitTextFormat,
              spacesAroundValues,
              cardSetVersion: CardSetVersion.fromValue(options.cardSetVersion),
            },
          });
### Step 4: Main CLI Entry (`src/cli/main.ts`)

**Status**: ✅ PARTIALLY COMPLETE - update existing file

Update the existing `src/cli/main.ts` with full implementation:

```typescript
import process from 'node:process';

import { Command } from 'commander';

import { PACKAGE_INFO } from '../generated/package_info.ts';
import { FULL_VERSION } from './utils/version.ts';
import { createConvertCommand } from './commands/convert.ts';
import { createConvertTextCommand } from './commands/convertText.ts';
import { createBreakscapeCommand } from './commands/breakscape.ts';
import { createUnbreakscapeCommand } from './commands/unbreakscape.ts';
import { createInfoCommand } from './commands/info.ts';

function init(): void {
  // Synchronous initialization if needed
}

async function asyncInit(): Promise<void> {
  const program = new Command();

  program
    .name('bitmark-parser')
    .description('Bitmark command line interface')
    .version(FULL_VERSION, '-v, --version', 'output the version number');

  // Register commands
  program.addCommand(createConvertCommand());
  program.addCommand(createConvertTextCommand());
  program.addCommand(createBreakscapeCommand());
  program.addCommand(createUnbreakscapeCommand());
  program.addCommand(createInfoCommand());

  // Add help command
  program
    .command('help')
    .description('Display help for bitmark-parser.')
    .action(() => {
### Step 5: Build Configuration

**Status**: ✅ PARTIALLY COMPLETE - bin already configured, build needs updates

The `package.json` already has:
```json
{
  "bin": {
    "bitmark-parser": "bin/run"
  }
}
```

**Update `bin/run`** to call the local CLI:
```javascript
#!/usr/bin/env node

// Use tsx in development, compiled code in production
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // Development: use tsx to run TypeScript directly
  import('tsx/cli.mjs').then(() => {
    import('../src/cli/main.ts').then((m) => m.cli());
  });
} else {
  // Production: use compiled code
  import('../dist/index.js').then((m) => {
    // Import and run CLI from compiled output
    import('../dist/cli/main.js').then((cli) => cli.cli());
  });
}
```

**OR simpler approach - update `bin/run`** to match `bin/dev` pattern:
```javascript
#!/usr/bin/env node

import { cli } from '../dist/cli/main.js';

cli();
```

**No tsup changes needed** - CLI code will be part of main build since it's imported from `src/cli/`.
However, CLI must be excluded from browser builds via STRIP comments in `src/index.ts`.

**Update `src/index.ts`** to exclude CLI from browser builds:
```typescript
// ... existing exports ...

/* STRIP:START */
STRIP; // eslint-disable-line

// Export CLI for Node.js only
export { cli } from './cli/main.ts';

/* STRIP:END */
STRIP; // eslint-disable-line
```

**Update build script in `package.json`** (if needed):
```json
  it('converts bitmark to JSON (stdout)', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert', '[.article] Test']);
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(1);
    expect(result[0].bit.type).toBe('article');
  });

  it('converts from stdin', async () => {
    const { stdout } = await execa('node', [CLI_PATH, 'convert'], {
      input: '[.article] Stdin Test',
    });
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(1);
  });

  it('writes to file', async () => {
    const outputPath = '/tmp/test-output.json';
    await execa('node', [CLI_PATH, 'convert', '[.article] File', '-o', outputPath]);
    const content = await fs.readFile(outputPath, 'utf8');
    const result = JSON.parse(content);
    expect(result).toHaveLength(1);
    await fs.remove(outputPath);
  });

  it('works via bin/dev during development', async () => {
    const binDevPath = path.resolve(__dirname, '../../bin/dev');
    const { stdout } = await execa('node', [binDevPath, 'convert', '[.article] Dev Test']);
    const result = JSON.parse(stdout);
    expect(result).toHaveLength(1);
  });ts: false,
    sourcemap: true,
    minify: false,
    splitting: false,
    treeshake: true,
    clean: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
    outExtension: () => ({
      js: '.mjs'
    }),
  },
]);
```

Update `package.json`:
```json
{
  "bin": {
    "bitmark": "./dist/cli/index.mjs"
  },
  "scripts": {
    "build-cli": "tsup src/cli/index.ts --config tsup.config.ts",
    "build": "npm run clean && npm run init && npm run build-grammar-bit && npm run build-grammar-text && npm run check && tsup && npm run build-browser && npm run build-cli && npm run build-supported-info"
  },
  "dependencies": {
    "commander": "^12.0.0"
  },
  "devDependencies": {
    "execa": "^9.0.0"
    // ... existing deps
  }
}
```

### Step 6: Testing

Example test file `test/cli/convert.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

const CLI_PATH = path.resolve(__dirname, '../../dist/cli/index.mjs');

## Success Criteria

Implementation is complete when:
1. CLI runs as `bitmark-parser` command after `npm install -g` or `npm link`
2. Development mode works: `./bin/dev <command>` runs CLI via tsx without building
3. Production mode works: `./bin/run <command>` runs CLI from compiled code in `dist/`
4. All five commands (convert, convertText, breakscape, unbreakscape, info) work with exact help text
5. Version displays as `bitmark-parser-generator v4.20.0`
6. Stdin, string literals, and file inputs all work
7. File output with append/overwrite works
8. Tests pass covering all commands
9. Browser builds exclude CLI code via STRIP comments
10. Windows scripts (`bin/run.cmd`, `bin/dev.cmd`) work correctly
11. No new documentation files created (plan only)
12. All help text matches specification exactly (with `bitmark-parser` as command name)
13. Commander.js properly integrated and all flags work as specified
14. `PACKAGE_INFO` from `src/generated/package_info.ts` is accessible to CLI
    expect(result).toHaveLength(1);
  });

  it('writes to file', async () => {
    const outputPath = '/tmp/test-output.json';
    await execa('node', [CLI_PATH, 'convert', '[.article] File', '-o', outputPath]);
    const content = await fs.readFile(outputPath, 'utf8');
    const result = JSON.parse(content);
    expect(result).toHaveLength(1);
    await fs.remove(outputPath);
  });
});
```

Add similar tests for convertText, breakscape, unbreakscape, and info commands.

## Error Handling & Edge Cases

1. **Missing input**: If no INPUT arg and stdin is empty → error message
2. **Invalid file path**: File doesn't exist and not valid bitmark/JSON → treat as string, let parser handle
3. **Parser errors**: Catch and display with helpful message + exit code 1
4. **ANTLR parser unavailable**: Friendly error suggesting peggy or installing bitmark-grammar
5. **Browser environment**: Should never occur (CLI is Node-only), but guard with error if somehow invoked
6. **Invalid enum values**: Commander validates options; BitmarkParserGenerator enums handle with fromValue()

## Validation Checklist

Before considering implementation complete:
- [ ] All help text matches specification exactly (including typos like "ouput")
- [ ] Version output: `bitmark-parser-generator v<version from package.json>`
- [ ] All commands accept stdin when INPUT omitted
- [ ] All commands support file input and literal string input
- [ ] File output respects append/overwrite modes
- [ ] JSON prettification works consistently
- [ ] ANTLR parser fallback works or fails gracefully
- [ ] CLI excluded from browser builds
- [ ] Tests cover happy paths and error cases
- [ ] `npm link` allows local testing
- [ ] No new documentation created (plan only, per instructions)

## Open Questions & Decisions

### Q1: ANTLR Parser Support
**Decision**: Include fallback with try/catch on dynamic import. If `bitmark-grammar` not installed, show friendly error. Don't add as required dependency.

### Q2: Error Message Format
**Decision**: Use `console.error('Error:', error.message)` + `process.exit(1)` for user-facing errors. Let Commander handle flag validation errors.

### Q3: String Utility Reuse
**Decision**: Use native `typeof x === 'string'` checks in CLI. Don't import internal utils like `StringUtils` to keep CLI layer independent.

### Q4: Help Text Typos
**Decision**: If spec contains typos (e.g., "ouput"), reproduce exactly to match specification. Can be fixed in future if spec is updated.


## References

- **Architecture**: `/specs/ARCHITECTURE.md`
- **BitmarkParserGenerator API**: `src/BitmarkParserGenerator.ts` (lines 383+)
- **Public exports**: `src/index.ts`
- **Build config**: `tsup.config.ts`
- **Package info**: `package.json`
- **Commander.js docs**: https://github.com/tj/commander.js
- **Legacy CLI examples**: Provided in user request (oclif-based convert.ts, convertText.ts, etc.)

## Success Criteria

Implementation is complete when:
1. CLI runs as `bitmark-parser` command after `npm install -g` or `npm link`
2. All five commands (convert, convertText, breakscape, unbreakscape, info) work with exact help text
3. Version displays as `bitmark-parser-generator v4.20.0`
4. Stdin, string literals, and file inputs all work
5. File output with append/overwrite works
6. Tests pass covering all commands
7. Browser builds exclude CLI code
8. No new documentation files created (plan only)
9. All help text matches specification exactly (character-for-character where possible)
10. Commander.js properly integrated and all flags work as specified
