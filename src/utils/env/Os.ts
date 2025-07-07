import { type EnumType, superenum } from '@ncoderz/superenum';

const Os = superenum({
  unknown: '',
  macos: 'macos',
  windows: 'windows',
  linux: 'linux',
  android: 'android',
  ios: 'ios',
});

export type OsType = EnumType<typeof Os>;

export { Os };
