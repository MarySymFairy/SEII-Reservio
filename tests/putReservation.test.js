const http = require("http"); // HTTP server
const test = require("ava"); // Test framework
const got = require("got"); // HTTP client for making requests

const app = require('../index.js'); // Import the app to test

// Setup: Start the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app); // Create server instance
    const server = t.context.server.listen(); // Start the server and listen on a dynamic port
    const { port } = server.address(); // Retrieve the port the server is using
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` }); // Initialize got with base URL
});

// Cleanup: Close the server after all tests
test.after.always(t => {
    t.context.server.close(); // Ensure the server is closed after tests
});

// Happy Scenario: Successful PUT request
test('PUT /reservations/:reservationId - successful case', async t => {
    try {
        // Make a successful PUT request with valid data
        const response = await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6,
            },
            json: {
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

        // Validate response status and body
        t.is(response.statusCode, 200, "Response status should be 200");
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
        console.error('Error:', error.response ? error.response.body : error.message); // Log the error for debugging
        t.fail('Request failed');
    }
});

// Unhappy Scenario: Missing userId in query parameters
test('PUT /reservations/:reservationId - missing userId', async t => {
    try {
        // Make a PUT request with missing userId
        await t.context.got.put('reservations/0?userId=', {
            json: {
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        // Validate the error response
        t.is(error.response.statusCode, 400, "Response status should be 400");
        t.regex(error.response.body.message, /userId/, "Error message should mention missing userId");
    }
});

// Unhappy Scenario: Missing reservationId in the URL path
test('PUT /reservations/:reservationId - missing reservationId', async t => {
    try {
        // Make a PUT request without a reservationId
        await t.context.got.put('reservations/?userId=6', {
            searchParams: {
                userId: 6,
            },
            json: {
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        // Validate the error response
        t.is(error.response.statusCode, 400, "Response status should be 400");
        t.regex(error.response.body.message, /reservationId/, "Error message should mention missing reservationId");
    }
});

// Unhappy Scenario: Invalid reservationTime format
test('PUT /reservations/:reservationId - invalid reservationTime format', async t => {
    try {
        // Make a PUT request with an invalid reservationTime
        await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6,
            },
            json: {
                reservationTime: "25:00", // Invalid time
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        // Validate the error response
        t.is(error.response.statusCode, 400, "Response status should be 400");
        t.regex(error.response.body.message, /reservationTime/, "Error message should mention invalid reservationTime");
    }
});

// Unhappy Scenario: Reservation date in the past
test('PUT /reservations/:reservationId - reservation date in the past', async t => {
    try {
        // Make a PUT request with a past reservation date
        await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6,
            },
            json: {
                reservationTime: "18:00",
                reservationDay: 1,
                reservationMonth: 1,
                reservationYear: 2020, // Past year
                numberOfPeople: 4,
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        // Validate the error response
        t.is(error.response.statusCode, 400, "Response status should be 400");
        t.regex(error.response.body.message, /reservationYear/, "Error message should mention reservationYear");
    }
});

// Unhappy Scenario: Invalid numberOfPeople
test('PUT /reservations/:reservationId - invalid numberOfPeople', async t => {
    try {
        // Make a PUT request with an invalid numberOfPeople
        await t.context.got.put('reservations/0?userId=6', {
            searchParams: {
                userId: 6,
            },
            json: {
                reservationTime: "18:00",
                reservationDay: 15,
                reservationMonth: 10,
                reservationYear: 2025,
                numberOfPeople: 0, // Invalid value
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        // Validate the error response
        t.is(error.response.statusCode, 400, "Response status should be 400");
        t.regex(error.response.body.message, /numberOfPeople/, "Error message should mention invalid numberOfPeople");
    }
});
