describe("@storyblok/js", () => {
  describe("Bridge", () => {
    it("Is loaded by default", () => {
      cy.visit("http://localhost:3000/");
      cy.get(".with-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("exist");
    });

    it("Is not loaded if options.bridge: false and errors in console", () => {
      cy.visit("http://localhost:3000/");
      cy.get(".without-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("not.exist");
    });
  });
});
