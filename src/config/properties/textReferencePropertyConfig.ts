import { PropertyConfigKey, PropertyKeyMetadata } from '../../model/config/PropertyConfigKey';

// Set metadata on the property keys to describe specific behaviour

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._textReference, {
  isSingle: true,
  isTrimmedString: true,
});
