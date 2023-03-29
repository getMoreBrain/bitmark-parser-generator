[@bitmark-standard/bitmark-generator](../API.md) / [Modules](../modules.md) / AstClass

# Class: AstClass

An AST (Abstract Syntax Tree) implementation for the bitmark language

## Table of contents

### Constructors

- [constructor](AstClass.md#constructor)

### Methods

- [walk](AstClass.md#walk)
- [getRouteKey](AstClass.md#getRouteKey)
- [printTree](AstClass.md#printTree)

## Constructors

### constructor

• **new AstClass**()

## Methods

### walk

▸ **walk**(`ast`, `callbacks`): `void`

Walk an AST, decending each branch and calling callbacks when entering, leaving, and when in between child
nodes.

Walking the tree can be used to convert it to another format (e.g. bitmark markup or JSON) or for analysis.

The tree is navigated from root to leaf, decending each branch greedily.

e.g. for the tree:
A
|__B1
|  |__C1
|  |__C2
|__B2
   |__C3

Enter A1
Enter B1
Leaf  C1
Betwe B1 (C1, C2)
Leaf  C2
Exit  B1
Betwe A1 (B1, B2)
Enter B2
Leaf  C3
Exit  B2
Exit  A1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |
| `callbacks` | [`AstWalkCallbacks`](../interfaces/AstWalkCallbacks.md) | set of callbacks to call while walking the tree |

#### Returns

`void`

#### Defined in

[ast/Ast.ts:108](https://github.com/getMoreBrain/bitmark-generator/blob/2e4b4f5/src/ast/Ast.ts#L108)

___

### getRouteKey

▸ **getRouteKey**(`route`): `string`

Convert a route to a unique key that describes that route.

For the route A1 -> B4 -> C2 the route key would be A1_B4_C2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `route` | [`NodeInfo`](../interfaces/NodeInfo.md)[] | the tree path from the root to the curent node |

#### Returns

`string`

#### Defined in

[ast/Ast.ts:120](https://github.com/getMoreBrain/bitmark-generator/blob/2e4b4f5/src/ast/Ast.ts#L120)

___

### printTree

▸ **printTree**(`ast`): `void`

Print an AST to the console.
Useful for debug / development purposes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ast` | [`BitmarkAst`](../interfaces/BitmarkAst.md) | bitmark AST |

#### Returns

`void`

#### Defined in

[ast/Ast.ts:138](https://github.com/getMoreBrain/bitmark-generator/blob/2e4b4f5/src/ast/Ast.ts#L138)
