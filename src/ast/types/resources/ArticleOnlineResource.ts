import { ArticleResourceFormatType } from './ArticleResourceFormat';

export interface ArticleOnlineResource {
  src: string;
  format: ArticleResourceFormatType;
  url: string;
  body?: string;
  // alt?: string;
  // caption?: string;
  // license?: string;
  // copyright?: string;
  // showInIndex?: boolean;
}
