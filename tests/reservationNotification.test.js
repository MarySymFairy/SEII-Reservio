const http = require("http");

const test = require("ava");
const got = require("got");

const app = require('../index.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const {port} = server.address();
    t.context.got = got.extend({responseType: 'json', prefixUrl: `http://localhost:${port}`});
});

test.after.always((t) => {
    t.context.server.close();
});

//GET NOTIFICATION---------------------------------------------------------------------
// GET /reservations/{reservation-id}/notification - Notify user about reservation (happy path)
test("GET /reservations/{reservation-id}/notification - Notify user (happy path)", async (t) => {
    const reservationId = 1;
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`);
    t.is(statusCode, 200);
    t.is(body.message, "Notification sent successfully.");
});

// GET /reservations/{reservation-id}/notification - Notify user about non-existent reservation (error case)
test("GET /reservations/{reservation-id}/notification - Notify user about non-existent reservation (error case)", async (t) => {
    const reservationId = 9999; // non-existent reservationId
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`);
    t.is(statusCode, 404);
    t.is(body.message, "Reservation not found.");
});

// GET /reservations/{reservation-id}/notification - Notify user about invalid reservation ID (unhappy path)
test("GET /reservations/{reservation-id}/notification - Notify user with invalid reservation ID", async (t) => {
    const invalidReservationId = "invalid-id"; // Invalid ID format
    const { body, statusCode } = await t.context.got.get(`reservations/${invalidReservationId}/notification`, { throwHttpErrors: false });
    t.is(statusCode, 400); // Assuming 400 Bad Request for invalid input
    t.is(body.message, "Invalid reservation ID.");
});

// GET /reservations/{reservation-id}/notification - Unauthorized access (unhappy path)
test("GET /reservations/{reservation-id}/notification - Unauthorized access", async (t) => {
    const reservationId = 1;
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`, {
        throwHttpErrors: false,
        headers: { Authorization: "InvalidToken" }, // Simulating unauthorized access
    });
    t.is(statusCode, 401); // Assuming 401 Unauthorized
    t.is(body.message, "Unauthorized access.");
});

// GET /reservations/{reservation-id}/notification - Missing reservation ID in the URL (unhappy path)
test("GET /reservations/{reservation-id}/notification - Missing reservation ID", async (t) => {
    const { body, statusCode } = await t.context.got.get(`reservations//notification`, { throwHttpErrors: false });
    t.is(statusCode, 400); // Assuming 400 Bad Request for malformed request
    t.is(body.message, "Missing reservation ID.");
});

// GET /reservations/{reservation-id}/notification - Notify user for a deleted reservation (unhappy path)
test("GET /reservations/{reservation-id}/notification - Deleted reservation", async (t) => {
    const deletedReservationId = 2; // Simulating a reservation that has been deleted
    const { body, statusCode } = await t.context.got.get(`reservations/${deletedReservationId}/notification`, { throwHttpErrors: false });
    t.is(statusCode, 410); // Assuming 410 Gone for deleted resources
    t.is(body.message, "Reservation has been deleted.");
});