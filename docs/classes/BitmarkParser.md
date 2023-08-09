[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkParser

# Class: BitmarkParser

## Table of contents

### Constructors

- [constructor](BitmarkParser.md#constructor)

### Methods

- [toAst](BitmarkParser.md#toAst)
- [parseUsingAntlr](BitmarkParser.md#parseUsingAntlr)

## Constructors

### constructor

• **new BitmarkParser**()

## Methods

### toAst

▸ **toAst**(`bitmark`, `options?`): [`BitmarkAst`](../interfaces/BitmarkAst.md)

Convert Bitmark markup to AST.

The Bitmark markup should be a string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `bitmark` | `string` |
| `options?` | `BitmarkParserOptions` |

#### Returns

[`BitmarkAst`](../interfaces/BitmarkAst.md)

bitmark AST

#### Defined in

[parser/bitmark/BitmarkParser.ts:43](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/parser/bitmark/BitmarkParser.ts#L43)

___

### parseUsingAntlr

▸ **parseUsingAntlr**(`pathOrMarkup`): [`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

Perform parsing using the ANTLR parser.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pathOrMarkup` | `string` | path to bitmark markup file, or bitmark markup as a string |

#### Returns

[`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

JSON object representing the bitmark markup

#### Defined in

[parser/bitmark/BitmarkParser.ts:59](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/parser/bitmark/BitmarkParser.ts#L59)
