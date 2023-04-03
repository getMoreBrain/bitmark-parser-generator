[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / BitmarkGenerator

# Class: BitmarkGenerator

Generate bitmark markup from a bitmark AST

## Implements

- [`Generator`](../interfaces/Generator.md)<`void`\>
- [`AstWalkCallbacks`](../interfaces/AstWalkCallbacks.md)

## Table of contents

### Constructors

- [constructor](BitmarkGenerator.md#constructor)

### Methods

- [generate](BitmarkGenerator.md#generate)
- [enter](BitmarkGenerator.md#enter)
- [between](BitmarkGenerator.md#between)
- [exit](BitmarkGenerator.md#exit)
- [leaf](BitmarkGenerator.md#leaf)
- [write](BitmarkGenerator.md#write)
- [writeLine](BitmarkGenerator.md#writeLine)
- [writeLines](BitmarkGenerator.md#writeLines)
- [writeWhiteSpace](BitmarkGenerator.md#writeWhiteSpace)

## Constructors

### constructor

• **new BitmarkGenerator**(`writer`, `options?`)

Generate bitmark markup from a bitmark AST

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writer` | [`Writer`](../interfaces/Writer.md) | destination for the output |
| `options?` | [`BitmarkOptions`](../interfaces/BitmarkOptions.md) | bitmark generation options |

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:60](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L60)

## Methods

### generate

▸ **generate**(`ast`): `Promise`<`void`\>

Generate bitmark markup from bitmark AST

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`Promise`<`void`\>

#### Implementation of

Generator.generate

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:79](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L79)

___

### enter

▸ **enter**(`node`, `parent`, `route`): `boolean` \| `void`

Called when a branch node is entered

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](../interfaces/NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](../interfaces/NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](../interfaces/NodeInfo.md)[] | route to this node from the root |

#### Returns

`boolean` \| `void`

#### Implementation of

AstWalkCallbacks.enter

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:93](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L93)

___

### between

▸ **between**(`node`, `left`, `right`, `parent`, `route`): `boolean` \| `void`

Called when between child nodes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](../interfaces/NodeInfo.md) | this node info (the parent of the children in leftNode / rightNode) |
| `left` | [`NodeInfo`](../interfaces/NodeInfo.md) | the left (previous) child node info |
| `right` | [`NodeInfo`](../interfaces/NodeInfo.md) | the right (next) child node info |
| `parent` | `undefined` \| [`NodeInfo`](../interfaces/NodeInfo.md) | parent node info (parent of node) |
| `route` | [`NodeInfo`](../interfaces/NodeInfo.md)[] |  |

#### Returns

`boolean` \| `void`

#### Implementation of

AstWalkCallbacks.between

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:112](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L112)

___

### exit

▸ **exit**(`node`, `parent`, `route`): `void`

Called when a branch node is exited

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](../interfaces/NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](../interfaces/NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](../interfaces/NodeInfo.md)[] | route to this node from the root |

#### Returns

`void`

#### Implementation of

AstWalkCallbacks.exit

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:133](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L133)

___

### leaf

▸ **leaf**(`node`, `parent`, `route`): `void`

Called when a leaf node is entered

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](../interfaces/NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](../interfaces/NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](../interfaces/NodeInfo.md)[] | route to this node from the root |

#### Returns

`void`

#### Implementation of

AstWalkCallbacks.leaf

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:145](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L145)

___

### write

▸ **write**(`value`): [`BitmarkGenerator`](BitmarkGenerator.md)

Writes a string value to the output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be written. |

#### Returns

[`BitmarkGenerator`](BitmarkGenerator.md)

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:1450](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L1450)

___

### writeLine

▸ **writeLine**(`value?`): [`BitmarkGenerator`](BitmarkGenerator.md)

Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | The line to write. When omitted, only the endOfLineString is written. |

#### Returns

[`BitmarkGenerator`](BitmarkGenerator.md)

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:1459](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L1459)

___

### writeLines

▸ **writeLines**(`values`, `delimiter?`): [`BitmarkGenerator`](BitmarkGenerator.md)

Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `string`[] | The lines to write. |
| `delimiter?` | `string` | An optional delimiter to be written at the end of each line, except for the last one. |

#### Returns

[`BitmarkGenerator`](BitmarkGenerator.md)

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:1469](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L1469)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`BitmarkGenerator`](BitmarkGenerator.md)

Writes a single whitespace character to the output.

#### Returns

[`BitmarkGenerator`](BitmarkGenerator.md)

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:1477](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/generator/bitmark/BitmarkGenerator.ts#L1477)