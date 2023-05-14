[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / StreamWriter

# Class: StreamWriter

Writer to write to a stream.

## Hierarchy

- **`StreamWriter`**

  ↳ [`FileWriter`](FileWriter.md)

## Implements

- [`Writer`](../interfaces/Writer.md)

## Table of contents

### Constructors

- [constructor](StreamWriter.md#constructor)

### Properties

- [endOfLineString](StreamWriter.md#endOfLineString)

### Accessors

- [stream](StreamWriter.md#stream)

### Methods

- [open](StreamWriter.md#open)
- [close](StreamWriter.md#close)
- [writeLine](StreamWriter.md#writeLine)
- [writeLines](StreamWriter.md#writeLines)
- [write](StreamWriter.md#write)
- [writeWhiteSpace](StreamWriter.md#writeWhiteSpace)

## Constructors

### constructor

• **new StreamWriter**()

## Properties

### endOfLineString

• **endOfLineString**: `string` = `os.EOL`

#### Defined in

[ast/writer/StreamWriter.ts:10](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L10)

## Accessors

### stream

• `get` **stream**(): `undefined` \| `WritableStream`

Get the current write stream

#### Returns

`undefined` \| `WritableStream`

#### Defined in

[ast/writer/StreamWriter.ts:15](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L15)

• `set` **stream**(`stream`): `void`

Set the current write stream

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `undefined` \| `WritableStream` |

#### Returns

`void`

#### Defined in

[ast/writer/StreamWriter.ts:22](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L22)

## Methods

### open

▸ `Abstract` **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Implementation of

[Writer](../interfaces/Writer.md).[open](../interfaces/Writer.md#open)

#### Defined in

[ast/writer/StreamWriter.ts:26](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L26)

___

### close

▸ `Abstract` **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Implementation of

[Writer](../interfaces/Writer.md).[close](../interfaces/Writer.md#close)

#### Defined in

[ast/writer/StreamWriter.ts:28](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L28)

___

### writeLine

▸ **writeLine**(`value?`): [`StreamWriter`](StreamWriter.md)

Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | The line to write. When omitted, only the endOfLineString is written. |

#### Returns

[`StreamWriter`](StreamWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeLine](../interfaces/Writer.md#writeLine)

#### Defined in

[ast/writer/StreamWriter.ts:30](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L30)

___

### writeLines

▸ **writeLines**(`values`, `delimiter?`): [`StreamWriter`](StreamWriter.md)

Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `string`[] | The lines to write. |
| `delimiter?` | `string` | An optional delimiter to be written at the end of each line, except for the last one. |

#### Returns

[`StreamWriter`](StreamWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeLines](../interfaces/Writer.md#writeLines)

#### Defined in

[ast/writer/StreamWriter.ts:41](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L41)

___

### write

▸ **write**(`value`): [`StreamWriter`](StreamWriter.md)

Writes a string value to the output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be written. |

#### Returns

[`StreamWriter`](StreamWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[write](../interfaces/Writer.md#write)

#### Defined in

[ast/writer/StreamWriter.ts:56](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L56)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`StreamWriter`](StreamWriter.md)

Writes a single whitespace character to the output.

#### Returns

[`StreamWriter`](StreamWriter.md)

#### Implementation of

[Writer](../interfaces/Writer.md).[writeWhiteSpace](../interfaces/Writer.md#writeWhiteSpace)

#### Defined in

[ast/writer/StreamWriter.ts:63](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/writer/StreamWriter.ts#L63)
