import { EnumType, superenum } from '@ncoderz/superenum';

// Type containing both the root and alias bit types
export interface BitType {
  alias: RootOrAliasBitTypeType;
  root: RootBitTypeType;
}

export type RootBitTypeType = EnumType<typeof RootBitType>;
export type AliasBitTypeType = EnumType<typeof AliasBitType>;
export type RootOrAliasBitTypeType = RootBitTypeType | AliasBitTypeType;

const RootBitType = superenum({
  _error: '_error', // Used for error handling to indicate a bit type that is not supported or a bit parse error
  appFlashcards: 'app-flashcards',
  appLink: 'app-link',
  article: 'article',
  articleEmbed: 'article-embed',
  articleLink: 'article-link',
  audio: 'audio',
  audioEmbed: 'audio-embed',
  audioLink: 'audio-link',
  bitAlias: 'bit-alias',
  book: 'book',
  bookAlias: 'book-alias',
  botActionResponse: 'bot-action-response',
  botActionSend: 'bot-action-send',
  browserImage: 'browser-image',
  card1: 'card-1',
  chapter: 'chapter',
  cloze: 'cloze',
  clozeAndMultipleChoiceText: 'cloze-and-multiple-choice-text',
  code: 'code',
  conversationLeft1: 'conversation-left-1',
  document: 'document',
  documentDownload: 'document-download',
  documentEmbed: 'document-embed',
  documentLink: 'document-link',
  essay: 'essay',
  example: 'example',
  flashcard: 'flashcard',
  focusImage: 'focus-image',
  highlightText: 'highlight-text',
  image: 'image',
  imageLink: 'image-link',
  imageOnDevice: 'image-on-device',
  imageResponsive: 'image-responsive',
  internalLink: 'internal-link',
  interview: 'interview',
  learningPathBook: 'learning-path-book',
  learningPathBotTraining: 'learning-path-bot-training',
  learningPathExternalLink: 'learning-path-external-link',
  learningPathVideoCall: 'learning-path-video-call',
  mark: 'mark',
  match: 'match',
  matchAudio: 'match-audio',
  matchMatrix: 'match-matrix',
  matchPicture: 'match-picture',
  multipleChoice: 'multiple-choice',
  multipleChoice1: 'multiple-choice-1',
  multipleChoiceText: 'multiple-choice-text',
  multipleResponse: 'multiple-response',
  multipleResponse1: 'multiple-response-1',
  pageBuyButton: 'page-buy-button',
  photo: 'photo',
  quote: 'quote',
  rating: 'rating',
  // record: 'record',
  releaseNote: 'release-note',
  sampleSolution: 'sample-solution',
  sequence: 'sequence',
  stillImageFilm: 'still-image-film',
  stillImageFilmEmbed: 'still-image-film-embed',
  stillImageFilmLink: 'still-image-film-link',
  survey: 'survey',
  surveyAnonymous: 'survey-anonymous',
  toc: 'toc',
  trueFalse: 'true-false',
  trueFalse1: 'true-false-1',
  vendorPadletEmbed: 'vendor-padlet-embed',
  vendorJupyterOutput: 'vendor-jupyter-output',
  video: 'video',
  videoEmbed: 'video-embed',
  videoLink: 'video-link',
  websiteLink: 'website-link',
});

const AliasBitType = superenum({
  aiPrompt: 'ai-prompt',
  anchor: 'anchor',
  appAiPrompt: 'app-ai-prompt',
  appCodeCell: 'app-code-cell',
  appCodeEditor: 'app-code-editor',
  appCodeIde: 'app-code-ide',
  appCreateBitsFromImage: 'app-create-bits-from-image',
  appFlashcardsLearn: 'app-flashcards-learn',
  appFlashcardsQuiz: 'app-flashcards-quiz',
  appGetScreenshot: 'app-get-screenshot',
  articleAi: 'article-ai',
  articleAttachment: 'article-attachment',
  assignment: 'assignment',
  audioTranscript: 'audio-transcript',
  bitBookEnding: 'bit-book-ending',
  bitBookSummary: 'bit-book-summary',
  bitmarkExample: 'bitmark-example',
  blogArticle: 'blog-article',
  bookAcknowledgments: 'book-acknowledgments',
  bookAddendum: 'book-addendum',
  bookAfterword: 'book-afterword',
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
  botActionSave: 'bot-action-save',
  botActionTrueFalse: 'bot-action-true-false',
  botInterview: 'bot-interview',
  bug: 'bug',
  buttonCopyText: 'button-copy-text',
  chapterSubjectMatter: 'chapter-subject-matter',
  chat: 'chat',
  checklist: 'checklist',
  clozeInstructionGrouped: 'cloze-instruction-grouped',
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
  codeRuntime: 'code-runtime',
  conclusion: 'conclusion',
  consoleLog: 'console-log',
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
  details: 'details',
  details1: 'details-1',
  detailsImage: 'details-image',
  documentUpload: 'document-upload',
  editorial: 'editorial',
  editorNote: 'editor-note',
  featured: 'featured',
  figure: 'figure',
  flashcard1: 'flashcard-1',
  footNote: 'foot-note',
  groupBorn: 'group-born',
  groupDied: 'group-died',
  help: 'help',
  hint: 'hint',
  imageBanner: 'image-banner',
  imageFigure: 'image-figure',
  imageLandscape: 'image-landscape',
  imageMood: 'image-mood',
  imagePortrait: 'image-portrait',
  imagePrototype: 'image-prototype',
  imageScreenshot: 'image-screenshot',
  imageStyled: 'image-styled',
  imageSuperWide: 'image-super-wide',
  imageZoom: 'image-zoom',
  info: 'info',
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
  matchAll: 'match-all',
  matchAllReverse: 'match-all-reverse',
  matchReverse: 'match-reverse',
  matchSolutionGrouped: 'match-solution-grouped',
  message: 'message',
  newspaperArticle: 'newspaper-article',
  note: 'note',
  noteAi: 'note-ai',
  notebookArticle: 'notebook-article',
  output: 'output',
  page: 'page',
  pageBanner: 'page-banner',
  preparationNote: 'preparation-note',
  question1: 'question-1',
  recordAudio: 'record-audio',
  releaseNotesSummary: 'release-notes-summary',
  remark: 'remark',
  reviewApprovedNote: 'review-approved-note',
  reviewAuthorNote: 'review-author-note',
  reviewNote: 'review-note',
  reviewRequestForReviewNote: 'review-request-for-review-note',
  reviewReviewerNote: 'review-reviewer-note',
  screenshot: 'screenshot',
  selfAssessment: 'self-assessment',
  sideNote: 'side-note',
  statement: 'statement',
  stdout: 'stdout',
  stickyNote: 'sticky-note',
  summary: 'summary',
  summaryAi: 'summary-ai',
  survey1: 'survey-1',
  surveyAnonymous1: 'survey-anonymous-1',
  takePicture: 'take-picture',
  vendorJupyterCellCode: 'vendor-jupyter-cell-code',
  vendorJupyterCellMarkdown: 'vendor-jupyter-cell-markdown',
  vendorJupyterCellRaw: 'vendor-jupyter-cell-raw',
  vendorJupyterIpynb: 'vendor-jupyter-ipynb',
  videoLandscape: 'video-landscape',
  videoPortrait: 'video-portrait',
  videoEmbedLandscape: 'video-embed-landscape',
  videoEmbedPortrait: 'video-embed-portrait',
  videoLinkLandscape: 'video-link-landscape',
  videoLinkPortrait: 'video-link-portrait',
  videoTranscript: 'video-transcript',
  warning: 'warning',
  workbookArticle: 'workbook-article',
});

export { RootBitType, AliasBitType };
