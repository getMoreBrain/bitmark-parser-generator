import { EnumType, superenum } from '@ncoderz/superenum';

const ImageResourceFormat = superenum({
  jpg: 'jpg',
});

export type ImageResourceFormatType = EnumType<typeof ImageResourceFormat>;

export { ImageResourceFormat };
