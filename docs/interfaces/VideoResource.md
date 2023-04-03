[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / VideoResource

# Interface: VideoResource

## Hierarchy

- [`Resource`](Resource.md)

- `VideoLikeResource`

  ↳ **`VideoResource`**

## Table of contents

### Properties

- [format](VideoResource.md#format)
- [url](VideoResource.md#url)
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

[model/ast/Nodes.ts:182](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L182)

___

### url

• `Optional` **url**: `string`

#### Inherited from

[Resource](Resource.md).[url](Resource.md#url)

#### Defined in

[model/ast/Nodes.ts:183](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L183)

___

### license

• `Optional` **license**: `string`

#### Inherited from

[Resource](Resource.md).[license](Resource.md#license)

#### Defined in

[model/ast/Nodes.ts:184](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L184)

___

### copyright

• `Optional` **copyright**: `string`

#### Inherited from

[Resource](Resource.md).[copyright](Resource.md#copyright)

#### Defined in

[model/ast/Nodes.ts:185](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L185)

___

### provider

• `Optional` **provider**: `string`

#### Inherited from

[Resource](Resource.md).[provider](Resource.md#provider)

#### Defined in

[model/ast/Nodes.ts:186](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L186)

___

### showInIndex

• `Optional` **showInIndex**: `boolean`

#### Inherited from

[Resource](Resource.md).[showInIndex](Resource.md#showInIndex)

#### Defined in

[model/ast/Nodes.ts:187](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L187)

___

### caption

• `Optional` **caption**: `string`

#### Inherited from

[Resource](Resource.md).[caption](Resource.md#caption)

#### Defined in

[model/ast/Nodes.ts:188](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L188)

___

### width

• `Optional` **width**: `number`

#### Inherited from

VideoLikeResource.width

#### Defined in

[model/ast/Nodes.ts:208](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L208)

___

### height

• `Optional` **height**: `number`

#### Inherited from

VideoLikeResource.height

#### Defined in

[model/ast/Nodes.ts:209](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L209)

___

### duration

• `Optional` **duration**: `number`

#### Inherited from

VideoLikeResource.duration

#### Defined in

[model/ast/Nodes.ts:210](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L210)

___

### mute

• `Optional` **mute**: `boolean`

#### Inherited from

VideoLikeResource.mute

#### Defined in

[model/ast/Nodes.ts:211](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L211)

___

### autoplay

• `Optional` **autoplay**: `boolean`

#### Inherited from

VideoLikeResource.autoplay

#### Defined in

[model/ast/Nodes.ts:212](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L212)

___

### allowSubtitles

• `Optional` **allowSubtitles**: `boolean`

#### Inherited from

VideoLikeResource.allowSubtitles

#### Defined in

[model/ast/Nodes.ts:213](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L213)

___

### showSubtitles

• `Optional` **showSubtitles**: `boolean`

#### Inherited from

VideoLikeResource.showSubtitles

#### Defined in

[model/ast/Nodes.ts:214](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L214)

___

### alt

• `Optional` **alt**: `string`

#### Inherited from

VideoLikeResource.alt

#### Defined in

[model/ast/Nodes.ts:215](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L215)

___

### posterImage

• `Optional` **posterImage**: [`ImageResource`](ImageResource.md)

#### Inherited from

VideoLikeResource.posterImage

#### Defined in

[model/ast/Nodes.ts:216](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L216)

___

### thumbnails

• `Optional` **thumbnails**: [`ImageResource`](ImageResource.md)[]

#### Inherited from

VideoLikeResource.thumbnails

#### Defined in

[model/ast/Nodes.ts:217](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L217)

___

### type

• **type**: ``"video"``

#### Overrides

[Resource](Resource.md).[type](Resource.md#type)

#### Defined in

[model/ast/Nodes.ts:246](https://github.com/getMoreBrain/bitmark-generator/blob/416295c/src/model/ast/Nodes.ts#L246)
