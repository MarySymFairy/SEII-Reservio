const http = require("http"); // HTTP server module
const test = require("ava"); // Test framework
const got = require("got"); // HTTP client for making requests

const app = require('../index.js'); // Import the application to test

// Setup: Start the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app); // Create server instance
    const server = t.context.server.listen(); // Start the server
    const { port } = server.address(); // Get the port assigned to the server
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` }); // Configure the HTTP client with the server URL
});

// Cleanup: Close the server after all tests
test.after.always(t => {
    t.context.server.close(); // Ensure the server is stopped after tests
});

// Happy Scenario: Successful PUT request with valid data
test('PUT /reservations/:reservationId - successful case', async t => {
    try {
        // Send a valid PUT request with appropriate data
        const response = await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6, // User ID as a query parameter
            },
            json: { // JSON payload for the request
                reservationId: 0,
                userId: 6,
                businessId: 1,
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
                username: "username",
                businessName: "businessName",
            },
        });

        // Assert that the response status is 200 and the body matches the expected result
        t.is(response.statusCode, 200);
        t.deepEqual(response.body, {
            reservationId: 0,
            userId: 6,
            businessId: 1,
            reservationTime: "18:00",
            reservationDay: 15,
            reservationMonth: 10,
            reservationYear: 2025,
            numberOfPeople: 4,
            username: "username",
            businessName: "businessName",
        });
    } catch (error) {
        // Log the error and fail the test if the request fails unexpectedly
        console.error('Error:', error.response ? error.response.body : error.message);
        t.fail('Request failed');
    }
});

// Unhappy Scenario: Missing userId in query parameters
test('PUT /reservations/:reservationId - missing userId', async t => {
    try {
        // Send a PUT request with a missing userId
        await t.context.got.put('reservations/{reservationId}=0?userId=', {
            json: { // JSON payload with valid reservation data
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed'); // Fail the test if no error occurs
    } catch (error) {
        // Assert that the response status is 400 and the error mentions userId
        t.is(error.response.statusCode, 400);
        t.regex(error.response.body.message, /userId/);
    }
});

// Unhappy Scenario: Missing reservationId in the URL path
test('PUT /reservations/:reservationId - missing reservationId', async t => {
    try {
        // Send a PUT request without a reservationId
        await t.context.got.put('reservations/{reservationId}=?userId=6', {
            searchParams: {
                userId: 6, // User ID in query parameters
            },
            json: { // Valid reservation data
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed'); // Fail the test if no error occurs
    } catch (error) {
        // Assert that the response status is 400 and the error mentions reservationId
        t.is(error.response.statusCode, 400);
        t.regex(error.response.body.message, /reservationId/);
    }
});

// Unhappy Scenario: Invalid reservationTime format
test('PUT /reservations/:reservationId - invalid reservationTime format', async t => {
    try {
        // Send a PUT request with an invalid reservationTime
        await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6, // Valid userId
            },
            json: {
                reservationTime: "25:00", // Invalid time format
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed'); // Fail the test if no error occurs
    } catch (error) {
        // Assert that the response status is 400 and the error mentions reservationTime
        t.is(error.response.statusCode, 400);
        t.regex(error.response.body.message, /reservationTime/);
    }
});

// Unhappy Scenario: Reservation date in the past
test('PUT /reservations/:reservationId - reservation date in the past', async t => {
    try {
        // Send a PUT request with a past reservation date
        await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6, // Valid userId
            },
            json: {
                reservationTime: "18:00",
                reservationDay: 1,
                reservationMonth: 1,
                reservationYear: 2020, // Past year
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed'); // Fail the test if no error occurs
    } catch (error) {
        // Assert that the response status is 400 and the error mentions reservationYear
        t.is(error.response.statusCode, 400);
        t.regex(error.response.body.message, /request.body.reservationYear should be >= 2024/);
    }
});

// Unhappy Scenario: Invalid numberOfPeople
test('PUT /reservations/:reservationId - invalid numberOfPeople', async t => {
    try {
        // Send a PUT request with an invalid numberOfPeople value
        await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6, // Valid userId
            },
            json: {
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 0, // Invalid number of people
            },
        });
        t.fail('Request should have failed'); // Fail the test if no error occurs
    } catch (error) {
        // Assert that the response status is 400 and the error mentions numberOfPeople
        t.is(error.response.statusCode, 400);
        t.regex(error.response.body.message, /numberOfPeople/);
    }
});
