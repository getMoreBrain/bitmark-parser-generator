import { BitJson } from './BitJson';
import { ChatItemJson } from './ChatItemJson';
import { ChatPersonJson } from './ChatPersonJson';
import { ResourceJson } from './ResourceJson';

export interface ConversationJson extends BitJson {
  type: 'chat';
  body: string;
  instruction?: string;
  item: string;
  // lead?: string;
  hint: string;
  initiator: ChatPersonJson;
  partner: ChatPersonJson;
  chat: ChatItemJson[];
  resource?: ResourceJson;
}
