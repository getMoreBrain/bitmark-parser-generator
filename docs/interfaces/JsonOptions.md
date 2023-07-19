[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonOptions

# Interface: JsonOptions

JSON output options

## Table of contents

### Properties

- [prettify](JsonOptions.md#prettify)
- [stringify](JsonOptions.md#stringify)
- [includeExtraProperties](JsonOptions.md#includeExtraProperties)
- [debugGenerationInline](JsonOptions.md#debugGenerationInline)

## Properties

### prettify

• `Optional` **prettify**: `number` \| `boolean`

Prettify the JSON.

If not set or false, JSON will not be prettified.
If true, JSON will be prettified with an indent of 2.
If a positive integer, JSON will be prettified with an indent of this number.

If prettify is set, a string will be returned if possible.

#### Defined in

[generator/json/JsonGenerator.ts:110](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/json/JsonGenerator.ts#L110)

___

### stringify

• `Optional` **stringify**: `boolean`

Stringify the JSON.

If not set or false, JSON will be returned as a plain JS object.
It true, JSON will be stringified.

If prettify is set, it will override this setting.

#### Defined in

[generator/json/JsonGenerator.ts:120](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/json/JsonGenerator.ts#L120)

___

### includeExtraProperties

• `Optional` **includeExtraProperties**: `boolean`

Include extra properties in the output.

If not set or false, extra properties will NOT be included in the JSON output
It true, extra properties will be included in the JSON output.

#### Defined in

[generator/json/JsonGenerator.ts:129](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/json/JsonGenerator.ts#L129)

___

### debugGenerationInline

• `Optional` **debugGenerationInline**: `boolean`

[development only]
Generate debug information in the output.

#### Defined in

[generator/json/JsonGenerator.ts:135](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/generator/json/JsonGenerator.ts#L135)
