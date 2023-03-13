import { ResourceJson } from './json/ResourceJson';
import { stringUtils } from './tools/StringUtils';
import { ArticleResourceFormat } from './types/ArticleResourceFormat';
import { AudioResourceFormat } from './types/AudioResourceFormat';
import { BitBitType } from './types/BitBitType';
import { BodyBitType } from './types/BodyBitType';
import { ImageResourceFormat } from './types/ImageResourceFormat';
import { TextFormat } from './types/TextFormat';
import { VideoResourceFormat } from './types/VideoResourceFormat';
import { ResourceType } from './types/resources/ResouceType';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Validator = (value: any) => boolean;

const stringValidator = (value: string): boolean => {
  return stringUtils.isString(value);
};

const numberValidator = (value: number): boolean => {
  // TODO
  return true;
};

const booleanValidator = (value: boolean): boolean => {
  return value === true || value === false;
};

const urlValidator = (value: string): boolean => {
  // Currently just validates item is a string
  return stringUtils.isString(value);
};

const propertyValidator = (value: string | string[]): boolean => {
  // TODO
  return true;
};

const bitBitTypeValidator = (value: string): boolean => {
  return !!BitBitType.fromValue(value);
};

const bodyBitTypeValidator = (value: string): boolean => {
  return !!BodyBitType.fromValue(value);
};

const bitResourceTypeValidator = (value: string): boolean => {
  return !!ResourceType.fromValue(value);
};

const bitTextFormatValidator = (value: string): boolean => {
  return !!TextFormat.fromValue(value);
};

const placeholdersValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const statementsValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const botActionRatingNumberResponsesValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const botActionResponseResponsesValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const botActionTrueFalseResponsesValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const gapSolutionsValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const selectOptionsValidator = (value: string[]): boolean => {
  // TODO
  return true;
};

const resourceValidator = (value: ResourceJson): boolean => {
  // TODO
  return true;
};

const imageResourceFormatValidator = (value: string): boolean => {
  return !!ImageResourceFormat.fromValue(value);
};

const audioResourceFormatValidator = (value: string): boolean => {
  return !!AudioResourceFormat.fromValue(value);
};

const videoResourceFormatValidator = (value: string): boolean => {
  return !!VideoResourceFormat.fromValue(value);
};

const articleOnlineFormatValidator = (value: string): boolean => {
  return !!ArticleResourceFormat.fromValue(value);
};

export {
  stringValidator,
  numberValidator,
  booleanValidator,
  urlValidator,
  propertyValidator,
  bitBitTypeValidator,
  bodyBitTypeValidator,
  bitResourceTypeValidator,
  bitTextFormatValidator,
  placeholdersValidator,
  statementsValidator,
  botActionRatingNumberResponsesValidator,
  botActionResponseResponsesValidator,
  botActionTrueFalseResponsesValidator,
  gapSolutionsValidator,
  selectOptionsValidator,
  resourceValidator,
  imageResourceFormatValidator,
  audioResourceFormatValidator,
  videoResourceFormatValidator,
  articleOnlineFormatValidator,
};
