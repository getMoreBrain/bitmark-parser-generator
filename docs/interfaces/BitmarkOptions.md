[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / BitmarkOptions

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

[generator/bitmark/BitmarkGenerator.ts:42](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/bitmark/BitmarkGenerator.ts#L42)

___

### cardSetVersion

• `Optional` **cardSetVersion**: `number`

Card set version to generate

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:47](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/bitmark/BitmarkGenerator.ts#L47)

___

### debugGenerationInline

• `Optional` **debugGenerationInline**: `boolean`

[development only]
Generate debug information in the output.

#### Defined in

[generator/bitmark/BitmarkGenerator.ts:53](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/bitmark/BitmarkGenerator.ts#L53)
