[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkStringGenerator

# Class: BitmarkStringGenerator

Generate bitmark markup from a bitmark AST as a string

## Implements

- [`Generator`](../interfaces/Generator.md)<[`BitmarkAst`](../interfaces/BitmarkAst.md), `string`\>

## Table of contents

### Constructors

- [constructor](BitmarkStringGenerator.md#constructor)

### Methods

- [generate](BitmarkStringGenerator.md#generate)
- [generateSync](BitmarkStringGenerator.md#generateSync)

## Constructors

### constructor

• **new BitmarkStringGenerator**(`options?`)

Generate bitmark markup from a bitmark AST as a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `BitmarkGeneratorOptions` | bitmark generation options |

#### Defined in

[generator/bitmark/BitmarkStringGenerator.ts:20](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkStringGenerator.ts#L20)

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

[Generator](../interfaces/Generator.md).[generate](../interfaces/Generator.md#generate)

#### Defined in

[generator/bitmark/BitmarkStringGenerator.ts:30](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkStringGenerator.ts#L30)

___

### generateSync

▸ **generateSync**(`ast`): `string`

Generate bitmark markup from bitmark AST as a string synchronously

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`string`

#### Implementation of

[Generator](../interfaces/Generator.md).[generateSync](../interfaces/Generator.md#generateSync)

#### Defined in

[generator/bitmark/BitmarkStringGenerator.ts:40](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkStringGenerator.ts#L40)
