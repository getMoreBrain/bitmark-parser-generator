import { type Bit, type CardBit } from '../../model/ast/Nodes.ts';
import { ResourceType } from '../../model/enum/ResourceType.ts';
import {
  type AppLinkResourceWrapperJson,
  type ArticleResourceWrapperJson,
  type AudioEmbedResourceWrapperJson,
  type AudioLinkResourceWrapperJson,
  type AudioResourceWrapperJson,
  type DocumentDownloadResourceWrapperJson,
  type DocumentEmbedResourceWrapperJson,
  type DocumentLinkResourceWrapperJson,
  type DocumentResourceWrapperJson,
  type ImageLinkResourceWrapperJson,
  type ImageResourceWrapperJson,
  type ResourceJson,
  type StillImageFilmEmbedResourceWrapperJson,
  type StillImageFilmLinkResourceWrapperJson,
  type StillImageFilmResourceWrapperJson,
  type VideoEmbedResourceWrapperJson,
  type VideoLinkResourceWrapperJson,
  type VideoResourceWrapperJson,
  type WebsiteLinkResourceWrapperJson,
} from '../../model/json/ResourceJson.ts';
import { StringUtils } from '../../utils/StringUtils.ts';

/**
 * Validates a node as the builder level (i.e. when creating AST).
 *
 * This is not really implemented yet.
 * Validation happens in the bitmark parsing, but not when creating the AST.
 * This means that the JSON => bitmark conversion is not well validated yet.
 */
class NodeValidator {
  validateBit(bit: Bit | undefined): Bit | undefined {
    if (!bit) return bit;

    // TODO
    const ret: Bit | undefined = bit;
    // switch (bit.bitType.root) {
    //   case BitType.interview:
    //     ret = this.validateInterviewBit(bit);
    //     break;
    // }

    return ret;
  }

  validateCardBit(bit: CardBit | undefined): CardBit | undefined {
    if (!bit) return bit;

    const ret: CardBit | undefined = bit;
    // TODO

    return ret;
  }

  validateResource<T extends ResourceJson>(resource: T | undefined): T | undefined {
    if (!resource) return undefined;

    const ret: T | undefined = resource;
    let valid = true;

    switch (resource.type) {
      case ResourceType.image: {
        // case ResourceTag.imagePortrait:
        // case ResourceTag.imageLandscape:
        const imageResource = (resource as ImageResourceWrapperJson).image;
        if (!StringUtils.isString(imageResource.src)) imageResource.src = '';
        break;
      }
      case ResourceType.imageLink: {
        const imageLink = (resource as ImageLinkResourceWrapperJson).imageLink;
        if (!StringUtils.isString(imageLink.url)) imageLink.url = '';
        break;
      }
      case ResourceType.audio: {
        const audio = (resource as AudioResourceWrapperJson).audio;
        if (!StringUtils.isString(audio.src)) audio.src = '';
        break;
      }
      case ResourceType.audioEmbed: {
        const audioEmbed = (resource as AudioEmbedResourceWrapperJson).audioEmbed;
        if (!StringUtils.isString(audioEmbed.src)) audioEmbed.src = '';
        break;
      }
      case ResourceType.audioLink: {
        const audioLink = (resource as AudioLinkResourceWrapperJson).audioLink;
        if (!StringUtils.isString(audioLink.url)) audioLink.url = '';
        break;
      }
      case ResourceType.video: {
        const video = (resource as VideoResourceWrapperJson).video;
        if (!StringUtils.isString(video.src)) video.src = '';
        break;
      }
      case ResourceType.videoEmbed: {
        const videoEmbed = (resource as VideoEmbedResourceWrapperJson).videoEmbed;
        if (!StringUtils.isString(videoEmbed.url)) videoEmbed.url = '';
        break;
      }
      case ResourceType.videoLink: {
        const videoLink = (resource as VideoLinkResourceWrapperJson).videoLink;
        if (!StringUtils.isString(videoLink.url)) videoLink.url = '';
        break;
      }
      case ResourceType.stillImageFilm: {
        const stillImageFilm = resource as StillImageFilmResourceWrapperJson;
        if (!StringUtils.isString(stillImageFilm.image.src)) stillImageFilm.image.src = '';
        if (!StringUtils.isString(stillImageFilm.audio.src)) stillImageFilm.audio.src = '';
        break;
      }
      case ResourceType.stillImageFilmEmbed: {
        const stillImageFilmEmbed = (resource as StillImageFilmEmbedResourceWrapperJson)
          .stillImageFilmEmbed;
        if (!StringUtils.isString(stillImageFilmEmbed.url)) stillImageFilmEmbed.url = '';
        break;
      }
      case ResourceType.stillImageFilmLink: {
        const stillImageFilmLink = (resource as StillImageFilmLinkResourceWrapperJson)
          .stillImageFilmLink;
        if (!StringUtils.isString(stillImageFilmLink.url)) stillImageFilmLink.url = '';
        break;
      }
      case ResourceType.article: {
        const article = (resource as ArticleResourceWrapperJson).article;
        if (!StringUtils.isString(article.body)) article.body = '';
        break;
      }
      case ResourceType.document: {
        const document = (resource as DocumentResourceWrapperJson).document;
        if (!StringUtils.isString(document.url)) document.url = '';
        break;
      }
      case ResourceType.documentEmbed: {
        const documentEmbed = (resource as DocumentEmbedResourceWrapperJson).documentEmbed;
        if (!StringUtils.isString(documentEmbed.url)) documentEmbed.url = '';
        break;
      }
      case ResourceType.documentLink: {
        const documentLink = (resource as DocumentLinkResourceWrapperJson).documentLink;
        if (!StringUtils.isString(documentLink.url)) documentLink.url = '';
        break;
      }
      case ResourceType.documentDownload: {
        const documentDownload = (resource as DocumentDownloadResourceWrapperJson).documentDownload;
        if (!StringUtils.isString(documentDownload.url)) documentDownload.url = '';
        break;
      }
      case ResourceType.appLink: {
        const appLink = (resource as AppLinkResourceWrapperJson).appLink;
        if (!StringUtils.isString(appLink.url)) appLink.url = '';
        break;
      }
      case ResourceType.websiteLink: {
        const websiteLink = (resource as WebsiteLinkResourceWrapperJson).websiteLink;
        if (!StringUtils.isString(websiteLink.url)) websiteLink.url = '';
        break;
      }

      default:
        valid = false;
    }

    // Note: even if resource is invalid, we still return it as it is used to set the resource attachment type
    // in the bit declaration, and if it is removed completely this cannot be done.
    if (!valid) {
      if (resource.type) {
        resource.__invalid = true;
      }
    }

    return ret;
  }

  isRequired(val: unknown, name: string) {
    if (val) return;
    throw new Error(`${name} is required but is not set`);
  }

  isOneOfRequired(vals: unknown[], names: string[]) {
    if (Array.isArray(vals)) {
      for (const v of vals) {
        if (v) return;
      }
    }

    throw new Error(`One of '${names.join(', ')}' is required but none is set`);
  }

  isString(val: unknown, name: string) {
    if (StringUtils.isString(val)) return;
    throw new Error(`${name} is required to be a string`);
  }

  isNonEmptyString(val: unknown, name: string) {
    if (StringUtils.isString(val) && val !== '') return;
    throw new Error(`${name} is required to be a non-empty string`);
  }

  isStringOrBoolean(val: unknown, name: string) {
    if (StringUtils.isString(val)) return;
    if (val === true || val === false) return;
    throw new Error(`${name} is required to be a string or a boolean`);
  }

  isNonEmptyStringOrBoolean(val: unknown, name: string) {
    if (StringUtils.isString(val) && val !== '') return;
    if (val === true || val === false) return;
    throw new Error(`${name} is required to be a non-empty string or a boolean`);
  }

  isArray(val: unknown, name: string) {
    if (Array.isArray(val)) return;
    throw new Error(`${name} is required to be a array`);
  }

  isNonEmptyArray(val: unknown, name: string) {
    if (Array.isArray(val) && val.length > 0) return;
    throw new Error(`${name} is required to be a non-empty array`);
  }

  isNumber(val: unknown, name: string) {
    if (Number.isFinite(val)) return;
    throw new Error(`${name} is required to be a number`);
  }

  isBoolean(val: unknown, name: string) {
    if (val === true || val === false) return;
    throw new Error(`${name} is required to be a boolean`);
  }

  isStringOrNumberOrBooleanOrNullOrUndefined(val: unknown, name: string) {
    if (StringUtils.isString(val)) return;
    if (Number.isFinite(val)) return;
    if (val === true || val === false) return;
    if (val == null) return;
    throw new Error(
      `${name} is required to be a string or a number or a boolean or null or undefined`,
    );
  }

  //
  // private
  //

  // private validateInterviewBit(bit: Bit): Bit | undefined {
  //   // Ensure bit has a questions array as the
  //   // ===
  //   // ===
  //   // must be included in the markup
  //   if (!bit.cardNode) {
  //     bit.cardNode = {};
  //   }

  //   if (!bit.cardNode.questions) {
  //     bit.cardNode.questions = [];
  //   }

  //   return bit;
  // }
}

const nodeValidator = new NodeValidator();

export { nodeValidator as NodeValidator };
