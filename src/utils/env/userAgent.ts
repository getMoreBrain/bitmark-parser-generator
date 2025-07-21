import { Environment, type EnvironmentType } from './Environment.ts';
import { Os, type OsType } from './Os.ts';

export interface UserAgentInfo {
  browser: EnvironmentType;
  browserVersion?: string;
  os: OsType;
  osVersion?: string;
}

interface TokenizedUserAgent {
  keys: Set<string>;
  versions: {
    [key: string]: string;
  };
}

function parseUserAgent(): UserAgentInfo | undefined {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.userAgent)
    return undefined;

  const uai: UserAgentInfo = {
    browser: Environment.unknown,
    os: Os.unknown,
  };

  const userAgent = window.navigator.userAgent;
  const tua = tokenizeUserAgent(userAgent);

  // const containsIphoneIpadIpod = tua.keys.has('iphone') || tua.keys.has('ipad') || tua.keys.has('ipod');
  // const containsMobi = tua.keys.has('mobi');
  const containsFirefox = tua.keys.has('firefox');
  // const containsSeamonkey = tua.keys.has('seamonkey');
  const containsChrome = tua.keys.has('chrome');
  const containsChromium = tua.keys.has('chromium');
  const containsSafari = tua.keys.has('safari');
  // const containsOperaOPR = tua.keys.has('opera') || tua.keys.has('opr');
  // const containsTridentMSIE = tua.keys.has('trident') || tua.keys.has('msie');
  const containsMacintosh = tua.keys.has('macintosh');

  const isSafari = containsSafari && !containsChrome && !containsChromium;
  const isChrome = containsChrome;
  // const isChromium = containsChromium && !containsChrome;
  const isFirefox = containsFirefox;
  // const isSeamonkey = containsSeamonkey && !containsFirefox;
  // const isOpera = containsOperaOPR;
  // const isIE = containsTridentMSIE;
  // const isMobileOrTablet = containsMobi;
  // const isIOS = containsIphoneIpadIpod;
  const isMacOS = containsMacintosh;

  // Browser
  if (isSafari) {
    uai.browser = Environment.safari;
    uai.browserVersion = tua.versions.version;
  } else if (isChrome) {
    uai.browser = Environment.chrome;
    uai.browserVersion = tua.versions.chrome;
  } else if (isFirefox) {
    uai.browser = Environment.firefox;
    uai.browserVersion = tua.versions.firefox;
  }

  // OS
  if (isMacOS) {
    uai.os = Os.macos;
    uai.osVersion = tua.versions.x;
  }

  return uai;
}

function tokenizeUserAgent(userAgent: string): TokenizedUserAgent {
  const rawKeys = userAgent
    .toLowerCase()
    .split(new RegExp('[ /,;()]', 'g'))
    .reduce((acc, val) => {
      if (val) acc.push(val);
      return acc;
    }, [] as string[]);

  const tua: TokenizedUserAgent = {
    keys: new Set(),
    versions: {},
  };

  let prevRawKey = '';
  for (let i = 0, len = rawKeys.length; i < len; i++) {
    const rawKey = rawKeys[i];

    let isNumber = false;
    for (let i = 0; i <= 9; i++) {
      if (rawKey.startsWith(`${i}`)) {
        isNumber = true;
        break;
      }
    }
    if (isNumber) {
      tua.versions[prevRawKey] = rawKey.replace('_', '.');
    } else {
      tua.keys.add(rawKey);
    }
    prevRawKey = rawKey;
  }

  return tua;
}

export { parseUserAgent };
