import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { VideoResource } from '../../types/resources/VideoResource';
import { BaseValueNode } from '../BaseLeafNode';

class VideoResourceNode extends BaseValueNode<VideoResource> implements AstNode {
  type = AstNodeType.videoResource;

  constructor(video: VideoResource) {
    super(video);
  }
}

export { VideoResourceNode };
