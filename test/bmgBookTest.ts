/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { bmg } from '../src/bmgDev';

// import { bmgTests } from './bmg-test';

// // Run tests on src
// bmgTests(bmg);

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import bitmarkGrammer from 'bitmark-grammar';
import { BitmarkParser } from 'bitmark-grammar/src';
// import deepEqual from 'deep-equal';
import fs from 'fs-extra';
import path from 'path';

import { BitmarkJson } from '../src/ast/tools/BitmarkJson';
import { FileBitmapMarkupGenerator } from '../src/ast/tools/FileBitmapMarkupGenerator';

import { deepDiffMapper } from './utils/deepDiffMapper';

// const TEST_FILES = ['1_2_erfolgsregel.bit.json'];
const TEST_FILES = ['1100_gueter_und_erbrecht.bit.json'];

// TODO should use 'require.resolve()' rather than direct node_modules
const JSON_TEST_INPUT_DIR = path.resolve(__dirname, '../assets/test/books/json');
const JSON_TEST_OUTPUT_DIR = path.resolve(__dirname, '../assets/test/books/results');

interface JsonTestCases {
  [key: string]: JsonTestCase;
}

class JsonTestCase {
  id: string;
  json: unknown;

  constructor(id: string, json: unknown) {
    this.id = id;
    this.json = json;
  }

  toString(): string {
    return this.id;
  }
}

function getTestJsonFilenames(): string[] {
  const filenames: string[] = [];

  const files = fs.readdirSync(JSON_TEST_INPUT_DIR, {
    withFileTypes: true,
  });

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.json') {
      if (TEST_FILES.indexOf(file.name) >= 0) {
        const fn = path.resolve(JSON_TEST_INPUT_DIR, file.name);
        filenames.push(fn);
      }
    }
  }

  return filenames;
}

function writeTestJsonAndBitmark(json: unknown, id: string): void {
  // // Write original JSON
  // const jsonFile = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.json`);
  // fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));

  // Write original Bitmark
  const bitwrappers = BitmarkJson.preprocessJson(json);

  const markupFile = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.bit`);
  let markup = '';
  for (let i = 0, len = bitwrappers.length; i < len; i++) {
    const bw = bitwrappers[i];
    const first = i === 0;

    if (!first && bw.bitmark) {
      markup += '\n\n\n';
    }

    markup += bw.bitmark || '';
  }
  fs.writeFileSync(markupFile, markup);
}

function removeMarkup(obj: any): void {
  if (obj) {
    if (!Array.isArray(obj)) {
      obj = [obj];
    }
    for (const item of obj) {
      delete item.bitmark;
      delete item.parser;
      if (item.resource) {
        delete item.resource.private;
      }
    }
  }
}

describe('bitmark-generator', () => {
  describe('JSON', () => {
    // Ensure required folders
    fs.ensureDirSync(JSON_TEST_OUTPUT_DIR);

    const allTestFiles = getTestJsonFilenames();

    console.info(`JSON tests found: ${allTestFiles.length}`);

    describe.each(allTestFiles)('Test file: %s', (testFile: string) => {
      test('JSON ==> Markup ==> JSON', async () => {
        const id = path.basename(testFile);

        const json = fs.readJsonSync(testFile, 'utf8');

        // Write original bitmark (and JSON?)
        writeTestJsonAndBitmark(json, id);

        // Convert the bitmark JSON to bitmark AST
        const bitmarkAst = BitmarkJson.toAst(json);

        // Generate markup code from AST
        const markupFile = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.gen.bit`);
        const generator = new FileBitmapMarkupGenerator(
          markupFile,
          {
            flags: 'w',
          },
          {
            explicitTextFormat: false,
          },
        );

        await generator.generate(bitmarkAst);

        const markup = fs.readFileSync(markupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the parser
        // const newJson = bitmarkGrammer.parse(markupFile);
        const parser = new BitmarkParser(markup, {
          trace: false,
          debug: false,
          need_error_report: false,
        });

        let newJson = [];
        try {
          const newJsonStr = parser.parse();
          newJson = JSON.parse(newJsonStr);
        } catch {
          throw new Error('Failed to parse bitmark-grammer output');
        }

        // Write the new JSON
        const fileNewJson = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.gen.json`);
        fs.writeFileSync(fileNewJson, JSON.stringify(newJson, null, 2), {
          encoding: 'utf8',
        });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(json, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        const fileDiffMap = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.diff.json`);
        fs.writeFileSync(fileDiffMap, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        removeMarkup(json);
        removeMarkup(newJson);

        expect(newJson).toEqual(json);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});
