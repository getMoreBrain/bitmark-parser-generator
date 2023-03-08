import { EnumType, superenum } from '@ncoderz/superenum';

const ArticleResourceFormat = superenum({
  html: 'html',
});

export type ArticleResourceFormatType = EnumType<typeof ArticleResourceFormat>;

export { ArticleResourceFormat };
