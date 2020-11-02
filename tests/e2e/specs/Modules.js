describe("Modules", () => {
    it("Go To Home Page", () => {
        cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
        cy.visit("/");
    });
    it("Add a module", () => {
        cy.contains("button", "Add a module").click();

        cy.get("#input-113").type("TestDegree", { force: true }).type("{enter}", { force: true });
        cy.get("#input-117").type("TestProgramme", { force: true }).type("{enter}", { force: true });
        cy.get("#input-121").type("TestStream", { force: true }).type("{enter}", { force: true });
        cy.get("#input-125").type("TestOption", { force: true }).type("{enter}", { force: true });
        cy.get("#input-129").type("TestOption", { force: true }).type("{enter}", { force: true });
        cy.get("#input-133").type("TestOption", { force: true }).type("{enter}", { force: true });

        cy.contains("button", "cancel").then(function ($input) {
            $input.remove();
        });

        cy.contains("button", "Save changes").click();
    });
    it("Remove a module", () => {
        cy.get(".delete-icon").click();
    });
    it("Load a Module", () => {
        cy.get(".search-bar")
            .type("Computer Science 344")
            .type("{enter}");
        cy.get("button")
            .contains("search")
            .click();
        // cy.visit("/module");
    });
    it("Edit module", () => {
        cy.get(".edit-icon").click();
        cy.get(".mod-info-button").click();
        cy.get(".pce-new-list").contains("button", "close").click();
        cy.get(".pce-new-list").contains("button", "add").click();
        cy.contains("button", "Cancel").click().then(function ($input) {
            $input.remove();
        });
        cy.contains("button", "Save changes").click();
    });
    it("Switch to another module", () => {
        cy.get(".search-bar")
            .type("Mathematical Statistics 364")
            .type("{enter}");
        cy.get("button")
            .contains("search")
            .click();
    });
});
