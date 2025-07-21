import { type EnumType, superenum } from '@ncoderz/superenum';

const Environment = superenum({
  unknown: '',
  node: 'node',
  chrome: 'chrome',
  safari: 'safari',
  firefox: 'firefox',
  edge: 'edge',
  ie: 'ie',
});

export type EnvironmentType = EnumType<typeof Environment>;

export { Environment };
