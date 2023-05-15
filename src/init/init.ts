import { initEnv } from '../utils/env/Env';

import { buildInfo } from './build-info';

// Initialise the application
function init(): void {
  initEnv(buildInfo.name, buildInfo.version);
}

export { init };
