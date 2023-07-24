[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Generator

# Interface: Generator<T, R\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Node`](../modules.md#Node) |
| `R` | `void` |

## Implemented by

- [`BitmarkFileGenerator`](../classes/BitmarkFileGenerator.md)
- [`BitmarkGenerator`](../classes/BitmarkGenerator.md)
- [`BitmarkStringGenerator`](../classes/BitmarkStringGenerator.md)
- [`JsonFileGenerator`](../classes/JsonFileGenerator.md)
- [`JsonGenerator`](../classes/JsonGenerator.md)
- [`JsonStringGenerator`](../classes/JsonStringGenerator.md)

## Table of contents

### Properties

- [generate](Generator.md#generate)
- [generateSync](Generator.md#generateSync)

## Properties

### generate

• **generate**: (`ast`: `T`) => `Promise`<`R`\>

#### Type declaration

▸ (`ast`): `Promise`<`R`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ast` | `T` |

##### Returns

`Promise`<`R`\>

#### Defined in

[generator/Generator.ts:4](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/Generator.ts#L4)

___

### generateSync

• **generateSync**: (`ast`: `T`) => `R`

#### Type declaration

▸ (`ast`): `R`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ast` | `T` |

##### Returns

`R`

#### Defined in

[generator/Generator.ts:6](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/Generator.ts#L6)
