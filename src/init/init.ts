import '../config/Config.ts';

import { PACKAGE_INFO } from '../generated/package_info.ts';
import { initEnv } from '../utils/env/Env.ts';

let initialised = false;

// Initialise the application
function init(): void {
  if (initialised) return;

  initEnv(PACKAGE_INFO.name, PACKAGE_INFO.version);

  initialised = true;
}

export { init };
