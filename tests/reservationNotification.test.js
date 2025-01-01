// Import required modules
const http = require("http");
const test = require("ava"); // Test framework
const got = require("got"); // HTTP client

const app = require('../index.js'); // Import the app to test

// Setup: Start the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app); // Create the server
    const server = t.context.server.listen(); // Start listening
    const { port } = server.address(); // Get the server's port
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` }); // Create a got instance with the server's base URL
});

// Cleanup: Close the server after tests
test.after.always((t) => {
    t.context.server.close(); // Ensure the server is closed after tests
});

// Test: Fetch notifications for a valid reservationId and userId
test("GET /reservations/reservationId/notification?userId - Should return a notifications for the reservation", async (t) => {
    const { body, statusCode } = await t.context.got.get("reservations/0/notification?userId=6");
    // Check that the response status code is 200
    t.is(statusCode, 200, "Response status should be 200");
    // Ensure the response body is an array
    t.true(Array.isArray(body), "Response body should be an array");
    // Check that the array is not empty
    t.true(body.length > 0, "Response body should not be empty");

    const notification = body[0];
    // Ensure the notification contains a message
    t.not(notification.message, undefined, "Notification should have a message");
});

// Test: Fetch notifications with an invalid userId
test("GET /reservations/reservationId/notification?userId - Should return an error message for an invalid userId", async (t) => {
    const invalid_userId = "invalidUserId"; // Invalid userId
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/0/notification?userId=${invalid_userId}`));
    // Check that the response status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Fetch notifications with an invalid reservationId
test("GET /reservations/reservationId/notification?userId - Should return an error message for an invalid reservationId", async (t) => {
    const invalid_reservationId = "invalidReservationId"; // Invalid reservationId
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/${invalid_reservationId}/notification?userId=6`));
    // Check that the response status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Fetch notifications with an empty userId
test("GET /reservations/reservationId/notification?userId - Should return an error message for an empty userId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/0/notification?userId=`));
    // Check that the response status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Fetch notifications for a non-existent reservationId and userId combination
test("GET /reservations/reservationId/notification?userId - Should return an error message for a not found reservation with this userId and reservationId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/4/notification?userId=0`));
    // Check that the response status code is 404
    t.is(error.response.statusCode, 404, "Response status should be 404");
});
