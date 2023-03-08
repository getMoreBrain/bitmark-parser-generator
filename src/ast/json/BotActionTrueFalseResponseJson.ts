import { BotResponseJson } from './BotResponseJson';

export interface BotActionTrueFalseResponseJson extends BotResponseJson {
  response: string;
  isCorrect: boolean;
}
