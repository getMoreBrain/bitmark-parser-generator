[@gmb/bitmark-parser-generator](../API.md) / [Exports](../modules.md) / Builder

# Class: Builder

Builder to build bitmark AST node programmatically

## Hierarchy

- `BaseBuilder`

  ↳ **`Builder`**

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
- [comment](Builder.md#comment)

## Constructors

### constructor

• **new Builder**()

#### Inherited from

BaseBuilder.constructor

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

[ast/Builder.ts:60](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L60)

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
| `data.spaceId?` | `string` \| `string`[] | - |
| `data.padletId?` | `string` \| `string`[] | - |
| `data.aiGenerated?` | `boolean` | - |
| `data.releaseVersion?` | `string` \| `string`[] | - |
| `data.ageRange?` | `number` \| `number`[] | - |
| `data.language?` | `string` \| `string`[] | - |
| `data.computerLanguage?` | `string` \| `string`[] | - |
| `data.subtype?` | `string` \| `string`[] | - |
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
| `data.partner?` | [`Partner`](../interfaces/Partner.md) | - |
| `data.extraProperties?` | `Object` | - |
| `data.resource?` | [`Resource`](../interfaces/Resource.md) | - |
| `data.body?` | [`Body`](../interfaces/Body.md) | - |
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
| `data.botResponses?` | [`BotResponse`](../interfaces/BotResponse.md)[] | - |
| `data.footer?` | [`FooterText`](../interfaces/FooterText.md) | - |
| `data.markup?` | `string` | - |
| `data.parser?` | `ParserInfo` | - |

#### Returns

`undefined` \| [`Bit`](../interfaces/Bit.md)

#### Defined in

[ast/Builder.ts:80](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L80)

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

[ast/Builder.ts:326](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L326)

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

[ast/Builder.ts:361](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L361)

___

### botResponse

▸ **botResponse**(`data`): [`BotResponse`](../interfaces/BotResponse.md)

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

[`BotResponse`](../interfaces/BotResponse.md)

#### Defined in

[ast/Builder.ts:396](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L396)

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

[ast/Builder.ts:429](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L429)

___

### heading

▸ **heading**(`data`): `undefined` \| [`Heading`](../interfaces/Heading.md)

Build heading node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.forKeys` | `string` | - |
| `data.forValues` | `string` \| `string`[] | - |

#### Returns

`undefined` \| [`Heading`](../interfaces/Heading.md)

#### Defined in

[ast/Builder.ts:462](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L462)

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

[ast/Builder.ts:485](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L485)

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

[ast/Builder.ts:527](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L527)

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

[ast/Builder.ts:564](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L564)

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

[ast/Builder.ts:595](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L595)

___

### body

▸ **body**(`data`): [`Body`](../interfaces/Body.md)

Build body node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.bodyParts` | [`BodyPart`](../interfaces/BodyPart.md)[] | - |

#### Returns

[`Body`](../interfaces/Body.md)

#### Defined in

[ast/Builder.ts:645](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L645)

___

### bodyText

▸ **bodyText**(`data`): [`BodyText`](../interfaces/BodyText.md)

Build bodyPartText node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |

#### Returns

[`BodyText`](../interfaces/BodyText.md)

#### Defined in

[ast/Builder.ts:661](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L661)

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

[ast/Builder.ts:680](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L680)

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

[ast/Builder.ts:696](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L696)

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

[ast/Builder.ts:732](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L732)

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

[ast/Builder.ts:772](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L772)

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

[ast/Builder.ts:807](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L807)

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

[ast/Builder.ts:847](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L847)

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

[ast/Builder.ts:884](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L884)

___

### partner

▸ **partner**(`data`): [`Partner`](../interfaces/Partner.md)

Build (chat) partner node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.name` | `string` | - |
| `data.avatarImage?` | [`ImageResource`](../interfaces/ImageResource.md) | - |

#### Returns

[`Partner`](../interfaces/Partner.md)

#### Defined in

[ast/Builder.ts:919](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L919)

___

### comment

▸ **comment**(`data`): `Comment`

Build comment node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | data for the node |
| `data.text` | `string` | - |
| `data.location?` | `Object` | - |
| `data.location.start` | `ParserLocation` | - |
| `data.location.end` | `ParserLocation` | - |

#### Returns

`Comment`

#### Defined in

[ast/Builder.ts:940](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/ast/Builder.ts#L940)
