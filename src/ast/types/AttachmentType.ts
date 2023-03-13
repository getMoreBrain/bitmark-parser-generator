import { EnumType, superenum } from '@ncoderz/superenum';

const AttachmentType = superenum({
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

export type AttachmentTypeType = EnumType<typeof AttachmentType>;

export { AttachmentType };
