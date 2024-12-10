describe('Login Test', () => {
  it('should attempt to log in with invalid credentials', () => {
    // Visit the login page
        cy.visit('/'); 
		cy.contains('Recipes!'); 

    // Find the username and password input fields and enter values
    cy.get('#login-username').type('your-username') // Replace with your username
    cy.get('#login-password').type('your-password') // Replace with your password

    // Find the login button and click it
    cy.get('#Formbutton_SignIn').click() // Adjust this selector based on your button's HTML

    // Add an assertion to verify that login was successful
    // For example, verify the URL changes to the dashboard or home page
    cy.url().should('include', '/dashboard') // Adjust based on the expected URL

    // Or, verify that the user is redirected to a specific page
    cy.get('.user-greeting').should('contain', 'Welcome, your-username') // Adjust based on your application
  })
})