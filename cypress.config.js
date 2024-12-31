const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(_, _) {
      // implement node event listeners here
    },
  },
});
