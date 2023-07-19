import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.caseSensitive, {
  isSingle: true,
  isBoolean: true,
  astKey: 'isCaseSensitive',
  jsonKey: 'isCaseSensitive',
});
