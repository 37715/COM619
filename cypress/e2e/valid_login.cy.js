describe('Login Test', () => {
  it('should log in with valid credentials', () => {
    // Visit the login page
        cy.visit('/'); 
		cy.contains('Recipes!'); 

    // Find the username and password input fields and enter values
    cy.get('#login-username').type('test_user') // Replace with your username
    cy.get('#login-password').type('Test_password') // Replace with your password

    // Find the login button and click it
    cy.get('#Formbutton_SignIn').click() // Adjust this selector based on your button's HTML

    // Or, verify that the user is redirected to a specific page
    cy.get('#welcome-message').should('contain', 'Welcome, test_user') // Adjust based on your application
  })
})