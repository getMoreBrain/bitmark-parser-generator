[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkFileGenerator

# Class: BitmarkFileGenerator

Generate bitmark markup from a bitmark AST as a file

## Implements

- [`Generator`](../interfaces/Generator.md)<[`BitmarkAst`](../interfaces/BitmarkAst.md)\>

## Table of contents

### Constructors

- [constructor](BitmarkFileGenerator.md#constructor)

### Methods

- [generate](BitmarkFileGenerator.md#generate)
- [generateSync](BitmarkFileGenerator.md#generateSync)

## Constructors

### constructor

• **new BitmarkFileGenerator**(`path`, `options?`)

Generate bitmark markup from a bitmark AST as a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `PathLike` | path of file to generate |
| `options?` | `BitmarkFileGeneratorOptions` | bitmark generation options |

#### Defined in

[generator/bitmark/BitmarkFileGenerator.ts:31](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkFileGenerator.ts#L31)

## Methods

### generate

▸ **generate**(`ast`): `Promise`<`void`\>

Generate bitmark markup from bitmark AST as a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Generator](../interfaces/Generator.md).[generate](../interfaces/Generator.md#generate)

#### Defined in

[generator/bitmark/BitmarkFileGenerator.ts:41](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkFileGenerator.ts#L41)

___

### generateSync

▸ **generateSync**(`_ast`): `string`

Generate bitmark markup from bitmark AST as a file synchronously

#### Parameters

| Name | Type |
| :------ | :------ |
| `_ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) |

#### Returns

`string`

#### Implementation of

[Generator](../interfaces/Generator.md).[generateSync](../interfaces/Generator.md#generateSync)

#### Defined in

[generator/bitmark/BitmarkFileGenerator.ts:50](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkFileGenerator.ts#L50)
