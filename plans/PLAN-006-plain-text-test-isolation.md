# PLAN-006: Isolate Plain Text Tests from Shared Inputs

## Problem

The two plain text extraction tests share input directories with other tests:

| Test                         | Config                               | Shared Input Dir                             | Shared With                                        |
| ---------------------------- | ------------------------------------ | -------------------------------------------- | -------------------------------------------------- |
| `plain-text-bitmark.test.ts` | `config-plain-text-bitmark-files.ts` | `input/bitmark/` (401 files)                 | `config-bitmark-files.ts` (parser/generator tests) |
| `plain-text-body.test.ts`    | `config-plain-text-body-files.ts`    | `input/text-bitmark-body-parser/` (26 files) | `config-text-bitmark-body-parser-files.ts`         |

Expected outputs live in `plainText/` subdirectories within those shared input dirs. When other tests add/change input files, the plain text tests break because new/changed `.txt` fixtures are needed.

## Goal

Give each plain text test its own curated, stable set of input files and expected outputs, decoupled from the volatile shared input directories.

## Approach

Create two new dedicated input directories with a small, curated subset of inputs and their expected plain text outputs.

## Functional Requirements

### 1. New Input Directories

Create:

- `test/standard/input/plain-text-bitmark/` — curated `.bitmark` files + expected `.txt` files
- `test/standard/input/plain-text-body/` — curated `.text` files + expected `.txt` files

Structure per directory:

```
plain-text-bitmark/
  ├── <name>.bitmark        # input
  └── <name>.txt            # expected output
plain-text-body/
  ├── <name>.text            # input
  └── <name>.txt             # expected output
```

Note: expected `.txt` files live alongside inputs (no `plainText/` subdirectory) for simplicity.

### 2. Curate Input Files

Select a representative subset from the current inputs covering the key plain text extraction scenarios:

- Simple text (paragraphs, whitespace)
- Inline formatting (bold, italic, highlight, code)
- Links, images, references (extref, xref)
- Lists
- Footnotes
- LaTeX
- Breakscaping edge cases
- Multiple bits (bitmark test only)

Target: ~10-15 files per test, enough for good coverage without being a maintenance burden.

Copy selected files into the new directories and generate corresponding `.txt` expected outputs using `bpg.extractPlainText()`.

### 3. Update Config Files

- `config-plain-text-bitmark-files.ts` → point to `input/plain-text-bitmark/`, match `*.bitmark`
- `config-plain-text-body-files.ts` → point to `input/plain-text-body/`, match `*.text`

### 4. Update Test Files

- `plain-text-bitmark.test.ts` — read expected `.txt` from same dir as input (remove `PLAIN_TEXT_INPUT_DIR` / `plainText/` subdirectory logic)
- `plain-text-body.test.ts` — same change

### 5. Update Regeneration Scripts

- `devRegeneratePlainTextFromBitmark.ts` → point to new `plain-text-bitmark/` dir, write `.txt` alongside inputs
- `devRegeneratePlainTextFromTextBody.ts` → point to new `plain-text-body/` dir, write `.txt` alongside inputs

### 6. Clean Up

- Remove `test/standard/input/bitmark/plainText/` directory (401 now-orphaned `.txt` files)
- Remove `test/standard/input/text-bitmark-body-parser/plainText/` directory (26 now-orphaned `.txt` files)

## Files to Modify

| File                                                      | Change                                                            |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| `test/standard/config/config-plain-text-bitmark-files.ts` | Point to `input/plain-text-bitmark/`                              |
| `test/standard/config/config-plain-text-body-files.ts`    | Point to `input/plain-text-body/`                                 |
| `test/standard/plain-text-bitmark.test.ts`                | Remove `PLAIN_TEXT_INPUT_DIR`; read `.txt` from same dir as input |
| `test/standard/plain-text-body.test.ts`                   | Remove `PLAIN_TEXT_INPUT_DIR`; read `.txt` from same dir as input |
| `test/custom/dev/devRegeneratePlainTextFromBitmark.ts`    | Point to new dir, write `.txt` alongside inputs                   |
| `test/custom/dev/devRegeneratePlainTextFromTextBody.ts`   | Point to new dir, write `.txt` alongside inputs                   |

## Files/Dirs to Create

| Path                                               | Content                                                      |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `test/standard/input/plain-text-bitmark/*.bitmark` | Curated subset copied from `input/bitmark/`                  |
| `test/standard/input/plain-text-bitmark/*.txt`     | Generated expected outputs                                   |
| `test/standard/input/plain-text-body/*.text`       | Curated subset copied from `input/text-bitmark-body-parser/` |
| `test/standard/input/plain-text-body/*.txt`        | Generated expected outputs                                   |

## Files/Dirs to Delete

| Path                                                      | Reason                         |
| --------------------------------------------------------- | ------------------------------ |
| `test/standard/input/bitmark/plainText/`                  | Orphaned; no longer referenced |
| `test/standard/input/text-bitmark-body-parser/plainText/` | Orphaned; no longer referenced |

## Non-Functional Requirements

- Tests must pass identically after migration
- No changes to `src/` code
- No changes to other test suites
