describe('User Page Button Test', () => {
    it('should load the index page, click on the go to user page button and display the user Page content', () => {
        // Visit the URL where the page is hosted locally
        cy.visit('/'); 
        // check the page is correctly loaded (contains Select examples of the expected content) 
        cy.contains('Recipes!').should('be.visible'); 
        // get button with correct text and click on it (Navigate to user page)
        cy.get('button').contains('Go to User Page').click();
        // check User Profile title is displayed (shows nav has worked)
        cy.contains('User Profile').should('be.visible'); 
        
    });
});