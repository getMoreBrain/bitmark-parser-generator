import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

// Set metadata on the bit types to describe specific behaviour
RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType._error, {
  tags: {},
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
