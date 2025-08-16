declare namespace Cypress {
    /**
    * Performs user logins in Cypress.
    */

    interface Chainable {
        /**
         * Registers a user using data from a fixture and submits the form.
         * Internally calls `cy.postRegisterUser(json)` and fills inputs from
         *
         * @function registerUser
         *
         * @example
         * cy.registerUser('newUser')
         */
        registerUser(json: string): Chainable<void>

        /**
         * Intercepts and mocks `POST /api/auth/register` using data loaded from
         * `cypress/fixtures/users/${json}.json`, and aliases the route as `@postRegisterUser`.
         *
         * @function postRegisterUser
         *
         * @example
         * cy.postRegisterUser('newUser')
         */
        postRegisterUser(json: string): Chainable<void>
    }

}
