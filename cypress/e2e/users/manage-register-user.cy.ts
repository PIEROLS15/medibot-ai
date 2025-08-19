describe(`User Registration`, () => {
    beforeEach(() => {
        cy.loginAdministrator()
        cy.initModuleUsers()
    })

    it('should register a new user correctly', () => {
        cy.registerUser('newUser')
    })

})
