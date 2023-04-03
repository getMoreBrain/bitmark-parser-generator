/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { bmg } from '../src/bmgDev';

// import { bmgTests } from './bmg-test';

// // Run tests on src
// bmgTests(bmg);

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, test } from '@jest/globals';
// import deepEqual from 'deep-equal';
import * as fs from 'fs-extra';
import path from 'path';

import { BitmarkFileGenerator } from '../../../src/generator/bitmark/BitmarkFileGenerator';
import { BitmarkParser } from '../../../src/parser/bitmark/BitmarkParser';
import { JsonParser } from '../../../src/parser/json/JsonParser';
import { BitJsonUtils } from '../../utils/BitJsonUtils';
import { deepDiffMapper } from '../../utils/deepDiffMapper';

// TODO should use 'require.resolve()' rather than direct node_modules
const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
const BITMARK_GRAMMAR_DIR = path.resolve(NODE_MODULES_DIR, 'bitmark-grammar');
const JSON_TEST_OUTPUT_DIR = path.resolve(__dirname, '../assets/test/json');
const EXPECTED_JSON = path.resolve(BITMARK_GRAMMAR_DIR, 'src/tests/EXPECTED.json');
const EXPECTED_JSON_MATCH_REG_EX = new RegExp('<<<<(.+)(\\n[^<<<<]*\\n)<<<<', 'gm');

const jsonParser = new JsonParser();
const bitmarkParser = new BitmarkParser();

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

function getTestJson(): JsonTestCases {
  const testJson: JsonTestCases = {};
  const expectedJson = fs.readFileSync(EXPECTED_JSON, { encoding: 'utf8', flag: 'r' });

  const matches = expectedJson.matchAll(EXPECTED_JSON_MATCH_REG_EX);
  let i = 0;

  for (const m of matches) {
    let id = 'not set';

    try {
      if (m.length === 3) {
        id = (m[1] || '/unknown.bit').replace(/.+\/(.+)\.bit/, '$1').trim();
        const json = JSON.parse(m[2]);

        testJson[id] = new JsonTestCase(id, json);
      } else {
        throw new Error(`Match is wrong length: ${m.length}`);
      }
    } catch (e) {
      console.info(`Ignoring invalid test JSON: ${id}, index: ${i}`);
    }
    i++;
  }
  return testJson;
}

function writeTestJson(allTestJson: JsonTestCases): void {
  // Ensure required folders
  fs.ensureDirSync(JSON_TEST_OUTPUT_DIR);

  for (const testJson of Object.values(allTestJson)) {
    const { id, json } = testJson;

    // Write original JSON
    const jsonFile = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));

    // Write original Bitmark
    const bitwrappers = jsonParser.preprocessJson(json);

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
}

describe('bitmark-generator', () => {
  describe('JSON -> Markup -> JSON: Basic', () => {
    const allTestJsonMap = getTestJson();

    console.info(`JSON tests found: ${Object.keys(allTestJsonMap).length}`);

    // Write the json to file
    writeTestJson(allTestJsonMap);

    const allTestJson = Object.values(allTestJsonMap);
    // const allTestJson = [allTestJsonMap['learning-path6']];

    // Error cases
    //
    // interview102 - [&image] is after questions which fails in the parser
    // interview106 - Whitespace is not trimmed on front of 'question' by parser
    // interview108 - [&article] is after questions which fails in the parser

    // describe.each(allTestJson)('Test file: %s', (testJson: JsonTestCase) => {
    // test('JSON ==> Markup ==> JSON', async () => {
    allTestJson.forEach((testJson) => {
      test(`${testJson.id}`, async () => {
        const { id, json } = testJson;

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(json, { removeParser: true, removeErrors: true });

        // Convert the bitmark JSON to bitmark AST
        const bitmarkAst = jsonParser.toAst(json);

        // Generate markup code from AST
        const markupFile = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.gen.bit`);
        const generator = new BitmarkFileGenerator(markupFile, undefined, {
          explicitTextFormat: false,
        });

        await generator.generate(bitmarkAst);

        const markup = fs.readFileSync(markupFile, 'utf8');

        // Generate JSON from generated bitmark markup using the parser
        let newJson = [];
        try {
          const newJsonStr = bitmarkParser.parse(markup);
          newJson = JSON.parse(newJsonStr);
        } catch {
          throw new Error('Failed to parse bitmark-grammer output');
        }

        // Write the new JSON
        const fileNewJson = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.gen.json`);
        fs.writeFileSync(fileNewJson, JSON.stringify(newJson, null, 2), {
          encoding: 'utf8',
        });

        // Remove uninteresting JSON items
        BitJsonUtils.cleanupJson(json, { removeMarkup: true });
        BitJsonUtils.cleanupJson(newJson, { removeMarkup: true, removeParser: true, removeErrors: true });

        // Compare old and new JSONs
        const diffMap = deepDiffMapper.map(json, newJson, {
          ignoreUnchanged: true,
        });

        // Write the diff Map JSON
        const fileDiffMap = path.resolve(JSON_TEST_OUTPUT_DIR, `${id}.diff.json`);
        fs.writeFileSync(fileDiffMap, JSON.stringify(diffMap, null, 2), {
          encoding: 'utf8',
        });

        expect(newJson).toEqual(json);

        // const equal = deepEqual(newJson, json, { strict: true });
        // expect(equal).toEqual(true);
      });
    });
  });
});