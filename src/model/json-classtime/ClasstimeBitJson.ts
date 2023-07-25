import { Text } from '../ast/TextNodes';

import { ClasstimeBodyBitsJson, ClasstimeChoiceJson, ClasstimeClozeJson } from './ClasstimeBodyBitJson';
import { AudioResourceJson, ImageResourceJson, ResourceJson } from './ResourceJson';

export interface ClasstimeBitJson {
  // format: string; // bit format

  // Properties
  id: string | string[];
  title: Text;
  image: string | null;
  image_details: {
    public_id: '';
    content: null;
    url: '';
    owner: null;
    source: '';
    is_protected: null;
  };
  content: ClasstimeContentJson | null; // ?
  raw_content: Text | null;
  hotspot_data: string | null; // ?
  kind: string; // bit type
  categories: unknown[];
  items: unknown[];
  explanation: ClasstimeExplanationJson | null; // ?
  choices: ClasstimeChoiceJson[];
  clozes: ClasstimeClozeJson[];
  is_true_correct: boolean | null; // ?
  modified: string;
  created: string;
  question_set: string | null;
  weight: string;
  is_poll: boolean;
  video: string;
  tags: unknown[];
  locks: unknown[];
  audio: string | null; // ?
  is_archived: boolean;
  gap_text: string | null; // ?
  gaps: string | null; // ?

  externalId: string | string[];
  spaceId: string | string[];
  padletId: string | string[];
  AIGenerated: boolean;
  releaseVersion: string | string[];
  ageRange: number | number[];
  language: string | string[];
  computerLanguage: string | string[];
  subtype: string | string[];
  coverImage: string | string[];
  publisher: string | string[];
  publications: string | string[];
  author: string | string[];
  subject: string | string[];
  date: string | string[];
  location: string | string[];
  theme: string | string[];
  // kind: string | string[];
  action: string | string[];
  thumbImage: string | string[];
  focusX: number;
  focusY: number;
  duration: string | string[];
  deeplink: string | string[];
  externalLink: string;
  externalLinkText: string;
  videoCallLink: string | string[];
  bot: string | string[];
  list: string | string[];
  textReference: string;
  isTracked: boolean; // only .learningPathExternalLink?
  isInfoOnly: boolean; // only .learningPathExternalLink?
  labelTrue: string;
  labelFalse: string;
  quotedPerson: string;

  book: string;

  // title: Text;
  subtitle: Text;
  level: number;
  toc: boolean;
  progress: boolean;
  anchor: string;
  reference: string | string[]; // Has 2 meanings, depending on bit (anchor/reference, or @reference)
  referenceEnd: string;

  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;

  partner: PartnerJson;

  // NEW property - not in the ANTLR parser
  extraProperties: {
    [key: string]: unknown | unknown[];
  };
  resource: ResourceJson;
  body: Text;

  sampleSolution: string;
  partialAnswer: string;
  elements: string[];
  statement: string;
  isCorrect: boolean;
  statements: StatementJson[];
  responses: ResponseJson[] | BotResponseJson[];
  quizzes: QuizJson[];
  heading: HeadingJson;
  pairs: PairJson[];
  matrix: MatrixJson[];
  // choices: ChoiceJson[];
  questions: QuestionJson[];
  footer: Text;
  placeholders: ClasstimeBodyBitsJson;
}

export interface ClasstimeContentJson {
  blocks: ClasstimeContentBlockJson[];
  entityMap: {};
}

export interface ClasstimeContentBlockJson {
  key: string;
  text: string;
  type: string;
  depth: 0;
  inlineStyleRanges: [];
  entityRanges: [];
  data: {};
}

export interface ClasstimeExplanationJson {
  blocks: ClasstimeExplanationBlockJson[];
  entityMap: {};
}

export interface ClasstimeExplanationBlockJson {
  key: string;
  text: string;
  type: string;
  depth: 0;
  inlineStyleRanges: [];
  entityRanges: [];
  data: {};
}

export interface PartnerJson {
  name: string;
  avatarImage: ImageResourceJson;
}

export interface StatementJson {
  statement: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
}

export interface ChoiceJson {
  choice: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
}

export interface ResponseJson {
  response: string;
  isCorrect: boolean;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
}

export interface QuizJson {
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  choices: ChoiceJson[];
  responses: ResponseJson[];
}

export interface HeadingJson {
  forKeys: string;
  forValues: string | string[];
}

export interface PairJson {
  key: string;
  keyAudio: AudioResourceJson;
  keyImage: ImageResourceJson;
  values: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
}

export interface MatrixJson {
  key: string;
  cells: MatrixCellJson[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
  isLongAnswer: boolean;
}

export interface MatrixCellJson {
  values: string[];
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
}

export interface QuestionJson {
  question: string;
  partialAnswer: string;
  sampleSolution: string;
  item: Text;
  lead: Text;
  hint: Text;
  instruction: Text;
  isExample: boolean;
  example: Text;
  isCaseSensitive: boolean;
  isShortAnswer: boolean;
}

export interface BotResponseJson {
  response: string;
  reaction: string;
  feedback: string;
  item: Text;
  lead: Text;
  hint: Text;
}
