import { BitBitJson } from './BitBitJson';
import { BotActionRatingNumberResponseJson } from './BotActionRatingNumberResponseJson';

export interface BotActionRatingNumberJson extends BitBitJson {
  type: 'bot-action-rating-number';
  body: string;
  instruction: string; // not always present
  item: string;
  // lead?: string; // not always present
  hint: string;
  isExample: boolean;
  example: string;
  ratingStart: number;
  ratingEnd: number;
  responses: BotActionRatingNumberResponseJson[];
}
