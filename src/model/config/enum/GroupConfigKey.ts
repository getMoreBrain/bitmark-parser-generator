import { EnumType, superenum } from '@ncoderz/superenum';

const GroupConfigKey = superenum({
  _unknown: '_unknown',

  _standardAllBits: '_standardAllBits',
  _standardItemLeadInstructionHint: '_standardItemLeadInstructionHint',
  _standardExample: '_standardExample',
  _standardTags: '_standardTags',
  _imageSource: '_imageSource',
  _partner: '_partner',
  _gap: '_gap',
  _trueFalse: '_trueFalse',
  _markConfig: '_markConfig',
  _mark: '_mark',
  _learningPathCommon: '_learningPathCommon',
  _resourceCommon: '_resourceCommon',
  _resourceImageCommon: '_resourceImageCommon',
  _resourceAudioCommon: '_resourceAudioCommon',
  _resourceVideoCommon: '_resourceVideoCommon',
  _resourceImage: '_resourceImage',
  _resourceImageEmbed: '_resourceImageEmbed',
  _resourceImageLink: '_resourceImageLink',
  _resourceImageResponsive: '_resourceImageResponsive', // Combo resource
  _resourceImagePortrait: '_resourceImagePortrait',
  _resourceImageLandscape: '_resourceImageLandscape',
  _resourceAudio: '_resourceAudio',
  _resourceAudioEmbed: '_resourceAudioEmbed',
  _resourceAudioLink: '_resourceAudioLink',
  _resourceVideo: '_resourceVideo',
  _resourceVideoEmbed: '_resourceVideoEmbed',
  _resourceVideoLink: '_resourceVideoLink',
  _resourceStillImageFilm: '_resourceStillImageFilm', // Combo resource
  _resourceStillImageFilmEmbed: '_resourceStillImageFilmEmbed',
  _resourceStillImageFilmLink: '_resourceStillImageFilmLink',
  _resourceArticle: '_resourceArticle',
  _resourceArticleEmbed: '_resourceArticleEmbed',
  _resourceArticleLink: '_resourceArticleLink',
  _resourceDocument: '_resourceDocument',
  _resourceDocumentEmbed: '_resourceDocumentEmbed',
  _resourceDocumentLink: '_resourceDocumentLink',
  _resourceDocumentDownload: '_resourceDocumentDownload',
  _resourceAppLink: '_resourceAppLink',
  _resourceWebsiteLink: '_resourceWebsiteLink',
});

export type GroupConfigKeyType = EnumType<typeof GroupConfigKey>;

export { GroupConfigKey };
