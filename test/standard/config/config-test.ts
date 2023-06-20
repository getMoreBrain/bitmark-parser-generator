// Set to true to generate performance debug output
let DEBUG_PERFORMANCE = false;

// Set to true to test against the ANTLR parser rather than static JSON This is a slow process.
let TEST_AGAINST_ANTLR_PARSER = false;

if (process.env.CI) {
  DEBUG_PERFORMANCE = false;
  TEST_AGAINST_ANTLR_PARSER = false;
}

export { DEBUG_PERFORMANCE, TEST_AGAINST_ANTLR_PARSER };
