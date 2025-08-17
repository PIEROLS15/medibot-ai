/// <reference types="cypress" />

Cypress.Commands.add('postRegisterUser', (json) => {
    cy.fixture(`users/${json}.json`).then(data => {
        cy.intercept('POST', `/api/auth/register`, {
            statusCode: 201,
            body: data
        }).as('postRegisterUser')
    })
})

Cypress.Commands.add('putUpdateUser', (json, idUser) => {
    cy.fixture(`users/${json}.json`).then(data => {
        cy.intercept('PUT', `/api/users/${idUser}`, {
            statusCode: 200,
            body: data
        }).as('putUpdateUser')
    })
})

Cypress.Commands.add('putStatusUser', (json, idUser) => {
    cy.fixture(`users/${json}.json`).then(data => {
        cy.intercept('PUT', `/api/users/${idUser}`, {
            statusCode: 200,
            body: data
        }).as('putStatusUser')
    })
})
