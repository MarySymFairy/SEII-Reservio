const http = require("http"); // HTTP server module
const test = require("ava"); // Test framework
const got = require("got"); // HTTP client for making requests

const app = require('../index.js'); // Import the application to test

// Setup: Start the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app); // Create a server instance
    const server = t.context.server.listen(); // Start the server
    const { port } = server.address(); // Get the port assigned to the server
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` }); // Configure the HTTP client with the server URL
});

// Cleanup: Close the server after all tests
test.after.always((t) => {
    t.context.server.close(); // Ensure the server is stopped after tests
});

// Test: Valid request with all parameters
test("GET /reservations/availability - Should return the availability of a business based on the specific parameters", async (t) => {
    const { body, statusCode } = await t.context.got.get("reservations/availability?businessId=1&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=7");
    // Assert the status code is 200
    t.is(statusCode, 200, "Response status should be 200");
    // Assert the response is an array and not empty
    t.true(Array.isArray(body), "Response body should be an array");
    t.true(body.length > 0, "Response body should not be empty");

    // Assert the elements in the array are strings
    t.true(body.every(item => typeof item === "string"), "Each item in the response array should be a string");
});

// Test: Invalid businessId
test("GET /reservations/availability - Should return an error message for an invalid businessId", async (t) => {
    const invalid_businessId = "invalidBusinessId"; // Invalid businessId
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=${invalid_businessId}&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Invalid reservationDay
test("GET /reservations/availability - Should return an error message for an invalid reservationDay", async (t) => {
    const invalid_reservationDay = "invalidReservationDay"; // Invalid reservationDay
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=${invalid_reservationDay}&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Invalid reservationMonth
test("GET /reservations/availability - Should return an error message for an invalid reservationMonth", async (t) => {
    const invalid_reservationMonth = "invalidReservationMonth"; // Invalid reservationMonth
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=5&reservationMonth=${invalid_reservationMonth}&reservationYear=2025&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Invalid reservationYear
test("GET /reservations/availability - Should return an error message for an invalid reservationYear", async (t) => {
    const invalid_reservationYear = "invalidReservationYear"; // Invalid reservationYear
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=5&reservationMonth=5&reservationYear=${invalid_reservationYear}&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Invalid numberOfPeople
test("GET /reservations/availability - Should return an error message for an invalid numberOfPeople", async (t) => {
    const invalid_numberOfPeople = "invalidNumberOfPeople"; // Invalid numberOfPeople
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=${invalid_numberOfPeople}`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty businessId
test("GET /reservations/availability - Should return an error message for an empty businessId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty reservationDay
test("GET /reservations/availability - Should return an error message for an empty reservationDay", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty reservationMonth
test("GET /reservations/availability - Should return an error message for an empty reservationMonth", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=5&reservationMonth=&reservationYear=2025&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty reservationYear
test("GET /reservations/availability - Should return an error message for an empty reservationYear", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=5&reservationMonth=5&reservationYear=&numberOfPeople=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty numberOfPeople
test("GET /reservations/availability - Should return an error message for an empty numberOfPeople", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Not found availability for specific parameters
test("GET /reservations/availability - Should return a not found availability", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=1&reservationDay=2&reservationMonth=5&reservationYear=2026&numberOfPeople=2`));
    // Assert the status code is 404
    t.is(error.response.statusCode, 404, "Response status should be 404");
});
