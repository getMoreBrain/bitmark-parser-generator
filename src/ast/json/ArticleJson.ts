import { BitBitJson } from './BitBitJson';
import { PlaceholdersJson } from './PlaceholdersJson';
import { ResourceJson } from './ResourceJson';

export interface ArticleJson extends BitBitJson {
  type: 'article';
  body: string;
  instruction?: string; // Not always present!
  placeholders?: PlaceholdersJson;
  resource?: ResourceJson;
}
