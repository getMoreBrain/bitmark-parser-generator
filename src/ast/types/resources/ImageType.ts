import { EnumType, superenum } from '@ncoderz/superenum';

const ImageType = superenum({
  basic: 'basic',
  jpg: 'jpg',
  png: 'png',
  gif: 'gif',
  svg: 'svg',
});

export type AttachmeImageTypeType = EnumType<typeof ImageType>;

export { ImageType };
