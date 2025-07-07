import { type EnumType, superenum } from '@ncoderz/superenum';

/**
 * The location of text.
 *
 * The location of the text affects how breakscaping is applied.
 */
const TextLocation = superenum({
  tag: 'tag',
  body: 'body',
});

export type TextLocationType = EnumType<typeof TextLocation>;

export { TextLocation };
