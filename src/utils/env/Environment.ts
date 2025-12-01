import { type EnumType } from '@ncoderz/superenum';

const Environment = {
  unknown: '',
  node: 'node',
  chrome: 'chrome',
  safari: 'safari',
  firefox: 'firefox',
  edge: 'edge',
  ie: 'ie',
} as const;

export type EnvironmentType = EnumType<typeof Environment>;

export { Environment };
