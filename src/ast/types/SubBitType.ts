import { EnumType, superenum } from '@ncoderz/superenum';

const SubBitType = superenum({
  app: 'app',
  document: 'document',
  documentOnline: 'document-online',
  article: 'article',
  articleOnline: 'article-online',
  image: 'image',
  imageOnline: 'image-online',
  imageZoom: 'image-zoom',
  audio: 'audio',
  audioOnline: 'audio-online',
  video: 'video',
  videoOnline: 'video-online',
});

export type SubBitTypeType = EnumType<typeof SubBitType>;

export { SubBitType };
