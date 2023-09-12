// Set to true to generate performance debug output
let DEBUG_PERFORMANCE = false;

if (process.env.CI) {
  DEBUG_PERFORMANCE = false;
}

function isDebugPerformance(): boolean {
  return DEBUG_PERFORMANCE;
}

export { isDebugPerformance };
