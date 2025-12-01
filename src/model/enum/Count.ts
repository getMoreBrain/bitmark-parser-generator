import { type EnumType } from '@ncoderz/superenum';

const Count = {
  infinity: 'infinity',
} as const;

export type CountType = EnumType<typeof Count> | number;

export { Count };
