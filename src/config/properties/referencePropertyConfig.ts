import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.reference, {
  isSingle: false,
  isTrimmedString: true,
  astKey: 'referenceProperty',
});