[@bitmark-standard/bitmark-generator](../API.md) / [Modules](../modules.md) / JsonStringGenerator

# Class: JsonStringGenerator

Generate bitmark JSON from a bitmark AST as a string

TODO: NOT IMPLEMENTED!

## Implements

- [`Generator`](../interfaces/Generator.md)<`string`\>

## Table of contents

### Constructors

- [constructor](JsonStringGenerator.md#constructor)

### Methods

- [generate](JsonStringGenerator.md#generate)

## Constructors

### constructor

• **new JsonStringGenerator**(`generatorOptions?`)

Generate bitmark JSON from a bitmark AST as a string

#### Parameters

| Name | Type |
| :------ | :------ |
| `generatorOptions?` | [`JsonOptions`](../interfaces/JsonOptions.md) |

#### Defined in

generator/json/JsonStringGenerator.ts:21

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

Generator.generate

#### Defined in

generator/json/JsonStringGenerator.ts:31
