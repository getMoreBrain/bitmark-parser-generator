// Bit configs
import { _BitConfig, _BitsConfig, _PropertiesConfig, _PropertyConfig } from '../model/config/RawConfig';
import { BitTagTypeType } from '../model/enum/BitTagType';
import { BitType } from '../model/enum/BitType';
import { CountType } from '../model/enum/Count';
import { ExampleTypeType } from '../model/enum/ExampleType';

import { BITS } from './new/bits';
import { PROPERTIES } from './new/properties';
import './bits/_errorBitConfig';
import './bits/appFlashcardsBitConfig';
import './bits/appLinkBitConfig';
import './bits/articleBitConfig';
import './bits/articleEmbedBitConfig';
import './bits/articleLinkBitConfig';
import './bits/audioBitConfig';
import './bits/audioEmbedBitConfig';
import './bits/audioLinkBitConfig';
import './bits/bitAliasBitConfig';
import './bits/bookBitConfig';
import './bits/botActionResponseBitConfig';
import './bits/botActionSendBitConfig';
import './bits/browserImageBitConfig';
import './bits/card1BitConfig';
import './bits/chapterBitConfig';
import './bits/clozeAndMultipleChoiceTextBitConfig';
import './bits/clozeBitConfig';
import './bits/codeBitConfig';
import './bits/conversationBitConfig';
import './bits/documentBitConfig';
import './bits/documentDownloadBitConfig';
import './bits/documentEmbedBitConfig';
import './bits/documentLinkBitConfig';
import './bits/essayBitConfig';
import './bits/exampleBitConfig';
import './bits/flashcardBitConfig';
import './bits/focusImageBitConfig';
import './bits/highlightTextBitConfig';
import './bits/imageBitConfig';
import './bits/imageLinkBitConfig';
import './bits/imageOnDeviceBitConfig';
import './bits/imageResponsiveBitConfig';
import './bits/internalLinkBitConfig';
import './bits/interviewBitConfig';
import './bits/learningPathBitConfig';
import './bits/markBitConfig';
import './bits/matchBitConfig';
import './bits/multipleChoice1BitConfig';
import './bits/multipleChoiceBitConfig';
import './bits/multipleChoiceTextBitConfig';
import './bits/multipleResponse1BitConfig';
import './bits/multipleResponseBitConfig';
import './bits/photoBitConfig';
import './bits/quoteBitConfig';
import './bits/ratingBitConfig';
import './bits/releaseNoteBitConfig';
import './bits/sampleSolutionBitConfig';
import './bits/sequenceBitConfig';
import './bits/stillImageFilmBitConfig';
import './bits/stillImageFilmEmbedBitConfig';
import './bits/stillImageFilmLinkBitConfig';
import './bits/surveyAnonymousBitConfig';
import './bits/surveyBitConfig';
import './bits/tocBitConfig';
import './bits/trueFalse1BitConfig';
import './bits/trueFalseBitConfig';
import './bits/vendorPadletEmbedBitConfig';
import './bits/videoBitConfig';
import './bits/videoEmbedBitConfig';
import './bits/videoLinkBitConfig';
import './bits/websiteLinkBitConfig';
// Property configs
import './properties/actionPropertyConfig';
import './properties/ageRangePropertyConfig';
import './properties/aiGeneratedPropertyConfig';
import './properties/authorPropertyConfig';
import './properties/bookPropertyConfig';
import './properties/botPropertyConfig';
import './properties/caseSensitivePropertyConfig';
import './properties/colorPropertyConfig';
import './properties/colorTagPropertyConfig';
import './properties/computerLanguagePropertyConfig';
import './properties/coverImagePropertyConfig';
import './properties/datePropertyConfig';
import './properties/deeplinkPropertyConfig';
import './properties/durationPropertyConfig';
import './properties/examplePropertyConfig';
import './properties/externalIdPropertyConfig';
import './properties/externalLinkPropertyConfig';
import './properties/externalLinkTextPropertyConfig';
import './properties/flashcardSetPropertyConfig';
import './properties/focusXPropertyConfig';
import './properties/focusYPropertyConfig';
import './properties/formatPropertyConfig';
import './properties/iconPropertyConfig';
import './properties/iconTagPropertyConfig';
import './properties/idPropertyConfig';
import './properties/imageSourcePropertyConfig';
import './properties/indicationPropertyConfig';
import './properties/isInfoOnlyPropertyConfig';
import './properties/isTrackedPropertyConfig';
import './properties/kindPropertyConfig';
import './properties/labelFalsePropertyConfig';
import './properties/labelTruePropertyConfig';
import './properties/languagePropertyConfig';
import './properties/levelPropertyConfig';
import './properties/listPropertyConfig';
import './properties/locationPropertyConfig';
import './properties/longAnswerPropertyConfig';
import './properties/markPropertyConfig';
import './properties/mockupIdPropertyConfig';
import './properties/padletIdPropertyConfig';
import './properties/partialAnswerPropertyConfig';
import './properties/partnerPropertyConfig';
import './properties/progressPropertyConfig';
import './properties/publicationsPropertyConfig';
import './properties/publisherPropertyConfig';
import './properties/quotedPersonPropertyConfig';
import './properties/reactionPropertyConfig';
import './properties/referencePropertyConfig';
import './properties/releaseVersionPropertyConfig';
import './properties/resourcePropertyConfig';
import './properties/sampleSolutionPropertyConfig';
import './properties/shortAnswerPropertyConfig';
import './properties/sizePropertyConfig';
import './properties/spaceIdPropertyConfig';
import './properties/subjectPropertyConfig';
import './properties/subtypePropertyConfig';
import './properties/tagPropertyConfig';
import './properties/targetPropertyConfig';
import './properties/textReferencePropertyConfig';
import './properties/themePropertyConfig';
import './properties/thumbImagePropertyConfig';
import './properties/tocPropertyConfig';
import './properties/trimPropertyConfig';
import './properties/typePropertyConfig';
import './properties/videoCallLinkPropertyConfig';

export interface BitConfig {
  tags: TagsInfoConfig;
  cardSet?: CardConfig;
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  footerAllowed?: boolean; // Default: false
  footerRequired?: boolean; // Default: false
  resourceAttachmentAllowed?: boolean; // Default: false
  rootExampleType?: ExampleTypeType;
}

export interface TagsInfoConfig {
  [key: string]: TagInfoConfig;
}

export interface TagInfoConfig {
  type: BitTagTypeType;
  id: string;
  tag: string;
  maxCount?: CountType; // Default: 1
  minCount?: CountType; // Default: 1
  chain?: TagInfoConfig[];
}

export interface CardConfig {
  variants: CardVariantConfig[][];
}

export interface CardVariantConfig {
  tags: TagsInfoConfig;
  bodyAllowed?: boolean; // Default: false
  bodyRequired?: boolean; // Default: false
  repeatCount?: CountType; // Default: 1
}

class Config {
  // Need to return a resolved bit configuration (with back references to the config tags.)
  public getBit(bit: BitType): _BitConfig {}

  getBits(): _BitsConfig {
    return BITS;
  }

  getProperties(): _PropertiesConfig {
    return PROPERTIES;
  }

  getPropertyFromTag(bit: BitType, tag: string): _PropertyConfig | undefined {
    const bits = this.getBits();
    const bitConfig = bits[bit.root];
    if (!bitConfig) return undefined;

    // Search the properties in the bit config for the matching tag.
    for (const t of bitConfig.tags) {
      if (t.id === tag) {
        return this.getProperties()[t.id];
      }
    }

    return undefined;
  }
}

const instance = new Config();

export { instance as Config };
