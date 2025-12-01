import { type EnumType } from '@ncoderz/superenum';

const InfoFormat = {
  text: 'text',
  json: 'json',
  pojo: 'pojo',
} as const;

export type InfoFormatType = EnumType<typeof InfoFormat>;

export { InfoFormat };
