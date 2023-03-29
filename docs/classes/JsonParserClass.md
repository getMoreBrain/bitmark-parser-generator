[@bitmark-standard/bitmark-generator](../API.md) / [Modules](../modules.md) / JsonParserClass

# Class: JsonParserClass

A parser for parsing bitmark JSON to bitmark AST

## Table of contents

### Constructors

- [constructor](JsonParserClass.md#constructor)

### Methods

- [toAst](JsonParserClass.md#toAst)
- [preprocessJson](JsonParserClass.md#preprocessJson)
- [isBitWrapper](JsonParserClass.md#isBitWrapper)
- [isBit](JsonParserClass.md#isBit)
- [bitToBitWrapper](JsonParserClass.md#bitToBitWrapper)

## Constructors

### constructor

• **new JsonParserClass**()

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

parser/json/JsonParser.ts:71

___

### preprocessJson

▸ **preprocessJson**(`json`): [`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

Preprocess bitmark JSON into a standard format (BitWrapperJson[]) from either a bit or a bitwrapper as a string
or a plain JS object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `json` | `unknown` | bitmark JSON as a string or a plain JS object |

#### Returns

[`BitWrapperJson`](../interfaces/BitWrapperJson.md)[]

bitmark JSON in a standard format (BitWrapperJson[])

#### Defined in

parser/json/JsonParser.ts:99

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

parser/json/JsonParser.ts:142

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

parser/json/JsonParser.ts:156

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

parser/json/JsonParser.ts:170
