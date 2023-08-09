[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / PrettifyOptions

# Interface: PrettifyOptions

Prettify options for bitmark / JSON prettify / validate

## Table of contents

### Properties

- [bitmarkVersion](PrettifyOptions.md#bitmarkVersion)
- [bitmarkParserType](PrettifyOptions.md#bitmarkParserType)
- [outputFile](PrettifyOptions.md#outputFile)
- [fileOptions](PrettifyOptions.md#fileOptions)
- [bitmarkOptions](PrettifyOptions.md#bitmarkOptions)
- [jsonOptions](PrettifyOptions.md#jsonOptions)

## Properties

### bitmarkVersion

• `Optional` **bitmarkVersion**: [`BitmarkVersionType`](../modules.md#BitmarkVersionType)

The version of bitmark to output.
If not specified, the version will be 3.

Specifying the version will set defaults for other options.
- Bitmark v2:
  - bitmarkOptions.cardSetVersion: 1
  - jsonOptions.textAsPlainText: true
- Bitmark v3:
  - bitmarkOptions.cardSetVersion: 2
  - jsonOptions.textAsPlainText: false

#### Defined in

[BitmarkParserGenerator.ts:103](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L103)

___

### bitmarkParserType

• `Optional` **bitmarkParserType**: [`BitmarkParserTypeType`](../modules.md#BitmarkParserTypeType)

Specify the bitmark parser to use, overriding the default

#### Defined in

[BitmarkParserGenerator.ts:108](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L108)

___

### outputFile

• `Optional` **outputFile**: `PathLike`

Specify a file to write the output to

#### Defined in

[BitmarkParserGenerator.ts:112](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L112)

___

### fileOptions

• `Optional` **fileOptions**: [`FileOptions`](FileOptions.md)

Options for the output file

#### Defined in

[BitmarkParserGenerator.ts:116](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L116)

___

### bitmarkOptions

• `Optional` **bitmarkOptions**: [`BitmarkOptions`](BitmarkOptions.md)

Options for bitmark generation

#### Defined in

[BitmarkParserGenerator.ts:120](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L120)

___

### jsonOptions

• `Optional` **jsonOptions**: [`JsonOptions`](JsonOptions.md)

Options for JSON generation

#### Defined in

[BitmarkParserGenerator.ts:124](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L124)
