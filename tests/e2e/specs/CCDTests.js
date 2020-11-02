describe("CCD Tests", () => {
  it("Sign In As Student", () => {
    cy.visit("/?id=gAAAAABfoDttjROgmpuE9ldZhzoFFJpfVL3ngwHmgKahGqfO5m59YeAkJbXWNiBmeqtzE7abwXYlMhBu8PcLc5hm0leoa-e7fw==");
    cy.visit("/");
  });
  it("Load Continue Current Degree Page", () => {
    cy.get(".card-button")
      .contains(" Continue Current Degree ")
      .click();
    cy.visit("/continue-current-degree");
  });
  it("Open Possibilities Dialog", () => {
    cy.get(".possibilities-button")
      .contains("What are my possibilities?")
      .click();
    cy.wait(1000);
    cy.get(".up-ok-button")
      .contains("OK")
      .click();
  });
});
