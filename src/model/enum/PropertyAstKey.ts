import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * The key of the property in AST.
 *
 * Only keys that vary from the markup default are included.
 */
const PropertyAstKey = superenum({
  aiGenerated: 'aiGenerated',
  isCaseSensitive: 'isCaseSensitive',
  referenceProperty: 'referenceProperty',
  isShortAnswer: 'isShortAnswer',
  markConfig: 'markConfig',
});

export type PropertyAstKeyType = EnumType<typeof PropertyAstKey>;

export { PropertyAstKey };
