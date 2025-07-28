import { type EnumType, superenum } from '@ncoderz/superenum';

const groupKeys = {
  group_standardAllBits: 'group_standardAllBits',
  group_standardItemLeadInstructionHint: 'group_standardItemLeadInstructionHint',
  group_standardTags: 'group_standardTags',
  group_imageSource: 'group_imageSource',
  group_technicalTerm: 'group_technicalTerm',
  group_person: 'group_person',
  group_gap: 'group_gap',
  group_trueFalse: 'group_trueFalse',
  group_markConfig: 'group_markConfig',
  group_mark: 'group_mark',
  group_bookCommon: 'group_bookCommon',
  group_learningPathCommon: 'group_learningPathCommon',
  group_quizCommon: 'group_quizCommon',
  group_resourceBitTags: 'group_resourceBitTags',
  group_resourceCommon: 'group_resourceCommon',
  group_resourceImageCommon: 'group_resourceImageCommon',
  group_resourceAudioCommon: 'group_resourceAudioCommon',
  group_resourceVideoCommon: 'group_resourceVideoCommon',
  group_resourceIcon: 'group_resourceIcon', // Alias for image
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

const GroupKey = superenum(groupKeys);

export type GroupKeyType = EnumType<typeof GroupKey>;

export { GroupKey, groupKeys };
