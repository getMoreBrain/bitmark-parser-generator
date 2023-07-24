[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Gap

# Interface: Gap

## Hierarchy

- [`BodyBit`](BodyBit.md)

  ↳ **`Gap`**

## Table of contents

### Properties

- [type](Gap.md#type)
- [data](Gap.md#data)

## Properties

### type

• **type**: ``"gap"``

#### Overrides

[BodyBit](BodyBit.md).[type](BodyBit.md#type)

#### Defined in

[model/ast/Nodes.ts:258](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L258)

___

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `solutions` | `string`[] |
| `itemLead?` | [`ItemLead`](ItemLead.md) |
| `hint?` | `string` |
| `instruction?` | `string` |
| `example?` | [`Example`](../modules.md#Example) |
| `isCaseSensitive?` | `boolean` |

#### Overrides

[BodyBit](BodyBit.md).[data](BodyBit.md#data)

#### Defined in

[model/ast/Nodes.ts:259](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L259)
