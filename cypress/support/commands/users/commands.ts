/// <reference types="cypress" />

Cypress.Commands.add('registerUser', (json) => {
    cy.postRegisterUser(json)

    cy.get('button').contains('Registrar Usuario').click()

    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('#firstName').click().type(user.firstName)
        cy.get('#lastName').click().type(user.lastName)
        cy.get('#email').click().type(user.email)
        cy.get('#password').click({ force: true }).type(user.password)
        cy.get('#confirmPassword').click({ force: true }).type(user.password)
    })

    cy.get('button[type="submit"]').contains('Registrar Usuario').click()
    cy.get('button').contains('Entendido').click()
})

Cypress.Commands.add('inactivateUser', () => {
    cy.get('table tbody tr').eq(1).find('td').eq(5).click()
    cy.contains('[role="menuitem"]', /^Desactivar$/).should('be.visible').click()
    cy.get('button').contains('Desactivar').click()
})

Cypress.Commands.add('assertinactivateUser', () => {
    cy.get('table tbody tr').eq(1).find('td').eq(3).should('contain', 'Inactivo')
})

Cypress.Commands.add('activateUser', () => {
    cy.get('table tbody tr').eq(1).find('td').eq(5).click()
    cy.contains('[role="menuitem"]', /^Activar$/).should('be.visible').click()
    cy.get('button').contains('Activar').click()
})

Cypress.Commands.add('assertActivateUser', () => {
    cy.get('table tbody tr').eq(1).find('td').eq(3).should('contain', 'Activo')
})
