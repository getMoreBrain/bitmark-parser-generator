import { type EnumType, superenum } from '@ncoderz/superenum';

const CardSetVersion = superenum({
  v1: 1,
  v2: 2,
});

export type CardSetVersionType = EnumType<typeof CardSetVersion>;

export { CardSetVersion };
