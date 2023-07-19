[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / ResourceBuilder

# Class: ResourceBuilder

Builder to build bitmark Resource AST nodes programmatically

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

[ast/ResourceBuilder.ts:39](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L39)

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

[ast/ResourceBuilder.ts:240](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L240)

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

[ast/ResourceBuilder.ts:289](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L289)

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

[ast/ResourceBuilder.ts:338](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L338)

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

[ast/ResourceBuilder.ts:379](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L379)

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

[ast/ResourceBuilder.ts:420](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L420)

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

[ast/ResourceBuilder.ts:461](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L461)

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

[ast/ResourceBuilder.ts:532](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L532)

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

[ast/ResourceBuilder.ts:603](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L603)

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

[ast/ResourceBuilder.ts:674](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L674)

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

[ast/ResourceBuilder.ts:697](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L697)

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

[ast/ResourceBuilder.ts:768](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L768)

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

[ast/ResourceBuilder.ts:839](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L839)

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

[ast/ResourceBuilder.ts:874](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L874)

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

[ast/ResourceBuilder.ts:909](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L909)

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

[ast/ResourceBuilder.ts:944](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L944)

___

### documentDownloadResource

▸ **documentDownloadResource**(`data`): `DocumentDownloadResource`

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

`DocumentDownloadResource`

#### Defined in

[ast/ResourceBuilder.ts:979](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L979)

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

[ast/ResourceBuilder.ts:1014](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L1014)

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

[ast/ResourceBuilder.ts:1046](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/ResourceBuilder.ts#L1046)
