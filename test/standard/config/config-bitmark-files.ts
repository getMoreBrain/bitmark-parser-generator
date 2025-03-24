import path from 'path';

// Enable or disable testing of specific files
let TEST_ALL = true;

const TEST_FILES_DIR = path.resolve(__dirname, '../input/bitmark');

if (process.env.CI) {
  TEST_ALL = true;
}

let TEST_FILES: string[] = [
  // 'ai-prompt.bit',
  // 'app-ai-prompt.bit',
  // 'app-bitmark-from-editor.bit',
  // 'app-bitmark-from-javascript.bit',
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
  // 'article-responsive.bit',
  // 'article-alt.bit',
  // 'assignment.bit',
  // 'assignment-list.bit',
  // 'audio-embed.bit',
  // 'audio-link.bit',
  // 'audio-transcript.bit',
  // 'audio.bit',
  // 'bit-alias.bit',
  // 'bit-book-ending.bit',
  // 'bit-book-summary.bit',
  // 'bit-level.bit',
  // 'bitmark-example.bit',
  // 'blog-article.bit',
  // 'book-alias.bit',
  // 'book-close.bit',
  // 'book-diff.bit',
  // 'book-link.bit',
  // 'book-reference.bit',
  // 'book-reference-list.bit',
  // 'book.bit',
  // 'bot-action-response.bit',
  // 'bot-action-send.bit',
  // // 'bot-action-announce.bit',
  // // 'bot-action-remind.bit',
  // // 'bot-action-save.bit',
  // 'breakscape.bit',
  // 'browser-image.bit',
  // 'bug.bit',
  // 'button-copy-text.bit',
  // 'call-to-action.bit',
  // 'card-1.bit',
  // 'chaining.bit',
  // 'chapter-subject-matter.bit',
  // 'chapter.bit',
  // 'checklist.bit',
  // 'cloze-and-multiple-choice-text.bit',
  // 'cloze-instruction-grouped.bit',
  // 'cloze-list.bit',
  // 'cloze-several.bit',
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
  // 'collapsible.bit',
  // 'comment.bit',
  // 'conclusion.bit',
  // 'console-log.bit',
  // 'container.bit',
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
  // 'definition-list.bit',
  // 'definition-term.bit',
  // 'deleted.bit',
  // 'details-image.bit',
  // 'details1.bit',
  // 'diff.bit',
  // 'document-download.bit',
  // 'document-embed.bit',
  // 'document-link.bit',
  // 'document.bit',
  // 'editor-note.bit',
  // 'editorial.bit',
  // 'essay.bit',
  // 'example.bit',
  // 'extractor-configuration.bit',
  // 'extractor-page.bit',
  // 'extractor-page-with-blocks.bit',
  // 'extractor-block.bit',
  // 'extractor-repeated-text.bit',
  // 'extractor-page-number.bit',
  // 'extractor-page-header.bit',
  // 'extractor-page-footer.bit',
  // 'featured.bit',
  // 'feedback.bit',
  // 'figure.bit',
  // 'flashcard-1.bit',
  // 'flashcard.bit',
  // 'focus-image.bit',
  // 'foot-note.bit',
  // 'footer.bit',
  // 'formula.bit',
  // 'gap-text-instruction-grouped.bit',
  // 'gap-text.bit',
  // 'glossary-term.bit',
  // 'hand-in-audio.bit',
  // 'hand-in-contact.bit',
  // 'hand-in-document.bit',
  // 'hand-in-file.bit',
  // 'hand-in-location.bit',
  // 'hand-in-photo.bit',
  // 'hand-in-scan.bit',
  // 'hand-in-submit.bit',
  // 'hand-in-video.bit',
  // 'hand-in-voice.bit',
  // 'help.bit',
  // 'highlight-text.bit',
  // 'hint.bit',
  // 'index-term.bit',
  // 'image-banner.bit',
  // 'image-figure.bit',
  // 'image-landscape.bit',
  // 'image-link.bit',
  // 'image-mood.bit',
  // 'image-on-device.bit',
  // 'image-portrait.bit',
  // 'image-prototype.bit',
  // 'image-responsive.bit',
  // 'image-separator.bit',
  // 'image-screenshot.bit',
  // 'image-styled.bit',
  // 'image-super-wide.bit',
  // 'image-zoom.bit',
  // 'image.bit',
  // 'info.bit',
  // 'internalComment.bit',
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
  // 'learning-documentation-feedback.bit',
  // 'learning-path-book.bit',
  // 'learning-path-classroom-event.bit',
  // 'learning-path-classroom-training.bit',
  // 'learning-path-closing.bit',
  // 'learning-path-external-link.bit',
  // 'learning-path-learning-goal.bit',
  // 'learning-path-lti.bit',
  // 'learning-path-step.bit',
  // 'learning-path-video-call.bit',
  // 'le-learning-objectives.bit',
  // 'le-video-call.bit',
  // 'le-classroom-event.bit',
  // 'le-completion.bit',
  // 'le-external-link.bit',
  // 'le-read-book.bit',
  // 'le-learning-step.bit',
  // 'le-read.bit',
  // 'le-task.bit',
  // 'le-todo.bit',
  // 'le-follow-up-task.bit',
  // 'le-finishing-task.bit',
  // 'le-assignment.bit',
  // 'le-watch-video-embed.bit',
  // 'le-listen-audio-embed.bit',
  // 'legend.bit',
  // 'life-skill-sticker.bit',
  // 'list.bit',
  // 'list-item.bit',
  // 'mark.bit',
  // 'match-all-reverse.bit',
  // 'match-all.bit',
  // 'match-matrix.bit',
  // 'match-reverse.bit',
  // 'match-solution-grouped.bit',
  // 'match.bit',
  // // 'message.bit',
  // 'meta-search-default-terms.bit',
  // 'meta-search-default-topics.bit',
  // 'milestone.bit',
  // 'module.bit',
  // 'module-product.bit',
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
  // 'page-article.bit',
  // 'page-article-alt.bit',
  // 'page-article-responsive.bit',
  // 'page-banner.bit',
  // 'page-buy-button.bit',
  // 'page-buy-button-promotion.bit',
  // 'page-cover-image.bit',
  // 'page-footer.bit',
  // 'page-hero.bit',
  // 'page-open-book.bit',
  // 'page-open-book-list.bit',
  // 'page-person.bit',
  // 'page-product.bit',
  // 'page-product-list.bit',
  // 'page-product-video.bit',
  // 'page-product-video-list.bit',
  // 'page-section-folder.bit',
  // 'page-subscribe.bit',
  // 'page-academy.bit',
  // 'page-category.bit',
  // 'page-container.bit',
  // 'page-promotion.bit',
  // 'page-shop-in-shop.bit',
  // 'page-special.bit',
  // 'page-subpage.bit',
  // 'parameters.bit',
  // 'photo.bit',
  // 'plain-text.bit',
  // 'preparation-note.bit',
  // 'pronunciation-table.bit',
  // 'prototype-images.bit',
  // 'q-and-a.bit',
  // 'question-1.bit',
  // 'quote.bit',
  // 'rating.bit',
  // 'record-audio.bit',
  // 'record-video.bit',
  // 'recipe.bit',
  // 'release-note.bit',
  // 'release-notes-summary.bit',
  // 'remark.bit',
  // 'review-approved-note.bit',
  // 'review-author-note.bit',
  // 'review-customer-note.bit',
  // 'review-note.bit',
  // 'review-request-for-review-note.bit',
  // 'review-reviewer-note.bit',
  // 'sample-solution.bit',
  // 'scorm.bit',
  // 'separator.bit',
  // 'sequence.bit',
  // 'side-note.bit',
  // 'smart-standard-bits.bit',
  // 'smart-standard-collapsible-bits.bit',
  // 'standard-bits.bit',
  // 'statement.bit',
  // 'step.bit',
  // 'step-image-screenshot.bit',
  // 'step-image-screenshot-with-pointer.bit',
  // 'stdout.bit',
  // 'sticker.bit',
  // 'sticky-note.bit',
  // 'still-image-film-embed.bit',
  // 'still-image-film-link.bit',
  // 'still-image-film.bit',
  'streaming.bit',
  // 'summary-ai.bit',
  // 'summary.bit',
  // // 'survey.bit',
  // 'survey-matrix.bit',
  // 'survey-matrix-me.bit',
  // 'survey-rating.bit',
  // 'survey-rating-once.bit',
  // 'survey-rating-display.bit',
  // 'table.bit',
  // 'table-image.bit',
  // 'take-picture.bit',
  // 'toc.bit',
  // 'toc-chapter.bit',
  // 'true-false-1.bit',
  // 'true-false.bit',
  // 'vendor-amcharts-5-chart.bit',
  // 'vendor-datadog-dashboard-embed.bit',
  // 'vendor-formbricks-embed.bit',
  // 'vendor-formbricks-link.bit',
  // 'vendor-highcharts-chart.bit',
  // 'vendor-iframely-card.bit',
  // 'vendor-iframely-embed.bit',
  // 'vendor-iframely-preview.bit',
  // 'vendor-iframely-preview-mini.bit',
  // 'vendor-jupyter-cell-code.bit',
  // 'vendor-jupyter-cell-raw.bit',
  // 'vendor-jupyter-output.bit',
  // 'vendor-jupyter-cell-markdown.bit',
  // 'vendor-jupyter-ipynb.bit',
  // 'vendor-padlet-embed.bit',
  // 'vendor-stripe-pricing-table.bit',
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
    'app-bitmark-from-editor.bit',
    'app-bitmark-from-javascript.bit',
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
    'article-responsive.bit',
    'article-alt.bit',
    'assignment.bit',
    'assignment-list.bit',
    'audio-embed.bit',
    'audio-link.bit',
    'audio-transcript.bit',
    'audio.bit',
    'bit-alias.bit',
    'bit-book-ending.bit',
    'bit-book-summary.bit',
    'bit-level.bit',
    'bitmark-example.bit',
    'blog-article.bit',
    'book-alias.bit',
    'book-close.bit',
    'book-diff.bit',
    'book-link.bit',
    'book-reference.bit',
    'book-reference-list.bit',
    'book.bit',
    'bot-action-response.bit',
    'bot-action-send.bit',
    // 'bot-action-announce.bit',
    // 'bot-action-remind.bit',
    // 'bot-action-save.bit',
    'breakscape.bit',
    'browser-image.bit',
    'bug.bit',
    'button-copy-text.bit',
    'call-to-action.bit',
    'card-1.bit',
    'chaining.bit',
    'chapter-subject-matter.bit',
    'chapter.bit',
    'checklist.bit',
    'cloze-and-multiple-choice-text.bit',
    'cloze-instruction-grouped.bit',
    'cloze-list.bit',
    'cloze-several.bit',
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
    'collapsible.bit',
    'comment.bit',
    'conclusion.bit',
    'console-log.bit',
    'container.bit',
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
    'definition-list.bit',
    'definition-term.bit',
    'deleted.bit',
    'details-image.bit',
    'details1.bit',
    'diff.bit',
    'document-download.bit',
    'document-embed.bit',
    'document-link.bit',
    'document.bit',
    'editor-note.bit',
    'editorial.bit',
    'essay.bit',
    'example.bit',
    'extractor-configuration.bit',
    'extractor-page.bit',
    'extractor-page-with-blocks.bit',
    'extractor-block.bit',
    'extractor-repeated-text.bit',
    'extractor-page-number.bit',
    'extractor-page-header.bit',
    'extractor-page-footer.bit',
    'featured.bit',
    'feedback.bit',
    'figure.bit',
    'flashcard-1.bit',
    'flashcard.bit',
    'focus-image.bit',
    'foot-note.bit',
    'footer.bit',
    'formula.bit',
    'gap-text-instruction-grouped.bit',
    'gap-text.bit',
    'glossary-term.bit',
    'hand-in-audio.bit',
    'hand-in-contact.bit',
    'hand-in-document.bit',
    'hand-in-file.bit',
    'hand-in-location.bit',
    'hand-in-photo.bit',
    'hand-in-scan.bit',
    'hand-in-submit.bit',
    'hand-in-video.bit',
    'hand-in-voice.bit',
    'help.bit',
    'highlight-text.bit',
    'hint.bit',
    'index-term.bit',
    'image-banner.bit',
    'image-figure.bit',
    'image-landscape.bit',
    'image-link.bit',
    'image-mood.bit',
    'image-on-device.bit',
    'image-portrait.bit',
    'image-prototype.bit',
    'image-responsive.bit',
    'image-separator.bit',
    'image-screenshot.bit',
    'image-styled.bit',
    'image-super-wide.bit',
    'image-zoom.bit',
    'image.bit',
    'info.bit',
    'internalComment.bit',
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
    'learning-documentation-feedback.bit',
    'learning-path-book.bit',
    'learning-path-classroom-event.bit',
    'learning-path-classroom-training.bit',
    'learning-path-closing.bit',
    'learning-path-external-link.bit',
    'learning-path-learning-goal.bit',
    'learning-path-lti.bit',
    'learning-path-step.bit',
    'learning-path-video-call.bit',
    'le-learning-objectives.bit',
    'le-video-call.bit',
    'le-classroom-event.bit',
    'le-completion.bit',
    'le-external-link.bit',
    'le-read-book.bit',
    'le-learning-step.bit',
    'le-preparation-task.bit',
    'le-read.bit',
    'le-task.bit',
    'le-todo.bit',
    'le-follow-up-task.bit',
    'le-finishing-task.bit',
    'le-assignment.bit',
    'le-watch-video-embed.bit',
    'le-listen-audio-embed.bit',
    'legend.bit',
    'life-skill-sticker.bit',
    'list.bit',
    'list-item.bit',
    'mark.bit',
    'match-all-reverse.bit',
    'match-all.bit',
    'match-matrix.bit',
    'match-reverse.bit',
    'match-solution-grouped.bit',
    'match.bit',
    // 'message.bit',
    'meta-search-default-terms.bit',
    'meta-search-default-topics.bit',
    'milestone.bit',
    'module.bit',
    'module-product.bit',
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
    'page-article.bit',
    'page-article-alt.bit',
    'page-article-responsive.bit',
    'page-banner.bit',
    'page-buy-button.bit',
    'page-buy-button-promotion.bit',
    'page-cover-image.bit',
    'page-footer.bit',
    'page-hero.bit',
    'page-open-book.bit',
    'page-open-book-list.bit',
    'page-person.bit',
    'page-product.bit',
    'page-product-list.bit',
    'page-product-video.bit',
    'page-product-video-list.bit',
    'page-section-folder.bit',
    'page-subscribe.bit',
    'page-academy.bit',
    'page-category.bit',
    'page-container.bit',
    'page-promotion.bit',
    'page-shop-in-shop.bit',
    'page-special.bit',
    'page-subpage.bit',
    'parameters.bit',
    'photo.bit',
    'plain-text.bit',
    'preparation-note.bit',
    'pronunciation-table.bit',
    'prototype-images.bit',
    'q-and-a.bit',
    'question-1.bit',
    'quote.bit',
    'rating.bit',
    'record-audio.bit',
    'record-video.bit',
    'recipe.bit',
    'release-note.bit',
    'release-notes-summary.bit',
    'remark.bit',
    'review-approved-note.bit',
    'review-author-note.bit',
    'review-customer-note.bit',
    'review-note.bit',
    'review-request-for-review-note.bit',
    'review-reviewer-note.bit',
    'sample-solution.bit',
    'scorm.bit',
    'separator.bit',
    'sequence.bit',
    'side-note.bit',
    'smart-standard-bits.bit',
    'smart-standard-collapsible-bits.bit',
    'standard-bits.bit',
    'statement.bit',
    'step.bit',
    'step-image-screenshot.bit',
    'step-image-screenshot-with-pointer.bit',
    'stdout.bit',
    'sticker.bit',
    'sticky-note.bit',
    'still-image-film-embed.bit',
    'still-image-film-link.bit',
    'still-image-film.bit',
    'streaming.bit',
    'summary-ai.bit',
    'summary.bit',
    // 'survey.bit',
    'survey-matrix.bit',
    'survey-matrix-me.bit',
    'survey-rating.bit',
    'survey-rating-once.bit',
    'survey-rating-display.bit',
    'table.bit',
    'table-image.bit',
    'take-picture.bit',
    'toc.bit',
    'toc-chapter.bit',
    'true-false-1.bit',
    'true-false.bit',
    'vendor-amcharts-5-chart.bit',
    'vendor-datadog-dashboard-embed.bit',
    'vendor-formbricks-embed.bit',
    'vendor-formbricks-link.bit',
    'vendor-highcharts-chart.bit',
    'vendor-iframely-card.bit',
    'vendor-iframely-embed.bit',
    'vendor-iframely-preview.bit',
    'vendor-iframely-preview-mini.bit',
    'vendor-jupyter-cell-code.bit',
    'vendor-jupyter-cell-raw.bit',
    'vendor-jupyter-output.bit',
    'vendor-jupyter-cell-markdown.bit',
    'vendor-jupyter-ipynb.bit',
    'vendor-padlet-embed.bit',
    'vendor-stripe-pricing-table.bit',
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
