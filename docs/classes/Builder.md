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
- [partner](Builder.md#partner)

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

[ast/Builder.ts:57](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L57)

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
| `data.padletId?` | `string` \| `string`[] | - |
| `data.releaseVersion?` | `string` \| `string`[] | - |
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
| `data.textReference?` | `string` \| `string`[] | - |
| `data.isTracked?` | `boolean` | - |
| `data.isInfoOnly?` | `boolean` | - |
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
| `data.partner?` | `Partner` | - |
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

[ast/Builder.ts:74](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L74)

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

[ast/Builder.ts:320](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L320)

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

[ast/Builder.ts:355](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L355)

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

[ast/Builder.ts:390](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L390)

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

[ast/Builder.ts:421](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L421)

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

[ast/Builder.ts:454](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L454)

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

[ast/Builder.ts:475](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L475)

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

[ast/Builder.ts:517](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L517)

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

[ast/Builder.ts:554](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L554)

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

[ast/Builder.ts:585](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L585)

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

[ast/Builder.ts:635](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L635)

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

[ast/Builder.ts:648](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L648)

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

[ast/Builder.ts:664](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L664)

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

[ast/Builder.ts:680](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L680)

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

[ast/Builder.ts:715](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L715)

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

[ast/Builder.ts:754](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L754)

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

[ast/Builder.ts:789](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L789)

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

[ast/Builder.ts:828](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L828)

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

[ast/Builder.ts:865](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L865)

___

### partner

▸ **partner**(`data`): `Partner`

Build (chat) partner node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.name` | `string` | - |
| `data.avatarImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |

#### Returns

`Partner`

#### Defined in

[ast/Builder.ts:900](https://github.com/getMoreBrain/bitmark-parser-generator/blob/9ddf9e2/src/ast/Builder.ts#L900)
