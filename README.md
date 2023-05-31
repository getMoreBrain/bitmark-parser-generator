@getmorebrain/bitmark-parser-generator
================

![Build & Test](https://github.com/getMoreBrain/bitmark-parser-generator/actions/workflows/build-test.yml/badge.svg?branch=main)

NOTE: THIS PROJECT IS NOT YET PRODUCTION READY.

A bitmark parser and generator using Peggy.js.

[List of supported bits](./SUPPORTED_BITS.md)

Use this package to:
- parse bitmark markup in NodeJS or the browser.
- programmatically create or modify bitmark.
- validate and prettify bitmark.

## Installation

### Package manager

Using yarn:
```
$ yarn add @getmorebrain/bitmark-parser-generator
```

Using npm:
```
$ npm install @getmorebrain/bitmark-parser-generator
```

### CDN (TODO - not yet implemented)

Using jsDelivr CDN (ES5 UMD module):

```html
<script src="https://cdn.jsdelivr.net/npm/@getmorebrain/bitmark-parser-generator@<version>/dist/browser/bitmark-parser-generator.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@getmorebrain/bitmark-parser-generator@<version>/dist/bitmark-parser-generator.min.js"></script>
```

## Basic Usage


### Import

```ts
// Modules
import { BitmarkParserGenerator } from 'bitmark-parser-generator';

// CommonJS
const { BitmarkParserGenerator } = require('bitmark-parser-generator');

// Browser UMD
const { BitmarkParserGenerator } = window.bitmarkParserGenerator;
```

### Conversion

```ts
const bpg = new BitmarkParserGenerator();

// Convert bitmark markup to bitmark JSON
const json = await bpg.convert("[.article] Hello World");

// Convert bitmark JSON to bitmark markuo
const bitmark = await bpg.convert('[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark--", "body": "Hello World" }}]');

// Convert bitmark markup file to bitmark JSON
await bpg.convert("./input.bit", { output: "./output.json" });

// Convert bitmark JSON to bitmark markup
await bpg.convert("./input.json", { output: "./output.bit" });
```

### Convertion Options

```ts
// Convert bitmark JSON to bitmark markup with options
await bpg.convert("./input.json", {
  bitmarkParserType: 'peggy',      // The parser type to use. 'peggy' or 'antlr'. Default: 'peggy'
  outputFormat: 'ast',             // Output AST rather than the default output. Default: automatic
  outputFile: "./output.ast.json", // Output to file rather than <stdout>. Default: <stdout>
  fileOptions: {
    append: true,                  // Append to output file. Default: overwrite
    encoding: 'utf8',              // Specify a file encoding. Default: 'utf8'
  },
  jsonOptions: {
    prettify: 2,                   // Prettify the JSON output. Default: not prettified
    stringify: false,              // Return JSON as a string. Default: plain JS object
    includeExtraProperties: false, // Include extra (non-standard) properties from the markup in the JSON: Default: ignore
    debugGenerationInline: false,  // [development only] Include debugging tags in the generated output. Default: false
  },
  bitmarkOptions: {
    explicitTextFormat: false,     // Include bitmark text format even when it is the default (bitmark--). Default: false
    cardSetVersion: 1,             // Output markup using the specified cardSet format. Default: 1
    debugGenerationInline: false,  // [development only] Include debugging tags in the generated output. Default: false
  }
});
```

### Programmatic Bitmark Creation

```ts
import { BitmarkParserGenerator, Builder, Ast, BitType, TextFormat } from 'bitmark-parser-generator';

const bpg = new BitmarkParserGenerator();
const builder = new Builder();

// Create bitmark AST programatically
const ast = builder.bitmark({
  bits: [
    builder.bit({
      bitType: BitType.article,
      textFormat: TextFormat.bitmarkMinusMinus,
      body: builder.body({
        bodyParts: [
          builder.bodyText({
            text: "Hello World!"
          })
        ]
      }),
    })
  ]
});

// Write the AST to bitmark markup
bpg.convert(ast, { output: "./output.bit" });

// Write the AST to bitmark JSON
bpg.convert(ast, { output: "./output.json", outputFormat: 'json' });
```


### Upgrade

The bitmark-parser-generator can 'upgrade' bitmark markup or JSON. This will upgrade the markup / JSON to the latest
version and remove any invalid code or markup.

THIS FEATURE SHOULD BE USED WITH CAUTION. IT WILL POTENTIALLY DELETE DATA.

If the input contains data that is invalid or unrecognised, it will be removed from the output. Therefore it is
recommended to use this feature with source code control or another system for data backup.

```ts
const bpg = new BitmarkParserGenerator();

// Upgrade bitmark markup
const json = await bpg.convert("[.article] Hello World [$I will be removed as I am invalid]");

// Upgrade bitmark JSON
const bitmark = await bpg.convert('[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark--", "body": "Hello World", unknownProperty: "Will be removed" }}]');

// Upgrade bitmark markup file to another file
await bpg.convert("./input.bit", { output: "./output.bit" });

// Upgrade bitmark JSON file to another file
await bpg.convert("./input.json", { output: "./output.json" });
```


### Version

```ts
// Get the bitmar-parser-generator version
const version = bpg.version();

```



## Advanced Usage

More advanced usage is possible, such as implementing custom streaming output writers.

See the [API Documentation](docs/API.md) for more information.

## License

This open source software is licenced under the [ISC licence](https://opensource.org/license/isc-license-txt).
