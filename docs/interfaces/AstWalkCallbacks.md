[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / AstWalkCallbacks

# Interface: AstWalkCallbacks

Callbacks for walking the AST

## Implemented by

- [`BitmarkGenerator`](../classes/BitmarkGenerator.md)
- [`JsonGenerator`](../classes/JsonGenerator.md)

## Table of contents

### Properties

- [enter](AstWalkCallbacks.md#enter)
- [between](AstWalkCallbacks.md#between)
- [exit](AstWalkCallbacks.md#exit)
- [leaf](AstWalkCallbacks.md#leaf)

## Properties

### enter

• `Optional` **enter**: (`node`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[]) => `boolean` \| `void`

#### Type declaration

▸ (`node`, `parent`, `route`): `boolean` \| `void`

Called when a branch node is entered

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](NodeInfo.md)[] | route to this node from the root |

##### Returns

`boolean` \| `void`

#### Defined in

[ast/Ast.ts:35](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/Ast.ts#L35)

___

### between

• `Optional` **between**: (`node`: [`NodeInfo`](NodeInfo.md), `leftNode`: [`NodeInfo`](NodeInfo.md), `rightNode`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[]) => `boolean` \| `void`

#### Type declaration

▸ (`node`, `leftNode`, `rightNode`, `parent`, `route`): `boolean` \| `void`

Called when between child nodes

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info (the parent of the children in leftNode / rightNode) |
| `leftNode` | [`NodeInfo`](NodeInfo.md) | the left (previous) child node info |
| `rightNode` | [`NodeInfo`](NodeInfo.md) | the right (next) child node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info (parent of node) |
| `route` | [`NodeInfo`](NodeInfo.md)[] |  |

##### Returns

`boolean` \| `void`

#### Defined in

[ast/Ast.ts:47](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/Ast.ts#L47)

___

### exit

• `Optional` **exit**: (`node`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[]) => `void`

#### Type declaration

▸ (`node`, `parent`, `route`): `void`

Called when a branch node is exited

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](NodeInfo.md)[] | route to this node from the root |

##### Returns

`void`

#### Defined in

[ast/Ast.ts:62](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/Ast.ts#L62)

___

### leaf

• `Optional` **leaf**: (`node`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[]) => `void`

#### Type declaration

▸ (`node`, `parent`, `route`): `void`

Called when a leaf node is entered

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](NodeInfo.md)[] | route to this node from the root |

##### Returns

`void`

#### Defined in

[ast/Ast.ts:71](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/Ast.ts#L71)
