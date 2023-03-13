import { AstNodeType } from '../../AstNodeType';
import { AstNode } from '../../Ast';
import { AudioResource } from '../../types/AudioResource';
import { BaseValueNode } from '../BaseLeafNode';

class AudioResourceNode extends BaseValueNode<AudioResource> implements AstNode {
  type = AstNodeType.audioResource;

  static create(audio: AudioResource): AudioResourceNode {
    return new AudioResourceNode(audio);
  }

  protected constructor(audio: AudioResource) {
    super(audio);
  }
}

export { AudioResourceNode };
