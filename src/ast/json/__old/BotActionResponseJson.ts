import { BitBitJson } from './BitBitJson';
import { BotActionStringResponseJson } from './BotActionStringResponseJson';

export interface BotActionResponseJson extends BitBitJson {
  type: 'bot-action-response';
  body: string;
  instruction?: string; // not always present
  item: string;
  // lead?: string; // not always present
  hint: string;
  isExample: boolean;
  example: string;
  responses: BotActionStringResponseJson[];
}
