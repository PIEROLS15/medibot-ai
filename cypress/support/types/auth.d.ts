declare namespace Cypress {
    /**
    * Performs user logins in Cypress.
    */

    interface Chainable {
        /**
         * Logs into the application as an **Administrator** user.
         *
         * @function loginAdministrator
         *
         * @example
         * cy.loginAdministrator()
         */
        loginAdministrator(): Chainable<void>

        /**
         * Logs into the application as a **Pharmacist** user.
         *
         * @function loginPharmacist
         *
         * @example
         * cy.loginPharmacist()
         */
        loginPharmacist(): Chainable<void>

        /**
         * Stubs `GET /api/auth/providers` using fixture data from
         * `cypress/fixtures/auth/${json}.json` and aliases the route as `@getProviders`.
         *
         * @function getProviders
         *
         * @example
         * cy.getProviders('providers')
         */
        getProviders(json: string): Chainable<void>

        /**
         * Stubs `GET /api/auth/csrf` using fixture data from
         * `cypress/fixtures/auth/${json}.json` and aliases the route as `@getCsrf`.
         *
         * @function getCsrf
         *
         * @example
         * cy.getCsrf('csrf')
         */
        getCsrf(json: string): Chainable<void>

        /**
         * Stubs `POST /api/auth/callback/credentials` using fixture data from
         * `cypress/fixtures/auth/${json}.json` and aliases the route as `@postCredentials`.
         *
         * @function postCredentials
         *
         * @example
         * cy.postCredentials('credentials')
         */
        postCredentials(json: string): Chainable<void>

        /**
         * Stubs `GET /api/auth/session` using fixture data from
         * `cypress/fixtures/auth/${json}.json` and aliases the route as `@getSession`.
         *
         * @function getSession
         *
         * @example
         * cy.getSession('session')
         */
        getSession(json: string): Chainable<void>

    }

}
