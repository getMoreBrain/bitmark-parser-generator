import { EnumType, superenum } from '@ncoderz/superenum';

const AudioResourceFormat = superenum({
  mp3: 'mp3',
  wmv: 'wmv',
});

export type AudioResourceFormatType = EnumType<typeof AudioResourceFormat>;

export { AudioResourceFormat };
