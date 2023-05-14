[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / VideoResource

# Interface: VideoResource

## Hierarchy

- [`Resource`](Resource.md)

- `VideoLikeResource`

  ↳ **`VideoResource`**

## Table of contents

### Properties

- [format](VideoResource.md#format)
- [value](VideoResource.md#value)
- [license](VideoResource.md#license)
- [copyright](VideoResource.md#copyright)
- [provider](VideoResource.md#provider)
- [showInIndex](VideoResource.md#showInIndex)
- [caption](VideoResource.md#caption)
- [width](VideoResource.md#width)
- [height](VideoResource.md#height)
- [duration](VideoResource.md#duration)
- [mute](VideoResource.md#mute)
- [autoplay](VideoResource.md#autoplay)
- [allowSubtitles](VideoResource.md#allowSubtitles)
- [showSubtitles](VideoResource.md#showSubtitles)
- [alt](VideoResource.md#alt)
- [posterImage](VideoResource.md#posterImage)
- [thumbnails](VideoResource.md#thumbnails)
- [type](VideoResource.md#type)

## Properties

### format

• `Optional` **format**: `string`

#### Inherited from

[Resource](Resource.md).[format](Resource.md#format)

#### Defined in

[model/ast/Nodes.ts:214](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L214)

___

### value

• `Optional` **value**: `string`

#### Inherited from

[Resource](Resource.md).[value](Resource.md#value)

#### Defined in

[model/ast/Nodes.ts:215](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L215)

___

### license

• `Optional` **license**: `string`

#### Inherited from

[Resource](Resource.md).[license](Resource.md#license)

#### Defined in

[model/ast/Nodes.ts:216](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L216)

___

### copyright

• `Optional` **copyright**: `string`

#### Inherited from

[Resource](Resource.md).[copyright](Resource.md#copyright)

#### Defined in

[model/ast/Nodes.ts:217](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L217)

___

### provider

• `Optional` **provider**: `string`

#### Inherited from

[Resource](Resource.md).[provider](Resource.md#provider)

#### Defined in

[model/ast/Nodes.ts:218](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L218)

___

### showInIndex

• `Optional` **showInIndex**: `boolean`

#### Inherited from

[Resource](Resource.md).[showInIndex](Resource.md#showInIndex)

#### Defined in

[model/ast/Nodes.ts:219](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L219)

___

### caption

• `Optional` **caption**: `string`

#### Inherited from

[Resource](Resource.md).[caption](Resource.md#caption)

#### Defined in

[model/ast/Nodes.ts:220](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L220)

___

### width

• `Optional` **width**: `number`

#### Inherited from

VideoLikeResource.width

#### Defined in

[model/ast/Nodes.ts:240](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L240)

___

### height

• `Optional` **height**: `number`

#### Inherited from

VideoLikeResource.height

#### Defined in

[model/ast/Nodes.ts:241](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L241)

___

### duration

• `Optional` **duration**: `number`

#### Inherited from

VideoLikeResource.duration

#### Defined in

[model/ast/Nodes.ts:242](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L242)

___

### mute

• `Optional` **mute**: `boolean`

#### Inherited from

VideoLikeResource.mute

#### Defined in

[model/ast/Nodes.ts:243](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L243)

___

### autoplay

• `Optional` **autoplay**: `boolean`

#### Inherited from

VideoLikeResource.autoplay

#### Defined in

[model/ast/Nodes.ts:244](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L244)

___

### allowSubtitles

• `Optional` **allowSubtitles**: `boolean`

#### Inherited from

VideoLikeResource.allowSubtitles

#### Defined in

[model/ast/Nodes.ts:245](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L245)

___

### showSubtitles

• `Optional` **showSubtitles**: `boolean`

#### Inherited from

VideoLikeResource.showSubtitles

#### Defined in

[model/ast/Nodes.ts:246](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L246)

___

### alt

• `Optional` **alt**: `string`

#### Inherited from

VideoLikeResource.alt

#### Defined in

[model/ast/Nodes.ts:247](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L247)

___

### posterImage

• `Optional` **posterImage**: [`ImageResource`](ImageResource.md)

#### Inherited from

VideoLikeResource.posterImage

#### Defined in

[model/ast/Nodes.ts:248](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L248)

___

### thumbnails

• `Optional` **thumbnails**: [`ImageResource`](ImageResource.md)[]

#### Inherited from

VideoLikeResource.thumbnails

#### Defined in

[model/ast/Nodes.ts:249](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L249)

___

### type

• **type**: ``"video"``

#### Overrides

[Resource](Resource.md).[type](Resource.md#type)

#### Defined in

[model/ast/Nodes.ts:277](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/model/ast/Nodes.ts#L277)
