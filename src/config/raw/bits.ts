import { type _BitsConfig } from '../../model/config/_Config.ts';
import { CardSetConfigKey } from '../../model/config/enum/CardSetConfigKey.ts';
import { ConfigKey } from '../../model/config/enum/ConfigKey.ts';
import { BitType } from '../../model/enum/BitType.ts';
import { Count } from '../../model/enum/Count.ts';
import { ExampleType } from '../../model/enum/ExampleType.ts';
import { TagFormat } from '../../model/enum/TagFormat.ts';
import { TextFormat } from '../../model/enum/TextFormat.ts';

const BITS: _BitsConfig = {
  [BitType._error]: {
    since: '1.3.0',
    description: 'An error bit, rendered when the bit cannot be interpreted',
  },

  [BitType._comment]: {
    since: '1.4.12',
    description:
      'A comment bit, used when a bit is commented out by adding | between the . and the bit name, e.g [.|article]',
  },

  [BitType._standard]: {
    since: '3.2.0',
    description:
      'The standard bit type, used as a base for other bits, should not be used directly',
    tags: [
      {
        key: ConfigKey.group_standardTags,
        description: 'Standard tags for (almost) all bits',
      },
    ],
  },

  [BitType.appFlashcards]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'App flashcards bit, used for flashcard quizzes in the app',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
      {
        key: ConfigKey.tag_title,
        description: 'The title of the flashcard quiz',
      },
      {
        key: ConfigKey.property_flashcardSet,
        description: 'The flashcard set to use for the app flashcards',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.appFlashcardsQuiz]: {
    since: '1.3.0',
    baseBitType: BitType.appFlashcards,
    description: 'App flashcards quiz bit',
  },
  [BitType.appFlashcardsLearn]: {
    since: '1.3.0',
    baseBitType: BitType.appFlashcards,
    description: 'App flashcards learn bit',
  },
  [BitType.appLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'App link bit, used to link to other bits in the app',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceAppLink,
        description: 'Tags for the app link resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.author]: {
    since: '4.2.0',
    baseBitType: BitType._standard,
    description: 'Represents an author of something',
    tags: [
      {
        key: ConfigKey.property_fullName,
        description: 'Full name of the author',
      },
      {
        key: ConfigKey.property_pseudonym,
        description: 'A pseudonym of the author, if any',
      },
      {
        key: ConfigKey.property_title,
        description: 'The title of the author, e.g. "Dr.", "Prof.", etc.',
        jsonKey: 'title',
      },
      {
        key: ConfigKey.property_jobTitle,
        description: 'The job title of the author, e.g. "Software Engineer", "Professor", etc.',
      },
    ],
  },
  [BitType.bookAuthor]: {
    since: '4.2.0',
    baseBitType: BitType.author,
    description: 'Represents an author of a book',
  },
  [BitType.articleAuthor]: {
    since: '4.2.0',
    baseBitType: BitType.author,
    description: 'Represents an author of a book',
  },
  [BitType.article]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Article bit, used for articles / paragraphs',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'The title of the article',
      },
    ],
  },
  [BitType.articleAlt]: {
    since: '1.15.0',
    baseBitType: BitType.article,
    description: 'Alternative article bit',
  },
  [BitType.articleResponsive]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Responsive article bit, used for articles that adapt to the screen size',
    tags: [
      {
        key: ConfigKey.property_imageFirst,
        description: 'If the image should be displayed first in the responsive article',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [BitType.articleResponsiveAlt]: {
    since: '2.0.0',
    baseBitType: BitType.articleResponsive,
    description: 'Alternative responsive article bit',
  },
  [BitType.standardArticleNormative]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description: 'Standard normative article bit',
  },
  [BitType.standardArticleNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description: 'Standard non-normative article bit',
  },
  [BitType.smartStandardArticleNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardArticleNormative,
    description: 'Smart standard normative article bit',
  },
  [BitType.smartStandardArticleNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardArticleNonNormative,
    description: 'Smart standard non-normative article bit',
  },
  [BitType.smartStandardArticleNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardArticleNormative,
    description: 'Smart standard normative article bit that is collapsible',
  },
  [BitType.smartStandardArticleNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardArticleNonNormative,
    description: 'Smart standard non-normative article bit that is collapsible',
  },
  [BitType.statement]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Statement bit, used for statements in documents',
  },
  [BitType.pageArticle]: {
    since: '1.15.0',
    baseBitType: BitType.article,
    description: 'Page article bit',
  },
  [BitType.pageArticleAlt]: {
    since: '1.15.0',
    baseBitType: BitType.article,
    description: 'Alternative page article bit',
  },
  [BitType.pageArticleResponsive]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Responsive page article bit, used for articles that adapt to the screen size',
    tags: [
      {
        key: ConfigKey.property_imageFirst,
        description: 'If the image should be displayed first in the responsive article',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [BitType.buttonCopyText]: {
    since: '1.4.3',
    baseBitType: BitType.article,
    description: 'Button copy text bit, used to create a button that copies text to the clipboard',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.catalogItemBook]: {
    since: '4.15.0',
    baseBitType: BitType._standard,
    description:
      'Catalog item book bit, used to represent a book product in a catalog with cover and description',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'Title and subtitle of the catalog item',
        maxCount: 2,
      },
      {
        key: ConfigKey.property_coverImage,
        description: 'Cover image of the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.resource_coverImage,
        description: 'Cover image of the catalog item',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the cover image resource',
          },
        ],
      },
      {
        key: ConfigKey.property_content2Buy,
        description: 'Content to buy identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_listPrice,
        description: 'List price of the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the buy button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_customerProductId,
        description: 'Customer-specific product identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_currency,
        description: 'Currency for the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookIsbn,
        description: 'ISBN for iBook version',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookAuthor,
        description: 'Author of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookType,
        description: 'Type of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookBindingType,
        description: 'Binding type of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookNumberOfPages,
        description: 'Number of pages in the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookRating,
        description: 'Rating of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesTitle,
        description: 'Title of the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesId,
        description: 'ID of the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesNumber,
        description: 'Number in the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookLanguage,
        description: 'Language of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookPublishingDate,
        description: 'Publishing date of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookPublisher,
        description: 'Publisher of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookTranslator,
        description: 'Translator of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookOriginalTitle,
        description: 'Original title of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_gmbExternalShop,
        description: 'External shop identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_gmbExternalShopItems,
        description: 'Array of external shop items',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_imageSource,
        description: 'Image source chain',
      },
      {
        key: ConfigKey.group_previewImages,
        description: 'Array of preview images for the catalog item',
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_previewVideos,
        description: 'Array of preview videos for the catalog item',
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.catalogItemExternalBook]: {
    since: '4.15.0',
    baseBitType: BitType._standard,
    description:
      'Catalog item external book bit, used to represent an external book product in a catalog with link to external shop',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'Title and subtitle of the catalog item',
        maxCount: 2,
      },
      {
        key: ConfigKey.property_coverImage,
        description: 'Cover image of the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.resource_coverImage,
        description: 'Cover image of the catalog item',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the cover image resource',
          },
        ],
      },
      {
        key: ConfigKey.property_customerProductShopLink,
        description: 'Link to external shop for the product',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_listPrice,
        description: 'List price of the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the buy button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_customerProductId,
        description: 'Customer-specific product identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_currency,
        description: 'Currency for the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookIsbn,
        description: 'ISBN for iBook version',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookAuthor,
        description: 'Author of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookType,
        description: 'Type of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookBindingType,
        description: 'Binding type of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookNumberOfPages,
        description: 'Number of pages in the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookRating,
        description: 'Rating of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesTitle,
        description: 'Title of the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesId,
        description: 'ID of the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesNumber,
        description: 'Number in the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookLanguage,
        description: 'Language of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookPublishingDate,
        description: 'Publishing date of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookPublisher,
        description: 'Publisher of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookTranslator,
        description: 'Translator of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookOriginalTitle,
        description: 'Original title of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_gmbExternalShop,
        description: 'External shop identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_gmbExternalShopItems,
        description: 'Array of external shop items',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_imageSource,
        description: 'Image source chain',
      },
      {
        key: ConfigKey.group_previewImages,
        description: 'Array of preview images for the catalog item',
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_previewVideos,
        description: 'Array of preview videos for the catalog item',
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.catalogItemProduct]: {
    since: '4.15.0',
    baseBitType: BitType._standard,
    description:
      'Catalog item product bit, used to represent a general product in a catalog with cover and description',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'Title and subtitle of the catalog item',
        maxCount: 2,
      },
      {
        key: ConfigKey.property_coverImage,
        description: 'Cover image of the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_content2Buy,
        description: 'Content to buy identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_listPrice,
        description: 'List price of the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the buy button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_customerProductId,
        description: 'Customer-specific product identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_currency,
        description: 'Currency for the catalog item',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookIsbn,
        description: 'ISBN for iBook version',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookAuthor,
        description: 'Author of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookType,
        description: 'Type of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookBindingType,
        description: 'Binding type of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookNumberOfPages,
        description: 'Number of pages in the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookRating,
        description: 'Rating of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesTitle,
        description: 'Title of the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesId,
        description: 'ID of the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookSeriesNumber,
        description: 'Number in the book series',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookLanguage,
        description: 'Language of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookPublishingDate,
        description: 'Publishing date of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookPublisher,
        description: 'Publisher of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookTranslator,
        description: 'Translator of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_bookOriginalTitle,
        description: 'Original title of the book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_gmbExternalShop,
        description: 'External shop identifier',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_gmbExternalShopItems,
        description: 'Array of external shop items',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_imageSource,
        description: 'Image source chain',
      },
      {
        key: ConfigKey.group_previewImages,
        description: 'Array of preview images for the catalog item',
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_previewVideos,
        description: 'Array of preview videos for the catalog item',
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.callToAction]: {
    since: '1.15.0',
    baseBitType: BitType._standard,
    description: 'Call to action bit, used to create a call to action button',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the call to action button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_callToActionUrl,
        description: 'The URL to navigate to when the call to action button is clicked',
        format: TagFormat.plainText,
        minCount: 1,
      },
    ],
  },
  [BitType.callToActionSubscribe]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action subscribe bit',
  },
  [BitType.callToActionContact]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action contact bit',
  },
  [BitType.callToActionJoin]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action join bit',
  },
  [BitType.callToActionMail]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action mail bit',
  },
  [BitType.callToActionLearnMore]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action learn more bit',
  },
  [BitType.callToActionSeeMore]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action see more bit',
  },
  [BitType.callToActionWatch]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action watch bit',
  },
  [BitType.callToActionStartNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action start now bit',
  },
  [BitType.callToActionGetOffer]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action get offer bit',
  },
  [BitType.callToActionBookNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action book now bit',
  },
  [BitType.callToActionShopNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action shop now bit',
  },
  [BitType.callToActionGetNow]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action get now bit',
  },
  [BitType.callToActionDownload]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action download bit',
  },
  [BitType.callToActionCreateAccount]: {
    since: '1.15.0',
    baseBitType: BitType.callToAction,
    description: 'Call to action create account bit',
  },
  [BitType.appBitmarkFromJavascript]: {
    since: '1.4.5',
    baseBitType: BitType._standard,
    description: 'App bitmark from JavaScript, used to create bits from JavaScript in the app',
    tags: [
      {
        key: ConfigKey.property_maxCreatedBits,
        description: 'The maximum number of bits that can be created from this bit',
        format: TagFormat.number,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.appBitmarkFromEditor]: {
    since: '1.4.5',
    baseBitType: BitType.appBitmarkFromJavascript,
    description: 'App bitmark from editor, used to create bits from the editor in the app',
  },
  [BitType.articleEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Article embed bit, used to embed articles from other sources',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceArticleEmbed,
        description: 'Tags for the article embed resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.articleLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Article link bit, used to link to articles from other sources',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceArticleLink,
        description: 'Tags for the article link resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.audio]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Audio bit, used for audio files',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceAudio,
        description: 'Tags for the audio resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.audioEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Audio embed bit, used to embed audio files from other sources',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceAudioEmbed,
        description: 'Tags for the audio embed resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.audioLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Audio link bit, used to link to audio files from other sources',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for the resource bit',
      },
      {
        key: ConfigKey.group_resourceAudioLink,
        description: 'Tags for the audio link resource',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.bitAlias]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bit alias, used to create an alias for a bit',
    tags: [
      {
        key: ConfigKey.tag_reference,
        description: 'The reference to the bit that this alias points to',
      },
      {
        key: ConfigKey.tag_anchor,
        description: 'The anchor for the bit alias, used for linking',
      },
    ],
  },
  [BitType.diff]: {
    since: '3.13.0',
    baseBitType: BitType._standard,
    description: 'Diff bit, used to show differences between two bits',
    tags: [
      {
        key: ConfigKey.property_diffTo,
        description: 'The reference to the bit that this diff compares to',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.book]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Book bit, used to represent a book',
    tags: [
      {
        key: ConfigKey.group_bookCommon,
        description: 'Common tags for book bits',
      },
    ],
  },
  [BitType.bookEnd]: {
    since: '3.27.0',
    baseBitType: BitType.article,
    description: 'End of book bit',
  },
  [BitType.bookAcknowledgements]: {
    since: '1.17.0',
    baseBitType: BitType.article,
    description: 'Acknowledgements section of a book',
  },
  [BitType.bookAddendum]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Addendum section of a book',
  },
  [BitType.bookAfterword]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Afterword section of a book',
  },
  [BitType.bookAppendix]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Appendix section of a book',
  },
  [BitType.bookArticle]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Article section of a book',
  },
  [BitType.bookAutherBio]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Author biography section of a book',
  },
  [BitType.bookBibliography]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Bibliography section of a book',
  },
  [BitType.bookComingSoon]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Coming soon section of a book',
  },
  [BitType.bookConclusion]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Conclusion section of a book',
  },
  [BitType.bookCopyright]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Copyright section of a book',
  },
  [BitType.bookCopyrightPermissions]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Copyright permissions section of a book',
  },
  [BitType.bookDedication]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Dedication section of a book',
  },
  [BitType.bookEndnotes]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Endnotes section of a book',
  },
  [BitType.bookEpigraph]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Epigraph section of a book',
  },
  [BitType.bookEpilogue]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Epilogue section of a book',
  },
  [BitType.bookForword]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Foreword section of a book',
  },
  [BitType.bookFrontispiece]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Frontispiece section of a book',
  },
  [BitType.bookImprint]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Imprint section of a book',
  },
  [BitType.bookIncitingIncident]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Inciting incident section of a book',
  },
  [BitType.bookIntroduction]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Introduction section of a book',
  },
  [BitType.bookListOfContributors]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'List of contributors section of a book',
  },
  [BitType.bookNotes]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Notes section of a book',
  },
  [BitType.bookPostscript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Postscript section of a book',
  },
  [BitType.bookPreface]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Preface section of a book',
  },
  [BitType.bookPrologue]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Prologue section of a book',
  },
  [BitType.bookReadMore]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Read more section of a book',
  },
  [BitType.bookReferenceList]: {
    //
    since: '3.2.0',
    baseBitType: BitType._standard,
    description: 'Book reference list, used to list references in a book',
    cardSet: CardSetConfigKey.bookReferenceList,
  },
  [BitType.bookRequestForABookReview]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Request for a book review section of a book',
  },
  [BitType.bookSummary]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Summary section of a book',
  },
  [BitType.bookTeaser]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Teaser section of a book',
  },
  [BitType.bookTitle]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Title section of a book',
  },
  [BitType.bookCover]: {
    since: '3.27.0',
    baseBitType: BitType.image,
    description: 'Cover image of a book',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'The title of the book cover',
        maxCount: 2, // title & subtitle
      },
      {
        key: ConfigKey.property_coverColor,
        description: 'The color of the book cover',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.bookAlias]: {
    since: '1.4.3',
    baseBitType: BitType.book,
    description: 'Book alias, used to create an alias for a book',
    tags: [
      {
        key: ConfigKey.property_bookAlias,
        description: 'The alias for the book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.bookDiff]: {
    since: '3.10.0',
    baseBitType: BitType.book,
    description: 'Book diff, used to show differences between two book versions',
    tags: [
      {
        key: ConfigKey.property_bookDiff,
        description: 'The reference to the book that this diff compares to',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.bookClose]: {
    since: '1.18.0',
    baseBitType: BitType.article,
    description: 'Close section of a book, used to close the book',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the close button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.bookReference]: {
    since: '2.2.0',
    baseBitType: BitType.article,
    description: 'Book reference, used to reference a book in another book',
    tags: [
      {
        key: ConfigKey.property_refAuthor,
        description: 'The author of the referenced book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_refBookTitle,
        description: 'The title of the referenced book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_refPublisher,
        description: 'The publisher of the referenced book',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_refPublicationYear,
        description: 'The publication year of the referenced book',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_citationStyle,
        description: 'The citation style to use for the book reference',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.botActionResponse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bot action response bit, used to define responses for bot actions',

    cardSet: CardSetConfigKey.botActionResponses,
  },
  [BitType.botActionSend]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bot action send bit, used to define actions for sending messages',
    tags: [
      {
        key: ConfigKey.property_date,
        description: 'The date when the message should be sent',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.browserImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Browser image bit, used to display images in the browser',
    tags: [
      {
        key: ConfigKey.property_focusX,
        description: 'The X coordinate for focusing the image in the browser',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_focusY,
        description: 'The Y coordinate for focusing the image in the browser',
        format: TagFormat.number,
      },
    ],
  },
  [BitType.card1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Card bit, used for cards in quizzes',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
    ],
  },
  [BitType.question1]: {
    since: '1.3.0',
    baseBitType: BitType.card1,
    description: 'Question card bit',
  },
  [BitType.survey1]: { since: '1.3.0', baseBitType: BitType.card1, description: 'Survey card bit' },
  [BitType.surveyAnonymous1]: {
    since: '1.3.0',
    baseBitType: BitType.card1,
    description: 'Anonymous survey card bit',
  },
  [BitType.chapter]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Chapter bit, used to define chapters in books or articles',
    tags: [
      {
        key: ConfigKey.tag_anchor,
        description: 'The anchor for the chapter, used for linking',
      },
      {
        key: ConfigKey.tag_title,
        description: 'The title of the chapter',
      },
      {
        key: ConfigKey.property_toc,
        description: 'If the chapter should be included in the table of contents',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
      {
        key: ConfigKey.property_progress,
        description: 'The progress of the chapter, used for tracking reading progress',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
    ],
  },
  [BitType.clozeAndMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Cloze and multiple choice text bit, used for quizzes with cloze and multiple choice questions',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
      {
        key: ConfigKey.group_gap,
        description: 'Tags for gaps in cloze and multiple choice text bits',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'Tags for true/false questions in cloze and multiple choice text bits',
      },
    ],
  },
  [BitType.coachCallToActionClozeAndMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.clozeAndMultipleChoiceText,
    description: 'Coach call to action cloze and multiple choice text bit',
  },
  [BitType.cloze]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Cloze bit, used for fill-in-the-blank questions in quizzes',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
      {
        key: ConfigKey.property_isCaseSensitive,
        description: 'If the cloze answers are case sensitive',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_quizCountItems,
        description: 'The number of items in the cloze quiz',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_quizStrikethroughSolutions,
        description: 'If the cloze solutions should be strikethrough',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.group_gap,
        description: 'Tags for gaps in cloze bits',
      },
    ],
  },
  [BitType.clozeInstructionGrouped]: {
    since: '1.3.0',
    baseBitType: BitType.cloze,
    description:
      'Cloze instruction grouped bit, used for cloze questions with grouped instructions',
  },
  [BitType.clozeSolutionGrouped]: {
    since: '1.3.0',
    baseBitType: BitType.cloze,
    description: 'Cloze solution grouped bit, used for cloze questions with grouped solutions',
  },
  [BitType.clozeSeveral]: {
    since: '3.5.0',
    baseBitType: BitType.cloze,
    description: 'Cloze several bit, used for cloze questions with multiple answers',
  },
  [BitType.gapText]: {
    since: '1.5.15',
    baseBitType: BitType.cloze,
    description: 'Gap text bit, used for fill-in-the-blank questions in quizzes with text gaps',
  },
  [BitType.gapTextInstructionGrouped]: {
    since: '1.5.15',
    baseBitType: BitType.clozeInstructionGrouped,
    description:
      'Gap text instruction grouped bit, used for fill-in-the-blank questions with grouped instructions',
  },
  [BitType.coachSelfReflectionCloze]: {
    since: '1.3.0',
    baseBitType: BitType.cloze,
    description: 'Coach self-reflection cloze bit, used for self-reflection questions in coaching',
  },
  [BitType.coachCallToActionCloze]: {
    since: '1.3.0',
    baseBitType: BitType.cloze,
    description: 'Coach call to action cloze bit, used for call to action questions in coaching',
  },
  [BitType.clozeList]: {
    since: '1.4.13',
    baseBitType: BitType._standard,
    description: 'Cloze list bit, used for lists of cloze questions in quizzes',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
    ],
    cardSet: CardSetConfigKey.clozeList,
  },
  [BitType.code]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Code bit, used for code snippets in articles or documents',
    tags: [
      {
        key: ConfigKey.property_computerLanguage,
        description: 'The programming language of the code snippet',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_codeLineNumbers,
        description: 'If line numbers should be displayed for the code snippet',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_codeMinimap,
        description: 'If a minimap should be displayed for the code snippet',
        format: TagFormat.boolean,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.formula]: {
    since: '1.35.0',
    baseBitType: BitType._standard,
    description: 'Formula bit, used for mathematical formulas in articles or documents',

    textFormatDefault: TextFormat.latex,
  },
  [BitType.smartStandardFormula]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
    description: 'Smart standard formula bit, used for mathematical formulas in smart standards',
  },
  [BitType.smartStandardFormulaNonNormative]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
    description:
      'Smart standard non-normative formula bit, used for mathematical formulas in smart standards that are non-normative',
  },
  [BitType.smartStandardFormulaNormative]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
    description:
      'Smart standard normative formula bit, used for mathematical formulas in smart standards that are normative',
  },
  [BitType.smartStandardRemarkFormula]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
    description:
      'Smart standard remark formula bit, used for mathematical formulas in smart standards remarks',
  },
  [BitType.smartStandardRemarkFormulaNonNormative]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
    description:
      'Smart standard non-normative remark formula bit, used for mathematical formulas in smart standards remarks that are non-normative',
  },
  [BitType.smartStandardRemarkFormulaNormative]: {
    since: '3.11.0',
    baseBitType: BitType.formula,
    description:
      'Smart standard normative remark formula bit, used for mathematical formulas in smart standards remarks that are normative',
  },
  [BitType.appCodeCell]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'App code cell, used to create code cells in the app editor',
  },
  [BitType.appCodeEditor]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'App code editor, used to create code editors in the app editor',
  },
  [BitType.appCodeIde]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'App code IDE, used to create code IDEs in the app editor',
  },
  [BitType.codeRuntime]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'Code runtime, used to define the runtime environment for code snippets',
  },
  [BitType.consoleLog]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'Console log, used to log messages to the console in code snippets',
  },
  [BitType.output]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'Output bit, used to display output from code snippets',
  },
  [BitType.stdout]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'Standard output bit, used to display standard output from code snippets',
  },
  [BitType.sandbox]: {
    since: '4.10.0',
    baseBitType: BitType.code,
    description: 'A sandbox bit, used to create a sandboxed environment for code execution',
  },
  [BitType.sandboxOutputJson]: {
    since: '4.10.0',
    baseBitType: BitType.code,
    description: 'A sandbox output JSON bit, used to display JSON output from sandboxed code',
  },
  [BitType.sandboxOutputMarkup]: {
    since: '4.10.0',
    baseBitType: BitType.code,
    description: 'A sandbox output markup bit, used to display markup output from sandboxed code',
  },
  [BitType.sandboxOutputRender]: {
    since: '4.10.0',
    baseBitType: BitType.code,
    description: 'A sandbox output render bit, used to display rendered output from sandboxed code',
  },
  [BitType.step]: {
    since: '1.5.1',
    baseBitType: BitType.article,
    description: 'Step bit, used to define steps in a process or guide',
  },
  [BitType.stepImageScreenshot]: {
    since: '1.5.1',
    baseBitType: BitType.image,
    description: 'Step image screenshot bit, used to display screenshots in steps',
  },
  [BitType.stepImageScreenshotWithPointer]: {
    since: '1.5.1',
    baseBitType: BitType.image,
    description:
      'Step image screenshot with pointer bit, used to display screenshots with pointers in steps',
    tags: [
      {
        key: ConfigKey.property_pointerTop,
        description: 'The top position of the pointer in the screenshot',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
      {
        key: ConfigKey.property_pointerLeft,
        description: 'The left position of the pointer in the screenshot',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },
  [BitType.milestone]: {
    since: '1.20.0',
    baseBitType: BitType.step,
    description: 'Milestone bit, used to define milestones in a process or guide',
  },
  [BitType.conversationLeft1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Conversation left bit, used to create a conversation on the left side of the screen',
    tags: [
      {
        key: ConfigKey.group_person,
        description: 'Tags for the person in the conversation',
      },
    ],
  },
  [BitType.conversationLeft1Scream]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Conversation left scream bit, used to create a conversation with a scream on the left side of the screen',
  },
  [BitType.conversationLeft1Thought]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Conversation left thought bit, used to create a conversation with a thought on the left side of the screen',
  },
  [BitType.conversationRight1]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Conversation right bit, used to create a conversation on the right side of the screen',
  },
  [BitType.conversationRight1Scream]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Conversation right scream bit, used to create a conversation with a scream on the right side of the screen',
  },
  [BitType.conversationRight1Thought]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Conversation right thought bit, used to create a conversation with a thought on the right side of the screen',
  },
  [BitType.clozeAndMultipleChoiceTextConversationLeft1]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Cloze and multiple choice text conversation left bit, used for conversations with cloze and multiple choice text on the left side of the screen',
  },
  [BitType.clozeAndMultipleChoiceTextConversationLeft1Scream]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Cloze and multiple choice text conversation left scream bit, used for conversations with cloze and multiple choice text and a scream on the left side of the screen',
  },
  [BitType.clozeAndMultipleChoiceTextConversationLeft1Thought]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Cloze and multiple choice text conversation left thought bit, used for conversations with cloze and multiple choice text and a thought on the left side of the screen',
  },
  [BitType.clozeAndMultipleChoiceTextConversationRight1]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Cloze and multiple choice text conversation right bit, used for conversations with cloze and multiple choice text on the right side of the screen',
  },
  [BitType.clozeAndMultipleChoiceTextConversationRight1Scream]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Cloze and multiple choice text conversation right scream bit, used for conversations with cloze and multiple choice text and a scream on the right side of the screen',
  },
  [BitType.clozeAndMultipleChoiceTextConversationRight1Thought]: {
    since: '1.3.0',
    baseBitType: BitType.conversationLeft1,
    description:
      'Cloze and multiple choice text conversation right thought bit, used for conversations with cloze and multiple choice text and a thought on the right side of the screen',
  },

  [BitType.advertising]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'General advertising content bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingAdvertorial]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'Advertorial content bit (sponsored article)',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },

  [BitType.advertisingCallToAction]: {
    since: '4.2.0',
    baseBitType: BitType.callToAction,
    description: 'Call-to-action for advertising',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingCallToActionMeeting]: {
    since: '4.2.0',
    baseBitType: BitType.callToAction,
    description: 'Call-to-action for meeting or appointment',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },

  [BitType.advertisingBanner]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Banner advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingSkyscraper]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Skyscraper (vertical) advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingRectangle]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Rectangle advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },

  [BitType.advertisingFullPage]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Full-page advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingHalfPage]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Half-page advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingQuarterPage]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Quarter-page advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingClassifiedPage]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Classifieds advertisement page bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingLandscape]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Landscape format advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },
  [BitType.advertisingPortrait]: {
    since: '4.2.0',
    baseBitType: BitType.image,
    description: 'Portrait format advertisement bit',
    tags: [
      {
        key: ConfigKey.group_advertisingCommon,
        description: 'Common advertising tags',
      },
    ],
  },

  [BitType.cookPreparation]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook preparation bit',
  },
  [BitType.cookStep]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook step bit',
  },
  [BitType.cookIngredients]: {
    since: '1.5.16',
    baseBitType: BitType._standard,
    description: 'Cook ingredients bit, used to define ingredients for recipes',
    tags: [
      {
        key: ConfigKey.group_technicalTerm,
        description: 'Tags for technical terms related to ingredients',
      },
      {
        key: ConfigKey.property_servings,
        description: 'The number of servings for the ingredients',
        format: TagFormat.number,
        chain: [
          {
            key: ConfigKey.property_unit,
            description: 'The unit of measurement for the ingredients',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_unitAbbr,
            description: 'The abbreviation for the unit of measurement',
            format: TagFormat.plainText,
          },
          {
            key: ConfigKey.property_decimalPlaces,
            description: 'The number of decimal places for the ingredient quantity',
            format: TagFormat.number,
            defaultValue: '1',
          },
          {
            key: ConfigKey.property_disableCalculation,
            description: 'If the ingredient quantity calculation should be disabled',
            format: TagFormat.boolean,
          },
          {
            key: ConfigKey.tag_hint,
            description: 'Hint for the ingredient, used to provide additional information',
          },
        ],
      },
    ],
    cardSet: CardSetConfigKey.ingredients,
  },
  [BitType.recipe]: {
    since: '1.5.24',
    baseBitType: BitType.cookIngredients,
    description: 'Recipe bit, used to define a recipe',
  },
  [BitType.cookRemark]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook remark bit, used to add remarks to recipes',
  },
  [BitType.cookVariation]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook variation bit, used to define variations of recipes',
  },
  [BitType.cookInsert]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook insert bit, used to insert additional content in recipes',
  },
  [BitType.cookNoteOnQuantity]: {
    since: '3.27.0',
    baseBitType: BitType.article,
    description: 'Cook note on quantity bit, used to add notes on ingredient quantities in recipes',
  },
  [BitType.cookArrangement]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook arrangement bit, used to arrange ingredients or steps in recipes',
  },
  [BitType.cookPracticeAdvise]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook practice advice bit, used to provide practical advice in recipes',
  },
  [BitType.cookPlate]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook plate bit, used to define the presentation of a dish',
  },
  [BitType.cookRecommendation]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook recommendation bit, used to recommend dishes or ingredients',
  },
  [BitType.cookPersonalRecommendation]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Cook personal recommendation bit, used to provide personal recommendations for dishes or ingredients',
  },
  [BitType.cookSideDrink]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook side drink bit, used to define side drinks for dishes',
  },
  [BitType.cookSideDish]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook side dish bit, used to define side dishes for main courses',
  },
  [BitType.cookTimer]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Cook timer bit, used to set timers for cooking steps',
  },
  [BitType.document]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Document bit, used to define documents in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for resource bits, used to categorize documents',
      },
      {
        key: ConfigKey.group_resourceDocument,
        description: 'Tags for document resources, used to define documents in articles or books',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.documentDownload]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Document download bit, used to define downloadable documents in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for resource bits, used to categorize downloadable documents',
      },
      {
        key: ConfigKey.group_resourceDocumentDownload,
        description:
          'Tags for downloadable document resources, used to define downloadable documents in articles or books',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.leDocumentDownload]: {
    since: '3.18.0',
    baseBitType: BitType.documentDownload,
    description:
      'LE Document download bit, used to define downloadable documents in learning experiences',
  },
  [BitType.documentEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Document embed bit, used to embed documents in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for resource bits, used to categorize embedded documents',
      },
      {
        key: ConfigKey.group_resourceDocumentEmbed,
        description:
          'Tags for embedded document resources, used to define embedded documents in articles or books',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.documentLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Document link bit, used to link to documents in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Tags for resource bits, used to categorize document links',
      },
      {
        key: ConfigKey.group_resourceDocumentLink,
        description:
          'Tags for document link resources, used to define links to documents in articles or books',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.essay]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Essay bit, used to define essays in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common tags for quiz bits',
      },
      {
        key: ConfigKey.property_reasonableNumOfChars,
        description: 'The reasonable number of characters for the essay',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_sampleSolution,
        description: 'Sample solution for the essay, used as a reference answer',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_partialAnswer,
        description: 'Partial answer for the essay, used to indicate incomplete answers',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_reference,
        description: 'Reference for the essay, used to link to external resources',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.coachSelfReflectionEssay]: {
    since: '1.3.0',
    baseBitType: BitType.essay,
    description: 'Coach self-reflection essay bit',
  },
  [BitType.coachCallToActionEssay]: {
    since: '1.3.0',
    baseBitType: BitType.essay,
    description: 'Coach call to action essay bit',
  },
  [BitType.example]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Example bit, used to provide examples in articles or books',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'The title of the example',
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.exampleAlt]: {
    since: '1.16.0',
    baseBitType: BitType.example,
    description:
      'Alternative example bit, used to provide alternative examples in articles or books',
  },
  [BitType.standardExampleNormative]: {
    since: '1.16.0',
    baseBitType: BitType.example,
    description:
      'Standard normative example bit, used to provide normative examples in articles or books',
  },
  [BitType.standardExampleNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.example,
    description:
      'Standard non-normative example bit, used to provide non-normative examples in articles or books',
  },
  [BitType.smartStandardExampleNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardExampleNormative,
    description:
      'Smart standard normative example bit, used to provide normative examples in smart standards',
  },
  [BitType.smartStandardExampleNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardExampleNonNormative,
    description:
      'Smart standard non-normative example bit, used to provide non-normative examples in smart standards',
  },
  [BitType.smartStandardExampleNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardExampleNormative,
    description:
      'Smart standard normative example collapsible bit, used to provide normative examples in smart standards that can be collapsed',
  },
  [BitType.smartStandardExampleNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardExampleNonNormative,
    description:
      'Smart standard non-normative example collapsible bit, used to provide non-normative examples in smart standards that can be collapsed',
  },
  [BitType.authorContentBitGenerator]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'Body contains the content of one or more bits to be created by the bit generator',
    tags: [
      {
        key: ConfigKey.property_classification,
        description: 'Classification for the created bits',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.appAiPrompt]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'App AI prompt bit, used to create AI prompts in the app editor',
  },
  [BitType.aiPrompt]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'AI prompt bit, used to create AI prompts in articles or books',
  },
  [BitType.aiChat]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'AI chat bit, used to create an AI chat',
  },
  [BitType.aiEditor]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'AI editor bit, used to create an AI editor',
  },
  [BitType.aiTutor]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'AI tutor bit, used to create an AI tutor',
  },
  [BitType.aiWbt]: {
    since: '4.2.0',
    baseBitType: BitType.article,
    description: 'AI WBT bit, used to create an AI WBT (Web-Based Training)',
  },
  [BitType.articleAi]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Article AI bit, used to create AI-generated articles',
  },
  [BitType.articleAttachment]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Article attachment bit, used to attach files to articles',
  },
  [BitType.assignment]: {
    since: '1.3.0',
    baseBitType: BitType.essay,
    description: 'Assignment bit, used to define assignments in articles or books',
  },
  [BitType.audioTranscript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Audio transcript bit, used to provide transcripts for audio files in articles or books',
  },
  [BitType.bitmarkExample]: {
    since: '1.3.0',
    baseBitType: BitType.example,
    description: 'Bitmark example bit, used to provide examples for bitmarks in articles or books',
  },
  [BitType.blogArticle]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Blog article bit, used to define blog articles in articles or books',
  },
  [BitType.bug]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Bug bit, used to report bugs in articles or books',
  },
  [BitType.bugAlt]: {
    since: '1.16.0',
    baseBitType: BitType.bug,
    description:
      'Alternative bug bit, used to report bugs in articles or books with alternative styling',
  },
  [BitType.checklist]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Checklist bit, used to create checklists in articles or books',
  },
  [BitType.coachAudioTranscript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Coach audio transcript bit, used to provide transcripts for audio files in coaching articles or books',
  },
  [BitType.coachCallToActionChecklist]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Coach call to action checklist bit, used to create checklists in coaching articles or books',
  },
  [BitType.coachHomeRules]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Coach home rules bit, used to define home rules in coaching articles or books',
  },
  [BitType.coachVideoTranscript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Coach video transcript bit, used to provide transcripts for video files in coaching articles or books',
  },
  [BitType.correction]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Correction bit, used to provide corrections in articles or books',
  },
  [BitType.danger]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Danger bit, used to highlight dangerous or critical information in articles or books',
  },
  [BitType.dangerAlt]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description:
      'Alternative danger bit, used to highlight dangerous or critical information in articles or books with alternative styling',
  },
  [BitType.definitionTerm]: {
    since: '1.34.0',
    baseBitType: BitType.article,
    description: 'Definition term bit, used to define terms in articles or books',
  },
  [BitType.deleted]: {
    since: '3.9.0',
    baseBitType: BitType.article,
    description: 'Deleted bit, used to indicate deleted content in articles or books',
  },
  [BitType.details1]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Details bit, used to provide additional details in articles or books',
  },
  [BitType.details]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Details bit, used to provide additional details in articles or books',
  },
  [BitType.qAndA]: {
    since: '3.5.0',
    baseBitType: BitType.article,
    description: 'Q&A bit, used to create question and answer sections in articles or books',
  },
  [BitType.editorial]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Editorial bit, used to provide editorial content in articles or books',
  },
  [BitType.editorNote]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Editor note bit, used to provide notes from the editor in articles or books',
  },
  [BitType.featured]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Featured bit, used to highlight featured content in articles or books',
  },
  [BitType.glossaryTerm]: {
    since: '1.33.0',
    baseBitType: BitType.article,
    description: 'Glossary term bit, used to define glossary terms in articles or books',
  },
  [BitType.help]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Help bit, used to provide help or support information in articles or books',
  },
  [BitType.helpAlt]: {
    since: '1.16.0',
    baseBitType: BitType.help,
    description:
      'Alternative help bit, used to provide help or support information in articles or books with alternative styling',
  },
  [BitType.hint]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Hint bit, used to provide hints or tips in articles or books',
  },
  [BitType.hintAlt]: {
    since: '1.16.0',
    baseBitType: BitType.hint,
    description:
      'Alternative hint bit, used to provide hints or tips in articles or books with alternative styling',
  },
  [BitType.indexTerm]: {
    since: '1.33.0',
    baseBitType: BitType.article,
    description: 'Index term bit, used to define index terms in articles or books',
  },
  [BitType.info]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Info bit, used to provide informational content in articles or books',
  },
  [BitType.infoAlt]: {
    since: '1.16.0',
    baseBitType: BitType.info,
    description:
      'Alternative info bit, used to provide informational content in articles or books with alternative styling',
  },
  [BitType.langLearningOutcomes]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language learning outcomes bit, used to define learning outcomes in language articles or books',
  },
  [BitType.langEnablingLanguageSkills]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language enabling skills bit, used to define enabling language skills in language articles or books',
  },
  [BitType.langLifeSkills]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language life skills bit, used to define life skills in language articles or books',
  },
  [BitType.langEnglishAroundWorld]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language English around the world bit, used to provide information about English usage around the world in language articles or books',
  },
  [BitType.langGoodToKnow]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language good to know bit, used to provide useful information in language articles or books',
  },
  [BitType.langLearningGoal]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language learning goal bit, used to define learning goals in language articles or books',
  },
  [BitType.langLearningStrategy]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language learning strategy bit, used to define learning strategies in language articles or books',
  },
  [BitType.langLikeALocal]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language like a local bit, used to provide tips for speaking like a local in language articles or books',
  },
  [BitType.langMaterial]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language material bit, used to provide language learning materials in language articles or books',
  },
  [BitType.langUsefulPhrases]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language useful phrases bit, used to provide useful phrases in language articles or books',
  },
  [BitType.langLevelDown]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language level down bit, used to provide information about lower language levels in language articles or books',
  },
  [BitType.langLevelUp]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language level up bit, used to provide information about higher language levels in language articles or books',
  },
  [BitType.langExtraActivity]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language extra activity bit, used to provide additional activities in language articles or books',
  },
  [BitType.langVideoScript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language video script bit, used to provide scripts for language learning videos in articles or books',
  },
  [BitType.langAudioScript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language audio script bit, used to provide scripts for language learning audio files in articles or books',
  },
  [BitType.langVocabulary]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language vocabulary bit, used to provide vocabulary lists in language articles or books',
  },
  [BitType.langHomework]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language homework bit, used to define homework assignments in language articles or books',
  },
  [BitType.langTeacherNote]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language teacher note bit, used to provide notes for teachers in language articles or books',
  },
  [BitType.langTeacherPronunciation]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Language teacher pronunciation bit, used to provide pronunciation guidance for teachers in language articles or books',
  },
  [BitType.list]: {
    since: '1.22.0',
    baseBitType: BitType.article,
    description: 'List bit, used to create lists in articles or books',
  },
  [BitType.standardList]: {
    since: '1.22.0',
    baseBitType: BitType.article,
    description: 'Standard list bit, used to create standard lists in articles or books',
  },
  [BitType.smartStandardList]: {
    since: '1.28.0',
    baseBitType: BitType.standardList,
    description:
      'Smart standard list bit, used to create smart standard lists in articles or books',
  },
  [BitType.smartStandardListCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardList,
    description:
      'Smart standard list collapsible bit, used to create collapsible smart standard lists in articles or books',
  },
  [BitType.message]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Message bit, used to create messages in articles or books',
  },
  [BitType.newspaperArticle]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Newspaper article bit, used to define newspaper articles in articles or books',
  },
  [BitType.note]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Note bit, used to provide notes in articles or books',
  },
  [BitType.noteAlt]: {
    since: '1.16.0',
    baseBitType: BitType.note,
    description:
      'Alternative note bit, used to provide notes in articles or books with alternative styling',
  },
  [BitType.standardNoteNormative]: {
    since: '1.16.0',
    baseBitType: BitType.note,
    description:
      'Standard normative note bit, used to provide normative notes in articles or books',
  },
  [BitType.standardNoteNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.note,
    description:
      'Standard non-normative note bit, used to provide non-normative notes in articles or books',
  },
  [BitType.smartStandardNoteNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardNoteNormative,
    description:
      'Smart standard normative note bit, used to provide normative notes in smart standards',
  },
  [BitType.smartStandardNoteNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardNoteNonNormative,
    description:
      'Smart standard non-normative note bit, used to provide non-normative notes in smart standards',
  },
  [BitType.smartStandardNoteNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardNoteNormative,
    description:
      'Smart standard normative note collapsible bit, used to provide normative notes in smart standards that can be collapsed',
  },
  [BitType.smartStandardNoteNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardNoteNonNormative,
    description:
      'Smart standard non-normative note collapsible bit, used to provide non-normative notes in smart standards that can be collapsed',
  },
  [BitType.noteAi]: {
    since: '1.3.0',
    baseBitType: BitType.note,
    description: 'Note AI bit, used to create AI-generated notes in articles or books',
  },
  [BitType.notebookArticle]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Notebook article bit, used to define notebook articles in articles or books',
  },
  [BitType.preparationNote]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Preparation note bit, used to provide preparation notes in articles or books',
  },
  [BitType.printThisBook]: {
    since: '5.4.0',
    baseBitType: BitType._standard,
    description: 'Print this book bit, used to create a button that prints the entire book',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the print button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.printThisChapter]: {
    since: '5.4.0',
    baseBitType: BitType._standard,
    description: 'Print this chapter bit, used to create a button that prints the current chapter',
    tags: [
      {
        key: ConfigKey.property_buttonCaption,
        description: 'The caption of the print button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_printParentChapterLevel,
        description: 'The parent chapter level to print',
        format: TagFormat.number,
        defaultValue: '-1',
      },
    ],
  },
  [BitType.printPageBreak]: {
    since: '5.4.0',
    baseBitType: BitType.separator,
    description:
      'Print page break bit, used to create page breaks for printing in articles or books',
  },
  [BitType.releaseNotesSummary]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Release notes summary bit, used to summarize release notes in articles or books',
  },
  [BitType.remark]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Remark bit, used to provide remarks in articles or books',
  },
  [BitType.remarkAlt]: {
    since: '1.16.0',
    baseBitType: BitType.remark,
    description:
      'Alternative remark bit, used to provide remarks in articles or books with alternative styling',
  },
  [BitType.standardRemarkNormative]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description:
      'Standard normative remark bit, used to provide normative remarks in articles or books',
  },
  [BitType.standardRemarkNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.article,
    description:
      'Standard non-normative remark bit, used to provide non-normative remarks in articles or books',
  },
  [BitType.smartStandardRemarkNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkNormative,
    description:
      'Smart standard normative remark bit, used to provide normative remarks in smart standards',
  },
  [BitType.smartStandardRemarkNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkNonNormative,
    description:
      'Smart standard non-normative remark bit, used to provide non-normative remarks in smart standards',
  },
  [BitType.smartStandardRemarkNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkNormative,
    description:
      'Smart standard normative remark collapsible bit, used to provide normative remarks in smart standards that can be collapsed',
  },
  [BitType.smartStandardRemarkNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkNonNormative,
    description:
      'Smart standard non-normative remark collapsible bit, used to provide non-normative remarks in smart standards that can be collapsed',
  },
  [BitType.selfAssessment]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Self-assessment bit, used to create self-assessment sections in articles or books',
  },
  [BitType.separator]: {
    since: '1.4.15',
    baseBitType: BitType.article,
    description: 'Separator bit, used to create visual separators in articles or books',
  },
  [BitType.separatorAlt]: {
    since: '1.16.0',
    baseBitType: BitType.separator,
    description:
      'Alternative separator bit, used to create visual separators in articles or books with alternative styling',
  },
  [BitType.sticker]: {
    since: '1.5.28',
    baseBitType: BitType.article,
    description: 'Sticker bit, used to create stickers in articles or books',
  },
  [BitType.sideNote]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Side note bit, used to provide side notes in articles or books',
  },
  [BitType.summary]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Summary bit, used to provide summaries in articles or books',
  },
  [BitType.summaryAi]: {
    since: '1.3.0',
    baseBitType: BitType.summary,
    description: 'AI-generated summary bit',
  },
  [BitType.videoTranscript]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description:
      'Video transcript bit, used to provide transcripts for video files in articles or books',
  },
  [BitType.warning]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Warning bit, used to highlight warnings in articles or books',
  },
  [BitType.warningAlt]: {
    since: '1.16.0',
    baseBitType: BitType.warning,
    description:
      'Alternative warning bit, used to highlight warnings in articles or books with alternative styling',
  },
  [BitType.workbookArticle]: {
    since: '1.3.0',
    baseBitType: BitType.article,
    description: 'Workbook article bit, used to define workbook articles in articles or books',
  },
  [BitType.collapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Collapsible bit, used to create collapsible sections in articles or books',
  },
  [BitType.sideNoteCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description:
      'Side note collapsible bit, used to create collapsible side notes in articles or books',
  },
  [BitType.infoCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description:
      'Info collapsible bit, used to create collapsible informational sections in articles or books',
  },
  [BitType.remarkCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Remark collapsible bit, used to create collapsible remarks in articles or books',
  },
  [BitType.warningCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description:
      'Warning collapsible bit, used to create collapsible warnings in articles or books',
  },
  [BitType.dangerCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description:
      'Danger collapsible bit, used to create collapsible danger sections in articles or books',
  },
  [BitType.noteCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Note collapsible bit, used to create collapsible notes in articles or books',
  },
  [BitType.exampleCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description:
      'Example collapsible bit, used to create collapsible examples in articles or books',
  },
  [BitType.hintCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Hint collapsible bit, used to create collapsible hints in articles or books',
  },
  [BitType.bugCollapsible]: {
    since: '1.21.0',
    baseBitType: BitType.article,
    description: 'Bug collapsible bit, used to create collapsible bug reports in articles or books',
  },
  [BitType.platformPath]: {
    since: '3.14.1',
    baseBitType: BitType._standard,
    description: 'Platform path bit, used to define paths in the platform',
    tags: [
      {
        key: ConfigKey.property_path,
        description: 'The path for the platform, used to define navigation paths',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.appCalculatorLatex]: {
    since: '4.10.0',
    baseBitType: BitType.article,
    description:
      'A LaTeX calculator bit, used to create a calculator that can interpret LaTeX expressions',
    tags: [
      {
        key: ConfigKey.property_formula,
        description: 'The LaTeX formula for the calculator, used to define the calculation logic',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.container]: {
    since: '1.9.0',
    baseBitType: BitType.article,
    description: 'Container bit, used to group bits together in articles or books',
    tags: [
      {
        key: ConfigKey.property_allowedBit,
        description:
          'Allowed bits in the container, used to define which bits can be placed inside',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.containerWrap]: {
    since: '1.9.0',
    baseBitType: BitType.container,
    description: 'Container wrap bit, used to wrap content in a container',
  },
  [BitType.containerNowrap]: {
    since: '1.9.0',
    baseBitType: BitType.container,
    description: 'Container nowrap bit, used to prevent wrapping of content in a container',
  },
  [BitType.containerNowrapStretch]: {
    since: '1.9.0',
    baseBitType: BitType.container,
    description:
      'Container nowrap stretch bit, used to stretch content without wrapping in a container',
  },
  [BitType.containerGroup]: {
    since: '1.9.0',
    baseBitType: BitType.container,
    description: 'Container group bit, used to group multiple containers together',
  },
  [BitType.containerFolder]: {
    since: '1.9.0',
    baseBitType: BitType.container,
    description: 'Container folder bit, used to create folders for organizing bits',
  },
  [BitType.containerCarousel]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container carousel bit, used to create carousels for displaying bits',
  },
  [BitType.containerCards]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container cards bit, used to create card layouts for displaying bits',
  },
  [BitType.containerGrid]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container grid bit, used to create grid layouts for displaying bits',
  },
  [BitType.containerStack]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container stack bit, used to create stacked layouts for displaying bits',
  },
  [BitType.containerSlides]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container slides bit, used to create slide presentations for displaying bits',
  },
  [BitType.containerGallery]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container gallery bit, used to create galleries for displaying bits',
  },
  [BitType.containerScroller]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container scroller bit, used to create scrolling sections for displaying bits',
  },
  [BitType.containerTabs]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container tabs bit, used to create tabbed sections for displaying bits',
  },
  [BitType.containerAccordionTabs]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description:
      'Container accordion tabs bit, used to create accordion-style tabbed sections for displaying bits',
  },
  [BitType.containerFolderAll]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description:
      'Container folder all bit, used to create folders that can contain all types of bits',
  },
  [BitType.containerBits2]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description:
      'Container bits 2 bit, used to create a container for bits with additional features',
  },
  [BitType.containerCookRecipe]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description:
      'Container cook recipe bit, used to create recipe containers for displaying cooking recipes',
  },
  [BitType.containerNewsArticle]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container news article bit, used to create containers for news articles',
  },
  [BitType.containerPreview]: {
    since: '1.11.0',
    baseBitType: BitType.container,
    description: 'Container preview bit, used to create preview sections for displaying bits',
  },
  [BitType.pageContainer]: {
    since: '1.9.0',
    baseBitType: BitType.container,
    description: 'Page container bit, used to create containers for pages in articles or books',
  },
  [BitType.pageContainerWrap]: {
    since: '1.9.0',
    baseBitType: BitType.pageContainer,
    description: 'Page container wrap bit, used to wrap content in a page container',
  },
  [BitType.pageContainerNowrap]: {
    since: '1.9.0',
    baseBitType: BitType.pageContainer,
    description:
      'Page container nowrap bit, used to prevent wrapping of content in a page container',
  },
  [BitType.pageContainerNowrapStretch]: {
    since: '1.9.0',
    baseBitType: BitType.pageContainer,
    description:
      'Page container nowrap stretch bit, used to stretch content without wrapping in a page container',
  },
  [BitType.pageContainerFolder]: {
    since: '1.9.0',
    baseBitType: BitType.pageContainer,
    description:
      'Page container folder bit, used to create folders for organizing bits in a page container',
  },
  [BitType.pageContainerGroup]: {
    since: '1.9.0',
    baseBitType: BitType.pageContainer,
    description: 'Page container group bit, used to group multiple page containers together',
  },
  [BitType.metalevelExplanation]: {
    since: '1.10.0',
    baseBitType: BitType.article,
    description:
      'Metalevel explanation bit, used to provide explanations for metalevels in articles or books',
  },
  [BitType.module]: {
    since: '1.5.26',
    baseBitType: BitType.article,
    description: 'Module bit, used to define modules in articles or books',
    tags: [
      {
        key: ConfigKey.property_hasBookNavigation,
        description: 'Indicates if the module has book navigation',
        format: TagFormat.boolean,
        defaultValue: 'true',
      },
      {
        key: ConfigKey.property_productId,
        description: 'Product ID for the module, used to link to a specific product',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_duration,
        description: 'Duration of the module, used to indicate how long it takes to complete',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.moduleProduct]: {
    since: '1.9.0',
    baseBitType: BitType.module,
    description: 'Module product bit, used to define products in modules',
    tags: [
      {
        key: ConfigKey.property_productId,
        description: 'Product ID for the module product, used to link to a specific product',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.exampleList]: {
    since: '1.4.13',
    baseBitType: BitType.example,
    description: 'Example list bit, used to create lists of examples in articles or books',
    cardSet: CardSetConfigKey.exampleBitList,
    rootExampleType: ExampleType.string,
  },
  [BitType.extractorPage]: {
    since: '1.5.17',
    baseBitType: BitType.image,
    description: 'Extractor page bit, used to extract pages from images',
  },
  [BitType.extractorPageCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPage,
    description:
      'Collapsible extractor page bit, used to extract pages from images with collapsible functionality',
  },
  [BitType.extractorPageWithBlocks]: {
    since: '1.5.21',
    baseBitType: BitType.image,
    description: 'Extractor page with blocks bit, used to extract pages with blocks from images',
  },
  [BitType.extractorPageWithBlocksCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageWithBlocks,
    description:
      'Collapsible extractor page with blocks bit, used to extract pages with blocks from images with collapsible functionality',
  },
  [BitType.extractorConfiguration]: {
    since: '1.7.1',
    baseBitType: BitType._standard,
    description: 'Extractor configuration bit, used to configure extractors in articles or books',

    textFormatDefault: TextFormat.plainText,
  },
  [BitType.extractorBlueprintConfiguration]: {
    since: '5.11.0',
    baseBitType: BitType._standard,
    description:
      'Extractor blueprint configuration bit, used to specify extractor blueprint configuration when extracting from blueprints',

    textFormatDefault: TextFormat.plainText,
  },
  [BitType.extractorImage]: {
    since: '4.3.0',
    baseBitType: BitType._standard,
    description: 'Extractor images bit, used for images extracted from PDFs',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for logo grave images, used to define additional properties',
      },
      {
        // Image resource

        key: ConfigKey.group_resourceImage,
        description: 'Resource image tags for logo grave images, used to attach images',
        minCount: 1,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: false,
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.extractorImageCollapsible]: {
    since: '4.3.0',
    baseBitType: BitType.extractorImage,
    description: 'Collapsible extractor images bit, used for  images extracted from PDFs',
  },
  [BitType.extractorBlueprint]: {
    since: '5.12.0',
    baseBitType: BitType._standard,
    description: 'Extractor blueprint bit, used to provide blueprint information about extractors',
    textFormatDefault: TextFormat.json,
  },
  [BitType.extractorInformation]: {
    since: '3.8.0',
    baseBitType: BitType._standard,
    description:
      'Extractor information bit, used to provide information about extractors in articles or books',

    textFormatDefault: TextFormat.json,
  },
  [BitType.extractorTheme]: {
    since: '5.7.0',
    baseBitType: BitType._standard,
    description: 'Extractor theme bit, used to store design/theme JSON extracted from documents',

    textFormatDefault: TextFormat.json,
  },
  [BitType.extractorAiChat]: {
    since: '3.19.0',
    baseBitType: BitType._standard,
    description:
      'Extractor AI chat bit, used to create AI chat interfaces for extractors in articles or books',
  },
  [BitType.extractorBlock]: {
    since: '1.5.16',
    baseBitType: BitType._standard,
    description: 'Extractor block bit, used to define blocks within extractor pages',
    tags: [
      {
        key: ConfigKey.property_blockId,
        description:
          'Unique identifier for the block, used to reference the block in extractor pages',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_pageNo,
        description:
          'Page number for the block, used to indicate the page on which the block appears',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_x,
        description: 'X-coordinate for the block, used to position the block on the page',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_y,
        description: 'Y-coordinate for the block, used to position the block on the page',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_width,
        description: 'Width of the block, used to define the size of the block on the page',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height,
        description: 'Height of the block, used to define the size of the block on the page',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_index,
        description: 'Index of the block, used to order blocks within the extractor page',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_classification,
        description:
          'Classification for the block, used to categorize the block within the extractor',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_availableClassifications,
        description:
          'Available classifications for the block, used to define possible classifications',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.group_resourceImage,
        description: 'Resource image for the block, used to attach images to the block',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.extractorRepeatedText]: {
    since: '1.5.21',
    baseBitType: BitType.article,
    description: 'Extractor repeated text bit, used to define repeated text in extractor pages',
  },
  [BitType.extractorPageNumber]: {
    since: '1.5.21',
    baseBitType: BitType.article,
    description: 'Extractor page number bit, used to define page numbers in extractor pages',
  },
  [BitType.extractorPageNumberCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageNumber,
    description:
      'Collapsible extractor page number bit, used to define page numbers in extractor pages with collapsible functionality',
  },
  [BitType.extractorPageHeader]: {
    since: '1.5.21',
    baseBitType: BitType.article,
    description: 'Extractor page header bit, used to define headers in extractor pages',
  },
  [BitType.extractorPageHeaderCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageHeader,
    description:
      'Collapsible extractor page header bit, used to define headers in extractor pages with collapsible functionality',
  },
  [BitType.extractorPageFooter]: {
    since: '1.5.21',
    baseBitType: BitType.article,
    description: 'Extractor page footer bit, used to define footers in extractor pages',
  },
  [BitType.extractorPageFooterCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.extractorPageFooter,
    description:
      'Collapsible extractor page footer bit, used to define footers in extractor pages with collapsible functionality',
  },
  [BitType.pageOpenBook]: {
    since: '1.5.10',
    baseBitType: BitType.article,
    description: 'Page open book bit, used to create pages that open books in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the book, used to identify the book in the system',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_book,
        description: 'Book reference for the page, used to link to a specific book',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_reference,
            description: 'Reference tag for the book, used to link to the book in the system',
            maxCount: 2,
          },
        ],
      },
      {
        /* Allow incorrectly chained reference tag */
        key: ConfigKey.tag_reference,
        description: 'Reference tag for the book, used to link to the book in the system',
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the button, used to define the text displayed on the button',
      },
      {
        key: ConfigKey.property_authorFullName,
        description: 'Full name of the author',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_authorPseudonym,
        description: 'A pseudonym of the author, if any',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_authorTitle,
        description: 'The title of the author, e.g. "Dr.", "Prof.", etc.',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_authorJobTitle,
        description: 'The job title of the author, e.g. "Software Engineer", "Professor", etc.',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.printBook]: {
    since: '5.5.0',
    baseBitType: BitType.article,
    description:
      'Print book bit, used to create pages that open books without author information in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the book, used to identify the book in the system',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_book,
        description: 'Book reference for the page, used to link to a specific book',
        format: TagFormat.plainText,
        chain: [
          {
            key: ConfigKey.tag_reference,
            description: 'Reference tag for the book, used to link to the book in the system',
            maxCount: 2,
          },
        ],
      },
      {
        /* Allow incorrectly chained reference tag */
        key: ConfigKey.tag_reference,
        description: 'Reference tag for the book, used to link to the book in the system',
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the button, used to define the text displayed on the button',
      },
    ],
  },
  [BitType.openBookChapter]: {
    since: '4.16.0',
    baseBitType: BitType.pageOpenBook,
    description:
      'Open book chapter bit, derived from page-open-book, used to create chapter pages that open books',
  },
  [BitType.openBookChapterTeaser]: {
    since: '4.16.0',
    baseBitType: BitType.openBookChapter,
    description:
      'Open book chapter teaser bit, equal to open-book-chapter, used to create teaser chapter pages that open books',
  },
  [BitType.pageOpenBookList]: {
    since: '2.1.0',
    baseBitType: BitType.article,
    description:
      'Page open book list bit, used to create pages that open lists of books in articles or books',
    tags: [
      {
        key: ConfigKey.property_book,
        description: 'Book reference for the page, used to link to a specific book',
        maxCount: Count.infinity,
        chain: [
          {
            key: ConfigKey.tag_reference,
            description: 'Reference tag for the book, used to link to the book in the system',
            maxCount: 2,
          },
        ],
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the button, used to define the text displayed on the button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageSubscribe]: {
    since: '1.5.10',
    baseBitType: BitType.article,
    description:
      'Page subscribe bit, used to create pages that allow users to subscribe to content',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the subscription page, used to identify the page in the system',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description:
          'Caption for the subscription button, used to define the text displayed on the button',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_mailingList,
        description: 'Mailing list for the subscription, used to link to a specific mailing list',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.assignmentList]: {
    since: '1.4.13',
    baseBitType: BitType.exampleList,
    description: 'Assignment list bit, used to create lists of assignments in articles or books',
  },
  [BitType.pageFooter]: {
    since: '1.4.13',
    baseBitType: BitType.article,
    description: 'Page footer bit, used to create footers in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the footer, used to identify the footer in the system',
        format: TagFormat.plainText,
      },
    ],
    cardSet: CardSetConfigKey.exampleBitList,
  },
  [BitType.legend]: {
    since: '3.12.0',
    baseBitType: BitType._standard,
    description: 'Legend bit, used to provide legends in articles or books',

    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.smartStandardLegend]: {
    since: '3.12.0',
    baseBitType: BitType.legend,
    description:
      'Smart standard legend bit, used to provide smart standard legends in articles or books',
  },
  [BitType.smartStandardLegendNonNormative]: {
    since: '3.12.0',
    baseBitType: BitType.legend,
    description:
      'Smart standard non-normative legend bit, used to provide non-normative smart standard legends in articles or books',
  },
  [BitType.smartStandardLegendNormative]: {
    since: '3.12.0',
    baseBitType: BitType.legend,
    description:
      'Smart standard normative legend bit, used to provide normative smart standard legends in articles or books',
  },
  [BitType.smartStandardRemarkLegend]: {
    since: '3.12.0',
    baseBitType: BitType.legend,
    description:
      'Smart standard remark legend bit, used to provide smart standard remarks in legends',
  },
  [BitType.smartStandardRemarkLegendNonNormative]: {
    since: '3.12.0',
    baseBitType: BitType.legend,
    description:
      'Smart standard non-normative remark legend bit, used to provide non-normative smart standard remarks in legends',
  },
  [BitType.smartStandardRemarkLegendNormative]: {
    since: '3.12.0',
    baseBitType: BitType.legend,
    description:
      'Smart standard normative remark legend bit, used to provide normative smart standard remarks in legends',
  },
  [BitType.definitionList]: {
    since: '1.34.0',
    baseBitType: BitType._standard,
    description: 'Definition list bit, used to create lists of definitions in articles or books',

    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.metaSearchDefaultTerms]: {
    since: '3.12.0',
    baseBitType: BitType._standard,
    description: 'Meta search default terms bit, used to define default search terms in articles',

    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.metaSearchDefaultTopics]: {
    since: '3.12.0',
    baseBitType: BitType.metaSearchDefaultTerms,
    description: 'Meta search default topics bit, used to define default search topics in articles',
  },
  [BitType.flashcard]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Flashcard bit, used to create flashcards in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for flashcards',
      },
    ],
    cardSet: CardSetConfigKey.flashcard,
  },
  [BitType.flashcard1]: {
    since: '1.3.0',
    baseBitType: BitType.flashcard,
    description: 'Flashcard 1 bit',
  },
  [BitType.qAndACard]: {
    since: '3.25.0',
    baseBitType: BitType.flashcard1,
    description: 'Q&A card bit, used to create question and answer cards in articles or books',
  },
  [BitType.focusImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Focus image bit, used to create images with focus points in articles or books',
    tags: [
      {
        key: ConfigKey.property_focusX,
        description: 'X-coordinate for the focus point, used to define the focus area in the image',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_focusY,
        description: 'Y-coordinate for the focus point, used to define the focus area in the image',
        format: TagFormat.number,
      },
    ],
  },
  [BitType.highlightText]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Highlight text bit, used to create highlighted text in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for highlighted text',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'True/False quiz tags for highlighted text',
      },
    ],
  },
  [BitType.image]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Image bit, used to create images in articles or books',
    tags: [
      {
        key: ConfigKey.resource_backgroundWallpaper,
        description: 'Background wallpaper for the image, used to set a background for the image',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common resource image tags for images',
          },
        ],
      },
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for images, used to define additional properties for images',
      },
      {
        key: ConfigKey.group_resourceImage,
        description: 'Resource image tags for images, used to attach images to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.appCreateBitsFromImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'App create bits from image bit, used to create bits from images in the app',
  },
  [BitType.appGetScreenshot]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'App get screenshot bit, used to capture screenshots in the app',
  },
  [BitType.detailsImage]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Details image bit, used to create detailed images in articles or books',
  },
  [BitType.figure]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Figure bit, used to create figures in articles or books',
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.imageBanner]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image banner bit, used to create banners in articles or books',
  },
  [BitType.imageFigure]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image figure bit, used to create figures with images in articles or books',
    cardSet: CardSetConfigKey.definitionList,
  },
  [BitType.imageFigureAlt]: {
    since: '1.16.0',
    baseBitType: BitType.imageFigure,
    description:
      'Alternative image figure bit, used to create figures with alternative images in articles or books',
  },
  [BitType.standardImageFigureNormative]: {
    since: '1.16.0',
    baseBitType: BitType.imageFigure,
    description:
      'Standard normative image figure bit, used to create normative image figures in articles or books',
  },
  [BitType.standardImageFigureNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.imageFigure,
    description:
      'Standard non-normative image figure bit, used to create non-normative image figures in articles or books',
  },
  [BitType.smartStandardImageFigureNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardImageFigureNormative,
    description:
      'Smart standard normative image figure bit, used to create smart standard normative image figures in articles or books',
  },
  [BitType.smartStandardImageFigureNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardImageFigureNonNormative,
    description:
      'Smart standard non-normative image figure bit, used to create smart standard non-normative image figures in articles or books',
  },
  [BitType.smartStandardImageFigureNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardImageFigureNormative,
    description:
      'Collapsible smart standard normative image figure bit, used to create collapsible smart standard normative image figures in articles or books',
  },
  [BitType.smartStandardImageFigureNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardImageFigureNonNormative,
    description:
      'Collapsible smart standard non-normative image figure bit, used to create collapsible smart standard non-normative image figures in articles or books',
  },
  [BitType.imageLandscape]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image landscape bit, used to create landscape images in articles or books',
  },
  [BitType.imageMood]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image mood bit, used to create mood images in articles or books',
  },
  [BitType.imagePortrait]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image portrait bit, used to create portrait images in articles or books',
  },
  [BitType.imagePrototype]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image prototype bit, used to create prototype images in articles or books',
  },
  [BitType.imageSeparator]: {
    since: '1.4.15',
    baseBitType: BitType.image,
    description: 'Image separator bit, used to create separators in articles or books',
  },
  [BitType.imageSeparatorAlt]: {
    since: '1.16.0',
    baseBitType: BitType.imageSeparator,
    description:
      'Alternative image separator bit, used to create alternative separators in articles or books',
  },
  [BitType.imageScreenshot]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image screenshot bit, used to create screenshots in articles or books',
  },
  [BitType.imageStyled]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image styled bit, used to create styled images in articles or books',
  },
  [BitType.imageSuperWide]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image super wide bit, used to create super wide images in articles or books',
  },
  [BitType.imageZoom]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Image zoom bit, used to create zoomable images in articles or books',
  },
  [BitType.langLifeSkillIcon]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description:
      'Language life skill icon bit, used to create icons for life skills in articles or books',
  },
  [BitType.lifeSkillSticker]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description:
      'Life skill sticker bit, used to create stickers for life skills in articles or books',
  },
  [BitType.pageBanner]: {
    since: '1.4.3',
    baseBitType: BitType.image,
    description: 'Page banner bit, used to create banners for pages in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the page banner, used to identify the banner in the system',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageHero]: {
    since: '1.11.0',
    baseBitType: BitType.pageBanner,
    description: 'Page hero bit, used to create hero sections in articles or books',
  },
  [BitType.screenshot]: {
    since: '1.3.0',
    deprecated: '1.4.0',
    baseBitType: BitType.image,
    description: 'Screenshot bit, used to create screenshots in articles or books',
  },
  [BitType.tableImage]: {
    since: '1.5.15',
    baseBitType: BitType.table,
    description: 'Table image bit, used to create images in tables in articles or books',
    tags: [
      {
        key: ConfigKey.property_caption,
        description: 'Caption for the table image, used to provide a description for the image',
        format: TagFormat.bitmarkText,
      },
      {
        key: ConfigKey.resource_backgroundWallpaper,
        description: 'Background wallpaper for the image, used to set a background for the image',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common resource image tags for images',
          },
        ],
      },
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for images, used to define additional properties for images',
      },
      {
        key: ConfigKey.group_resourceImage,
        description: 'Resource image tags for images, used to attach images to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.tableImageAlt]: {
    since: '1.16.0',
    baseBitType: BitType.tableImage,
    description:
      'Alternative table image bit, used to create alternative images in tables in articles or books',
  },
  [BitType.standardTableImageNormative]: {
    since: '1.16.0',
    baseBitType: BitType.tableImage,
    description:
      'Standard normative table image bit, used to create normative images in tables in articles or books',
  },
  [BitType.standardTableImageNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.tableImage,
    description:
      'Standard non-normative table image bit, used to create non-normative images in tables in articles or books',
  },
  [BitType.standardRemarkTableImageNormative]: {
    since: '1.17.0',
    baseBitType: BitType.tableImage,
    description:
      'Standard normative remark table image bit, used to create normative remark images in tables in articles or books',
  },
  [BitType.standardRemarkTableImageNonNormative]: {
    since: '1.17.0',
    baseBitType: BitType.tableImage,
    description:
      'Standard non-normative remark table image bit, used to create non-normative remark images in tables in articles or books',
  },
  [BitType.smartStandardTableImageNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableImageNormative,
    description:
      'Smart standard normative table image bit, used to create smart standard normative images in tables in articles or books',
  },
  [BitType.smartStandardTableImageNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableImageNonNormative,
    description:
      'Smart standard non-normative table image bit, used to create smart standard non-normative images in tables in articles or books',
  },
  [BitType.smartStandardRemarkTableImageNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableImageNormative,
    description:
      'Smart standard normative remark table image bit, used to create smart standard normative remark images in tables in articles or books',
  },
  [BitType.smartStandardRemarkTableImageNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableImageNonNormative,
    description:
      'Smart standard non-normative remark table image bit, used to create smart standard non-normative remark images in tables in articles or books',
  },
  [BitType.smartStandardTableImageNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableImageNormative,
    description:
      'Collapsible smart standard normative table image bit, used to create collapsible smart standard normative images in tables in articles or books',
  },
  [BitType.smartStandardTableImageNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableImageNonNormative,
    description:
      'Collapsible smart standard non-normative table image bit, used to create collapsible smart standard non-normative images in tables in articles or books',
  },
  [BitType.smartStandardRemarkTableImageNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableImageNormative,
    description:
      'Collapsible smart standard normative remark table image bit, used to create collapsible smart standard normative remark images in tables in articles or books',
  },
  [BitType.smartStandardRemarkTableImageNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableImageNonNormative,
    description:
      'Collapsible smart standard non-normative remark table image bit, used to create collapsible smart standard non-normative remark images in tables in articles or books',
  },
  [BitType.imageLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Image link bit, used to create links with images in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for image links, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceImageLink,
        description: 'Resource image link tags, used to attach images to the link',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.imageOnDevice]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Image on device bit, used to create images stored on the device in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for images on device, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceImage,
        description: 'Resource image tags for images on device, used to attach images',
      },
      {
        key: ConfigKey.group_imageSource,
        description:
          'Image source tags for images on device, used to define the source of the image',
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.imageResponsive]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Responsive image bit, used to create responsive images in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for responsive images, used to define additional properties',
      },
      {
        // Combo resource

        key: ConfigKey.group_resourceImageResponsive,
        description: 'Resource image responsive tags, used to attach responsive images',
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.imagesLogoGrave]: {
    since: '1.5.11',
    baseBitType: BitType._standard,
    description: 'Logo grave images bit, used to create logo grave images in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for logo grave images, used to define additional properties',
      },
      {
        // Image resource

        key: ConfigKey.group_resourceImage,
        description: 'Resource image tags for logo grave images, used to attach images',
        minCount: 1,
        maxCount: Count.infinity,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.prototypeImages]: {
    since: '1.6.1',
    baseBitType: BitType.imagesLogoGrave,
    description: 'Prototype images bit, used to create prototype images in articles or books',
  },
  [BitType.internalLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Internal link bit, used to create links to other bits in articles or books',
    tags: [
      {
        key: ConfigKey.tag_reference,
        description: 'Reference tag for the internal link, used to link to the target bit',
      },
    ],
  },
  [BitType.interview]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Interview bit, used to create interviews in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for interviews',
      },
      {
        key: ConfigKey.property_reasonableNumOfChars,
        description: 'Reasonable number of characters for the interview, used to limit input size',
        format: TagFormat.number,
      },
    ],
    cardSet: CardSetConfigKey.questions,
  },
  [BitType.interviewInstructionGrouped]: {
    since: '1.3.0',
    baseBitType: BitType.interview,
    description: 'Grouped interview instruction bit',
  },
  [BitType.botInterview]: {
    since: '1.3.0',
    baseBitType: BitType.interview,
    description: 'Bot interview bit, used to create bot interviews in articles or books',
  },
  [BitType.brandColor]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Brand color bit, used to define brand colors',
    tags: [
      {
        key: ConfigKey.property_brandColor,
        description: 'The brand color',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_brandColorName,
        description: 'The brand color name',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.learningPathBook]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Learning path book bit, used to create learning paths in articles or books',
    tags: [
      {
        key: ConfigKey.group_learningPathCommon,
        description:
          'Common tags for learning path books, used to define properties of learning paths',
      },
    ],
  },
  [BitType.bookLink]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Book link bit, used to create links to books in learning paths',
  },
  [BitType.bookLinkNext]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Next book link bit, used to create links to the next book in learning paths',
  },
  [BitType.bookLinkPrev]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description:
      'Previous book link bit, used to create links to the previous book in learning paths',
  },
  [BitType.learningPathClassroomEvent]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description:
      'Learning path classroom event bit, used to create classroom events in learning paths',
  },
  [BitType.learningPathClassroomTraining]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description:
      'Learning path classroom training bit, used to create classroom training in learning paths',
  },
  [BitType.learningPathClosing]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path closing bit, used to close learning paths',
  },
  [BitType.learningPathFeedback]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path feedback bit, used to provide feedback in learning paths',
  },
  [BitType.learningPathLearningGoal]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path learning goal bit, used to define learning goals in learning paths',
  },
  [BitType.learningPathLti]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path LTI bit, used to integrate LTI tools in learning paths',
  },
  [BitType.learningPathSign]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path sign bit, used to create signs in learning paths',
  },
  [BitType.learningPathStep]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path step bit, used to create steps in learning paths',
  },
  [BitType.learningPathBotTraining]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path bot training bit, used to create bot training in learning paths',
    tags: [
      {
        key: ConfigKey.property_bot,
        description: 'Bot reference for the training, used to link to a specific bot',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.learningPathExternalLink]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path external link bit, used to create external links in learning paths',
    tags: [
      {
        key: ConfigKey.property_externalLink,
        description: 'External link for the learning path, used to link to external resources',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_externalLinkText,
        description: 'Text for the external link, used to define the link text displayed',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.learningPathVideoCall]: {
    since: '1.3.0',
    baseBitType: BitType.learningPathBook,
    description: 'Learning path video call bit, used to create video calls in learning paths',
    tags: [
      {
        key: ConfigKey.property_videoCallLink,
        description: 'Video call link for the learning path, used to link to video calls',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leLearningObjectives]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathLearningGoal,
    description: 'Learning objectives bit, used to define learning objectives in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the learning objectives, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leVideoCall]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathVideoCall,
    description: 'Video call bit, used to create video calls in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the video call, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leClassroomEvent]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathClassroomEvent,
    description: 'Classroom event bit, used to create classroom events in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the classroom event, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leMultiDayEvent]: {
    since: '3.32.0',
    baseBitType: BitType.leClassroomEvent,
    description: 'Multi-day event bit, used to create multi-day events in learning paths',
  },
  [BitType.leCompletion]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathClosing,
    description: 'Completion bit, used to mark the completion of learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the completion, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leExternalLink]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathExternalLink,
    description: 'External link bit, used to create external links in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the external link, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leReadBook]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathBook,
    description: 'Read book bit, used to create reading tasks in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the reading task, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.leLearningStep]: {
    since: '1.25.0',
    baseBitType: BitType.learningPathStep,
    description: 'Learning step bit, used to create steps in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the learning step, used to categorize the activity',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.lePreparationTask]: {
    since: '1.26.0',
    baseBitType: BitType.learningPathBook,
    description: 'Preparation task bit, used to create preparation tasks in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        format: TagFormat.plainText,
        description: 'Activity type for the preparation task, used to categorize the activity',
      },
    ],
  },
  [BitType.leRead]: {
    since: '1.27.0',
    baseBitType: BitType.lePreparationTask,
    description: 'Read task bit, used to create reading tasks in learning paths',
  },
  [BitType.leTask]: {
    since: '1.27.0',
    baseBitType: BitType.lePreparationTask,
    description: 'Task bit, used to create tasks in learning paths',
  },
  [BitType.leTodo]: {
    since: '1.27.0',
    baseBitType: BitType.lePreparationTask,
    description: 'Todo bit, used to create todo tasks in learning paths',
  },
  [BitType.leFollowUpTask]: {
    since: '1.27.0',
    baseBitType: BitType.lePreparationTask,
    description: 'Follow-up task bit, used to create follow-up tasks in learning paths',
  },
  [BitType.leFinishingTask]: {
    since: '1.27.0',
    baseBitType: BitType.lePreparationTask,
    description: 'Finishing task bit, used to create finishing tasks in learning paths',
  },
  [BitType.leAssignment]: {
    since: '1.27.0',
    baseBitType: BitType.lePreparationTask,
    description: 'Assignment bit, used to create assignments in learning paths',
  },
  [BitType.leWatchVideoEmbed]: {
    since: '1.27.0',
    baseBitType: BitType.learningPathBook,
    description: 'Watch video embed bit, used to embed videos in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the video embed, used to categorize the activity',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for video embeds, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceVideoEmbed,
        description: 'Resource video embed tags, used to attach video embeds to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.leListenAudioEmbed]: {
    since: '1.27.0',
    baseBitType: BitType.learningPathBook,
    description: 'Listen audio embed bit, used to embed audio in learning paths',
    tags: [
      {
        key: ConfigKey.property_activityType,
        description: 'Activity type for the audio embed, used to categorize the activity',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for audio embeds, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceAudioEmbed,
        description: 'Resource audio embed tags, used to attach audio embeds to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },

  [BitType.listItem]: {
    since: '1.22.0',
    baseBitType: BitType.article,
    description: 'List item bit, used to create list items in articles or books',
    tags: [
      {
        key: ConfigKey.property_listItemIndent,
        description:
          'Indentation level for the list item, used to define the hierarchy of the list',
        format: TagFormat.number,
        defaultValue: '0',
      },
    ],
  },
  [BitType.standardListItem]: {
    since: '1.22.0',
    baseBitType: BitType.listItem,
    description: 'Standard list item bit, used to create standard list items in articles or books',
  },
  [BitType.smartStandardListItem]: {
    since: '1.28.0',
    baseBitType: BitType.standardListItem,
    description:
      'Smart standard list item bit, used to create smart standard list items in articles or books',
  },
  [BitType.smartStandardListItemCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardListItem,
    description:
      'Collapsible smart standard list item bit, used to create collapsible smart standard list items in articles or books',
  },
  [BitType.mark]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Mark bit, used to create marks in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for marks',
      },
      {
        key: ConfigKey.group_markConfig,
        description: 'Configuration tags for marks, used to define properties of marks',
      },
      {
        key: ConfigKey.group_mark,
        description: 'Mark tags, used to define the content of marks',
      },
    ],
  },
  [BitType.match]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Match bit, used to create matching pairs in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for matching pairs',
      },
      {
        key: ConfigKey.property_isCaseSensitive,
        description:
          'Case sensitivity for matching pairs, used to define if matches are case-sensitive',
        format: TagFormat.boolean,
      },
    ],
    cardSet: CardSetConfigKey.matchPairs,
  },
  [BitType.matchAll]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description:
      'Match all bit, used to create matching pairs with all options in articles or books',
  },
  [BitType.matchReverse]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description:
      'Match reverse bit, used to create matching pairs with reversed options in articles or books',
  },
  [BitType.matchAllReverse]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description:
      'Match all reverse bit, used to create matching pairs with all options and reversed in articles or books',
  },
  [BitType.matchSolutionGrouped]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description:
      'Grouped match solution bit, used to create grouped matching solutions in articles or books',
  },
  [BitType.matchMatrix]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description:
      'Match matrix bit, used to create matching pairs in a matrix format in articles or books',
    cardSet: CardSetConfigKey.matchMatrix,
  },
  [BitType.matchAudio]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description: 'Match audio bit, used to create matching pairs with audio in articles or books',
    cardSet: CardSetConfigKey.matchAudioPairs,
  },
  [BitType.matchPicture]: {
    since: '1.3.0',
    baseBitType: BitType.match,
    description:
      'Match picture bit, used to create matching pairs with pictures in articles or books',
    cardSet: CardSetConfigKey.matchImagePairs,
  },
  [BitType.feedback]: {
    since: '3.13.0',
    baseBitType: BitType._standard,
    description: 'Feedback bit, used to provide feedback in articles or books',
    tags: [
      {
        key: ConfigKey.property_reasonableNumOfChars,
        description: 'Reasonable number of characters for feedback, used to limit input size',
        format: TagFormat.number,
      },
    ],
    cardSet: CardSetConfigKey.feedback,
  },
  [BitType.learningDocumentationFeedback]: {
    since: '3.13.0',
    baseBitType: BitType.feedback,
    description: 'Feedback for learning documentation',
  },
  [BitType.handInFeedbackExpert]: {
    since: '3.30.0',
    baseBitType: BitType.feedback,
    description: 'Feedback for expert hand-in',
  },
  [BitType.handInFeedbackSelf]: {
    since: '3.30.0',
    baseBitType: BitType.feedback,
    description: 'Self-feedback for hand-in',
  },
  [BitType.multipleChoice1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Multiple choice 1 bit, used to create single-choice questions in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for multiple choice 1 questions',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'True/False tags for multiple choice 1 questions',
      },
    ],
  },
  [BitType.coachSelfReflectionMultipleChoice1]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoice1,
    description:
      'Coach self-reflection multiple choice 1 bit, used for self-reflection in coaching',
  },
  [BitType.multipleChoice]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Multiple choice bit, used to create multiple-choice questions in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for multiple choice questions',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'True/False tags for multiple choice questions',
      }, // This is actually for multiple-choice-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey.quiz,
  },
  [BitType.coachSelfReflectionMultipleChoice]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoice,
    description: 'Coach self-reflection multiple choice bit, used for self-reflection in coaching',
  },
  [BitType.multipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Multiple choice text bit, used to create multiple-choice questions with text in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for multiple choice text questions',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'True/False tags for multiple choice text questions',
      },
    ],
  },
  [BitType.coachCallToActionMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoiceText,
    description:
      'Coach call to action multiple choice text bit, used for self-reflection in coaching',
  },
  [BitType.coachSelfReflectionMultipleChoiceText]: {
    since: '1.3.0',
    baseBitType: BitType.multipleChoiceText,
    description:
      'Coach self-reflection multiple choice text bit, used for self-reflection in coaching',
  },
  [BitType.multipleResponse1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Multiple response 1 bit, used to create multiple-response questions in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for multiple response 1 questions',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'True/False tags for multiple response 1 questions',
      },
    ],
  },
  [BitType.coachSelfReflectionMultipleResponse1]: {
    since: '1.3.0',
    baseBitType: BitType.multipleResponse1,
    description:
      'Coach self-reflection multiple response 1 bit, used for self-reflection in coaching',
  },
  [BitType.multipleResponse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Multiple response bit, used to create multiple-response questions in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for multiple response questions',
      },
      {
        key: ConfigKey.group_trueFalse,
        description: 'True/False tags for multiple response questions',
      }, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
    ],
    cardSet: CardSetConfigKey.quiz,
  },
  [BitType.coachSelfReflectionMultipleResponse]: {
    since: '1.3.0',
    baseBitType: BitType.multipleResponse,
    description:
      'Coach self-reflection multiple response bit, used for self-reflection in coaching',
  },
  [BitType.page]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Page bit, used to create pages in articles or books',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'Title of the page, used to display the page title',
      },
      {
        key: ConfigKey.property_thumbImage,
        description: 'Thumbnail image for the page, used to display a small image representation',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageCollapsible]: {
    since: '1.30.0',
    baseBitType: BitType.page,
    description: 'Collapsible page bit, used to create collapsible sections in pages',
  },
  [BitType.pageCoverImage]: {
    since: '1.22.0',
    baseBitType: BitType.page,
    description: 'Page cover image bit, used to create cover images for pages',
  },
  [BitType.advertisingAdvertorialPage]: {
    since: '4.5.0',
    baseBitType: BitType.page,
    description: 'Advertorial Page bit, used to create advertorial pages',
  },
  [BitType.pageBuyButton]: {
    since: '1.4.3',
    baseBitType: BitType._standard,
    description: 'Page buy button bit, used to create buy buttons on pages',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the page, used to identify the page in URLs',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_content2Buy,
        description: 'Content to buy for the page, used to define what is being sold',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the buy button, used to define the text displayed on the button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageBuyButtonAlt]: {
    since: '1.31.0',
    baseBitType: BitType.pageBuyButton,
    description: 'Alternative page buy button bit, used to create alternative buy buttons on pages',
  },
  [BitType.pageBuyButtonPromotion]: {
    since: '1.5.11',
    baseBitType: BitType.pageBuyButton,
    description: 'Page buy button for promotions, used to create buy buttons on promotional pages',
  },
  [BitType.pageSubpage]: {
    since: '1.6.6',
    baseBitType: BitType._standard,
    description: 'Page subpage bit, used to create subpages in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the subpage, used to identify the subpage in URLs',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_page,
        description: 'Page reference for the subpage, used to link to the parent page',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageShopInShop]: {
    since: '1.6.6',
    baseBitType: BitType.pageSubpage,
    description: 'Page shop-in-shop bit, used to create shop-in-shop pages in articles or books',
  },
  [BitType.pageCategory]: {
    since: '1.6.6',
    baseBitType: BitType.pageSubpage,
    description: 'Page category bit, used to create category pages in articles or books',
  },
  [BitType.pageAcademy]: {
    since: '1.6.6',
    baseBitType: BitType.pageSubpage,
    description: 'Page academy bit, used to create academy pages in articles or books',
  },
  [BitType.pagePromotion]: {
    since: '1.6.6',
    baseBitType: BitType.pageSubpage,
    description: 'Page promotion bit, used to create promotional pages in articles or books',
  },
  [BitType.pageSpecial]: {
    since: '1.6.6',
    baseBitType: BitType.pageSubpage,
    description: 'Page special bit, used to create special pages in articles or books',
  },
  [BitType.pagePerson]: {
    since: '1.5.16',
    baseBitType: BitType._standard,
    description: 'Page person bit, used to create person pages in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the person page, used to identify the person in URLs',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.group_person,
        description: 'Person tags, used to define properties of the person',
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the button on the person page, used to define the text displayed',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageProduct]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    description: 'Page product bit, used to create product pages in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the product page, used to identify the product in URLs',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_product,
        description: 'Product reference for the product page, used to link to the product',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageProductList]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    description: 'Page product list bit, used to create product lists in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the product list page, used to identify the product list in URLs',
        format: TagFormat.plainText,
      },
      // NOTE: Only one of productVideo or productVideoList should be used, not both - TODO: fix when know which one!
      {
        key: ConfigKey.property_product,
        description: 'Product reference for the product list, used to link to the product',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      // {
      //   key: ConfigKey.property_productList,
      //   format: TagFormat.plainText,
      //   maxCount: Count.infinity,
      // },
    ],
  },
  [BitType.pageProductVideo]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    description: 'Page product video bit, used to create product video pages in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the product video page, used to identify the product video in URLs',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_productVideo,
        description:
          'Product video reference for the product video page, used to link to the video',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pageProductVideoList]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    description:
      'Page product video list bit, used to create product video lists in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description:
          'Slug for the product video list page, used to identify the product video list in URLs',
        format: TagFormat.plainText,
      },
      // NOTE: Only one of productVideo or productVideoList should be used, not both - TODO: fix when know which one!
      {
        key: ConfigKey.property_productVideo,
        description:
          'Product video reference for the product video list, used to link to the video',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      // {
      //   key: ConfigKey.property_productVideoList,
      //   format: TagFormat.plainText,
      //   maxCount: Count.infinity,
      // },
    ],
  },
  [BitType.pageSectionFolder]: {
    since: '1.4.17',
    baseBitType: BitType._standard,
    description: 'Page section folder bit, used to create section folders in articles or books',
    tags: [
      {
        key: ConfigKey.property_slug,
        description: 'Slug for the section folder page, used to identify the section in URLs',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_productFolder,
        description:
          'Product folder reference for the section folder page, used to link to the folder',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.photo]: {
    since: '1.3.0',
    baseBitType: BitType.image,
    description: 'Photo bit, used to create photo bits in articles or books',
  },
  [BitType.platform]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform bit, used to define platform properties',
    tags: [
      {
        key: ConfigKey.property_platformName,
        description: 'The platform name',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.resource_platformIcon,
        description: 'The platform icon',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the platform icon resource',
          },
        ],
        maxCount: 1,
      },
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformBrandTarget]: {
    since: '4.15.0',
    baseBitType: BitType._standard,
    description: 'Platform brand target bit, used to define the brand target for publishing',
    tags: [
      {
        key: ConfigKey.property_platformBrandTarget,
        description: 'The platform brand target (typically "light", "dark" or "none")',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.platformHeader]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform header bit, used to define platform header properties',
    tags: [
      {
        key: ConfigKey.resource_platformLogo,
        description: 'The platform logo',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the platform logo resource',
          },
        ],
        maxCount: 1,
      },
      {
        key: ConfigKey.property_platformLogoMaxHeight,
        description: 'Maximum height for the platform logo',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformMain]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform main bit, used to define platform main properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformMainButton]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform main button bit, used to define platform main button properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformMainInput]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform main input bit, used to define platform main input properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformSection]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform section bit, used to define platform section properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformSectionButton]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform section button bit, used to define platform section button properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformSectionChat]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform section chat bit, used to define platform section chat properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
      {
        key: ConfigKey.resource_platformBackgroundImage,
        description: 'The platform section chat background image',
        chain: [
          {
            key: ConfigKey.group_resourceImageCommon,
            description: 'Common image properties for the platform background image resource',
          },
        ],
      },
    ],
  },
  [BitType.platformSectionHeader]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform section header bit, used to define platform section header properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformSectionInput]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform section input bit, used to define platform section input properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.platformSystemIcon]: {
    since: '4.12.0',
    baseBitType: BitType._standard,
    description: 'Platform system icon bit, used to define platform system icon properties',
    tags: [
      {
        key: ConfigKey.group_platformStylesCommon,
        description: 'Common platform styles',
      },
    ],
  },
  [BitType.quote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Quote bit, used to create quotes in articles or books',
    tags: [
      {
        key: ConfigKey.property_quotedPerson,
        description: 'Quoted person for the quote, used to define who is being quoted',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.rating]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Rating bit, used to create rating bits in articles or books',
  },
  [BitType.coachSelfReflectionRating]: {
    since: '1.3.0',
    baseBitType: BitType.rating,
    description: 'Coach self-reflection rating bit, used for self-reflection in coaching',
  },
  [BitType.releaseNote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Release note bit, used to create release notes in articles or books',
    tags: [
      {
        key: ConfigKey.property_releaseVersion,
        description:
          'Release version for the release note, used to define the version of the release',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_releaseKind,
        description: 'Release kind for the release note, used to define the type of release',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_releaseDate,
        description: 'Release date for the release note, used to define when the release was made',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.reviewNote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Review note bit, used to create review notes in articles or books',
    tags: [
      {
        key: ConfigKey.tag_title,
        description: 'Title of the review note, used to display the note title',
      },
      {
        key: ConfigKey.property_resolved,
        description:
          'Resolved status for the review note, used to indicate if the note is resolved',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_resolvedDate,
        description: 'Resolved date for the review note, used to define when the note was resolved',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_resolvedBy,
        description: 'Resolved by for the review note, used to define who resolved the note',
        format: TagFormat.plainText,
      },
    ],
    rootExampleType: ExampleType.string,
  },
  [BitType.reviewAuthorNote]: {
    since: '1.3.0',
    baseBitType: BitType.reviewNote,
    description: 'Author review note bit, used to create author notes in reviews',
  },
  [BitType.reviewCustomerNote]: {
    //
    since: '3.5.0',
    baseBitType: BitType.reviewNote,
    description: 'Customer review note bit, used to create customer notes in reviews',
  },
  [BitType.reviewError]: {
    since: '5.8.0',
    baseBitType: BitType.reviewNote,
    description: 'Review error note bit, used to create error notes in reviews',
  },
  [BitType.reviewErrorAi]: {
    since: '5.8.0',
    baseBitType: BitType.reviewNote,
    description: 'Review error AI note bit, used to create AI error notes in reviews',
  },
  [BitType.reviewErrorTranslation]: {
    since: '5.8.0',
    baseBitType: BitType.reviewNote,
    description:
      'Review error translation note bit, used to create translation error notes in reviews',
  },
  [BitType.reviewReviewerNote]: {
    since: '1.3.0',
    baseBitType: BitType.reviewNote,
    description: 'Reviewer review note bit, used to create reviewer notes in reviews',
  },
  [BitType.reviewRequestForReviewNote]: {
    since: '1.3.0',
    baseBitType: BitType.reviewNote,
    description: 'Request for review note bit, used to create notes requesting reviews',
  },
  [BitType.reviewApprovedNote]: {
    since: '1.3.0',
    baseBitType: BitType.reviewNote,
    description: 'Approved review note bit, used to create notes for approved reviews',
  },
  [BitType.sampleSolution]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Sample solution bit, used to create sample solutions in articles or books',
    tags: [
      // Not sure if these are actually valid here, but include them as they are in the test bit.
      {
        key: ConfigKey.tag_anchor,
        description: 'Anchor for the sample solution, used to link to the solution',
      },
      {
        key: ConfigKey.tag_reference,
        description:
          'Reference for the sample solution, used to link to the source of the solution',
      },
    ],
  },

  [BitType.sequence]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Sequence bit, used to create sequences in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for sequences',
      },
    ],
    cardSet: CardSetConfigKey.elements,
    rootExampleType: ExampleType.boolean,
  },
  [BitType.stillImageFilm]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Still image film bit, used to create still image films in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for still image films, used to define additional properties',
      },
      {
        // Combo resource

        key: ConfigKey.group_resourceStillImageFilm,
        description: 'Resource still image film tags, used to attach still image films to the bit',
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.stillImageFilmEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Still image film embed bit, used to embed still image films in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for still image films, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceStillImageFilmEmbed,
        description:
          'Resource still image film embed tags, used to attach still image films to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.stillImageFilmLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Still image film link bit, used to create still image film links in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description:
          'Resource bit tags for still image films, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceStillImageFilmLink,
        description:
          'Resource still image film link tags, used to attach still image films to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.surveyAnonymous]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Anonymous survey bit, used to create anonymous surveys in articles or books',
  },
  [BitType.survey]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Survey bit, used to create surveys in articles or books',
  },
  [BitType.surveyMatrix]: {
    since: '1.6.2',
    baseBitType: BitType.image,
    description: 'Survey matrix bit, used to create survey matrices in articles or books',
    tags: [
      {
        key: ConfigKey.property_pointerTop,
        description: 'Pointer for the top of the survey matrix, used to define the top label',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
      {
        key: ConfigKey.property_pointerLeft,
        description: 'Pointer for the left of the survey matrix, used to define the left label',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the button in the survey matrix, used to define the button text',
        format: TagFormat.plainText,
        minCount: 1,
        maxCount: 1,
      },
    ],
  },
  [BitType.surveyMatrixMe]: {
    since: '1.6.2',
    baseBitType: BitType.surveyMatrix,
    description:
      'Survey matrix me bit, used to create personal survey matrices in articles or books',
  },
  [BitType.surveyRating]: {
    since: '1.6.0',
    baseBitType: BitType._standard,
    description: 'Survey rating bit, used to create rating surveys in articles or books',
    tags: [
      {
        key: ConfigKey.property_ratingLevelStart,
        description: 'Start level for the rating survey, used to define the lowest rating',
        format: TagFormat.number,
        chain: [
          {
            key: ConfigKey.property_label,
            description:
              'Label for the start level of the rating survey, used to define the text displayed',
            format: TagFormat.bitmarkText,
          },
        ],
      },
      {
        key: ConfigKey.property_ratingLevelEnd,
        description: 'End level for the rating survey, used to define the highest rating',
        format: TagFormat.number,
        chain: [
          {
            key: ConfigKey.property_label,
            description:
              'Label for the end level of the rating survey, used to define the text displayed',
            format: TagFormat.bitmarkText,
          },
        ],
      },
      {
        key: ConfigKey.property_ratingLevelSelected,
        description: 'Selected level for the rating survey, used to define the default rating',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description: 'Caption for the button in the rating survey, used to define the button text',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.surveyRatingOnce]: {
    since: '1.6.0',
    baseBitType: BitType.surveyRating,
    description:
      'Survey rating once bit, used to create one-time rating surveys in articles or books',
  },
  [BitType.surveyRatingDisplay]: {
    since: '1.6.0',
    baseBitType: BitType.surveyRating,
    description: 'Survey rating display bit, used to display rating surveys in articles or books',
  },
  [BitType.scorm]: {
    since: '1.5.11',
    baseBitType: BitType._standard,
    description: 'SCORM bit, used to embed SCORM content in articles or books',
    tags: [
      {
        key: ConfigKey.property_scormSource,
        description: 'Source for the SCORM content, used to define the SCORM package URL',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_posterImage,
        description: 'Poster image for the SCORM content, used to display a preview image',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.pronunciationTable]: {
    since: '3.1.0',
    baseBitType: BitType._standard,
    description:
      'Pronunciation table bit, used to create pronunciation tables in articles or books',

    cardSet: CardSetConfigKey.pronunciationTable,
  },
  [BitType.table]: {
    since: '1.5.19',
    baseBitType: BitType._standard,
    description: 'Table bit, used to create tables in articles or books',
    tags: [
      {
        key: ConfigKey.property_caption,
        description: 'Caption for the table, used to define the title of the table',
        format: TagFormat.bitmarkText,
      },
      {
        key: ConfigKey.property_tableFixedHeader,
        description: 'Fixed header for the table, used to keep the header visible while scrolling',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableHeaderWhitespaceNoWrap,
        description: 'No wrap for table header whitespace, used to prevent header text wrapping',
        format: TagFormat.boolean,
        // defaultValue: 'false',
      },
      {
        key: ConfigKey.property_tableSearch,
        description:
          'Search functionality for the table, used to enable searching within the table',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableSort,
        description: 'Sorting functionality for the table, used to enable sorting of table columns',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tablePagination,
        description: 'Pagination for the table, used to limit the number of rows displayed at once',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tablePaginationLimit,
        description: 'Pagination limit for the table, used to define the number of rows per page',
        format: TagFormat.number,
        defaultValue: '0',
      },
      {
        key: ConfigKey.property_tableHeight,
        description: 'Height for the table, used to define the height of the table in pixels',
        format: TagFormat.number,
        defaultValue: '0',
      },
      {
        key: ConfigKey.property_tableWhitespaceNoWrap,
        description: 'No wrap for table whitespace, used to prevent text wrapping in table cells',
        format: TagFormat.boolean,
        // defaultValue: 'false',
      },
      {
        key: ConfigKey.property_tableAutoWidth,
        description: 'Auto width for table columns, used to automatically adjust column widths',
        format: TagFormat.boolean,
        // defaultValue: 'true',
      },
      {
        key: ConfigKey.property_tableResizableColumns,
        description: 'Resizable columns for the table, used to allow users to resize table columns',
        format: TagFormat.boolean,
      },
      {
        key: ConfigKey.property_tableColumnMinWidth,
        description: 'Minimum width for table columns, used to define the minimum width of columns',
        format: TagFormat.number,
      },
    ],
    cardSet: CardSetConfigKey.table,
  },
  [BitType.tableExtended]: {
    since: '4.14.0',
    baseBitType: BitType.table,
    description: 'Extended table bit, used to create complex tables with all HTML table features',
  },
  [BitType.tableAlt]: {
    since: '1.16.0',
    baseBitType: BitType.table,
    description: 'Alternative table bit, used to create alternative tables in articles or books',
  },
  [BitType.standardTableNormative]: {
    since: '1.16.0',
    baseBitType: BitType.table,
    description:
      'Standard normative table bit, used to create standard normative tables in articles or books',
  },
  [BitType.standardTableNonNormative]: {
    since: '1.16.0',
    baseBitType: BitType.table,
    description:
      'Standard non-normative table bit, used to create standard non-normative tables in articles or books',
  },
  [BitType.standardRemarkTableNormative]: {
    since: '1.17.0',
    baseBitType: BitType.table,
    description:
      'Standard normative remark table bit, used to create standard normative remark tables in articles or books',
  },
  [BitType.standardRemarkTableNonNormative]: {
    since: '1.17.0',
    baseBitType: BitType.table,
    description:
      'Standard non-normative remark table bit, used to create standard non-normative remark tables in articles or books',
  },
  [BitType.smartStandardTableNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableNormative,
    description:
      'Smart standard normative table bit, used to create smart standard normative tables in articles or books',
  },
  [BitType.smartStandardTableNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardTableNonNormative,
    description:
      'Smart standard non-normative table bit, used to create smart standard non-normative tables in articles or books',
  },
  [BitType.smartStandardRemarkTableNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableNormative,
    description:
      'Smart standard normative remark table bit, used to create smart standard normative remark tables in articles or books',
  },
  [BitType.smartStandardRemarkTableNonNormative]: {
    since: '1.28.0',
    baseBitType: BitType.standardRemarkTableNonNormative,
    description:
      'Smart standard non-normative remark table bit, used to create smart standard non-normative remark tables in articles or books',
  },
  [BitType.smartStandardTableNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableNormative,
    description:
      'Collapsible smart standard normative table bit, used to create collapsible smart standard normative tables in articles or books',
  },
  [BitType.smartStandardTableNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardTableNonNormative,
    description:
      'Collapsible smart standard non-normative table bit, used to create collapsible smart standard non-normative tables in articles or books',
  },
  [BitType.smartStandardRemarkTableNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableNormative,
    description:
      'Collapsible smart standard normative remark table bit, used to create collapsible smart standard normative remark tables in articles or books',
  },
  [BitType.smartStandardRemarkTableNonNormativeCollapsible]: {
    since: '1.28.0',
    baseBitType: BitType.smartStandardRemarkTableNonNormative,
    description:
      'Collapsible smart standard non-normative remark table bit, used to create collapsible smart standard non-normative remark tables in articles or books',
  },
  [BitType.parameters]: {
    since: '1.18.0',
    baseBitType: BitType.table,
    description: 'Parameters bit, used to create parameter tables in articles or books',
  },
  [BitType.toc]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Table of contents bit, used to create a table of contents in articles or books',
  },
  [BitType.tocChapter]: {
    since: '1.5.5',
    baseBitType: BitType.toc,
    description: 'Table of contents chapter bit, used to create chapters in the table of contents',
    tags: [
      {
        key: ConfigKey.property_maxDisplayLevel,
        description: 'Maximum display level for the chapter in the table of contents',
        format: TagFormat.number,
      },
    ],
  },
  [BitType.tocInline]: {
    since: '3.24.0',
    baseBitType: BitType.toc,
    description:
      'Inline table of contents bit, used to create inline tables of contents in articles or books',
    tags: [
      {
        key: ConfigKey.property_maxTocChapterLevel,
        description: 'Maximum chapter level for the inline table of contents',
        format: TagFormat.number,
      },
    ],
  },
  [BitType.tocResource]: {
    since: '3.31.0',
    baseBitType: BitType.toc,
    description:
      'Table of contents resource bit, used to create resources in the table of contents',
    tags: [
      {
        key: ConfigKey.property_tocResource,
        description: 'Resource content for the table of contents, used to define the resource',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description:
          'Caption for the button in the table of contents resource, used to define the text displayed on the button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.tocContent]: {
    since: '3.31.0',
    baseBitType: BitType.toc,
    description:
      'Table of contents content bit, used to create content sections in the table of contents',
    tags: [
      {
        key: ConfigKey.property_tocContent,
        description: 'Content for the table of contents, used to define the content section',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description:
          'Caption for the button in the table of contents content, used to define the text displayed on the button',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.anchor]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Anchor bit, used to create anchors in articles or books',
  },
  [BitType.bitBookEnding]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bit book ending bit, used to create endings in articles or books',
  },
  [BitType.bitBookSummary]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bit book summary bit, used to create summaries in articles or books',
  },
  [BitType.botActionAnnounce]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bot action announce bit, used to create announcements in articles or books',
  },
  [BitType.botActionRatingNumber]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Bot action rating number bit, used to create rating number actions in articles or books',
  },
  [BitType.botActionRemind]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bot action remind bit, used to create reminders in articles or books',
  },
  [BitType.botActionSave]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Bot action save bit, used to create save actions in articles or books',
  },
  [BitType.botActionTrueFalse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Bot action true/false bit, used to create true/false actions in articles or books',
  },
  [BitType.chapterSubjectMatter]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Chapter subject matter bit, used to create subject matter chapters in articles or books',
  },
  [BitType.chat]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Chat bit, used to create chat sections in articles or books',
  },
  [BitType.conclusion]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Conclusion bit, used to create conclusions in articles or books',
  },
  [BitType.conclusionAlt]: {
    since: '1.16.0',
    baseBitType: BitType.conclusion,
    description:
      'Alternative conclusion bit, used to create alternative conclusions in articles or books',
  },
  [BitType.documentUpload]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description:
      'Document upload bit, used to create document upload sections in articles or books',
  },
  [BitType.footNote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Footnote bit, used to create footnotes in articles or books',
  },
  [BitType.formFreeText]: {
    since: '5.3.0',
    baseBitType: BitType.interview,
    description: 'Form free text bit, used to create free text forms in articles or books',
  },
  [BitType.groupBorn]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Group born bit, used to create group born sections in articles or books',
  },
  [BitType.groupDied]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Group died bit, used to create group died sections in articles or books',
  },
  [BitType.recordAudio]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Record audio bit, used to create audio recording sections in articles or books',
  },
  [BitType.recordVideo]: {
    since: '1.5.24',
    baseBitType: BitType._standard,
    description: 'Record video bit, used to create video recording sections in articles or books',
  },
  [BitType.stickyNote]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Sticky note bit, used to create sticky notes in articles or books',
  },
  [BitType.takePicture]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Take picture bit, used to create picture taking sections in articles or books',
  },
  [BitType.handInAudio]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description: 'Hand in audio bit, used to create audio submission sections in articles or books',
  },
  [BitType.handInContact]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description:
      'Hand in contact bit, used to create contact submission sections in articles or books',
  },
  [BitType.handInDocument]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description:
      'Hand in document bit, used to create document submission sections in articles or books',
  },
  [BitType.handInFile]: {
    //
    since: '3.2.0',
    baseBitType: BitType._standard,
    description: 'Hand in file bit, used to create file submission sections in articles or books',
    tags: [
      {
        key: ConfigKey.property_handInAcceptFileType,
        description:
          'Accepted file types for the hand-in file, used to define allowed file formats',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
    ],
  },
  [BitType.handInFreeText]: {
    since: '5.3.0',
    baseBitType: BitType.interview,
    description:
      'Hand in free text bit, used to create free text submission sections in articles or books',
  },
  [BitType.handInFreeTextExpert]: {
    since: '5.3.0',
    baseBitType: BitType.interview,
    description:
      'Hand in free text expert bit, used to create free text expert submission sections in articles or books',
  },
  [BitType.handInLocation]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description:
      'Hand in location bit, used to create location submission sections in articles or books',
  },
  [BitType.handInPhoto]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description: 'Hand in photo bit, used to create photo submission sections in articles or books',
  },
  [BitType.handInScan]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description: 'Hand in scan bit, used to create scan submission sections in articles or books',
  },
  [BitType.handInSubmit]: {
    //
    since: '3.2.0',
    baseBitType: BitType._standard,
    description: 'Hand in submit bit, used to create submission sections in articles or books',
    tags: [
      {
        key: ConfigKey.property_handInRequirement,
        description: 'Requirement for the hand-in submission, used to define what is needed',
        format: TagFormat.plainText,
        maxCount: Count.infinity,
      },
      {
        key: ConfigKey.property_handInInstruction,
        description: 'Instruction for the hand-in submission, used to guide the user',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_buttonCaption,
        description:
          'Caption for the button in the hand-in submission, used to define the button text',
        format: TagFormat.plainText,
      },
    ],
  },
  [BitType.handInVideo]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description: 'Hand in video bit, used to create video submission sections in articles or books',
  },
  [BitType.handInVoice]: {
    since: '1.5.15',
    baseBitType: BitType._standard,
    description: 'Hand in voice bit, used to create voice submission sections in articles or books',
  },
  [BitType.trueFalse1]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'True/False bit, used to create true/false questions in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for true/false questions',
      },
      {
        key: ConfigKey.property_labelTrue,
        description: 'Label for the true option in the true/false question',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_labelFalse,
        description: 'Label for the false option in the true/false question',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.tag_true,
        description: 'Tag for the true option in the true/false question',
      },
      {
        key: ConfigKey.tag_false,
        description: 'Tag for the false option in the true/false question',
      },
    ],
    rootExampleType: ExampleType.boolean,
  },

  [BitType.trueFalse]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'True/False bit, used to create true/false questions in articles or books',
    quizBit: true,
    tags: [
      {
        key: ConfigKey.group_quizCommon,
        description: 'Common quiz tags for true/false questions',
      },
      {
        key: ConfigKey.property_labelTrue,
        description: 'Label for the true option in the true/false question',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_labelFalse,
        description: 'Label for the false option in the true/false question',
        format: TagFormat.plainText,
      },
    ],
    cardSet: CardSetConfigKey.statements,
  },
  [BitType.vendorAmcharts5Chart]: {
    since: '1.5.8',
    baseBitType: BitType.code,
    description: 'AmCharts 5 chart bit, used to embed AmCharts 5 charts in articles or books',

    textFormatDefault: TextFormat.json,
  },
  [BitType.vendorDatadogDashboard]: {
    since: '5.2.0',
    baseBitType: BitType.nonProductionPrototypeIframe,
    description: 'A Datadog dashboard bit, used to embed Datadog dashboards',
  },
  [BitType.vendorDatadogDashboardEmbed]: {
    since: '3.12.0',
    baseBitType: BitType.code,
    description:
      'Datadog dashboard embed bit, used to embed Datadog dashboards in articles or books',
    tags: [
      {
        key: ConfigKey.property_vendorDashboardId,
        description:
          'Dashboard ID for the Datadog dashboard, used to define which dashboard to embed',
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorFormbricksEmbed]: {
    since: '3.8.0',
    baseBitType: BitType.code,
    description: 'Formbricks embed bit, used to embed Formbricks surveys in articles or books',
    tags: [
      {
        key: ConfigKey.property_vendorSurveyId,
        description: 'Survey ID for the Formbricks survey, used to define which survey to embed',
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorFormbricksEmbedAnonymous]: {
    since: '3.9.0',
    baseBitType: BitType.vendorFormbricksEmbed,
    description:
      'Anonymous Formbricks embed bit, used to embed anonymous Formbricks surveys in articles or books',
  },
  [BitType.vendorFormbricksLink]: {
    since: '3.8.0',
    baseBitType: BitType.code,
    description:
      'Formbricks link bit, used to create links to Formbricks surveys in articles or books',
    tags: [
      {
        key: ConfigKey.property_vendorSurveyId,
        description: 'Survey ID for the Formbricks survey, used to define which survey to link to',
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorFormbricksLinkAnonymous]: {
    since: '3.9.0',
    baseBitType: BitType.vendorFormbricksLink,
    description:
      'Anonymous Formbricks link bit, used to create links to anonymous Formbricks surveys in articles or books',
  },
  [BitType.vendorHighchartsChart]: {
    since: '1.5.28',
    baseBitType: BitType.vendorAmcharts5Chart,
    description: 'Highcharts chart bit, used to embed Highcharts charts in articles or books',
  },
  [BitType.vendorIframelyEmbed]: {
    since: '1.5.10',
    baseBitType: BitType.code,
    description:
      'Iframely embed bit, used to embed content from various sources in articles or books',
    tags: [
      {
        key: ConfigKey.property_width, // Same as image
        description: 'Width for the embedded content, used to define the width in pixels',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_height, // Same as image
        description: 'Height for the embedded content, used to define the height in pixels',
        format: TagFormat.number,
      },
      {
        key: ConfigKey.property_vendorUrl,
        description: 'URL for the content to be embedded, used to define the source URL',
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorIframelyCard]: {
    since: '1.5.10',
    baseBitType: BitType.vendorIframelyEmbed,
    description:
      'Iframely card bit, used to create cards for embedded content in articles or books',
  },
  [BitType.vendorIframelyPreview]: {
    since: '1.5.10',
    baseBitType: BitType.vendorIframelyEmbed,
    description:
      'Iframely preview bit, used to create previews for embedded content in articles or books',
  },
  [BitType.vendorIframelyPreviewMini]: {
    since: '1.5.10',
    baseBitType: BitType.vendorIframelyEmbed,
    description:
      'Iframely preview mini bit, used to create mini previews for embedded content in articles or books',
  },
  [BitType.vendorJupyterOutput]: {
    since: '1.4.3',
    baseBitType: BitType.code,
    description: 'Jupyter output bit, used to embed Jupyter notebook outputs in articles or books',
    tags: [
      {
        key: ConfigKey.property_jupyterId,
        description: 'Jupyter ID for the notebook, used to define which notebook to embed',
        format: TagFormat.plainText,
      },
      {
        key: ConfigKey.property_jupyterExecutionCount,
        description: 'Execution count for the Jupyter output, used to define the execution order',
        format: TagFormat.number,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorJupyterCellCode]: {
    since: '1.4.3',
    baseBitType: BitType.vendorJupyterOutput,
    description:
      'Jupyter cell code bit, used to embed Jupyter notebook cell code in articles or books',
  },
  [BitType.vendorJupyterCellMarkdown]: {
    since: '1.4.3',
    baseBitType: BitType.vendorJupyterOutput,
    description:
      'Jupyter cell markdown bit, used to embed Jupyter notebook cell markdown in articles or books',
  },
  [BitType.vendorJupyterCellRaw]: {
    since: '1.4.3',
    baseBitType: BitType.vendorJupyterOutput,
    description:
      'Jupyter cell raw bit, used to embed Jupyter notebook cell raw content in articles or books',
  },
  [BitType.vendorJupyterIpynb]: {
    since: '1.4.3',
    baseBitType: BitType.vendorJupyterOutput,
    description: 'Jupyter IPYNB bit, used to embed Jupyter notebook files in articles or books',
  },
  [BitType.vendorPadletEmbed]: {
    since: '1.3.0',
    baseBitType: BitType.code,
    description: 'Padlet embed bit, used to embed Padlet boards in articles or books',
    tags: [
      {
        key: ConfigKey.property_padletId,
        description: 'Padlet ID for the board, used to define which Padlet to embed',
        format: TagFormat.plainText,
      },
    ],
    textFormatDefault: TextFormat.plainText,
  },
  [BitType.vendorStripePricingTable]: {
    since: '1.20.0',
    baseBitType: BitType.article,
    description:
      'Stripe pricing table bit, used to embed Stripe pricing tables in articles or books',
    tags: [
      {
        key: ConfigKey.property_stripePricingTableId,
        description: 'Stripe pricing table ID, used to define which pricing table to embed',
        format: TagFormat.plainText,
        minCount: 1,
      },
      {
        key: ConfigKey.property_stripePublishableKey,
        description: 'Stripe publishable key, used to authenticate the Stripe pricing table',
        format: TagFormat.plainText,
        minCount: 1,
      },
    ],
  },
  [BitType.vendorStripePricingTableExternal]: {
    since: '3.13.0',
    baseBitType: BitType.vendorStripePricingTable,
    description:
      'External Stripe pricing table bit, used to embed external Stripe pricing tables in articles or books',
  },

  [BitType.video]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Video bit, used to embed videos in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for videos, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceVideo,
        description: 'Resource video tags, used to attach videos to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.videoLandscape]: {
    since: '1.3.0',
    baseBitType: BitType.video,
    description: 'Landscape video bit, used to embed landscape videos in articles or books',
  },
  [BitType.videoPortrait]: {
    since: '1.3.0',
    baseBitType: BitType.video,
    description: 'Portrait video bit, used to embed portrait videos in articles or books',
  },
  [BitType.videoEmbed]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Video embed bit, used to embed videos from external sources in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for video embeds, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceVideoEmbed,
        description: 'Resource video embed tags, used to attach video embeds to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.videoEmbedLandscape]: {
    since: '1.3.0',
    baseBitType: BitType.videoEmbed,
    description:
      'Landscape video embed bit, used to embed landscape videos from external sources in articles or books',
  },
  [BitType.videoEmbedPortrait]: {
    since: '1.3.0',
    baseBitType: BitType.videoEmbed,
    description:
      'Portrait video embed bit, used to embed portrait videos from external sources in articles or books',
  },
  [BitType.videoLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Video link bit, used to create links to videos in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for video links, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceVideoLink,
        description: 'Resource video link tags, used to attach video links to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.videoLinkLandscape]: {
    since: '1.3.0',
    baseBitType: BitType.videoLink,
    description:
      'Landscape video link bit, used to create links to landscape videos in articles or books',
  },
  [BitType.videoLinkPortrait]: {
    since: '1.3.0',
    baseBitType: BitType.videoLink,
    description:
      'Portrait video link bit, used to create links to portrait videos in articles or books',
  },
  [BitType.websiteLink]: {
    since: '1.3.0',
    baseBitType: BitType._standard,
    description: 'Website link bit, used to create links to websites in articles or books',
    tags: [
      {
        key: ConfigKey.group_resourceBitTags,
        description: 'Resource bit tags for website links, used to define additional properties',
      },
      {
        key: ConfigKey.group_resourceWebsiteLink,
        description: 'Resource website link tags, used to attach website links to the bit',
        minCount: 1,
      },
    ],
    resourceAttachmentAllowed: false,
  },
  [BitType.nonProductionPrototypeIframe]: {
    since: '4.20.0',
    baseBitType: BitType._standard,
    description: 'A non-production prototype iframe bit, used to embed prototype iframes',
    tags: [
      {
        key: ConfigKey.property_iframeSrc,
        description: 'Iframe source URL, used to define the source of the iframe',
        minCount: 1,
      },
      {
        key: ConfigKey.property_iframeName,
        description: 'Iframe name, used to define the name of the iframe',
      },
    ],
  },
  [BitType.vendorLearndashEmbed]: {
    since: '5.0.0',
    baseBitType: BitType.nonProductionPrototypeIframe,
    description: 'Learndash embed bit, used to embed Learndash content in an iframe',
  },
};

export { BITS };
