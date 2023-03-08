import { EnumType, superenum } from '@ncoderz/superenum';

const VideoResourceFormat = superenum({
  mov: 'mov',
});

export type VideoResourceFormatType = EnumType<typeof VideoResourceFormat>;

export { VideoResourceFormat };
