/*
 * NOTE:
 *
 * We want to be able to strip out the NodeJS specific functions from the final bundle.
 * Any code between the comments STRIP:START and STRIP:END will be removed.
 *
 * However, the Typescript compiler will remove comments that it does not believe are associated with code.
 * Therefore we have to use some dummy code to prevent it from removing the STRIP stripping comments.
 */

import { init } from './init/init';

export { BitmarkParserGenerator, Input, Output } from './BitmarkParserGenerator';

export { Builder } from './ast/Builder';
export { ResourceBuilder } from './ast/ResourceBuilder';

export { Ast } from './ast/Ast';

export { JsonParser } from './parser/json/JsonParser';
export { JsonGenerator } from './generator/json/JsonGenerator';
export { JsonStringGenerator } from './generator/json/JsonStringGenerator';

export { BitmarkParser } from './parser/bitmark/BitmarkParser';
export { BitmarkGenerator } from './generator/bitmark/BitmarkGenerator';
export { BitmarkStringGenerator } from './generator/bitmark/BitmarkStringGenerator';

export { Writer } from './ast/writer/Writer';
export { StringWriter } from './ast/writer/StringWriter';

export { BitType } from './model/enum/BitType';
export { BodyTextFormat } from './model/enum/BodyTextFormat';
export { ResourceTag } from './model/enum/ResourceTag';
export { NodeType } from './model/ast/NodeType';
export { BitmarkParserType } from './model/enum/BitmarkParserType';
export { BitmarkVersion } from './model/enum/BitmarkVersion';
export { CardSetVersion } from './model/enum/CardSetVersion';
export { InfoType } from './model/info/enum/InfoType';
export { InfoFormat } from './model/info/enum/InfoFormat';
export { BreakscapedString } from './model/ast/BreakscapedString';

//
// Direct text parser export
//
export { parse as bitmarkTextParse } from './parser/text/peg/TextPegParser';

//
// Exports that are stripped out for the browser
//

const STRIP = 0;
/* STRIP:START */
STRIP;

export { JsonFileGenerator } from './generator/json/JsonFileGenerator';
export { BitmarkFileGenerator } from './generator/bitmark/BitmarkFileGenerator';
export { FileWriter } from './ast/writer/FileWriter';
export { StreamWriter } from './ast/writer/StreamWriter';

/* STRIP:END */
STRIP;

//
// Type only exports
//

export type {
  InfoOptions,
  ConvertOptions,
  UpgradeOptions,
  UpgradeOptions as PrettifyOptions,
  ConvertTextOptions,
  CreateAstOptions,
  BreakscapeOptions,
  UnbreakscapeOptions,
  InputType,
  OutputType,
  TextJsonOptions,
} from './BitmarkParserGenerator';
export type { InfoTypeType } from './model/info/enum/InfoType';
export type { InfoFormatType } from './model/info/enum/InfoFormat';
export type { FileOptions } from './ast/writer/FileWriter';
export type { BitmarkOptions } from './generator/bitmark/BitmarkGenerator';
export type { JsonOptions } from './generator/json/JsonGenerator';
export type { BitTypeType } from './model/enum/BitType';
export type { BodyTextFormatType } from './model/enum/BodyTextFormat';
export type { ResourceTagType } from './model/enum/ResourceTag';
export type { NodeTypeType } from './model/ast/NodeType';
export type { BitmarkParserTypeType } from './model/enum/BitmarkParserType';
export type { BitmarkVersionType } from './model/enum/BitmarkVersion';
export type { CardSetVersionType } from './model/enum/CardSetVersion';
export type { Generator } from './generator/Generator';

export type { NodeInfo, AstWalkCallbacks } from './ast/Ast';
export type { Node, BitmarkAst, Bit, Example, ExtraProperties, Property, Body, BodyPart } from './model/ast/Nodes';
export type { JsonText as Text, TextAst } from './model/ast/TextNodes';
export type { BitWrapperJson } from './model/json/BitWrapperJson';
export type {
  BitJson,
  ImageSourceJson,
  PersonJson,
  MarkConfigJson,
  FlashcardJson,
  DefinitionListItemJson,
  StatementJson,
  ChoiceJson,
  ResponseJson,
  QuizJson,
  HeadingJson,
  PairJson,
  MatrixJson,
  MatrixCellJson,
  TableJson,
  QuestionJson,
  BotResponseJson,
  TechnicalTermJson,
  ServingsJson,
  IngredientJson,
  RatingLevelStartEndJson,
  // DEPRECATED - TO BE REMOVED IN THE FUTURE
  // CaptionDefinitionJson,
  // CaptionDefinitionListJson,
  ListItemJson,
  ExampleJson,
} from './model/json/BitJson';
export type {
  BodyBitsJson,
  BodyBitJson,
  GapJson,
  SelectJson,
  SelectOptionJson,
  HighlightJson,
  HighlightTextJson,
} from './model/json/BodyBitJson';
export type {
  ResourceDataJson,
  ResourceJson,
  ResourceWrapperJson,
  ImageResourceWrapperJson,
  ImageLinkResourceWrapperJson,
  AudioResourceWrapperJson,
  AudioEmbedResourceWrapperJson,
  AudioLinkResourceWrapperJson,
  VideoResourceWrapperJson,
  VideoEmbedResourceWrapperJson,
  VideoLinkResourceWrapperJson,
  StillImageFilmResourceWrapperJson,
  StillImageFilmEmbedResourceWrapperJson,
  StillImageFilmLinkResourceWrapperJson,
  ArticleResourceWrapperJson,
  DocumentResourceWrapperJson,
  DocumentEmbedResourceWrapperJson,
  DocumentLinkResourceWrapperJson,
  DocumentDownloadResourceWrapperJson,
  AppLinkResourceWrapperJson,
  WebsiteLinkResourceWrapperJson,
  ImageResourceJson,
  ImageLinkResourceJson,
  AudioResourceJson,
  AudioEmbedResourceJson,
  AudioLinkResourceJson,
  VideoResourceJson,
  VideoEmbedResourceJson,
  VideoLinkResourceJson,
  StillImageFilmResourceJson,
  StillImageFilmEmbedResourceJson,
  StillImageFilmLinkResourceJson,
  ArticleResourceJson,
  DocumentResourceJson,
  DocumentEmbedResourceJson,
  DocumentLinkResourceJson,
  DocumentDownloadResourceJson,
  AppLinkResourceJson,
  WebsiteLinkResourceJson,
} from './model/json/ResourceJson';
export type { ParserJson } from './model/json/ParserJson';

// Initialise the application
init();
