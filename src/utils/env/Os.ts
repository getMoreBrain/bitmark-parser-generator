import { type EnumType } from '@ncoderz/superenum';

const Os = {
  unknown: '',
  macos: 'macos',
  windows: 'windows',
  linux: 'linux',
  android: 'android',
  ios: 'ios',
} as const;

export type OsType = EnumType<typeof Os>;

export { Os };
