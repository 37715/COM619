describe('Page View-ability Test', () => {
    it('should load the index page and display the expected content', () => {
      // Visit the URL where the page is served locally
      cy.visit('http://localhost:8080'); 
      // check the page is correctly loaded (contains Select examples of the expected content) 
      cy.contains('recipies!').should('be.visible'); 
      cy.get('button').should('be.visible'); 
    });
  });