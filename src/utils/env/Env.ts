import { Environment, type EnvironmentType } from './Environment.ts';
import { Os, type OsType } from './Os.ts';
import { parseUserAgent, type UserAgentInfo } from './userAgent.ts';
import { EMPTY_VERSION, type Version } from './Version.ts';

declare const process: {
  env: { [key: string]: string };
  version?: string;
  versions?: { [key: string]: string };
};

class Env {
  public bootTimestamp: number;
  public app: string;
  public appVersion: Version;
  public environment: EnvironmentType;
  public environmentVersion: Version;
  public os: OsType;
  public osVersion: Version;
  public isBrowser: boolean;
  public isNode: boolean;
  public isCI: boolean;
  public NODE_ENV: string;

  // public username: string;
  // public usergroup: string;
  // public uid: number;
  // public gid: number;
  // public homedir: string;
  // public shell: string;

  private userAgentInfo: UserAgentInfo | undefined;

  constructor() {
    Object.defineProperty(this, 'userAgentInfo', {
      value: parseUserAgent(),
      enumerable: false,
    });
    this.bootTimestamp = Date.now();
    this.app = '';
    this.appVersion = EMPTY_VERSION;
    this.environment = this.getEnvironment();
    this.environmentVersion = this.getEnvironmentVersion();
    this.isBrowser = this.getIsBrowser();
    this.isNode = this.environment === Environment.node;
    this.isCI = this.getIsCI();
    this.NODE_ENV = this.getNodeEnv();
    this.os = this.getOs();
    this.osVersion = this.getOsVersion();
  }

  public init(app: string, version: string): void {
    this.app = app;
    this.appVersion = this.parseMMBVersion(version);
  }

  get upTimestamp(): number {
    return Date.now() - this.bootTimestamp;
  }

  private getEnvironment(): EnvironmentType {
    if (this.userAgentInfo) {
      return this.userAgentInfo.browser;
    } else if (typeof process !== 'undefined') {
      if (process.versions !== undefined) {
        if (process.versions.node) return Environment.node;
      }
    }

    return Environment.unknown;
  }

  private getEnvironmentVersion(): Version {
    if (this.userAgentInfo) {
      return this.parseMMBVersion(this.userAgentInfo.browserVersion);
    } else if (typeof process !== 'undefined') {
      return this.parseMMBVersion(process.version);
    }
    return EMPTY_VERSION;
  }

  private getOs(): OsType {
    if (this.userAgentInfo) {
      return this.userAgentInfo.os;
    } else if (typeof process !== 'undefined') {
      if (process.versions !== undefined) {
        if (process.versions.node) return Os.unknown;
      }
    }

    return Os.unknown;
  }

  private getOsVersion(): Version {
    if (this.userAgentInfo) {
      return this.parseMMBVersion(this.userAgentInfo.osVersion);
    } else if (typeof process !== 'undefined') {
      return this.parseMMBVersion('');
    }
    return EMPTY_VERSION;
  }

  private getIsBrowser(): boolean {
    return !!(
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      navigator.userAgent
    );
  }

  private getIsCI(): boolean {
    return !!(typeof process !== 'undefined' && process.env && process.env.CI);
  }

  private getNodeEnv(): string {
    return (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) || '';
  }

  /**
   * TODO:
   * Parse Senver 2.0 ?? https://semver.org/
   * and X.Y.Z.B using regex
   *
   * @param version
   */
  private parseMMBVersion(version?: string): Version {
    if (!version) return EMPTY_VERSION;

    // Remove leading v
    if (version.startsWith('v')) {
      version = version.substring(1);
    }

    // Parse major/minor/build
    const s = version.split('.', 1000);
    let major = '';
    let minor = '';
    let build = '';
    let patch = '';
    for (let i = 0, len = s.length; i < len; i++) {
      const v = s[i];
      if (i === 0) major = v;
      else if (i === 1) minor = v;
      else if (i === 2) patch = v;
      else if (i === 3) build = v;
    }

    return {
      full: version,
      major,
      minor,
      patch,
      build,
    };
  }
}

const env = new Env();
const initEnv = env.init.bind(env);

export { env, initEnv };
