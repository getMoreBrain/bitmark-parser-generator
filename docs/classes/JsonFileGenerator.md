[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonFileGenerator

# Class: JsonFileGenerator

Generate bitmark JSON from a bitmark AST as a file

TODO: NOT IMPLEMENTED!

## Implements

- [`Generator`](../interfaces/Generator.md)<`void`\>

## Table of contents

### Constructors

- [constructor](JsonFileGenerator.md#constructor)

### Methods

- [generate](JsonFileGenerator.md#generate)

## Constructors

### constructor

• **new JsonFileGenerator**(`path`, `fileOptions?`, `jsonOptions?`)

Generate bitmark JSON from a bitmark AST as a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `PathLike` | path of file to generate |
| `fileOptions?` | [`FileOptions`](../interfaces/FileOptions.md) | file options |
| `jsonOptions?` | [`JsonOptions`](../interfaces/JsonOptions.md) | - |

#### Defined in

[generator/json/JsonFileGenerator.ts:24](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/json/JsonFileGenerator.ts#L24)

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

Generator.generate

#### Defined in

[generator/json/JsonFileGenerator.ts:34](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/json/JsonFileGenerator.ts#L34)
