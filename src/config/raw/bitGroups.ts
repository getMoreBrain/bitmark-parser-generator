import { type _BitGroupsConfig } from '../../model/config/_Config.ts';
import { BitGroup } from '../../model/enum/BitGroup.ts';

/**
 * PLAN-020: Bit-group registry.
 *
 * Bit groups are search/filter categories over bit types. Group KEYS and their member bit
 * types were adopted verbatim from the book-service `bit-types.js` lists (ticket 9407) so
 * existing `g=<key>` search queries keep working; rename via `aliases`, never by changing a
 * key.
 *
 * Membership is declared per bit (`bitGroups` in `bits.ts`) — this registry defines the
 * groups themselves. The group→bitTypes direction is derived and cached in `Config`.
 *
 * `subgroupOf` is informational metadata only (e.g. for deriving quiz categories): it does
 * NOT imply membership — every member of a subgroup must also declare the parent group
 * (enforced by the config validation tests).
 *
 * English display names (`title`) live here; other languages come from the
 * `./translations` subpath export.
 */
const BIT_GROUPS: _BitGroupsConfig = {
  [BitGroup.assignment]: {
    since: '5.39.0',
    description: 'Assignment bits',
    title: 'Assignment',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.authors]: {
    since: '5.39.0',
    description: 'Author bits',
    title: 'Authors',
  },
  [BitGroup.botAction]: {
    since: '5.39.0',
    description: 'Bot action bits',
    title: 'Bot Action',
  },
  [BitGroup.bots]: {
    since: '5.39.0',
    description: 'Bot bits',
    title: 'Bots',
  },
  [BitGroup.chat]: {
    since: '5.39.0',
    description: 'Chat bits',
    title: 'Chat',
  },
  [BitGroup.cloze]: {
    since: '5.39.0',
    description: 'Cloze (fill-in-the-blank) quiz bits',
    title: 'Cloze',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.conversation]: {
    since: '5.39.0',
    description: 'Conversation bits',
    title: 'Conversation',
  },
  [BitGroup.cooking]: {
    since: '5.39.0',
    description: 'Cooking / recipe content bits',
    title: 'Cooking',
  },
  [BitGroup.correction]: {
    since: '5.39.0',
    description: 'Correction quiz bits',
    title: 'Correction',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.documentUpload]: {
    since: '5.39.0',
    description: 'Document upload task bits',
    title: 'Document Upload',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.essay]: {
    since: '5.39.0',
    description: 'Essay quiz bits',
    title: 'Essay',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.extractor]: {
    since: '5.39.0',
    description: 'Extractor bits (PDF / document extraction)',
    title: 'Extractor',
  },
  [BitGroup.flashcard]: {
    since: '5.39.0',
    description: 'Flashcard quiz bits',
    title: 'Flashcard',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.group]: {
    since: '5.39.0',
    description:
      'Grouping bits (no current bit type is a member; key kept for consumer compatibility)',
    title: 'Group',
    allowEmpty: true,
  },
  [BitGroup.highlightText]: {
    since: '5.39.0',
    description: 'Highlight text quiz bits',
    title: 'Highlight Text',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.interview]: {
    since: '5.39.0',
    description: 'Interview quiz bits',
    title: 'Interview',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.learningPath]: {
    since: '5.39.0',
    description: 'Learning path bits',
    title: 'Learning Path',
  },
  [BitGroup.mark]: {
    since: '5.39.0',
    description: 'Mark quiz bits',
    title: 'Mark',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.match]: {
    since: '5.39.0',
    description: 'Match quiz bits',
    title: 'Match',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.message]: {
    since: '5.39.0',
    description: 'Message bits',
    title: 'Message',
  },
  [BitGroup.multipleChoice]: {
    since: '5.39.0',
    description: 'Multiple choice quiz bits',
    title: 'Multiple Choice',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.multipleResponse]: {
    since: '5.39.0',
    description: 'Multiple response quiz bits',
    title: 'Multiple Response',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.nonProduction]: {
    since: '5.39.0',
    description: 'Bits not for production use',
    title: 'Not for Production',
  },
  [BitGroup.other]: {
    since: '5.39.0',
    description: 'Other bits (aliases, chapters)',
    title: 'Other',
  },
  [BitGroup.pages]: {
    since: '5.39.0',
    description: 'Page bits',
    title: 'Pages',
  },
  [BitGroup.preparationNote]: {
    since: '5.39.0',
    description: 'Preparation note task bits',
    title: 'Preparation Note',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.quizzes]: {
    since: '5.39.0',
    description: 'All quiz / interactive task bits',
    title: 'Quizzes',
  },
  [BitGroup.rating]: {
    since: '5.39.0',
    description: 'Rating bits',
    title: 'Rating',
    subgroupOf: BitGroup.surveys,
  },
  [BitGroup.recipes]: {
    since: '5.39.0',
    description: 'Recipe bits',
    title: 'Recipes',
  },
  [BitGroup.recordAudio]: {
    since: '5.39.0',
    description: 'Record audio task bits',
    title: 'Record Audio',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.reviewErrors]: {
    since: '5.39.0',
    description: 'Review bits indicating review errors',
    title: 'Review Errors',
    subgroupOf: BitGroup.reviews,
  },
  [BitGroup.reviews]: {
    since: '5.39.0',
    description: 'Review workflow bits',
    title: 'Reviews',
  },
  [BitGroup.selfAssessment]: {
    since: '5.39.0',
    description: 'Self-assessment bits',
    title: 'Self Assessment',
    subgroupOf: BitGroup.surveys,
  },
  [BitGroup.sequence]: {
    since: '5.39.0',
    description: 'Sequence quiz bits',
    title: 'Sequence',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.set]: {
    since: '5.39.0',
    description: 'Set bits (no current bit type is a member; key kept for consumer compatibility)',
    title: 'Set',
    allowEmpty: true,
  },
  [BitGroup.static]: {
    since: '5.39.0',
    description: 'Static (non-interactive) content bits',
    title: 'Static Content',
  },
  [BitGroup.steps]: {
    since: '5.39.0',
    description: 'Step bits',
    title: 'Steps',
  },
  [BitGroup.survey]: {
    since: '5.39.0',
    description: 'Simple survey bits',
    title: 'Survey',
    subgroupOf: BitGroup.surveys,
  },
  [BitGroup.surveyAnonymous]: {
    since: '5.39.0',
    description: 'Anonymous survey bits',
    title: 'Survey Anonymous',
    subgroupOf: BitGroup.surveys,
  },
  [BitGroup.surveys]: {
    since: '5.39.0',
    description: 'All survey-like bits (surveys, self-assessments, ratings)',
    title: 'Surveys',
  },
  [BitGroup.tables]: {
    since: '5.39.0',
    description: 'Table bits',
    title: 'Tables',
  },
  [BitGroup.takePicture]: {
    since: '5.39.0',
    description: 'Take picture task bits',
    title: 'Take Picture',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.trueFalse]: {
    since: '5.39.0',
    description: 'True/false quiz bits',
    title: 'True False',
    subgroupOf: BitGroup.quizzes,
  },
  [BitGroup.vocabulary]: {
    since: '5.39.0',
    description:
      'Vocabulary bits (no current bit type is a member; key kept for consumer compatibility)',
    title: 'Vocabulary',
    subgroupOf: BitGroup.quizzes,
    allowEmpty: true,
  },
  [BitGroup.warning]: {
    since: '5.39.0',
    description: 'Warning-style content bits (warnings, bugs, dangers)',
    title: 'Warning',
  },
  [BitGroup.whiteLabel]: {
    since: '5.39.0',
    description: 'White-label / platform branding bits',
    title: 'White-label',
  },
};

export { BIT_GROUPS };
