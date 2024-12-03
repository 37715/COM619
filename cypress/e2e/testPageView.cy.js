describe('Page View-ability Test', () => {
    it('should load the index page and display the expected content', () => {
      // Visit the URL where the page is served locally
      cy.visit('/'); 
      // check the page is correctly loaded (contains Select examples of the expected content) 
      cy.contains('Recipes!').should('be.visible'); 
      cy.get('button').should('be.visible'); 
    });
  });