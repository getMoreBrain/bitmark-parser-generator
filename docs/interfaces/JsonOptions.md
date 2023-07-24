[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / JsonOptions

# Interface: JsonOptions

JSON output options

## Table of contents

### Properties

- [enableWarnings](JsonOptions.md#enableWarnings)
- [prettify](JsonOptions.md#prettify)
- [stringify](JsonOptions.md#stringify)
- [textAsPlainText](JsonOptions.md#textAsPlainText)
- [excludeUnknownProperties](JsonOptions.md#excludeUnknownProperties)
- [debugGenerationInline](JsonOptions.md#debugGenerationInline)

## Properties

### enableWarnings

• `Optional` **enableWarnings**: `number` \| `boolean`

Enable parser warnings.

If not set or false, parser warnings will not be included in the output.
If true, any parser warnings will be included in the output.

#### Defined in

[generator/json/JsonGenerator.ts:119](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L119)

___

### prettify

• `Optional` **prettify**: `number` \| `boolean`

Prettify the JSON.

If not set or false, JSON will not be prettified.
If true, JSON will be prettified with an indent of 2.
If a positive integer, JSON will be prettified with an indent of this number.

If prettify is set, a string will be returned if possible.

#### Defined in

[generator/json/JsonGenerator.ts:130](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L130)

___

### stringify

• `Optional` **stringify**: `boolean`

Stringify the JSON.

If not set or false, JSON will be returned as a plain JS object.
It true, JSON will be stringified.

If prettify is set, it will override this setting.

#### Defined in

[generator/json/JsonGenerator.ts:140](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L140)

___

### textAsPlainText

• `Optional` **textAsPlainText**: `boolean`

Output text as plain text rather than parsed bitmark text

If not set, the default for the bitmark version will be used.
If false, text will be output as parsed bitmark text.
It true, text will be output as plain text strings.

#### Defined in

[generator/json/JsonGenerator.ts:149](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L149)

___

### excludeUnknownProperties

• `Optional` **excludeUnknownProperties**: `boolean`

Exclude unknown properties in the output.

If not set or false, unknown properties will be included in the JSON output.
It true, unknown properties will NOT be included in the JSON output.

#### Defined in

[generator/json/JsonGenerator.ts:158](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L158)

___

### debugGenerationInline

• `Optional` **debugGenerationInline**: `boolean`

[development only]
Generate debug information in the output.

#### Defined in

[generator/json/JsonGenerator.ts:164](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/generator/json/JsonGenerator.ts#L164)
