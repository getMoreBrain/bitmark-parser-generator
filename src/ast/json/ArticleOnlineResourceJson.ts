import { ArticleResourceFormatType } from '../types/ArticleResourceFormat';

import { ResourceJson } from './ResourceJson';

export interface ArticleOnlineResourceJson extends ResourceJson {
  type: 'article-online';
  url: string;
  format: ArticleResourceFormatType;
  body: string;
}
