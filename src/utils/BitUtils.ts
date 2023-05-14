import { Resource } from '../model/ast/Nodes';
import { BitType } from '../model/enum/BitType';
import { ResourceType, ResourceTypeType } from '../model/enum/ResourceType';

class BitUtils {
  /**
   * Calculate the final resource type based on the bit type, resource type, and resource.
   *
   * @param bitType
   * @param resourceType
   * @param resource
   * @returns the resource type or undefined if none set
   */
  calculateResourceType(
    bitType: string,
    resourceType: string | undefined,
    resource: Resource | undefined,
  ): ResourceTypeType | undefined {
    if (resourceType) return ResourceType.fromValue(resourceType);
    if (resource) return resource.type;

    switch (bitType) {
      case BitType.image:
      case BitType.focusImage:
      case BitType.browserImage:
      case BitType.photo:
      case BitType.screenshot:
      case BitType.imageZoom:
        return ResourceType.image;

      case BitType.imageLink:
        return ResourceType.imageLink;

      case BitType.audio:
      case BitType.audioEmbed:
        return ResourceType.audio;

      case BitType.audioLink:
        return ResourceType.audioLink;

      case BitType.video:
      case BitType.videoEmbed:
      case BitType.videoPortrait:
      case BitType.videoLandscape:
        return ResourceType.video;

      case BitType.videoLink:
        return ResourceType.videoLink;

      case BitType.stillImageFilm:
      case BitType.stillImageFilmEmbed:
        return ResourceType.stillImageFilm;

      case BitType.stillImageFilmLink:
        return ResourceType.stillImageFilmLink;

      case BitType.document:
        return ResourceType.document;

      case BitType.documentLink:
        return ResourceType.documentLink;

      case BitType.documentDownload:
        return ResourceType.documentDownload;

      default:
      // Do nothing
    }

    return undefined;
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
