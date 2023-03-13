import { BitBitJson } from './BitBitJson';
import { ChatItemJson } from './ChatItemJson';
import { ChatPersonJson } from './ChatPersonJson';
import { ResourceJson } from './ResourceJson';

export interface ChatJson extends BitBitJson {
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
