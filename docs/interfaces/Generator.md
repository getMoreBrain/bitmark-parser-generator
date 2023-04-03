[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / Generator

# Interface: Generator<T\>

## Type parameters

| Name |
| :------ |
| `T` |

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

## Properties

### generate

• **generate**: (`ast`: [`BitmarkAst`](BitmarkAst.md)) => `Promise`<`T`\>

#### Type declaration

▸ (`ast`): `Promise`<`T`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ast` | [`BitmarkAst`](BitmarkAst.md) |

##### Returns

`Promise`<`T`\>

#### Defined in

[generator/Generator.ts:4](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/generator/Generator.ts#L4)
