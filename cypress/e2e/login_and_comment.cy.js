describe('Login Test', () => {
  it('should log in with valid credentials', () => {
    // Visit the login page
        cy.visit('/'); 
		cy.contains('Recipes!'); 

    // Find the username and password input fields and enter values
    cy.get('#login-username').type('test_user') 
    cy.get('#login-password').type('Test_password') 

    // Find the login button and click it
    cy.get('#Formbutton_SignIn').click()
	//check that login was successful
    cy.get('#welcome-message').should('contain', 'Welcome, test_user') // Adjust based on your application
	cy.get('#RC_AddComment_Input').type('This is a test Comment by a test user') 
	cy.get('#RC_AddComment_Button').click()
  })
})