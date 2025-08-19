/// <reference types="cypress" />

Cypress.Commands.add('getProviders', (json) => {
    cy.fixture(`auth/${json}.json`).then(data => {
        cy.intercept('GET', `/api/auth/providers`, {
            statusCode: 200,
            body: data
        }).as('getProviders')
    })
})

Cypress.Commands.add('getCsrf', (json) => {
    cy.fixture(`auth/${json}.json`).then(data => {
        cy.intercept('GET', `/api/auth/csrf`, {
            statusCode: 200,
            body: data
        }).as('getCsrf')
    })
})

Cypress.Commands.add('postCredentials', (json) => {
    cy.fixture(`auth/${json}.json`).then(data => {
        cy.intercept('POST', `/api/auth/callback/credentials`, {
            statusCode: 200,
            body: data
        }).as('postCredentials')
    })
})

Cypress.Commands.add('getSession', (json) => {
    cy.fixture(`auth/${json}.json`).then(data => {
        cy.intercept('GET', `/api/auth/session`, {
            statusCode: 200,
            body: data
        }).as('getSession')
    })
})

