import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { TextAst } from '../model/ast/TextNodes';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { ResourceTag, ResourceTagType } from '../model/enum/ResourceTag';
import { ObjectUtils } from '../utils/ObjectUtils';
import { StringUtils } from '../utils/StringUtils';
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
  ImageResponsiveResourceJson,
  ResourceDataJson,
  ResourceJson,
  StillImageFilmEmbedResourceWrapperJson,
  StillImageFilmLinkResourceWrapperJson,
  StillImageFilmResourceJson,
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
   * Build and validate resource JSON object(s) from external resource JSON object(s)
   *
   * Note: a single input resource object can be converted to multiple resource objects
   * (e.g. stillImageFilm -> image + audio)
   *
   * @param bitType
   * @param resource
   * @returns
   */
  public resourceFromResourceJson(
    bitType: BitTypeType,
    resource?: Partial<ResourceJson> | Partial<ResourceJson>[],
  ): ResourceJson | ResourceJson[] | undefined {
    if (!resource) return undefined;

    const nodes: ResourceJson[] | undefined = [];

    // Convert single resource to array
    if (!Array.isArray(resource)) resource = [resource];

    for (const thisResource of resource) {
      // Validate we have a valid resource type
      let type = ResourceTag.fromValue(thisResource.type);
      if (!type) return undefined;

      // Get the resource key
      const resourceKey = ResourceTag.keyFromValue(type);
      if (!resourceKey) return undefined;

      // Override original type with type alias if present
      const __typeAlias = ResourceTag.fromValue(thisResource.__typeAlias);
      type = __typeAlias ?? type;

      let data: ResourceDataJson | undefined;

      // TODO: This code should use the config to handle the combo resources. For now the logic is hardcoded

      // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
      if (type === ResourceTag.imageResponsive) {
        const r = thisResource as unknown as ImageResponsiveResourceJson;
        const imagePortraitNode = this.resourceFromResourceDataJson(
          bitType,
          ResourceTag.imagePortrait,
          r.imagePortrait,
        );
        const imageLandscapeNode = this.resourceFromResourceDataJson(
          bitType,
          ResourceTag.imageLandscape,
          r.imageLandscape,
        );
        if (imagePortraitNode) nodes.push(imagePortraitNode);
        if (imageLandscapeNode) nodes.push(imageLandscapeNode);
      } else if (type === ResourceTag.stillImageFilm) {
        const r = thisResource as unknown as StillImageFilmResourceJson;
        const imageNode = this.resourceFromResourceDataJson(bitType, ResourceTag.image, r.image);
        const audioNode = this.resourceFromResourceDataJson(bitType, ResourceTag.audio, r.audio);
        if (imageNode) nodes.push(imageNode);
        if (audioNode) nodes.push(audioNode);
      } else {
        // Standard single resource case

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = (thisResource as any)[resourceKey];

        if (!data) return undefined;

        const node = this.resourceFromResourceDataJson(bitType, type, data);
        if (node) nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;
    if (nodes.length === 1) return nodes[0];
    return nodes;
  }

  public resourceFromResourceDataJson(
    bitType: BitTypeType,
    type: ResourceTagType,
    data: Partial<ResourceDataJson> | undefined,
  ): ResourceJson | undefined {
    if (!data) return undefined;
    type = ResourceTag.fromValue(type) as ResourceTagType;
    if (!type) return undefined;

    const dataAsString: string | undefined = StringUtils.isString(data) ? (data as unknown as string) : undefined;

    // url / src / href / app
    const url = data.url || data.src || data.body || dataAsString;

    // Sub resources
    const posterImage = data.posterImage
      ? (this.resourceFromResourceDataJson(bitType, ResourceTag.image, data.posterImage) as ImageResourceWrapperJson)
          ?.image
      : undefined;
    const thumbnails = data.thumbnails
      ? data.thumbnails.map((t) => {
          return (this.resourceFromResourceDataJson(bitType, ResourceTag.image, t) as ImageResourceWrapperJson)?.image;
        })
      : undefined;

    // Resource
    const node = this.resource(bitType, {
      type,

      // Generic (except Article / Document)
      value: url,

      // ImageLikeResource / AudioLikeResource / VideoLikeResource / Article / Document
      format: data.format,

      // ImageLikeResource
      src1x: data.src1x,
      src2x: data.src2x,
      src3x: data.src3x,
      src4x: data.src4x,
      caption: this.handleJsonText(data.caption),

      // ImageLikeResource / VideoLikeResource
      width: data.width ?? undefined,
      height: data.height ?? undefined,
      alt: data.alt,
      zoomDisabled: data.zoomDisabled,

      // VideoLikeResource
      duration: data.duration,
      mute: data.mute,
      autoplay: data.autoplay,
      allowSubtitles: data.allowSubtitles,
      showSubtitles: data.showSubtitles,
      posterImage,
      thumbnails,

      // WebsiteLinkResource
      siteName: undefined, //data.siteName,

      // Generic Resource
      license: data.license,
      copyright: data.copyright,
      showInIndex: data.showInIndex,
      search: data.search,
    });

    return node;
  }

  /**
   * Build resource node
   *
   * @param data - data for the node
   * @returns
   */
  /* private */ resource(
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
    __typeAlias?: ResourceTagType,
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
      __typeAlias: __typeAlias ?? ResourceTag.image,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.imageLink,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.audio,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.audioEmbed,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.audioLink,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.video,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.videoEmbed,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.videoLink,
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
        caption: this.handleJsonText(caption),
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
  //     __typeAlias: ResourceTag.stillImageFilm,
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
      __typeAlias: ResourceTag.stillImageFilmEmbed,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.stillImageFilmLink,
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
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.article,
      article: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        body: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.document,
      document: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.documentEmbed,
      documentEmbed: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.documentLink,
      documentLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.documentDownload,
      documentDownload: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.appLink,
      appLink: {
        // format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        // provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        provider: undefined as unknown as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
      __typeAlias: ResourceTag.websiteLink,
      websiteLink: {
        // provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        provider: undefined as unknown as string,
        url: value ?? '',
        // siteName,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(caption),
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
  //
  //

  //
  // Private
  //
}

export { ResourceBuilder };
