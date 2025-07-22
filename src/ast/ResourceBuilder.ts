import { Breakscape } from '../breakscaping/Breakscape.ts';
import { Config } from '../config/Config.ts';
import { type TextAst } from '../model/ast/TextNodes.ts';
import { BitType } from '../model/enum/BitType.ts';
import {
  ResourceType,
  resourceTypeToConfigKey,
  type ResourceTypeType,
} from '../model/enum/ResourceType.ts';
import { TextLocation } from '../model/enum/TextLocation.ts';
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
  type ImageResourceJson,
  type ImageResourceWrapperJson,
  type ImageResponsiveResourceJson,
  type ResourceDataJson,
  type ResourceJson,
  type StillImageFilmEmbedResourceWrapperJson,
  type StillImageFilmLinkResourceWrapperJson,
  type StillImageFilmResourceJson,
  type VideoEmbedResourceWrapperJson,
  type VideoLinkResourceWrapperJson,
  type VideoResourceWrapperJson,
  type WebsiteLinkResourceWrapperJson,
} from '../model/json/ResourceJson.ts';
import { ObjectUtils } from '../utils/ObjectUtils.ts';
import { StringUtils } from '../utils/StringUtils.ts';
import { UrlUtils } from '../utils/UrlUtils.ts';
import { BaseBuilder, type BuildContext } from './BaseBuilder.ts';
import { NodeValidator } from './rules/NodeValidator.ts';

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
    context: BuildContext,
    resource?: Partial<ResourceJson> | Partial<ResourceJson>[],
  ): ResourceJson | ResourceJson[] | undefined {
    if (!resource) return undefined;

    const nodes: ResourceJson[] | undefined = [];

    // Convert single resource to array
    if (!Array.isArray(resource)) resource = [resource];

    for (const thisResource of resource) {
      // Validate we have a valid resource type
      let type = ResourceType.fromValue(thisResource.type);
      if (!type) return undefined;

      // Get the resource key
      const resourceKey = ResourceType.keyFromValue(type);
      if (!resourceKey) return undefined;

      // Override original type with type alias if present
      const __typeAlias = ResourceType.fromValue(thisResource.__typeAlias);
      type = __typeAlias ?? type;

      let data: ResourceDataJson | undefined;

      // TODO: This code should use the config to handle the combo resources. For now the logic is hardcoded

      // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
      if (type === ResourceType.imageResponsive) {
        const r = thisResource as unknown as ImageResponsiveResourceJson;
        const imagePortraitNode = this.resourceFromResourceDataJson(
          context,
          ResourceType.imagePortrait,
          r.imagePortrait,
        );
        const imageLandscapeNode = this.resourceFromResourceDataJson(
          context,
          ResourceType.imageLandscape,
          r.imageLandscape,
        );
        if (imagePortraitNode) nodes.push(imagePortraitNode);
        if (imageLandscapeNode) nodes.push(imageLandscapeNode);
      } else if (type === ResourceType.stillImageFilm) {
        const r = thisResource as unknown as StillImageFilmResourceJson;
        const imageNode = this.resourceFromResourceDataJson(context, ResourceType.image, r.image);
        const audioNode = this.resourceFromResourceDataJson(context, ResourceType.audio, r.audio);
        if (imageNode) nodes.push(imageNode);
        if (audioNode) nodes.push(audioNode);
      } else {
        // Standard single resource case

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = (thisResource as any)[resourceKey];

        if (!data) return undefined;

        const node = this.resourceFromResourceDataJson(context, type, data);
        if (node) nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;
    if (nodes.length === 1) return nodes[0];
    return nodes;
  }

  public resourceFromResourceDataJson(
    context: BuildContext,
    type: ResourceTypeType,
    data: Partial<ResourceDataJson> | undefined,
  ): ResourceJson | undefined {
    if (!data) return undefined;
    type = ResourceType.fromValue(type) as ResourceTypeType;
    if (!type) return undefined;

    const dataAsString: string | undefined = StringUtils.isString(data)
      ? (data as unknown as string)
      : undefined;

    // url / src / href / app
    const url = data.url || data.src || data.body || dataAsString;

    // Sub resources
    const posterImage = data.posterImage
      ? (
          this.resourceFromResourceDataJson(
            context,
            ResourceType.image,
            data.posterImage,
          ) as ImageResourceWrapperJson
        )?.image
      : undefined;
    const thumbnails = data.thumbnails
      ? data.thumbnails.map((t) => {
          return (
            this.resourceFromResourceDataJson(
              context,
              ResourceType.image,
              t,
            ) as ImageResourceWrapperJson
          )?.image;
        })
      : undefined;

    // Resource
    const node = this.resource(context, {
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
      caption: this.handleJsonText(context, TextLocation.tag, data.caption),

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
    context: BuildContext,
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
      case ResourceType.video:
      case ResourceType.videoEmbed:
      case ResourceType.videoLink:
      case ResourceType.stillImageFilmEmbed:
      case ResourceType.stillImageFilmLink: {
        const thumbnailKeys = ['src1x', 'src2x', 'src3x', 'src4x'];
        const thumbnails: ImageResourceJson[] = [];
        for (const k of thumbnailKeys) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dataAsAny = data as any;
          const value = dataAsAny[k];
          if (value) {
            const image: ImageResourceWrapperJson = this.resource(context, {
              type: ResourceType.image,
              value,
            }) as ImageResourceWrapperJson;
            if (image) thumbnails.push(image.image as ImageResourceJson);
          }
        }
        // Merge with existing thumbnails
        finalData.thumbnails = [...(finalData.thumbnails || []), ...thumbnails];
      }
    }

    switch (type) {
      case ResourceType.image:
      case ResourceType.imagePortrait:
      case ResourceType.imageLandscape:
      case ResourceType.backgroundWallpaper:
      case ResourceType.imagePlaceholder:
      case ResourceType.icon:
        node = this.imageResource(context, finalData, type);
        break;

      // case ResourceType.imageResponsive: {
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

      case ResourceType.imageLink:
        node = this.imageLinkResource(context, finalData);
        break;

      case ResourceType.audio:
        node = this.audioResource(context, finalData);
        break;

      case ResourceType.audioEmbed:
        node = this.audioEmbedResource(context, finalData);
        break;

      case ResourceType.audioLink:
        node = this.audioLinkResource(context, finalData);
        break;

      case ResourceType.video:
        node = this.videoResource(context, finalData);
        break;

      case ResourceType.videoEmbed:
        node = this.videoEmbedResource(context, finalData);
        break;

      case ResourceType.videoLink:
        node = this.videoLinkResource(context, finalData);
        break;

      // case ResourceType.stillImageFilm: {
      //   node = this.stillImageFilmResource({
      //     image: this.imageResource(context,
      //       finalData.image ?? {
      //         format: '',
      //         value: '',
      //       },
      //     ),
      //     audio: this.audioResource(context,
      //       finalData.audio ?? {
      //         format: '',
      //         value: '',
      //       },
      //     ),
      //   });
      //   break;
      // }

      case ResourceType.stillImageFilmEmbed:
        node = this.stillImageFilmEmbedResource(context, finalData);
        break;

      case ResourceType.stillImageFilmLink:
        node = this.stillImageFilmLinkResource(context, finalData);
        break;

      case ResourceType.article:
        node = this.articleResource(context, finalData);
        break;

      case ResourceType.document:
        node = this.documentResource(context, finalData);
        break;

      case ResourceType.documentEmbed:
        node = this.documentEmbedResource(context, finalData);
        break;

      case ResourceType.documentLink:
        node = this.documentLinkResource(context, finalData);
        break;

      case ResourceType.documentDownload:
        node = this.documentDownloadResource(context, finalData);
        break;

      case ResourceType.appLink:
        node = this.appLinkResource(context, finalData);
        break;

      case ResourceType.websiteLink:
        node = this.websiteLinkResource(context, finalData);
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
    context: BuildContext,
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
    __typeAlias?: ResourceTypeType,
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
    const { bitType } = context;
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
      type: ResourceType.image,
      __typeAlias: __typeAlias ?? ResourceType.image,
      __configKey: resourceTypeToConfigKey(__typeAlias ?? ResourceType.image),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  imageLinkResource(
    context: BuildContext,
    data: {
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
    },
  ): ImageLinkResourceWrapperJson | undefined {
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
      type: ResourceType.imageLink,
      __typeAlias: ResourceType.imageLink,
      __configKey: resourceTypeToConfigKey(ResourceType.imageLink),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  audioResource(
    context: BuildContext,
    data: {
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
    },
  ): AudioResourceWrapperJson | undefined {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption, search } =
      data;

    // NOTE: Node order is important and is defined here
    const node: AudioResourceWrapperJson = {
      type: ResourceType.audio,
      __typeAlias: ResourceType.audio,
      __configKey: resourceTypeToConfigKey(ResourceType.audio),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  audioEmbedResource(
    context: BuildContext,
    data: {
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
    },
  ): AudioEmbedResourceWrapperJson | undefined {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption, search } =
      data;

    // NOTE: Node order is important and is defined here
    const node: AudioEmbedResourceWrapperJson = {
      type: ResourceType.audioEmbed,
      __typeAlias: ResourceType.audioEmbed,
      __configKey: resourceTypeToConfigKey(ResourceType.audioEmbed),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  audioLinkResource(
    context: BuildContext,
    data: {
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
    },
  ): AudioLinkResourceWrapperJson | undefined {
    const { value, duration, mute, autoplay, license, copyright, showInIndex, caption, search } =
      data;

    // NOTE: Node order is important and is defined here
    const node: AudioLinkResourceWrapperJson = {
      type: ResourceType.audioLink,
      __typeAlias: ResourceType.audioLink,
      __configKey: resourceTypeToConfigKey(ResourceType.audioLink),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  videoResource(
    context: BuildContext,
    data: {
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
    },
  ): VideoResourceWrapperJson | undefined {
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
      type: ResourceType.video,
      __typeAlias: ResourceType.video,
      __configKey: resourceTypeToConfigKey(ResourceType.video),
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
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
        search: (search ?? undefined) as string,
        // Have sub-chains so must be at end of chain
        posterImage: (posterImage ?? undefined) as ImageResourceJson,
        thumbnails: (thumbnails ?? undefined) as ImageResourceJson[],
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
  videoEmbedResource(
    context: BuildContext,
    data: {
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
    },
  ): VideoEmbedResourceWrapperJson | undefined {
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
      type: ResourceType.videoEmbed,
      __typeAlias: ResourceType.videoEmbed,
      __configKey: resourceTypeToConfigKey(ResourceType.videoEmbed),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  videoLinkResource(
    context: BuildContext,
    data: {
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
    },
  ): VideoLinkResourceWrapperJson | undefined {
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
      type: ResourceType.videoLink,
      __typeAlias: ResourceType.videoLink,
      __configKey: resourceTypeToConfigKey(ResourceType.videoLink),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  // stillImageFilmResource(context: BuildContext, data: { image?: ImageResource; audio?: AudioResource }): StillImageFilmResource {
  //   const { image, audio } = data;

  //   // NOTE: Node order is important and is defined here
  //   const node: StillImageFilmResource = {
  //     type: ResourceType.stillImageFilm,
  //     __typeAlias: ResourceType.stillImageFilm,
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
  stillImageFilmEmbedResource(
    context: BuildContext,
    data: {
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
    },
  ): StillImageFilmEmbedResourceWrapperJson | undefined {
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
      type: ResourceType.stillImageFilmEmbed,
      __typeAlias: ResourceType.stillImageFilmEmbed,
      __configKey: resourceTypeToConfigKey(ResourceType.stillImageFilmEmbed),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  stillImageFilmLinkResource(
    context: BuildContext,
    data: {
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
    },
  ): StillImageFilmLinkResourceWrapperJson | undefined {
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
      type: ResourceType.stillImageFilmLink,
      __typeAlias: ResourceType.stillImageFilmLink,
      __configKey: resourceTypeToConfigKey(ResourceType.stillImageFilmLink),
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
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  articleResource(
    context: BuildContext,
    data: {
      format: string;
      value: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): ArticleResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: ArticleResourceWrapperJson = {
      type: ResourceType.article,
      __typeAlias: ResourceType.article,
      __configKey: resourceTypeToConfigKey(ResourceType.article),
      article: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        body: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  documentResource(
    context: BuildContext,
    data: {
      format: string;
      value: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): DocumentResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentResourceWrapperJson = {
      type: ResourceType.document,
      __typeAlias: ResourceType.document,
      __configKey: resourceTypeToConfigKey(ResourceType.document),
      document: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  documentEmbedResource(
    context: BuildContext,
    data: {
      format: string;
      value: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): DocumentEmbedResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentEmbedResourceWrapperJson = {
      type: ResourceType.documentEmbed,
      __typeAlias: ResourceType.documentEmbed,
      __configKey: resourceTypeToConfigKey(ResourceType.documentEmbed),
      documentEmbed: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  documentLinkResource(
    context: BuildContext,
    data: {
      format: string;
      value: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): DocumentLinkResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentLinkResourceWrapperJson = {
      type: ResourceType.documentLink,
      __typeAlias: ResourceType.documentLink,
      __configKey: resourceTypeToConfigKey(ResourceType.documentLink),
      documentLink: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  documentDownloadResource(
    context: BuildContext,
    data: {
      format: string;
      value: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): DocumentDownloadResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: DocumentDownloadResourceWrapperJson = {
      type: ResourceType.documentDownload,
      __typeAlias: ResourceType.documentDownload,
      __configKey: resourceTypeToConfigKey(ResourceType.documentDownload),
      documentDownload: {
        format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  appLinkResource(
    context: BuildContext,
    data: {
      value: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): AppLinkResourceWrapperJson | undefined {
    const { value, license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: AppLinkResourceWrapperJson = {
      type: ResourceType.appLink,
      __typeAlias: ResourceType.appLink,
      __configKey: resourceTypeToConfigKey(ResourceType.appLink),
      appLink: {
        // format: (UrlUtils.fileExtensionFromUrl(value) ?? undefined) as string,
        // provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        provider: undefined as unknown as string,
        url: value ?? '',
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
  websiteLinkResource(
    context: BuildContext,
    data: {
      value: string;
      siteName?: string;
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: TextAst;
      search?: string;
    },
  ): WebsiteLinkResourceWrapperJson | undefined {
    const { value, /*siteName,*/ license, copyright, showInIndex, caption, search } = data;

    // NOTE: Node order is important and is defined here
    const node: WebsiteLinkResourceWrapperJson = {
      type: ResourceType.websiteLink,
      __typeAlias: ResourceType.websiteLink,
      __configKey: resourceTypeToConfigKey(ResourceType.websiteLink),
      websiteLink: {
        // provider: (UrlUtils.domainFromUrl(value) ?? undefined) as string,
        provider: undefined as unknown as string,
        url: value ?? '',
        // siteName,
        license: license ?? '',
        copyright: copyright ?? '',
        showInIndex: showInIndex ?? false,
        caption: this.handleJsonText(context, TextLocation.tag, caption),
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
