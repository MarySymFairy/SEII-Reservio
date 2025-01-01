const test = require('ava'); // Test framework
const got = require('got'); // HTTP client for requests
const http = require('http'); // HTTP server
const app = require('../index.js'); // Import the app to test

// Setup: Start the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app); // Create server instance
    const server = t.context.server.listen(); // Start listening
    const { port } = server.address(); // Get the server's port
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` }); // Create a got instance with the server's base URL
});

// Cleanup: Close the server after all tests
test.after.always((t) => {
    t.context.server.close(); // Ensure the server is closed after tests
});

// Test: Fetch valid business statistics
test("GET /business-statistics?businessId&ownerId - Should return a list of business statistics for a valid businessId and ownerId", async (t) => {
    const { body, statusCode } = await t.context.got.get('business-statistics?ownerId=7&businessId=8');
    // Assert the status code is 200
    t.is(statusCode, 200, "Response status should be 200");
    // Assert the response is an array and not empty
    t.true(Array.isArray(body), "Response body should be an array");
    t.true(body.length > 0, "Response body should not be empty");

    // Assert the response contains expected properties
    const businessStatistics = body[0];
    t.not(businessStatistics.businessId, undefined, "Business should have a businessId");
    t.not(businessStatistics.ownerId, undefined, "Business should have an ownerId");
    t.not(businessStatistics.month, undefined, "Business should have a month");
    t.not(businessStatistics.numberOfReservations, undefined, "Business should have a numberOfReservations");
});

// Test: Invalid ownerId
test("GET /business-statistics?businessId&ownerId - Should return an error message for an invalid ownerId", async (t) => {
    const invalid_ownerId = "invalidOwnerId"; // Example of invalid ownerId
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=1&ownerId=${invalid_ownerId}`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Invalid businessId
test("GET /business-statistics?businessId&ownerId - Should return an error message for an invalid businessId", async (t) => {
    const invalid_businessId = "invalidBusinessId"; // Example of invalid businessId
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=${invalid_businessId}&ownerId=1`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty ownerId
test("GET /business-statistics?businessId&ownerId - Should return an error message for an empty ownerId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=8&ownerId=`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty businessId
test("GET /business-statistics?businessId&ownerId - Should return an error message for an empty businessId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=&ownerId=7`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty ownerId and businessId
test("GET /business-statistics?businessId&ownerId - Should return an error message for an empty ownerId and businessId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=&ownerId=`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Invalid ownerId and businessId
test("GET /business-statistics?businessId&ownerId - Should return an error message for an invalid ownerId and businessId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=ab&ownerId=ab`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Not found business statistics
test("GET /business-statistics?businessId&ownerId - Should return an error message for not found business statistics", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`business-statistics?businessId=999&ownerId=999`));
    // Assert the status code is 404
    t.is(error.response.statusCode, 404, "Response status should be 404");
});
