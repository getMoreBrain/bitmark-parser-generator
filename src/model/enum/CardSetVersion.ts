import { type EnumType } from '@ncoderz/superenum';

const CardSetVersion = {
  v1: 1,
  v2: 2,
} as const;

export type CardSetVersionType = EnumType<typeof CardSetVersion>;

export { CardSetVersion };
