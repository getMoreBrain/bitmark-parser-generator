import { buildInfo } from '../generated/build-info';
import { initEnv } from '../utils/env/Env';
import '../config/config';

let initialised = false;

// Initialise the application
function init(): void {
  if (initialised) return;

  // Initialise environment
  initEnv(buildInfo.name, buildInfo.version);

  initialised = true;
}

export { init };
