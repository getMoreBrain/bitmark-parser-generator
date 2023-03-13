import { ArticleResourceFormatType } from '../types/ArticleResourceFormat';

import { ResourceJson } from './ResourceJson';

export interface ArticleResourceJson extends ResourceJson {
  type: 'article';
  href: string;
  format: ArticleResourceFormatType; // bitmark--- / bitmark++ ????
  body: string;
}
