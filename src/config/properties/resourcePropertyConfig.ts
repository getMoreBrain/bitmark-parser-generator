import { PropertyKey, PropertyKeyMetadata } from '../../model/enum/PropertyKey';

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.width, {
  isSingle: true,
  isTrimmedString: true, // isNumber?
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.height, {
  isSingle: true,
  isTrimmedString: true, // isNumber?
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.license, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.copyright, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.caption, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.showInIndex, {
  isSingle: true,
  isBoolean: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.alt, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.src1x, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.src2x, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.src3x, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.src4x, {
  isSingle: true,
  isTrimmedString: true,
});

// duration - clashes with duration in the main bit (the code cannot really handle these clashes yet)
// PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.duration, {
//   isSingle: true,
//   isTrimmedString: true, // isNumber?
// });

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.mute, {
  isSingle: true,
  isBoolean: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.autoplay, {
  isSingle: true,
  isBoolean: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.allowSubtitles, {
  isSingle: true,
  isBoolean: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.showSubtitles, {
  isSingle: true,
  isBoolean: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.siteName, {
  isSingle: true,
  isTrimmedString: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.posterImage, {
  isSingle: true,
  isTrimmedString: true,
});
