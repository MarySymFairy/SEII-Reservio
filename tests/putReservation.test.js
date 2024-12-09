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

// Define a sample reservation ID for test cases
const reservationId = 1;


//PUT--------------------------------------------------------------------------------
// Happy path: Modify reservation
test("PUT /reservations/:id - Modify reservation (happy path)", async (t) => {
        const body = {
                reservationTime: "19:00",
                numberOfPeople: 5,
        };

        const { body: response, statusCode } = await t.context.got.put(`reservations/${reservationId}`, { json: body });
        t.is(statusCode, 200);
        t.is(response.numberOfPeople, 5);
});

// Error case: Modify nonexistent reservation
test("PUT /reservations/:id - Modify nonexistent reservation", async (t) => {
    const reservationId = 9999; // Simulate a non-existent ID

    const body = { numberOfPeople: 3 };
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: body }));
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "Reservation not found.");
});

// Error case: Modify reservation with invalid ID format
test("PUT /reservations/:id - Modify reservation with invalid ID format", async (t) => {
    const reservationId = "invalid-id";
    const body = { numberOfPeople: 3 };
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: body }));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid reservation ID format.");
});
    
    // Error case: Modify reservation without body
test("PUT /reservations/:id - Modify reservation with empty body", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: {} }));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Request body cannot be empty.");
});
    
// Error case: Modify reservation with invalid body structure
test("PUT /reservations/:id - Modify reservation with invalid body structure", async (t) => {
    const body = { unknownField: "value" }; // Invalid field
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: body }));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid request body.");
});
    
// Error case: Modify reservation with unauthorized user
test("PUT /reservations/:id - Unauthorized modify request", async (t) => {
    const body = { numberOfPeople: 4 };
    const error = await t.throwsAsync(() => 
        t.context.got.put(`reservations/${reservationId}`, {
            json: body,
            headers: { Authorization: "InvalidToken" },
        })
    );
    t.is(error.response.statusCode, 401);
    t.is(error.response.body.message, "Unauthorized access.");
});
    
// Error case: Modify reservation with missing required fields
test("PUT /reservations/:id - Missing required fields in body", async (t) => {
    const body = { numberOfPeople: null }; // Missing a valid value
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: body }));
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Missing or invalid required fields.");
});
    
// Error case: Modify reservation causing constraint violations
test("PUT /reservations/:id - Modify reservation with constraint violation", async (t) => {
    const body = { reservationTime: "25:00" }; // Invalid time format
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: body }));
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Invalid reservation time format.");
});
    
// Error case: Modify reservation that belongs to another user
test("PUT /reservations/:id - Modify reservation belonging to another user", async (t) => {
    const body = { numberOfPeople: 3 };
    const error = await t.throwsAsync(() => t.context.got.put(`reservations/${reservationId}`, { json: body }));
    t.is(error.response.statusCode, 403);
    t.is(error.response.body.message, "You are not authorized to modify this reservation.");
});   


//INVALID FORMATS
// Error case: Invalid date format
test("PUT /reservations/:id - Invalid date format", async (t) => {
    const body = { reservationDate: "15-06-2023" }; // Incorrect format
    const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid date format.");
});

// Error case: Reservation time in invalid format
test("PUT /reservations/:id - Reservation time invalid format", async (t) => {
    const body = { reservationTime: "6 PM" }; // Incorrect format
    const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid time format.");
});

// Error case: Invalid day for February in non-leap year
test("PUT /reservations/:id - Invalid day for February in non-leap year", async (t) => {
    const body = { reservationDate: "2023-02-29" }; // Non-leap year
    const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Invalid date.");
});

// Happy path: Valid day for February in leap year
test("PUT /reservations/:id - Valid day for February in leap year", async (t) => {
    const body = { reservationDate: "2024-02-29" }; // Leap year
    const { body: response, statusCode } = await t.context.got.put("reservations/1", { json: body });
    t.is(statusCode, 200);
    t.is(response.reservationDate, "2024-02-29");
});

// Error case: Invalid day for 30-day month
test("PUT /reservations/:id - Invalid day for a 30-day month", async (t) => {
    const body = { reservationDate: "2023-04-31" }; // April has 30 days
    const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Invalid date.");
});

// Error case: Reservation date before minimum allowed date
test("PUT /reservations/:id - Reservation date below minimum allowed", async (t) => {
    const body = { reservationDate: "2020-01-01" }; // Assuming 2021 is the minimum year
    const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Reservation date is out of allowed range.");
});

// Happy path: Reservation date within allowed range
test("PUT /reservations/:id - Reservation date within allowed range", async (t) => {
    const body = { reservationDate: "2023-06-15" }; // Within range
    const { body: response, statusCode } = await t.context.got.put("reservations/1", { json: body });
    t.is(statusCode, 200);
    t.is(response.reservationDate, "2023-06-15");
});