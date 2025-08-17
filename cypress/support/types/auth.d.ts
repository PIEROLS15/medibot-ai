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
    }

}
