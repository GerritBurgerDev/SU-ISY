describe("Postgraduate Programmes", () => {
    it("Go To Home Page", () => {
        cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
        cy.visit("/");
    });
    it("Load postgrad programme", () => {
        cy.get(".search-bar")
            .type("Computer Science(BS")
            .type("{enter}");
        cy.get("button")
            .contains("search")
            .click();
        cy.get(".module").scrollTo("bottom");
    });
    // it("", () => {});
    // it("", () => {});
    // it("", () => {});
    // it("", () => {});
});

describe("Postgrad Editor Tests", () => {
    it("Open Programme Editor", () => {
        cy.get(".editor-icon").click();
        cy.get(".v-dialog").scrollTo("bottom");
    });
    it("Add Item Test", () => {
        cy.get(".programme-editor")
            .get("button")
            .contains("Stream Computer Science (128 credits)")
            .rightclick();
        cy.get("ul")
            .get("a")
            .contains("Add List")
            .click();
        cy.get(".pce-add-dialog")
            .get("#input-279")
            .type("This is a test List")
            .type("{enter}");
        cy.contains("button", "Cancel")
            .then(function ($input) {
                $input.remove();
            });
        cy.get(".pce-add-dialog")
            .get("button")
            .contains("Add")
            .click()
            .then(function ($input) {
                $input.remove();
            });
    });
    it("Edit Item Test", () => {
        cy.get(".programme-editor")
            .get("button")
            .contains("Stream Computer Science (128 credits)")
            .rightclick();
        cy.get("ul")
            .get("a")
            .contains("Edit")
            .click();
        cy.get(".pce-edit-dialog")
            .get("#input-289")
            .clear()
            .type("This is a test List")
            .type("{enter}");
        cy.contains("button", "Cancel").then(function ($input) {
            $input.remove();
        });
        cy.get(".pce-edit-dialog")
            .get(".pce-edit-dialog-save")
            .contains("Save")
            .click()
            .then(function ($input) {
                $input.remove();
            });
    });
    it("Delete Item Test", () => {
        cy.get(".programme-editor")
            .get("button")
            .contains("This is a test List")
            .rightclick();
        cy.get("ul")
            .get("a")
            .contains("Delete")
            .click();
    });
    it("Save Changes Test", () => {
        cy.get(".v-dialog")
            .get("button")
            .contains("cancel")
            .click();
        // TODO
    });
});

describe("Information Section Editor Tests", () => {
    it("Open Programme Editor", () => {
        cy.get(".editor-icon").click();
    });
    it("Add Item Test", () => {
        cy.get(".programme-editor")
            .get("button")
            .contains("Assessment and Examination")
            .rightclick();
        cy.get("ul")
            .get("a")
            .contains("Add item")
            .click();
        cy.get(".ise-add-dialog")
            .get("textarea")
            .type("This is a test List")
            .type("{enter}");
        cy.contains("button", "Cancel").then(function ($input) {
            $input.remove();
        });
        cy.get(".ise-add-dialog")
            .get("button")
            .contains("Add")
            .click()
            .then(function ($input) {
                $input.remove();
            });
    });
    it("Edit Item Test", () => {
        cy.get(".programme-editor")
            .get("button")
            .contains("Assessment and Examination")
            .rightclick();
        cy.get("ul")
            .get("a")
            .contains("Edit")
            .click();
        cy.get(".ise-edit-dialog")
            .get("#input-329")
            .clear()
            .type("This is a test List")
            .type("{enter}");
        cy.contains("button", "Cancel").then(function ($input) {
            $input.remove();
        });
        cy.get(".ise-edit-dialog")
            .get(".ise-edit-dialog-save")
            .contains("Save")
            .click()
            .then(function ($input) {
                $input.remove();
            });
    });
    it("Delete Item Test", () => {
        cy.get(".programme-editor")
            .get("button")
            .contains("This is a test List")
            .rightclick();
        cy.get("ul")
            .get("a")
            .contains("Delete")
            .click();
    });
    it("Save Changes Test", () => {
        // TODO
    });
});
