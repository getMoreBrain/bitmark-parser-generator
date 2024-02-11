import { EnumType, superenum } from '@ncoderz/superenum';

const BitType = superenum({
  _error: '_error', // Used for error handling to indicate a bit type that is not supported or a bit parse error
  _comment: '_comment', // Used to indicate a bit is commented out
  aiPrompt: 'ai-prompt',
  anchor: 'anchor',
  appAiPrompt: 'app-ai-prompt',
  appBitmarkFromEditor: 'app-bitmark-from-editor',
  appBitmarkFromJavascript: 'app-bitmark-from-javascript',
  appCodeCell: 'app-code-cell',
  appCodeEditor: 'app-code-editor',
  appCodeIde: 'app-code-ide',
  appCreateBitsFromImage: 'app-create-bits-from-image',
  appFlashcards: 'app-flashcards',
  appFlashcardsLearn: 'app-flashcards-learn',
  appFlashcardsQuiz: 'app-flashcards-quiz',
  appGetScreenshot: 'app-get-screenshot',
  appLink: 'app-link',
  article: 'article',
  articleAi: 'article-ai',
  articleAttachment: 'article-attachment',
  articleEmbed: 'article-embed',
  articleLink: 'article-link',
  assignment: 'assignment',
  assignmentList: 'assignment-list',
  audio: 'audio',
  audioEmbed: 'audio-embed',
  audioLink: 'audio-link',
  audioTranscript: 'audio-transcript',
  bitAlias: 'bit-alias',
  bitBookEnding: 'bit-book-ending',
  bitBookSummary: 'bit-book-summary',
  bitmarkExample: 'bitmark-example',
  blogArticle: 'blog-article',
  book: 'book',
  bookAcknowledgments: 'book-acknowledgments',
  bookAddendum: 'book-addendum',
  bookAfterword: 'book-afterword',
  bookAlias: 'book-alias',
  bookAppendix: 'book-appendix',
  bookArticle: 'book-article',
  bookAutherBio: 'book-author-bio',
  bookBibliography: 'book-bibliography',
  bookComingSoon: 'book-coming-soon',
  bookConclusion: 'book-conclusion',
  bookCopyright: 'book-copyright',
  bookCopyrightPermissions: 'book-copyright-permissions',
  bookDedication: 'book-dedication',
  bookEndnotes: 'book-endnotes',
  bookEpigraph: 'book-epigraph',
  bookEpilogue: 'book-epilogue',
  bookForword: 'book-foreword',
  bookFrontispiece: 'book-frontispiece',
  bookImprint: 'book-imprint',
  bookIncitingIncident: 'book-inciting-incident',
  bookIntroduction: 'book-introduction',
  bookLink: 'book-link',
  bookLinkNext: 'book-link-next',
  bookLinkPrev: 'book-link-prev',
  bookListOfContributors: 'book-list-of-contributors',
  bookNotes: 'book-notes',
  bookPostscript: 'book-postscript',
  bookPreface: 'book-preface',
  bookPrologue: 'book-prologue',
  bookReadMore: 'book-read-more',
  bookReferenceList: 'book-reference-list',
  bookRequestForABookReview: 'book-request-for-a-book-review',
  bookSummary: 'book-summary',
  bookTeaser: 'book-teaser',
  bookTitle: 'book-title',
  botActionAnnounce: 'bot-action-announce',
  botActionRatingNumber: 'bot-action-rating-number',
  botActionRemind: 'bot-action-remind',
  botActionResponse: 'bot-action-response',
  botActionSave: 'bot-action-save',
  botActionSend: 'bot-action-send',
  botActionTrueFalse: 'bot-action-true-false',
  botInterview: 'bot-interview',
  browserImage: 'browser-image',
  bug: 'bug',
  buttonCopyText: 'button-copy-text',
  card1: 'card-1',
  chapter: 'chapter',
  chapterSubjectMatter: 'chapter-subject-matter',
  chat: 'chat',
  checklist: 'checklist',
  cloze: 'cloze',
  clozeAndMultipleChoiceText: 'cloze-and-multiple-choice-text',
  clozeInstructionGrouped: 'cloze-instruction-grouped',
  clozeList: 'cloze-list',
  clozeSolutionGrouped: 'cloze-solution-grouped',
  coachAudioTranscript: 'coach-audio-transcript',
  coachCallToActionChecklist: 'coach-call-to-action-checklist',
  coachCallToActionCloze: 'coach-call-to-action-cloze',
  coachCallToActionClozeAndMultipleChoiceText: 'coach-call-to-action-cloze-and-multiple-choice-text',
  coachCallToActionEssay: 'coach-call-to-action-essay',
  coachCallToActionMultipleChoiceText: 'coach-call-to-action-multiple-choice-text',
  coachHomeRules: 'coach-home-rules',
  coachSelfReflectionCloze: 'coach-self-reflection-cloze',
  coachSelfReflectionEssay: 'coach-self-reflection-essay',
  coachSelfReflectionMultipleChoice: 'coach-self-reflection-multiple-choice',
  coachSelfReflectionMultipleChoice1: 'coach-self-reflection-multiple-choice-1',
  coachSelfReflectionMultipleChoiceText: 'coach-self-reflection-multiple-choice-text',
  coachSelfReflectionMultipleResponse: 'coach-self-reflection-multiple-response',
  coachSelfReflectionMultipleResponse1: 'coach-self-reflection-multiple-response-1',
  coachSelfReflectionRating: 'coach-self-reflection-rating',
  coachVideoTranscript: 'coach-video-transcript',
  code: 'code',
  codeRuntime: 'code-runtime',
  conclusion: 'conclusion',
  consoleLog: 'console-log',
  conversationLeft1: 'conversation-left-1',
  conversationLeft1Scream: 'conversation-left-1-scream',
  conversationLeft1Thought: 'conversation-left-1-thought',
  conversationRight1: 'conversation-right-1',
  conversationRight1Scream: 'conversation-right-1-scream',
  conversationRight1Thought: 'conversation-right-1-thought',
  cookArrangement: 'cook-arrangement',
  cookIngredients: 'cook-ingredients',
  cookingIngredients: 'cooking-ingredients',
  cookInsert: 'cook-insert',
  cookPersonalRecommendation: 'cook-personal-recommendation',
  cookPlate: 'cook-plate',
  cookPracticeAdvise: 'cook-practice-advise',
  cookPreparation: 'cook-preparation',
  cookRecommendation: 'cook-recommendation',
  cookRemark: 'cook-remark',
  cookSideDish: 'cook-side-dish',
  cookSideDrink: 'cook-side-drink',
  cookStep: 'cook-step',
  cookTimer: 'cook-timer',
  cookVariation: 'cook-variation',
  correction: 'correction',
  danger: 'danger',
  details: 'details',
  details1: 'details-1',
  detailsImage: 'details-image',
  document: 'document',
  documentDownload: 'document-download',
  documentEmbed: 'document-embed',
  documentLink: 'document-link',
  documentUpload: 'document-upload',
  editorial: 'editorial',
  editorNote: 'editor-note',
  essay: 'essay',
  example: 'example',
  exampleList: 'example-list',
  featured: 'featured',
  figure: 'figure',
  flashcard: 'flashcard',
  flashcard1: 'flashcard-1',
  focusImage: 'focus-image',
  footNote: 'foot-note',
  gapText: 'gap-text',
  gapTextInstructionGrouped: 'gap-text-instruction-grouped',
  groupBorn: 'group-born',
  groupDied: 'group-died',
  handInAudio: 'hand-in-audio',
  handInContact: 'hand-in-contact',
  handInDocument: 'hand-in-document',
  handInLocation: 'hand-in-location',
  handInPhoto: 'hand-in-photo',
  handInScan: 'hand-in-scan',
  handInVideo: 'hand-in-video',
  handInVoice: 'hand-in-voice',
  help: 'help',
  highlightText: 'highlight-text',
  hint: 'hint',
  image: 'image',
  imageBanner: 'image-banner',
  imageFigure: 'image-figure',
  imageLandscape: 'image-landscape',
  imageLink: 'image-link',
  imageMood: 'image-mood',
  imageOnDevice: 'image-on-device',
  imagePortrait: 'image-portrait',
  imagePrototype: 'image-prototype',
  imageResponsive: 'image-responsive',
  imageScreenshot: 'image-screenshot',
  imageSeparator: 'image-separator',
  imageStyled: 'image-styled',
  imageSuperWide: 'image-super-wide',
  imageZoom: 'image-zoom',
  imagesLogoGrave: 'images-logo-grave',
  info: 'info',
  internalLink: 'internal-link',
  interview: 'interview',
  interviewInstructionGrouped: 'interview-instruction-grouped',
  langAudioScript: 'lang-audio-script',
  langEnablingLanguageSkills: 'lang-enabling-language-skills',
  langEnglishAroundWorld: 'lang-english-around-world',
  langExtraActivity: 'lang-extra-activity',
  langGoodToKnow: 'lang-good-to-know',
  langHomework: 'lang-homework',
  langLearningGoal: 'lang-learning-goal',
  langLearningOutcomes: 'lang-learning-outcomes',
  langLearningStrategy: 'lang-learning-strategy',
  langLevelDown: 'lang-level-down',
  langLevelUp: 'lang-level-up',
  langLifeSkillIcon: 'lang-life-skill-icon',
  langLifeSkills: 'lang-life-skills',
  langLikeALocal: 'lang-like-a-local',
  langMaterial: 'lang-material',
  langTeacherNote: 'lang-teacher-note',
  langTeacherPronunciation: 'lang-teacher-pronunciation',
  langUsefulPhrases: 'lang-useful-phrases',
  langVideoScript: 'lang-video-script',
  langVocabulary: 'lang-vocabulary',
  learningPathBook: 'learning-path-book',
  learningPathBotTraining: 'learning-path-bot-training',
  learningPathClassroomEvent: 'learning-path-classroom-event',
  learningPathClassroomTraining: 'learning-path-classroom-training',
  learningPathClosing: 'learning-path-closing',
  learningPathExternalLink: 'learning-path-external-link',
  learningPathFeedback: 'learning-path-feedback',
  learningPathLearningGoal: 'learning-path-learning-goal',
  learningPathLti: 'learning-path-lti',
  learningPathSign: 'learning-path-sign',
  learningPathStep: 'learning-path-step',
  learningPathVideoCall: 'learning-path-video-call',
  lifeSkillSticker: 'life-skill-sticker',
  mark: 'mark',
  match: 'match',
  matchAll: 'match-all',
  matchAllReverse: 'match-all-reverse',
  matchAudio: 'match-audio',
  matchMatrix: 'match-matrix',
  matchPicture: 'match-picture',
  matchReverse: 'match-reverse',
  matchSolutionGrouped: 'match-solution-grouped',
  message: 'message',
  multipleChoice: 'multiple-choice',
  multipleChoice1: 'multiple-choice-1',
  multipleChoiceText: 'multiple-choice-text',
  multipleResponse: 'multiple-response',
  multipleResponse1: 'multiple-response-1',
  newspaperArticle: 'newspaper-article',
  note: 'note',
  noteAi: 'note-ai',
  notebookArticle: 'notebook-article',
  output: 'output',
  page: 'page',
  pageBanner: 'page-banner',
  pageBuyButton: 'page-buy-button',
  pageBuyButtonPromotion: 'page-buy-button-promotion',
  pageFooter: 'page-footer',
  pageOpenBook: 'page-open-book',
  pageProduct: 'page-product',
  pageProductList: 'page-product-list',
  pageProductVideo: 'page-product-video',
  pageProductVideoList: 'page-product-video-list',
  pageSectionFolder: 'page-section-folder',
  pageSubscribe: 'page-subscribe',
  photo: 'photo',
  preparationNote: 'preparation-note',
  question1: 'question-1',
  quote: 'quote',
  rating: 'rating',
  recordAudio: 'record-audio',
  releaseNote: 'release-note',
  releaseNotesSummary: 'release-notes-summary',
  remark: 'remark',
  reviewApprovedNote: 'review-approved-note',
  reviewAuthorNote: 'review-author-note',
  reviewNote: 'review-note',
  reviewRequestForReviewNote: 'review-request-for-review-note',
  reviewReviewerNote: 'review-reviewer-note',
  sampleSolution: 'sample-solution',
  scorm: 'scorm',
  screenshot: 'screenshot',
  selfAssessment: 'self-assessment',
  separator: 'separator',
  sequence: 'sequence',
  sideNote: 'side-note',
  statement: 'statement',
  stdout: 'stdout',
  step: 'step',
  stepImageScreenshot: 'step-image-screenshot',
  stepImageScreenshotWithPointer: 'step-image-screenshot-with-pointer',
  stickyNote: 'sticky-note',
  stillImageFilm: 'still-image-film',
  stillImageFilmEmbed: 'still-image-film-embed',
  stillImageFilmLink: 'still-image-film-link',
  summary: 'summary',
  summaryAi: 'summary-ai',
  survey: 'survey',
  survey1: 'survey-1',
  surveyAnonymous: 'survey-anonymous',
  surveyAnonymous1: 'survey-anonymous-1',
  table: 'table',
  tableImage: 'table-image',
  takePicture: 'take-picture',
  toc: 'toc',
  tocChapter: 'toc-chapter',
  trueFalse: 'true-false',
  trueFalse1: 'true-false-1',
  vendorAmcharts5Chart: 'vendor-amcharts-5-chart',
  vendorIframelyCard: 'vendor-iframely-card',
  vendorIframelyEmbed: 'vendor-iframely-embed',
  vendorIframelyPreview: 'vendor-iframely-preview',
  vendorIframelyPreviewMini: 'vendor-iframely-preview-mini',
  vendorJupyterCellCode: 'vendor-jupyter-cell-code',
  vendorJupyterCellMarkdown: 'vendor-jupyter-cell-markdown',
  vendorJupyterCellRaw: 'vendor-jupyter-cell-raw',
  vendorJupyterIpynb: 'vendor-jupyter-ipynb',
  vendorJupyterOutput: 'vendor-jupyter-output',
  vendorPadletEmbed: 'vendor-padlet-embed',
  video: 'video',
  videoEmbed: 'video-embed',
  videoEmbedLandscape: 'video-embed-landscape',
  videoEmbedPortrait: 'video-embed-portrait',
  videoLandscape: 'video-landscape',
  videoLink: 'video-link',
  videoLinkLandscape: 'video-link-landscape',
  videoLinkPortrait: 'video-link-portrait',
  videoPortrait: 'video-portrait',
  videoTranscript: 'video-transcript',
  warning: 'warning',
  websiteLink: 'website-link',
  workbookArticle: 'workbook-article',
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
