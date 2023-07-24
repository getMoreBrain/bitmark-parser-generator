[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Writer

# Interface: Writer

Simple writer to write text or code.

## Implemented by

- [`StreamWriter`](../classes/StreamWriter.md)
- [`StringWriter`](../classes/StringWriter.md)

## Table of contents

### Properties

- [isSync](Writer.md#isSync)

### Methods

- [open](Writer.md#open)
- [close](Writer.md#close)
- [openSync](Writer.md#openSync)
- [closeSync](Writer.md#closeSync)
- [write](Writer.md#write)
- [writeLine](Writer.md#writeLine)
- [writeLines](Writer.md#writeLines)
- [writeWhiteSpace](Writer.md#writeWhiteSpace)

## Properties

### isSync

• `Readonly` **isSync**: `boolean`

If true, the writer is synchronous.
If false, the writer is asynchronous.

When the writer is synchronous, the openSync() and closeSync() methods can be used, and
the output can be generated synchrounously.

#### Defined in

[ast/writer/Writer.ts:12](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L12)

## Methods

### open

▸ **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

This method can be used regardless of the value of isSync.

#### Returns

`Promise`<`void`\>

#### Defined in

[ast/writer/Writer.ts:21](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L21)

___

### close

▸ **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

This method can be used regardless of the value of isSync.

#### Returns

`Promise`<`void`\>

#### Defined in

[ast/writer/Writer.ts:30](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L30)

___

### openSync

▸ **openSync**(): `void`

Open the writer for writing.

Must be called before any calls to writeXXX();

This method is only available when isSync is true.

#### Returns

`void`

#### Defined in

[ast/writer/Writer.ts:39](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L39)

___

### closeSync

▸ **closeSync**(): `void`

Close the writer for writing.

Must be called after any calls to writeXXX();

This method is only available when isSync is true.

#### Returns

`void`

#### Defined in

[ast/writer/Writer.ts:48](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L48)

___

### write

▸ **write**(`value`): [`Writer`](Writer.md)

Writes a string value to the output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be written. |

#### Returns

[`Writer`](Writer.md)

#### Defined in

[ast/writer/Writer.ts:54](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L54)

___

### writeLine

▸ **writeLine**(`value?`): [`Writer`](Writer.md)

Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | The line to write. When omitted, only the endOfLineString is written. |

#### Returns

[`Writer`](Writer.md)

#### Defined in

[ast/writer/Writer.ts:60](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L60)

___

### writeLines

▸ **writeLines**(`values`, `delimiter?`): [`Writer`](Writer.md)

Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `string`[] | The lines to write. |
| `delimiter?` | `string` | An optional delimiter to be written at the end of each line, except for the last one. |

#### Returns

[`Writer`](Writer.md)

#### Defined in

[ast/writer/Writer.ts:67](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L67)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`Writer`](Writer.md)

Writes a single whitespace character to the output.

#### Returns

[`Writer`](Writer.md)

#### Defined in

[ast/writer/Writer.ts:72](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/Writer.ts#L72)
