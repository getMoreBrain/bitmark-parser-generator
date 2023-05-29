import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

// Set metadata on the bit types to describe specific behaviour
BitType.setMetadata<BitTypeMetadata>(BitType._error, {
  tags: {},
  resourceAttachmentAllowed: false,
});
