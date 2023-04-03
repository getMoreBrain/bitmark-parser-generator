[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / BitmarkTool

# Class: BitmarkTool

Bitmark tool for manipulating bitmark in all its formats.

## Table of contents

### Constructors

- [constructor](BitmarkTool.md#constructor)

### Methods

- [convert](BitmarkTool.md#convert)
- [createAst](BitmarkTool.md#createAst)

## Constructors

### constructor

• **new BitmarkTool**()

## Methods

### convert

▸ **convert**(`input`, `options?`): `Promise`<`unknown`\>

TODO
- put all the conversions in functions to make code clearer
- implement conversions that are 'not supported' using bitmark parser

Convert bitmark from bitmark to JSON, or JSON to bitmark.

Input type is detected automatically and may be string, object (JSON or AST), or file

Output type is selected automatically based on input type detection:
- input(JSON/AST) ==> output(bitmark)
- input(bitmark)  ==> output(JSON)

By default, the result is returned as a string for bitmark, or a plain JS object for JSON/AST.

The options can be used to write the output to a file and to set conversion options or override defaults.

**`Throws`**

Error if any error occurs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `unknown` | bitmark or JSON as a string, JSON or AST as plain JS object, or path to a file containing JSON, AST, or bitmark. |
| `options?` | [`ConvertOptions`](../interfaces/ConvertOptions.md) | the conversion options |

#### Returns

`Promise`<`unknown`\>

Promise that resolves to string if converting to bitmark, a plain JS object if converting to JSON, or
void if writing to a file

#### Defined in

[BitmarkTool.ts:94](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/BitmarkTool.ts#L94)

___

### createAst

▸ **createAst**(`input`): [`BitmarkAst`](../interfaces/BitmarkAst.md)

Create a bitmark AST (Abstract Syntax Tree) from bitmark or JSON or AST

Input type is detected automatically and may be string, object (JSON or AST), or file

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

[BitmarkTool.ts:214](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/BitmarkTool.ts#L214)
