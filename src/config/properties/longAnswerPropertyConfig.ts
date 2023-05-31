import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.longAnswer, {
  isSingle: true,
  isInvertedBoolean: true,
  astKey: 'isShortAnswer',
  jsonKey: 'isShortAnswer',
});
