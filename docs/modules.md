[@bitmark-standard/bitmark-generator](API.md) / Modules

# @bitmark-standard/bitmark-generator

## Table of contents

### Interfaces

- [ConvertOptions](interfaces/ConvertOptions.md)
- [NodeInfo](interfaces/NodeInfo.md)
- [AstWalkCallbacks](interfaces/AstWalkCallbacks.md)
- [FileOptions](interfaces/FileOptions.md)
- [Writer](interfaces/Writer.md)
- [Generator](interfaces/Generator.md)
- [BitmarkOptions](interfaces/BitmarkOptions.md)
- [JsonOptions](interfaces/JsonOptions.md)
- [BitmarkAst](interfaces/BitmarkAst.md)
- [Bit](interfaces/Bit.md)
- [Statement](interfaces/Statement.md)
- [Choice](interfaces/Choice.md)
- [Response](interfaces/Response.md)
- [Quiz](interfaces/Quiz.md)
- [Heading](interfaces/Heading.md)
- [Pair](interfaces/Pair.md)
- [Matrix](interfaces/Matrix.md)
- [MatrixCell](interfaces/MatrixCell.md)
- [Question](interfaces/Question.md)
- [Resource](interfaces/Resource.md)
- [ImageResource](interfaces/ImageResource.md)
- [ImageLinkResource](interfaces/ImageLinkResource.md)
- [AudioResource](interfaces/AudioResource.md)
- [AudioLinkResource](interfaces/AudioLinkResource.md)
- [VideoResource](interfaces/VideoResource.md)
- [VideoLinkResource](interfaces/VideoLinkResource.md)
- [StillImageFilmResource](interfaces/StillImageFilmResource.md)
- [StillImageFilmLinkResource](interfaces/StillImageFilmLinkResource.md)
- [ArticleResource](interfaces/ArticleResource.md)
- [ArticleLinkResource](interfaces/ArticleLinkResource.md)
- [DocumentResource](interfaces/DocumentResource.md)
- [DocumentLinkResource](interfaces/DocumentLinkResource.md)
- [AppResource](interfaces/AppResource.md)
- [AppLinkResource](interfaces/AppLinkResource.md)
- [WebsiteLinkResource](interfaces/WebsiteLinkResource.md)
- [BodyText](interfaces/BodyText.md)
- [FooterText](interfaces/FooterText.md)
- [Gap](interfaces/Gap.md)
- [Select](interfaces/Select.md)
- [SelectOption](interfaces/SelectOption.md)
- [Highlight](interfaces/Highlight.md)
- [HighlightText](interfaces/HighlightText.md)
- [ItemLead](interfaces/ItemLead.md)
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
- [AudioLinkResourceWrapperJson](interfaces/AudioLinkResourceWrapperJson.md)
- [VideoResourceWrapperJson](interfaces/VideoResourceWrapperJson.md)
- [VideoLinkResourceWrapperJson](interfaces/VideoLinkResourceWrapperJson.md)
- [StillImageFilmResourceWrapperJson](interfaces/StillImageFilmResourceWrapperJson.md)
- [StillImageFilmLinkResourceWrapperJson](interfaces/StillImageFilmLinkResourceWrapperJson.md)
- [ArticleResourceWrapperJson](interfaces/ArticleResourceWrapperJson.md)
- [ArticleLinkResourceWrapperJson](interfaces/ArticleLinkResourceWrapperJson.md)
- [DocumentResourceWrapperJson](interfaces/DocumentResourceWrapperJson.md)
- [DocumentLinkResourceWrapperJson](interfaces/DocumentLinkResourceWrapperJson.md)
- [AppResourceWrapperJson](interfaces/AppResourceWrapperJson.md)
- [AppLinkResourceWrapperJson](interfaces/AppLinkResourceWrapperJson.md)
- [WebsiteLinkResourceWrapperJson](interfaces/WebsiteLinkResourceWrapperJson.md)
- [LinkResourceJson](interfaces/LinkResourceJson.md)
- [ImageResourceJson](interfaces/ImageResourceJson.md)
- [ImageLinkResourceJson](interfaces/ImageLinkResourceJson.md)
- [AudioResourceJson](interfaces/AudioResourceJson.md)
- [AudioLinkResourceJson](interfaces/AudioLinkResourceJson.md)
- [VideoResourceJson](interfaces/VideoResourceJson.md)
- [VideoLinkResourceJson](interfaces/VideoLinkResourceJson.md)
- [StillImageFilmResourceJson](interfaces/StillImageFilmResourceJson.md)
- [StillImageFilmLinkResourceJson](interfaces/StillImageFilmLinkResourceJson.md)
- [ArticleResourceJson](interfaces/ArticleResourceJson.md)
- [ArticleLinkResourceJson](interfaces/ArticleLinkResourceJson.md)
- [DocumentResourceJson](interfaces/DocumentResourceJson.md)
- [DocumentLinkResourceJson](interfaces/DocumentLinkResourceJson.md)
- [AppLinkResourceJson](interfaces/AppLinkResourceJson.md)
- [WebsiteLinkResourceJson](interfaces/WebsiteLinkResourceJson.md)

### Variables

- [Output](modules.md#Output)
- [BitmarkTool](modules.md#BitmarkTool)
- [Ast](modules.md#Ast)
- [Builder](modules.md#Builder)
- [NodeType](modules.md#NodeType)
- [BitType](modules.md#BitType)
- [ResourceType](modules.md#ResourceType)
- [TextFormat](modules.md#TextFormat)
- [BitmarkParser](modules.md#BitmarkParser)
- [JsonParser](modules.md#JsonParser)

### Type Aliases

- [OutputType](modules.md#OutputType)
- [NodeTypeType](modules.md#NodeTypeType)
- [Node](modules.md#Node)
- [Body](modules.md#Body)
- [BodyPart](modules.md#BodyPart)
- [Example](modules.md#Example)
- [BitTypeType](modules.md#BitTypeType)
- [ResourceTypeType](modules.md#ResourceTypeType)
- [TextFormatType](modules.md#TextFormatType)
- [BodyBitJson](modules.md#BodyBitJson)
- [ResourceDataJson](modules.md#ResourceDataJson)
- [ResourceJson](modules.md#ResourceJson)
- [AppResourceJson](modules.md#AppResourceJson)

### Classes

- [BitmarkToolClass](classes/BitmarkToolClass.md)
- [AstClass](classes/AstClass.md)
- [BuilderClass](classes/BuilderClass.md)
- [FileWriter](classes/FileWriter.md)
- [StreamWriter](classes/StreamWriter.md)
- [StringWriter](classes/StringWriter.md)
- [BitmarkFileGenerator](classes/BitmarkFileGenerator.md)
- [BitmarkGenerator](classes/BitmarkGenerator.md)
- [BitmarkStringGenerator](classes/BitmarkStringGenerator.md)
- [JsonFileGenerator](classes/JsonFileGenerator.md)
- [JsonGenerator](classes/JsonGenerator.md)
- [JsonStringGenerator](classes/JsonStringGenerator.md)
- [BitmarkParserClass](classes/BitmarkParserClass.md)
- [JsonParserClass](classes/JsonParserClass.md)

## Variables

### Output

• `Const` **Output**: `Readonly`<{ `bitmark`: ``"bitmark"`` = 'bitmark'; `json`: ``"json"`` = 'json' }\> & `EnumExtensions`<`EnumType`<{ `bitmark`: ``"bitmark"`` = 'bitmark'; `json`: ``"json"`` = 'json' }\>\>

Output type enumeration

#### Defined in

BitmarkTool.ts:43

___

### BitmarkTool

• `Const` **BitmarkTool**: [`BitmarkToolClass`](classes/BitmarkToolClass.md)

#### Defined in

BitmarkTool.ts:185

___

### Ast

• `Const` **Ast**: [`AstClass`](classes/AstClass.md)

#### Defined in

[ast/Ast.ts:266](https://github.com/getMoreBrain/bitmark-generator/blob/2e4b4f5/src/ast/Ast.ts#L266)

___

### Builder

• `Const` **Builder**: [`BuilderClass`](classes/BuilderClass.md)

#### Defined in

[ast/Builder.ts:1619](https://github.com/getMoreBrain/bitmark-generator/blob/2e4b4f5/src/ast/Builder.ts#L1619)

___

### NodeType

• `Const` **NodeType**: `Readonly`<{ `unknown`: ``"unknown"`` = 'unknown'; `bitmark`: ``"bitmark"`` = 'bitmark'; `bits`: ``"bits"`` = 'bits'; `bitsValue`: ``"bitsValue"`` = 'bitsValue'; `properties`: ``"properties"`` = 'properties'; `property`: ``"property"`` = 'property'; `propertyValues`: ``"propertyValues"`` = 'propertyValues'; `itemLead`: ``"itemLead"`` = 'itemLead'; `body`: ``"body"`` = 'body'; `bodyValue`: ``"bodyValue"`` = 'bodyValue'; `footer`: ``"footer"`` = 'footer'; `gap`: ``"gap"`` = 'gap'; `select`: ``"select"`` = 'select'; `highlight`: ``"highlight"`` = 'highlight'; `elements`: ``"elements"`` = 'elements'; `solutions`: ``"solutions"`` = 'solutions'; `options`: ``"options"`` = 'options'; `optionsValue`: ``"optionsValue"`` = 'optionsValue'; `texts`: ``"texts"`` = 'texts'; `textsValue`: ``"textsValue"`` = 'textsValue'; `statements`: ``"statements"`` = 'statements'; `statementsValue`: ``"statementsValue"`` = 'statementsValue'; `choices`: ``"choices"`` = 'choices'; `choicesValue`: ``"choicesValue"`` = 'choicesValue'; `responses`: ``"responses"`` = 'responses'; `responsesValue`: ``"responsesValue"`` = 'responsesValue'; `quizzes`: ``"quizzes"`` = 'quizzes'; `quizzesValue`: ``"quizzesValue"`` = 'quizzesValue'; `heading`: ``"heading"`` = 'heading'; `forValues`: ``"forValues"`` = 'forValues'; `pairs`: ``"pairs"`` = 'pairs'; `pairsValue`: ``"pairsValue"`` = 'pairsValue'; `values`: ``"values"`` = 'values'; `matrix`: ``"matrix"`` = 'matrix'; `matrixValue`: ``"matrixValue"`` = 'matrixValue'; `cells`: ``"cells"`` = 'cells'; `cellsValue`: ``"cellsValue"`` = 'cellsValue'; `questions`: ``"questions"`` = 'questions'; `questionsValue`: ``"questionsValue"`` = 'questionsValue'; `resource`: ``"resource"`` = 'resource'; `resourceType`: ``"resourceType"`` = 'resourceType'; `imageResource`: ``"imageResource"`` = 'imageResource'; `audioResource`: ``"audioResource"`` = 'audioResource'; `videoResource`: ``"videoResource"`` = 'videoResource'; `markup`: ``"markup"`` = 'markup'; `bitType`: ``"bitType"`` = 'bitType'; `textFormat`: ``"textFormat"`` = 'textFormat'; `ids`: ``"ids"`` = 'ids'; `idsValue`: ``"idsValue"`` = 'idsValue'; `externalIds`: ``"externalIds"`` = 'externalIds'; `externalIdsValue`: ``"externalIdsValue"`` = 'externalIdsValue'; `ageRanges`: ``"ageRanges"`` = 'ageRanges'; `ageRangesValue`: ``"ageRangesValue"`` = 'ageRangesValue'; `languages`: ``"languages"`` = 'languages'; `languagesValue`: ``"languagesValue"`` = 'languagesValue'; `computerLanguages`: ``"computerLanguages"`` = 'computerLanguages'; `computerLanguagesValue`: ``"computerLanguagesValue"`` = 'computerLanguagesValue'; `coverImages`: ``"coverImages"`` = 'coverImages'; `coverImagesValue`: ``"coverImagesValue"`` = 'coverImagesValue'; `publishers`: ``"publishers"`` = 'publishers'; `publishersValue`: ``"publishersValue"`` = 'publishersValue'; `publications`: ``"publications"`` = 'publications'; `publicationsValue`: ``"publicationsValue"`` = 'publicationsValue'; `authors`: ``"authors"`` = 'authors'; `authorsValue`: ``"authorsValue"`` = 'authorsValue'; `dates`: ``"dates"`` = 'dates'; `datesValue`: ``"datesValue"`` = 'datesValue'; `locations`: ``"locations"`` = 'locations'; `locationsValue`: ``"locationsValue"`` = 'locationsValue'; `themes`: ``"themes"`` = 'themes'; `themesValue`: ``"themesValue"`` = 'themesValue'; `kinds`: ``"kinds"`` = 'kinds'; `kindsValue`: ``"kindsValue"`` = 'kindsValue'; `actions`: ``"actions"`` = 'actions'; `actionsValue`: ``"actionsValue"`` = 'actionsValue'; `thumbImages`: ``"thumbImages"`` = 'thumbImages'; `thumbImagesValue`: ``"thumbImagesValue"`` = 'thumbImagesValue'; `durations`: ``"durations"`` = 'durations'; `durationsValue`: ``"durationsValue"`` = 'durationsValue'; `deepLinks`: ``"deepLinks"`` = 'deepLinks'; `deepLinksValue`: ``"deepLinksValue"`` = 'deepLinksValue'; `externalLink`: ``"externalLink"`` = 'externalLink'; `externalLinkText`: ``"externalLinkText"`` = 'externalLinkText'; `videoCallLinks`: ``"videoCallLinks"`` = 'videoCallLinks'; `videoCallLinksValue`: ``"videoCallLinksValue"`` = 'videoCallLinksValue'; `bots`: ``"bots"`` = 'bots'; `botsValue`: ``"botsValue"`` = 'botsValue'; `referenceProperties`: ``"referenceProperties"`` = 'referenceProperties'; `referencePropertiesValue`: ``"referencePropertiesValue"`` = 'referencePropertiesValue'; `sampleSolutions`: ``"sampleSolutions"`` = 'sampleSolutions'; `sampleSolutionsValue`: ``"sampleSolutionsValue"`` = 'sampleSolutionsValue'; `lists`: ``"lists"`` = 'lists'; `listsValue`: ``"listsValue"`` = 'listsValue'; `labelTrue`: ``"labelTrue"`` = 'labelTrue'; `labelFalse`: ``"labelFalse"`` = 'labelFalse'; `quotedPerson`: ``"quotedPerson"`` = 'quotedPerson'; `book`: ``"book"`` = 'book'; `item`: ``"item"`` = 'item'; `lead`: ``"lead"`` = 'lead'; `hint`: ``"hint"`` = 'hint'; `instruction`: ``"instruction"`` = 'instruction'; `example`: ``"example"`` = 'example'; `title`: ``"title"`` = 'title'; `subtitle`: ``"subtitle"`` = 'subtitle'; `level`: ``"level"`` = 'level'; `toc`: ``"toc"`` = 'toc'; `progress`: ``"progress"`` = 'progress'; `anchor`: ``"anchor"`` = 'anchor'; `reference`: ``"reference"`` = 'reference'; `referenceEnd`: ``"referenceEnd"`` = 'referenceEnd'; `bodyText`: ``"bodyText"`` = 'bodyText'; `footerText`: ``"footerText"`` = 'footerText'; `elementsValue`: ``"elementsValue"`` = 'elementsValue'; `solutionsValue`: ``"solutionsValue"`` = 'solutionsValue'; `prefix`: ``"prefix"`` = 'prefix'; `postfix`: ``"postfix"`` = 'postfix'; `isCaseSensitive`: ``"isCaseSensitive"`` = 'isCaseSensitive'; `isLongAnswer`: ``"isLongAnswer"`` = 'isLongAnswer'; `isShortAnswer`: ``"isShortAnswer"`` = 'isShortAnswer'; `isCorrect`: ``"isCorrect"`` = 'isCorrect'; `forKeys`: ``"forKeys"`` = 'forKeys'; `forValuesValue`: ``"forValuesValue"`` = 'forValuesValue'; `key`: ``"key"`` = 'key'; `valuesValue`: ``"valuesValue"`` = 'valuesValue'; `question`: ``"question"`` = 'question'; `partialAnswer`: ``"partialAnswer"`` = 'partialAnswer'; `sampleSolution`: ``"sampleSolution"`` = 'sampleSolution'; `statementText`: ``"statementText"`` = 'statementText'; `text`: ``"text"`` = 'text'; `propertyKey`: ``"propertyKey"`` = 'propertyKey'; `propertyValue`: ``"propertyValue"`` = 'propertyValue'; `keyAudio`: ``"keyAudio"`` = 'keyAudio'; `keyImage`: ``"keyImage"`` = 'keyImage'; `type`: ``"type"`` = 'type'; `format`: ``"format"`` = 'format'; `url`: ``"url"`` = 'url'; `src`: ``"src"`` = 'src'; `src1x`: ``"src1x"`` = 'src1x'; `src2x`: ``"src2x"`` = 'src2x'; `src3x`: ``"src3x"`` = 'src3x'; `src4x`: ``"src4x"`` = 'src4x'; `width`: ``"width"`` = 'width'; `height`: ``"height"`` = 'height'; `alt`: ``"alt"`` = 'alt'; `license`: ``"license"`` = 'license'; `copyright`: ``"copyright"`` = 'copyright'; `provider`: ``"provider"`` = 'provider'; `showInIndex`: ``"showInIndex"`` = 'showInIndex'; `caption`: ``"caption"`` = 'caption'; `duration`: ``"duration"`` = 'duration'; `posterImage`: ``"posterImage"`` = 'posterImage'; `thumbnails`: ``"thumbnails"`` = 'thumbnails'; `thumbnailsValue`: ``"thumbnailsValue"`` = 'thumbnailsValue' }\> & `EnumExtensions`<`EnumType`<{ `unknown`: ``"unknown"`` = 'unknown'; `bitmark`: ``"bitmark"`` = 'bitmark'; `bits`: ``"bits"`` = 'bits'; `bitsValue`: ``"bitsValue"`` = 'bitsValue'; `properties`: ``"properties"`` = 'properties'; `property`: ``"property"`` = 'property'; `propertyValues`: ``"propertyValues"`` = 'propertyValues'; `itemLead`: ``"itemLead"`` = 'itemLead'; `body`: ``"body"`` = 'body'; `bodyValue`: ``"bodyValue"`` = 'bodyValue'; `footer`: ``"footer"`` = 'footer'; `gap`: ``"gap"`` = 'gap'; `select`: ``"select"`` = 'select'; `highlight`: ``"highlight"`` = 'highlight'; `elements`: ``"elements"`` = 'elements'; `solutions`: ``"solutions"`` = 'solutions'; `options`: ``"options"`` = 'options'; `optionsValue`: ``"optionsValue"`` = 'optionsValue'; `texts`: ``"texts"`` = 'texts'; `textsValue`: ``"textsValue"`` = 'textsValue'; `statements`: ``"statements"`` = 'statements'; `statementsValue`: ``"statementsValue"`` = 'statementsValue'; `choices`: ``"choices"`` = 'choices'; `choicesValue`: ``"choicesValue"`` = 'choicesValue'; `responses`: ``"responses"`` = 'responses'; `responsesValue`: ``"responsesValue"`` = 'responsesValue'; `quizzes`: ``"quizzes"`` = 'quizzes'; `quizzesValue`: ``"quizzesValue"`` = 'quizzesValue'; `heading`: ``"heading"`` = 'heading'; `forValues`: ``"forValues"`` = 'forValues'; `pairs`: ``"pairs"`` = 'pairs'; `pairsValue`: ``"pairsValue"`` = 'pairsValue'; `values`: ``"values"`` = 'values'; `matrix`: ``"matrix"`` = 'matrix'; `matrixValue`: ``"matrixValue"`` = 'matrixValue'; `cells`: ``"cells"`` = 'cells'; `cellsValue`: ``"cellsValue"`` = 'cellsValue'; `questions`: ``"questions"`` = 'questions'; `questionsValue`: ``"questionsValue"`` = 'questionsValue'; `resource`: ``"resource"`` = 'resource'; `resourceType`: ``"resourceType"`` = 'resourceType'; `imageResource`: ``"imageResource"`` = 'imageResource'; `audioResource`: ``"audioResource"`` = 'audioResource'; `videoResource`: ``"videoResource"`` = 'videoResource'; `markup`: ``"markup"`` = 'markup'; `bitType`: ``"bitType"`` = 'bitType'; `textFormat`: ``"textFormat"`` = 'textFormat'; `ids`: ``"ids"`` = 'ids'; `idsValue`: ``"idsValue"`` = 'idsValue'; `externalIds`: ``"externalIds"`` = 'externalIds'; `externalIdsValue`: ``"externalIdsValue"`` = 'externalIdsValue'; `ageRanges`: ``"ageRanges"`` = 'ageRanges'; `ageRangesValue`: ``"ageRangesValue"`` = 'ageRangesValue'; `languages`: ``"languages"`` = 'languages'; `languagesValue`: ``"languagesValue"`` = 'languagesValue'; `computerLanguages`: ``"computerLanguages"`` = 'computerLanguages'; `computerLanguagesValue`: ``"computerLanguagesValue"`` = 'computerLanguagesValue'; `coverImages`: ``"coverImages"`` = 'coverImages'; `coverImagesValue`: ``"coverImagesValue"`` = 'coverImagesValue'; `publishers`: ``"publishers"`` = 'publishers'; `publishersValue`: ``"publishersValue"`` = 'publishersValue'; `publications`: ``"publications"`` = 'publications'; `publicationsValue`: ``"publicationsValue"`` = 'publicationsValue'; `authors`: ``"authors"`` = 'authors'; `authorsValue`: ``"authorsValue"`` = 'authorsValue'; `dates`: ``"dates"`` = 'dates'; `datesValue`: ``"datesValue"`` = 'datesValue'; `locations`: ``"locations"`` = 'locations'; `locationsValue`: ``"locationsValue"`` = 'locationsValue'; `themes`: ``"themes"`` = 'themes'; `themesValue`: ``"themesValue"`` = 'themesValue'; `kinds`: ``"kinds"`` = 'kinds'; `kindsValue`: ``"kindsValue"`` = 'kindsValue'; `actions`: ``"actions"`` = 'actions'; `actionsValue`: ``"actionsValue"`` = 'actionsValue'; `thumbImages`: ``"thumbImages"`` = 'thumbImages'; `thumbImagesValue`: ``"thumbImagesValue"`` = 'thumbImagesValue'; `durations`: ``"durations"`` = 'durations'; `durationsValue`: ``"durationsValue"`` = 'durationsValue'; `deepLinks`: ``"deepLinks"`` = 'deepLinks'; `deepLinksValue`: ``"deepLinksValue"`` = 'deepLinksValue'; `externalLink`: ``"externalLink"`` = 'externalLink'; `externalLinkText`: ``"externalLinkText"`` = 'externalLinkText'; `videoCallLinks`: ``"videoCallLinks"`` = 'videoCallLinks'; `videoCallLinksValue`: ``"videoCallLinksValue"`` = 'videoCallLinksValue'; `bots`: ``"bots"`` = 'bots'; `botsValue`: ``"botsValue"`` = 'botsValue'; `referenceProperties`: ``"referenceProperties"`` = 'referenceProperties'; `referencePropertiesValue`: ``"referencePropertiesValue"`` = 'referencePropertiesValue'; `sampleSolutions`: ``"sampleSolutions"`` = 'sampleSolutions'; `sampleSolutionsValue`: ``"sampleSolutionsValue"`` = 'sampleSolutionsValue'; `lists`: ``"lists"`` = 'lists'; `listsValue`: ``"listsValue"`` = 'listsValue'; `labelTrue`: ``"labelTrue"`` = 'labelTrue'; `labelFalse`: ``"labelFalse"`` = 'labelFalse'; `quotedPerson`: ``"quotedPerson"`` = 'quotedPerson'; `book`: ``"book"`` = 'book'; `item`: ``"item"`` = 'item'; `lead`: ``"lead"`` = 'lead'; `hint`: ``"hint"`` = 'hint'; `instruction`: ``"instruction"`` = 'instruction'; `example`: ``"example"`` = 'example'; `title`: ``"title"`` = 'title'; `subtitle`: ``"subtitle"`` = 'subtitle'; `level`: ``"level"`` = 'level'; `toc`: ``"toc"`` = 'toc'; `progress`: ``"progress"`` = 'progress'; `anchor`: ``"anchor"`` = 'anchor'; `reference`: ``"reference"`` = 'reference'; `referenceEnd`: ``"referenceEnd"`` = 'referenceEnd'; `bodyText`: ``"bodyText"`` = 'bodyText'; `footerText`: ``"footerText"`` = 'footerText'; `elementsValue`: ``"elementsValue"`` = 'elementsValue'; `solutionsValue`: ``"solutionsValue"`` = 'solutionsValue'; `prefix`: ``"prefix"`` = 'prefix'; `postfix`: ``"postfix"`` = 'postfix'; `isCaseSensitive`: ``"isCaseSensitive"`` = 'isCaseSensitive'; `isLongAnswer`: ``"isLongAnswer"`` = 'isLongAnswer'; `isShortAnswer`: ``"isShortAnswer"`` = 'isShortAnswer'; `isCorrect`: ``"isCorrect"`` = 'isCorrect'; `forKeys`: ``"forKeys"`` = 'forKeys'; `forValuesValue`: ``"forValuesValue"`` = 'forValuesValue'; `key`: ``"key"`` = 'key'; `valuesValue`: ``"valuesValue"`` = 'valuesValue'; `question`: ``"question"`` = 'question'; `partialAnswer`: ``"partialAnswer"`` = 'partialAnswer'; `sampleSolution`: ``"sampleSolution"`` = 'sampleSolution'; `statementText`: ``"statementText"`` = 'statementText'; `text`: ``"text"`` = 'text'; `propertyKey`: ``"propertyKey"`` = 'propertyKey'; `propertyValue`: ``"propertyValue"`` = 'propertyValue'; `keyAudio`: ``"keyAudio"`` = 'keyAudio'; `keyImage`: ``"keyImage"`` = 'keyImage'; `type`: ``"type"`` = 'type'; `format`: ``"format"`` = 'format'; `url`: ``"url"`` = 'url'; `src`: ``"src"`` = 'src'; `src1x`: ``"src1x"`` = 'src1x'; `src2x`: ``"src2x"`` = 'src2x'; `src3x`: ``"src3x"`` = 'src3x'; `src4x`: ``"src4x"`` = 'src4x'; `width`: ``"width"`` = 'width'; `height`: ``"height"`` = 'height'; `alt`: ``"alt"`` = 'alt'; `license`: ``"license"`` = 'license'; `copyright`: ``"copyright"`` = 'copyright'; `provider`: ``"provider"`` = 'provider'; `showInIndex`: ``"showInIndex"`` = 'showInIndex'; `caption`: ``"caption"`` = 'caption'; `duration`: ``"duration"`` = 'duration'; `posterImage`: ``"posterImage"`` = 'posterImage'; `thumbnails`: ``"thumbnails"`` = 'thumbnails'; `thumbnailsValue`: ``"thumbnailsValue"`` = 'thumbnailsValue' }\>\>

#### Defined in

model/ast/NodeType.ts:7

___

### BitType

• `Const` **BitType**: `Readonly`<{ `anchor`: ``"anchor"`` = 'anchor'; `article`: ``"article"`` = 'article'; `articleAttachment`: ``"article-attachment"`` = 'article-attachment'; `assignment`: ``"assignment"`` = 'assignment'; `bitAlias`: ``"bit-alias"`` = 'bit-alias'; `book`: ``"book"`` = 'book'; `bookAcknowledgments`: ``"book-acknowledgments"`` = 'book-acknowledgments'; `bookAddendum`: ``"book-addendum"`` = 'book-addendum'; `bookAfterword`: ``"book-afterword"`` = 'book-afterword'; `bookAppendix`: ``"book-appendix"`` = 'book-appendix'; `bookAutherBio`: ``"book-author-bio"`` = 'book-author-bio'; `bookBibliography`: ``"book-bibliography"`` = 'book-bibliography'; `bookComingSoon`: ``"book-coming-soon"`` = 'book-coming-soon'; `bookConclusion`: ``"book-conclusion"`` = 'book-conclusion'; `bookCopyright`: ``"book-copyright"`` = 'book-copyright'; `bookCopyrightPermissions`: ``"book-copyright-permissions"`` = 'book-copyright-permissions'; `bookDedication`: ``"book-dedication"`` = 'book-dedication'; `bookEndnotes`: ``"book-endnotes"`` = 'book-endnotes'; `bookEpigraph`: ``"book-epigraph"`` = 'book-epigraph'; `bookEpilogue`: ``"book-epilogue"`` = 'book-epilogue'; `bookForword`: ``"book-foreword"`` = 'book-foreword'; `bookFrontispiece`: ``"book-frontispiece"`` = 'book-frontispiece'; `bookIncitingIncident`: ``"book-inciting-incident"`` = 'book-inciting-incident'; `bookIntroduction`: ``"book-introduction"`` = 'book-introduction'; `bookListOfContributors`: ``"book-list-of-contributors"`` = 'book-list-of-contributors'; `bookNotes`: ``"book-notes"`` = 'book-notes'; `bookPostscript`: ``"book-postscript"`` = 'book-postscript'; `bookPreface`: ``"book-preface"`` = 'book-preface'; `bookPrologue`: ``"book-prologue"`` = 'book-prologue'; `bookReadMore`: ``"book-read-more"`` = 'book-read-more'; `bookReferenceList`: ``"book-reference-list"`` = 'book-reference-list'; `bookRequestForABookReview`: ``"book-request-for-a-book-review"`` = 'book-request-for-a-book-review'; `bookSummary`: ``"book-summary"`` = 'book-summary'; `bookTeaser`: ``"book-teaser"`` = 'book-teaser'; `bookTitle`: ``"book-title"`` = 'book-title'; `botActionAnnounce`: ``"bot-action-announce"`` = 'bot-action-announce'; `botActionRatingNumber`: ``"bot-action-rating-number"`` = 'bot-action-rating-number'; `botActionRemind`: ``"bot-action-remind"`` = 'bot-action-remind'; `botActionResponse`: ``"bot-action-response"`` = 'bot-action-response'; `botActionSave`: ``"bot-action-save"`` = 'bot-action-save'; `botActionSend`: ``"bot-action-send"`` = 'bot-action-send'; `botActionTrueFalse`: ``"bot-action-true-false"`` = 'bot-action-true-false'; `botInterview`: ``"bot-interview"`` = 'bot-interview'; `card1`: ``"card-1"`` = 'card-1'; `chapter`: ``"chapter"`` = 'chapter'; `chat`: ``"chat"`` = 'chat'; `cloze`: ``"cloze"`` = 'cloze'; `clozeAndMultipleChoiceText`: ``"cloze-and-multiple-choice-text"`` = 'cloze-and-multiple-choice-text'; `clozeInstructionGrouped`: ``"cloze-instruction-grouped"`` = 'cloze-instruction-grouped'; `clozeSolutionGrouped`: ``"cloze-solution-grouped"`` = 'cloze-solution-grouped'; `code`: ``"code"`` = 'code'; `conversation`: ``"conversation"`` = 'conversation'; `correction`: ``"correction"`` = 'correction'; `details`: ``"details"`` = 'details'; `details1`: ``"details-1"`` = 'details-1'; `documentUpload`: ``"document-upload"`` = 'document-upload'; `essay`: ``"essay"`` = 'essay'; `example`: ``"example"`` = 'example'; `flashcard`: ``"flashcard"`` = 'flashcard'; `flashcard1`: ``"flashcard-1"`` = 'flashcard-1'; `groupBorn`: ``"group-born"`` = 'group-born'; `groupDied`: ``"group-died"`` = 'group-died'; `help`: ``"help"`` = 'help'; `highlightText`: ``"highlight-text"`` = 'highlight-text'; `hint`: ``"hint"`` = 'hint'; `image`: ``"image"`` = 'image'; `info`: ``"info"`` = 'info'; `internalLink`: ``"internal-link"`` = 'internal-link'; `interview`: ``"interview"`` = 'interview'; `interviewInstructionGrouped`: ``"interview-instruction-grouped"`` = 'interview-instruction-grouped'; `learningPathBook`: ``"learning-path-book"`` = 'learning-path-book'; `learningPathBotTraining`: ``"learning-path-bot-training"`` = 'learning-path-bot-training'; `learningPathClassroomEvent`: ``"learning-path-classroom-event"`` = 'learning-path-classroom-event'; `learningPathClassroomTraining`: ``"learning-path-classroom-training"`` = 'learning-path-classroom-training'; `learningPathClosing`: ``"learning-path-closing"`` = 'learning-path-closing'; `learningPathExternalLink`: ``"learning-path-external-link"`` = 'learning-path-external-link'; `learningPathFeedback`: ``"learning-path-feedback"`` = 'learning-path-feedback'; `learningPathLearningGoal`: ``"learning-path-learning-goal"`` = 'learning-path-learning-goal'; `learningPathLti`: ``"learning-path-lti"`` = 'learning-path-lti'; `learningPathSign`: ``"learning-path-sign"`` = 'learning-path-sign'; `learningPathStep`: ``"learning-path-step"`` = 'learning-path-step'; `learningPathVideoCall`: ``"learning-path-video-call"`` = 'learning-path-video-call'; `mark`: ``"mark"`` = 'mark'; `match`: ``"match"`` = 'match'; `matchAudio`: ``"match-audio"`` = 'match-audio'; `matchMatrix`: ``"match-matrix"`` = 'match-matrix'; `matchPicture`: ``"match-picture"`` = 'match-picture'; `matchReverse`: ``"match-reverse"`` = 'match-reverse'; `matchSolutionGrouped`: ``"match-solution-grouped"`` = 'match-solution-grouped'; `message`: ``"message"`` = 'message'; `multipleChoice`: ``"multiple-choice"`` = 'multiple-choice'; `multipleChoice1`: ``"multiple-choice-1"`` = 'multiple-choice-1'; `multipleChoiceText`: ``"multiple-choice-text"`` = 'multiple-choice-text'; `multipleResponse`: ``"multiple-response"`` = 'multiple-response'; `multipleResponse1`: ``"multiple-response-1"`` = 'multiple-response-1'; `note`: ``"note"`` = 'note'; `page`: ``"page"`` = 'page'; `preparationNote`: ``"preparation-note"`` = 'preparation-note'; `question1`: ``"question-1"`` = 'question-1'; `quote`: ``"quote"`` = 'quote'; `rating`: ``"rating"`` = 'rating'; `recordAudio`: ``"record-audio"`` = 'record-audio'; `releaseNote`: ``"release-note"`` = 'release-note'; `remark`: ``"remark"`` = 'remark'; `sampleSolution`: ``"sample-solution"`` = 'sample-solution'; `selfAssessment`: ``"self-assessment"`` = 'self-assessment'; `sequence`: ``"sequence"`` = 'sequence'; `sideNote`: ``"side-note"`` = 'side-note'; `statement`: ``"statement"`` = 'statement'; `summary`: ``"summary"`` = 'summary'; `survey`: ``"survey"`` = 'survey'; `survey1`: ``"survey-1"`` = 'survey-1'; `surveyAnonymous`: ``"survey-anonymous"`` = 'survey-anonymous'; `surveyAnonymous1`: ``"survey-anonymous-1"`` = 'survey-anonymous-1'; `takePicture`: ``"take-picture"`` = 'take-picture'; `trueFalse`: ``"true-false"`` = 'true-false'; `trueFalse1`: ``"true-false-1"`` = 'true-false-1'; `video`: ``"video"`` = 'video'; `videoLink`: ``"video-link"`` = 'video-link'; `warning`: ``"warning"`` = 'warning' }\> & `EnumExtensions`<`EnumType`<{ `anchor`: ``"anchor"`` = 'anchor'; `article`: ``"article"`` = 'article'; `articleAttachment`: ``"article-attachment"`` = 'article-attachment'; `assignment`: ``"assignment"`` = 'assignment'; `bitAlias`: ``"bit-alias"`` = 'bit-alias'; `book`: ``"book"`` = 'book'; `bookAcknowledgments`: ``"book-acknowledgments"`` = 'book-acknowledgments'; `bookAddendum`: ``"book-addendum"`` = 'book-addendum'; `bookAfterword`: ``"book-afterword"`` = 'book-afterword'; `bookAppendix`: ``"book-appendix"`` = 'book-appendix'; `bookAutherBio`: ``"book-author-bio"`` = 'book-author-bio'; `bookBibliography`: ``"book-bibliography"`` = 'book-bibliography'; `bookComingSoon`: ``"book-coming-soon"`` = 'book-coming-soon'; `bookConclusion`: ``"book-conclusion"`` = 'book-conclusion'; `bookCopyright`: ``"book-copyright"`` = 'book-copyright'; `bookCopyrightPermissions`: ``"book-copyright-permissions"`` = 'book-copyright-permissions'; `bookDedication`: ``"book-dedication"`` = 'book-dedication'; `bookEndnotes`: ``"book-endnotes"`` = 'book-endnotes'; `bookEpigraph`: ``"book-epigraph"`` = 'book-epigraph'; `bookEpilogue`: ``"book-epilogue"`` = 'book-epilogue'; `bookForword`: ``"book-foreword"`` = 'book-foreword'; `bookFrontispiece`: ``"book-frontispiece"`` = 'book-frontispiece'; `bookIncitingIncident`: ``"book-inciting-incident"`` = 'book-inciting-incident'; `bookIntroduction`: ``"book-introduction"`` = 'book-introduction'; `bookListOfContributors`: ``"book-list-of-contributors"`` = 'book-list-of-contributors'; `bookNotes`: ``"book-notes"`` = 'book-notes'; `bookPostscript`: ``"book-postscript"`` = 'book-postscript'; `bookPreface`: ``"book-preface"`` = 'book-preface'; `bookPrologue`: ``"book-prologue"`` = 'book-prologue'; `bookReadMore`: ``"book-read-more"`` = 'book-read-more'; `bookReferenceList`: ``"book-reference-list"`` = 'book-reference-list'; `bookRequestForABookReview`: ``"book-request-for-a-book-review"`` = 'book-request-for-a-book-review'; `bookSummary`: ``"book-summary"`` = 'book-summary'; `bookTeaser`: ``"book-teaser"`` = 'book-teaser'; `bookTitle`: ``"book-title"`` = 'book-title'; `botActionAnnounce`: ``"bot-action-announce"`` = 'bot-action-announce'; `botActionRatingNumber`: ``"bot-action-rating-number"`` = 'bot-action-rating-number'; `botActionRemind`: ``"bot-action-remind"`` = 'bot-action-remind'; `botActionResponse`: ``"bot-action-response"`` = 'bot-action-response'; `botActionSave`: ``"bot-action-save"`` = 'bot-action-save'; `botActionSend`: ``"bot-action-send"`` = 'bot-action-send'; `botActionTrueFalse`: ``"bot-action-true-false"`` = 'bot-action-true-false'; `botInterview`: ``"bot-interview"`` = 'bot-interview'; `card1`: ``"card-1"`` = 'card-1'; `chapter`: ``"chapter"`` = 'chapter'; `chat`: ``"chat"`` = 'chat'; `cloze`: ``"cloze"`` = 'cloze'; `clozeAndMultipleChoiceText`: ``"cloze-and-multiple-choice-text"`` = 'cloze-and-multiple-choice-text'; `clozeInstructionGrouped`: ``"cloze-instruction-grouped"`` = 'cloze-instruction-grouped'; `clozeSolutionGrouped`: ``"cloze-solution-grouped"`` = 'cloze-solution-grouped'; `code`: ``"code"`` = 'code'; `conversation`: ``"conversation"`` = 'conversation'; `correction`: ``"correction"`` = 'correction'; `details`: ``"details"`` = 'details'; `details1`: ``"details-1"`` = 'details-1'; `documentUpload`: ``"document-upload"`` = 'document-upload'; `essay`: ``"essay"`` = 'essay'; `example`: ``"example"`` = 'example'; `flashcard`: ``"flashcard"`` = 'flashcard'; `flashcard1`: ``"flashcard-1"`` = 'flashcard-1'; `groupBorn`: ``"group-born"`` = 'group-born'; `groupDied`: ``"group-died"`` = 'group-died'; `help`: ``"help"`` = 'help'; `highlightText`: ``"highlight-text"`` = 'highlight-text'; `hint`: ``"hint"`` = 'hint'; `image`: ``"image"`` = 'image'; `info`: ``"info"`` = 'info'; `internalLink`: ``"internal-link"`` = 'internal-link'; `interview`: ``"interview"`` = 'interview'; `interviewInstructionGrouped`: ``"interview-instruction-grouped"`` = 'interview-instruction-grouped'; `learningPathBook`: ``"learning-path-book"`` = 'learning-path-book'; `learningPathBotTraining`: ``"learning-path-bot-training"`` = 'learning-path-bot-training'; `learningPathClassroomEvent`: ``"learning-path-classroom-event"`` = 'learning-path-classroom-event'; `learningPathClassroomTraining`: ``"learning-path-classroom-training"`` = 'learning-path-classroom-training'; `learningPathClosing`: ``"learning-path-closing"`` = 'learning-path-closing'; `learningPathExternalLink`: ``"learning-path-external-link"`` = 'learning-path-external-link'; `learningPathFeedback`: ``"learning-path-feedback"`` = 'learning-path-feedback'; `learningPathLearningGoal`: ``"learning-path-learning-goal"`` = 'learning-path-learning-goal'; `learningPathLti`: ``"learning-path-lti"`` = 'learning-path-lti'; `learningPathSign`: ``"learning-path-sign"`` = 'learning-path-sign'; `learningPathStep`: ``"learning-path-step"`` = 'learning-path-step'; `learningPathVideoCall`: ``"learning-path-video-call"`` = 'learning-path-video-call'; `mark`: ``"mark"`` = 'mark'; `match`: ``"match"`` = 'match'; `matchAudio`: ``"match-audio"`` = 'match-audio'; `matchMatrix`: ``"match-matrix"`` = 'match-matrix'; `matchPicture`: ``"match-picture"`` = 'match-picture'; `matchReverse`: ``"match-reverse"`` = 'match-reverse'; `matchSolutionGrouped`: ``"match-solution-grouped"`` = 'match-solution-grouped'; `message`: ``"message"`` = 'message'; `multipleChoice`: ``"multiple-choice"`` = 'multiple-choice'; `multipleChoice1`: ``"multiple-choice-1"`` = 'multiple-choice-1'; `multipleChoiceText`: ``"multiple-choice-text"`` = 'multiple-choice-text'; `multipleResponse`: ``"multiple-response"`` = 'multiple-response'; `multipleResponse1`: ``"multiple-response-1"`` = 'multiple-response-1'; `note`: ``"note"`` = 'note'; `page`: ``"page"`` = 'page'; `preparationNote`: ``"preparation-note"`` = 'preparation-note'; `question1`: ``"question-1"`` = 'question-1'; `quote`: ``"quote"`` = 'quote'; `rating`: ``"rating"`` = 'rating'; `recordAudio`: ``"record-audio"`` = 'record-audio'; `releaseNote`: ``"release-note"`` = 'release-note'; `remark`: ``"remark"`` = 'remark'; `sampleSolution`: ``"sample-solution"`` = 'sample-solution'; `selfAssessment`: ``"self-assessment"`` = 'self-assessment'; `sequence`: ``"sequence"`` = 'sequence'; `sideNote`: ``"side-note"`` = 'side-note'; `statement`: ``"statement"`` = 'statement'; `summary`: ``"summary"`` = 'summary'; `survey`: ``"survey"`` = 'survey'; `survey1`: ``"survey-1"`` = 'survey-1'; `surveyAnonymous`: ``"survey-anonymous"`` = 'survey-anonymous'; `surveyAnonymous1`: ``"survey-anonymous-1"`` = 'survey-anonymous-1'; `takePicture`: ``"take-picture"`` = 'take-picture'; `trueFalse`: ``"true-false"`` = 'true-false'; `trueFalse1`: ``"true-false-1"`` = 'true-false-1'; `video`: ``"video"`` = 'video'; `videoLink`: ``"video-link"`` = 'video-link'; `warning`: ``"warning"`` = 'warning' }\>\>

#### Defined in

model/enum/BitType.ts:127

___

### ResourceType

• `Const` **ResourceType**: `Readonly`<{ `unknown`: ``"unknown"`` = 'unknown'; `image`: ``"image"`` = 'image'; `imageLink`: ``"image-link"`` = 'image-link'; `audio`: ``"audio"`` = 'audio'; `audioLink`: ``"audio-link"`` = 'audio-link'; `video`: ``"video"`` = 'video'; `videoLink`: ``"video-link"`` = 'video-link'; `stillImageFilm`: ``"still-image-film"`` = 'still-image-film'; `stillImageFilmLink`: ``"still-image-film-link"`` = 'still-image-film-link'; `article`: ``"article"`` = 'article'; `articleLink`: ``"article-link"`` = 'article-link'; `document`: ``"document"`` = 'document'; `documentLink`: ``"document-link"`` = 'document-link'; `app`: ``"app"`` = 'app'; `appLink`: ``"app-link"`` = 'app-link'; `websiteLink`: ``"website-link"`` = 'website-link' }\> & `EnumExtensions`<`EnumType`<{ `unknown`: ``"unknown"`` = 'unknown'; `image`: ``"image"`` = 'image'; `imageLink`: ``"image-link"`` = 'image-link'; `audio`: ``"audio"`` = 'audio'; `audioLink`: ``"audio-link"`` = 'audio-link'; `video`: ``"video"`` = 'video'; `videoLink`: ``"video-link"`` = 'video-link'; `stillImageFilm`: ``"still-image-film"`` = 'still-image-film'; `stillImageFilmLink`: ``"still-image-film-link"`` = 'still-image-film-link'; `article`: ``"article"`` = 'article'; `articleLink`: ``"article-link"`` = 'article-link'; `document`: ``"document"`` = 'document'; `documentLink`: ``"document-link"`` = 'document-link'; `app`: ``"app"`` = 'app'; `appLink`: ``"app-link"`` = 'app-link'; `websiteLink`: ``"website-link"`` = 'website-link' }\>\>

#### Defined in

model/enum/ResourceType.ts:23

___

### TextFormat

• `Const` **TextFormat**: `Readonly`<{ `bitmarkMinusMinus`: ``"bitmark--"`` = 'bitmark--'; `bitmarkPlusPlus`: ``"bitmark++"`` = 'bitmark++' }\> & `EnumExtensions`<`EnumType`<{ `bitmarkMinusMinus`: ``"bitmark--"`` = 'bitmark--'; `bitmarkPlusPlus`: ``"bitmark++"`` = 'bitmark++' }\>\>

#### Defined in

model/enum/TextFormat.ts:3

___

### BitmarkParser

• `Const` **BitmarkParser**: [`BitmarkParserClass`](classes/BitmarkParserClass.md)

#### Defined in

parser/bitmark/BitmarkParser.ts:18

___

### JsonParser

• `Const` **JsonParser**: [`JsonParserClass`](classes/JsonParserClass.md)

#### Defined in

parser/json/JsonParser.ts:852

## Type Aliases

### OutputType

Ƭ **OutputType**: `EnumType`<typeof [`Output`](modules.md#Output)\>

#### Defined in

BitmarkTool.ts:54

___

### NodeTypeType

Ƭ **NodeTypeType**: `EnumType`<typeof [`NodeType`](modules.md#NodeType)\>

#### Defined in

model/ast/NodeType.ts:175

___

### Node

Ƭ **Node**: [`BitmarkAst`](interfaces/BitmarkAst.md) \| [`Bit`](interfaces/Bit.md) \| [`Statement`](interfaces/Statement.md) \| [`Choice`](interfaces/Choice.md) \| [`Response`](interfaces/Response.md) \| [`Quiz`](interfaces/Quiz.md) \| [`Pair`](interfaces/Pair.md) \| [`Resource`](interfaces/Resource.md) \| [`Body`](modules.md#Body) \| [`BodyPart`](modules.md#BodyPart) \| [`BodyText`](interfaces/BodyText.md) \| [`Gap`](interfaces/Gap.md) \| [`Select`](interfaces/Select.md) \| [`SelectOption`](interfaces/SelectOption.md) \| [`BodyText`](interfaces/BodyText.md) \| [`ItemLead`](interfaces/ItemLead.md) \| [`Example`](modules.md#Example) \| `string` \| `number` \| `boolean`

#### Defined in

model/ast/Nodes.ts:7

___

### Body

Ƭ **Body**: [`BodyPart`](modules.md#BodyPart)[]

#### Defined in

model/ast/Nodes.ts:292

___

### BodyPart

Ƭ **BodyPart**: [`BodyText`](interfaces/BodyText.md) \| [`Gap`](interfaces/Gap.md) \| [`Select`](interfaces/Select.md) \| [`Highlight`](interfaces/Highlight.md)

#### Defined in

model/ast/Nodes.ts:293

___

### Example

Ƭ **Example**: `string` \| `boolean`

#### Defined in

model/ast/Nodes.ts:376

___

### BitTypeType

Ƭ **BitTypeType**: `EnumType`<typeof [`BitType`](modules.md#BitType)\>

#### Defined in

model/enum/BitType.ts:130

___

### ResourceTypeType

Ƭ **ResourceTypeType**: `EnumType`<typeof [`ResourceType`](modules.md#ResourceType)\>

#### Defined in

model/enum/ResourceType.ts:26

___

### TextFormatType

Ƭ **TextFormatType**: `EnumType`<typeof [`TextFormat`](modules.md#TextFormat)\>

#### Defined in

model/enum/TextFormat.ts:8

___

### BodyBitJson

Ƭ **BodyBitJson**: [`GapJson`](interfaces/GapJson.md) \| [`SelectJson`](interfaces/SelectJson.md) \| [`HighlightJson`](interfaces/HighlightJson.md)

#### Defined in

model/json/BodyBitJson.ts:5

___

### ResourceDataJson

Ƭ **ResourceDataJson**: [`ImageResourceJson`](interfaces/ImageResourceJson.md) & [`ImageLinkResourceJson`](interfaces/ImageLinkResourceJson.md) & [`AudioResourceJson`](interfaces/AudioResourceJson.md) & [`AudioLinkResourceJson`](interfaces/AudioLinkResourceJson.md) & [`VideoResourceJson`](interfaces/VideoResourceJson.md) & [`VideoLinkResourceJson`](interfaces/VideoLinkResourceJson.md) & [`StillImageFilmResourceJson`](interfaces/StillImageFilmResourceJson.md) & [`StillImageFilmLinkResourceJson`](interfaces/StillImageFilmLinkResourceJson.md) & [`ArticleResourceJson`](interfaces/ArticleResourceJson.md) & [`ArticleLinkResourceJson`](interfaces/ArticleLinkResourceJson.md) & [`DocumentResourceJson`](interfaces/DocumentResourceJson.md) & [`DocumentLinkResourceJson`](interfaces/DocumentLinkResourceJson.md) & [`AppLinkResourceJson`](interfaces/AppLinkResourceJson.md) & [`WebsiteLinkResourceJson`](interfaces/WebsiteLinkResourceJson.md)

#### Defined in

model/json/ResourceJson.ts:1

___

### ResourceJson

Ƭ **ResourceJson**: [`ImageResourceWrapperJson`](interfaces/ImageResourceWrapperJson.md) \| [`ImageLinkResourceWrapperJson`](interfaces/ImageLinkResourceWrapperJson.md) \| [`AudioResourceWrapperJson`](interfaces/AudioResourceWrapperJson.md) \| [`AudioLinkResourceWrapperJson`](interfaces/AudioLinkResourceWrapperJson.md) \| [`VideoResourceWrapperJson`](interfaces/VideoResourceWrapperJson.md) \| [`VideoLinkResourceWrapperJson`](interfaces/VideoLinkResourceWrapperJson.md) \| [`StillImageFilmResourceWrapperJson`](interfaces/StillImageFilmResourceWrapperJson.md) \| [`StillImageFilmLinkResourceWrapperJson`](interfaces/StillImageFilmLinkResourceWrapperJson.md) \| [`ArticleResourceWrapperJson`](interfaces/ArticleResourceWrapperJson.md) \| [`ArticleLinkResourceWrapperJson`](interfaces/ArticleLinkResourceWrapperJson.md) \| [`DocumentResourceWrapperJson`](interfaces/DocumentResourceWrapperJson.md) \| [`DocumentLinkResourceWrapperJson`](interfaces/DocumentLinkResourceWrapperJson.md) \| [`AppResourceWrapperJson`](interfaces/AppResourceWrapperJson.md) \| [`AppLinkResourceWrapperJson`](interfaces/AppLinkResourceWrapperJson.md) \| [`WebsiteLinkResourceWrapperJson`](interfaces/WebsiteLinkResourceWrapperJson.md)

#### Defined in

model/json/ResourceJson.ts:17

___

### AppResourceJson

Ƭ **AppResourceJson**: `string`

#### Defined in

model/json/ResourceJson.ts:222
