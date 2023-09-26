import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Config keys for groups
 */
const groupConfigKeys = {
  group_standardAllBits: 'group_standardAllBits',
  group_standardItemLeadInstructionHint: 'group_standardItemLeadInstructionHint',
  group_standardExample: 'group_standardExample',
  group_standardTags: 'group_standardTags',
  group_imageSource: 'group_imageSource',
  group_partner: 'group_partner',
  group_gap: 'group_gap',
  group_trueFalse: 'group_trueFalse',
  group_markConfig: 'group_markConfig',
  group_mark: 'group_mark',
  group_learningPathCommon: 'group_learningPathCommon',
  group_resourceCommon: 'group_resourceCommon',
  group_resourceImageCommon: 'group_resourceImageCommon',
  group_resourceAudioCommon: 'group_resourceAudioCommon',
  group_resourceVideoCommon: 'group_resourceVideoCommon',
  group_resourceImage: 'group_resourceImage',
  group_resourceImageEmbed: 'group_resourceImageEmbed',
  group_resourceImageLink: 'group_resourceImageLink',
  group_resourceImageResponsive: 'group_resourceImageResponsive', // Combo resource
  group_resourceImagePortrait: 'group_resourceImagePortrait',
  group_resourceImageLandscape: 'group_resourceImageLandscape',
  group_resourceAudio: 'group_resourceAudio',
  group_resourceAudioEmbed: 'group_resourceAudioEmbed',
  group_resourceAudioLink: 'group_resourceAudioLink',
  group_resourceVideo: 'group_resourceVideo',
  group_resourceVideoEmbed: 'group_resourceVideoEmbed',
  group_resourceVideoLink: 'group_resourceVideoLink',
  group_resourceStillImageFilm: 'group_resourceStillImageFilm', // Combo resource
  group_resourceStillImageFilmEmbed: 'group_resourceStillImageFilmEmbed',
  group_resourceStillImageFilmLink: 'group_resourceStillImageFilmLink',
  group_resourceArticle: 'group_resourceArticle',
  group_resourceArticleEmbed: 'group_resourceArticleEmbed',
  group_resourceArticleLink: 'group_resourceArticleLink',
  group_resourceDocument: 'group_resourceDocument',
  group_resourceDocumentEmbed: 'group_resourceDocumentEmbed',
  group_resourceDocumentLink: 'group_resourceDocumentLink',
  group_resourceDocumentDownload: 'group_resourceDocumentDownload',
  group_resourceAppLink: 'group_resourceAppLink',
  group_resourceWebsiteLink: 'group_resourceWebsiteLink',
} as const;

const GroupConfigKey = superenum(groupConfigKeys);

export type GroupConfigKeyType = EnumType<typeof GroupConfigKey>;

export { GroupConfigKey, groupConfigKeys };
