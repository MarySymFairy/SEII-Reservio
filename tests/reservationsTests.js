const http = require('http');
const test = require('ava');
const got = require('got');
const listen = require('test-listen');
const app = require('../index.js');

test.before(async t => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const {port} = server.address();
    t.context.got = got.extend({responseType: 'json', prefixUrl: `http://localhost:${port}`});
});

test.after.always(t => {
    t.context.server.close();
});

// Happy path: Add reservation
test("Post /reservations - Add reservation (happy path)", async t => {
        const body = {
                userId: 1,
                businessId: 1,
                reservationTime: "18:00",
                reservationYear: 2024,
                reservationMonth: 12,
                reservationDay: 15,
                numberOfPeople: 4
        };
        const {body: response, statusCode} = await t.context.got.post('reservations', {json: body});
        t.is(statusCode, 200);
        t.is(response.businessName, "businessName");
        t.is(response.numberOfPeople, 4);
});

// Error case: Missing fields
test("Post /reservations - Add reservation (missing fields)", async t => {
        const body = {
                userId: 1,
                businessId: 1,
                reservationTime: "18:00",
                reservationYear: 2024,
                reservationMonth: 12,
                reservationDay: 15
        };
        const error = await t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "Missing required fields");
});

// Happy path: Delete reservation
test("DELETE /reservations/:id - Delete reservation (happy path)", async (t) => {
        const { body, statusCode } = await t.context.got.delete("reservations/1");
        t.is(statusCode, 200);
        t.is(body.message, "Reservation deleted.");
});

// Error case: Delete nonexistent reservation
test("DELETE /reservations/:id - Delete nonexistent reservation", async (t) => {
        const error = await t.throwsAsync(() => t.context.got.delete("reservations/9999"));
        t.is(error.response.statusCode, 404);
        t.is(error.response.body.message, "Reservation not found.");
});

// Happy path: Modify reservation
test("PUT /reservations/:id - Modify reservation (happy path)", async (t) => {
        const body = {
                reservationTime: "19:00",
                numberOfPeople: 5,
        };

        const { body: response, statusCode } = await t.context.got.put("reservations/1", { json: body });
        t.is(statusCode, 200);
        t.is(response.numberOfPeople, 5);
});

// Error case: Modify nonexistent reservation
test("PUT /reservations/:id - Modify nonexistent reservation", async (t) => {
        const body = { numberOfPeople: 3 };
        const error = await t.throwsAsync(() => t.context.got.put("reservations/9999", { json: body }));
        t.is(error.response.statusCode, 404);
        t.is(error.response.body.message, "Reservation not found.");
});

// Happy path: Get reservation
test("GET /reservations/:id - Get reservation (happy path)", async (t) => {
        const { body, statusCode } = await t.context.got.get("reservations/1");
        t.is(statusCode, 200);
        t.is(body.userId, 1);
        t.is(body.businessId, 1);
        t.is(body.reservationTime, "18:00");
});

// Error case: Get nonexistent reservation
test("GET /reservations/:id - Get nonexistent reservation", async (t) => {
        const error = await t.throwsAsync(() => t.context.got.get("reservations/9999"));
        t.is(error.response.statusCode, 404);
        t.is(error.response.body.message, "Reservation not found.");
});

// Additional Tests

// Happy path: Get all reservations
test("GET /reservations - Retrieve all reservations (happy path)", async t => {
    const { body, statusCode } = await t.context.got.get("reservations");
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.true(body.length > 0);
});

// Error case: Get reservations with invalid query parameters ???
test("GET /reservations - Retrieve reservations with invalid query parameters (error case)", async t => {
    const response = await t.context.got.get("reservations", { searchParams: { invalidParam: "test" }});
    t.is(response.statusCode, 400);
    t.is(response.body.message, "Invalid query parameter");
});



// Error case: Add reservation with invalid data types
test("Post /reservations - Add reservation with invalid data types (error case)", async t => {
    const body = {
        userId: "one", // Should be number
        businessId: 1,
        reservationTime: "18:00",
        reservationYear: 2024,
        reservationMonth: 12,
        reservationDay: 15,
        numberOfPeople: "four" // Should be number
    };
    const error = await t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid data types");
});

// GET /reservations/availability - Retrieve reservation availability (happy path)
test("GET /reservations/availability - Retrieve reservation availability (happy path)", async t => {
    const query = {
        businessId: 1,
        reservationDay: 15,
        reservationMonth: 12,
        reservationYear: 2024,
        numberOfPeople: 4
    };
    const { body, statusCode } = await t.context.got.get("reservations/availability", { searchParams: query });
    t.is(statusCode, 200);
    t.true(Array.isArray(body.availableHours));
    t.true(body.availableHours.length > 0);
});

// GET /reservations/availability - Retrieve reservation availability with invalid businessId (error case)
test("GET /reservations/availability - Retrieve reservation availability with invalid businessId (error case)", async t => {
    const query = {
        businessId: 9999, // non-existent businessId
        reservationDay: 15,
        reservationMonth: 12,
        reservationYear: 2024,
        numberOfPeople: 4
    };
    const { body, statusCode } = await t.context.got.get("reservations/availability", { searchParams: query });
    t.is(statusCode, 404);
    t.is(body.message, "Business not found.");
});

// GET /reservations/{reservation-id}/notification - Notify user about reservation (happy path)
test("GET /reservations/{reservation-id}/notification - Notify user (happy path)", async t => {
    const reservationId = 1;
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`);
    t.is(statusCode, 200);
    t.is(body.message, "Notification sent successfully.");
});

// GET /reservations/{reservation-id}/notification - Notify user about non-existent reservation (error case)
test("GET /reservations/{reservation-id}/notification - Notify user about non-existent reservation (error case)", async t => {
    const reservationId = 9999; // non-existent reservationId
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`);
    t.is(statusCode, 404);
    t.is(body.message, "Reservation not found.");
});
