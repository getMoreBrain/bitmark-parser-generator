export interface Version {
  full: string;
  major: string;
  minor: string;
  patch: string;
  build: string;
}

const EMPTY_VERSION: Version = {
  full: '',
  major: '',
  minor: '',
  patch: '',
  build: '',
};

export { EMPTY_VERSION };
