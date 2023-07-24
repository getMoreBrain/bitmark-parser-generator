[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonFileGenerator

# Class: JsonFileGenerator

Generate bitmark JSON from a bitmark AST as a file

TODO: NOT IMPLEMENTED!

## Implements

- [`Generator`](../interfaces/Generator.md)<[`BitmarkAst`](../interfaces/BitmarkAst.md)\>

## Table of contents

### Constructors

- [constructor](JsonFileGenerator.md#constructor)

### Methods

- [generate](JsonFileGenerator.md#generate)
- [generateSync](JsonFileGenerator.md#generateSync)

## Constructors

### constructor

• **new JsonFileGenerator**(`path`, `options?`)

Generate bitmark JSON from a bitmark AST as a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `PathLike` | path of file to generate |
| `options?` | `JsonFileGeneratorOptions` | - |

#### Defined in

[generator/json/JsonFileGenerator.ts:35](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonFileGenerator.ts#L35)

## Methods

### generate

▸ **generate**(`ast`): `Promise`<`void`\>

Generate bitmark JSON from bitmark AST as a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Generator](../interfaces/Generator.md).[generate](../interfaces/Generator.md#generate)

#### Defined in

[generator/json/JsonFileGenerator.ts:45](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonFileGenerator.ts#L45)

___

### generateSync

▸ **generateSync**(`_ast`): `string`

Generate bitmark JSON from bitmark AST as a file synchronously

#### Parameters

| Name | Type |
| :------ | :------ |
| `_ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) |

#### Returns

`string`

#### Implementation of

[Generator](../interfaces/Generator.md).[generateSync](../interfaces/Generator.md#generateSync)

#### Defined in

[generator/json/JsonFileGenerator.ts:54](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonFileGenerator.ts#L54)
