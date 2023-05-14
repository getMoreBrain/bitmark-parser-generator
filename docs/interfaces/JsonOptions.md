[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonOptions

# Interface: JsonOptions

JSON output options

## Table of contents

### Properties

- [prettify](JsonOptions.md#prettify)
- [debugGenerationInline](JsonOptions.md#debugGenerationInline)

## Properties

### prettify

• `Optional` **prettify**: `number` \| `boolean`

Prettify the JSON.

If not set, JSON will not be prettified.
If true, JSON will be prettified with an indent of 2.
If a positive integer, JSON will be prettified with an indent of this number.

#### Defined in

[generator/json/JsonGenerator.ts:96](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L96)

___

### debugGenerationInline

• `Optional` **debugGenerationInline**: `boolean`

[development only]
Generate debug information in the output.

#### Defined in

[generator/json/JsonGenerator.ts:102](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/generator/json/JsonGenerator.ts#L102)
