describe(`Inactivate and deactivate user`, () => {
    beforeEach(() => {
        cy.loginAdministrator()
        cy.get('[href="/dashboard/users"]').click()
    })

    it('should deactivate a user correctly.', () => {
        cy.inactivateUser('inactiveUser')
        cy.assertinactivateUser()
    })

    it('should activate a user correctly.', () => {
        cy.inactivateUser('inactiveUser')
        cy.activateUser('activeUser')
        cy.assertActivateUser()
    })

})
