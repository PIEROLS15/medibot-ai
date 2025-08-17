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

Cypress.Commands.add('updateNameUser', (json) => {
    cy.putUpdateUser(json, 2)

    cy.get('table tbody tr').eq(1).find('td').eq(5).click()
    cy.contains('[role="menuitem"]', /^Editar usuario$/).should('be.visible').click()

    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('#nombres').click().clear().type(user.firstName)
    })
    cy.get('button[type="submit"]').contains('Guardar Cambios').click()
})

Cypress.Commands.add('assertUpdateNameUser', (json) => {
    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('table tbody tr').eq(1).find('td').eq(0).should('contain', user.firstName)
    })
})

Cypress.Commands.add('updateLastNameUser', (json) => {
    cy.putUpdateUser(json, 2)

    cy.get('table tbody tr').eq(1).find('td').eq(5).click()
    cy.contains('[role="menuitem"]', /^Editar usuario$/).should('be.visible').click()

    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('#apellidos').click().clear().type(user.lastName)
    })
    cy.get('button[type="submit"]').contains('Guardar Cambios').click()
})

Cypress.Commands.add('assertUpdateLastNameUser', (json) => {
    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('table tbody tr').eq(1).find('td').eq(0).should('contain', user.lastName)
    })
})

Cypress.Commands.add('updateEmailUser', (json) => {
    cy.putUpdateUser(json, 2)

    cy.get('table tbody tr').eq(1).find('td').eq(5).click()
    cy.contains('[role="menuitem"]', /^Editar usuario$/).should('be.visible').click()

    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('#email').click().clear().type(user.email)
    })
    cy.get('button[type="submit"]').contains('Guardar Cambios').click()
})

Cypress.Commands.add('assertUpdateEmailUser', (json) => {
    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('table tbody tr').eq(1).find('td').eq(1).should('contain', user.email)
    })
})

Cypress.Commands.add('updateRoleUser', (json) => {
    cy.putUpdateUser(json, 2)

    cy.get('table tbody tr').eq(1).find('td').eq(5).click()
    cy.contains('[role="menuitem"]', /^Editar usuario$/).should('be.visible').click()
    cy.get('button[role="combobox"]').click()

    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('[role="listbox"] [role="option"]').contains(user.rol).click()
    })

    cy.get('button[type="submit"]').contains('Guardar Cambios').click()
})

Cypress.Commands.add('assertUpdateRoleUser', (json) => {
    cy.fixture(`users/${json}.json`).then((user) => {
        cy.get('table tbody tr').eq(1).find('td').eq(2).should('contain', user.rol)
    })
})
