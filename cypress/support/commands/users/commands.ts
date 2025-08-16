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
