import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.progress, {
  isSingle: true,
  isBoolean: true, // ANTLR parser treats progress as a string (but it usually has value "false" or "true"!)
  ignoreTrue: true,
});
