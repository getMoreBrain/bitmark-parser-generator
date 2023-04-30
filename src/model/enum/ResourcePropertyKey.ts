import { EnumType, superenum } from '@ncoderz/superenum';

const ResourcePropertyKey = superenum({
  license: 'license', // string
  copyright: 'copyright', // string
  provider: 'provider', // string
  showInIndex: 'showInIndex', // boolean
  caption: 'caption', // string
  src1x: 'src1x', // string
  src2x: 'src2x', // string
  src3x: 'src3x', // string
  src4x: 'src4x', // string
  width: 'width', // number / null
  height: 'height', // number / null
  alt: 'alt', // string
  duration: 'duration', // string
  mute: 'mute', // boolean
  autoplay: 'autoplay', // boolean
  allowSubtitles: 'allowSubtitles', // boolean
  showSubtitles: 'showSubtitles', // boolean
});

export type ResourcePropertyKeyType = EnumType<typeof ResourcePropertyKey>;

export { ResourcePropertyKey };
