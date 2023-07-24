[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkOptions

# Interface: BitmarkOptions

Bitmark generation options

## Table of contents

### Properties

- [explicitTextFormat](BitmarkOptions.md#explicitTextFormat)
- [cardSetVersion](BitmarkOptions.md#cardSetVersion)
- [debugGenerationInline](BitmarkOptions.md#debugGenerationInline)

## Properties

### explicitTextFormat

• `Optional` **explicitTextFormat**: `boolean`

If true, always include bitmark text format even if it is 'bitmark--'
If false, only include bitmark text format if it is not 'bitmark--'

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:43](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkGenerator.ts#L43)

___

### cardSetVersion

• `Optional` **cardSetVersion**: [`CardSetVersionType`](../modules.md#CardSetVersionType)

Card set version to generate:
1: === / == / --
2: ++==== / ==== / -- / ~~ / ====++

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:50](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkGenerator.ts#L50)

___

### debugGenerationInline

• `Optional` **debugGenerationInline**: `boolean`

[development only]
Generate debug information in the output.

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:56](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/bitmark/BitmarkGenerator.ts#L56)
