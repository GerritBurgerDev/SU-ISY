// https://docs.cypress.io/api/introduction/api.html

describe("Load Launch Page", () => {
  it("Load page signed in", () => {
    cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
  });
});

describe("Navbar Tests", () => {
  it("Open NavDrawer", () => {
    cy.get("button")
      .contains("menu")
      .click();
    cy.get("a")
      .contains("General Information")
      .click();
    cy.visit("/");
  });
  it("Open Dialogs Test", () => {
    cy.get("button")
      .contains("menu")
      .click();
    cy.get(".nav-drawer-modules")
      .contains("Modules")
      .click();
    cy.contains("button", "Cancel")
      .click()
      .then(function($input) {
        $input.remove();
      });

    cy.get(".nav-drawer-programmes")
      .contains("Programmes")
      .click();
    cy.get(".nav-drawer-undergrad")
      .contains("Undergraduate")
      .click();
    cy.contains("button", "Cancel")
      .click()
      .then(function($input) {
        $input.remove();
      });

    cy.get(".nav-drawer-postgrad")
      .contains("Postgraduate")
      .click();
    cy.contains("button", "Cancel")
      .click()
      .then(function($input) {
        $input.remove();
      });
  });
  it("NavDrawer Choose Module Test", () => {
    cy.get(".nav-drawer-modules")
      .contains("Modules")
      .click();
    cy.get(".module-department")
      .type("Department of Physics")
      .type("{enter}");
    cy.get(".module-choose")
      .type("Physics 384")
      .type("{enter}");
    cy.get("button")
      .contains("OK")
      .click()
      .then(function($input) {
        $input.remove();
      });
  });
  it("Filter Test", () => {
    cy.get("button")
      .contains("filter_list")
      .click();
    cy.get("div")
      .contains("Modules only")
      .click();
    cy.get("button")
      .contains("filter_list")
      .click();
    cy.get("div")
      .contains("Postgraduate programmes only")
      .click();
    cy.get("button")
      .contains("filter_list")
      .click();
    cy.get("div")
      .contains("Undergraduate programmes only")
      .click();
    cy.get("button")
      .contains("filter_list")
      .click();
    cy.get("div")
      .contains("No filter")
      .click();
  });
});

describe("Test dialogs", () => {
  it("Go To Home Page", () => {
    cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
  });
  it("Pick a module", () => {
    cy.get("button")
      .contains("Specify a module")
      .click();
    cy.get("button")
      .contains("OK")
      .then(function($input) {
        $input.remove();
      });
    cy.contains("button", "Cancel")
      .click()
      .then(function($input) {
        $input.remove();
      });
  });
  it("Pick an undergrad programme", () => {
    cy.contains("button", "Undergraduate").click();
    cy.get(".undergrad-programme")
      .type("Programmes in the Physical Sciences")
      .type("{enter}");
    cy.get(".undergrad-degree")
      .type("Earth Science")
      .type("{enter}");
    cy.get(".undergrad-stream")
      .type("Geo-environmental Science")
      .type("{enter}");
    cy.get("button")
      .contains("OK")
      .click()
      .then(function($input) {
        $input.remove();
      });
    cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
  });
  it("Pick an postgrad programme", () => {
    cy.contains("button", "Postgraduate").click();
    cy.get(".postgrad-faculty")
      .type("Faculty of Science")
      .type("{enter}");
    cy.get(".postgrad-department")
      .type("Department of Mathematical Sciences")
      .type("{enter}");
    cy.get(".postgrad-programme")
      .type("Computer Science")
      .type("{enter}");
    cy.get(".postgrad-degree")
      .type("BScHons")
      .type("{enter}");
    cy.get("button")
      .contains("OK")
      .click()
      .then(function($input) {
        $input.remove();
      });
    cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
  });
  it("What can I study?", () => {
    cy.contains("button", "What can I study").click();

    const subjects = [
      "#input-113",
      "#input-118",
      "#input-123",
      "#input-128",
      "#input-133"
    ];

    for (let i in subjects) {
      cy.get(subjects[i])
        .type("6", { force: true })
        .type("{enter}", { force: true });
    }

    cy.get("#input-140").type("78");

    cy.contains("button", "Cancel").then(function($input) {
      $input.remove();
    });
    cy.get(".psp-form")
      .contains("button", "Calculate")
      .click()
      .then(function($input) {
        $input.remove();
      });
    cy.wait(1000);
    cy.get(".psp-possibilities")
      .get("button")
      .contains(" Abstract Mathematics ")
      .click();
  });
  it("Click postgraduate possibilities", () => {
    cy.visit("/?id=gAAAAABfoAU4BLEAFaOGukREHjODjre0oVBUvXw675eCLz67eJuP8OlMXrUZlgsBIeeVmIY837F6itPx8Ps1wPOGlN1cqT_MZg==");
    cy.contains("button", "Postgraduate possibilities").click();
    cy.get(".postgrad-possibilities-dialog")
      .get("button")
      .contains("Genetics BScHons")
      .click();
    cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
  });
});
