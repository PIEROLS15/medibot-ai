/// <reference types="cypress" />

Cypress.Commands.add('postRegisterUser', (json) => {
    cy.fixture(`users/${json}.json`).then(data => {
        cy.intercept('POST', `/api/auth/register`, {
            statusCode: 201,
            body: data
        }).as('postRegisterUser')
    })
})
