import { EnumType, superenum } from '@ncoderz/superenum';

const CodeFormat = superenum({
  javascript: 'javascript',
});

export type CodeFormatType = EnumType<typeof CodeFormat>;

export { CodeFormat };
