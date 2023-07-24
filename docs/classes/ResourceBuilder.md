[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / ResourceBuilder

# Class: ResourceBuilder

Builder to build bitmark Resource AST nodes programmatically

## Hierarchy

- `BaseBuilder`

  ↳ **`ResourceBuilder`**

## Table of contents

### Constructors

- [constructor](ResourceBuilder.md#constructor)

### Methods

- [resource](ResourceBuilder.md#resource)
- [imageResource](ResourceBuilder.md#imageResource)
- [imageLinkResource](ResourceBuilder.md#imageLinkResource)
- [audioResource](ResourceBuilder.md#audioResource)
- [audioEmbedResource](ResourceBuilder.md#audioEmbedResource)
- [audioLinkResource](ResourceBuilder.md#audioLinkResource)
- [videoResource](ResourceBuilder.md#videoResource)
- [videoEmbedResource](ResourceBuilder.md#videoEmbedResource)
- [videoLinkResource](ResourceBuilder.md#videoLinkResource)
- [stillImageFilmResource](ResourceBuilder.md#stillImageFilmResource)
- [stillImageFilmEmbedResource](ResourceBuilder.md#stillImageFilmEmbedResource)
- [stillImageFilmLinkResource](ResourceBuilder.md#stillImageFilmLinkResource)
- [articleResource](ResourceBuilder.md#articleResource)
- [documentResource](ResourceBuilder.md#documentResource)
- [documentEmbedResource](ResourceBuilder.md#documentEmbedResource)
- [documentLinkResource](ResourceBuilder.md#documentLinkResource)
- [documentDownloadResource](ResourceBuilder.md#documentDownloadResource)
- [appLinkResource](ResourceBuilder.md#appLinkResource)
- [websiteLinkResource](ResourceBuilder.md#websiteLinkResource)

## Constructors

### constructor

• **new ResourceBuilder**()

#### Inherited from

BaseBuilder.constructor

## Methods

### resource

▸ **resource**(`data`): `undefined` \| [`Resource`](../interfaces/Resource.md)

Build resource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.type` | [`ResourceTypeType`](../modules.md#ResourceTypeType) | - |
| `data.value?` | `string` | - |
| `data.format?` | `string` | - |
| `data.src1x?` | `string` | - |
| `data.src2x?` | `string` | - |
| `data.src3x?` | `string` | - |
| `data.src4x?` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.alt?` | `string` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.allowSubtitles?` | `boolean` | - |
| `data.showSubtitles?` | `boolean` | - |
| `data.posterImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.thumbnails?` | [`ImageResource`](../interfaces/ImageResource.md)[] | - |
| `data.siteName?` | `string` | - |
| `data.image?` | `Object` | - |
| `data.image.format` | `string` | - |
| `data.image.value` | `string` | - |
| `data.image.src1x?` | `string` | - |
| `data.image.src2x?` | `string` | - |
| `data.image.src3x?` | `string` | - |
| `data.image.src4x?` | `string` | - |
| `data.image.width?` | `number` | - |
| `data.image.height?` | `number` | - |
| `data.image.alt?` | `string` | - |
| `data.image.license?` | `string` | - |
| `data.image.copyright?` | `string` | - |
| `data.image.showInIndex?` | `boolean` | - |
| `data.image.caption?` | `string` | - |
| `data.audio?` | `Object` | - |
| `data.audio.format` | `string` | - |
| `data.audio.value` | `string` | - |
| `data.audio.license?` | `string` | - |
| `data.audio.copyright?` | `string` | - |
| `data.audio.showInIndex?` | `boolean` | - |
| `data.audio.caption?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

`undefined` \| [`Resource`](../interfaces/Resource.md)

#### Defined in

[ast/ResourceBuilder.ts:40](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L40)

___

### imageResource

▸ **imageResource**(`data`): [`ImageResource`](../interfaces/ImageResource.md)

Build imageResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.src1x?` | `string` | - |
| `data.src2x?` | `string` | - |
| `data.src3x?` | `string` | - |
| `data.src4x?` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.alt?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ImageResource`](../interfaces/ImageResource.md)

#### Defined in

[ast/ResourceBuilder.ts:241](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L241)

___

### imageLinkResource

▸ **imageLinkResource**(`data`): [`ImageLinkResource`](../interfaces/ImageLinkResource.md)

Build imageLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.src1x?` | `string` | - |
| `data.src2x?` | `string` | - |
| `data.src3x?` | `string` | - |
| `data.src4x?` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.alt?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ImageLinkResource`](../interfaces/ImageLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:290](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L290)

___

### audioResource

▸ **audioResource**(`data`): [`AudioResource`](../interfaces/AudioResource.md)

Build audioResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioResource`](../interfaces/AudioResource.md)

#### Defined in

[ast/ResourceBuilder.ts:339](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L339)

___

### audioEmbedResource

▸ **audioEmbedResource**(`data`): [`AudioEmbedResource`](../interfaces/AudioEmbedResource.md)

Build audioEmbedResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioEmbedResource`](../interfaces/AudioEmbedResource.md)

#### Defined in

[ast/ResourceBuilder.ts:380](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L380)

___

### audioLinkResource

▸ **audioLinkResource**(`data`): [`AudioLinkResource`](../interfaces/AudioLinkResource.md)

Build audioLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioLinkResource`](../interfaces/AudioLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:421](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L421)

___

### videoResource

▸ **videoResource**(`data`): [`VideoResource`](../interfaces/VideoResource.md)

Build videoResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.allowSubtitles?` | `boolean` | - |
| `data.showSubtitles?` | `boolean` | - |
| `data.alt?` | `string` | - |
| `data.posterImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.thumbnails?` | [`ImageResource`](../interfaces/ImageResource.md)[] | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`VideoResource`](../interfaces/VideoResource.md)

#### Defined in

[ast/ResourceBuilder.ts:462](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L462)

___

### videoEmbedResource

▸ **videoEmbedResource**(`data`): [`VideoEmbedResource`](../interfaces/VideoEmbedResource.md)

Build videoEmbedResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.allowSubtitles?` | `boolean` | - |
| `data.showSubtitles?` | `boolean` | - |
| `data.alt?` | `string` | - |
| `data.posterImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.thumbnails?` | [`ImageResource`](../interfaces/ImageResource.md)[] | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`VideoEmbedResource`](../interfaces/VideoEmbedResource.md)

#### Defined in

[ast/ResourceBuilder.ts:533](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L533)

___

### videoLinkResource

▸ **videoLinkResource**(`data`): [`VideoLinkResource`](../interfaces/VideoLinkResource.md)

Build videoLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.allowSubtitles?` | `boolean` | - |
| `data.showSubtitles?` | `boolean` | - |
| `data.alt?` | `string` | - |
| `data.posterImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.thumbnails?` | [`ImageResource`](../interfaces/ImageResource.md)[] | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`VideoLinkResource`](../interfaces/VideoLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:604](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L604)

___

### stillImageFilmResource

▸ **stillImageFilmResource**(`data`): [`StillImageFilmResource`](../interfaces/StillImageFilmResource.md)

Build stillImageFilmResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.image?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.audio?` | [`AudioResource`](../interfaces/AudioResource.md) | - |

#### Returns

[`StillImageFilmResource`](../interfaces/StillImageFilmResource.md)

#### Defined in

[ast/ResourceBuilder.ts:675](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L675)

___

### stillImageFilmEmbedResource

▸ **stillImageFilmEmbedResource**(`data`): [`StillImageFilmEmbedResource`](../interfaces/StillImageFilmEmbedResource.md)

Build stillImageFilmEmbedResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.allowSubtitles?` | `boolean` | - |
| `data.showSubtitles?` | `boolean` | - |
| `data.alt?` | `string` | - |
| `data.posterImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.thumbnails?` | [`ImageResource`](../interfaces/ImageResource.md)[] | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`StillImageFilmEmbedResource`](../interfaces/StillImageFilmEmbedResource.md)

#### Defined in

[ast/ResourceBuilder.ts:698](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L698)

___

### stillImageFilmLinkResource

▸ **stillImageFilmLinkResource**(`data`): [`StillImageFilmLinkResource`](../interfaces/StillImageFilmLinkResource.md)

Build stillImageFilmLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.duration?` | `number` | - |
| `data.mute?` | `boolean` | - |
| `data.autoplay?` | `boolean` | - |
| `data.allowSubtitles?` | `boolean` | - |
| `data.showSubtitles?` | `boolean` | - |
| `data.alt?` | `string` | - |
| `data.posterImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.thumbnails?` | [`ImageResource`](../interfaces/ImageResource.md)[] | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`StillImageFilmLinkResource`](../interfaces/StillImageFilmLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:769](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L769)

___

### articleResource

▸ **articleResource**(`data`): [`ArticleResource`](../interfaces/ArticleResource.md)

Build articleResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ArticleResource`](../interfaces/ArticleResource.md)

#### Defined in

[ast/ResourceBuilder.ts:840](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L840)

___

### documentResource

▸ **documentResource**(`data`): [`DocumentResource`](../interfaces/DocumentResource.md)

Build documentResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentResource`](../interfaces/DocumentResource.md)

#### Defined in

[ast/ResourceBuilder.ts:875](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L875)

___

### documentEmbedResource

▸ **documentEmbedResource**(`data`): [`DocumentEmbedResource`](../interfaces/DocumentEmbedResource.md)

Build documentEmbedResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentEmbedResource`](../interfaces/DocumentEmbedResource.md)

#### Defined in

[ast/ResourceBuilder.ts:910](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L910)

___

### documentLinkResource

▸ **documentLinkResource**(`data`): [`DocumentLinkResource`](../interfaces/DocumentLinkResource.md)

Build documentLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentLinkResource`](../interfaces/DocumentLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:945](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L945)

___

### documentDownloadResource

▸ **documentDownloadResource**(`data`): [`DocumentDownloadResource`](../interfaces/DocumentDownloadResource.md)

Build documentDownloadResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.value` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentDownloadResource`](../interfaces/DocumentDownloadResource.md)

#### Defined in

[ast/ResourceBuilder.ts:980](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L980)

___

### appLinkResource

▸ **appLinkResource**(`data`): [`AppLinkResource`](../interfaces/AppLinkResource.md)

Build appLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.value` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AppLinkResource`](../interfaces/AppLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:1015](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L1015)

___

### websiteLinkResource

▸ **websiteLinkResource**(`data`): `undefined` \| [`WebsiteLinkResource`](../interfaces/WebsiteLinkResource.md)

Build websiteLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.value` | `string` | - |
| `data.siteName?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

`undefined` \| [`WebsiteLinkResource`](../interfaces/WebsiteLinkResource.md)

#### Defined in

[ast/ResourceBuilder.ts:1047](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/ResourceBuilder.ts#L1047)
