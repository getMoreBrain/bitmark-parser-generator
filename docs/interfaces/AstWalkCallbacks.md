[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / AstWalkCallbacks

# Interface: AstWalkCallbacks<C\>

Callbacks for walking the AST

## Type parameters

| Name | Type |
| :------ | :------ |
| `C` | `undefined` |

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

• `Optional` **enter**: (`node`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[], `context`: `C`) => `boolean` \| `void`

#### Type declaration

▸ (`node`, `parent`, `route`, `context`): `boolean` \| `void`

Called when a branch node is entered

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](NodeInfo.md)[] | route to this node from the root |
| `context` | `C` | - |

##### Returns

`boolean` \| `void`

#### Defined in

[ast/Ast.ts:36](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Ast.ts#L36)

___

### between

• `Optional` **between**: (`node`: [`NodeInfo`](NodeInfo.md), `leftNode`: [`NodeInfo`](NodeInfo.md), `rightNode`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[], `context`: `C`) => `boolean` \| `void`

#### Type declaration

▸ (`node`, `leftNode`, `rightNode`, `parent`, `route`, `context`): `boolean` \| `void`

Called when between child nodes

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info (the parent of the children in leftNode / rightNode) |
| `leftNode` | [`NodeInfo`](NodeInfo.md) | the left (previous) child node info |
| `rightNode` | [`NodeInfo`](NodeInfo.md) | the right (next) child node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info (parent of node) |
| `route` | [`NodeInfo`](NodeInfo.md)[] |  |
| `context` | `C` | - |

##### Returns

`boolean` \| `void`

#### Defined in

[ast/Ast.ts:48](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Ast.ts#L48)

___

### exit

• `Optional` **exit**: (`node`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[], `context`: `C`) => `void`

#### Type declaration

▸ (`node`, `parent`, `route`, `context`): `void`

Called when a branch node is exited

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](NodeInfo.md)[] | route to this node from the root |
| `context` | `C` | - |

##### Returns

`void`

#### Defined in

[ast/Ast.ts:64](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Ast.ts#L64)

___

### leaf

• `Optional` **leaf**: (`node`: [`NodeInfo`](NodeInfo.md), `parent`: `undefined` \| [`NodeInfo`](NodeInfo.md), `route`: [`NodeInfo`](NodeInfo.md)[], `context`: `C`) => `void`

#### Type declaration

▸ (`node`, `parent`, `route`, `context`): `void`

Called when a leaf node is entered

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`NodeInfo`](NodeInfo.md) | this node info |
| `parent` | `undefined` \| [`NodeInfo`](NodeInfo.md) | parent node info |
| `route` | [`NodeInfo`](NodeInfo.md)[] | route to this node from the root |
| `context` | `C` | - |

##### Returns

`void`

#### Defined in

[ast/Ast.ts:73](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Ast.ts#L73)
