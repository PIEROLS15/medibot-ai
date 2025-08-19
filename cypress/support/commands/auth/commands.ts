/// <reference types="cypress" />

const SESSION_COOKIE = 'next-auth.session-token'

Cypress.Commands.add('loginAdministrator', () => {

    cy.visit('/')
    cy.get('.mt-4 > .rounded-full').click()
    cy.get('#email').click().type(Cypress.env('mock_user_administrator').email)
    cy.get('#password').click({ force: true }).type(Cypress.env('mock_user_administrator').password)
    cy.get('button').contains('Iniciar Sesión').click()

    cy.getSession('session')
    cy.getCsrf('csrf')
    cy.getProviders('providers')
    cy.postCredentials('credentials')
    cy.setCookie(SESSION_COOKIE, 'mocked-token-123')

    // cy.get('.text-xs', { timeout: 5000 }).should('have.text', 'Administrador')

})

Cypress.Commands.add('loginPharmacist', () => {
    cy.visit('/')
    cy.get('.mt-4 > .rounded-full').click()
    cy.get('#email').click().type(Cypress.env('mock_user_pharmacist').email)
    cy.get('#password').click({ force: true }).type(Cypress.env('mock_user_pharmacist').password)
    cy.get('.inline-flex').click()
    cy.get('.text-xs').should('have.text', 'Farmacéutico')
})
