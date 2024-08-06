import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * The key of the property in AST.
 *
 * Only keys that vary from the markup default are included.
 */
const PropertyAstKey = superenum({
  ast_isCaseSensitive: 'isCaseSensitive',
  ast_referenceProperty: 'referenceProperty',
  ast_markConfig: 'markConfig',
  ast_productList: 'productList',
  ast_productVideoList: 'productVideoList',
});

export type PropertyAstKeyType = EnumType<typeof PropertyAstKey>;

export { PropertyAstKey };
