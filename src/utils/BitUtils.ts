import { Resource } from '../model/ast/Nodes';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { ResourceType, ResourceTypeType } from '../model/enum/ResourceType';

class BitUtils {
  /**
   * Calculate the valid bit resource types based on the bit type, resource type, and resource.
   *
   * @param bitType if set, and no resourceType or resource is set, it will be used to calculate the valid resource
   * @param resourceType if set, it will be used as the valid resource type
   * @param resource if set, and resource type is not set, the resource type will be extracted from the resource
   * @returns the resource types as an array, or an empty array if none set
   */
  calculateValidResourceTypes(
    bitType: BitTypeType | undefined,
    resourceType: string | undefined,
    resource: Resource | undefined,
  ): ResourceTypeType[] {
    let singleResourceType: ResourceTypeType | undefined;
    let arrayResourceTypes: ResourceTypeType[] = [];

    if (resourceType) {
      singleResourceType = ResourceType.fromValue(resourceType);
    }
    if (!singleResourceType && resource) {
      singleResourceType = resource.type;
    }

    if (!singleResourceType) {
      switch (bitType) {
        case BitType.image:
        case BitType.focusImage:
        case BitType.browserImage:
        case BitType.photo:
        case BitType.screenshot:
        case BitType.imageZoom:
          singleResourceType = ResourceType.image;
          break;

        case BitType.imageLink:
          singleResourceType = ResourceType.imageLink;
          break;

        case BitType.audio:
        case BitType.audioEmbed:
          singleResourceType = ResourceType.audio;
          break;

        case BitType.audioLink:
          singleResourceType = ResourceType.audioLink;
          break;

        case BitType.video:
        case BitType.videoEmbed:
        case BitType.videoPortrait:
        case BitType.videoLandscape:
          singleResourceType = ResourceType.video;
          break;

        case BitType.videoLink:
          singleResourceType = ResourceType.videoLink;
          break;

        case BitType.stillImageFilm:
        case BitType.stillImageFilmEmbed:
          arrayResourceTypes = [ResourceType.image, ResourceType.audio];
          break;

        case BitType.stillImageFilmLink:
          singleResourceType = ResourceType.stillImageFilmLink;
          break;

        case BitType.document:
          singleResourceType = ResourceType.document;
          break;

        case BitType.documentLink:
          singleResourceType = ResourceType.documentLink;
          break;

        case BitType.documentDownload:
          singleResourceType = ResourceType.documentDownload;
          break;

        case BitType.websiteLink:
          singleResourceType = ResourceType.websiteLink;
          break;

        case BitType.conversationLeft1:
        case BitType.conversationLeft1Scream:
        case BitType.conversationLeft1Thought:
        case BitType.conversationRight1:
        case BitType.conversationRight1Scream:
        case BitType.conversationRight1Thought:
          singleResourceType = ResourceType.image;
          break;

        default:
        // Do nothing
      }
    }

    if (singleResourceType) return [singleResourceType];

    return arrayResourceTypes;
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
