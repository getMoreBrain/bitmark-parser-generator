[@bitmark-standard/bitmark-generator](../API.md) / [Exports](../modules.md) / Builder

# Class: Builder

Builder to build bitmark AST node programmatically

## Table of contents

### Constructors

- [constructor](Builder.md#constructor)

### Methods

- [bitmark](Builder.md#bitmark)
- [bit](Builder.md#bit)
- [choice](Builder.md#choice)
- [response](Builder.md#response)
- [quiz](Builder.md#quiz)
- [heading](Builder.md#heading)
- [pair](Builder.md#pair)
- [matrix](Builder.md#matrix)
- [matrixCell](Builder.md#matrixCell)
- [question](Builder.md#question)
- [body](Builder.md#body)
- [bodyText](Builder.md#bodyText)
- [footerText](Builder.md#footerText)
- [gap](Builder.md#gap)
- [select](Builder.md#select)
- [selectOption](Builder.md#selectOption)
- [highlight](Builder.md#highlight)
- [highlightText](Builder.md#highlightText)
- [statement](Builder.md#statement)
- [resource](Builder.md#resource)
- [imageResource](Builder.md#imageResource)
- [imageLinkResource](Builder.md#imageLinkResource)
- [audioResource](Builder.md#audioResource)
- [audioLinkResource](Builder.md#audioLinkResource)
- [videoResource](Builder.md#videoResource)
- [videoLinkResource](Builder.md#videoLinkResource)
- [stillImageFilmResource](Builder.md#stillImageFilmResource)
- [stillImageFilmLinkResource](Builder.md#stillImageFilmLinkResource)
- [articleResource](Builder.md#articleResource)
- [articleLinkResource](Builder.md#articleLinkResource)
- [documentResource](Builder.md#documentResource)
- [documentLinkResource](Builder.md#documentLinkResource)
- [appResource](Builder.md#appResource)
- [appLinkResource](Builder.md#appLinkResource)
- [websiteLinkResource](Builder.md#websiteLinkResource)

## Constructors

### constructor

• **new Builder**()

## Methods

### bitmark

▸ **bitmark**(`data`): [`BitmarkAst`](../interfaces/BitmarkAst.md)

Build bitmark node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.bits?` | [`Bit`](../interfaces/Bit.md)[] | - |

#### Returns

[`BitmarkAst`](../interfaces/BitmarkAst.md)

#### Defined in

[ast/Builder.ts:65](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L65)

___

### bit

▸ **bit**(`data`): `undefined` \| [`Bit`](../interfaces/Bit.md)

Build bit node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.bitType` | [`BitTypeType`](../modules.md#BitTypeType) | - |
| `data.textFormat?` | [`TextFormatType`](../modules.md#TextFormatType) | - |
| `data.ids?` | `string` \| `string`[] | - |
| `data.externalIds?` | `string` \| `string`[] | - |
| `data.ageRanges?` | `number` \| `number`[] | - |
| `data.languages?` | `string` \| `string`[] | - |
| `data.computerLanguages?` | `string` \| `string`[] | - |
| `data.coverImages?` | `string` \| `string`[] | - |
| `data.publishers?` | `string` \| `string`[] | - |
| `data.publications?` | `string` \| `string`[] | - |
| `data.authors?` | `string` \| `string`[] | - |
| `data.dates?` | `string` \| `string`[] | - |
| `data.locations?` | `string` \| `string`[] | - |
| `data.themes?` | `string` \| `string`[] | - |
| `data.kinds?` | `string` \| `string`[] | - |
| `data.actions?` | `string` \| `string`[] | - |
| `data.thumbImages?` | `string` \| `string`[] | - |
| `data.durations?` | `string` \| `string`[] | - |
| `data.deepLinks?` | `string` \| `string`[] | - |
| `data.externalLink?` | `string` | - |
| `data.externalLinkText?` | `string` | - |
| `data.videoCallLinks?` | `string` \| `string`[] | - |
| `data.bots?` | `string` \| `string`[] | - |
| `data.lists?` | `string` \| `string`[] | - |
| `data.labelTrue?` | `string` | - |
| `data.labelFalse?` | `string` | - |
| `data.quotedPerson?` | `string` | - |
| `data.book?` | `string` | - |
| `data.title?` | `string` | - |
| `data.subtitle?` | `string` | - |
| `data.level?` | `number` | - |
| `data.toc?` | `boolean` | - |
| `data.progress?` | `boolean` | - |
| `data.anchor?` | `string` | - |
| `data.reference?` | `string` \| `string`[] | - |
| `data.referenceEnd?` | `string` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.resource?` | [`Resource`](../interfaces/Resource.md) | - |
| `data.body?` | [`Body`](../modules.md#Body) | - |
| `data.sampleSolutions` | `string` \| `string`[] | - |
| `data.elements?` | `string`[] | - |
| `data.statements?` | [`Statement`](../interfaces/Statement.md)[] | - |
| `data.responses?` | [`Response`](../interfaces/Response.md)[] | - |
| `data.quizzes?` | [`Quiz`](../interfaces/Quiz.md)[] | - |
| `data.heading?` | [`Heading`](../interfaces/Heading.md) | - |
| `data.pairs?` | [`Pair`](../interfaces/Pair.md)[] | - |
| `data.matrix?` | [`Matrix`](../interfaces/Matrix.md)[] | - |
| `data.choices?` | [`Choice`](../interfaces/Choice.md)[] | - |
| `data.questions?` | [`Question`](../interfaces/Question.md)[] | - |
| `data.footer?` | [`FooterText`](../interfaces/FooterText.md) | - |

#### Returns

`undefined` \| [`Bit`](../interfaces/Bit.md)

#### Defined in

[ast/Builder.ts:80](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L80)

___

### choice

▸ **choice**(`data`): [`Choice`](../interfaces/Choice.md)

Build choice node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |
| `data.isCorrect` | `boolean` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`Choice`](../interfaces/Choice.md)

#### Defined in

[ast/Builder.ts:267](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L267)

___

### response

▸ **response**(`data`): [`Response`](../interfaces/Response.md)

Build response node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |
| `data.isCorrect` | `boolean` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`Response`](../interfaces/Response.md)

#### Defined in

[ast/Builder.ts:302](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L302)

___

### quiz

▸ **quiz**(`data`): [`Quiz`](../interfaces/Quiz.md)

Build quiz node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.choices?` | [`Choice`](../interfaces/Choice.md)[] | - |
| `data.responses?` | [`Response`](../interfaces/Response.md)[] | - |

#### Returns

[`Quiz`](../interfaces/Quiz.md)

#### Defined in

[ast/Builder.ts:337](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L337)

___

### heading

▸ **heading**(`data`): [`Heading`](../interfaces/Heading.md)

Build heading node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.forKeys` | `string` | - |
| `data.forValues` | `string` \| `string`[] | - |

#### Returns

[`Heading`](../interfaces/Heading.md)

#### Defined in

[ast/Builder.ts:370](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L370)

___

### pair

▸ **pair**(`data`): [`Pair`](../interfaces/Pair.md)

Build pair node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.key?` | `string` | - |
| `data.keyAudio?` | [`AudioResource`](../interfaces/AudioResource.md) | - |
| `data.keyImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |
| `data.values` | `string`[] | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |
| `data.isLongAnswer?` | `boolean` | - |

#### Returns

[`Pair`](../interfaces/Pair.md)

#### Defined in

[ast/Builder.ts:391](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L391)

___

### matrix

▸ **matrix**(`data`): [`Matrix`](../interfaces/Matrix.md)

Build matrix node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.key` | `string` | - |
| `data.cells` | [`MatrixCell`](../interfaces/MatrixCell.md)[] | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |
| `data.isLongAnswer?` | `boolean` | - |

#### Returns

[`Matrix`](../interfaces/Matrix.md)

#### Defined in

[ast/Builder.ts:433](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L433)

___

### matrixCell

▸ **matrixCell**(`data`): [`MatrixCell`](../interfaces/MatrixCell.md)

Build matrixCell node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.values` | `string`[] | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |

#### Returns

[`MatrixCell`](../interfaces/MatrixCell.md)

#### Defined in

[ast/Builder.ts:470](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L470)

___

### question

▸ **question**(`data`): [`Question`](../interfaces/Question.md)

Build question node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.question` | `string` | - |
| `data.partialAnswer?` | `string` | - |
| `data.sampleSolution?` | `string` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |
| `data.isShortAnswer?` | `boolean` | - |

#### Returns

[`Question`](../interfaces/Question.md)

#### Defined in

[ast/Builder.ts:501](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L501)

___

### body

▸ **body**(`data`): [`Body`](../modules.md#Body)

Build body node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.bodyParts` | [`BodyPart`](../modules.md#BodyPart)[] | - |

#### Returns

[`Body`](../modules.md#Body)

#### Defined in

[ast/Builder.ts:553](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L553)

___

### bodyText

▸ **bodyText**(`data`): [`BodyText`](../interfaces/BodyText.md)

Build bodyText node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |

#### Returns

[`BodyText`](../interfaces/BodyText.md)

#### Defined in

[ast/Builder.ts:566](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L566)

___

### footerText

▸ **footerText**(`data`): [`FooterText`](../interfaces/FooterText.md)

Build footer node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |

#### Returns

[`FooterText`](../interfaces/FooterText.md)

#### Defined in

[ast/Builder.ts:582](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L582)

___

### gap

▸ **gap**(`data`): [`Gap`](../interfaces/Gap.md)

Build gap node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.solutions` | `string`[] | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`Gap`](../interfaces/Gap.md)

#### Defined in

[ast/Builder.ts:598](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L598)

___

### select

▸ **select**(`data`): [`Select`](../interfaces/Select.md)

Build select node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.options` | [`SelectOption`](../interfaces/SelectOption.md)[] | - |
| `data.prefix?` | `string` | - |
| `data.postfix?` | `string` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`Select`](../interfaces/Select.md)

#### Defined in

[ast/Builder.ts:633](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L633)

___

### selectOption

▸ **selectOption**(`data`): [`SelectOption`](../interfaces/SelectOption.md)

Build selectOption node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |
| `data.isCorrect` | `boolean` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`SelectOption`](../interfaces/SelectOption.md)

#### Defined in

[ast/Builder.ts:672](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L672)

___

### highlight

▸ **highlight**(`data`): [`Highlight`](../interfaces/Highlight.md)

Build highlight node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.texts` | [`HighlightText`](../interfaces/HighlightText.md)[] | - |
| `data.prefix?` | `string` | - |
| `data.postfix?` | `string` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`Highlight`](../interfaces/Highlight.md)

#### Defined in

[ast/Builder.ts:707](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L707)

___

### highlightText

▸ **highlightText**(`data`): [`HighlightText`](../interfaces/HighlightText.md)

Build highlightText node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |
| `data.isCorrect` | `boolean` | - |
| `data.isHighlighted` | `boolean` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`HighlightText`](../interfaces/HighlightText.md)

#### Defined in

[ast/Builder.ts:746](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L746)

___

### statement

▸ **statement**(`data`): [`Statement`](../interfaces/Statement.md)

Build statement node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |
| `data.isCorrect` | `boolean` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.isCaseSensitive?` | `boolean` | - |

#### Returns

[`Statement`](../interfaces/Statement.md)

#### Defined in

[ast/Builder.ts:783](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L783)

___

### resource

▸ **resource**(`data`): `undefined` \| [`Resource`](../interfaces/Resource.md)

Build resource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.type` | [`ResourceTypeType`](../modules.md#ResourceTypeType) | - |
| `data.url?` | `string` | - |
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
| `data.body?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

`undefined` \| [`Resource`](../interfaces/Resource.md)

#### Defined in

[ast/Builder.ts:818](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L818)

___

### imageResource

▸ **imageResource**(`data`): [`ImageResource`](../interfaces/ImageResource.md)

Build imageResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
| `data.src1x?` | `string` | - |
| `data.src2x?` | `string` | - |
| `data.src3x?` | `string` | - |
| `data.src4x?` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.alt?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ImageResource`](../interfaces/ImageResource.md)

#### Defined in

[ast/Builder.ts:946](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L946)

___

### imageLinkResource

▸ **imageLinkResource**(`data`): [`ImageLinkResource`](../interfaces/ImageLinkResource.md)

Build imageLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
| `data.src1x?` | `string` | - |
| `data.src2x?` | `string` | - |
| `data.src3x?` | `string` | - |
| `data.src4x?` | `string` | - |
| `data.width?` | `number` | - |
| `data.height?` | `number` | - |
| `data.alt?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ImageLinkResource`](../interfaces/ImageLinkResource.md)

#### Defined in

[ast/Builder.ts:976](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L976)

___

### audioResource

▸ **audioResource**(`data`): [`AudioResource`](../interfaces/AudioResource.md)

Build audioResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioResource`](../interfaces/AudioResource.md)

#### Defined in

[ast/Builder.ts:1006](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1006)

___

### audioLinkResource

▸ **audioLinkResource**(`data`): [`AudioLinkResource`](../interfaces/AudioLinkResource.md)

Build audioLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioLinkResource`](../interfaces/AudioLinkResource.md)

#### Defined in

[ast/Builder.ts:1029](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1029)

___

### videoResource

▸ **videoResource**(`data`): [`VideoResource`](../interfaces/VideoResource.md)

Build videoResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
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
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`VideoResource`](../interfaces/VideoResource.md)

#### Defined in

[ast/Builder.ts:1052](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1052)

___

### videoLinkResource

▸ **videoLinkResource**(`data`): [`VideoLinkResource`](../interfaces/VideoLinkResource.md)

Build videoLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
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
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`VideoLinkResource`](../interfaces/VideoLinkResource.md)

#### Defined in

[ast/Builder.ts:1085](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1085)

___

### stillImageFilmResource

▸ **stillImageFilmResource**(`data`): [`StillImageFilmResource`](../interfaces/StillImageFilmResource.md)

Build stillImageFilmResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
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
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`StillImageFilmResource`](../interfaces/StillImageFilmResource.md)

#### Defined in

[ast/Builder.ts:1118](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1118)

___

### stillImageFilmLinkResource

▸ **stillImageFilmLinkResource**(`data`): [`StillImageFilmLinkResource`](../interfaces/StillImageFilmLinkResource.md)

Build stillImageFilmLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
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
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`StillImageFilmLinkResource`](../interfaces/StillImageFilmLinkResource.md)

#### Defined in

[ast/Builder.ts:1151](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1151)

___

### articleResource

▸ **articleResource**(`data`): [`ArticleResource`](../interfaces/ArticleResource.md)

Build articleResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.href?` | `string` | - |
| `data.body?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ArticleResource`](../interfaces/ArticleResource.md)

#### Defined in

[ast/Builder.ts:1184](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1184)

___

### articleLinkResource

▸ **articleLinkResource**(`data`): [`ArticleLinkResource`](../interfaces/ArticleLinkResource.md)

Build articleLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`ArticleLinkResource`](../interfaces/ArticleLinkResource.md)

#### Defined in

[ast/Builder.ts:1208](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1208)

___

### documentResource

▸ **documentResource**(`data`): [`DocumentResource`](../interfaces/DocumentResource.md)

Build documentResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.href?` | `string` | - |
| `data.body?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentResource`](../interfaces/DocumentResource.md)

#### Defined in

[ast/Builder.ts:1231](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1231)

___

### documentLinkResource

▸ **documentLinkResource**(`data`): [`DocumentLinkResource`](../interfaces/DocumentLinkResource.md)

Build documentLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.format` | `string` | - |
| `data.url` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentLinkResource`](../interfaces/DocumentLinkResource.md)

#### Defined in

[ast/Builder.ts:1255](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1255)

___

### appResource

▸ **appResource**(`data`): [`AppResource`](../interfaces/AppResource.md)

Build appResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.url` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AppResource`](../interfaces/AppResource.md)

#### Defined in

[ast/Builder.ts:1278](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1278)

___

### appLinkResource

▸ **appLinkResource**(`data`): [`AppLinkResource`](../interfaces/AppLinkResource.md)

Build appLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.url` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AppLinkResource`](../interfaces/AppLinkResource.md)

#### Defined in

[ast/Builder.ts:1300](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1300)

___

### websiteLinkResource

▸ **websiteLinkResource**(`data`): `undefined` \| [`WebsiteLinkResource`](../interfaces/WebsiteLinkResource.md)

Build websiteLinkResource node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.url` | `string` | - |
| `data.siteName?` | `string` | - |
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.provider?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

`undefined` \| [`WebsiteLinkResource`](../interfaces/WebsiteLinkResource.md)

#### Defined in

[ast/Builder.ts:1322](https://github.com/getMoreBrain/bitmark-generator/blob/de39d9c/src/ast/Builder.ts#L1322)
