import { ResourceJson } from './ResourceJson';

export interface AppResourceJson extends ResourceJson {
  type: 'app';
  app: string;
  private: {
    // TODO
  };
}
