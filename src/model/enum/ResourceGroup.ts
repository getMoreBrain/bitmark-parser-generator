import { type EnumType } from '@ncoderz/superenum';

/**
 * PLAN-020: Resource group keys.
 *
 * Resource groups are search/filter categories over {@link ResourceType} values (canonical
 * kebab-case values only — consumers normalize legacy camelCase spellings such as
 * `imageLink` before matching). Keys are adopted verbatim from the historical book-service
 * `bit-types.js` `resourceTypes` map.
 */
const ResourceGroup = {
  app: 'app',
  article: 'article',
  audio: 'audio',
  document: 'document',
  image: 'image',
  stillImageFilm: 'still-image-film',
  video: 'video',
  website: 'website',
} as const;

export type ResourceGroupType = EnumType<typeof ResourceGroup>;

export { ResourceGroup };
