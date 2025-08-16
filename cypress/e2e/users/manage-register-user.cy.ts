describe(`User Registration`, () => {
    beforeEach(() => {
        cy.loginAdministrator()
        cy.get('[href="/dashboard/users"]').click()
    })

    it('should register a new user correctly', () => {
        cy.registerUser('newUser')
    })

})
