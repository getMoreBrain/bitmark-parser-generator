[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Highlight

# Interface: Highlight

## Hierarchy

- [`BodyBit`](BodyBit.md)

  ↳ **`Highlight`**

## Table of contents

### Properties

- [type](Highlight.md#type)
- [data](Highlight.md#data)

## Properties

### type

• **type**: ``"highlight"``

#### Overrides

[BodyBit](BodyBit.md).[type](BodyBit.md#type)

#### Defined in

[model/ast/Nodes.ts:298](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L298)

___

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `prefix?` | `string` |
| `texts` | [`HighlightText`](HighlightText.md)[] |
| `postfix?` | `string` |
| `itemLead?` | [`ItemLead`](ItemLead.md) |
| `hint?` | `string` |
| `instruction?` | `string` |
| `example?` | [`Example`](../modules.md#Example) |
| `isCaseSensitive?` | `boolean` |

#### Overrides

[BodyBit](BodyBit.md).[data](BodyBit.md#data)

#### Defined in

[model/ast/Nodes.ts:299](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L299)
