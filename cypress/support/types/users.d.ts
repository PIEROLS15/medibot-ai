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

        /**
         * Inactivates a user via the table actions menu and confirms the action.
         *
         * @function inactivateUser
         *
         * @example
         * cy.inactivateUser()
         */
        inactivateUser(): Chainable<void>

        /**
         * Asserts that the target user row shows the status **"Inactivo"** in the status column.
         *
         * @function assertinactivateUser
         *
         * @example
         * cy.assertinactivateUser()
         */
        assertinactivateUser(): Chainable<void>

        /**
         * Activates a user via the table actions menu and confirms the action.
         *
         * @function activateUser
         *
         * @example
         * cy.activateUser()
         */
        activateUser(): Chainable<void>

        /**
         * Asserts that the target user row shows the status **"Activo"** in the status column.
         *
         * @function assertActivateUser
         *
         * @example
         * cy.assertActivateUser()
         */
        assertActivateUser(): Chainable<void>
    }

}
