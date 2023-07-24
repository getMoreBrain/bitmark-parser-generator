[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Select

# Interface: Select

## Hierarchy

- [`BodyBit`](BodyBit.md)

  ↳ **`Select`**

## Table of contents

### Properties

- [type](Select.md#type)
- [data](Select.md#data)

## Properties

### type

• **type**: ``"select"``

#### Overrides

[BodyBit](BodyBit.md).[type](BodyBit.md#type)

#### Defined in

[model/ast/Nodes.ts:272](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L272)

___

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prefix?` | `string` |
| `options` | [`SelectOption`](SelectOption.md)[] |
| `postfix?` | `string` |
| `itemLead?` | [`ItemLead`](ItemLead.md) |
| `hint?` | `string` |
| `instruction?` | `string` |
| `example?` | [`Example`](../modules.md#Example) |
| `isCaseSensitive?` | `boolean` |

#### Overrides

[BodyBit](BodyBit.md).[data](BodyBit.md#data)

#### Defined in

[model/ast/Nodes.ts:273](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L273)
