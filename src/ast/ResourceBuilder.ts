import { ResourceTypeType, ResourceType } from '../model/enum/ResourceType';
import { ObjectUtils } from '../utils/ObjectUtils';
import { UrlUtils } from '../utils/UrlUtils';

import { BaseBuilder } from './BaseBuilder';
import { NodeValidator } from './rules/NodeValidator';

import {
  Resource,
  AudioResource,
  ImageResource,
  ImageLinkResource,
  AudioLinkResource,
  VideoResource,
  VideoLinkResource,
  StillImageFilmResource,
  StillImageFilmLinkResource,
  ArticleResource,
  DocumentResource,
  DocumentLinkResource,
  AppLinkResource,
  WebsiteLinkResource,
  DocumentDownloadResource,
  DocumentEmbedResource,
  AudioEmbedResource,
  VideoEmbedResource,
  StillImageFilmEmbedResource,
} from '../model/ast/Nodes';

/**
 * Builder to build bitmark Resource AST nodes programmatically
 */
class ResourceBuilder extends BaseBuilder {
  /**
   * Build resource node
   *
   * @param data - data for the node
   * @returns
   */
  resource(
    data: {
      type: ResourceTypeType;

      // Generic part (value of bit tag)
      value?: string; // url / src / href / app / body

      // ImageLikeResource / AudioLikeResource / VideoLikeResource / Article / Document
      format?: string;

      // ImageLikeResource
      src1x?: string;
      src2x?: string;
      src3x?: string;
      src4x?: string;

      // ImageLikeResource / VideoLikeResource
      width?: number;
      height?: number;
      alt?: string;

      // VideoLikeResource
      duration?: number; // string?
      mute?: boolean;
      autoplay?: boolean;
      allowSubtitles?: boolean;
      showSubtitles?: boolean;
      posterImage?: ImageResource;
      thumbnails?: ImageResource[];

      // WebsiteLinkResource
      siteName?: string;

      // StillImageFilmLikeResource
      image?: {
        format: string;
        value: string; //src
        src1x?: string;
        src2x?: string;
        src3x?: string;
        src4x?: string;
        width?: number;
        height?: number;
        alt?: string;
        license?: string;
        copyright?: string;
        showInIndex?: boolean;
        caption?: string;
      };
      audio?: {
        format: string;
        value: string; // src
        license?: string;
        copyright?: string;
        showInIndex?: boolean;
        caption?: string;
      };

      // Generic Resource
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: string;
    },
    //
  ): Resource | undefined {
    let node: Resource | undefined;

    const { type, value: valueIn, format: formatIn, ...rest } = data;
    const finalData = {
      type,
      value: valueIn ?? '',
      format: formatIn ?? '',
      ...rest,
    };

    // Special case for video like tags - build thumbnails from the srcXx properties
    switch (type) {
      case ResourceType.video:
      case ResourceType.videoEmbed:
      case ResourceType.videoLink:
      case ResourceType.stillImageFilmEmbed:
      case ResourceType.stillImageFilmLink: {
        const thumbnailKeys = ['src1x', 'src2x', 'src3x', 'src4x'];
        const thumbnails: ImageResource[] = [];
        for (const k of thumbnailKeys) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dataAsAny = data as any;
          const value = dataAsAny[k];
          if (value) {
            const image = this.resource({
              type: ResourceType.image,
              value,
            });
            if (image) thumbnails.push(image as ImageResource);
          }
        }
        // Merge with existing thumbnails
        finalData.thumbnails = [...(finalData.thumbnails ?? []), ...thumbnails];
      }
    }

    switch (type) {
      case ResourceType.image:
        node = this.imageResource(finalData);
        break;

      case ResourceType.imageLink:
        node = this.imageLinkResource(finalData);
        break;

      case ResourceType.audio:
        node = this.audioResource(finalData);
        break;

      case ResourceType.audioEmbed:
        node = this.audioEmbedResource(finalData);
        break;

      case ResourceType.audioLink:
        node = this.audioLinkResource(finalData);
        break;

      case ResourceType.video:
        node = this.videoResource(finalData);
        break;

      case ResourceType.videoEmbed:
        node = this.videoEmbedResource(finalData);
        break;

      case ResourceType.videoLink:
        node = this.videoLinkResource(finalData);
        break;

      case ResourceType.stillImageFilm: {
        node = this.stillImageFilmResource({
          image: this.imageResource(
            finalData.image ?? {
              format: '',
              value: '',
            },
          ),
          audio: this.audioResource(
            finalData.audio ?? {
              format: '',
              value: '',
            },
          ),
        });
        break;
      }

      case ResourceType.stillImageFilmEmbed:
        node = this.stillImageFilmEmbedResource(finalData);
        break;

      case ResourceType.stillImageFilmLink:
        node = this.stillImageFilmLinkResource(finalData);
        break;

      case ResourceType.article:
        node = this.articleResource(finalData);
        break;

      case ResourceType.document:
        node = this.documentResource(finalData);
        break;

      case ResourceType.documentEmbed:
        node = this.documentEmbedResource(finalData);
        break;

      case ResourceType.documentLink:
        node = this.documentLinkResource(finalData);
        break;

      case ResourceType.documentDownload:
        node = this.documentDownloadResource(finalData);
        break;

      case ResourceType.appLink:
        node = this.appLinkResource(finalData);
        break;

      case ResourceType.websiteLink:
        node = this.websiteLinkResource(finalData);
        break;

      default:
    }

    return node;
  }

  /**
   * Build imageResource node
   *
   * @param data - data for the node
   * @returns
   */
  imageResource(data: {
    format: string;
    value: string; //src
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageResource {
    const { value, src1x, src2x, src3x, src4x, width, height, alt, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: ImageResource = {
      type: ResourceType.image,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as ImageResource;
  }

  /**
   * Build imageLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  imageLinkResource(data: {
    format: string;
    value: string;
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageLinkResource {
    const { value, src1x, src2x, src3x, src4x, width, height, alt, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: ImageLinkResource = {
      type: ResourceType.imageLink,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as ImageLinkResource;
  }

  /**
   * Build audioResource node
   *
   * @param data - data for the node
   * @returns
   */
  audioResource(data: {
    format: string;
    value: string; // src
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioResource {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioResource = {
      type: ResourceType.audio,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      duration,
      mute,
      autoplay,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as AudioResource;
  }

  /**
   * Build audioEmbedResource node
   *
   * @param data - data for the node
   * @returns
   */
  audioEmbedResource(data: {
    format: string;
    value: string; // src
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioEmbedResource {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioEmbedResource = {
      type: ResourceType.audioEmbed,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      duration,
      mute,
      autoplay,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as AudioEmbedResource;
  }

  /**
   * Build audioLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  audioLinkResource(data: {
    format: string;
    value: string;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioLinkResource {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioLinkResource = {
      type: ResourceType.audioLink,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      duration,
      mute,
      autoplay,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as AudioLinkResource;
  }

  /**
   * Build videoResource node
   *
   * @param data - data for the node
   * @returns
   */
  videoResource(data: {
    format: string;
    value: string; // src
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoResource {
    const {
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoResource = {
      type: ResourceType.video,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as VideoResource;
  }

  /**
   * Build videoEmbedResource node
   *
   * @param data - data for the node
   * @returns
   */
  videoEmbedResource(data: {
    format: string;
    value: string; // src
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoEmbedResource {
    const {
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoEmbedResource = {
      type: ResourceType.videoEmbed,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as VideoEmbedResource;
  }

  /**
   * Build videoLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  videoLinkResource(data: {
    format: string;
    value: string;
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoLinkResource {
    const {
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoLinkResource = {
      type: ResourceType.videoLink,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as VideoLinkResource;
  }

  /**
   * Build stillImageFilmResource node
   *
   * @param data - data for the node
   * @returns
   */
  stillImageFilmResource(data: { image?: ImageResource; audio?: AudioResource }): StillImageFilmResource {
    const { image, audio } = data;

    // NOTE: Node order is important and is defined here
    const node: StillImageFilmResource = {
      type: ResourceType.stillImageFilm,
      image: image ?? this.imageResource({ format: '', value: '' }),
      audio: audio ?? this.audioResource({ format: '', value: '' }),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as StillImageFilmResource;
  }

  /**
   * Build stillImageFilmEmbedResource node
   *
   * @param data - data for the node
   * @returns
   */
  stillImageFilmEmbedResource(data: {
    format: string;
    value: string; // src
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): StillImageFilmEmbedResource {
    const {
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: StillImageFilmEmbedResource = {
      type: ResourceType.stillImageFilmEmbed,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as StillImageFilmEmbedResource;
  }

  /**
   * Build stillImageFilmLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  stillImageFilmLinkResource(data: {
    format: string;
    value: string;
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): StillImageFilmLinkResource {
    const {
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: StillImageFilmLinkResource = {
      type: ResourceType.stillImageFilmLink,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as StillImageFilmLinkResource;
  }

  /**
   * Build articleResource node
   *
   * @param data - data for the node
   * @returns
   */
  articleResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ArticleResource {
    const { value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: ArticleResource = {
      type: ResourceType.article,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as ArticleResource;
  }

  /**
   * Build documentResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentResource {
    const { value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentResource = {
      type: ResourceType.document,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as DocumentResource;
  }

  /**
   * Build documentEmbedResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentEmbedResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentEmbedResource {
    const { value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentEmbedResource = {
      type: ResourceType.documentEmbed,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as DocumentEmbedResource;
  }

  /**
   * Build documentLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentLinkResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentLinkResource {
    const { value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentLinkResource = {
      type: ResourceType.documentLink,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as DocumentLinkResource;
  }

  /**
   * Build documentDownloadResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentDownloadResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentDownloadResource {
    const { value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentDownloadResource = {
      type: ResourceType.documentDownload,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as DocumentDownloadResource;
  }

  /**
   * Build appLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  appLinkResource(data: {
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppLinkResource {
    const { value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AppLinkResource = {
      type: ResourceType.appLink,
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node) as AppLinkResource;
  }

  /**
   * Build websiteLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  websiteLinkResource(data: {
    value: string;
    siteName?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): WebsiteLinkResource | undefined {
    const { value, siteName, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: WebsiteLinkResource = {
      type: ResourceType.websiteLink,
      value,
      siteName,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  //
  // Private
  //
}

export { ResourceBuilder };
