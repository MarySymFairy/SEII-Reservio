// Tests for Reservation API functionalities
describe('Reservation API Tests', () => {
  const baseUrl = 'http://localhost:8080'; // Replace with your actual base URL

  // Runs before each test: Navigate to the API documentation page
  beforeEach(() => {
    cy.visit(`${baseUrl}/docs`);
  });

  // Test to fetch businesses by category
  it('Should fetch available businesses by category', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/businesses`,
      qs: {
        categoryName: 'breakfast', // Example category for the query
      }
    }).then((response) => {
      // Assert that the request was successful
      expect(response.status).to.eq(200);
      // Assert the response body is an array of businesses
      expect(response.body).to.be.an('array');
      // Assert each business has the required properties
      expect(response.body[0]).to.have.property('businessName');
      expect(response.body[0]).to.have.property('categoryName', 'breakfast');
    });
  });

  // Test to fetch available hours for a reservation
  it('Should fetch available hours for a reservation', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/reservations/availability`,
      qs: {
        businessId: 1, // Business ID for the query
        reservationDay: 25,
        reservationMonth: 12,
        reservationYear: 2025,
        numberOfPeople: 2,
      }
    }).then((response) => {
      // Assert that the request was successful
      expect(response.status).to.eq(200);
      // Assert the response body is an array of available hours
      expect(response.body).that.is.an('array');
      // Assert each time is in HH:mm format
      expect(response.body[0]).to.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/); // HH:mm format
    });
  });

  // Test to make a reservation
  it('Should allow a user to make a reservation', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/reservations`,
      body: {
        reservationTime: '18:00', // Reservation time
        reservationDay: 25,
        reservationMonth: 12,
        reservationYear: 2025,
        numberOfPeople: 3,
        username: 'test_user', // Example username
        businessName: 'Test Business', // Example business name
        userId: 6,
        businessId: 1,
        reservationId: 0,
      },
      qs: {
        userId: 6,
        businessId: 1,
      },
      headers: {
        'Content-Type': 'application/json', // JSON content type
      },
    }).then((response) => {
      // Assert that the request was successful
      expect(response.status).to.eq(200);
      // Assert the response includes reservation details
      expect(response.body).to.have.property('reservationId');
      expect(response.body).to.have.property('reservationTime', '18:00');
    });
  });

  // Test to fetch all reservations for a user
  it('Should fetch all reservations for a user', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/reservations`,
      qs: {
        userId: 6, // User ID for the query
      }
    }).then((response) => {
      // Assert that the request was successful
      expect(response.status).to.eq(200);
      // Assert the response body is an array of reservations
      expect(response.body).to.be.an('array');
      if (response.body.length > 0) {
        // Assert each reservation has the required properties
        expect(response.body[0]).to.have.property('reservationId');
        expect(response.body[0]).to.have.property('userId', 6);
      }
    });
  });

  // Test to delete a reservation
  it('Should delete a reservation', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/reservations/0`, // Example reservation ID
      qs: {
        userId: 6, // User ID for the query
      }
    }).then((response) => {
      // Assert that the request was successful
      expect(response.status).to.eq(200);
      // Assert the response includes a success message
      expect(response.body).to.have.property('message', 'Reservation deleted.');
    });
  });
});
