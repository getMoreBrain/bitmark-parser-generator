import { buildInfo } from '../generated/build-info';
import { initEnv } from '../utils/env/Env';
import '../config/config';

// Initialise the application
function init(): void {
  initEnv(buildInfo.name, buildInfo.version);
}

export { init };
