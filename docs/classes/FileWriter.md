[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / FileWriter

# Class: FileWriter

Writer to write to a file.

## Hierarchy

- [`StreamWriter`](StreamWriter.md)

  ↳ **`FileWriter`**

## Table of contents

### Constructors

- [constructor](FileWriter.md#constructor)

### Accessors

- [path](FileWriter.md#path)
- [append](FileWriter.md#append)
- [encoding](FileWriter.md#encoding)
- [stream](FileWriter.md#stream)

### Methods

- [open](FileWriter.md#open)
- [close](FileWriter.md#close)
- [writeLine](FileWriter.md#writeLine)
- [writeLines](FileWriter.md#writeLines)
- [write](FileWriter.md#write)
- [writeWhiteSpace](FileWriter.md#writeWhiteSpace)

### Properties

- [endOfLineString](FileWriter.md#endOfLineString)

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

[ast/writer/FileWriter.ts:34](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/FileWriter.ts#L34)

## Accessors

### path

• `get` **path**(): `PathLike`

#### Returns

`PathLike`

#### Defined in

[ast/writer/FileWriter.ts:43](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/FileWriter.ts#L43)

___

### append

• `get` **append**(): `boolean`

#### Returns

`boolean`

#### Defined in

[ast/writer/FileWriter.ts:47](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/FileWriter.ts#L47)

___

### encoding

• `get` **encoding**(): `BufferEncoding`

#### Returns

`BufferEncoding`

#### Defined in

[ast/writer/FileWriter.ts:51](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/FileWriter.ts#L51)

___

### stream

• `get` **stream**(): `undefined` \| `WritableStream`

Get the current write stream

#### Returns

`undefined` \| `WritableStream`

#### Inherited from

StreamWriter.stream

#### Defined in

[ast/writer/StreamWriter.ts:15](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L15)

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

[ast/writer/StreamWriter.ts:22](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L22)

## Methods

### open

▸ **open**(): `Promise`<`void`\>

Open the writer for writing.

Must be called before any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Overrides

[StreamWriter](StreamWriter.md).[open](StreamWriter.md#open)

#### Defined in

[ast/writer/FileWriter.ts:55](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/FileWriter.ts#L55)

___

### close

▸ **close**(): `Promise`<`void`\>

Close the writer for writing.

Must be called after any calls to writeXXX();

#### Returns

`Promise`<`void`\>

#### Overrides

[StreamWriter](StreamWriter.md).[close](StreamWriter.md#close)

#### Defined in

[ast/writer/FileWriter.ts:80](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/FileWriter.ts#L80)

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

[ast/writer/StreamWriter.ts:30](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L30)

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

[ast/writer/StreamWriter.ts:41](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L41)

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

[ast/writer/StreamWriter.ts:56](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L56)

___

### writeWhiteSpace

▸ **writeWhiteSpace**(): [`FileWriter`](FileWriter.md)

Writes a single whitespace character to the output.

#### Returns

[`FileWriter`](FileWriter.md)

#### Inherited from

[StreamWriter](StreamWriter.md).[writeWhiteSpace](StreamWriter.md#writeWhiteSpace)

#### Defined in

[ast/writer/StreamWriter.ts:63](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L63)

## Properties

### endOfLineString

• **endOfLineString**: `string` = `os.EOL`

#### Inherited from

[StreamWriter](StreamWriter.md).[endOfLineString](StreamWriter.md#endOfLineString)

#### Defined in

[ast/writer/StreamWriter.ts:10](https://github.com/getMoreBrain/bitmark-generator/blob/ccb191f/src/ast/writer/StreamWriter.ts#L10)
