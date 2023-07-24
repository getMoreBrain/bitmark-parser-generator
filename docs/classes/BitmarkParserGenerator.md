[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkParserGenerator

# Class: BitmarkParserGenerator

Bitmark tool for manipulating bitmark in all its formats.

## Table of contents

### Constructors

- [constructor](BitmarkParserGenerator.md#constructor)

### Methods

- [version](BitmarkParserGenerator.md#version)
- [convert](BitmarkParserGenerator.md#convert)
- [upgrade](BitmarkParserGenerator.md#upgrade)
- [createAst](BitmarkParserGenerator.md#createAst)

## Constructors

### constructor

• **new BitmarkParserGenerator**()

## Methods

### version

▸ **version**(): `string`

Get the version of the bitmark-parser-generator library

#### Returns

`string`

#### Defined in

[BitmarkParserGenerator.ts:159](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L159)

___

### convert

▸ **convert**(`input`, `options?`): `Promise`<`unknown`\>

Convert bitmark from bitmark to JSON, or JSON to bitmark.

Input type is detected automatically and may be:
- string: bitmark, JSON, or AST
- object: JSON or AST
- file: bitmark, JSON, or AST

Output type is selected automatically based on input type detection:
- input(JSON/AST) ==> output(bitmark)
- input(bitmark)  ==> output(JSON)

By default, the result is returned as a string for bitmark, or a plain JS object for JSON/AST.

The options can be used to write the output to a file and to set conversion options or override defaults.

If both the input and output formats are the same, the input will be validated and rewritten.
This feature be used to upgrade bitmark or JSON to the latest version.

**`Throws`**

Error if any error occurs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `unknown` | bitmark or JSON or AST as a string, JSON or AST as plain JS object, or path to a file containing bitmark, JSON, or AST. |
| `options?` | [`ConvertOptions`](../interfaces/ConvertOptions.md) | the conversion options |

#### Returns

`Promise`<`unknown`\>

Promise that resolves to string if converting to bitmark, a plain JS object if converting to JSON, or
void if writing to a file

#### Defined in

[BitmarkParserGenerator.ts:189](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L189)

___

### upgrade

▸ **upgrade**(`input`, `options?`): `Promise`<`unknown`\>

Upgrade bitmark or JSON, upgrading to the latest supported syntax, removing unrecognised data in the process.

THIS FEATURE SHOULD BE USED WITH CAUTION. IT WILL POTENTIALLY DELETE DATA.

Input type is detected automatically and may be:
- string: bitmark, JSON
- object: JSON
- file: bitmark, JSON

Output type is the same as the detected input type

By default, the result is returned as a string for bitmark, or a plain JS object for JSON.

The options can be used to write the output to a file and to set conversion options or override defaults.

If both the input and output formats are the same, the input will be validated and rewritten.

**`Throws`**

Error if any error occurs

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `unknown` | bitmark or JSON or AST as a string, JSON or AST as plain JS object, or path to a file containing bitmark, JSON, or AST. |
| `options?` | [`PrettifyOptions`](../interfaces/PrettifyOptions.md) | the conversion options |

#### Returns

`Promise`<`unknown`\>

Promise that resolves to string if upgrading to bitmark, a plain JS object if converting to JSON, or
void if writing to a file

#### Defined in

[BitmarkParserGenerator.ts:414](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L414)

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

[BitmarkParserGenerator.ts:504](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L504)
