[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / BitmarkFileGenerator

# Class: BitmarkFileGenerator

Generate bitmark markup from a bitmark AST as a file

## Implements

- [`Generator`](../interfaces/Generator.md)<`void`\>

## Table of contents

### Constructors

- [constructor](BitmarkFileGenerator.md#constructor)

### Methods

- [generate](BitmarkFileGenerator.md#generate)

## Constructors

### constructor

• **new BitmarkFileGenerator**(`path`, `fileOptions?`, `bitmarkOptions?`)

Generate bitmark markup from a bitmark AST as a file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `PathLike` | path of file to generate |
| `fileOptions?` | [`FileOptions`](../interfaces/FileOptions.md) | file options |
| `bitmarkOptions?` | [`BitmarkOptions`](../interfaces/BitmarkOptions.md) | bitmark generation options |

#### Defined in

[generator/bitmark/BitmarkFileGenerator.ts:22](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/generator/bitmark/BitmarkFileGenerator.ts#L22)

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

Generator.generate

#### Defined in

[generator/bitmark/BitmarkFileGenerator.ts:32](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/generator/bitmark/BitmarkFileGenerator.ts#L32)
