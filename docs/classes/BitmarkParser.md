[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkParser

# Class: BitmarkParser

## Table of contents

### Constructors

- [constructor](BitmarkParser.md#constructor)

### Methods

- [toAst](BitmarkParser.md#toAst)
- [parse](BitmarkParser.md#parse)

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

[parser/bitmark/BitmarkParser.ts:25](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/parser/bitmark/BitmarkParser.ts#L25)

___

### parse

▸ **parse**(`pathOrMarkup`): [`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathOrMarkup` | `string` |

#### Returns

[`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

#### Defined in

[parser/bitmark/BitmarkParser.ts:35](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/parser/bitmark/BitmarkParser.ts#L35)
