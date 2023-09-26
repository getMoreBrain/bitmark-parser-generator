import { buildInfo } from '../generated/build-info';
import { initEnv } from '../utils/env/Env';
import '../config/Config';

let initialised = false;

// Initialise the application
function init(): void {
  if (initialised) return;

  initEnv(buildInfo.name, buildInfo.version);

  initialised = true;
}

export { init };
