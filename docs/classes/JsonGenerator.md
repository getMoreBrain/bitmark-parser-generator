[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonGenerator

# Class: JsonGenerator

Generate bitmark JSON from a bitmark AST

TODO: NOT IMPLEMENTED!

## Implements

- [`Generator`](../interfaces/Generator.md)<[`BitmarkAst`](../interfaces/BitmarkAst.md)\>
- [`AstWalkCallbacks`](../interfaces/AstWalkCallbacks.md)

## Table of contents

### Constructors

- [constructor](JsonGenerator.md#constructor)

### Methods

- [generate](JsonGenerator.md#generate)
- [generateSync](JsonGenerator.md#generateSync)
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
| `options?` | `JsonGeneratorOptions` | JSON generation options |

#### Defined in

[generator/json/JsonGenerator.ts:238](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L238)

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

[Generator](../interfaces/Generator.md).[generate](../interfaces/Generator.md#generate)

#### Defined in

[generator/json/JsonGenerator.ts:273](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L273)

___

### generateSync

▸ **generateSync**(`ast`): `void`

Generate text from a bitmark text AST synchronously

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark text AST |

#### Returns

`void`

#### Implementation of

[Generator](../interfaces/Generator.md).[generateSync](../interfaces/Generator.md#generateSync)

#### Defined in

[generator/json/JsonGenerator.ts:295](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L295)

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

[AstWalkCallbacks](../interfaces/AstWalkCallbacks.md).[enter](../interfaces/AstWalkCallbacks.md#enter)

#### Defined in

[generator/json/JsonGenerator.ts:324](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L324)

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

[AstWalkCallbacks](../interfaces/AstWalkCallbacks.md).[between](../interfaces/AstWalkCallbacks.md#between)

#### Defined in

[generator/json/JsonGenerator.ts:343](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L343)

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

[AstWalkCallbacks](../interfaces/AstWalkCallbacks.md).[exit](../interfaces/AstWalkCallbacks.md#exit)

#### Defined in

[generator/json/JsonGenerator.ts:364](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L364)

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

[AstWalkCallbacks](../interfaces/AstWalkCallbacks.md).[leaf](../interfaces/AstWalkCallbacks.md#leaf)

#### Defined in

[generator/json/JsonGenerator.ts:376](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L376)

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

[generator/json/JsonGenerator.ts:2365](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L2365)

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

[generator/json/JsonGenerator.ts:2374](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L2374)

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

[generator/json/JsonGenerator.ts:2384](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L2384)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`JsonGenerator`](JsonGenerator.md)

Writes a single whitespace character to the output.

#### Returns

[`JsonGenerator`](JsonGenerator.md)

#### Defined in

[generator/json/JsonGenerator.ts:2392](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L2392)
