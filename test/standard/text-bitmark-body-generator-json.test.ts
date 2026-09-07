/**
 * JSON-driven text generator fixtures (PLAN-022).
 *
 * The text-driven generator suite (text → JSON → text → JSON) can only hold JSON the parser
 * produces. These fixtures are hand-written JSON the text grammar cannot express as given (invalid
 * attribute values, unknown keys, nodes in the wrong context, ambiguous mark orders, ...). For
 * each `<id>.json` input:
 *
 *   1. the generated text equals `expected/<id>.text`
 *   2. the generated text re-parses to `expected/<id>.json`
 *   3. generating from the re-parsed JSON gives the same text again (idempotence)
 *
 * The expected files are the conformance reference for other implementations (e.g. Rust).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import { describe, expect, test } from 'vitest';

import { TextGenerator } from '../../src/generator/text/TextGenerator.ts';
import { TextFormat } from '../../src/model/enum/TextFormat.ts';
import { TextLocation } from '../../src/model/enum/TextLocation.ts';
import { TextParser } from '../../src/parser/text/TextParser.ts';
import { deepDiffMapper } from '../utils/deepDiffMapper.ts';
import {
  getExpectedFilesDir,
  getTestFiles,
  getTestFilesDir,
} from './config/config-text-bitmark-body-generator-json-files.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const TEST_FILES = getTestFiles();
const TEST_INPUT_DIR = getTestFilesDir();
const EXPECTED_DIR = getExpectedFilesDir();
const TEST_OUTPUT_DIR = path.resolve(dirname, './results/text-bitmark-body-generator-json/output');

const textGenerator = new TextGenerator();
const textParser = new TextParser();

// Fixtures named '<id>.tag.json' are generated / parsed at tag location (bitmarkPlus)
const locationOf = (id: string) => (id.endsWith('.tag') ? TextLocation.tag : TextLocation.body);

const generate = (ast: unknown, id: string): string =>
  textGenerator.generateSync(
    JSON.parse(JSON.stringify(ast)),
    TextFormat.bitmarkText,
    locationOf(id),
  );

const parse = (text: string, id: string) =>
  textParser.toAst(text, { format: TextFormat.bitmarkText, location: locationOf(id) });

describe('text-bitmark-body-generator-json', () => {
  describe('invalid JSON => Bitmark Text (body) => JSON', () => {
    fs.ensureDirSync(TEST_OUTPUT_DIR);

    console.info(`Tests found: ${TEST_FILES.length}`);

    TEST_FILES.forEach((testFile: string) => {
      const id = path.basename(testFile, '.json');

      test(`${id}`, async () => {
        const inputFile = path.resolve(TEST_INPUT_DIR, testFile);
        const expectedTextFile = path.resolve(EXPECTED_DIR, `${id}.text`);
        const expectedJsonFile = path.resolve(EXPECTED_DIR, `${id}.json`);
        const generatedTextFile = path.resolve(TEST_OUTPUT_DIR, `${id}.gen.text`);
        const generatedJsonFile = path.resolve(TEST_OUTPUT_DIR, `${id}.gen.json`);
        const jsonDiffFile = path.resolve(TEST_OUTPUT_DIR, `${id}.diff.json`);

        const inputJson = fs.readJsonSync(inputFile, 'utf8');

        // Generate the text
        const text = generate(inputJson, id);
        fs.writeFileSync(generatedTextFile, text, { encoding: 'utf8' });

        // Re-parse the generated text
        const newJson = parse(text, id);
        fs.writeFileSync(generatedJsonFile, JSON.stringify(newJson, null, 2), {
          encoding: 'utf8',
        });

        // 1. expected text
        const expectedText = fs.readFileSync(expectedTextFile, 'utf8');
        expect(text).toEqual(expectedText);

        // 2. expected re-parsed JSON
        const expectedJson = fs.readJsonSync(expectedJsonFile, 'utf8');
        const diffMap = deepDiffMapper.map(expectedJson, newJson, { ignoreUnchanged: true });
        fs.writeFileSync(jsonDiffFile, JSON.stringify(diffMap, null, 2), { encoding: 'utf8' });
        expect(newJson).toEqual(expectedJson);

        // 3. idempotence
        expect(generate(newJson, id)).toEqual(text);

        fs.removeSync(jsonDiffFile);
      });
    });
  });
});
