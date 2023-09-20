import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * The key of the property in AST.
 *
 * Only keys that vary from the markup default are included.
 */
const PropertyAstKey = superenum({
  aiGenerated: 'aiGenerated',
  caseSensitive: 'isCaseSensitive',
  level: 'levelProperty',
  reference: 'referenceProperty',
  shortAnswer: 'isShortAnswer',
});

export type PropertyAstKeyType = EnumType<typeof PropertyAstKey>;

export { PropertyAstKey };
