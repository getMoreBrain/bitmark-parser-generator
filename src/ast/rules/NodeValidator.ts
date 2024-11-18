import { Bit, CardBit } from '../../model/ast/Nodes';
import { ResourceTag } from '../../model/enum/ResourceTag';
import { StringUtils } from '../../utils/StringUtils';

import {
  AppLinkResourceWrapperJson,
  ArticleResourceWrapperJson,
  AudioEmbedResourceWrapperJson,
  AudioLinkResourceWrapperJson,
  AudioResourceWrapperJson,
  DocumentDownloadResourceWrapperJson,
  DocumentEmbedResourceWrapperJson,
  DocumentLinkResourceWrapperJson,
  DocumentResourceWrapperJson,
  ImageLinkResourceWrapperJson,
  ImageResourceWrapperJson,
  ResourceJson,
  StillImageFilmEmbedResourceWrapperJson,
  StillImageFilmLinkResourceWrapperJson,
  StillImageFilmResourceWrapperJson,
  VideoEmbedResourceWrapperJson,
  VideoLinkResourceWrapperJson,
  VideoResourceWrapperJson,
  WebsiteLinkResourceWrapperJson,
} from '../../model/json/ResourceJson';

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

    let ret: T | undefined = resource;
    let valid = false;

    switch (resource.type) {
      case ResourceTag.image:
        // case ResourceTag.imagePortrait:
        // case ResourceTag.imageLandscape:
        valid = !!(resource as ImageResourceWrapperJson).image.src;
        break;
      case ResourceTag.imageLink:
        valid = !!(resource as ImageLinkResourceWrapperJson).imageLink.url;
        break;
      case ResourceTag.audio:
        valid = !!(resource as AudioResourceWrapperJson).audio.src;
        break;
      case ResourceTag.audioEmbed:
        valid = !!(resource as AudioEmbedResourceWrapperJson).audioEmbed.src;
        break;
      case ResourceTag.audioLink:
        valid = !!(resource as AudioLinkResourceWrapperJson).audioLink.url;
        break;
      case ResourceTag.video:
        valid = !!(resource as VideoResourceWrapperJson).video.src;
        break;
      case ResourceTag.videoEmbed:
        valid = !!(resource as VideoEmbedResourceWrapperJson).videoEmbed.url;
        break;
      case ResourceTag.videoLink:
        valid = !!(resource as VideoLinkResourceWrapperJson).videoLink.url;
        break;
      case ResourceTag.stillImageFilm:
        valid =
          !!(resource as StillImageFilmResourceWrapperJson).image.src &&
          !!(resource as StillImageFilmResourceWrapperJson).audio.src;
        break;
      case ResourceTag.stillImageFilmEmbed:
        valid = !!(resource as StillImageFilmEmbedResourceWrapperJson).stillImageFilmEmbed.url;
        break;
      case ResourceTag.stillImageFilmLink:
        valid = !!(resource as StillImageFilmLinkResourceWrapperJson).stillImageFilmLink.url;
        break;
      case ResourceTag.article:
        valid = !!(resource as ArticleResourceWrapperJson).article.body;
        break;
      case ResourceTag.document:
        valid = !!(resource as DocumentResourceWrapperJson).document.url;
        break;
      case ResourceTag.documentEmbed:
        valid = !!(resource as DocumentEmbedResourceWrapperJson).documentEmbed.url;
        break;
      case ResourceTag.documentLink:
        valid = !!(resource as DocumentLinkResourceWrapperJson).documentLink.url;
        break;
      case ResourceTag.documentDownload:
        valid = !!(resource as DocumentDownloadResourceWrapperJson).documentDownload.url;
        break;
      case ResourceTag.appLink:
        valid = !!(resource as AppLinkResourceWrapperJson).appLink.url;
        break;
      case ResourceTag.websiteLink:
        valid = !!(resource as WebsiteLinkResourceWrapperJson).websiteLink.url;
        break;

      default:
        valid = false;
    }

    // Note: even if resource is invalid, we still return it as it is used to set the resource attachment type
    // in the bit declaration, and if it is removed completely this cannot be done.
    if (!valid) {
      if (resource.type) {
        ret = {
          type: resource.type,
          // _typeAlias: resource.type,
        } as T;
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
    throw new Error(`${name} is required to be a string or a number or a boolean or null or undefined`);
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
