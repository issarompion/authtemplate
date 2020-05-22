describe("Main", () => {
    it("GET", () => {
        cy.request({
            method:"GET",
            url: "/"
        })
        .then((response) => {
            expect(response).property("status").to.equal(200)
            expect(response.body).to.be.a("string")
            expect(response.body).equal(`Welcome to ${Cypress.env("projectName")} API`)
        })
        .its("headers")
        .its("content-type")
        .should("include", "text")
    })
})