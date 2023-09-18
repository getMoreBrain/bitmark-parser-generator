import { PropertyConfigKey, PropertyKeyMetadata } from '../../model/config/PropertyConfigKey';

// Set metadata on the property keys to describe specific behaviour

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._width, {
  isSingle: true,
  isTrimmedString: true, // isNumber?
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._height, {
  isSingle: true,
  isTrimmedString: true, // isNumber?
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._license, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._copyright, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._caption, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._showInIndex, {
  isSingle: true,
  isBoolean: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._alt, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._src1x, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._src2x, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._src3x, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._src4x, {
  isSingle: true,
  isTrimmedString: true,
});

// duration - clashes with duration in the main bit (the code cannot really handle these clashes yet)
// PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.duration, {
//   isSingle: true,
//   isTrimmedString: true, // isNumber?
// });

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._mute, {
  isSingle: true,
  isBoolean: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._autoplay, {
  isSingle: true,
  isBoolean: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._allowSubtitles, {
  isSingle: true,
  isBoolean: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._showSubtitles, {
  isSingle: true,
  isBoolean: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._siteName, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyConfigKey.setMetadata<PropertyKeyMetadata>(PropertyConfigKey._posterImage, {
  isSingle: true,
  isTrimmedString: true,
});
