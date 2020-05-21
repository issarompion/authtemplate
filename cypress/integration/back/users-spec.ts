
let email = `${Math.random().toString(36).substring(7)}@gmail.com` // random caract beetwen 1 and 6
let password : string = "football"
let username : string = "test"
let token : string
let userId : string

describe("Create user", function() {

    it("POST /users => 200", () => {
        cy.request({
            method:"POST",
            url: "/users",
            body: {
                email : email, // random caract beetwen 1 and 6
                password: password,
                name: username
            }
        })
        .then(function(response){
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
})


describe("List /users/ => 200", function() {

    it("GET", () => {
        cy.request({
            method:"GET",
            url: "/users"
        })
        .then(function(response){
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

describe("Read user", function() {
    it("GET /users/me => 200", () => {
        cy.request({
            method:"GET",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer "+ token
            }
        })
        .then(function(response){
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
})

describe("Logout user", function() {
    it("POST /users/logout => 200", () => {
        cy.request({
            method:"POST",
            url: "/users/logout",
            headers:{
                "Authorization": "Bearer "+ token
            }
        })
        .then(function(response){
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).equal(userId)
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })
})

describe("Login user", function() {
    it("POST /users/login => 200", () => {
        cy.request({
            method:"POST",
            url: "/users/login",
            body: {
                email : email,
                password : password
            }
        })
        .then(function(response){
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
})

describe("Delete user", function() {

    it("DELETE /users/me => 200", () => {
        cy.request({
            method:"DELETE",
            url: "/users/me",
            headers:{
                "Authorization": "Bearer "+ token
            }
        })
        .then(function(response){
            expect(response).property("status").to.equal(200)
            expect(response.body.email).equal(email)
            expect(response.body.name).equal(username)
            expect(response.body.userId).equal(userId)
        })
        .its("headers")
        .its("content-type")
        .should("include", "application/json")
    })
})