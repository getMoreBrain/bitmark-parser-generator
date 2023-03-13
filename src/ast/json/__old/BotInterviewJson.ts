import { BitBitJson } from './BitBitJson';
import { PlaceholdersJson } from './PlaceholdersJson';
import { ResourceJson } from './ResourceJson';

export interface BotInterviewJson extends BitBitJson {
  type: 'bot-interview';
  body: string;
  instruction?: string; // not always present
  item: string;
  // lead?: string; // not always present
  hint: string;
  isExample: boolean;
  example: string;
  placeholders?: PlaceholdersJson;
  resource?: ResourceJson;
}
