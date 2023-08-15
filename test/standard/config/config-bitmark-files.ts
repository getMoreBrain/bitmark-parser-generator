import path from 'path';

// Enable or disable testing of specific files
let TEST_ALL = true;

const TEST_FILES_DIR = path.resolve(__dirname, '../input/bitmark');

if (process.env.CI) {
  TEST_ALL = true;
}

let TEST_FILES: string[] = [
  // // '_simple.bit',
  // 'app-ai-prompt.bit',
  // 'ai-prompt.bit',
  // 'app-link.bit',
  // 'article.bit',
  // 'article-ai.bit',
  // 'assignment.bit',
  // 'audio-embed.bit',
  // 'audio-link.bit',
  // 'audio.bit',
  // 'audio-transcript.bit',
  // 'bitmark-example.bit',
  // 'bit-alias.bit',
  // 'bit-book-ending.bit',
  // 'bit-book-summary.bit',
  // 'blog-article.bit',
  // 'book-acknowledgments.bit',
  // 'book-addendum.bit',
  // 'book-afterword.bit',
  // 'book-appendix.bit',
  // 'book-article.bit',
  // 'book-author-bio.bit',
  // 'book-bibliography.bit',
  // 'book-coming-soon.bit',
  // 'book-conclusion.bit',
  // 'book-copyright-permissions.bit',
  // 'book-copyright.bit',
  // 'book-dedication.bit',
  // 'book-endnotes.bit',
  // 'book-epigraph.bit',
  // 'book-epilogue.bit',
  // 'book-foreword.bit',
  // 'book-frontispiece.bit',
  // 'book-imprint.bit',
  // 'book-inciting-incident.bit',
  // 'book-introduction.bit',
  // 'book-list-of-contibutors.bit',
  // 'book-notes.bit',
  // 'book-postscript.bit',
  // 'book-preface.bit',
  // 'book-prologue.bit',
  // 'book-read-more.bit',
  // 'book-reference-list.bit',
  // 'book-request-for-a-book-review.bit',
  // 'book-summary.bit',
  // 'book-teaser.bit',
  // 'book-title.bit',
  // 'book.bit',
  // 'bot-action-announce.bit',
  // 'bot-action-remind.bit',
  // 'bot-action-response.bit',
  // 'bot-action-save.bit',
  // 'bot-action-send.bit',
  // 'browser-image.bit',
  // 'bug.bit',
  // 'button-copy-text.bit',
  // 'card-1.bit',
  // 'chapter.bit',
  // 'chapter-subject-matter.bit',
  // 'checklist.bit',
  // 'cloze-and-multiple-choice-text.bit',
  // 'cloze-instruction-grouped.bit',
  // 'cloze-solution-grouped.bit',
  // 'cloze.bit',
  // 'coach-home-rules.bit',
  // 'coach-self-reflection-rating.bit',
  // 'coach-self-reflection-multiple-choice-text.bit',
  // 'coach-self-reflection-essay.bit',
  // 'coach-self-reflection-cloze.bit',
  // 'coach-call-to-action-cloze.bit',
  // 'coach-call-to-action-essay.bit',
  // 'coach-call-to-action-cloze-and-multiple-choice-text.bit',
  // 'coach-call-to-action-multiple-choice-text.bit',
  // 'coach-call-to-action-checklist.bit',
  // 'coach-self-reflection-multiple-choice.bit',
  // 'coach-self-reflection-multiple-choice-1.bit',
  // 'coach-self-reflection-multiple-response.bit',
  // 'coach-self-reflection-multiple-response-1.bit',
  // 'coach-audio-transcript.bit',
  // 'coach-video-transcript.bit',
  // 'code.bit',
  // 'conclusion.bit',
  // 'conversation-left-1-scream.bit',
  // 'conversation-left-1-thought.bit',
  // 'conversation-left-1.bit',
  // 'conversation-right-1-scream.bit',
  // 'conversation-right-1-thought.bit',
  // 'conversation-right-1.bit',
  // 'cook-preparation',
  // 'cook-step',
  // 'cook-ingredients',
  // 'cook-remark',
  // 'cook-variation',
  // 'cook-insert',
  // 'cook-arrangement',
  // 'cook-practice-advise',
  // 'cook-plate',
  // 'cook-recommendation',
  // 'cook-personal-recommendation',
  // 'cook-side-drink',
  // 'cook-side-dish',
  // 'cook-timer',
  // 'correction.bit',
  // 'danger.bit',
  // 'details1.bit',
  // 'document-download.bit',
  // 'document-embed.bit',
  // 'document-link.bit',
  // 'document.bit',
  // 'editorial.bit',
  // 'editor-note.bit',
  // 'essay.bit',
  // 'example.bit',
  // 'featured.bit',
  // 'flashcard.bit',
  // 'flashcard-1.bit',
  // 'focus-image.bit',
  // 'foot-note.bit',
  // 'help.bit',
  // 'highlight-text.bit',
  // 'hint.bit',
  // 'image-landscape.bit',
  // 'image-link.bit',
  // 'image-on-device.bit',
  // 'image-portrait.bit',
  // 'image-prototype.bit',
  // 'image-super-wide.bit',
  // 'image-zoom.bit',
  // 'image.bit',
  // 'info.bit',
  // 'internalLink.bit',
  // 'interview-instruction-grouped.bit',
  // 'interview.bit',
  // 'lang-learning-outcomes',
  // 'lang-enabling-language-skills',
  // 'lang-life-skills',
  // 'lang-english-around-world',
  // 'lang-good-to-know',
  // 'lang-learning-goal',
  // 'lang-learning-strategy',
  // 'lang-like-a-local',
  // 'lang-materials',
  // 'lang-useful-phrases',
  // 'lang-level-down',
  // 'lang-level-up',
  // 'lang-extra-activity',
  // 'lang-video-script',
  // 'lang-audio-script',
  // 'lang-vocabulary',
  // 'lang-homework',
  // 'lang-teacher-note',
  // 'lang-teacher-pronunication',
  // 'learning-path-book.bit',
  // 'learning-path-classroom-event.bit',
  // 'learning-path-classroom-training.bit',
  // 'learning-path-closing.bit',
  // 'learning-path-external-link.bit',
  // 'learning-path-learning-goal.bit',
  // 'learning-path-lti.bit',
  // 'learning-path-step.bit',
  // 'learning-path-video-call.bit',
  // 'mark.bit',
  // 'match-all-reverse.bit',
  // 'match-all.bit',
  // 'match-matrix.bit',
  // 'match-reverse.bit',
  // 'match-solution-grouped.bit',
  'match.bit',
  // 'message.bit',
  // 'multiple-choice-1.bit',
  // 'multiple-choice-text.bit',
  // 'multiple-choice.bit',
  // 'multiple-response-1.bit',
  // 'multiple-response.bit',
  // 'newspaper-article.bit',
  // 'note.bit',
  // 'note-ai.bit',
  // 'notebook-article.bit',
  // 'page.bit',
  // 'photo.bit',
  // 'preparation-note.bit',
  // 'question-1.bit',
  // 'quote.bit',
  // 'rating.bit',
  // 'release-note.bit',
  // 'release-notes-summary.bit',
  // 'remark.bit',
  // 'review-note.bit',
  // 'review-author-note.bit',
  // 'review-reviewer-note.bit',
  // 'review-request-for-review-note.bit',
  // 'review-approved-note.bit',
  // 'sample-solution.bit',
  // 'sequence.bit',
  // 'side-note.bit',
  // 'statement.bit',
  // 'sticky-note.bit',
  // 'still-image-film-embed.bit',
  // 'still-image-film-link.bit',
  // 'still-image-film.bit',
  // 'streaming.bit',
  // 'summary.bit',
  // 'summary-ai.bit',
  // 'survey.bit',
  // 'take-picture.bit',
  // 'toc.bit',
  // 'true-false-1.bit',
  // 'true-false.bit',
  // 'vendor-padlet-embed.bit',
  // 'video-embed.bit',
  // 'video-landscape.bit',
  // 'video-link.bit',
  // 'video-portrait.bit',
  // 'video.bit',
  // 'video-transcript.bit',
  // 'warning.bit',
  // 'website-link.bit',
  // 'workbook-article.bit',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    'app-ai-prompt.bit',
    'ai-prompt.bit',
    'app-link.bit',
    'article.bit',
    'article-ai.bit',
    'assignment.bit',
    'audio-embed.bit',
    'audio-link.bit',
    'audio.bit',
    'audio-transcript.bit',
    'bitmark-example.bit',
    'bit-alias.bit',
    'bit-book-ending.bit',
    'bit-book-summary.bit',
    'blog-article.bit',
    'book-acknowledgments.bit',
    'book-addendum.bit',
    'book-afterword.bit',
    'book-appendix.bit',
    'book-article.bit',
    'book-author-bio.bit',
    'book-bibliography.bit',
    'book-coming-soon.bit',
    'book-conclusion.bit',
    'book-copyright-permissions.bit',
    'book-copyright.bit',
    'book-dedication.bit',
    'book-endnotes.bit',
    'book-epigraph.bit',
    'book-epilogue.bit',
    'book-foreword.bit',
    'book-frontispiece.bit',
    'book-imprint.bit',
    'book-inciting-incident.bit',
    'book-introduction.bit',
    'book-list-of-contibutors.bit',
    'book-notes.bit',
    'book-postscript.bit',
    'book-preface.bit',
    'book-prologue.bit',
    'book-read-more.bit',
    'book-reference-list.bit',
    'book-request-for-a-book-review.bit',
    'book-summary.bit',
    'book-teaser.bit',
    'book-title.bit',
    'book.bit',
    // 'bot-action-announce.bit',
    // 'bot-action-remind.bit',
    'bot-action-response.bit',
    // 'bot-action-save.bit',
    'bot-action-send.bit',
    'browser-image.bit',
    'bug.bit',
    // 'button-copy-text.bit',
    'card-1.bit',
    'chapter.bit',
    'chapter-subject-matter.bit',
    'checklist.bit',
    'cloze-and-multiple-choice-text.bit',
    'cloze-instruction-grouped.bit',
    'cloze-solution-grouped.bit',
    'cloze.bit',
    'coach-home-rules.bit',
    'coach-self-reflection-rating.bit',
    'coach-self-reflection-multiple-choice-text.bit',
    'coach-self-reflection-essay.bit',
    'coach-self-reflection-cloze.bit',
    'coach-call-to-action-cloze.bit',
    'coach-call-to-action-essay.bit',
    'coach-call-to-action-cloze-and-multiple-choice-text.bit',
    'coach-call-to-action-multiple-choice-text.bit',
    'coach-call-to-action-checklist.bit',
    'coach-self-reflection-multiple-choice.bit',
    'coach-self-reflection-multiple-choice-1.bit',
    'coach-self-reflection-multiple-response.bit',
    'coach-self-reflection-multiple-response-1.bit',
    'coach-audio-transcript.bit',
    'coach-video-transcript.bit',
    'code.bit',
    'conclusion.bit',
    'conversation-left-1-scream.bit',
    'conversation-left-1-thought.bit',
    'conversation-left-1.bit',
    'conversation-right-1-scream.bit',
    'conversation-right-1-thought.bit',
    'conversation-right-1.bit',
    'cook-preparation.bit',
    'cook-step.bit',
    'cook-ingredients.bit',
    'cook-remark.bit',
    'cook-variation.bit',
    'cook-insert.bit',
    'cook-arrangement.bit',
    'cook-practice-advise.bit',
    'cook-plate.bit',
    'cook-recommendation.bit',
    'cook-personal-recommendation.bit',
    'cook-side-drink.bit',
    'cook-side-dish.bit',
    'cook-timer.bit',
    // 'correction.bit',
    'danger.bit',
    'details1.bit',
    'document-download.bit',
    'document-embed.bit',
    'document-link.bit',
    'document.bit',
    'editorial.bit',
    'editor-note.bit',
    'essay.bit',
    'example.bit',
    'featured.bit',
    'flashcard.bit',
    'flashcard-1.bit',
    'focus-image.bit',
    'foot-note.bit',
    'help.bit',
    'highlight-text.bit',
    'hint.bit',
    'image-landscape.bit',
    'image-link.bit',
    'image-on-device.bit',
    'image-portrait.bit',
    'image-prototype.bit',
    'image-super-wide.bit',
    'image-zoom.bit',
    'image.bit',
    'info.bit',
    'internalLink.bit',
    'interview-instruction-grouped.bit',
    'interview.bit',
    'lang-learning-outcomes',
    'lang-enabling-language-skills',
    'lang-life-skills',
    'lang-english-around-world',
    'lang-good-to-know',
    'lang-learning-goal',
    'lang-learning-strategy',
    'lang-like-a-local',
    'lang-materials',
    'lang-useful-phrases',
    'lang-level-down',
    'lang-level-up',
    'lang-extra-activity',
    'lang-video-script',
    'lang-audio-script',
    'lang-vocabulary',
    'lang-homework',
    'lang-teacher-note',
    'lang-teacher-pronunication',
    'learning-path-book.bit',
    'learning-path-classroom-event.bit',
    'learning-path-classroom-training.bit',
    'learning-path-closing.bit',
    'learning-path-external-link.bit',
    'learning-path-learning-goal.bit',
    'learning-path-lti.bit',
    'learning-path-step.bit',
    'learning-path-video-call.bit',
    'mark.bit',
    'match-all-reverse.bit',
    'match-all.bit',
    'match-matrix.bit',
    'match-reverse.bit',
    'match-solution-grouped.bit',
    'match.bit',
    // 'message.bit',
    'multiple-choice-1.bit',
    'multiple-choice-text.bit',
    'multiple-choice.bit',
    'multiple-response-1.bit',
    'multiple-response.bit',
    'newspaper-article.bit',
    'note.bit',
    'note-ai.bit',
    'notebook-article.bit',
    'page.bit',
    'photo.bit',
    'preparation-note.bit',
    'question-1.bit',
    'quote.bit',
    'rating.bit',
    'release-note.bit',
    'release-notes-summary.bit',
    'remark.bit',
    'review-note.bit',
    'review-author-note.bit',
    'review-reviewer-note.bit',
    'review-request-for-review-note.bit',
    'review-approved-note.bit',
    'sample-solution.bit',
    'sequence.bit',
    'side-note.bit',
    'statement.bit',
    'sticky-note.bit',
    'still-image-film-embed.bit',
    'still-image-film-link.bit',
    'still-image-film.bit',
    'streaming.bit',
    'summary.bit',
    'summary-ai.bit',
    // 'survey.bit',
    'take-picture.bit',
    'toc.bit',
    'true-false-1.bit',
    'true-false.bit',
    'vendor-padlet-embed.bit',
    'video-embed.bit',
    'video-landscape.bit',
    'video-link.bit',
    'video-portrait.bit',
    'video.bit',
    'video-transcript.bit',
    'warning.bit',
    'website-link.bit',
    'workbook-article.bit',
  ];
}

function getTestFilesDir(): string {
  return TEST_FILES_DIR;
}

function getTestFiles(): string[] {
  return TEST_FILES;
}

export { getTestFilesDir, getTestFiles };
