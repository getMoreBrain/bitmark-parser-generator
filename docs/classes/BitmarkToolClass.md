[@bitmark-standard/bitmark-generator](../API.md) / [Modules](../modules.md) / BitmarkToolClass

# Class: BitmarkToolClass

Bitmark tool for manipulating bitmark in all its formats.

## Table of contents

### Constructors

- [constructor](BitmarkToolClass.md#constructor)

### Methods

- [convert](BitmarkToolClass.md#convert)
- [createAst](BitmarkToolClass.md#createAst)

## Constructors

### constructor

• **new BitmarkToolClass**()

## Methods

### convert

▸ **convert**(`input`, `options?`): `Promise`<`unknown`\>

Convert bitmark from bitmark to JSON, or JSON to bitmark.

Input type is detected automatically and may be string, object, or file

Output type is selected automatically based on input type detection:
- input = json, output = bitmark
- input = bitmark, output = json

By default, the result is returned as a string for bitmark, or a plain JS object for JSON.

The options can be used to write the output to a file and to set conversion options or override defaults.

**`Throws`**

Error if any error occurs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `unknown` | bitmark or JSON as a string, plain JS object, or file path. |
| `options?` | [`ConvertOptions`](../interfaces/ConvertOptions.md) | the conversion options |

#### Returns

`Promise`<`unknown`\>

Promise that resolves to string if converting to bitmark, a plain JS object if converting to JSON, or
void if writing to a file

#### Defined in

BitmarkTool.ts:80

___

### createAst

▸ **createAst**(`input`): [`BitmarkAst`](../interfaces/BitmarkAst.md)

Create a bitmark AST (Abstract Syntax Tree) from bitmark or JSON

Input type is detected automatically and may be string, object, or file

**`Throws`**

Error if any error occurs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `unknown` | the JSON or bitmark to convert to a bitmark AST |

#### Returns

[`BitmarkAst`](../interfaces/BitmarkAst.md)

bitmark AST

#### Defined in

BitmarkTool.ts:159
