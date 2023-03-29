[@bitmark-standard/bitmark-generator](../API.md) / [Modules](../modules.md) / JsonOptions

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

[generator/json/JsonGenerator.ts:39](https://github.com/getMoreBrain/bitmark-generator/blob/a7a40de/src/generator/json/JsonGenerator.ts#L39)

___

### debugGenerationInline

• `Optional` **debugGenerationInline**: `boolean`

[development only]
Generate debug information in the output.

#### Defined in

[generator/json/JsonGenerator.ts:45](https://github.com/getMoreBrain/bitmark-generator/blob/a7a40de/src/generator/json/JsonGenerator.ts#L45)
