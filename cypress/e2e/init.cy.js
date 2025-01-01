// Tests for the Swagger /docs page of the Reservio API
describe('Swagger /docs Page Test', () => {
  
  // Runs before each test case: Navigate to the Swagger docs page
  beforeEach(() => {
    cy.visit('http://localhost:8080/docs'); // Load the Swagger documentation page
  });

  // Test to verify that the page title is correctly displayed
  it('Title exists', () => {
    cy.get('.title') // Select the title element
      .should('contain.text', 'RESERVIO API'); // Assert the title contains the expected text
  });

  // Test to verify that the page description is present
  it('Description exists', () => {
    cy.get('.description') // Select the description element
      .should('include.text', 'Software Engineering II Course Reservio API'); // Assert the description includes the expected text
  });

  // Test to check that all endpoint types are displayed
  it('All types of endpoints exists', () => {
    cy.get('.opblock-tag') // Select all endpoint tags
      .should('have.length', 5); // Assert there are 5 endpoint types displayed
  });

  // Test to click on the "businesses" endpoint
  it('Click on businesses endpoint', () => {
    cy.get('#operations-business-getBusinessesByCategory') // Select the "getBusinessesByCategory" endpoint
      .click(); // Simulate a click on the endpoint
  });

  // Test to verify that the description of the "businesses" endpoint is displayed
  it('Open businesses endpoint should include description', () => {
    cy.get('#operations-business-getBusinessesByCategory') // Select the "getBusinessesByCategory" endpoint
      .click() // Open the endpoint
      .find('.opblock-description') // Select the description element of the endpoint
      .should('include.text', 'FR1: The logged in user must be able to view the businesses that are included in the system divided by categories.'); // Assert the description matches the expected text
  });

  // Test to click on the "reservations" endpoint
  it('Click on reservations endpoint', () => {
    cy.get('#operations-reservation-viewReservations') // Select the "viewReservations" endpoint
      .click(); // Simulate a click on the endpoint
  });

  // Test to verify that the description of the "reservations" endpoint is displayed
  it('Open reservations endpoint should include description', () => {
    cy.get('#operations-reservation-viewReservations') // Select the "viewReservations" endpoint
      .click() // Open the endpoint
      .find('.opblock-description') // Select the description element of the endpoint
      .should('include.text', 'FR10: The logged in user must be able to view his reservations.'); // Assert the description matches the expected text
  });
});
