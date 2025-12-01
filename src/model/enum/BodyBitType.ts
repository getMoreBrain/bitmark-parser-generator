import { type EnumType } from '@ncoderz/superenum';

const BodyBitTypeRaw = {
  text: 'text',
  gap: 'gap',
  mark: 'mark',
  select: 'select',
  highlight: 'highlight',
} as const;

const BodyBitType = BodyBitTypeRaw;

export type BodyBitTypeKeys = keyof typeof BodyBitTypeRaw;
export type BodyBitTypeType = EnumType<typeof BodyBitType>;

export { BodyBitType };
