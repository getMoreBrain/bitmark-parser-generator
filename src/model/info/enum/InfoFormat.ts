import { type EnumType, superenum } from '@ncoderz/superenum';

const InfoFormat = superenum({
  text: 'text',
  json: 'json',
  pojo: 'pojo',
});

export type InfoFormatType = EnumType<typeof InfoFormat>;

export { InfoFormat };
