[@gmb/bitmark-parser-generator](API.md) / Exports

# @gmb/bitmark-parser-generator

## Table of contents

### Classes

- [BitmarkParserGenerator](classes/BitmarkParserGenerator.md)
- [Ast](classes/Ast.md)
- [Builder](classes/Builder.md)
- [ResourceBuilder](classes/ResourceBuilder.md)
- [FileWriter](classes/FileWriter.md)
- [StreamWriter](classes/StreamWriter.md)
- [StringWriter](classes/StringWriter.md)
- [BitmarkFileGenerator](classes/BitmarkFileGenerator.md)
- [BitmarkGenerator](classes/BitmarkGenerator.md)
- [BitmarkStringGenerator](classes/BitmarkStringGenerator.md)
- [JsonFileGenerator](classes/JsonFileGenerator.md)
- [JsonGenerator](classes/JsonGenerator.md)
- [JsonStringGenerator](classes/JsonStringGenerator.md)
- [BitmarkParser](classes/BitmarkParser.md)
- [JsonParser](classes/JsonParser.md)

### Interfaces

- [ConvertOptions](interfaces/ConvertOptions.md)
- [PrettifyOptions](interfaces/PrettifyOptions.md)
- [NodeInfo](interfaces/NodeInfo.md)
- [AstWalkCallbacks](interfaces/AstWalkCallbacks.md)
- [FileOptions](interfaces/FileOptions.md)
- [Writer](interfaces/Writer.md)
- [Generator](interfaces/Generator.md)
- [BitmarkOptions](interfaces/BitmarkOptions.md)
- [JsonOptions](interfaces/JsonOptions.md)
- [BitmarkAst](interfaces/BitmarkAst.md)
- [Bit](interfaces/Bit.md)
- [ItemLead](interfaces/ItemLead.md)
- [ExtraProperties](interfaces/ExtraProperties.md)
- [Partner](interfaces/Partner.md)
- [Statement](interfaces/Statement.md)
- [Choice](interfaces/Choice.md)
- [Response](interfaces/Response.md)
- [BotResponse](interfaces/BotResponse.md)
- [Quiz](interfaces/Quiz.md)
- [Heading](interfaces/Heading.md)
- [Pair](interfaces/Pair.md)
- [Matrix](interfaces/Matrix.md)
- [MatrixCell](interfaces/MatrixCell.md)
- [Question](interfaces/Question.md)
- [Body](interfaces/Body.md)
- [BodyText](interfaces/BodyText.md)
- [BodyPart](interfaces/BodyPart.md)
- [BodyBit](interfaces/BodyBit.md)
- [Gap](interfaces/Gap.md)
- [Select](interfaces/Select.md)
- [SelectOption](interfaces/SelectOption.md)
- [Highlight](interfaces/Highlight.md)
- [HighlightText](interfaces/HighlightText.md)
- [FooterText](interfaces/FooterText.md)
- [Resource](interfaces/Resource.md)
- [ImageResource](interfaces/ImageResource.md)
- [ImageLinkResource](interfaces/ImageLinkResource.md)
- [AudioResource](interfaces/AudioResource.md)
- [AudioEmbedResource](interfaces/AudioEmbedResource.md)
- [AudioLinkResource](interfaces/AudioLinkResource.md)
- [VideoResource](interfaces/VideoResource.md)
- [VideoEmbedResource](interfaces/VideoEmbedResource.md)
- [VideoLinkResource](interfaces/VideoLinkResource.md)
- [StillImageFilmResource](interfaces/StillImageFilmResource.md)
- [StillImageFilmEmbedResource](interfaces/StillImageFilmEmbedResource.md)
- [StillImageFilmLinkResource](interfaces/StillImageFilmLinkResource.md)
- [ArticleResource](interfaces/ArticleResource.md)
- [DocumentResource](interfaces/DocumentResource.md)
- [DocumentEmbedResource](interfaces/DocumentEmbedResource.md)
- [DocumentLinkResource](interfaces/DocumentLinkResource.md)
- [DocumentDownloadResource](interfaces/DocumentDownloadResource.md)
- [AppLinkResource](interfaces/AppLinkResource.md)
- [WebsiteLinkResource](interfaces/WebsiteLinkResource.md)
- [BitJson](interfaces/BitJson.md)
- [StatementJson](interfaces/StatementJson.md)
- [ChoiceJson](interfaces/ChoiceJson.md)
- [ResponseJson](interfaces/ResponseJson.md)
- [QuizJson](interfaces/QuizJson.md)
- [HeadingJson](interfaces/HeadingJson.md)
- [PairJson](interfaces/PairJson.md)
- [MatrixJson](interfaces/MatrixJson.md)
- [MatrixCellJson](interfaces/MatrixCellJson.md)
- [QuestionJson](interfaces/QuestionJson.md)
- [BitWrapperJson](interfaces/BitWrapperJson.md)
- [BodyBitsJson](interfaces/BodyBitsJson.md)
- [GapJson](interfaces/GapJson.md)
- [SelectJson](interfaces/SelectJson.md)
- [SelectOptionJson](interfaces/SelectOptionJson.md)
- [HighlightJson](interfaces/HighlightJson.md)
- [HighlightTextJson](interfaces/HighlightTextJson.md)
- [ParserJson](interfaces/ParserJson.md)
- [ResourceWrapperJson](interfaces/ResourceWrapperJson.md)
- [ImageResourceWrapperJson](interfaces/ImageResourceWrapperJson.md)
- [ImageLinkResourceWrapperJson](interfaces/ImageLinkResourceWrapperJson.md)
- [AudioResourceWrapperJson](interfaces/AudioResourceWrapperJson.md)
- [AudioEmbedResourceWrapperJson](interfaces/AudioEmbedResourceWrapperJson.md)
- [AudioLinkResourceWrapperJson](interfaces/AudioLinkResourceWrapperJson.md)
- [VideoResourceWrapperJson](interfaces/VideoResourceWrapperJson.md)
- [VideoEmbedResourceWrapperJson](interfaces/VideoEmbedResourceWrapperJson.md)
- [VideoLinkResourceWrapperJson](interfaces/VideoLinkResourceWrapperJson.md)
- [StillImageFilmResourceWrapperJson](interfaces/StillImageFilmResourceWrapperJson.md)
- [StillImageFilmEmbedResourceWrapperJson](interfaces/StillImageFilmEmbedResourceWrapperJson.md)
- [StillImageFilmLinkResourceWrapperJson](interfaces/StillImageFilmLinkResourceWrapperJson.md)
- [ArticleResourceWrapperJson](interfaces/ArticleResourceWrapperJson.md)
- [DocumentResourceWrapperJson](interfaces/DocumentResourceWrapperJson.md)
- [DocumentEmbedResourceWrapperJson](interfaces/DocumentEmbedResourceWrapperJson.md)
- [DocumentLinkResourceWrapperJson](interfaces/DocumentLinkResourceWrapperJson.md)
- [DocumentDownloadResourceWrapperJson](interfaces/DocumentDownloadResourceWrapperJson.md)
- [AppLinkResourceWrapperJson](interfaces/AppLinkResourceWrapperJson.md)
- [WebsiteLinkResourceWrapperJson](interfaces/WebsiteLinkResourceWrapperJson.md)
- [ImageResourceJson](interfaces/ImageResourceJson.md)
- [ImageLinkResourceJson](interfaces/ImageLinkResourceJson.md)
- [AudioResourceJson](interfaces/AudioResourceJson.md)
- [AudioEmbedResourceJson](interfaces/AudioEmbedResourceJson.md)
- [AudioLinkResourceJson](interfaces/AudioLinkResourceJson.md)
- [VideoResourceJson](interfaces/VideoResourceJson.md)
- [VideoEmbedResourceJson](interfaces/VideoEmbedResourceJson.md)
- [VideoLinkResourceJson](interfaces/VideoLinkResourceJson.md)
- [StillImageFilmResourceJson](interfaces/StillImageFilmResourceJson.md)
- [StillImageFilmEmbedResourceJson](interfaces/StillImageFilmEmbedResourceJson.md)
- [StillImageFilmLinkResourceJson](interfaces/StillImageFilmLinkResourceJson.md)
- [ArticleResourceJson](interfaces/ArticleResourceJson.md)
- [DocumentResourceJson](interfaces/DocumentResourceJson.md)
- [DocumentEmbedResourceJson](interfaces/DocumentEmbedResourceJson.md)
- [DocumentLinkResourceJson](interfaces/DocumentLinkResourceJson.md)
- [DocumentDownloadResourceJson](interfaces/DocumentDownloadResourceJson.md)
- [AppLinkResourceJson](interfaces/AppLinkResourceJson.md)
- [WebsiteLinkResourceJson](interfaces/WebsiteLinkResourceJson.md)

### Type Aliases

- [OutputType](modules.md#OutputType)
- [NodeTypeType](modules.md#NodeTypeType)
- [Node](modules.md#Node)
- [Example](modules.md#Example)
- [Property](modules.md#Property)
- [Text](modules.md#Text)
- [TextAst](modules.md#TextAst)
- [BitTypeType](modules.md#BitTypeType)
- [BitmarkParserTypeType](modules.md#BitmarkParserTypeType)
- [BitmarkVersionType](modules.md#BitmarkVersionType)
- [CardSetVersionType](modules.md#CardSetVersionType)
- [ResourceTypeType](modules.md#ResourceTypeType)
- [TextFormatType](modules.md#TextFormatType)
- [BodyBitJson](modules.md#BodyBitJson)
- [ResourceDataJson](modules.md#ResourceDataJson)
- [ResourceJson](modules.md#ResourceJson)

### Variables

- [Output](modules.md#Output)
- [NodeType](modules.md#NodeType)
- [BitType](modules.md#BitType)
- [BitmarkParserType](modules.md#BitmarkParserType)
- [BitmarkVersion](modules.md#BitmarkVersion)
- [CardSetVersion](modules.md#CardSetVersion)
- [ResourceType](modules.md#ResourceType)
- [TextFormat](modules.md#TextFormat)

## Type Aliases

### OutputType

Ƭ **OutputType**: `EnumType`<typeof [`Output`](modules.md#Output)\>

#### Defined in

[BitmarkParserGenerator.ts:145](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L145)

___

### NodeTypeType

Ƭ **NodeTypeType**: `EnumType`<typeof [`NodeType`](modules.md#NodeType)\>

#### Defined in

[model/ast/NodeType.ts:250](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/NodeType.ts#L250)

___

### Node

Ƭ **Node**: `any`

#### Defined in

[model/ast/Nodes.ts:11](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L11)

___

### Example

Ƭ **Example**: `string` \| `boolean`

#### Defined in

[model/ast/Nodes.ts:114](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L114)

___

### Property

Ƭ **Property**: `string`[] \| `number`[] \| `boolean`[] \| `unknown`[]

#### Defined in

[model/ast/Nodes.ts:122](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/Nodes.ts#L122)

___

### Text

Ƭ **Text**: `string` \| [`TextAst`](modules.md#TextAst)

#### Defined in

[model/ast/TextNodes.ts:4](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/TextNodes.ts#L4)

___

### TextAst

Ƭ **TextAst**: `TextNode`[]

#### Defined in

[model/ast/TextNodes.ts:6](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/TextNodes.ts#L6)

___

### BitTypeType

Ƭ **BitTypeType**: `EnumType`<typeof [`BitType`](modules.md#BitType)\>

#### Defined in

[model/enum/BitType.ts:235](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/BitType.ts#L235)

___

### BitmarkParserTypeType

Ƭ **BitmarkParserTypeType**: `EnumType`<typeof [`BitmarkParserType`](modules.md#BitmarkParserType)\>

#### Defined in

[model/enum/BitmarkParserType.ts:8](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/BitmarkParserType.ts#L8)

___

### BitmarkVersionType

Ƭ **BitmarkVersionType**: `EnumType`<typeof [`BitmarkVersion`](modules.md#BitmarkVersion)\>

#### Defined in

[model/enum/BitmarkVersion.ts:8](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/BitmarkVersion.ts#L8)

___

### CardSetVersionType

Ƭ **CardSetVersionType**: `EnumType`<typeof [`CardSetVersion`](modules.md#CardSetVersion)\>

#### Defined in

[model/enum/CardSetVersion.ts:8](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/CardSetVersion.ts#L8)

___

### ResourceTypeType

Ƭ **ResourceTypeType**: `EnumType`<typeof [`ResourceType`](modules.md#ResourceType)\>

#### Defined in

[model/enum/ResourceType.ts:32](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/ResourceType.ts#L32)

___

### TextFormatType

Ƭ **TextFormatType**: `EnumType`<typeof [`TextFormat`](modules.md#TextFormat)\>

#### Defined in

[model/enum/TextFormat.ts:9](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/TextFormat.ts#L9)

___

### BodyBitJson

Ƭ **BodyBitJson**: [`GapJson`](interfaces/GapJson.md) \| [`SelectJson`](interfaces/SelectJson.md) \| [`HighlightJson`](interfaces/HighlightJson.md)

#### Defined in

[model/json/BodyBitJson.ts:7](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/json/BodyBitJson.ts#L7)

___

### ResourceDataJson

Ƭ **ResourceDataJson**: [`ImageResourceJson`](interfaces/ImageResourceJson.md) & [`ImageLinkResourceJson`](interfaces/ImageLinkResourceJson.md) & [`AudioResourceJson`](interfaces/AudioResourceJson.md) & [`AudioEmbedResourceJson`](interfaces/AudioEmbedResourceJson.md) & [`AudioLinkResourceJson`](interfaces/AudioLinkResourceJson.md) & [`VideoResourceJson`](interfaces/VideoResourceJson.md) & [`VideoEmbedResourceJson`](interfaces/VideoEmbedResourceJson.md) & [`VideoLinkResourceJson`](interfaces/VideoLinkResourceJson.md) & [`StillImageFilmResourceJson`](interfaces/StillImageFilmResourceJson.md) & [`StillImageFilmEmbedResourceJson`](interfaces/StillImageFilmEmbedResourceJson.md) & [`StillImageFilmLinkResourceJson`](interfaces/StillImageFilmLinkResourceJson.md) & [`ArticleResourceJson`](interfaces/ArticleResourceJson.md) & [`DocumentResourceJson`](interfaces/DocumentResourceJson.md) & [`DocumentEmbedResourceJson`](interfaces/DocumentEmbedResourceJson.md) & [`DocumentLinkResourceJson`](interfaces/DocumentLinkResourceJson.md) & [`DocumentDownloadResourceJson`](interfaces/DocumentDownloadResourceJson.md) & [`AppLinkResourceJson`](interfaces/AppLinkResourceJson.md) & [`WebsiteLinkResourceJson`](interfaces/WebsiteLinkResourceJson.md)

#### Defined in

[model/json/ResourceJson.ts:3](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/json/ResourceJson.ts#L3)

___

### ResourceJson

Ƭ **ResourceJson**: [`ImageResourceWrapperJson`](interfaces/ImageResourceWrapperJson.md) \| [`ImageLinkResourceWrapperJson`](interfaces/ImageLinkResourceWrapperJson.md) \| [`AudioResourceWrapperJson`](interfaces/AudioResourceWrapperJson.md) \| [`AudioEmbedResourceWrapperJson`](interfaces/AudioEmbedResourceWrapperJson.md) \| [`AudioLinkResourceWrapperJson`](interfaces/AudioLinkResourceWrapperJson.md) \| [`VideoResourceWrapperJson`](interfaces/VideoResourceWrapperJson.md) \| [`VideoEmbedResourceWrapperJson`](interfaces/VideoEmbedResourceWrapperJson.md) \| [`VideoLinkResourceWrapperJson`](interfaces/VideoLinkResourceWrapperJson.md) \| [`StillImageFilmResourceWrapperJson`](interfaces/StillImageFilmResourceWrapperJson.md) \| [`StillImageFilmEmbedResourceWrapperJson`](interfaces/StillImageFilmEmbedResourceWrapperJson.md) \| [`StillImageFilmLinkResourceWrapperJson`](interfaces/StillImageFilmLinkResourceWrapperJson.md) \| [`ArticleResourceWrapperJson`](interfaces/ArticleResourceWrapperJson.md) \| [`DocumentResourceWrapperJson`](interfaces/DocumentResourceWrapperJson.md) \| [`DocumentEmbedResourceWrapperJson`](interfaces/DocumentEmbedResourceWrapperJson.md) \| [`DocumentLinkResourceWrapperJson`](interfaces/DocumentLinkResourceWrapperJson.md) \| [`DocumentDownloadResourceWrapperJson`](interfaces/DocumentDownloadResourceWrapperJson.md) \| [`AppLinkResourceWrapperJson`](interfaces/AppLinkResourceWrapperJson.md) \| [`WebsiteLinkResourceWrapperJson`](interfaces/WebsiteLinkResourceWrapperJson.md)

#### Defined in

[model/json/ResourceJson.ts:22](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/json/ResourceJson.ts#L22)

## Variables

### Output

• `Const` **Output**: `Readonly`<{ `bitmark`: ``"bitmark"`` = 'bitmark'; `json`: ``"json"`` = 'json'; `ast`: ``"ast"`` = 'ast' }\> & `EnumExtensions`<`EnumType`<{ `bitmark`: ``"bitmark"`` = 'bitmark'; `json`: ``"json"`` = 'json'; `ast`: ``"ast"`` = 'ast' }\>\>

Output type enumeration

#### Defined in

[BitmarkParserGenerator.ts:130](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/BitmarkParserGenerator.ts#L130)

___

### NodeType

• `Const` **NodeType**: `Readonly`<{ `unknown`: ``"unknown"`` = 'unknown'; `bitmarkAst`: ``"bitmarkAst"`` = 'bitmarkAst'; `bits`: ``"bits"`` = 'bits'; `bitsValue`: ``"bitsValue"`` = 'bitsValue'; `properties`: ``"properties"`` = 'properties'; `property`: ``"property"`` = 'property'; `propertyValues`: ``"propertyValues"`` = 'propertyValues'; `itemLead`: ``"itemLead"`` = 'itemLead'; `body`: ``"body"`` = 'body'; `bodyParts`: ``"bodyParts"`` = 'bodyParts'; `bodyPartsValue`: ``"bodyPartsValue"`` = 'bodyPartsValue'; `bodyPartText`: ``"bodyPartText"`` = 'bodyPartText'; `data`: ``"data"`` = 'data'; `bodyText`: ``"bodyText"`` = 'bodyText'; `footer`: ``"footer"`` = 'footer'; `footerText`: ``"footerText"`` = 'footerText'; `gap`: ``"gap"`` = 'gap'; `select`: ``"select"`` = 'select'; `highlight`: ``"highlight"`` = 'highlight'; `cardNode`: ``"cardNode"`` = 'cardNode'; `elements`: ``"elements"`` = 'elements'; `solutions`: ``"solutions"`` = 'solutions'; `options`: ``"options"`` = 'options'; `optionsValue`: ``"optionsValue"`` = 'optionsValue'; `texts`: ``"texts"`` = 'texts'; `textsValue`: ``"textsValue"`` = 'textsValue'; `statement`: ``"statement"`` = 'statement'; `statements`: ``"statements"`` = 'statements'; `statementsValue`: ``"statementsValue"`` = 'statementsValue'; `choices`: ``"choices"`` = 'choices'; `choicesValue`: ``"choicesValue"`` = 'choicesValue'; `responses`: ``"responses"`` = 'responses'; `responsesValue`: ``"responsesValue"`` = 'responsesValue'; `quizzes`: ``"quizzes"`` = 'quizzes'; `quizzesValue`: ``"quizzesValue"`` = 'quizzesValue'; `heading`: ``"heading"`` = 'heading'; `forValues`: ``"forValues"`` = 'forValues'; `pairs`: ``"pairs"`` = 'pairs'; `pairsValue`: ``"pairsValue"`` = 'pairsValue'; `values`: ``"values"`` = 'values'; `matrix`: ``"matrix"`` = 'matrix'; `matrixValue`: ``"matrixValue"`` = 'matrixValue'; `cells`: ``"cells"`` = 'cells'; `cellsValue`: ``"cellsValue"`` = 'cellsValue'; `questions`: ``"questions"`` = 'questions'; `questionsValue`: ``"questionsValue"`` = 'questionsValue'; `botResponses`: ``"botResponses"`` = 'botResponses'; `botResponsesValue`: ``"botResponsesValue"`` = 'botResponsesValue'; `markup`: ``"markup"`` = 'markup'; `bitType`: ``"bitType"`` = 'bitType'; `textFormat`: ``"textFormat"`` = 'textFormat'; `id`: ``"id"`` = 'id'; `idValue`: ``"idValue"`` = 'idValue'; `externalId`: ``"externalId"`` = 'externalId'; `externalIdValue`: ``"externalIdValue"`` = 'externalIdValue'; `spaceId`: ``"spaceId"`` = 'spaceId'; `spaceIdValue`: ``"spaceIdValue"`` = 'spaceIdValue'; `releaseVersion`: ``"releaseVersion"`` = 'releaseVersion'; `releaseVersionValue`: ``"releaseVersionValue"`` = 'releaseVersionValue'; `padletId`: ``"padletId"`` = 'padletId'; `padletIdValue`: ``"padletIdValue"`` = 'padletIdValue'; `aiGenerated`: ``"aiGenerated"`` = 'aiGenerated'; `aiGeneratedValue`: ``"aiGeneratedValue"`` = 'aiGeneratedValue'; `ageRange`: ``"ageRange"`` = 'ageRange'; `ageRangeValue`: ``"ageRangeValue"`` = 'ageRangeValue'; `language`: ``"language"`` = 'language'; `languageValue`: ``"languageValue"`` = 'languageValue'; `computerLanguage`: ``"computerLanguage"`` = 'computerLanguage'; `computerLanguageValue`: ``"computerLanguageValue"`` = 'computerLanguageValue'; `subtype`: ``"subtype"`` = 'subtype'; `subtypeValue`: ``"subtypeValue"`` = 'subtypeValue'; `coverImage`: ``"coverImage"`` = 'coverImage'; `coverImageValue`: ``"coverImageValue"`` = 'coverImageValue'; `publisher`: ``"publisher"`` = 'publisher'; `publisherValue`: ``"publisherValue"`` = 'publisherValue'; `publications`: ``"publications"`` = 'publications'; `publicationsValue`: ``"publicationsValue"`` = 'publicationsValue'; `author`: ``"author"`` = 'author'; `authorValue`: ``"authorValue"`` = 'authorValue'; `subject`: ``"subject"`` = 'subject'; `subjectValue`: ``"subjectValue"`` = 'subjectValue'; `date`: ``"date"`` = 'date'; `dateValue`: ``"dateValue"`` = 'dateValue'; `location`: ``"location"`` = 'location'; `locationValue`: ``"locationValue"`` = 'locationValue'; `theme`: ``"theme"`` = 'theme'; `themeValue`: ``"themeValue"`` = 'themeValue'; `kind`: ``"kind"`` = 'kind'; `kindValue`: ``"kindValue"`` = 'kindValue'; `action`: ``"action"`` = 'action'; `actionValue`: ``"actionValue"`` = 'actionValue'; `thumbImage`: ``"thumbImage"`` = 'thumbImage'; `thumbImageValue`: ``"thumbImageValue"`` = 'thumbImageValue'; `focusX`: ``"focusX"`` = 'focusX'; `focusXValue`: ``"focusXValue"`` = 'focusXValue'; `focusY`: ``"focusY"`` = 'focusY'; `focusYValue`: ``"focusYValue"`` = 'focusYValue'; `duration`: ``"duration"`` = 'duration'; `durationValue`: ``"durationValue"`` = 'durationValue'; `deeplink`: ``"deeplink"`` = 'deeplink'; `deeplinkValue`: ``"deeplinkValue"`` = 'deeplinkValue'; `externalLink`: ``"externalLink"`` = 'externalLink'; `externalLinkText`: ``"externalLinkText"`` = 'externalLinkText'; `videoCallLink`: ``"videoCallLink"`` = 'videoCallLink'; `videoCallLinkValue`: ``"videoCallLinkValue"`` = 'videoCallLinkValue'; `bot`: ``"bot"`` = 'bot'; `botValue`: ``"botValue"`` = 'botValue'; `referenceProperty`: ``"referenceProperty"`` = 'referenceProperty'; `referencePropertyValue`: ``"referencePropertyValue"`` = 'referencePropertyValue'; `list`: ``"list"`` = 'list'; `listValue`: ``"listValue"`` = 'listValue'; `textReference`: ``"textReference"`` = 'textReference'; `textReferenceValue`: ``"textReferenceValue"`` = 'textReferenceValue'; `isTracked`: ``"isTracked"`` = 'isTracked'; `isTrackedValue`: ``"isTrackedValue"`` = 'isTrackedValue'; `isInfoOnly`: ``"isInfoOnly"`` = 'isInfoOnly'; `isInfoOnlyValue`: ``"isInfoOnlyValue"`` = 'isInfoOnlyValue'; `labelTrue`: ``"labelTrue"`` = 'labelTrue'; `labelFalse`: ``"labelFalse"`` = 'labelFalse'; `quotedPerson`: ``"quotedPerson"`` = 'quotedPerson'; `partialAnswer`: ``"partialAnswer"`` = 'partialAnswer'; `partialAnswerValue`: ``"partialAnswerValue"`` = 'partialAnswerValue'; `book`: ``"book"`` = 'book'; `item`: ``"item"`` = 'item'; `lead`: ``"lead"`` = 'lead'; `hint`: ``"hint"`` = 'hint'; `instruction`: ``"instruction"`` = 'instruction'; `example`: ``"example"`` = 'example'; `exampleValue`: ``"exampleValue"`` = 'exampleValue'; `isExample`: ``"isExample"`` = 'isExample'; `extraProperties`: ``"extraProperties"`` = 'extraProperties'; `title`: ``"title"`` = 'title'; `subtitle`: ``"subtitle"`` = 'subtitle'; `level`: ``"level"`` = 'level'; `toc`: ``"toc"`` = 'toc'; `tocValue`: ``"tocValue"`` = 'tocValue'; `progress`: ``"progress"`` = 'progress'; `progressValue`: ``"progressValue"`` = 'progressValue'; `levelProperty`: ``"levelProperty"`` = 'levelProperty'; `levelPropertyValue`: ``"LevelPropertyValue"`` = 'LevelPropertyValue'; `anchor`: ``"anchor"`` = 'anchor'; `reference`: ``"reference"`` = 'reference'; `referenceEnd`: ``"referenceEnd"`` = 'referenceEnd'; `elementsValue`: ``"elementsValue"`` = 'elementsValue'; `solutionsValue`: ``"solutionsValue"`` = 'solutionsValue'; `prefix`: ``"prefix"`` = 'prefix'; `postfix`: ``"postfix"`` = 'postfix'; `isCaseSensitive`: ``"isCaseSensitive"`` = 'isCaseSensitive'; `isShortAnswer`: ``"isShortAnswer"`` = 'isShortAnswer'; `isCorrect`: ``"isCorrect"`` = 'isCorrect'; `forKeys`: ``"forKeys"`` = 'forKeys'; `forValuesValue`: ``"forValuesValue"`` = 'forValuesValue'; `key`: ``"key"`` = 'key'; `valuesValue`: ``"valuesValue"`` = 'valuesValue'; `question`: ``"question"`` = 'question'; `sampleSolution`: ``"sampleSolution"`` = 'sampleSolution'; `sampleSolutionValue`: ``"sampleSolutionValue"`` = 'sampleSolutionValue'; `statementText`: ``"statementText"`` = 'statementText'; `text`: ``"text"`` = 'text'; `propertyKey`: ``"propertyKey"`` = 'propertyKey'; `propertyValue`: ``"propertyValue"`` = 'propertyValue'; `keyAudio`: ``"keyAudio"`` = 'keyAudio'; `keyImage`: ``"keyImage"`` = 'keyImage'; `response`: ``"response"`` = 'response'; `reaction`: ``"reaction"`` = 'reaction'; `feedback`: ``"feedback"`` = 'feedback'; `partner`: ``"partner"`` = 'partner'; `name`: ``"name"`` = 'name'; `avatarImage`: ``"avatarImage"`` = 'avatarImage'; `resource`: ``"resource"`` = 'resource'; `resourceType`: ``"resourceType"`` = 'resourceType'; `image`: ``"image"`` = 'image'; `audio`: ``"audio"`` = 'audio'; `type`: ``"type"`` = 'type'; `format`: ``"format"`` = 'format'; `value`: ``"value"`` = 'value'; `url`: ``"url"`` = 'url'; `src`: ``"src"`` = 'src'; `src1x`: ``"src1x"`` = 'src1x'; `src2x`: ``"src2x"`` = 'src2x'; `src3x`: ``"src3x"`` = 'src3x'; `src4x`: ``"src4x"`` = 'src4x'; `width`: ``"width"`` = 'width'; `height`: ``"height"`` = 'height'; `alt`: ``"alt"`` = 'alt'; `license`: ``"license"`` = 'license'; `copyright`: ``"copyright"`` = 'copyright'; `provider`: ``"provider"`` = 'provider'; `showInIndex`: ``"showInIndex"`` = 'showInIndex'; `caption`: ``"caption"`` = 'caption'; `posterImage`: ``"posterImage"`` = 'posterImage'; `thumbnails`: ``"thumbnails"`` = 'thumbnails'; `thumbnailsValue`: ``"thumbnailsValue"`` = 'thumbnailsValue'; `textAst`: ``"textAst"`` = 'textAst'; `textAstValue`: ``"textAstValue"`` = 'textAstValue'; `content`: ``"contentValue"`` = 'contentValue'; `contentValue`: ``"contentValue"`` = 'contentValue'; `contentValueValue`: ``"contentValueValue"`` = 'contentValueValue'; `attrs`: ``"attrs"`` = 'attrs'; `section`: ``"section"`` = 'section'; `parent`: ``"parent"`` = 'parent'; `marks`: ``"marks"`` = 'marks'; `marksValue`: ``"marksValue"`` = 'marksValue'; `comment`: ``"comment"`` = 'comment'; `parser`: ``"parser"`` = 'parser'; `version`: ``"version"`` = 'version'; `bitmarkVersion`: ``"bitmarkVersion"`` = 'bitmarkVersion'; `warnings`: ``"warnings"`` = 'warnings'; `warningsValue`: ``"warningsValue"`` = 'warningsValue'; `errors`: ``"errors"`` = 'errors'; `errorsValue`: ``"errorsValue"`` = 'errorsValue'; `message`: ``"message"`` = 'message'; `start`: ``"start"`` = 'start'; `end`: ``"end"`` = 'end'; `offset`: ``"offset"`` = 'offset'; `line`: ``"line"`` = 'line'; `column`: ``"column"`` = 'column' }\> & `EnumExtensions`<`EnumType`<{ `unknown`: ``"unknown"`` = 'unknown'; `bitmarkAst`: ``"bitmarkAst"`` = 'bitmarkAst'; `bits`: ``"bits"`` = 'bits'; `bitsValue`: ``"bitsValue"`` = 'bitsValue'; `properties`: ``"properties"`` = 'properties'; `property`: ``"property"`` = 'property'; `propertyValues`: ``"propertyValues"`` = 'propertyValues'; `itemLead`: ``"itemLead"`` = 'itemLead'; `body`: ``"body"`` = 'body'; `bodyParts`: ``"bodyParts"`` = 'bodyParts'; `bodyPartsValue`: ``"bodyPartsValue"`` = 'bodyPartsValue'; `bodyPartText`: ``"bodyPartText"`` = 'bodyPartText'; `data`: ``"data"`` = 'data'; `bodyText`: ``"bodyText"`` = 'bodyText'; `footer`: ``"footer"`` = 'footer'; `footerText`: ``"footerText"`` = 'footerText'; `gap`: ``"gap"`` = 'gap'; `select`: ``"select"`` = 'select'; `highlight`: ``"highlight"`` = 'highlight'; `cardNode`: ``"cardNode"`` = 'cardNode'; `elements`: ``"elements"`` = 'elements'; `solutions`: ``"solutions"`` = 'solutions'; `options`: ``"options"`` = 'options'; `optionsValue`: ``"optionsValue"`` = 'optionsValue'; `texts`: ``"texts"`` = 'texts'; `textsValue`: ``"textsValue"`` = 'textsValue'; `statement`: ``"statement"`` = 'statement'; `statements`: ``"statements"`` = 'statements'; `statementsValue`: ``"statementsValue"`` = 'statementsValue'; `choices`: ``"choices"`` = 'choices'; `choicesValue`: ``"choicesValue"`` = 'choicesValue'; `responses`: ``"responses"`` = 'responses'; `responsesValue`: ``"responsesValue"`` = 'responsesValue'; `quizzes`: ``"quizzes"`` = 'quizzes'; `quizzesValue`: ``"quizzesValue"`` = 'quizzesValue'; `heading`: ``"heading"`` = 'heading'; `forValues`: ``"forValues"`` = 'forValues'; `pairs`: ``"pairs"`` = 'pairs'; `pairsValue`: ``"pairsValue"`` = 'pairsValue'; `values`: ``"values"`` = 'values'; `matrix`: ``"matrix"`` = 'matrix'; `matrixValue`: ``"matrixValue"`` = 'matrixValue'; `cells`: ``"cells"`` = 'cells'; `cellsValue`: ``"cellsValue"`` = 'cellsValue'; `questions`: ``"questions"`` = 'questions'; `questionsValue`: ``"questionsValue"`` = 'questionsValue'; `botResponses`: ``"botResponses"`` = 'botResponses'; `botResponsesValue`: ``"botResponsesValue"`` = 'botResponsesValue'; `markup`: ``"markup"`` = 'markup'; `bitType`: ``"bitType"`` = 'bitType'; `textFormat`: ``"textFormat"`` = 'textFormat'; `id`: ``"id"`` = 'id'; `idValue`: ``"idValue"`` = 'idValue'; `externalId`: ``"externalId"`` = 'externalId'; `externalIdValue`: ``"externalIdValue"`` = 'externalIdValue'; `spaceId`: ``"spaceId"`` = 'spaceId'; `spaceIdValue`: ``"spaceIdValue"`` = 'spaceIdValue'; `releaseVersion`: ``"releaseVersion"`` = 'releaseVersion'; `releaseVersionValue`: ``"releaseVersionValue"`` = 'releaseVersionValue'; `padletId`: ``"padletId"`` = 'padletId'; `padletIdValue`: ``"padletIdValue"`` = 'padletIdValue'; `aiGenerated`: ``"aiGenerated"`` = 'aiGenerated'; `aiGeneratedValue`: ``"aiGeneratedValue"`` = 'aiGeneratedValue'; `ageRange`: ``"ageRange"`` = 'ageRange'; `ageRangeValue`: ``"ageRangeValue"`` = 'ageRangeValue'; `language`: ``"language"`` = 'language'; `languageValue`: ``"languageValue"`` = 'languageValue'; `computerLanguage`: ``"computerLanguage"`` = 'computerLanguage'; `computerLanguageValue`: ``"computerLanguageValue"`` = 'computerLanguageValue'; `subtype`: ``"subtype"`` = 'subtype'; `subtypeValue`: ``"subtypeValue"`` = 'subtypeValue'; `coverImage`: ``"coverImage"`` = 'coverImage'; `coverImageValue`: ``"coverImageValue"`` = 'coverImageValue'; `publisher`: ``"publisher"`` = 'publisher'; `publisherValue`: ``"publisherValue"`` = 'publisherValue'; `publications`: ``"publications"`` = 'publications'; `publicationsValue`: ``"publicationsValue"`` = 'publicationsValue'; `author`: ``"author"`` = 'author'; `authorValue`: ``"authorValue"`` = 'authorValue'; `subject`: ``"subject"`` = 'subject'; `subjectValue`: ``"subjectValue"`` = 'subjectValue'; `date`: ``"date"`` = 'date'; `dateValue`: ``"dateValue"`` = 'dateValue'; `location`: ``"location"`` = 'location'; `locationValue`: ``"locationValue"`` = 'locationValue'; `theme`: ``"theme"`` = 'theme'; `themeValue`: ``"themeValue"`` = 'themeValue'; `kind`: ``"kind"`` = 'kind'; `kindValue`: ``"kindValue"`` = 'kindValue'; `action`: ``"action"`` = 'action'; `actionValue`: ``"actionValue"`` = 'actionValue'; `thumbImage`: ``"thumbImage"`` = 'thumbImage'; `thumbImageValue`: ``"thumbImageValue"`` = 'thumbImageValue'; `focusX`: ``"focusX"`` = 'focusX'; `focusXValue`: ``"focusXValue"`` = 'focusXValue'; `focusY`: ``"focusY"`` = 'focusY'; `focusYValue`: ``"focusYValue"`` = 'focusYValue'; `duration`: ``"duration"`` = 'duration'; `durationValue`: ``"durationValue"`` = 'durationValue'; `deeplink`: ``"deeplink"`` = 'deeplink'; `deeplinkValue`: ``"deeplinkValue"`` = 'deeplinkValue'; `externalLink`: ``"externalLink"`` = 'externalLink'; `externalLinkText`: ``"externalLinkText"`` = 'externalLinkText'; `videoCallLink`: ``"videoCallLink"`` = 'videoCallLink'; `videoCallLinkValue`: ``"videoCallLinkValue"`` = 'videoCallLinkValue'; `bot`: ``"bot"`` = 'bot'; `botValue`: ``"botValue"`` = 'botValue'; `referenceProperty`: ``"referenceProperty"`` = 'referenceProperty'; `referencePropertyValue`: ``"referencePropertyValue"`` = 'referencePropertyValue'; `list`: ``"list"`` = 'list'; `listValue`: ``"listValue"`` = 'listValue'; `textReference`: ``"textReference"`` = 'textReference'; `textReferenceValue`: ``"textReferenceValue"`` = 'textReferenceValue'; `isTracked`: ``"isTracked"`` = 'isTracked'; `isTrackedValue`: ``"isTrackedValue"`` = 'isTrackedValue'; `isInfoOnly`: ``"isInfoOnly"`` = 'isInfoOnly'; `isInfoOnlyValue`: ``"isInfoOnlyValue"`` = 'isInfoOnlyValue'; `labelTrue`: ``"labelTrue"`` = 'labelTrue'; `labelFalse`: ``"labelFalse"`` = 'labelFalse'; `quotedPerson`: ``"quotedPerson"`` = 'quotedPerson'; `partialAnswer`: ``"partialAnswer"`` = 'partialAnswer'; `partialAnswerValue`: ``"partialAnswerValue"`` = 'partialAnswerValue'; `book`: ``"book"`` = 'book'; `item`: ``"item"`` = 'item'; `lead`: ``"lead"`` = 'lead'; `hint`: ``"hint"`` = 'hint'; `instruction`: ``"instruction"`` = 'instruction'; `example`: ``"example"`` = 'example'; `exampleValue`: ``"exampleValue"`` = 'exampleValue'; `isExample`: ``"isExample"`` = 'isExample'; `extraProperties`: ``"extraProperties"`` = 'extraProperties'; `title`: ``"title"`` = 'title'; `subtitle`: ``"subtitle"`` = 'subtitle'; `level`: ``"level"`` = 'level'; `toc`: ``"toc"`` = 'toc'; `tocValue`: ``"tocValue"`` = 'tocValue'; `progress`: ``"progress"`` = 'progress'; `progressValue`: ``"progressValue"`` = 'progressValue'; `levelProperty`: ``"levelProperty"`` = 'levelProperty'; `levelPropertyValue`: ``"LevelPropertyValue"`` = 'LevelPropertyValue'; `anchor`: ``"anchor"`` = 'anchor'; `reference`: ``"reference"`` = 'reference'; `referenceEnd`: ``"referenceEnd"`` = 'referenceEnd'; `elementsValue`: ``"elementsValue"`` = 'elementsValue'; `solutionsValue`: ``"solutionsValue"`` = 'solutionsValue'; `prefix`: ``"prefix"`` = 'prefix'; `postfix`: ``"postfix"`` = 'postfix'; `isCaseSensitive`: ``"isCaseSensitive"`` = 'isCaseSensitive'; `isShortAnswer`: ``"isShortAnswer"`` = 'isShortAnswer'; `isCorrect`: ``"isCorrect"`` = 'isCorrect'; `forKeys`: ``"forKeys"`` = 'forKeys'; `forValuesValue`: ``"forValuesValue"`` = 'forValuesValue'; `key`: ``"key"`` = 'key'; `valuesValue`: ``"valuesValue"`` = 'valuesValue'; `question`: ``"question"`` = 'question'; `sampleSolution`: ``"sampleSolution"`` = 'sampleSolution'; `sampleSolutionValue`: ``"sampleSolutionValue"`` = 'sampleSolutionValue'; `statementText`: ``"statementText"`` = 'statementText'; `text`: ``"text"`` = 'text'; `propertyKey`: ``"propertyKey"`` = 'propertyKey'; `propertyValue`: ``"propertyValue"`` = 'propertyValue'; `keyAudio`: ``"keyAudio"`` = 'keyAudio'; `keyImage`: ``"keyImage"`` = 'keyImage'; `response`: ``"response"`` = 'response'; `reaction`: ``"reaction"`` = 'reaction'; `feedback`: ``"feedback"`` = 'feedback'; `partner`: ``"partner"`` = 'partner'; `name`: ``"name"`` = 'name'; `avatarImage`: ``"avatarImage"`` = 'avatarImage'; `resource`: ``"resource"`` = 'resource'; `resourceType`: ``"resourceType"`` = 'resourceType'; `image`: ``"image"`` = 'image'; `audio`: ``"audio"`` = 'audio'; `type`: ``"type"`` = 'type'; `format`: ``"format"`` = 'format'; `value`: ``"value"`` = 'value'; `url`: ``"url"`` = 'url'; `src`: ``"src"`` = 'src'; `src1x`: ``"src1x"`` = 'src1x'; `src2x`: ``"src2x"`` = 'src2x'; `src3x`: ``"src3x"`` = 'src3x'; `src4x`: ``"src4x"`` = 'src4x'; `width`: ``"width"`` = 'width'; `height`: ``"height"`` = 'height'; `alt`: ``"alt"`` = 'alt'; `license`: ``"license"`` = 'license'; `copyright`: ``"copyright"`` = 'copyright'; `provider`: ``"provider"`` = 'provider'; `showInIndex`: ``"showInIndex"`` = 'showInIndex'; `caption`: ``"caption"`` = 'caption'; `posterImage`: ``"posterImage"`` = 'posterImage'; `thumbnails`: ``"thumbnails"`` = 'thumbnails'; `thumbnailsValue`: ``"thumbnailsValue"`` = 'thumbnailsValue'; `textAst`: ``"textAst"`` = 'textAst'; `textAstValue`: ``"textAstValue"`` = 'textAstValue'; `content`: ``"contentValue"`` = 'contentValue'; `contentValue`: ``"contentValue"`` = 'contentValue'; `contentValueValue`: ``"contentValueValue"`` = 'contentValueValue'; `attrs`: ``"attrs"`` = 'attrs'; `section`: ``"section"`` = 'section'; `parent`: ``"parent"`` = 'parent'; `marks`: ``"marks"`` = 'marks'; `marksValue`: ``"marksValue"`` = 'marksValue'; `comment`: ``"comment"`` = 'comment'; `parser`: ``"parser"`` = 'parser'; `version`: ``"version"`` = 'version'; `bitmarkVersion`: ``"bitmarkVersion"`` = 'bitmarkVersion'; `warnings`: ``"warnings"`` = 'warnings'; `warningsValue`: ``"warningsValue"`` = 'warningsValue'; `errors`: ``"errors"`` = 'errors'; `errorsValue`: ``"errorsValue"`` = 'errorsValue'; `message`: ``"message"`` = 'message'; `start`: ``"start"`` = 'start'; `end`: ``"end"`` = 'end'; `offset`: ``"offset"`` = 'offset'; `line`: ``"line"`` = 'line'; `column`: ``"column"`` = 'column' }\>\>

#### Defined in

[model/ast/NodeType.ts:7](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/ast/NodeType.ts#L7)

___

### BitType

• `Const` **BitType**: `Readonly`<{ `_error`: ``"_error"`` = '\_error'; `aiPrompt`: ``"ai-prompt"`` = 'ai-prompt'; `anchor`: ``"anchor"`` = 'anchor'; `appLink`: ``"app-link"`` = 'app-link'; `article`: ``"article"`` = 'article'; `articleAi`: ``"article-ai"`` = 'article-ai'; `articleAttachment`: ``"article-attachment"`` = 'article-attachment'; `articleEmbed`: ``"article-embed"`` = 'article-embed'; `articleLink`: ``"article-link"`` = 'article-link'; `assignment`: ``"assignment"`` = 'assignment'; `audio`: ``"audio"`` = 'audio'; `audioEmbed`: ``"audio-embed"`` = 'audio-embed'; `audioLink`: ``"audio-link"`` = 'audio-link'; `bitAlias`: ``"bit-alias"`` = 'bit-alias'; `bitBookEnding`: ``"bit-book-ending"`` = 'bit-book-ending'; `bitBookSummary`: ``"bit-book-summary"`` = 'bit-book-summary'; `blogArticle`: ``"blog-article"`` = 'blog-article'; `book`: ``"book"`` = 'book'; `bookAcknowledgments`: ``"book-acknowledgments"`` = 'book-acknowledgments'; `bookAddendum`: ``"book-addendum"`` = 'book-addendum'; `bookAfterword`: ``"book-afterword"`` = 'book-afterword'; `bookAppendix`: ``"book-appendix"`` = 'book-appendix'; `bookArticle`: ``"book-article"`` = 'book-article'; `bookAutherBio`: ``"book-author-bio"`` = 'book-author-bio'; `bookBibliography`: ``"book-bibliography"`` = 'book-bibliography'; `bookComingSoon`: ``"book-coming-soon"`` = 'book-coming-soon'; `bookConclusion`: ``"book-conclusion"`` = 'book-conclusion'; `bookCopyright`: ``"book-copyright"`` = 'book-copyright'; `bookCopyrightPermissions`: ``"book-copyright-permissions"`` = 'book-copyright-permissions'; `bookDedication`: ``"book-dedication"`` = 'book-dedication'; `bookEndnotes`: ``"book-endnotes"`` = 'book-endnotes'; `bookEpigraph`: ``"book-epigraph"`` = 'book-epigraph'; `bookEpilogue`: ``"book-epilogue"`` = 'book-epilogue'; `bookForword`: ``"book-foreword"`` = 'book-foreword'; `bookFrontispiece`: ``"book-frontispiece"`` = 'book-frontispiece'; `bookImprint`: ``"book-imprint"`` = 'book-imprint'; `bookIncitingIncident`: ``"book-inciting-incident"`` = 'book-inciting-incident'; `bookIntroduction`: ``"book-introduction"`` = 'book-introduction'; `bookListOfContributors`: ``"book-list-of-contributors"`` = 'book-list-of-contributors'; `bookNotes`: ``"book-notes"`` = 'book-notes'; `bookPostscript`: ``"book-postscript"`` = 'book-postscript'; `bookPreface`: ``"book-preface"`` = 'book-preface'; `bookPrologue`: ``"book-prologue"`` = 'book-prologue'; `bookReadMore`: ``"book-read-more"`` = 'book-read-more'; `bookReferenceList`: ``"book-reference-list"`` = 'book-reference-list'; `bookRequestForABookReview`: ``"book-request-for-a-book-review"`` = 'book-request-for-a-book-review'; `bookSummary`: ``"book-summary"`` = 'book-summary'; `bookTeaser`: ``"book-teaser"`` = 'book-teaser'; `bookTitle`: ``"book-title"`` = 'book-title'; `botActionAnnounce`: ``"bot-action-announce"`` = 'bot-action-announce'; `botActionRatingNumber`: ``"bot-action-rating-number"`` = 'bot-action-rating-number'; `botActionRemind`: ``"bot-action-remind"`` = 'bot-action-remind'; `botActionResponse`: ``"bot-action-response"`` = 'bot-action-response'; `botActionSave`: ``"bot-action-save"`` = 'bot-action-save'; `botActionSend`: ``"bot-action-send"`` = 'bot-action-send'; `botActionTrueFalse`: ``"bot-action-true-false"`` = 'bot-action-true-false'; `botInterview`: ``"bot-interview"`` = 'bot-interview'; `browserImage`: ``"browser-image"`` = 'browser-image'; `bug`: ``"bug"`` = 'bug'; `card1`: ``"card-1"`` = 'card-1'; `chapter`: ``"chapter"`` = 'chapter'; `chapterSubjectMatter`: ``"chapter-subject-matter"`` = 'chapter-subject-matter'; `chat`: ``"chat"`` = 'chat'; `cloze`: ``"cloze"`` = 'cloze'; `clozeAndMultipleChoiceText`: ``"cloze-and-multiple-choice-text"`` = 'cloze-and-multiple-choice-text'; `clozeInstructionGrouped`: ``"cloze-instruction-grouped"`` = 'cloze-instruction-grouped'; `clozeSolutionGrouped`: ``"cloze-solution-grouped"`` = 'cloze-solution-grouped'; `code`: ``"code"`` = 'code'; `conclusion`: ``"conclusion"`` = 'conclusion'; `conversationLeft1`: ``"conversation-left-1"`` = 'conversation-left-1'; `conversationLeft1Scream`: ``"conversation-left-1-scream"`` = 'conversation-left-1-scream'; `conversationLeft1Thought`: ``"conversation-left-1-thought"`` = 'conversation-left-1-thought'; `conversationRight1`: ``"conversation-right-1"`` = 'conversation-right-1'; `conversationRight1Scream`: ``"conversation-right-1-scream"`` = 'conversation-right-1-scream'; `conversationRight1Thought`: ``"conversation-right-1-thought"`` = 'conversation-right-1-thought'; `correction`: ``"correction"`` = 'correction'; `danger`: ``"danger"`` = 'danger'; `details`: ``"details"`` = 'details'; `details1`: ``"details-1"`` = 'details-1'; `document`: ``"document"`` = 'document'; `documentDownload`: ``"document-download"`` = 'document-download'; `documentEmbed`: ``"document-embed"`` = 'document-embed'; `documentLink`: ``"document-link"`` = 'document-link'; `documentUpload`: ``"document-upload"`` = 'document-upload'; `editorial`: ``"editorial"`` = 'editorial'; `essay`: ``"essay"`` = 'essay'; `example`: ``"example"`` = 'example'; `featured`: ``"featured"`` = 'featured'; `flashcard`: ``"flashcard"`` = 'flashcard'; `flashcard1`: ``"flashcard-1"`` = 'flashcard-1'; `focusImage`: ``"focus-image"`` = 'focus-image'; `footNote`: ``"foot-note"`` = 'foot-note'; `groupBorn`: ``"group-born"`` = 'group-born'; `groupDied`: ``"group-died"`` = 'group-died'; `help`: ``"help"`` = 'help'; `highlightText`: ``"highlight-text"`` = 'highlight-text'; `hint`: ``"hint"`` = 'hint'; `image`: ``"image"`` = 'image'; `imageLink`: ``"image-link"`` = 'image-link'; `imagePrototype`: ``"image-prototype"`` = 'image-prototype'; `imageSuperWide`: ``"image-super-wide"`` = 'image-super-wide'; `imageZoom`: ``"image-zoom"`` = 'image-zoom'; `info`: ``"info"`` = 'info'; `internalLink`: ``"internal-link"`` = 'internal-link'; `interview`: ``"interview"`` = 'interview'; `interviewInstructionGrouped`: ``"interview-instruction-grouped"`` = 'interview-instruction-grouped'; `learningPathBook`: ``"learning-path-book"`` = 'learning-path-book'; `learningPathBotTraining`: ``"learning-path-bot-training"`` = 'learning-path-bot-training'; `learningPathClassroomEvent`: ``"learning-path-classroom-event"`` = 'learning-path-classroom-event'; `learningPathClassroomTraining`: ``"learning-path-classroom-training"`` = 'learning-path-classroom-training'; `learningPathClosing`: ``"learning-path-closing"`` = 'learning-path-closing'; `learningPathExternalLink`: ``"learning-path-external-link"`` = 'learning-path-external-link'; `learningPathFeedback`: ``"learning-path-feedback"`` = 'learning-path-feedback'; `learningPathLearningGoal`: ``"learning-path-learning-goal"`` = 'learning-path-learning-goal'; `learningPathLti`: ``"learning-path-lti"`` = 'learning-path-lti'; `learningPathSign`: ``"learning-path-sign"`` = 'learning-path-sign'; `learningPathStep`: ``"learning-path-step"`` = 'learning-path-step'; `learningPathVideoCall`: ``"learning-path-video-call"`` = 'learning-path-video-call'; `mark`: ``"mark"`` = 'mark'; `match`: ``"match"`` = 'match'; `matchAll`: ``"match-all"`` = 'match-all'; `matchAllReverse`: ``"match-all-reverse"`` = 'match-all-reverse'; `matchAudio`: ``"match-audio"`` = 'match-audio'; `matchMatrix`: ``"match-matrix"`` = 'match-matrix'; `matchPicture`: ``"match-picture"`` = 'match-picture'; `matchReverse`: ``"match-reverse"`` = 'match-reverse'; `matchSolutionGrouped`: ``"match-solution-grouped"`` = 'match-solution-grouped'; `message`: ``"message"`` = 'message'; `multipleChoice`: ``"multiple-choice"`` = 'multiple-choice'; `multipleChoice1`: ``"multiple-choice-1"`` = 'multiple-choice-1'; `multipleChoiceText`: ``"multiple-choice-text"`` = 'multiple-choice-text'; `multipleResponse`: ``"multiple-response"`` = 'multiple-response'; `multipleResponse1`: ``"multiple-response-1"`` = 'multiple-response-1'; `newspaperArticle`: ``"newspaper-article"`` = 'newspaper-article'; `note`: ``"note"`` = 'note'; `noteAi`: ``"note-ai"`` = 'note-ai'; `notebookArticle`: ``"notebook-article"`` = 'notebook-article'; `page`: ``"page"`` = 'page'; `photo`: ``"photo"`` = 'photo'; `preparationNote`: ``"preparation-note"`` = 'preparation-note'; `question1`: ``"question-1"`` = 'question-1'; `quote`: ``"quote"`` = 'quote'; `rating`: ``"rating"`` = 'rating'; `recordAudio`: ``"record-audio"`` = 'record-audio'; `releaseNote`: ``"release-note"`` = 'release-note'; `releaseNotesSummary`: ``"release-notes-summary"`` = 'release-notes-summary'; `remark`: ``"remark"`` = 'remark'; `sampleSolution`: ``"sample-solution"`` = 'sample-solution'; `screenshot`: ``"screenshot"`` = 'screenshot'; `selfAssessment`: ``"self-assessment"`` = 'self-assessment'; `sequence`: ``"sequence"`` = 'sequence'; `sideNote`: ``"side-note"`` = 'side-note'; `stickyNote`: ``"sticky-note"`` = 'sticky-note'; `stillImageFilm`: ``"still-image-film"`` = 'still-image-film'; `stillImageFilmEmbed`: ``"still-image-film-embed"`` = 'still-image-film-embed'; `stillImageFilmLink`: ``"still-image-film-link"`` = 'still-image-film-link'; `statement`: ``"statement"`` = 'statement'; `summary`: ``"summary"`` = 'summary'; `summaryAi`: ``"summary-ai"`` = 'summary-ai'; `survey`: ``"survey"`` = 'survey'; `survey1`: ``"survey-1"`` = 'survey-1'; `surveyAnonymous`: ``"survey-anonymous"`` = 'survey-anonymous'; `surveyAnonymous1`: ``"survey-anonymous-1"`` = 'survey-anonymous-1'; `takePicture`: ``"take-picture"`` = 'take-picture'; `toc`: ``"toc"`` = 'toc'; `trueFalse`: ``"true-false"`` = 'true-false'; `trueFalse1`: ``"true-false-1"`` = 'true-false-1'; `vendorPadletEmbed`: ``"vendor-padlet-embed"`` = 'vendor-padlet-embed'; `video`: ``"video"`` = 'video'; `videoEmbed`: ``"video-embed"`` = 'video-embed'; `videoLandscape`: ``"video-landscape"`` = 'video-landscape'; `videoLink`: ``"video-link"`` = 'video-link'; `videoPortrait`: ``"video-portrait"`` = 'video-portrait'; `warning`: ``"warning"`` = 'warning'; `websiteLink`: ``"website-link"`` = 'website-link'; `workbookArticle`: ``"workbook-article"`` = 'workbook-article' }\> & `EnumExtensions`<`EnumType`<{ `_error`: ``"_error"`` = '\_error'; `aiPrompt`: ``"ai-prompt"`` = 'ai-prompt'; `anchor`: ``"anchor"`` = 'anchor'; `appLink`: ``"app-link"`` = 'app-link'; `article`: ``"article"`` = 'article'; `articleAi`: ``"article-ai"`` = 'article-ai'; `articleAttachment`: ``"article-attachment"`` = 'article-attachment'; `articleEmbed`: ``"article-embed"`` = 'article-embed'; `articleLink`: ``"article-link"`` = 'article-link'; `assignment`: ``"assignment"`` = 'assignment'; `audio`: ``"audio"`` = 'audio'; `audioEmbed`: ``"audio-embed"`` = 'audio-embed'; `audioLink`: ``"audio-link"`` = 'audio-link'; `bitAlias`: ``"bit-alias"`` = 'bit-alias'; `bitBookEnding`: ``"bit-book-ending"`` = 'bit-book-ending'; `bitBookSummary`: ``"bit-book-summary"`` = 'bit-book-summary'; `blogArticle`: ``"blog-article"`` = 'blog-article'; `book`: ``"book"`` = 'book'; `bookAcknowledgments`: ``"book-acknowledgments"`` = 'book-acknowledgments'; `bookAddendum`: ``"book-addendum"`` = 'book-addendum'; `bookAfterword`: ``"book-afterword"`` = 'book-afterword'; `bookAppendix`: ``"book-appendix"`` = 'book-appendix'; `bookArticle`: ``"book-article"`` = 'book-article'; `bookAutherBio`: ``"book-author-bio"`` = 'book-author-bio'; `bookBibliography`: ``"book-bibliography"`` = 'book-bibliography'; `bookComingSoon`: ``"book-coming-soon"`` = 'book-coming-soon'; `bookConclusion`: ``"book-conclusion"`` = 'book-conclusion'; `bookCopyright`: ``"book-copyright"`` = 'book-copyright'; `bookCopyrightPermissions`: ``"book-copyright-permissions"`` = 'book-copyright-permissions'; `bookDedication`: ``"book-dedication"`` = 'book-dedication'; `bookEndnotes`: ``"book-endnotes"`` = 'book-endnotes'; `bookEpigraph`: ``"book-epigraph"`` = 'book-epigraph'; `bookEpilogue`: ``"book-epilogue"`` = 'book-epilogue'; `bookForword`: ``"book-foreword"`` = 'book-foreword'; `bookFrontispiece`: ``"book-frontispiece"`` = 'book-frontispiece'; `bookImprint`: ``"book-imprint"`` = 'book-imprint'; `bookIncitingIncident`: ``"book-inciting-incident"`` = 'book-inciting-incident'; `bookIntroduction`: ``"book-introduction"`` = 'book-introduction'; `bookListOfContributors`: ``"book-list-of-contributors"`` = 'book-list-of-contributors'; `bookNotes`: ``"book-notes"`` = 'book-notes'; `bookPostscript`: ``"book-postscript"`` = 'book-postscript'; `bookPreface`: ``"book-preface"`` = 'book-preface'; `bookPrologue`: ``"book-prologue"`` = 'book-prologue'; `bookReadMore`: ``"book-read-more"`` = 'book-read-more'; `bookReferenceList`: ``"book-reference-list"`` = 'book-reference-list'; `bookRequestForABookReview`: ``"book-request-for-a-book-review"`` = 'book-request-for-a-book-review'; `bookSummary`: ``"book-summary"`` = 'book-summary'; `bookTeaser`: ``"book-teaser"`` = 'book-teaser'; `bookTitle`: ``"book-title"`` = 'book-title'; `botActionAnnounce`: ``"bot-action-announce"`` = 'bot-action-announce'; `botActionRatingNumber`: ``"bot-action-rating-number"`` = 'bot-action-rating-number'; `botActionRemind`: ``"bot-action-remind"`` = 'bot-action-remind'; `botActionResponse`: ``"bot-action-response"`` = 'bot-action-response'; `botActionSave`: ``"bot-action-save"`` = 'bot-action-save'; `botActionSend`: ``"bot-action-send"`` = 'bot-action-send'; `botActionTrueFalse`: ``"bot-action-true-false"`` = 'bot-action-true-false'; `botInterview`: ``"bot-interview"`` = 'bot-interview'; `browserImage`: ``"browser-image"`` = 'browser-image'; `bug`: ``"bug"`` = 'bug'; `card1`: ``"card-1"`` = 'card-1'; `chapter`: ``"chapter"`` = 'chapter'; `chapterSubjectMatter`: ``"chapter-subject-matter"`` = 'chapter-subject-matter'; `chat`: ``"chat"`` = 'chat'; `cloze`: ``"cloze"`` = 'cloze'; `clozeAndMultipleChoiceText`: ``"cloze-and-multiple-choice-text"`` = 'cloze-and-multiple-choice-text'; `clozeInstructionGrouped`: ``"cloze-instruction-grouped"`` = 'cloze-instruction-grouped'; `clozeSolutionGrouped`: ``"cloze-solution-grouped"`` = 'cloze-solution-grouped'; `code`: ``"code"`` = 'code'; `conclusion`: ``"conclusion"`` = 'conclusion'; `conversationLeft1`: ``"conversation-left-1"`` = 'conversation-left-1'; `conversationLeft1Scream`: ``"conversation-left-1-scream"`` = 'conversation-left-1-scream'; `conversationLeft1Thought`: ``"conversation-left-1-thought"`` = 'conversation-left-1-thought'; `conversationRight1`: ``"conversation-right-1"`` = 'conversation-right-1'; `conversationRight1Scream`: ``"conversation-right-1-scream"`` = 'conversation-right-1-scream'; `conversationRight1Thought`: ``"conversation-right-1-thought"`` = 'conversation-right-1-thought'; `correction`: ``"correction"`` = 'correction'; `danger`: ``"danger"`` = 'danger'; `details`: ``"details"`` = 'details'; `details1`: ``"details-1"`` = 'details-1'; `document`: ``"document"`` = 'document'; `documentDownload`: ``"document-download"`` = 'document-download'; `documentEmbed`: ``"document-embed"`` = 'document-embed'; `documentLink`: ``"document-link"`` = 'document-link'; `documentUpload`: ``"document-upload"`` = 'document-upload'; `editorial`: ``"editorial"`` = 'editorial'; `essay`: ``"essay"`` = 'essay'; `example`: ``"example"`` = 'example'; `featured`: ``"featured"`` = 'featured'; `flashcard`: ``"flashcard"`` = 'flashcard'; `flashcard1`: ``"flashcard-1"`` = 'flashcard-1'; `focusImage`: ``"focus-image"`` = 'focus-image'; `footNote`: ``"foot-note"`` = 'foot-note'; `groupBorn`: ``"group-born"`` = 'group-born'; `groupDied`: ``"group-died"`` = 'group-died'; `help`: ``"help"`` = 'help'; `highlightText`: ``"highlight-text"`` = 'highlight-text'; `hint`: ``"hint"`` = 'hint'; `image`: ``"image"`` = 'image'; `imageLink`: ``"image-link"`` = 'image-link'; `imagePrototype`: ``"image-prototype"`` = 'image-prototype'; `imageSuperWide`: ``"image-super-wide"`` = 'image-super-wide'; `imageZoom`: ``"image-zoom"`` = 'image-zoom'; `info`: ``"info"`` = 'info'; `internalLink`: ``"internal-link"`` = 'internal-link'; `interview`: ``"interview"`` = 'interview'; `interviewInstructionGrouped`: ``"interview-instruction-grouped"`` = 'interview-instruction-grouped'; `learningPathBook`: ``"learning-path-book"`` = 'learning-path-book'; `learningPathBotTraining`: ``"learning-path-bot-training"`` = 'learning-path-bot-training'; `learningPathClassroomEvent`: ``"learning-path-classroom-event"`` = 'learning-path-classroom-event'; `learningPathClassroomTraining`: ``"learning-path-classroom-training"`` = 'learning-path-classroom-training'; `learningPathClosing`: ``"learning-path-closing"`` = 'learning-path-closing'; `learningPathExternalLink`: ``"learning-path-external-link"`` = 'learning-path-external-link'; `learningPathFeedback`: ``"learning-path-feedback"`` = 'learning-path-feedback'; `learningPathLearningGoal`: ``"learning-path-learning-goal"`` = 'learning-path-learning-goal'; `learningPathLti`: ``"learning-path-lti"`` = 'learning-path-lti'; `learningPathSign`: ``"learning-path-sign"`` = 'learning-path-sign'; `learningPathStep`: ``"learning-path-step"`` = 'learning-path-step'; `learningPathVideoCall`: ``"learning-path-video-call"`` = 'learning-path-video-call'; `mark`: ``"mark"`` = 'mark'; `match`: ``"match"`` = 'match'; `matchAll`: ``"match-all"`` = 'match-all'; `matchAllReverse`: ``"match-all-reverse"`` = 'match-all-reverse'; `matchAudio`: ``"match-audio"`` = 'match-audio'; `matchMatrix`: ``"match-matrix"`` = 'match-matrix'; `matchPicture`: ``"match-picture"`` = 'match-picture'; `matchReverse`: ``"match-reverse"`` = 'match-reverse'; `matchSolutionGrouped`: ``"match-solution-grouped"`` = 'match-solution-grouped'; `message`: ``"message"`` = 'message'; `multipleChoice`: ``"multiple-choice"`` = 'multiple-choice'; `multipleChoice1`: ``"multiple-choice-1"`` = 'multiple-choice-1'; `multipleChoiceText`: ``"multiple-choice-text"`` = 'multiple-choice-text'; `multipleResponse`: ``"multiple-response"`` = 'multiple-response'; `multipleResponse1`: ``"multiple-response-1"`` = 'multiple-response-1'; `newspaperArticle`: ``"newspaper-article"`` = 'newspaper-article'; `note`: ``"note"`` = 'note'; `noteAi`: ``"note-ai"`` = 'note-ai'; `notebookArticle`: ``"notebook-article"`` = 'notebook-article'; `page`: ``"page"`` = 'page'; `photo`: ``"photo"`` = 'photo'; `preparationNote`: ``"preparation-note"`` = 'preparation-note'; `question1`: ``"question-1"`` = 'question-1'; `quote`: ``"quote"`` = 'quote'; `rating`: ``"rating"`` = 'rating'; `recordAudio`: ``"record-audio"`` = 'record-audio'; `releaseNote`: ``"release-note"`` = 'release-note'; `releaseNotesSummary`: ``"release-notes-summary"`` = 'release-notes-summary'; `remark`: ``"remark"`` = 'remark'; `sampleSolution`: ``"sample-solution"`` = 'sample-solution'; `screenshot`: ``"screenshot"`` = 'screenshot'; `selfAssessment`: ``"self-assessment"`` = 'self-assessment'; `sequence`: ``"sequence"`` = 'sequence'; `sideNote`: ``"side-note"`` = 'side-note'; `stickyNote`: ``"sticky-note"`` = 'sticky-note'; `stillImageFilm`: ``"still-image-film"`` = 'still-image-film'; `stillImageFilmEmbed`: ``"still-image-film-embed"`` = 'still-image-film-embed'; `stillImageFilmLink`: ``"still-image-film-link"`` = 'still-image-film-link'; `statement`: ``"statement"`` = 'statement'; `summary`: ``"summary"`` = 'summary'; `summaryAi`: ``"summary-ai"`` = 'summary-ai'; `survey`: ``"survey"`` = 'survey'; `survey1`: ``"survey-1"`` = 'survey-1'; `surveyAnonymous`: ``"survey-anonymous"`` = 'survey-anonymous'; `surveyAnonymous1`: ``"survey-anonymous-1"`` = 'survey-anonymous-1'; `takePicture`: ``"take-picture"`` = 'take-picture'; `toc`: ``"toc"`` = 'toc'; `trueFalse`: ``"true-false"`` = 'true-false'; `trueFalse1`: ``"true-false-1"`` = 'true-false-1'; `vendorPadletEmbed`: ``"vendor-padlet-embed"`` = 'vendor-padlet-embed'; `video`: ``"video"`` = 'video'; `videoEmbed`: ``"video-embed"`` = 'video-embed'; `videoLandscape`: ``"video-landscape"`` = 'video-landscape'; `videoLink`: ``"video-link"`` = 'video-link'; `videoPortrait`: ``"video-portrait"`` = 'video-portrait'; `warning`: ``"warning"`` = 'warning'; `websiteLink`: ``"website-link"`` = 'website-link'; `workbookArticle`: ``"workbook-article"`` = 'workbook-article' }\>\>

#### Defined in

[model/enum/BitType.ts:55](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/BitType.ts#L55)

___

### BitmarkParserType

• `Const` **BitmarkParserType**: `Readonly`<{ `antlr`: ``"antlr"`` = 'antlr'; `peggy`: ``"peggy"`` = 'peggy' }\> & `EnumExtensions`<`EnumType`<{ `antlr`: ``"antlr"`` = 'antlr'; `peggy`: ``"peggy"`` = 'peggy' }\>\>

#### Defined in

[model/enum/BitmarkParserType.ts:3](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/BitmarkParserType.ts#L3)

___

### BitmarkVersion

• `Const` **BitmarkVersion**: `Readonly`<{ `v2`: ``2`` = 2; `v3`: ``3`` = 3 }\> & `EnumExtensions`<`EnumType`<{ `v2`: ``2`` = 2; `v3`: ``3`` = 3 }\>\>

#### Defined in

[model/enum/BitmarkVersion.ts:3](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/BitmarkVersion.ts#L3)

___

### CardSetVersion

• `Const` **CardSetVersion**: `Readonly`<{ `v1`: ``1`` = 1; `v2`: ``2`` = 2 }\> & `EnumExtensions`<`EnumType`<{ `v1`: ``1`` = 1; `v2`: ``2`` = 2 }\>\>

#### Defined in

[model/enum/CardSetVersion.ts:3](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/CardSetVersion.ts#L3)

___

### ResourceType

• `Const` **ResourceType**: `Readonly`<{ `unknown`: ``"unknown"`` = 'unknown'; `image`: ``"image"`` = 'image'; `imageEmbed`: ``"imageEmbed"`` = 'imageEmbed'; `imageLink`: ``"image-link"`` = 'image-link'; `audio`: ``"audio"`` = 'audio'; `audioEmbed`: ``"audio-embed"`` = 'audio-embed'; `audioLink`: ``"audio-link"`` = 'audio-link'; `video`: ``"video"`` = 'video'; `videoEmbed`: ``"video-embed"`` = 'video-embed'; `videoLink`: ``"video-link"`` = 'video-link'; `stillImageFilm`: ``"still-image-film"`` = 'still-image-film'; `stillImageFilmEmbed`: ``"still-image-film-embed"`` = 'still-image-film-embed'; `stillImageFilmLink`: ``"still-image-film-link"`` = 'still-image-film-link'; `article`: ``"article"`` = 'article'; `articleEmbed`: ``"articleEmbed"`` = 'articleEmbed'; `articleLink`: ``"articleLink"`` = 'articleLink'; `document`: ``"document"`` = 'document'; `documentEmbed`: ``"document-embed"`` = 'document-embed'; `documentLink`: ``"document-link"`` = 'document-link'; `documentDownload`: ``"document-download"`` = 'document-download'; `appLink`: ``"app-link"`` = 'app-link'; `websiteLink`: ``"website-link"`` = 'website-link' }\> & `EnumExtensions`<`EnumType`<{ `unknown`: ``"unknown"`` = 'unknown'; `image`: ``"image"`` = 'image'; `imageEmbed`: ``"imageEmbed"`` = 'imageEmbed'; `imageLink`: ``"image-link"`` = 'image-link'; `audio`: ``"audio"`` = 'audio'; `audioEmbed`: ``"audio-embed"`` = 'audio-embed'; `audioLink`: ``"audio-link"`` = 'audio-link'; `video`: ``"video"`` = 'video'; `videoEmbed`: ``"video-embed"`` = 'video-embed'; `videoLink`: ``"video-link"`` = 'video-link'; `stillImageFilm`: ``"still-image-film"`` = 'still-image-film'; `stillImageFilmEmbed`: ``"still-image-film-embed"`` = 'still-image-film-embed'; `stillImageFilmLink`: ``"still-image-film-link"`` = 'still-image-film-link'; `article`: ``"article"`` = 'article'; `articleEmbed`: ``"articleEmbed"`` = 'articleEmbed'; `articleLink`: ``"articleLink"`` = 'articleLink'; `document`: ``"document"`` = 'document'; `documentEmbed`: ``"document-embed"`` = 'document-embed'; `documentLink`: ``"document-link"`` = 'document-link'; `documentDownload`: ``"document-download"`` = 'document-download'; `appLink`: ``"app-link"`` = 'app-link'; `websiteLink`: ``"website-link"`` = 'website-link' }\>\>

#### Defined in

[model/enum/ResourceType.ts:29](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/ResourceType.ts#L29)

___

### TextFormat

• `Const` **TextFormat**: `Readonly`<{ `text`: ``"text"`` = 'text'; `bitmarkMinusMinus`: ``"bitmark--"`` = 'bitmark--'; `bitmarkPlusPlus`: ``"bitmark++"`` = 'bitmark++' }\> & `EnumExtensions`<`EnumType`<{ `text`: ``"text"`` = 'text'; `bitmarkMinusMinus`: ``"bitmark--"`` = 'bitmark--'; `bitmarkPlusPlus`: ``"bitmark++"`` = 'bitmark++' }\>\>

#### Defined in

[model/enum/TextFormat.ts:3](https://github.com/getMoreBrain/bitmark-parser-generator/blob/7c62fdc/src/model/enum/TextFormat.ts#L3)
