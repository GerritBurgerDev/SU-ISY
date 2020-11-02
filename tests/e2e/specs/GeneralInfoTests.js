describe("General Information Tests", () => {
  it("Visit general information page as staff member", () => {
    cy.visit("/?id=gAAAAABfoASgvcRvdVsXIoBOL-s7S70bcK2lo6FYsYQj3J7aXa6oWfjZSotYvQRR2j6tEUZ_jkeX9NURyhZTcLTn_ZR9P0-4Sw==");
    cy.visit("/general");
  });
  it("Test reset changes", () => {
    cy.get("h1")
      .contains("History and functions of the Faculty of Science")
      .invoke("prop", "innerHTML", "Test");
    cy.get("h1").contains("Test");
    cy.get(".changes-settings")
      .contains("settings")
      .click();
    cy.get("button")
      .contains("undo")
      .click();
    cy.get("h1")
      .contains("Test")
      .invoke(
        "prop",
        "innerHTML",
        "History and functions of the Faculty of Science"
      );
  });
  it("Test save changes", () => {
    cy.get("h1")
      .contains("History and functions of the Faculty of Science")
      .invoke("prop", "innerHTML", "Test");
    cy.get(".changes-settings")
      .contains("settings")
      .click();
    cy.get("h1").contains("Test");
    cy.get("button")
      .contains("save")
      .click();
    cy.visit("/general");
  });
});
