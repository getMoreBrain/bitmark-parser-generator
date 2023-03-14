import fs from 'fs-extra';
import path from 'path';

const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
const BITMARK_GRAMMAR_DIR = path.resolve(NODE_MODULES_DIR, 'bitmark-grammar');
const inputFilename = path.resolve(BITMARK_GRAMMAR_DIR, 'src/tests/EXPECTED.json');
const exampleDir = path.resolve(__dirname, '../assets/example');
// const inputFilename = path.resolve(exampleDir, './expected/EXPECTED.JSON');

console.log(`Splitting: ${inputFilename}`);

async function run() {
  try {
    const allJson = (await fs.readFile(inputFilename)).toString('utf8').split('\n');
    console.log(`Line Count: ${allJson.length}`);

    const writeJsonFile = (filename, jsonStr: string) => {
      try {
        const json = JSON.stringify(JSON.parse(jsonStr), null, 2);
        fs.ensureDirSync(path.dirname(filename));
        const fd = fs.openSync(filename, 'w');
        fs.writeSync(fd, json);
        console.log(`Wrote: ${filename}`);
      } catch (e) {
        console.error(e);
        console.error(`Failed to convert/write: ${filename}`);
      }
    };

    let jsonFilename = '';
    let inJson = false;
    let jsonStr = '';
    for (const line of allJson) {
      if (line.startsWith('<<<<')) {
        if (inJson) {
          // Write current JSON
          writeJsonFile(jsonFilename, jsonStr);
          // break;
        }
        inJson = false;
        jsonStr = '';
        jsonFilename = path.resolve(exampleDir, line.replace('<<<<', '').replace('.bit', '.json'));
      } else {
        inJson = true;
      }
      if (inJson) {
        jsonStr += `${line}\n`;
      }
    }
  } catch (e) {
    console.error(`Failed: `, e);
  }
}

run();
