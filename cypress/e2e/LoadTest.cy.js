describe('Home Page Load Test', () => {
  it('should load the home page', () => {
    cy.visit('/'); 
    cy.contains('Recipes!'); 
  });
});
