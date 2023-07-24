[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / FileWriter

# Class: FileWriter

Writer to write to a file.

## Hierarchy

- [`StreamWriter`](StreamWriter.md)

  ↳ **`FileWriter`**

## Table of contents

### Constructors

- [constructor](FileWriter.md#constructor)

### Properties

- [endOfLineString](FileWriter.md#endOfLineString)

### Accessors

- [path](FileWriter.md#path)
- [append](FileWriter.md#append)
- [encoding](FileWriter.md#encoding)
- [isSync](FileWriter.md#isSync)
- [stream](FileWriter.md#stream)

### Methods

- [open](FileWriter.md#open)
- [close](FileWriter.md#close)
- [openSync](FileWriter.md#openSync)
- [closeSync](FileWriter.md#closeSync)
- [writeLine](FileWriter.md#writeLine)
- [writeLines](FileWriter.md#writeLines)
- [write](FileWriter.md#write)
- [writeWhiteSpace](FileWriter.md#writeWhiteSpace)

## Constructors

### constructor

• **new FileWriter**(`path`, `options?`)

Create a writer to write to a file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `PathLike` | path of file to write |
| `options?` | [`FileOptions`](../interfaces/FileOptions.md) | options for file writing |

#### Overrides

[StreamWriter](StreamWriter.md).[constructor](StreamWriter.md#constructor)

#### Defined in

[ast/writer/FileWriter.ts:34](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/FileWriter.ts#L34)

## Properties

### endOfLineString

• **endOfLineString**: `string` = `os.EOL`

#### Inherited from

[StreamWriter](StreamWriter.md).[endOfLineString](StreamWriter.md#endOfLineString)

#### Defined in

[ast/writer/StreamWriter.ts:10](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L10)

## Accessors

### path

• `get` **path**(): `PathLike`

#### Returns

`PathLike`

#### Defined in

[ast/writer/FileWriter.ts:43](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/FileWriter.ts#L43)

___

### append

• `get` **append**(): `boolean`

#### Returns

`boolean`

#### Defined in

[ast/writer/FileWriter.ts:47](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/FileWriter.ts#L47)

___

### encoding

• `get` **encoding**(): `BufferEncoding`

#### Returns

`BufferEncoding`

#### Defined in

[ast/writer/FileWriter.ts:51](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/FileWriter.ts#L51)

___

### isSync

• `get` **isSync**(): `boolean`

If true, the writer is synchronous.
If false, the writer is asynchronous.

When the writer is synchronous, the openSync() and closeSync() methods can be used, and
the output can be generated synchrounously.

#### Returns

`boolean`

#### Inherited from

StreamWriter.isSync

#### Defined in

[ast/writer/StreamWriter.ts:12](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L12)

___

### stream

• `get` **stream**(): `undefined` \| `WritableStream`

Get the current write stream

#### Returns

`undefined` \| `WritableStream`

#### Inherited from

StreamWriter.stream

#### Defined in

[ast/writer/StreamWriter.ts:19](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L19)

• `set` **stream**(`stream`): `void`

Set the current write stream

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `undefined` \| `WritableStream` |

#### Returns

`void`

#### Inherited from

StreamWriter.stream

#### Defined in

[ast/writer/StreamWriter.ts:26](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L26)

## Methods

### open

▸ **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

This method can be used regardless of the value of isSync.

#### Returns

`Promise`<`void`\>

#### Overrides

[StreamWriter](StreamWriter.md).[open](StreamWriter.md#open)

#### Defined in

[ast/writer/FileWriter.ts:55](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/FileWriter.ts#L55)

___

### close

▸ **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

This method can be used regardless of the value of isSync.

#### Returns

`Promise`<`void`\>

#### Overrides

[StreamWriter](StreamWriter.md).[close](StreamWriter.md#close)

#### Defined in

[ast/writer/FileWriter.ts:80](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/FileWriter.ts#L80)

___

### openSync

▸ **openSync**(): `void`

Open the writer for writing.

Must be called before any calls to writeXXX();

This method is only available when isSync is true.

#### Returns

`void`

#### Inherited from

[StreamWriter](StreamWriter.md).[openSync](StreamWriter.md#openSync)

#### Defined in

[ast/writer/StreamWriter.ts:34](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L34)

___

### closeSync

▸ **closeSync**(): `void`

Close the writer for writing.

Must be called after any calls to writeXXX();

This method is only available when isSync is true.

#### Returns

`void`

#### Inherited from

[StreamWriter](StreamWriter.md).[closeSync](StreamWriter.md#closeSync)

#### Defined in

[ast/writer/StreamWriter.ts:38](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L38)

___

### writeLine

▸ **writeLine**(`value?`): [`FileWriter`](FileWriter.md)

Writes a new line to the output. The line is indented automatically. The line is ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | The line to write. When omitted, only the endOfLineString is written. |

#### Returns

[`FileWriter`](FileWriter.md)

#### Inherited from

[StreamWriter](StreamWriter.md).[writeLine](StreamWriter.md#writeLine)

#### Defined in

[ast/writer/StreamWriter.ts:42](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L42)

___

### writeLines

▸ **writeLines**(`values`, `delimiter?`): [`FileWriter`](FileWriter.md)

Writes a collection of lines to the output. Each line is indented automatically and ended with the endOfLineString.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `string`[] | The lines to write. |
| `delimiter?` | `string` | An optional delimiter to be written at the end of each line, except for the last one. |

#### Returns

[`FileWriter`](FileWriter.md)

#### Inherited from

[StreamWriter](StreamWriter.md).[writeLines](StreamWriter.md#writeLines)

#### Defined in

[ast/writer/StreamWriter.ts:53](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L53)

___

### write

▸ **write**(`value`): [`FileWriter`](FileWriter.md)

Writes a string value to the output.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be written. |

#### Returns

[`FileWriter`](FileWriter.md)

#### Inherited from

[StreamWriter](StreamWriter.md).[write](StreamWriter.md#write)

#### Defined in

[ast/writer/StreamWriter.ts:68](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L68)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`FileWriter`](FileWriter.md)

Writes a single whitespace character to the output.

#### Returns

[`FileWriter`](FileWriter.md)

#### Inherited from

[StreamWriter](StreamWriter.md).[writeWhiteSpace](StreamWriter.md#writeWhiteSpace)

#### Defined in

[ast/writer/StreamWriter.ts:75](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/writer/StreamWriter.ts#L75)
