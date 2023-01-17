describe("@storyblok/js", () => {
  describe("RichText", () => {
    it("should print a console error if the SDK is not initialized", () => {
      cy.visit("http://localhost:5173/", {
        onBeforeLoad(win) {
          cy.spy(win.console, "error").as("consoleError");
        },
      });

      cy.get(".render-rich-text").click();
      cy.get("@consoleError").should(
        "be.calledWith",
        "Please initialize the Storyblok SDK before calling the renderRichText function"
      );
      cy.get("#rich-text-container").should("have.html", "undefined");
    });

    it("should render the HTML using the default schema and resolver", () => {
      cy.visit("http://localhost:5173/", {
        onBeforeLoad(win) {
          cy.spy(win.console, "error").as("consoleError");
        },
      });

      cy.get(".without-bridge").click();
      cy.get(".render-rich-text").click();
      cy.get("@consoleError").should("not.be.called");
      cy.get("#rich-text-container").should(
        "have.html",
        "<p>Hola<b>in bold</b></p>"
      );
    });

    it("should render the HTML using a custom global schema and resolver", () => {
      cy.visit("http://localhost:5173/");

      cy.get(".init-custom-rich-text").click();
      cy.get(".render-rich-text").click();
      cy.get("#rich-text-container").should(
        "have.html",
        'Holain bold<div class="custom-component">hey John</div>'
      );
    });

    it("should render the HTML using a one-time schema and resolver", () => {
      cy.visit("http://localhost:5173/");

      cy.get(".without-bridge").click();
      cy.get(".render-rich-text-options").click();
      cy.get("#rich-text-container").should(
        "have.html",
        'Holain bold<div class="custom-component">hey John</div>'
      );
    });
  });

  describe("Bridge", () => {
    it("Is loaded by default", () => {
      cy.visit("http://localhost:5173/");
      cy.get(".with-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("exist");
    });

    it("Is not loaded if options.bridge: false and errors in console", () => {
      cy.visit("http://localhost:5173/");
      cy.get(".without-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("not.exist");
    });
  });

  describe("Bridge (added independently)", () => {
    it("Can be loaded", () => {
      cy.visit("http://localhost:5173/");
      cy.get(".load-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("exist");
    });
    it("Can be loaded just once", () => {
      cy.visit("http://localhost:5173/");
      cy.get(".load-bridge").click();
      cy.wait(1000); // eslint-disable-line
      cy.get(".load-bridge").click();
      cy.get("#storyblok-javascript-bridge")
        .should("exist")
        .and("have.length", 1);
    });
  });
});
