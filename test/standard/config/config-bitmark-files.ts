import path from 'path';

// Enable or disable testing of specific files
let TEST_ALL = true;

const TEST_FILES_DIR = path.resolve(__dirname, '../input/bitmark');

if (process.env.CI) {
  TEST_ALL = true;
}

let TEST_FILES: string[] = [
  // // '_simple.bit',
  // 'ai-prompt.bit',
  // 'app-ai-prompt.bit',
  // 'app-code-editor.bit',
  // 'app-code-ide.bit',
  // 'app-code-cell.bit',
  // 'app-create-bits-from-image.bit',
  // 'app-flashcards-learn.bit',
  // 'app-flashcards-quiz.bit',
  // 'app-flashcards.bit',
  // 'app-get-screenshot.bit',
  // 'app-link.bit',
  // 'article-ai.bit',
  // 'article.bit',
  // 'assignment.bit',
  // 'audio-embed.bit',
  // 'audio-link.bit',
  // 'audio-transcript.bit',
  // 'audio.bit',
  // 'bit-alias.bit',
  // 'bit-book-ending.bit',
  // 'bit-book-summary.bit',
  // 'bitmark-example.bit',
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
  // 'book-link-next.bit',
  // 'book-link-prev.bit',
  // 'book-link.bit',
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
  // 'chapter-subject-matter.bit',
  // 'chapter.bit',
  // 'checklist.bit',
  // 'cloze-and-multiple-choice-text.bit',
  // 'cloze-instruction-grouped.bit',
  // 'cloze-solution-grouped.bit',
  // 'cloze.bit',
  // 'coach-audio-transcript.bit',
  // 'coach-call-to-action-checklist.bit',
  // 'coach-call-to-action-cloze-and-multiple-choice-text.bit',
  // 'coach-call-to-action-cloze.bit',
  // 'coach-call-to-action-essay.bit',
  // 'coach-call-to-action-multiple-choice-text.bit',
  // 'coach-home-rules.bit',
  // 'coach-self-reflection-cloze.bit',
  // 'coach-self-reflection-essay.bit',
  // 'coach-self-reflection-multiple-choice-1.bit',
  // 'coach-self-reflection-multiple-choice-text.bit',
  // 'coach-self-reflection-multiple-choice.bit',
  // 'coach-self-reflection-multiple-response-1.bit',
  // 'coach-self-reflection-multiple-response.bit',
  // 'coach-self-reflection-rating.bit',
  // 'coach-video-transcript.bit',
  // 'code.bit',
  // 'code-runtime.bit',
  // 'conclusion.bit',
  // 'console-log.bit',
  // 'conversation-left-1-scream.bit',
  // 'conversation-left-1-thought.bit',
  // 'conversation-left-1.bit',
  // 'conversation-right-1-scream.bit',
  // 'conversation-right-1-thought.bit',
  // 'conversation-right-1.bit',
  // 'cook-arrangement.bit',
  // 'cook-ingredients.bit',
  // 'cook-insert.bit',
  // 'cook-personal-recommendation.bit',
  // 'cook-plate.bit',
  // 'cook-practice-advise.bit',
  // 'cook-preparation.bit',
  // 'cook-recommendation.bit',
  // 'cook-remark.bit',
  // 'cook-side-dish.bit',
  // 'cook-side-drink.bit',
  // 'cook-step.bit',
  // 'cook-timer.bit',
  // 'cook-variation.bit',
  // 'correction.bit',
  // 'danger.bit',
  // 'details-image.bit',
  // 'details1.bit',
  // 'document-download.bit',
  // 'document-embed.bit',
  // 'document-link.bit',
  // 'document.bit',
  // 'editor-note.bit',
  // 'editorial.bit',
  // 'essay.bit',
  // 'example.bit',
  // 'featured.bit',
  // 'figure.bit',
  // 'flashcard-1.bit',
  // 'flashcard.bit',
  // 'focus-image.bit',
  // 'foot-note.bit',
  // 'help.bit',
  // 'highlight-text.bit',
  // 'hint.bit',
  // 'image-banner.bit',
  // 'image-figure.bit',
  // 'image-landscape.bit',
  // 'image-link.bit',
  // 'image-mood.bit',
  // 'image-on-device.bit',
  // 'image-portrait.bit',
  // 'image-prototype.bit',
  // 'image-responsive.bit',
  // 'image-screenshot.bit',
  // 'image-styled.bit',
  // 'image-super-wide.bit',
  // 'image-zoom.bit',
  // 'image.bit',
  // 'info.bit',
  // 'internalLink.bit',
  // 'interview-instruction-grouped.bit',
  // 'interview.bit',
  // 'lang-audio-script.bit',
  // 'lang-enabling-language-skills.bit',
  // 'lang-english-around-world.bit',
  // 'lang-extra-activity.bit',
  // 'lang-good-to-know.bit',
  // 'lang-homework.bit',
  // 'lang-learning-goal.bit',
  // 'lang-learning-outcomes.bit',
  // 'lang-learning-strategy.bit',
  // 'lang-level-down.bit',
  // 'lang-level-up.bit',
  // 'lang-life-skill-icon.bit',
  // 'lang-life-skills.bit',
  // 'lang-like-a-local.bit',
  // 'lang-materials.bit',
  // 'lang-teacher-note.bit',
  // 'lang-teacher-pronunication.bit',
  // 'lang-useful-phrases.bit',
  // 'lang-video-script.bit',
  // 'lang-vocabulary.bit',
  // 'learning-path-book.bit',
  // 'learning-path-classroom-event.bit',
  // 'learning-path-classroom-training.bit',
  // 'learning-path-closing.bit',
  // 'learning-path-external-link.bit',
  // 'learning-path-learning-goal.bit',
  // 'learning-path-lti.bit',
  // 'learning-path-step.bit',
  // 'learning-path-video-call.bit',
  // 'life-skill-sticker.bit',
  // 'mark.bit',
  // 'match-all-reverse.bit',
  // 'match-all.bit',
  // 'match-matrix.bit',
  // 'match-reverse.bit',
  // 'match-solution-grouped.bit',
  // 'match.bit',
  // 'message.bit',
  // 'multiple-choice-1.bit',
  // 'multiple-choice-text.bit',
  // 'multiple-choice.bit',
  // 'multiple-response-1.bit',
  // 'multiple-response.bit',
  // 'newspaper-article.bit',
  // 'note-ai.bit',
  // 'note.bit',
  // 'notebook-article.bit',
  // 'output.bit',
  // 'page.bit',
  // 'page-banner.bit',
  // 'page-buy-button.bit',
  // 'photo.bit',
  // 'preparation-note.bit',
  // 'question-1.bit',
  // 'quote.bit',
  // 'rating.bit',
  // 'release-note.bit',
  // 'release-notes-summary.bit',
  // 'remark.bit',
  // 'review-approved-note.bit',
  // 'review-author-note.bit',
  // 'review-note.bit',
  // 'review-request-for-review-note.bit',
  // 'review-reviewer-note.bit',
  // 'sample-solution.bit',
  // 'sequence.bit',
  // 'side-note.bit',
  // 'statement.bit',
  // 'stdout.bit',
  // 'sticky-note.bit',
  // 'still-image-film-embed.bit',
  // 'still-image-film-link.bit',
  // 'still-image-film.bit',
  // 'streaming.bit',
  // 'summary-ai.bit',
  // 'summary.bit',
  // 'survey.bit',
  // 'take-picture.bit',
  // 'toc.bit',
  // 'true-false-1.bit',
  // 'true-false.bit',
  // 'vendor-padlet-embed.bit',
  // 'video-embed.bit',
  // 'video-embed-landscape.bit',
  // 'video-embed-portrait.bit',
  // 'video-link.bit',
  // 'video-link-landscape.bit',
  // 'video-link-portrait.bit',
  // 'video-landscape.bit',
  // 'video-portrait.bit',
  // 'video-transcript.bit',
  // 'video.bit',
  // 'warning.bit',
  // 'website-link.bit',
  // 'workbook-article.bit',
];

// ALL tests for CI
if (TEST_ALL) {
  TEST_FILES = [
    'ai-prompt.bit',
    'app-ai-prompt.bit',
    'app-code-editor.bit',
    'app-code-ide.bit',
    'app-code-cell.bit',
    'app-create-bits-from-image.bit',
    'app-flashcards-learn.bit',
    'app-flashcards-quiz.bit',
    'app-flashcards.bit',
    'app-get-screenshot.bit',
    'app-link.bit',
    'article-ai.bit',
    'article.bit',
    'assignment.bit',
    'audio-embed.bit',
    'audio-link.bit',
    'audio-transcript.bit',
    'audio.bit',
    'bit-alias.bit',
    'bit-book-ending.bit',
    'bit-book-summary.bit',
    'bitmark-example.bit',
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
    'book-link-next.bit',
    'book-link-prev.bit',
    'book-link.bit',
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
    'bot-action-response.bit',
    'bot-action-send.bit',
    // 'bot-action-announce.bit',
    // 'bot-action-remind.bit',
    // 'bot-action-save.bit',
    'browser-image.bit',
    'bug.bit',
    'button-copy-text.bit',
    'card-1.bit',
    'chapter-subject-matter.bit',
    'chapter.bit',
    'checklist.bit',
    'cloze-and-multiple-choice-text.bit',
    'cloze-instruction-grouped.bit',
    'cloze-solution-grouped.bit',
    'cloze.bit',
    'coach-audio-transcript.bit',
    'coach-call-to-action-checklist.bit',
    'coach-call-to-action-cloze-and-multiple-choice-text.bit',
    'coach-call-to-action-cloze.bit',
    'coach-call-to-action-essay.bit',
    'coach-call-to-action-multiple-choice-text.bit',
    'coach-home-rules.bit',
    'coach-self-reflection-cloze.bit',
    'coach-self-reflection-essay.bit',
    'coach-self-reflection-multiple-choice-1.bit',
    'coach-self-reflection-multiple-choice-text.bit',
    'coach-self-reflection-multiple-choice.bit',
    'coach-self-reflection-multiple-response-1.bit',
    'coach-self-reflection-multiple-response.bit',
    'coach-self-reflection-rating.bit',
    'coach-video-transcript.bit',
    'code.bit',
    'code-runtime.bit',
    'conclusion.bit',
    'console-log.bit',
    'conversation-left-1-scream.bit',
    'conversation-left-1-thought.bit',
    'conversation-left-1.bit',
    'conversation-right-1-scream.bit',
    'conversation-right-1-thought.bit',
    'conversation-right-1.bit',
    'cook-arrangement.bit',
    'cook-ingredients.bit',
    'cook-insert.bit',
    'cook-personal-recommendation.bit',
    'cook-plate.bit',
    'cook-practice-advise.bit',
    'cook-preparation.bit',
    'cook-recommendation.bit',
    'cook-remark.bit',
    'cook-side-dish.bit',
    'cook-side-drink.bit',
    'cook-step.bit',
    'cook-timer.bit',
    'cook-variation.bit',
    // 'correction.bit',
    'danger.bit',
    'details-image.bit',
    'details1.bit',
    'document-download.bit',
    'document-embed.bit',
    'document-link.bit',
    'document.bit',
    'editor-note.bit',
    'editorial.bit',
    'essay.bit',
    'example.bit',
    'featured.bit',
    'figure.bit',
    'flashcard-1.bit',
    'flashcard.bit',
    'focus-image.bit',
    'foot-note.bit',
    'help.bit',
    'highlight-text.bit',
    'hint.bit',
    'image-banner.bit',
    'image-figure.bit',
    'image-landscape.bit',
    'image-link.bit',
    'image-mood.bit',
    'image-on-device.bit',
    'image-portrait.bit',
    'image-prototype.bit',
    'image-responsive.bit',
    'image-screenshot.bit',
    'image-styled.bit',
    'image-super-wide.bit',
    'image-zoom.bit',
    'image.bit',
    'info.bit',
    'internalLink.bit',
    'interview-instruction-grouped.bit',
    'interview.bit',
    'lang-audio-script.bit',
    'lang-enabling-language-skills.bit',
    'lang-english-around-world.bit',
    'lang-extra-activity.bit',
    'lang-good-to-know.bit',
    'lang-homework.bit',
    'lang-learning-goal.bit',
    'lang-learning-outcomes.bit',
    'lang-learning-strategy.bit',
    'lang-level-down.bit',
    'lang-level-up.bit',
    'lang-life-skill-icon.bit',
    'lang-life-skills.bit',
    'lang-like-a-local.bit',
    'lang-materials.bit',
    'lang-teacher-note.bit',
    'lang-teacher-pronunication.bit',
    'lang-useful-phrases.bit',
    'lang-video-script.bit',
    'lang-vocabulary.bit',
    'learning-path-book.bit',
    'learning-path-classroom-event.bit',
    'learning-path-classroom-training.bit',
    'learning-path-closing.bit',
    'learning-path-external-link.bit',
    'learning-path-learning-goal.bit',
    'learning-path-lti.bit',
    'learning-path-step.bit',
    'learning-path-video-call.bit',
    'life-skill-sticker.bit',
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
    'note-ai.bit',
    'note.bit',
    'notebook-article.bit',
    'output.bit',
    'page.bit',
    'page-banner.bit',
    'page-buy-button.bit',
    'photo.bit',
    'preparation-note.bit',
    'question-1.bit',
    'quote.bit',
    'rating.bit',
    'release-note.bit',
    'release-notes-summary.bit',
    'remark.bit',
    'review-approved-note.bit',
    'review-author-note.bit',
    'review-note.bit',
    'review-request-for-review-note.bit',
    'review-reviewer-note.bit',
    'sample-solution.bit',
    'sequence.bit',
    'side-note.bit',
    'statement.bit',
    'stdout.bit',
    'sticky-note.bit',
    'still-image-film-embed.bit',
    'still-image-film-link.bit',
    'still-image-film.bit',
    'streaming.bit',
    'summary-ai.bit',
    'summary.bit',
    // 'survey.bit',
    'take-picture.bit',
    'toc.bit',
    'true-false-1.bit',
    'true-false.bit',
    'vendor-padlet-embed.bit',
    'vendor-jupyter-cell-code.bit',
    'vendor-jupyter-cell-raw.bit',
    'vendor-jupyter-output.bit',
    'vendor-jupyter-cell-markdown.bit',
    'vendor-jupyter-ipynb.bit',
    'video-embed.bit',
    'video-embed-landscape.bit',
    'video-embed-portrait.bit',
    'video-link.bit',
    'video-link-landscape.bit',
    'video-link-portrait.bit',
    'video-landscape.bit',
    'video-portrait.bit',
    'video-transcript.bit',
    'video.bit',
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
