import {Chance} from "chance"
import {
    noAuthorizationHeaderError,
    credentialsError,
    createAlreadyExistsError,
    createBodyError,
    loginCredentialsFailError,
    jwtError,
    notAuthorizedError,
    forgotEmailError,
    resetTokenError
} from "../../../back/src/helpers/errors"

import {userForgotSuccessMsg,userResetSuccessMsg} from "../../../back/src/helpers/success"

const chance = new Chance()

let newName = chance.name()
let newEmail = chance.email()
let newPassword = "password"

describe("Login page checks", () => {
    beforeEach(()=>{
        cy.visit("/")
    })

    it("Be in login page route", () =>{
        cy.url().should("include", "/login")
        cy.contains("Please sign in").should("be.visible") 
        cy.get("[data-cy=loginForm]").should("be.visible")
        cy.get("[data-cy=loginEmail]").should("be.visible")
        cy.get("[data-cy=loginPassword]").should("be.visible")
        cy.get("[data-cy=loginBtn]").should("be.visible")
        cy.get("[data-cy=loginForgotLink]").should("be.visible")
        cy.get("[data-cy=loginRegisterLink]").should("be.visible")
    })

    it("Email and password required", () => {
        cy.get("[data-cy=loginBtn]").click().then(() => {
            cy.get("[data-cy=loginEmailError]").should("be.visible").and("contain","Email is required")
            cy.get("[data-cy=loginPasswordError]").should("be.visible").and("contain","Password is required")
        })
        
    })

    it("Login fail", () => {
        cy.get("[data-cy=loginEmail]").type(newEmail)
        cy.get("[data-cy=loginPassword]").type(newPassword)
        cy.get("[data-cy=loginBtn]").click().then(() => {
            cy.get("[data-cy=loginError]").should("be.visible").and("contain",loginCredentialsFailError.body)
        })
        
    })

    it("Login Success", () => {
        cy.get("[data-cy=loginEmail]").type(Cypress.env("email"))
        cy.get("[data-cy=loginPassword]").type(Cypress.env("password"))
        cy.get("[data-cy=loginBtn]").click().then(() => {
            cy.contains("Home").should("be.visible") 
        })
        
    })

})

describe("Register page checks", () => {
    beforeEach(()=>{
        cy.visit("/")
        cy.get("[data-cy=loginRegisterLink").click()
    })

    it("Be in register page", () =>{
        cy.url().should("include", "/register")
        cy.contains("Create Account").should("be.visible") 
        cy.get("[data-cy=registerForm]").should("be.visible")
        cy.get("[data-cy=registerName]").should("be.visible")
        cy.get("[data-cy=registerEmail]").should("be.visible")
        cy.get("[data-cy=registerPassword]").should("be.visible")
        cy.get("[data-cy=registerConfirmPassword]").should("be.visible")
        cy.get("[data-cy=registerBtn]").should("be.visible")
        cy.get("[data-cy=registerLoginLink]").should("be.visible")
    })

    it("Email, name, password and confirmation required", () => {
        cy.get("[data-cy=registerBtn]").click().then(() => {
            cy.get("[data-cy=registerNameError]").should("be.visible").and("contain","Name is required")
            cy.get("[data-cy=registerEmailError]").should("be.visible").and("contain","Email is required")
            cy.get("[data-cy=registerPasswordError]").should("be.visible").and("contain","Password is required")
            cy.get("[data-cy=registerConfirmPasswordError]").should("be.visible").and("contain","Confirm password is required")
        })
    })


    it("Passwords must match", () => {
        cy.get("[data-cy=registerName]").type(newName)
        cy.get("[data-cy=registerEmail]").type(newEmail)
        cy.get("[data-cy=registerPassword]").type(newPassword)
        cy.get("[data-cy=registerConfirmPassword]").type("X"+newPassword)
        cy.get("[data-cy=registerBtn]").click().then(() => {
            cy.get("[data-cy=registerConfirmPasswordError]").should("be.visible").and("contain","Passwords must match")
        })
    })

    it("Email already exists", () => {
        cy.get("[data-cy=registerName]").type(newName)
        cy.get("[data-cy=registerEmail]").type(Cypress.env("email"))
        cy.get("[data-cy=registerPassword]").type(newPassword)
        cy.get("[data-cy=registerConfirmPassword]").type(newPassword)
        cy.get("[data-cy=registerBtn]").click().then(() => {
            cy.get("[data-cy=registerError]").should("be.visible").and("contain",createAlreadyExistsError.body)
        })
    })

    it("Register success", () => {
        cy.get("[data-cy=registerName]").type(newName)
        cy.get("[data-cy=registerEmail]").type(newEmail)
        cy.get("[data-cy=registerPassword]").type(newPassword)
        cy.get("[data-cy=registerConfirmPassword]").type(newPassword)
        cy.get("[data-cy=registerBtn]").click().then(() => {
            cy.contains("Home").should("be.visible")
        })
    })
    

})

describe("Forgot password page checks", () => {
    beforeEach(()=>{
        cy.visit("/")
        cy.get("[data-cy=loginForgotLink").click()
    })

    it("Be in forgot password page", () =>{
        cy.url().should("include", "/forgot-password")
        cy.contains("Forgot password").should("be.visible") 
        cy.get("[data-cy=forgotForm]").should("be.visible")
        cy.get("[data-cy=forgotEmail]").should("be.visible")
        cy.get("[data-cy=forgotBtn]").should("be.visible")
        cy.get("[data-cy=forgotLoginLink]").should("be.visible")
    })

    it("Email required", () => {
        cy.get("[data-cy=forgotBtn]").click().then(() => {
            cy.get("[data-cy=forgotEmailError]").should("be.visible").and("contain","Email is required")
        })
    })

    it("No account matched", () => {
        cy.get("[data-cy=forgotEmail]").type(newEmail)
        cy.get("[data-cy=forgotBtn]").click().then(() => {
            cy.get("[data-cy=forgotError]").should("be.visible").and("contain",forgotEmailError.body)
        })
    })

    it("Success email send", () => {
        cy.get("[data-cy=forgotEmail]").type(Cypress.env("email"))
        cy.get("[data-cy=forgotBtn]").click().then(() => {
            cy.contains(userForgotSuccessMsg(Cypress.env("email")))
        })
    })

})

describe("Reset password page checks", () => {
    beforeEach(()=>{
        cy.visit("/reset-password/1234")
    })

    it("Be in reset password page", () =>{
        cy.url().should("include", "/reset-password")
        cy.contains("Reset password").should("be.visible") 
        cy.get("[data-cy=resetForm]").should("be.visible")
        cy.get("[data-cy=resetPassword]").should("be.visible")
        cy.get("[data-cy=resetConfirmPassword]").should("be.visible")
        cy.get("[data-cy=resetBtn]").should("be.visible")
    })

    it("Password and confirmation required", () => {
        cy.get("[data-cy=resetBtn]").click().then(() => {
            cy.get("[data-cy=resetPasswordError]").should("be.visible").and("contain","Password is required")
            cy.get("[data-cy=resetConfirmPasswordError]").should("be.visible").and("contain","Confirm password is required")
        })
    })

    it("Passwords must match", () => {
        cy.get("[data-cy=resetPassword]").type(newPassword)
        cy.get("[data-cy=resetConfirmPassword]").type("X"+newPassword)
        cy.get("[data-cy=resetBtn]").click().then(() => {
            cy.get("[data-cy=resetConfirmPasswordError]").should("be.visible").and("contain","Passwords must match")
        })
    })

    it("Success reset password", () => {
        cy.visit("/reset-password/12345")
        cy.get("[data-cy=resetPassword]").type(newPassword)
        cy.get("[data-cy=resetConfirmPassword]").type(newPassword)
        cy.get("[data-cy=resetBtn]").click().then(() => {
            cy.contains(userResetSuccessMsg)
        })
    })

})