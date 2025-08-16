import { defineConfig } from "cypress";

export default defineConfig({
  retries: { 'runMode': 2, 'openMode': 0 },
  viewportWidth: 1300,
  pageLoadTimeout: 100000,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
  env: {
    api_url: 'http://localhost:1337',
    mock_user_administrator: {
      email: 'piero@gmail.com',
      password: '123456'
    },
    mock_user_pharmacist: {
      email: 'diego@gmail.com',
      password: '123456'
    },
  },
  video: false,
  screenshotOnRunFailure: false
})

