describe("Undergraduate Programmes", () => {
    it("Go To Home Page", () => {
        cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
        cy.visit("/");
    });
    it("Add an undergrad programme", () => {
        cy.contains("button", "Add a programme").click();
        cy.get(".add-programme-type").contains("button", "Undergraduate").click();

        cy.get("#input-121").type("TestDegree", { force: true }).type("{enter}", { force: true });
        cy.get("#input-125").type("TestProgramme", { force: true }).type("{enter}", { force: true });
        cy.get("#input-129").type("TestStream", { force: true }).type("{enter}", { force: true });
        cy.get("#input-133").type("TestOption", { force: true }).type("{enter}", { force: true });

        cy.contains("button", "Cancel").then(function ($input) {
            $input.remove();
        });

        cy.contains("button", "Save changes").click().then(function ($input) {
            $input.remove();
        });
    });
    it("Remove an undergrad programme", () => {
        cy.get(".delete-icon").click();
    });
      it("Load undergrad programme", () => {
        cy.get(".search-bar")
          .type("Laser Physics (B")
          .type("{enter}");
        cy.get("button")
          .contains("search")
          .click();
      });
      it("Test dropdown course overview", () => {
        cy.get(".module")
          .get("button")
          .contains("1st year")
          .click();
        cy.get(".module")
          .get("button")
          .contains("Compulsory Modules")
          .click();
        cy.get(".module")
          .get("button")
          .contains("1st year")
          .click();
        cy.get(".module")
          .get("button")
          .contains("3rd year")
          .click();
        cy.get(".module")
          .get("button")
          .contains("Elective Modules")
          .click();
        cy.get(".module")
          .get("button")
          .contains("Option 1")
          .click();
        cy.get(".module").scrollTo("bottom");
      });
      it("Open Undgrad Editor", () => {
        // TODO
      });
      it("Switch programme", () => {
        cy.get(".search-bar")
          .type("Mater")
          .type("{enter}");
        cy.get("button")
          .contains("search")
          .click();
        cy.get(".module")
          .get("button")
          .contains("2nd year")
          .click();
        cy.get(".module")
          .get("button")
          .contains("Elective Modules")
          .click();
        cy.get(".module")
          .get("button")
          .contains("2nd year")
          .click();
        cy.get(".module").scrollTo("bottom");
      });
    });

    describe("Undergrad Module Editor Tests", () => {
      it("Open Programme Editor", () => {
        cy.get(".editor-icon").click();
      });
      it("Add List Test", () => {
        cy.get(".programme-editor")
          .get("button")
          .contains("1st year (140 credits)")
          .rightclick();
        cy.get("ul")
          .get("a")
          .contains("Add List")
          .click();
        cy.get(".ume-add-dialog")
          .get("#input-410")
          .type("This is a test List")
          .type("{enter}");
        cy.contains("button", "Cancel").then(function($input) {
          $input.remove();
        });
        cy.get(".ume-add-dialog")
          .get("button")
          .contains("Add")
          .click();
      });
      it("Add Module Test", () => {
        cy.get(".programme-editor")
          .get(".ume-content")
          .get("button")
          .contains("1st year (140 credits)")
          .click();
        cy.get(".programme-editor")
          .get(".ume-content-compulsory-modules")
          .rightclick();
        cy.get("ul")
          .get("a")
          .contains("Add Module")
          .click();
        cy.get(".ume-add-dialog")
          .get("#input-435")
          .type("Test Module 113")
          .type("{enter}");
        cy.get(".ume-add-dialog")
          .get("#input-439")
          .type("16")
          .type("{enter}");
        cy.get(".ume-add-dialog")
          .get("button")
          .contains("Add")
          .click();
      });
      it("Add Credits Test", () => {
        cy.get(".programme-editor")
          .get(".ume-content-compulsory-modules")
          .rightclick();
        cy.get("ul")
          .get("a")
          .contains("Add Credits")
          .click();
        cy.get(".ume-add-dialog")
          .get("#input-444")
          .type("32")
          .type("{enter}");
        cy.get(".ume-add-dialog")
          .get("#input-448")
          .type("48")
          .type("{enter}");
        cy.get(".ume-add-dialog")
          .get("button")
          .contains("Add")
          .click();
      });
      it("Add Alert Test", () => {
        cy.get(".programme-editor")
          .get("button")
          .contains("1st year (140 credits)")
          .rightclick();
        cy.get("ul")
          .get("a")
          .contains("Add Info Alert")
          .click();
        cy.get(".ume-add-dialog")
          .get("textarea")
          .type("This is a test alert")
          .type("{enter}");
        cy.get(".ume-add-dialog")
          .get("button")
          .contains("Add")
          .click();
      });
      it("Edit Item Test", () => {
        cy.get(".programme-editor")
          .get("button")
          .contains("1st year (140 credits)")
          .rightclick();
        cy.get("ul")
          .get("a")
          .contains("Edit")
          .click();
        cy.get(".ume-edit-dialog")
          .get("#input-462")
          .clear()
          .type("This is a test List")
          .type("{enter}");
        cy.get(".ume-edit-dialog")
          .get(".ume-edit-dialog-save")
          .contains("Save")
          .click()
          .then(function($input) {
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
