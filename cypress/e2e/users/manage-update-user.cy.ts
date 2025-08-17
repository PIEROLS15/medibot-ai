describe(`Update user`, () => {
    beforeEach(() => {
        cy.loginAdministrator()
        cy.get('[href="/dashboard/users"]').click()
    })

    const json = 'updateUser'

    it('should update a users name correctly', () => {
        cy.updateNameUser(json)
        cy.assertUpdateNameUser(json)
    })

    it('should update a users last name correctly', () => {
        cy.updateLastNameUser(json)
        cy.assertUpdateLastNameUser(json)
    })

    it('should update a users email correctly', () => {
        cy.updateEmailUser(json)
        cy.assertUpdateEmailUser(json)
    })

    it('should update a users rol correctly', () => {
        cy.updateRoleUser(json)
        cy.assertUpdateRoleUser(json)
    })

})
