import { PropertyConfigKey, PropertyKeyMetadata } from '../../model/config/PropertyConfigKey';

// Set metadata on the property keys to describe specific behaviour

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._longAnswer, {
  isSingle: true,
  isInvertedBoolean: true,
  astKey: 'isShortAnswer',
  jsonKey: 'isShortAnswer',
});
