import { EnumType, superenum } from '@ncoderz/superenum';

const BitType = superenum({
  _error: '_error', // Used for error handling to indicate a bit type that is not supported or a bit parse error
  _comment: '_comment', // Used to indicate a bit is commented out
  _standard: '_standard', // Not to be used as a bit, but as a base for other bit types
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
  articleAlt: 'article-alt',
  articleAttachment: 'article-attachment',
  articleEmbed: 'article-embed',
  articleLink: 'article-link',
  articleResponsive: 'article-responsive',
  articleResponsiveAlt: 'article-responsive-alt',
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
  bookAcknowledgements: 'book-acknowledgements',
  bookAddendum: 'book-addendum',
  bookAfterword: 'book-afterword',
  bookAlias: 'book-alias',
  bookAppendix: 'book-appendix',
  bookArticle: 'book-article',
  bookAutherBio: 'book-author-bio',
  bookBibliography: 'book-bibliography',
  bookClose: 'book-close',
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
  bookReference: 'book-reference',
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
  bugAlt: 'bug-alt',
  bugCollapsible: 'bug-collapsible',
  buttonCopyText: 'button-copy-text',
  callToAction: 'call-to-action',
  callToActionBookNow: 'call-to-action-book-now',
  callToActionContact: 'call-to-action-contact',
  callToActionCreateAccount: 'call-to-action-create-account',
  callToActionDownload: 'call-to-action-download',
  callToActionGetNow: 'call-to-action-get-now',
  callToActionGetOffer: 'call-to-action-get-offer',
  callToActionJoin: 'call-to-action-join',
  callToActionLearnMore: 'call-to-action-learn-more',
  callToActionMail: 'call-to-action-mail',
  callToActionSeeMore: 'call-to-action-see-more',
  callToActionShopNow: 'call-to-action-shop-now',
  callToActionStartNow: 'call-to-action-start-now',
  callToActionSubscribe: 'call-to-action-subscribe',
  callToActionWatch: 'call-to-action-watch',
  card1: 'card-1',
  chapter: 'chapter',
  chapterSubjectMatter: 'chapter-subject-matter',
  chat: 'chat',
  checklist: 'checklist',
  cloze: 'cloze',
  clozeAndMultipleChoiceText: 'cloze-and-multiple-choice-text',
  clozeInstructionGrouped: 'cloze-instruction-grouped',
  clozeList: 'cloze-list',
  clozeSeveral: 'cloze-several',
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
  collapsible: 'collapsible',
  conclusion: 'conclusion',
  conclusionAlt: 'conclusion-alt',
  consoleLog: 'console-log',
  container: 'container',
  containerAccordionTabs: 'container-accordion-tabs',
  containerBits2: 'container-bits-2',
  containerCards: 'container-cards',
  containerCarousel: 'container-carousel',
  containerCookRecipe: 'container-cook-recipe',
  containerFolder: 'container-folder',
  containerFolderAll: 'container-folder-all',
  containerGallery: 'container-gallery',
  containerGrid: 'container-grid',
  containerGroup: 'container-group',
  containerNewsArticle: 'container-news-article',
  containerNowrap: 'container-nowrap',
  containerNowrapStretch: 'container-nowrap-stretch',
  containerPreview: 'container-preview',
  containerScroller: 'container-scroller',
  containerSlides: 'container-slides',
  containerStack: 'container-stack',
  containerTabs: 'container-tabs',
  containerWrap: 'container-wrap',
  conversationLeft1: 'conversation-left-1',
  conversationLeft1Scream: 'conversation-left-1-scream',
  conversationLeft1Thought: 'conversation-left-1-thought',
  conversationRight1: 'conversation-right-1',
  conversationRight1Scream: 'conversation-right-1-scream',
  conversationRight1Thought: 'conversation-right-1-thought',
  cookArrangement: 'cook-arrangement',
  cookIngredients: 'cook-ingredients',
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
  dangerAlt: 'danger-alt',
  dangerCollapsible: 'danger-collapsible',
  definitionList: 'definition-list',
  definitionTerm: 'definition-term',
  deleted: 'deleted',
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
  exampleAlt: 'example-alt',
  exampleCollapsible: 'example-collapsible',
  exampleList: 'example-list',
  extractorBlock: 'extractor-block',
  extractorConfiguration: 'extractor-configuration',
  extractorInformation: 'extractor-information',
  extractorPage: 'extractor-page',
  extractorPageCollapsible: 'extractor-page-collapsible',
  extractorPageFooter: 'extractor-page-footer',
  extractorPageFooterCollapsible: 'extractor-page-footer-collapsible',
  extractorPageHeader: 'extractor-page-header',
  extractorPageHeaderCollapsible: 'extractor-page-header-collapsible',
  extractorPageNumber: 'extractor-page-number',
  extractorPageNumberCollapsible: 'extractor-page-number-collapsible',
  extractorPageWithBlocks: 'extractor-page-with-blocks',
  extractorPageWithBlocksCollapsible: 'extractor-page-with-blocks-collapsible',
  extractorRepeatedText: 'extractor-repeated-text',
  featured: 'featured',
  figure: 'figure',
  flashcard: 'flashcard',
  flashcard1: 'flashcard-1',
  focusImage: 'focus-image',
  footNote: 'foot-note',
  formula: 'formula',
  gapText: 'gap-text',
  gapTextInstructionGrouped: 'gap-text-instruction-grouped',
  glossaryTerm: 'glossary-term',
  groupBorn: 'group-born',
  groupDied: 'group-died',
  handInAudio: 'hand-in-audio',
  handInContact: 'hand-in-contact',
  handInDocument: 'hand-in-document',
  handInFile: 'hand-in-file',
  handInLocation: 'hand-in-location',
  handInPhoto: 'hand-in-photo',
  handInScan: 'hand-in-scan',
  handInSubmit: 'hand-in-submit',
  handInVideo: 'hand-in-video',
  handInVoice: 'hand-in-voice',
  help: 'help',
  helpAlt: 'help-alt',
  highlightText: 'highlight-text',
  hint: 'hint',
  hintAlt: 'hint-alt',
  hintCollapsible: 'hint-collapsible',
  image: 'image',
  imageBanner: 'image-banner',
  imageFigure: 'image-figure',
  imageFigureAlt: 'image-figure-alt',
  imageLandscape: 'image-landscape',
  imageLink: 'image-link',
  imageMood: 'image-mood',
  imageOnDevice: 'image-on-device',
  imagePortrait: 'image-portrait',
  imagePrototype: 'image-prototype',
  imageResponsive: 'image-responsive',
  imageScreenshot: 'image-screenshot',
  imageSeparator: 'image-separator',
  imageSeparatorAlt: 'image-separator-alt',
  imagesLogoGrave: 'images-logo-grave',
  imageStyled: 'image-styled',
  imageSuperWide: 'image-super-wide',
  imageZoom: 'image-zoom',
  indexTerm: 'index-term',
  info: 'info',
  infoAlt: 'info-alt',
  infoCollapsible: 'info-collapsible',
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
  leAssignment: 'le-assignment',
  leClassroomEvent: 'le-classroom-event',
  leCompletion: 'le-completion',
  leExternalLink: 'le-external-link',
  leFinishingTask: 'le-finishing-task',
  leFollowUpTask: 'le-follow-up-task',
  leLearningObjectives: 'le-learning-objectives',
  leLearningStep: 'le-learning-step',
  leListenAudioEmbed: 'le-listen-audio-embed',
  lePreparationTask: 'le-preparation-task',
  leRead: 'le-read',
  leReadBook: 'le-read-book',
  leTask: 'le-task',
  leTodo: 'le-todo',
  leVideoCall: 'le-video-call',
  leWatchVideoEmbed: 'le-watch-video-embed',
  lifeSkillSticker: 'life-skill-sticker',
  list: 'list',
  listItem: 'list-item',
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
  metalevelExplanation: 'metalevel-explanation',
  milestone: 'milestone',
  module: 'module',
  moduleProduct: 'module-product',
  multipleChoice: 'multiple-choice',
  multipleChoice1: 'multiple-choice-1',
  multipleChoiceText: 'multiple-choice-text',
  multipleResponse: 'multiple-response',
  multipleResponse1: 'multiple-response-1',
  newspaperArticle: 'newspaper-article',
  note: 'note',
  noteAi: 'note-ai',
  noteAlt: 'note-alt',
  notebookArticle: 'notebook-article',
  noteCollapsible: 'note-collapsible',
  output: 'output',
  page: 'page',
  pageAcademy: 'page-academy',
  pageArticle: 'page-article',
  pageArticleAlt: 'page-article-alt',
  pageArticleResponsive: 'page-article-responsive',
  pageBanner: 'page-banner',
  pageBuyButton: 'page-buy-button',
  pageBuyButtonAlt: 'page-buy-button-alt',
  pageBuyButtonPromotion: 'page-buy-button-promotion',
  pageCategory: 'page-category',
  pageCollapsible: 'page-collapsible',
  pageContainer: 'page-container',
  pageContainerFolder: 'page-container-folder',
  pageContainerGroup: 'page-container-group',
  pageContainerNowrap: 'page-container-nowrap',
  pageContainerNowrapStretch: 'page-container-nowrap-stretch',
  pageContainerWrap: 'page-container-wrap',
  pageCoverImage: 'page-cover-image',
  pageFooter: 'page-footer',
  pageHero: 'page-hero',
  pageOpenBook: 'page-open-book',
  pageOpenBookList: 'page-open-book-list',
  pagePerson: 'page-person',
  pageProduct: 'page-product',
  pageProductList: 'page-product-list',
  pageProductVideo: 'page-product-video',
  pageProductVideoList: 'page-product-video-list',
  pagePromotion: 'page-promotion',
  pageSectionFolder: 'page-section-folder',
  pageShopInShop: 'page-shop-in-shop',
  pageSpecial: 'page-special',
  pageSubpage: 'page-subpage',
  pageSubscribe: 'page-subscribe',
  parameters: 'parameters',
  photo: 'photo',
  preparationNote: 'preparation-note',
  pronunciationTable: 'pronunciation-table',
  prototypeImages: 'prototype-images',
  qAndA: 'q-and-a',
  question1: 'question-1',
  quote: 'quote',
  rating: 'rating',
  recipe: 'recipe',
  recordAudio: 'record-audio',
  recordVideo: 'record-video',
  releaseNote: 'release-note',
  releaseNotesSummary: 'release-notes-summary',
  remark: 'remark',
  remarkAlt: 'remark-alt',
  remarkCollapsible: 'remark-collapsible',
  reviewApprovedNote: 'review-approved-note',
  reviewAuthorNote: 'review-author-note',
  reviewCustomerNote: 'review-customer-note',
  reviewNote: 'review-note',
  reviewRequestForReviewNote: 'review-request-for-review-note',
  reviewReviewerNote: 'review-reviewer-note',
  sampleSolution: 'sample-solution',
  scorm: 'scorm',
  screenshot: 'screenshot',
  selfAssessment: 'self-assessment',
  separator: 'separator',
  separatorAlt: 'separator-alt',
  sequence: 'sequence',
  sideNote: 'side-note',
  sideNoteCollapsible: 'side-note-collapsible',
  smartStandardArticleNonNormative: 'smart-standard-article-non-normative',
  smartStandardArticleNonNormativeCollapsible: 'smart-standard-article-non-normative-collapsible',
  smartStandardArticleNormative: 'smart-standard-article-normative',
  smartStandardArticleNormativeCollapsible: 'smart-standard-article-normative-collapsible',
  smartStandardExampleNonNormative: 'smart-standard-example-non-normative',
  smartStandardExampleNonNormativeCollapsible: 'smart-standard-example-non-normative-collapsible',
  smartStandardExampleNormative: 'smart-standard-example-normative',
  smartStandardExampleNormativeCollapsible: 'smart-standard-example-normative-collapsible',
  smartStandardImageFigureNonNormative: 'smart-standard-image-figure-non-normative',
  smartStandardImageFigureNonNormativeCollapsible: 'smart-standard-image-figure-non-normative-collapsible',
  smartStandardImageFigureNormative: 'smart-standard-image-figure-normative',
  smartStandardImageFigureNormativeCollapsible: 'smart-standard-image-figure-normative-collapsible',
  smartStandardList: 'smart-standard-list',
  smartStandardListCollapsible: 'smart-standard-list-collapsible',
  smartStandardListItem: 'smart-standard-list-item',
  smartStandardListItemCollapsible: 'smart-standard-list-item-collapsible',
  smartStandardNoteNonNormative: 'smart-standard-note-non-normative',
  smartStandardNoteNonNormativeCollapsible: 'smart-standard-note-non-normative-collapsible',
  smartStandardNoteNormative: 'smart-standard-note-normative',
  smartStandardNoteNormativeCollapsible: 'smart-standard-note-normative-collapsible',
  smartStandardRemarkNonNormative: 'smart-standard-remark-non-normative',
  smartStandardRemarkNonNormativeCollapsible: 'smart-standard-remark-non-normative-collapsible',
  smartStandardRemarkNormative: 'smart-standard-remark-normative',
  smartStandardRemarkNormativeCollapsible: 'smart-standard-remark-normative-collapsible',
  smartStandardRemarkTableImageNonNormative: 'smart-standard-remark-table-image-non-normative',
  smartStandardRemarkTableImageNonNormativeCollapsible: 'smart-standard-remark-table-image-non-normative-collapsible',
  smartStandardRemarkTableImageNormative: 'smart-standard-remark-table-image-normative',
  smartStandardRemarkTableImageNormativeCollapsible: 'smart-standard-remark-table-image-normative-collapsible',
  smartStandardRemarkTableNonNormative: 'smart-standard-remark-table-non-normative',
  smartStandardRemarkTableNonNormativeCollapsible: 'smart-standard-remark-table-non-normative-collapsible',
  smartStandardRemarkTableNormative: 'smart-standard-remark-table-normative',
  smartStandardRemarkTableNormativeCollapsible: 'smart-standard-remark-table-normative-collapsible',
  smartStandardTableImageNonNormative: 'smart-standard-table-image-non-normative',
  smartStandardTableImageNonNormativeCollapsible: 'smart-standard-table-image-non-normative-collapsible',
  smartStandardTableImageNormative: 'smart-standard-table-image-normative',
  smartStandardTableImageNormativeCollapsible: 'smart-standard-table-image-normative-collapsible',
  smartStandardTableNonNormative: 'smart-standard-table-non-normative',
  smartStandardTableNonNormativeCollapsible: 'smart-standard-table-non-normative-collapsible',
  smartStandardTableNormative: 'smart-standard-table-normative',
  smartStandardTableNormativeCollapsible: 'smart-standard-table-normative-collapsible',
  standardArticleNonNormative: 'standard-article-non-normative',
  standardArticleNormative: 'standard-article-normative',
  standardExampleNonNormative: 'standard-example-non-normative',
  standardExampleNormative: 'standard-example-normative',
  standardImageFigureNonNormative: 'standard-image-figure-non-normative',
  standardImageFigureNormative: 'standard-image-figure-normative',
  standardList: 'standard-list',
  standardListItem: 'standard-list-item',
  standardNoteNonNormative: 'standard-note-non-normative',
  standardNoteNormative: 'standard-note-normative',
  standardRemarkNonNormative: 'standard-remark-non-normative',
  standardRemarkNormative: 'standard-remark-normative',
  standardRemarkTableImageNonNormative: 'standard-remark-table-image-non-normative',
  standardRemarkTableImageNormative: 'standard-remark-table-image-normative',
  standardRemarkTableNonNormative: 'standard-remark-table-non-normative',
  standardRemarkTableNormative: 'standard-remark-table-normative',
  standardTableImageNonNormative: 'standard-table-image-non-normative',
  standardTableImageNormative: 'standard-table-image-normative',
  standardTableNonNormative: 'standard-table-non-normative',
  standardTableNormative: 'standard-table-normative',
  statement: 'statement',
  stdout: 'stdout',
  step: 'step',
  stepImageScreenshot: 'step-image-screenshot',
  stepImageScreenshotWithPointer: 'step-image-screenshot-with-pointer',
  sticker: 'sticker',
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
  surveyMatrix: 'survey-matrix',
  surveyMatrixMe: 'survey-matrix-me',
  surveyRating: 'survey-rating',
  surveyRatingDisplay: 'survey-rating-display',
  surveyRatingOnce: 'survey-rating-once',
  table: 'table',
  tableAlt: 'table-alt',
  tableImage: 'table-image',
  tableImageAlt: 'table-image-alt',
  takePicture: 'take-picture',
  toc: 'toc',
  tocChapter: 'toc-chapter',
  trueFalse: 'true-false',
  trueFalse1: 'true-false-1',
  vendorAmcharts5Chart: 'vendor-amcharts-5-chart',
  vendorFormbricksEmbed: 'vendor-formbricks-embed',
  vendorFormbricksLink: 'vendor-formbricks-link',
  vendorFormbricksEmbedAnonymous: 'vendor-formbricks-embed-anonymous',
  vendorFormbricksLinkAnonymous: 'vendor-formbricks-link-anonymous',
  vendorHighchartsChart: 'vendor-highcharts-chart',
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
  vendorStripePricingTable: 'vendor-stripe-pricing-table',
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
  warningAlt: 'warning-alt',
  warningCollapsible: 'warning-collapsible',
  websiteLink: 'website-link',
  workbookArticle: 'workbook-article',
});

export type BitTypeType = EnumType<typeof BitType>;

export { BitType };
