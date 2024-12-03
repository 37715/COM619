const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
      require('@cypress/code-coverage/task')(on, config);  
      // return config variable
      return config;   
    },
    baseUrl: 'http://localhost:8080', 
  },
});
