import { EnumType, superenum } from '@ncoderz/superenum';

const ImageResourceFormat = superenum({
  jpg: 'jpg',
  png: 'png',
});

export type ImageResourceFormatType = EnumType<typeof ImageResourceFormat>;

export { ImageResourceFormat };
