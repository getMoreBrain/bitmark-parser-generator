/**
 * Centralized regex and replacer constants for breakscape and unbreakscape.
 * Extracted from breakscape-regex.ts to simplify core logic.
 */

export const REGEX_MARKS = /([*`_!=])(?=\1)/; // BM_TAG: $1^  --BODY: $1^  ++BODY: $1^
export const REGEX_BLOCKS = /^(\|)(code[\s]*|code:|image:|[\s]*$)/; // ++BODY: $2^$3
export const REGEX_TITLE_BLOCKS = /^([#]{1,3})([^\S\r\n]+)/; // ++BODY: $4^$5
export const REGEX_LIST_BLOCKS = /^(•)([0-9]+[iI]*|[a-zA-Z]{1}|_|\+|-|)([^\S\r\n]+)/; // ++BODY: $6^$7$8
export const REGEX_START_OF_TAG = /(\[)([.@#▼►%!?+\-$_=&])/; // --BODY: $2^$3  ++BODY: $9^$10
export const REGEX_FOOTER_DIVIDER = /^(~)(~~~[ \t]*)$/; // --BODY: $4^$5  ++BODY: $11^$12
export const REGEX_PLAIN_TEXT_DIVIDER = /^(\$)(\$\$\$[ \t]*)$/; // --BODY: $6^$7  ++BODY: $13^$14
export const REGEX_END_OF_TAG = /(\^*])/; // BM_TAG: ^$2  PLAIN_TAG: ^$1
export const REGEX_BIT_START = /^(\[)(\^*)(\.)/; // PLAIN_BODY: $1^$2$3
export const REGEX_HATS = /(\^+)/; // BM_TAG: $3^  PLAIN_TAG: $2^  --BODY: ^$8  ++BODY: $15^  // Must be last

export const BREAKSCAPE_BITMARK_TAG_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_END_OF_TAG.source}|${REGEX_HATS.source}`;
export const BREAKSCAPE_PLAIN_TAG_REGEX_SOURCE = `${REGEX_END_OF_TAG.source}|${REGEX_HATS.source}`;
export const BREAKSCAPE_BITMARK_BODY_REGEX_SOURCE = `${REGEX_MARKS.source}|${REGEX_BLOCKS.source}|${REGEX_TITLE_BLOCKS.source}|${REGEX_LIST_BLOCKS.source}|${REGEX_START_OF_TAG.source}|${REGEX_FOOTER_DIVIDER.source}|${REGEX_PLAIN_TEXT_DIVIDER.source}|${REGEX_HATS.source}`;
export const BREAKSCAPE_PLAIN_BODY_REGEX_SOURCE = `${REGEX_BIT_START.source}`;

export const BREAKSCAPE_BITMARK_TAG_REGEX = new RegExp(BREAKSCAPE_BITMARK_TAG_REGEX_SOURCE, 'gm');
export const BREAKSCAPE_BITMARK_TAG_REGEX_REPLACER = '$1$3^$2';

export const BREAKSCAPE_PLAIN_TAG_REGEX = new RegExp(BREAKSCAPE_PLAIN_TAG_REGEX_SOURCE, 'gm');
export const BREAKSCAPE_PLAIN_TAG_REGEX_REPLACER = '$2^$1';

export const BREAKSCAPE_BITMARK_BODY_REGEX = new RegExp(BREAKSCAPE_BITMARK_BODY_REGEX_SOURCE, 'gm');
export const BREAKSCAPE_BITMARK_BODY_REGEX_REPLACER = '$1$2$4$6$9$11$13$15^$3$5$7$8$10$12$14';

export const BREAKSCAPE_PLAIN_BODY_REGEX = new RegExp(BREAKSCAPE_PLAIN_BODY_REGEX_SOURCE, 'gm');
export const BREAKSCAPE_PLAIN_BODY_REGEX_REPLACER = '$1^$2$3';

export const BREAKSCAPE_V2_BODY_REGEX = new RegExp('^(?:(\\[)(\\^*)(\\.))|(\\^+)', 'gm');
export const BREAKSCAPE_V2_BODY_REGEX_REPLACER = '$1$4^$2$3';

export const UNBREAKSCAPE_REGEX = new RegExp('\\^([\\^]*)', 'gm');
export const UNBREAKSCAPE_REGEX_REPLACER = '$1';

export const UNBREAKSCAPE_PLAIN_IN_BODY_REGEX = new RegExp('^(\\[)\\^(\\^*)(\\.)', 'gm');
export const UNBREAKSCAPE_PLAIN_IN_BODY_REGEX_REPLACER = '$1$2$3';

export const BREAKSCAPE_CODE_REGEX = new RegExp('^(\\||•|#)', 'gm');
export const BREAKSCAPE_CODE_REGEX_REPLACER = '$1^';
