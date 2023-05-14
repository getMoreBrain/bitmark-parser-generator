[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonGenerator

# Class: JsonGenerator

Generate bitmark JSON from a bitmark AST

TODO: NOT IMPLEMENTED!

## Implements

- [`Generator`](../interfaces/Generator.md)<`void`\>
- [`AstWalkCallbacks`](../interfaces/AstWalkCallbacks.md)

## Table of contents

### Constructors

- [constructor](JsonGenerator.md#constructor)

### Methods

- [generate](JsonGenerator.md#generate)
- [enter](JsonGenerator.md#enter)
- [between](JsonGenerator.md#between)
- [exit](JsonGenerator.md#exit)
- [leaf](JsonGenerator.md#leaf)
- [write](JsonGenerator.md#write)
- [writeLine](JsonGenerator.md#writeLine)
- [writeLines](JsonGenerator.md#writeLines)
- [writeWhiteSpace](JsonGenerator.md#writeWhiteSpace)

## Constructors

### constructor

• **new JsonGenerator**(`writer`, `options?`)

Generate bitmark JSON from a bitmark AST

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `writer` | [`Writer`](../interfaces/Writer.md) | destination for the output |
| `options?` | [`JsonOptions`](../interfaces/JsonOptions.md) | bitmark generation options |

#### Defined in

[generator/json/JsonGenerator.ts:147](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L147)

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

[generator/json/JsonGenerator.ts:169](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L169)

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

[generator/json/JsonGenerator.ts:183](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L183)

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

[generator/json/JsonGenerator.ts:202](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L202)

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

[generator/json/JsonGenerator.ts:223](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L223)

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

[generator/json/JsonGenerator.ts:235](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L235)

___

### write

▸ **write**(`value`): [`JsonGenerator`](JsonGenerator.md)

Writes a string value to the output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be written. |

#### Returns

[`JsonGenerator`](JsonGenerator.md)

#### Defined in

[generator/json/JsonGenerator.ts:1853](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L1853)

___

### writeLine

▸ **writeLine**(`value?`): [`JsonGenerator`](JsonGenerator.md)

Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | The line to write. When omitted, only the endOfLineString is written. |

#### Returns

[`JsonGenerator`](JsonGenerator.md)

#### Defined in

[generator/json/JsonGenerator.ts:1862](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L1862)

___

### writeLines

▸ **writeLines**(`values`, `delimiter?`): [`JsonGenerator`](JsonGenerator.md)

Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `string`[] | The lines to write. |
| `delimiter?` | `string` | An optional delimiter to be written at the end of each line, except for the last one. |

#### Returns

[`JsonGenerator`](JsonGenerator.md)

#### Defined in

[generator/json/JsonGenerator.ts:1872](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L1872)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`JsonGenerator`](JsonGenerator.md)

Writes a single whitespace character to the output.

#### Returns

[`JsonGenerator`](JsonGenerator.md)

#### Defined in

[generator/json/JsonGenerator.ts:1880](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L1880)
