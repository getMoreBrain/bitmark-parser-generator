import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { TextAst } from '../model/ast/TextNodes';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { ResourceTag, ResourceTagType } from '../model/enum/ResourceTag';
import { ObjectUtils } from '../utils/ObjectUtils';
import { UrlUtils } from '../utils/UrlUtils';

import { BaseBuilder } from './BaseBuilder';
import { NodeValidator } from './rules/NodeValidator';

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
  ImageResourceJson,
  ImageResourceWrapperJson,
  ResourceJson,
  StillImageFilmEmbedResourceWrapperJson,
  StillImageFilmLinkResourceWrapperJson,
  VideoEmbedResourceWrapperJson,
  VideoLinkResourceWrapperJson,
  VideoResourceWrapperJson,
  WebsiteLinkResourceWrapperJson,
} from '../model/json/ResourceJson';

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
    bitType: BitTypeType,
    data: {
      type: ResourceTagType;

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
      width?: string;
      height?: string;
      alt?: string;
      zoomDisabled?: boolean;

      // VideoLikeResource
      duration?: number; // string?
      mute?: boolean;
      autoplay?: boolean;
      allowSubtitles?: boolean;
      showSubtitles?: boolean;
      posterImage?: ImageResourceJson;
      thumbnails?: ImageResourceJson[];

      // WebsiteLinkResource
      siteName?: string;

      // Generic Resource
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
    //
  ): ResourceJson | undefined {
    let node: ResourceJson | undefined;

    const { type, value: valueIn, format: formatIn, ...rest } = data;
    const finalData = {
      type,
      value: valueIn ?? Breakscape.EMPTY_STRING,
      format: formatIn ?? Breakscape.EMPTY_STRING,
      ...rest,
    };

    // Special case for video like tags - build thumbnails from the srcXx properties
    switch (type) {
      case ResourceTag.video:
      case ResourceTag.videoEmbed:
      case ResourceTag.videoLink:
      case ResourceTag.stillImageFilmEmbed:
      case ResourceTag.stillImageFilmLink: {
        const thumbnailKeys = ['src1x', 'src2x', 'src3x', 'src4x'];
        const thumbnails: ImageResourceJson[] = [];
        for (const k of thumbnailKeys) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dataAsAny = data as any;
          const value = dataAsAny[k];
          if (value) {
            const image: ImageResourceWrapperJson = this.resource(bitType, {
              type: ResourceTag.image,
              value,
            }) as ImageResourceWrapperJson;
            if (image) thumbnails.push(image.image as ImageResourceJson);
          }
        }
        // Merge with existing thumbnails
        finalData.thumbnails = [...(finalData.thumbnails ?? []), ...thumbnails];
      }
    }

    switch (type) {
      case ResourceTag.image:
      case ResourceTag.imagePortrait:
      case ResourceTag.imageLandscape:
        node = this.imageResource(bitType, finalData, type);
        break;

      // case ResourceTag.imageResponsive: {
      //   node = this.imageResponsiveResource({
      //     imagePortrait: this.imageResource(
      //       finalData.imagePortrait ?? {
      //         format: '',
      //         value: '',
      //       },
      //     ),
      //     imageLandscape: this.imageResource(
      //       finalData.imageLandscape ?? {
      //         format: '',
      //         value: '',
      //       },
      //     ),
      //   });
      //   break;
      // }

      case ResourceTag.imageLink:
        node = this.imageLinkResource(finalData);
        break;

      case ResourceTag.audio:
        node = this.audioResource(finalData);
        break;

      case ResourceTag.audioEmbed:
        node = this.audioEmbedResource(finalData);
        break;

      case ResourceTag.audioLink:
        node = this.audioLinkResource(finalData);
        break;

      case ResourceTag.video:
        node = this.videoResource(finalData);
        break;

      case ResourceTag.videoEmbed:
        node = this.videoEmbedResource(finalData);
        break;

      case ResourceTag.videoLink:
        node = this.videoLinkResource(finalData);
        break;

      // case ResourceTag.stillImageFilm: {
      //   node = this.stillImageFilmResource({
      //     image: this.imageResource(
      //       finalData.image ?? {
      //         format: '',
      //         value: '',
      //       },
      //     ),
      //     audio: this.audioResource(
      //       finalData.audio ?? {
      //         format: '',
      //         value: '',
      //       },
      //     ),
      //   });
      //   break;
      // }

      case ResourceTag.stillImageFilmEmbed:
        node = this.stillImageFilmEmbedResource(finalData);
        break;

      case ResourceTag.stillImageFilmLink:
        node = this.stillImageFilmLinkResource(finalData);
        break;

      case ResourceTag.article:
        node = this.articleResource(finalData);
        break;

      case ResourceTag.document:
        node = this.documentResource(finalData);
        break;

      case ResourceTag.documentEmbed:
        node = this.documentEmbedResource(finalData);
        break;

      case ResourceTag.documentLink:
        node = this.documentLinkResource(finalData);
        break;

      case ResourceTag.documentDownload:
        node = this.documentDownloadResource(finalData);
        break;

      case ResourceTag.appLink:
        node = this.appLinkResource(finalData);
        break;

      case ResourceTag.websiteLink:
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
  imageResource(
    bitType: BitTypeType,
    data: {
      format: string;
      value: string; //src
      src1x?: string;
      src2x?: string;
      src3x?: string;
      src4x?: string;
      width?: string | null;
      height?: string | null;
      alt?: string;
      zoomDisabled?: boolean;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
    typeAlias?: ResourceTagType,
  ): ImageResourceWrapperJson | undefined {
    const {
      value,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      zoomDisabled,
      license,
      copyright,
      showInIndex,
      caption,
      search,
    } = data;

    let zoomDisabledDefault = false;

    if (
      Config.isOfBitType(bitType, [
        BitType.imageSeparator,
        BitType.pageBanner,
        BitType.imagesLogoGrave,
        BitType.prototypeImages,
      ])
    ) {
      zoomDisabledDefault = true;
    }

    // NOTE: Node order is important and is defined here
    const node: ImageResourceWrapperJson = {
      type: ResourceTag.image,
      _typeAlias: typeAlias ?? ResourceTag.image,
      image: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        src: value ?? '',
        src1x: (src1x ?? undefined) as string,
        src2x: (src2x ?? undefined) as string,
        src3x: (src3x ?? undefined) as string,
        src4x: (src4x ?? undefined) as string,
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        alt: alt ?? '',
        zoomDisabled: zoomDisabled ?? zoomDisabledDefault,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.image, {
      ignoreFalse: ['zoomDisabled', 'showInIndex'],
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['src', 'alt', 'license', 'copyright'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    width?: string;
    height?: string;
    alt?: string;
    zoomDisabled?: boolean;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: TextAst;
    search?: string;
  }): ImageLinkResourceWrapperJson | undefined {
    const {
      value,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      zoomDisabled,
      license,
      copyright,
      showInIndex,
      caption,
      search,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: ImageLinkResourceWrapperJson = {
      type: ResourceTag.imageLink,
      _typeAlias: ResourceTag.imageLink,
      imageLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        // src: value ?? '',
        url: value ?? '',
        src1x: (src1x ?? undefined) as string,
        src2x: (src2x ?? undefined) as string,
        src3x: (src3x ?? undefined) as string,
        src4x: (src4x ?? undefined) as string,
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        alt: alt ?? '',
        zoomDisabled: zoomDisabled ?? false, // TODO: Default depends on the bit(!)
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.imageLink, {
      ignoreFalse: ['zoomDisabled', 'showInIndex'],
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['url', 'alt', 'license', 'copyright'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): AudioResourceWrapperJson | undefined {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioResourceWrapperJson = {
      type: ResourceTag.audio,
      _typeAlias: ResourceTag.audio,
      audio: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        src: value ?? '',
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.audio, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['src', 'alt', 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): AudioEmbedResourceWrapperJson | undefined {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioEmbedResourceWrapperJson = {
      type: ResourceTag.audioEmbed,
      _typeAlias: ResourceTag.audioEmbed,
      audioEmbed: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        src: value ?? '',
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.audioEmbed, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['src', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): AudioLinkResourceWrapperJson | undefined {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioLinkResourceWrapperJson = {
      type: ResourceTag.audioLink,
      _typeAlias: ResourceTag.audioLink,
      audioLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        // src: value ?? '',
        url: value ?? '',
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.audioLink, {
      // ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url' /*'alt', 'license', 'copyright'*/],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    width?: string;
    height?: string;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResourceJson;
    thumbnails?: ImageResourceJson[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: TextAst;
    search?: string;
  }): VideoResourceWrapperJson | undefined {
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
      search,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoResourceWrapperJson = {
      type: ResourceTag.video,
      _typeAlias: ResourceTag.video,
      video: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        src: value ?? '',
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        allowSubtitles: (allowSubtitles ?? undefined) as boolean,
        showSubtitles: (showSubtitles ?? undefined) as boolean,
        alt: alt ?? '',
        posterImage: (posterImage ?? undefined) as ImageResourceJson,
        thumbnails: (thumbnails ?? undefined) as ImageResourceJson[],
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.video, {
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['src', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    width?: string;
    height?: string;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResourceJson;
    thumbnails?: ImageResourceJson[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: TextAst;
    search?: string;
  }): VideoEmbedResourceWrapperJson | undefined {
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
      search,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoEmbedResourceWrapperJson = {
      type: ResourceTag.videoEmbed,
      _typeAlias: ResourceTag.videoEmbed,
      videoEmbed: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        // src: value ?? '',
        url: value ?? '',
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        allowSubtitles: (allowSubtitles ?? undefined) as boolean,
        showSubtitles: (showSubtitles ?? undefined) as boolean,
        alt: alt ?? '',
        posterImage: (posterImage ?? undefined) as ImageResourceJson,
        thumbnails: (thumbnails ?? undefined) as ImageResourceJson[],
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.videoEmbed, {
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['url', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    width?: string;
    height?: string;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResourceJson;
    thumbnails?: ImageResourceJson[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: TextAst;
    search?: string;
  }): VideoLinkResourceWrapperJson | undefined {
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
      search,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoLinkResourceWrapperJson = {
      type: ResourceTag.videoLink,
      _typeAlias: ResourceTag.videoLink,
      videoLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        // src: value ?? '',
        url: value ?? '',
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        allowSubtitles: (allowSubtitles ?? undefined) as boolean,
        showSubtitles: (showSubtitles ?? undefined) as boolean,
        alt: alt ?? '',
        posterImage: (posterImage ?? undefined) as ImageResourceJson,
        thumbnails: (thumbnails ?? undefined) as ImageResourceJson[],
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.videoLink, {
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['url', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  // /**
  //  * Build stillImageFilmResource node
  //  *
  //  * @param data - data for the node
  //  * @returns
  //  */
  // stillImageFilmResource(data: { image?: ImageResource; audio?: AudioResource }): StillImageFilmResource {
  //   const { image, audio } = data;

  //   // NOTE: Node order is important and is defined here
  //   const node: StillImageFilmResource = {
  //     type: ResourceTag.stillImageFilm,
  //     typeAlias: ResourceTag.stillImageFilm,
  //     image: image ?? this.imageResource({ format: '', value: '' }),
  //     audio: audio ?? this.audioResource({ format: '', value: '' }),
  //   };

  //   // Remove Unset Optionals
  //   ObjectUtils.removeUnwantedProperties(node);

  //   // Validate and correct invalid bits as much as possible
  //   return NodeValidator.validateResource(node) ;
  // }

  /**
   * Build stillImageFilmEmbedResource node
   *
   * @param data - data for the node
   * @returns
   */
  stillImageFilmEmbedResource(data: {
    format: string;
    value: string; // src
    width?: string;
    height?: string;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResourceJson;
    thumbnails?: ImageResourceJson[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: TextAst;
    search?: string;
  }): StillImageFilmEmbedResourceWrapperJson | undefined {
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
      search,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: StillImageFilmEmbedResourceWrapperJson = {
      type: ResourceTag.stillImageFilmEmbed,
      _typeAlias: ResourceTag.stillImageFilmEmbed,
      stillImageFilmEmbed: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        // src: value ?? '',
        url: value ?? '',
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        allowSubtitles: (allowSubtitles ?? undefined) as boolean,
        showSubtitles: (showSubtitles ?? undefined) as boolean,
        alt: alt ?? '',
        posterImage: (posterImage ?? undefined) as ImageResourceJson,
        thumbnails: (thumbnails ?? undefined) as ImageResourceJson[],
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.stillImageFilmEmbed, {
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['url', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    width?: string;
    height?: string;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResourceJson;
    thumbnails?: ImageResourceJson[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: TextAst;
    search?: string;
  }): StillImageFilmLinkResourceWrapperJson | undefined {
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
      search,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: StillImageFilmLinkResourceWrapperJson = {
      type: ResourceTag.stillImageFilmLink,
      _typeAlias: ResourceTag.stillImageFilmLink,
      stillImageFilmLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        // src: value ?? '',
        url: value ?? '',
        width: (width ?? null) as string,
        height: (height ?? null) as string,
        duration: (duration ?? undefined) as number,
        mute: (mute ?? undefined) as boolean,
        autoplay: (autoplay ?? undefined) as boolean,
        allowSubtitles: (allowSubtitles ?? undefined) as boolean,
        showSubtitles: (showSubtitles ?? undefined) as boolean,
        alt: alt ?? '',
        posterImage: (posterImage ?? undefined) as ImageResourceJson,
        thumbnails: (thumbnails ?? undefined) as ImageResourceJson[],
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.stillImageFilmLink, {
      ignoreEmptyArrays: ['caption'],
      ignoreUndefined: ['width', 'height'],
      ignoreEmptyString: ['url', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): ArticleResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: ArticleResourceWrapperJson = {
      type: ResourceTag.article,
      _typeAlias: ResourceTag.article,
      article: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        body: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.article, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['body', 'alt', 'license', 'copyright'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): DocumentResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentResourceWrapperJson = {
      type: ResourceTag.document,
      _typeAlias: ResourceTag.document,
      document: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.document, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url', 'alt', 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): DocumentEmbedResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentEmbedResourceWrapperJson = {
      type: ResourceTag.documentEmbed,
      _typeAlias: ResourceTag.documentEmbed,
      documentEmbed: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.documentEmbed, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url', 'alt', 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): DocumentLinkResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentLinkResourceWrapperJson = {
      type: ResourceTag.documentLink,
      _typeAlias: ResourceTag.documentLink,
      documentLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.documentLink, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url', 'alt', 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): DocumentDownloadResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentDownloadResourceWrapperJson = {
      type: ResourceTag.documentDownload,
      _typeAlias: ResourceTag.documentDownload,
      documentDownload: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.documentDownload, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url', 'alt', 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): AppLinkResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: AppLinkResourceWrapperJson = {
      type: ResourceTag.appLink,
      _typeAlias: ResourceTag.appLink,
      appLink: {
        // format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        // provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        provider: undefined as unknown as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.appLink, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url', /*'alt',*/ 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
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
    caption?: TextAst;
    search?: string;
  }): WebsiteLinkResourceWrapperJson | undefined {
    const { value, /*siteName,*/ license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: WebsiteLinkResourceWrapperJson = {
      type: ResourceTag.websiteLink,
      _typeAlias: ResourceTag.websiteLink,
      websiteLink: {
        // provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        provider: undefined as unknown as string,
        url: value ?? '',
        // siteName,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: (caption ?? []) as TextAst,
        search: (search ?? undefined) as string,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node.websiteLink, {
      ignoreEmptyArrays: ['caption'],
      ignoreEmptyString: ['url', 'alt', 'license', 'copyright'],
      ignoreFalse: ['showInIndex'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  //
  // Private
  //
}

export { ResourceBuilder };
