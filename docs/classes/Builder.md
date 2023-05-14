[@getmorebrain/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Builder

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
- [botResponse](Builder.md#botResponse)
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
- [documentDownloadResource](Builder.md#documentDownloadResource)
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
| `data.errors?` | `ParserError`[] | - |

#### Returns

[`BitmarkAst`](../interfaces/BitmarkAst.md)

#### Defined in

[ast/Builder.ts:79](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L79)

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
| `data.resourceType?` | [`ResourceTypeType`](../modules.md#ResourceTypeType) | - |
| `data.id?` | `string` \| `string`[] | - |
| `data.externalId?` | `string` \| `string`[] | - |
| `data.ageRange?` | `number` \| `number`[] | - |
| `data.language?` | `string` \| `string`[] | - |
| `data.computerLanguage?` | `string` \| `string`[] | - |
| `data.coverImage?` | `string` \| `string`[] | - |
| `data.publisher?` | `string` \| `string`[] | - |
| `data.publications?` | `string` \| `string`[] | - |
| `data.author?` | `string` \| `string`[] | - |
| `data.subject?` | `string` \| `string`[] | - |
| `data.date?` | `string` \| `string`[] | - |
| `data.location?` | `string` \| `string`[] | - |
| `data.theme?` | `string` \| `string`[] | - |
| `data.kind?` | `string` \| `string`[] | - |
| `data.action?` | `string` \| `string`[] | - |
| `data.thumbImage?` | `string` \| `string`[] | - |
| `data.focusX?` | `number` \| `number`[] | - |
| `data.focusY?` | `number` \| `number`[] | - |
| `data.duration?` | `string` \| `string`[] | - |
| `data.referenceProperty?` | `string` \| `string`[] | - |
| `data.deeplink?` | `string` \| `string`[] | - |
| `data.externalLink?` | `string` \| `string`[] | - |
| `data.externalLinkText?` | `string` \| `string`[] | - |
| `data.videoCallLink?` | `string` \| `string`[] | - |
| `data.bot?` | `string` \| `string`[] | - |
| `data.list?` | `string` \| `string`[] | - |
| `data.labelTrue?` | `string` \| `string`[] | - |
| `data.labelFalse?` | `string` \| `string`[] | - |
| `data.quotedPerson?` | `string` \| `string`[] | - |
| `data.partialAnswer?` | `string` \| `string`[] | - |
| `data.levelProperty?` | `string` \| `string`[] | - |
| `data.book?` | `string` | - |
| `data.title?` | `string` | - |
| `data.subtitle?` | `string` | - |
| `data.level?` | `string` \| `number` | - |
| `data.toc?` | `boolean` | - |
| `data.progress?` | `boolean` | - |
| `data.anchor?` | `string` | - |
| `data.reference?` | `string` | - |
| `data.referenceEnd?` | `string` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |
| `data.instruction?` | `string` | - |
| `data.example?` | `string` \| `boolean` | - |
| `data.extraProperties?` | `Object` | - |
| `data.resource?` | [`Resource`](../interfaces/Resource.md) | - |
| `data.body?` | [`Body`](../modules.md#Body) | - |
| `data.sampleSolution?` | `string` \| `string`[] | - |
| `data.elements?` | `string`[] | - |
| `data.statement?` | [`Statement`](../interfaces/Statement.md) | - |
| `data.statements?` | [`Statement`](../interfaces/Statement.md)[] | - |
| `data.responses?` | [`Response`](../interfaces/Response.md)[] | - |
| `data.quizzes?` | [`Quiz`](../interfaces/Quiz.md)[] | - |
| `data.heading?` | [`Heading`](../interfaces/Heading.md) | - |
| `data.pairs?` | [`Pair`](../interfaces/Pair.md)[] | - |
| `data.matrix?` | [`Matrix`](../interfaces/Matrix.md)[] | - |
| `data.choices?` | [`Choice`](../interfaces/Choice.md)[] | - |
| `data.questions?` | [`Question`](../interfaces/Question.md)[] | - |
| `data.botResponses?` | `BotResponse`[] | - |
| `data.footer?` | [`FooterText`](../interfaces/FooterText.md) | - |
| `data.bitmark?` | `string` | - |
| `data.parser?` | `ParserInfo` | - |

#### Returns

`undefined` \| [`Bit`](../interfaces/Bit.md)

#### Defined in

[ast/Builder.ts:96](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L96)

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

[ast/Builder.ts:324](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L324)

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

[ast/Builder.ts:359](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L359)

___

### botResponse

▸ **botResponse**(`data`): `BotResponse`

Build bot response node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.response` | `string` | - |
| `data.reaction` | `string` | - |
| `data.feedback` | `string` | - |
| `data.item?` | `string` | - |
| `data.lead?` | `string` | - |
| `data.hint?` | `string` | - |

#### Returns

`BotResponse`

#### Defined in

[ast/Builder.ts:394](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L394)

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

[ast/Builder.ts:425](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L425)

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

[ast/Builder.ts:458](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L458)

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
| `data.isShortAnswer?` | `boolean` | - |

#### Returns

[`Pair`](../interfaces/Pair.md)

#### Defined in

[ast/Builder.ts:479](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L479)

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
| `data.isShortAnswer?` | `boolean` | - |

#### Returns

[`Matrix`](../interfaces/Matrix.md)

#### Defined in

[ast/Builder.ts:521](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L521)

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

[ast/Builder.ts:558](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L558)

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

[ast/Builder.ts:589](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L589)

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

[ast/Builder.ts:639](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L639)

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

[ast/Builder.ts:652](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L652)

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

[ast/Builder.ts:668](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L668)

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

[ast/Builder.ts:684](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L684)

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

[ast/Builder.ts:719](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L719)

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

[ast/Builder.ts:758](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L758)

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

[ast/Builder.ts:793](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L793)

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

[ast/Builder.ts:832](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L832)

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

[ast/Builder.ts:869](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L869)

___

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
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

`undefined` \| [`Resource`](../interfaces/Resource.md)

#### Defined in

[ast/Builder.ts:904](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L904)

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

[ast/Builder.ts:1035](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1035)

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

[ast/Builder.ts:1064](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1064)

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
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioResource`](../interfaces/AudioResource.md)

#### Defined in

[ast/Builder.ts:1093](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1093)

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
| `data.license?` | `string` | - |
| `data.copyright?` | `string` | - |
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`AudioLinkResource`](../interfaces/AudioLinkResource.md)

#### Defined in

[ast/Builder.ts:1115](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1115)

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

[ast/Builder.ts:1137](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1137)

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

[ast/Builder.ts:1169](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1169)

___

### stillImageFilmResource

▸ **stillImageFilmResource**(`data`): [`StillImageFilmResource`](../interfaces/StillImageFilmResource.md)

Build stillImageFilmResource node

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

[`StillImageFilmResource`](../interfaces/StillImageFilmResource.md)

#### Defined in

[ast/Builder.ts:1201](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1201)

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

[ast/Builder.ts:1233](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1233)

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

[ast/Builder.ts:1265](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1265)

___

### articleLinkResource

▸ **articleLinkResource**(`data`): [`ArticleLinkResource`](../interfaces/ArticleLinkResource.md)

Build articleLinkResource node

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

[`ArticleLinkResource`](../interfaces/ArticleLinkResource.md)

#### Defined in

[ast/Builder.ts:1287](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1287)

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
| `data.showInIndex?` | `boolean` | - |
| `data.caption?` | `string` | - |

#### Returns

[`DocumentResource`](../interfaces/DocumentResource.md)

#### Defined in

[ast/Builder.ts:1309](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1309)

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

[ast/Builder.ts:1332](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1332)

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

[ast/Builder.ts:1354](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1354)

___

### appResource

▸ **appResource**(`data`): [`AppResource`](../interfaces/AppResource.md)

Build appResource node

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

[`AppResource`](../interfaces/AppResource.md)

#### Defined in

[ast/Builder.ts:1376](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1376)

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

[ast/Builder.ts:1397](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1397)

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

[ast/Builder.ts:1418](https://github.com/getMoreBrain/bitmark-parser-generator/blob/b82d7bf/src/ast/Builder.ts#L1418)
