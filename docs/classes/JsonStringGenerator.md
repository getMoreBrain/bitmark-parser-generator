[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonStringGenerator

# Class: JsonStringGenerator

Generate bitmark JSON from a bitmark AST as a string

## Implements

- [`Generator`](../interfaces/Generator.md)<[`BitmarkAst`](../interfaces/BitmarkAst.md), `string`\>

## Table of contents

### Constructors

- [constructor](JsonStringGenerator.md#constructor)

### Methods

- [generate](JsonStringGenerator.md#generate)
- [generateSync](JsonStringGenerator.md#generateSync)

## Constructors

### constructor

• **new JsonStringGenerator**(`options?`)

Generate bitmark JSON from a bitmark AST as a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `JsonGeneratorOptions` | JSON generation options |

#### Defined in

[generator/json/JsonStringGenerator.ts:19](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonStringGenerator.ts#L19)

## Methods

### generate

▸ **generate**(`ast`): `Promise`<`string`\>

Generate bitmark JSON from bitmark AST as a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`Promise`<`string`\>

#### Implementation of

[Generator](../interfaces/Generator.md).[generate](../interfaces/Generator.md#generate)

#### Defined in

[generator/json/JsonStringGenerator.ts:29](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonStringGenerator.ts#L29)

___

### generateSync

▸ **generateSync**(`ast`): `string`

Generate bitmark JSON from bitmark AST as a string synchronously

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`string`

#### Implementation of

[Generator](../interfaces/Generator.md).[generateSync](../interfaces/Generator.md#generateSync)

#### Defined in

[generator/json/JsonStringGenerator.ts:39](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonStringGenerator.ts#L39)
