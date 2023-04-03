@bitmark-standard/bitmark-generator
================

![Build & Test](https://github.com/getMoreBrain/bitmark-generator/actions/workflows/build-test.yml/badge.svg?branch=main)

A bitmark generator using an Abstract Syntax Tree (AST).

Use this package to programmatically create bitmark or convert between bitmark formats.

## Installation

### Package manager

Using yarn:
```
$ yarn add @bitmark-standard/bitmark-generator
```

Using npm:
```
$ npm install @bitmark-standard/bitmark-generator
```

### CDN

Using jsDelivr CDN (ES5 UMD module):

```html
<script src="https://cdn.jsdelivr.net/npm/@bitmark-standard/bitmark-generator@0.0.1/dist/browser/bitmark-generator.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@bitmark-standard/bitmark-generator@0.0.1/dist/bitmark-generator.min.js"></script>
```

## Basic Usage


### Import

```ts
// Modules
import { BitmarkTool } from 'bitmark-generator';

// CommonJS
const { BitmarkTool } = require('bitmark-generator');

// Browser UMD
const { BitmarkTool } = window.bitmarkGenerator;
```

### Conversion

```ts
const tool = new BitmarkTool();

// Convert bitmark markup to bitmark JSON
const json = await tool.convert("[.article] Hello World");

// Convert bitmark JSON to bitmark markuo
const bitmark = await tool.convert('[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark--", "body": "Hello World" }}]');

// Convert bitmark markup file to bitmark JSON
await tool.convert("./input.bit", { output: "./output.json" });

// Convert bitmark JSON to bitmark markup
await tool.convert("./input.json", { output: "./output.bit" });
```

### Convertion Options

```ts
// Convert bitmark JSON to bitmark markup with options
await tool.convert("./input.json", {
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
import { BitmarkTool, Builder, Ast, BitType, TextFormat } from 'bitmark-generator';

const tool = new BitmarkTool();
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
tool.convert(ast, { output: "./output.bit" });

// Write the AST to bitmark JSON
tool.convert(ast, { output: "./output.json", outputFormat: 'json' });
```



## Advanced Usage

More advanced usage is possible, such as implementing custom streaming output writers.

See the [API Documentation](docs/API.md) for more information.


## License

This open source software is licenced under the [ISC licence](https://opensource.org/license/isc-license-txt).
