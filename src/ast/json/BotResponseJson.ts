export interface BotResponseJson {
  response: string | number;
  reaction: string;
  item: string;
  feedback: string;
  hint?: string;
}
