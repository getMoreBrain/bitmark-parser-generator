import { type EnumType, superenum } from '@ncoderz/superenum';

const Count = superenum({
  infinity: 'infinity',
});

export type CountType = EnumType<typeof Count> | number;

export { Count };
