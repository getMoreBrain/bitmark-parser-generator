[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / Writer

# Interface: Writer

Simple writer to write text or code.

## Implemented by

- [`StreamWriter`](../classes/StreamWriter.md)
- [`StringWriter`](../classes/StringWriter.md)

## Table of contents

### Methods

- [open](Writer.md#open)
- [close](Writer.md#close)
- [write](Writer.md#write)
- [writeLine](Writer.md#writeLine)
- [writeLines](Writer.md#writeLines)
- [writeWhiteSpace](Writer.md#writeWhiteSpace)

## Methods

### open

▸ **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Defined in

[ast/writer/Writer.ts:10](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/writer/Writer.ts#L10)

___

### close

▸ **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Defined in

[ast/writer/Writer.ts:17](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/writer/Writer.ts#L17)

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

[ast/writer/Writer.ts:23](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/writer/Writer.ts#L23)

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

[ast/writer/Writer.ts:29](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/writer/Writer.ts#L29)

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

[ast/writer/Writer.ts:36](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/writer/Writer.ts#L36)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`Writer`](Writer.md)

Writes a single whitespace character to the output.

#### Returns

[`Writer`](Writer.md)

#### Defined in

[ast/writer/Writer.ts:41](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/writer/Writer.ts#L41)
