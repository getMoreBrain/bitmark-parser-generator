import { type _ResourceGroupsConfig } from '../../model/config/_Config.ts';
import { ResourceGroup } from '../../model/enum/ResourceGroup.ts';
import { ResourceType } from '../../model/enum/ResourceType.ts';

/**
 * PLAN-020: Resource-group registry.
 *
 * Resource groups are search/filter categories over resource types. Membership is central
 * (unlike bit groups) because {@link ResourceType} values have no per-item config to
 * annotate. Members are canonical kebab-case values ONLY — consumers must normalize legacy
 * camelCase spellings (`imageLink` → `image-link`) before matching (D10).
 *
 * Keys were adopted verbatim from the book-service `bit-types.js` `resourceTypes` map;
 * bit-type entries in those historical lists (e.g. `photo`, `screenshot`) are covered by
 * bit groups instead and are NOT seeded here.
 *
 * English display names (`title`) live here; other languages come from the
 * `./translations` subpath export.
 */
const RESOURCE_GROUPS: _ResourceGroupsConfig = {
  [ResourceGroup.app]: {
    since: '5.39.0',
    description: 'App resources',
    title: 'App',
    resourceTypes: [ResourceType.appLink],
  },
  [ResourceGroup.article]: {
    since: '5.39.0',
    description: 'Article resources',
    title: 'Article',
    resourceTypes: [ResourceType.article, ResourceType.articleEmbed, ResourceType.articleLink],
  },
  [ResourceGroup.audio]: {
    since: '5.39.0',
    description: 'Audio resources',
    title: 'Audio',
    resourceTypes: [ResourceType.audio, ResourceType.audioEmbed, ResourceType.audioLink],
  },
  [ResourceGroup.document]: {
    since: '5.39.0',
    description: 'Document resources',
    title: 'Document',
    resourceTypes: [
      ResourceType.document,
      ResourceType.documentDownload,
      ResourceType.documentEmbed,
      ResourceType.documentLink,
    ],
  },
  [ResourceGroup.image]: {
    since: '5.39.0',
    description: 'Image resources',
    title: 'Image',
    resourceTypes: [
      ResourceType.image,
      ResourceType.imageEmbed,
      ResourceType.imageLandscape,
      ResourceType.imageLink,
      ResourceType.imagePortrait,
      ResourceType.imageResponsive,
    ],
  },
  [ResourceGroup.stillImageFilm]: {
    since: '5.39.0',
    description: 'Still-image film resources',
    title: 'Still image film',
    resourceTypes: [
      ResourceType.stillImageFilm,
      ResourceType.stillImageFilmEmbed,
      ResourceType.stillImageFilmLink,
    ],
  },
  [ResourceGroup.video]: {
    since: '5.39.0',
    description:
      'Video resources (incl. still-image film variants, per the historical book-service grouping)',
    title: 'Video',
    resourceTypes: [
      ResourceType.stillImageFilmEmbed,
      ResourceType.stillImageFilmLink,
      ResourceType.video,
      ResourceType.videoEmbed,
      ResourceType.videoLink,
    ],
  },
  [ResourceGroup.website]: {
    since: '5.39.0',
    description: 'Website resources',
    title: 'Website',
    resourceTypes: [ResourceType.websiteLink],
  },
};

export { RESOURCE_GROUPS };
