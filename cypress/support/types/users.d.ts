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
         * Stubs `PUT /api/users/:idUser` using fixture data from
         * `cypress/fixtures/users/${json}.json` and aliases the route as `@putUpdateUser`.
         *
         * @function putUpdateUser
         *
         * @example
         * cy.putUpdateUser('updateUser', 2)
         */
        putUpdateUser(json: string, idUser: number): Chainable<void>

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

        /**
         * Updates the user's first name using fixture data and submits the edit form.
         *
         * @function updateNameUser
         *
         * @example
         * cy.updateNameUser('updateUser')
         */
        updateNameUser(json: string): Chainable<void>

        /**
         * Asserts that the updated first name appears in the first column
         * of the target table row using `cypress/fixtures/users/${json}.json`.
         *
         * @function asserUpdateNameUser
         *
         * @example
         * cy.assertUpdateNameUser('updateUser')
         */
        assertUpdateNameUser(json: string): Chainable<void>

        /**
         * Updates the user's last name using fixture data and submits the edit form.
         *
         * @function updateLastNameUser
         *
         * @example
         * cy.updateLastNameUser('updateUser')
         */
        updateLastNameUser(json: string): Chainable<void>

        /**
         * Asserts that the updated last name appears in the first column
         * of the target table row using `cypress/fixtures/users/${json}.json`.
         *
         * @function asserUpdateLastNameUser
         *
         * @example
         * cy.assertUpdateLastNameUser('updateUser')
         */
        assertUpdateLastNameUser(json: string): Chainable<void>

        /**
         * Updates the user's email using fixture data and submits the edit form.
         *
         * @function updateEmailUser
         *
         * @example
         * cy.updateEmailUser('updateUser')
         */
        updateEmailUser(json: string): Chainable<void>

        /**
         * Asserts that the updated email appears in the second column
         * of the target table row using `cypress/fixtures/users/${json}.json`.
         *
         * @function assertUpdateEmailUser
         *
         * @example
         * cy.assertUpdateEmailUser('updateUser')
         */
        assertUpdateEmailUser(json: string): Chainable<void>

        /**
         * Updates the user's role using fixture data and submits the edit form.
         * Opens the role combobox and selects the option whose label matches `user.rol`.
         *
         * @function updateRoleUser
         *
         * @example
         * cy.updateRoleUser('updateUser')
         */
        updateRoleUser(json: string): Chainable<void>

        /**
         * Asserts that the updated role label appears in the third column
         * of the target table row using `cypress/fixtures/users/${json}.json`.
         *
         * @function assertUpdateRoleUser
         *
         * @example
         * cy.assertUpdateRoleUser('updateUser')
         */
        assertUpdateRoleUser(json: string): Chainable<void>
    }

}
