/**
 * PLAN-020: Shape of the translated display-name data provided by the `./translations`
 * subpath export.
 *
 * Keyed by bit type / bit-group key / resource-group key; each entry maps BCP-47 language
 * tags to the translated display name. English (`en`) is not required here — the English
 * name lives inline in the configs (`title`); lookups fall back
 * `de-CH` → `de` → `en` (inline title) → technical key.
 */
export type TranslationsData = {
  [bitTypeOrGroupKey: string]: { [bcp47LanguageTag: string]: string };
};
