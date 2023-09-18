import { PropertyConfigKey, PropertyKeyMetadata } from '../../model/config/PropertyConfigKey';

// Set metadata on the property keys to describe specific behaviour

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._progress, {
  isSingle: true,
  isBoolean: true, // ANTLR parser treats progress as a string (but it usually has value "false" or "true"!)
  ignoreTrue: true,
});
