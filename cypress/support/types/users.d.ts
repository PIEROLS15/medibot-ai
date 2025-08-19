declare namespace Cypress {
    /**
    * Performs user logins in Cypress.
    */

    interface Chainable {

        initModuleUsers(): Chainable<void>

        /**
         * Registers a user using data from a fixture and submits the form.
         * Internally calls `cy.postRegisterUser(json)` and fills inputs from
         *
         * @function registerUser
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
         * @param {number} idUser - ID of the user to update.
         *
         * @example
         * cy.putUpdateUser('updateUser', 2)
         */
        putUpdateUser(json: string, idUser: number): Chainable<void>

        /**
         * Stubs `PUT /api/users/:idUser` using fixture data from
         * `cypress/fixtures/users/${json}.json` and aliases the route as `@putStatusUser`.
         *
         * @function putStatusUser
         * @param {string} json - Base name of the fixture file (without `.json`).
         * @param {number} idUser - ID of the user to update.
         *
         * @example
         * cy.putStatusUser('inactivateUser', 2)
         */
        putStatusUser(json: string, idUser: number): Chainable<void>

        getRoles(json: string): Chainable<void>

        getUsers(json: string): Chainable<void>

        /**
         * Inactivates a user via the table actions menu and confirms the action.
         *
         * @function inactivateUser
         * @param {string} json - Base name of the fixture file (without `.json`).
         *
         * @example
         * cy.inactivateUser()
         */
        inactivateUser(json: string): Chainable<void>

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
         * @param {string} json - Base name of the fixture file (without `.json`).
         *
         * @example
         * cy.activateUser()
         */
        activateUser(json: string): Chainable<void>

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
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
         *
         * @example
         * cy.assertUpdateNameUser('updateUser')
         */
        assertUpdateNameUser(json: string): Chainable<void>

        /**
         * Updates the user's last name using fixture data and submits the edit form.
         *
         * @function updateLastNameUser
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
         *
         * @example
         * cy.assertUpdateLastNameUser('updateUser')
         */
        assertUpdateLastNameUser(json: string): Chainable<void>

        /**
         * Updates the user's email using fixture data and submits the edit form.
         *
         * @function updateEmailUser
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
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
         * @param {string} json - Base name of the fixture file (without `.json`).
         *
         * @example
         * cy.assertUpdateRoleUser('updateUser')
         */
        assertUpdateRoleUser(json: string): Chainable<void>
    }

}
