/**
 * PLAN-020: `./translations` subpath export.
 *
 * Translated (non-English) display names for bit types, bit groups, and resource groups.
 * Kept out of the main bundle for size — import and register explicitly:
 *
 * ```ts
 * import { BitmarkParserGenerator } from '@gmb/bitmark-parser-generator';
 * import { TRANSLATIONS } from '@gmb/bitmark-parser-generator/translations';
 *
 * const bpg = new BitmarkParserGenerator();
 * bpg.registerTranslations(TRANSLATIONS);
 * bpg.getBitGroupTitle('tables', 'de'); // 'Tabellen'
 * ```
 */
export { TRANSLATIONS } from './config/raw/translations.ts';
export type { TranslationsData } from './model/TranslationsData.ts';
