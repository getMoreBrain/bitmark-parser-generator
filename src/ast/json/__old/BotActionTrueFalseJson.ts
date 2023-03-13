import { BitBitJson } from './BitBitJson';
import { BotActionTrueFalseResponseJson } from './BotActionTrueFalseResponseJson';

export interface BotActionTrueFalseJson extends BitBitJson {
  type: 'bot-action-true-false';
  body: string;
  instruction?: string; // not always present
  item: string;
  // lead?: string; // not always present
  hint: string;
  isExample: boolean;
  example: string;
  footer: string;
  responses: BotActionTrueFalseResponseJson[];
}
