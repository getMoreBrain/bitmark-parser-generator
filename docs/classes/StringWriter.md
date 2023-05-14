[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / StringWriter

# Class: StringWriter

Writer to write to a string.

## Implements

- [`Writer`](../interfaces/Writer.md)

## Table of contents

### Constructors

- [constructor](StringWriter.md#constructor)

### Properties

- [endOfLineString](StringWriter.md#endOfLineString)

### Methods

- [getString](StringWriter.md#getString)
- [open](StringWriter.md#open)
- [close](StringWriter.md#close)
- [writeLine](StringWriter.md#writeLine)
- [writeLines](StringWriter.md#writeLines)
- [write](StringWriter.md#write)
- [writeWhiteSpace](StringWriter.md#writeWhiteSpace)

## Constructors

### constructor

• **new StringWriter**()

## Properties

### endOfLineString

• **endOfLineString**: `string` = `'\n'`

#### Defined in

[ast/writer/StringWriter.ts:9](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L9)

## Methods

### getString

▸ **getString**(): `string`

Get the string which has been written.

This cannot be called until after close() has resolved its Promise.

#### Returns

`string`

#### Defined in

[ast/writer/StringWriter.ts:18](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L18)

___

### open

▸ **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Implementation of

[Writer](../interfaces/Writer.md).[open](../interfaces/Writer.md#open)

#### Defined in

[ast/writer/StringWriter.ts:22](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L22)

___

### close

▸ **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Implementation of

[Writer](../interfaces/Writer.md).[close](../interfaces/Writer.md#close)

#### Defined in

[ast/writer/StringWriter.ts:28](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L28)

___

### writeLine

▸ **writeLine**(`value?`): [`StringWriter`](StringWriter.md)

Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | The line to write. When omitted, only the endOfLineString is written. |

#### Returns

[`StringWriter`](StringWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeLine](../interfaces/Writer.md#writeLine)

#### Defined in

[ast/writer/StringWriter.ts:37](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L37)

___

### writeLines

▸ **writeLines**(`values`, `delimiter?`): [`StringWriter`](StringWriter.md)

Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `string`[] | The lines to write. |
| `delimiter?` | `string` | An optional delimiter to be written at the end of each line, except for the last one. |

#### Returns

[`StringWriter`](StringWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeLines](../interfaces/Writer.md#writeLines)

#### Defined in

[ast/writer/StringWriter.ts:48](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L48)

___

### write

▸ **write**(`value`): [`StringWriter`](StringWriter.md)

Writes a string value to the output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be written. |

#### Returns

[`StringWriter`](StringWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[write](../interfaces/Writer.md#write)

#### Defined in

[ast/writer/StringWriter.ts:63](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L63)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`StringWriter`](StringWriter.md)

Writes a single whitespace character to the output.

#### Returns

[`StringWriter`](StringWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeWhiteSpace](../interfaces/Writer.md#writeWhiteSpace)

#### Defined in

[ast/writer/StringWriter.ts:70](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StringWriter.ts#L70)
