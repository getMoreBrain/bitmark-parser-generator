@getmorebrain/bitmark-parser-generator
================

![Build & Test](https://github.com/getMoreBrain/bitmark-parser-generator/actions/workflows/build-test.yml/badge.svg?branch=main)

NOTE: THIS PROJECT IS NOT YET PRODUCTION READY.

A bitmark parser and generator using an Abstract Syntax Tree (AST) and Peggy.js.

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

### CDN

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
  output: "./output.ast.json", // Output to file rather than <stdout>
  outputFormat: 'ast'          // Output AST rather than the default output
  fileOptions: {
    append: true,              // Append to output file rather than overwriting
  },
  jsonOptions: {
    prettify: 2,               // Prettify the JSON output with an indent of 2
  },
  bitmarkOptions: {
    explicitTextFormat: true,  // Include bitmark text format even when it is the default
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



## Advanced Usage

More advanced usage is possible, such as implementing custom streaming output writers.

See the [API Documentation](docs/API.md) for more information.

## License

This open source software is licenced under the [ISC licence](https://opensource.org/license/isc-license-txt).
