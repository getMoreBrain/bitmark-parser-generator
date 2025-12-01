import { PACKAGE_INFO } from '../../generated/package_info.ts';

// Use version from package.json
export const CLI_VERSION = PACKAGE_INFO.version;
export const FULL_VERSION = `bitmark-parser v${CLI_VERSION}`;
