@gmb/bitmark-parser-generator
================

![Build & Test](https://github.com/getMoreBrain/bitmark-parser-generator/actions/workflows/build-test.yml/badge.svg?branch=main)

A bitmark parser and generator using Peggy.js.

[Try out bitmark - visit the bitmark Playground](https://getmorebrain.github.io/bitmark-playground/)

Features:
- Convert bitmark to JSON, and vice-versa.
- Programmatically create or modify bitmark.
- Works in NodeJS or the browser.
- Validate and prettify bitmark.
- Fast, with a small browser footprint, less than 60kB.

[List of supported bits](./SUPPORTED_BITS.md)

## Installation

### Package manager

Using yarn:
```sh
$ yarn add @gmb/bitmark-parser-generator
```

Using npm:
```sh
$ npm install @gmb/bitmark-parser-generator
```

### CDN

Using jsDelivr CDN (ES6 UMD module):

```html
<script src="https://cdn.jsdelivr.net/npm/@gmb/bitmark-parser-generator@latest/dist/browser/bitmark-parser-generator.min.js"></script>
```

Using unpkg CDN (ES6 UMD module):

```html
<script src="https://unpkg.com/@gmb/bitmark-parser-generator@latest/dist/browser/bitmark-parser-generator.min.js"></script>
```

Replace `latest` with a specific version in either of the URLs above to use a specific version.

## Basic Usage


### Import

```ts
// Modules
import { BitmarkParserGenerator } from '@gmb/bitmark-parser-generator';

// CommonJS
const { BitmarkParserGenerator } = require('@gmb/bitmark-parser-generator');

// Browser UMD
const { BitmarkParserGenerator } = window.bitmarkParserGenerator;
```

### Conversion

```ts
const bpg = new BitmarkParserGenerator();

// Convert bitmark markup to bitmark JSON
const json = await bpg.convert("[.article] Hello World");

// Convert bitmark JSON to bitmark markup
const bitmark = await bpg.convert('[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++", "bitLevel": 1, "body": "Hello World" }}]');

// Convert bitmark markup file to bitmark JSON
await bpg.convert("./input.bitmark", { output: "./output.json" });

// Convert bitmark JSON to bitmark markup
await bpg.convert("./input.json", { output: "./output.bitmark" });
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
    explicitTextFormat: false,     // Include bitmark text format even when it is the default (bitmark++). Default: false
    prettifyJson: 2,               // Prettify the body JSON output. Default: not prettified
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
      textFormat: TextFormat.bitmarkText,
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
bpg.convert(ast, { output: "./output.bitmark" });

// Write the AST to bitmark JSON
bpg.convert(ast, { output: "./output.json", outputFormat: 'json' });
```

### Breakscaping

A text can be breakscaped programmatically for inclusion in bitmark.

NOTE: It is recommended the bit builder documented above in Programmatic Bitmark Creation is used rather than
hand-coding bitmark creation, because it guarantees the bitmark will be valid, and all breakscaping will be correct.

When breakscaping a text for inclusion in bitmark, the breakscaping applied depends on where that text appears in the
bitmark. The following four text locations require different breakscaping:

| Bit Format           | Text Location |
|----------|-------------|
| bitmark++            | body |
| bitmark++            | tag |
| text (not bitmark++) | body |
| text (not bitmark++) | tag |

Also, if a plain text divider `==== text ====` is used, then text after the divider must be breakscaped using
`text:body` even if the bit is `bitmark++`.

```ts
import { BitmarkParserGenerator, BodyTextFormat, TextLocation, InputType } from 'bitmark-parser-generator';

const bpg = new BitmarkParserGenerator();


const breakscaped = bpg.breakscapeText("This is the [!text] to be breakscaped", {
  inputFormat: InputType.string, // or "string"
  textFormat: BodyTextFormat.bitmarkPlusPlus, // or "bitmark++"
  textLocation: TextLocation.body, // or "body"
});
// breakscaped = "This is the [^!text] to be breakscaped"


const breakscaped = bpg.breakscapeText("This is the [!text] to be breakscaped", {
  inputFormat: InputType.string, // or "string"
  textFormat: BodyTextFormat.bitmarkPlusPlus, // or "bitmark++"
  textLocation: TextLocation.tag, // or "tag"
});
// breakscaped = "This is the [!text^] to be breakscaped"
```



### Info

Information about the supported bits can be retreived via the info API

```ts
import { BitmarkParserGenerator } from 'bitmark-parser-generator';

const bpg = new BitmarkParserGenerator();

// Write supported bit info to the console
const info = bpg.info();
console.log(JSON.stringify(info, null, 2));
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
const bitmark = await bpg.convert('[{"bitmark": "[.article] Hello World","bit": { "type": "article", "format": "bitmark++",
"bitLevel": 1, "body": "Hello World", unknownProperty: "Will be removed" }}]');

// Upgrade bitmark markup file to another file
await bpg.convert("./input.bitmark", { output: "./output.bitmark" });

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
