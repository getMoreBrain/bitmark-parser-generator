import { EnumType, superenum } from '@ncoderz/superenum';

const BodyBitTypeRaw = {
  gap: 'gap',
  select: 'select',
  highlight: 'highlight',
} as const;

const BodyBitType = superenum(BodyBitTypeRaw);

export type BodyBitTypeKeys = keyof typeof BodyBitTypeRaw;
export type BodyBitTypeType = EnumType<typeof BodyBitType>;

export { BodyBitType };
