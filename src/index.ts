import { init } from './init/init.ts';

export { Ast } from './ast/Ast.ts';
export { Builder } from './ast/Builder.ts';
export { ResourceBuilder } from './ast/ResourceBuilder.ts';
export { StringWriter } from './ast/writer/StringWriter.ts';
export { BitmarkParserGenerator, Input, Output } from './BitmarkParserGenerator.ts';
export { BitmarkGenerator } from './generator/bitmark/BitmarkGenerator.ts';
export { BitmarkStringGenerator } from './generator/bitmark/BitmarkStringGenerator.ts';
export { JsonGenerator } from './generator/json/JsonGenerator.ts';
export { JsonStringGenerator } from './generator/json/JsonStringGenerator.ts';
export { NodeType } from './model/ast/NodeType.ts';
export { BitmarkParserType } from './model/enum/BitmarkParserType.ts';
export { BitmarkVersion } from './model/enum/BitmarkVersion.ts';
export { BitType } from './model/enum/BitType.ts';
export { BodyTextFormat } from './model/enum/BodyTextFormat.ts';
export { CardSetVersion } from './model/enum/CardSetVersion.ts';
export { InfoFormat } from './model/info/enum/InfoFormat.ts';
export { InfoType } from './model/info/enum/InfoType.ts';
export { BitmarkParser } from './parser/bitmark/BitmarkParser.ts';
export { JsonParser } from './parser/json/JsonParser.ts';

//
// Direct text parser export
//
export { parse as bitmarkTextParse } from './parser/text/peg/TextPegParser.ts';

//
// Exports that are stripped out for the browser
//

/*
 * NOTE:
 *
 * We want to be able to strip out the NodeJS specific functions from the final bundle.
 * Any code between the comments STRIP:START and STRIP:END will be removed.
 *
 * However, the prettifier will move comments that it does not believe are associated with code.
 *
 * Therefore we have to use some dummy code to prevent it from removing the STRIP stripping comments.
 */
const STRIP = 0;
/* STRIP:START */
STRIP; // eslint-disable-line @typescript-eslint/no-unused-expressions

export { FileWriter } from './ast/writer/FileWriter.ts';
export { StreamWriter } from './ast/writer/StreamWriter.ts';
export { BitmarkFileGenerator } from './generator/bitmark/BitmarkFileGenerator.ts';
export { JsonFileGenerator } from './generator/json/JsonFileGenerator.ts';

/* STRIP:END */
STRIP; // eslint-disable-line @typescript-eslint/no-unused-expressions

//
// Type only exports
//

export type { AstWalkCallbacks, NodeInfo } from './ast/Ast.ts';
export type { FileOptions } from './ast/writer/FileWriter.ts';
export { type Writer } from './ast/writer/Writer.ts';
export type {
  BreakscapeOptions,
  ConvertOptions,
  ConvertTextOptions,
  CreateAstOptions,
  InfoOptions,
  InputType,
  OutputType,
  UpgradeOptions as PrettifyOptions,
  TextJsonOptions,
  UnbreakscapeOptions,
  UpgradeOptions,
} from './BitmarkParserGenerator.ts';
export type { BitmarkOptions } from './generator/bitmark/BitmarkGenerator.ts';
export type { Generator } from './generator/Generator.ts';
export type { JsonOptions } from './generator/json/JsonGenerator.ts';
export { type BreakscapedString } from './model/ast/BreakscapedString.ts';
export type {
  Bit,
  BitmarkAst,
  Body,
  BodyPart,
  CardBit,
  CardNode,
  Example,
  ExtraProperties,
  Footer,
  Node,
  Property,
} from './model/ast/Nodes.ts';
export type { NodeTypeType } from './model/ast/NodeType.ts';
export type { JsonText as Text, TextAst } from './model/ast/TextNodes.ts';
export type { BitmarkParserTypeType } from './model/enum/BitmarkParserType.ts';
export type { BitmarkVersionType } from './model/enum/BitmarkVersion.ts';
export type { BitTypeType } from './model/enum/BitType.ts';
export type { BodyTextFormatType } from './model/enum/BodyTextFormat.ts';
export type { CardSetVersionType } from './model/enum/CardSetVersion.ts';
export type { ResourceTypeType } from './model/enum/ResourceType.ts';
export type { InfoFormatType } from './model/info/enum/InfoFormat.ts';
export type { InfoTypeType } from './model/info/enum/InfoType.ts';
export type {
  BitJson,
  BookJson,
  BookReferenceJson,
  BotResponseJson,
  ChoiceJson,
  DefinitionListItemJson,
  ExampleJson,
  FeedbackChoiceJson,
  FeedbackJson,
  FeedbackReasonJson,
  FlashcardJson,
  HeadingJson,
  ImageSourceJson,
  IngredientJson,
  ListItemJson,
  MarkConfigJson,
  MatrixCellJson,
  MatrixJson,
  PairJson,
  PersonJson,
  PronunciationTableCellJson,
  PronunciationTableJson,
  QuestionJson,
  QuizJson,
  RatingLevelStartEndJson,
  ResponseJson,
  ServingsJson,
  StatementJson,
  TableJson,
  TechnicalTermJson,
  TextAndIconJson,
} from './model/json/BitJson.ts';
export type { BitWrapperJson } from './model/json/BitWrapperJson.ts';
export type {
  BodyBitJson,
  BodyBitsJson,
  GapJson,
  HighlightJson,
  HighlightTextJson,
  MarkJson,
  SelectJson,
  SelectOptionJson,
} from './model/json/BodyBitJson.ts';
export type { ParserJson } from './model/json/ParserJson.ts';
export type {
  AppLinkResourceJson,
  AppLinkResourceWrapperJson,
  ArticleResourceJson,
  ArticleResourceWrapperJson,
  AudioEmbedResourceJson,
  AudioEmbedResourceWrapperJson,
  AudioLinkResourceJson,
  AudioLinkResourceWrapperJson,
  AudioResourceJson,
  AudioResourceWrapperJson,
  DocumentDownloadResourceJson,
  DocumentDownloadResourceWrapperJson,
  DocumentEmbedResourceJson,
  DocumentEmbedResourceWrapperJson,
  DocumentLinkResourceJson,
  DocumentLinkResourceWrapperJson,
  DocumentResourceJson,
  DocumentResourceWrapperJson,
  ImageLinkResourceJson,
  ImageLinkResourceWrapperJson,
  ImageResourceJson,
  ImageResourceWrapperJson,
  ResourceDataJson,
  ResourceJson,
  ResourceWrapperJson,
  StillImageFilmEmbedResourceJson,
  StillImageFilmEmbedResourceWrapperJson,
  StillImageFilmLinkResourceJson,
  StillImageFilmLinkResourceWrapperJson,
  StillImageFilmResourceJson,
  StillImageFilmResourceWrapperJson,
  VideoEmbedResourceJson,
  VideoEmbedResourceWrapperJson,
  VideoLinkResourceJson,
  VideoLinkResourceWrapperJson,
  VideoResourceJson,
  VideoResourceWrapperJson,
  WebsiteLinkResourceJson,
  WebsiteLinkResourceWrapperJson,
} from './model/json/ResourceJson.ts';

// Initialise the application
init();
