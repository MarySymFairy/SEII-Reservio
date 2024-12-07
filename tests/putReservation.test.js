const http = require("node:http");

const test = require("ava");
const got = require("got");
const listen = require("test-listen");

const app = require('../index.js');

// Initialize the test environment
test.before(async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({
      prefixUrl: t.context.prefixUrl,
      responseType: "json",
      throwHttpErrors: false,
    });
  });
  
  // Cleanup after tests
  test.after.always((t) => {
    t.context.server.close();
  });


//PUT--------------------------------------------------------------------------------
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

// Error case: Modify reservation with invalid ID format
test("PUT /reservations/:id - Modify reservation with invalid ID format", async (t) => {
        const body = { numberOfPeople: 3 };
        const error = await t.throwsAsync(() => t.context.got.put("reservations/invalid-id", { json: body }));
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "Invalid reservation ID format.");
    });
    
    // Error case: Modify reservation without body
    test("PUT /reservations/:id - Modify reservation with empty body", async (t) => {
        const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: {} }));
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "Request body cannot be empty.");
    });
    
    // Error case: Modify reservation with invalid body structure
    test("PUT /reservations/:id - Modify reservation with invalid body structure", async (t) => {
        const body = { unknownField: "value" }; // Invalid field
        const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "Invalid request body.");
    });
    
    // Error case: Modify reservation with unauthorized user
    test("PUT /reservations/:id - Unauthorized modify request", async (t) => {
        const body = { numberOfPeople: 4 };
        const error = await t.throwsAsync(() => 
            t.context.got.put("reservations/1", {
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
        const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
        t.is(error.response.statusCode, 422);
        t.is(error.response.body.message, "Missing or invalid required fields.");
    });
    
    // Error case: Modify reservation causing constraint violations
    test("PUT /reservations/:id - Modify reservation with constraint violation", async (t) => {
        const body = { reservationTime: "25:00" }; // Invalid time format
        const error = await t.throwsAsync(() => t.context.got.put("reservations/1", { json: body }));
        t.is(error.response.statusCode, 422);
        t.is(error.response.body.message, "Invalid reservation time format.");
    });
    
    // Error case: Modify reservation that belongs to another user
    test("PUT /reservations/:id - Modify reservation belonging to another user", async (t) => {
        const body = { numberOfPeople: 3 };
        const error = await t.throwsAsync(() => t.context.got.put("reservations/2", { json: body }));
        t.is(error.response.statusCode, 403);
        t.is(error.response.body.message, "You are not authorized to modify this reservation.");
    });   