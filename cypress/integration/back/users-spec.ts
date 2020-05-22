import {userResetSuccessMsg,userForgotSuccessMsg} from "../../../back/src/helpers/success"
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

let email = `${Math.random().toString(36).substring(7)}@gmail.com` // random caract beetwen 1 and 6
let password : string = "football"
let newpassword : string = "newfootball"
let username : string = "test"
let token : string
let userId : string

describe("Create user", () => {

    it("POST /users => Success", () => {
        cy.request({
            method:"POST",
            url: "/users",
            body: {
                email : email,
                password: password,
                name: username
            }
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).to.be.a("string")
            expect(response.body.token).to.be.a("string")
            userId = response.body.userId
            token = response.body.token
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

    it("POST /users => createBodyError", () => {
        cy.request({
            method:"POST",
            url: "/users",
            body: {},
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(createBodyError.status)
            expect(response.body).equal(createBodyError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

    it("POST /users => createAlreadyExistsError", () => {
        cy.request({
            method:"POST",
            url: "/users",
            body: {
                email : email,
                password: password,
                name: username
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(createAlreadyExistsError.status)
            expect(response.body).equal(createAlreadyExistsError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })
})


describe("List users", () => {

    it("GET /users => Success", () => {
        cy.request({
            method:"GET",
            url: "/users"
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body).to.have.ownProperty("length")
            expect(response.body[0]).to.have.property("name")
            expect(response.body[0]).to.have.property("email")
            expect(response.body[0]).to.have.property("userId")
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

})

describe("Read user", () => {

    it("GET /users/me => Success", () => {
        cy.request({
            method:"GET",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer "+ token
            }
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).equal(userId)
            expect(response.body.token).equal(token)
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

    it("GET /users/me => noAuthorizationHeaderError", () => {
        cy.request({
            method:"GET",
            url: "/users/me",
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(noAuthorizationHeaderError.status)
            expect(response.body).equal(noAuthorizationHeaderError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

    it("GET /users/me => jwtError", () => {
        cy.request({
            method:"GET",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer lol"
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(jwtError.status)
            expect(response.body).equal(jwtError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })
 
})

describe("Logout user and not authorized to read again", () => {
    it("GET /users/me => noAuthorizationHeaderError", () => {
        cy.request({
            method:"GET",
            url: "/users/me",
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(noAuthorizationHeaderError.status)
            expect(response.body).equal(noAuthorizationHeaderError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

    it("POST /users/logout => Success", () => {
        cy.request({
            method:"POST",
            url: "/users/logout",
            headers:{
                "Authorization": "Bearer "+ token
            }
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).equal(userId)
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

    it("GET /users/me => notAuthorizedError", () => {
        cy.request({
            method:"GET",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(notAuthorizedError.status)
            expect(response.body).equal(notAuthorizedError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })
})

describe("Login user", () => {
    it("POST /users/login => Success", () => {
        cy.request({
            method:"POST",
            url: "/users/login",
            body: {
                email : email,
                password : password
            }
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).equal(userId)
            expect(response.body.token).to.be.a("string")
            token = response.body.token
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

    it("POST /users/login => loginCredentialsFailError", () => {
        cy.request({
            method:"POST",
            url: "/users/login",
            body: {
                email : "test",
                password : "test"
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(loginCredentialsFailError.status)
            expect(response.body).equal(loginCredentialsFailError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })
})

describe("Forgot user password", () => {
    it("POST /users/forgot => Success", () => {
        cy.request({
            method:"POST",
            url: "/users/forgot",
            body: {
                email : email
            }
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body).equal(userForgotSuccessMsg(email))
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

    it("POST /users/forgot => => forgotEmailErrorr", () => {
        cy.request({
            method:"POST",
            url: "/users/forgot",
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(forgotEmailError.status)
            expect(response.body).equal(forgotEmailError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

})

describe("Reset user password", () => {

    it("POST /users/reset/:refreshToken => resetTokenError", () => {
        cy.request({
            method:"POST",
            url: "/users/reset/test",
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(resetTokenError.status)
            expect(response.body).equal(resetTokenError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

})

describe("Delete user", () => {

    it("DELETE /users/me => 200", () => {
        cy.request({
            method:"DELETE",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer "+ token
            }
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).equal(userId)
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })

    it("DELETE /users/me => => noAuthorizationHeaderError", () => {
        cy.request({
            method:"DELETE",
            url: "/users/me",
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(noAuthorizationHeaderError.status)
            expect(response.body).equal(noAuthorizationHeaderError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })

    it("DELETE /users/me => notAuthorizedError", () => {
        cy.request({
            method:"DELETE",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer " + token
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response).property("status").to.equal(notAuthorizedError.status)
            expect(response.body).equal(notAuthorizedError.body)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })
})