[@bitmark-standard/bitmark-generator](../API.md) / [Modules](../modules.md) / BitmarkStringGenerator

# Class: BitmarkStringGenerator

Generate bitmark markup from a bitmark AST as a string

## Implements

- [`Generator`](../interfaces/Generator.md)<`string`\>

## Table of contents

### Constructors

- [constructor](BitmarkStringGenerator.md#constructor)

### Methods

- [generate](BitmarkStringGenerator.md#generate)

## Constructors

### constructor

• **new BitmarkStringGenerator**(`options?`)

Generate bitmark markup from a bitmark AST as a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`BitmarkOptions`](../interfaces/BitmarkOptions.md) | bitmark generation options |

#### Defined in

generator/bitmark/BitmarkStringGenerator.ts:19

## Methods

### generate

▸ **generate**(`ast`): `Promise`<`string`\>

Generate bitmark markup from bitmark AST as a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`Promise`<`string`\>

#### Implementation of

Generator.generate

#### Defined in

generator/bitmark/BitmarkStringGenerator.ts:29
