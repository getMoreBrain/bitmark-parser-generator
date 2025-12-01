import { type EnumType } from '@ncoderz/superenum';

/**
 * The location of text.
 *
 * The location of the text affects how breakscaping is applied.
 */
const TextLocation = {
  tag: 'tag',
  body: 'body',
} as const;

export type TextLocationType = EnumType<typeof TextLocation>;

export { TextLocation };
