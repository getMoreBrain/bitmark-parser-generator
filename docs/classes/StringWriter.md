[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / StringWriter

# Class: StringWriter

Writer to write to a string.

## Implements

- [`Writer`](../interfaces/Writer.md)

## Table of contents

### Constructors

- [constructor](StringWriter.md#constructor)

### Properties

- [endOfLineString](StringWriter.md#endOfLineString)

### Accessors

- [isSync](StringWriter.md#isSync)

### Methods

- [getString](StringWriter.md#getString)
- [open](StringWriter.md#open)
- [close](StringWriter.md#close)
- [openSync](StringWriter.md#openSync)
- [closeSync](StringWriter.md#closeSync)
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

[ast/writer/StringWriter.ts:9](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L9)

## Accessors

### isSync

• `get` **isSync**(): `boolean`

If true, the writer is synchronous.
If false, the writer is asynchronous.

When the writer is synchronous, the openSync() and closeSync() methods can be used, and
the output can be generated synchrounously.

#### Returns

`boolean`

#### Implementation of

[Writer](../interfaces/Writer.md).[isSync](../interfaces/Writer.md#isSync)

#### Defined in

[ast/writer/StringWriter.ts:11](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L11)

## Methods

### getString

▸ **getString**(): `string`

Get the string which has been written.

This cannot be called until after close() has resolved its Promise.

#### Returns

`string`

#### Defined in

[ast/writer/StringWriter.ts:22](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L22)

___

### open

▸ **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

This method can be used regardless of the value of isSync.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Writer](../interfaces/Writer.md).[open](../interfaces/Writer.md#open)

#### Defined in

[ast/writer/StringWriter.ts:26](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L26)

___

### close

▸ **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

This method can be used regardless of the value of isSync.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Writer](../interfaces/Writer.md).[close](../interfaces/Writer.md#close)

#### Defined in

[ast/writer/StringWriter.ts:31](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L31)

___

### openSync

▸ **openSync**(): `void`

Open the writer for writing.

Must be called before any calls to writeXXX();

This method is only available when isSync is true.

#### Returns

`void`

#### Implementation of

[Writer](../interfaces/Writer.md).[openSync](../interfaces/Writer.md#openSync)

#### Defined in

[ast/writer/StringWriter.ts:40](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L40)

___

### closeSync

▸ **closeSync**(): `void`

Close the writer for writing.

Must be called after any calls to writeXXX();

This method is only available when isSync is true.

#### Returns

`void`

#### Implementation of

[Writer](../interfaces/Writer.md).[closeSync](../interfaces/Writer.md#closeSync)

#### Defined in

[ast/writer/StringWriter.ts:45](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L45)

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

[ast/writer/StringWriter.ts:53](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L53)

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

[ast/writer/StringWriter.ts:64](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L64)

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

[ast/writer/StringWriter.ts:79](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L79)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`StringWriter`](StringWriter.md)

Writes a single whitespace character to the output.

#### Returns

[`StringWriter`](StringWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeWhiteSpace](../interfaces/Writer.md#writeWhiteSpace)

#### Defined in

[ast/writer/StringWriter.ts:86](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StringWriter.ts#L86)
