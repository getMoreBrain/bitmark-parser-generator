import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.aiGenerated, {
  astKey: 'aiGenerated',
  isSingle: true,
  isBoolean: true,
  // ignoreFalse: true,
});
