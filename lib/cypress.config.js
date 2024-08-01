// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  integration: {
    testFiles: "**/*.spec.js",
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("./cypress/plugins/index.js")(on, config);
    },
  },
});
