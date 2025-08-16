/// <reference types="cypress" />

Cypress.Commands.add('loginAdministrator', () => {
    cy.visit('/')
    cy.get('.mt-4 > .rounded-full').click()
    cy.get('#email').click().type(Cypress.env('mock_user_administrator').email)
    cy.get('#password').click({ force: true }).type(Cypress.env('mock_user_administrator').password)
    cy.get('.inline-flex').click()
    cy.get('.text-xs').should('have.text', 'Administrador')
})


Cypress.Commands.add('loginPharmacist', () => {
    cy.visit('/')
    cy.get('.mt-4 > .rounded-full').click()
    cy.get('#email').click().type(Cypress.env('mock_user_pharmacist').email)
    cy.get('#password').click({ force: true }).type(Cypress.env('mock_user_pharmacist').password)
    cy.get('.inline-flex').click()
    cy.get('.text-xs').should('have.text', 'Farmacéutico')
})
