[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / JsonParser

# Class: JsonParser

A parser for parsing bitmark JSON to bitmark AST

## Table of contents

### Constructors

- [constructor](JsonParser.md#constructor)

### Methods

- [toAst](JsonParser.md#toAst)
- [preprocessJson](JsonParser.md#preprocessJson)
- [isBitWrapper](JsonParser.md#isBitWrapper)
- [isBit](JsonParser.md#isBit)
- [bitToBitWrapper](JsonParser.md#bitToBitWrapper)

## Constructors

### constructor

• **new JsonParser**()

## Methods

### toAst

▸ **toAst**(`json`): [`BitmarkAst`](../interfaces/BitmarkAst.md)

Convert JSON to AST.

The JSON can be a bit or a bitwrapper and can be a string or a plain JS object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `json` | `unknown` | bitmark JSON as a string or a plain JS object |

#### Returns

[`BitmarkAst`](../interfaces/BitmarkAst.md)

bitmark AST

#### Defined in

[parser/json/JsonParser.ts:73](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/parser/json/JsonParser.ts#L73)

___

### preprocessJson

▸ **preprocessJson**(`json`): [`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

Preprocess bitmark JSON into a standard format (BitWrapperJson[] object) from either a bit or a bitwrapper
as a string or a plain JS object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `json` | `unknown` | bitmark JSON as a string or a plain JS object |

#### Returns

[`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

bitmark JSON in a standard format (BitWrapperJson[] object)

#### Defined in

[parser/json/JsonParser.ts:101](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/parser/json/JsonParser.ts#L101)

___

### isBitWrapper

▸ **isBitWrapper**(`bitWrapper`): `boolean`

Check if a plain JS object is valid BitWrapper JSON

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bitWrapper` | `unknown` | a plain JS object that might be BitWrapper JSON |

#### Returns

`boolean`

true if BitWrapper JSON, otherwise false

#### Defined in

[parser/json/JsonParser.ts:144](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/parser/json/JsonParser.ts#L144)

___

### isBit

▸ **isBit**(`bit`): `boolean`

Check if a plain JS object is valid Bit JSON

#### Parameters

| Name | Type |
| :------ | :------ |
| `bit` | `unknown` |

#### Returns

`boolean`

true if Bit JSON, otherwise false

#### Defined in

[parser/json/JsonParser.ts:158](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/parser/json/JsonParser.ts#L158)

___

### bitToBitWrapper

▸ **bitToBitWrapper**(`bit`): [`BitWrapperJson`](../interfaces/BitWrapperJson.md)

Convert a Bit to BitWrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bit` | [`BitJson`](../interfaces/BitJson.md) | a valid Bit |

#### Returns

[`BitWrapperJson`](../interfaces/BitWrapperJson.md)

the Bit wrapper in a BitWrapper

#### Defined in

[parser/json/JsonParser.ts:172](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/parser/json/JsonParser.ts#L172)
