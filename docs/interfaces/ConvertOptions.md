[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / ConvertOptions

# Interface: ConvertOptions

Conversion options for bitmark / JSON conversion

## Table of contents

### Properties

- [bitmarkVersion](ConvertOptions.md#bitmarkVersion)
- [bitmarkParserType](ConvertOptions.md#bitmarkParserType)
- [outputFormat](ConvertOptions.md#outputFormat)
- [outputFile](ConvertOptions.md#outputFile)
- [fileOptions](ConvertOptions.md#fileOptions)
- [bitmarkOptions](ConvertOptions.md#bitmarkOptions)
- [jsonOptions](ConvertOptions.md#jsonOptions)

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

[BitmarkParserGenerator.ts:57](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L57)

___

### bitmarkParserType

• `Optional` **bitmarkParserType**: [`BitmarkParserTypeType`](../modules.md#BitmarkParserTypeType)

Specify the bitmark parser to use, overriding the default

#### Defined in

[BitmarkParserGenerator.ts:62](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L62)

___

### outputFormat

• `Optional` **outputFormat**: [`OutputType`](../modules.md#OutputType)

Specify the output format, overriding the default

#### Defined in

[BitmarkParserGenerator.ts:67](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L67)

___

### outputFile

• `Optional` **outputFile**: `PathLike`

Specify a file to write the output to

#### Defined in

[BitmarkParserGenerator.ts:71](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L71)

___

### fileOptions

• `Optional` **fileOptions**: [`FileOptions`](FileOptions.md)

Options for the output file

#### Defined in

[BitmarkParserGenerator.ts:75](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L75)

___

### bitmarkOptions

• `Optional` **bitmarkOptions**: [`BitmarkOptions`](BitmarkOptions.md)

Options for bitmark generation

#### Defined in

[BitmarkParserGenerator.ts:79](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L79)

___

### jsonOptions

• `Optional` **jsonOptions**: [`JsonOptions`](JsonOptions.md)

Options for JSON generation

#### Defined in

[BitmarkParserGenerator.ts:83](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L83)
