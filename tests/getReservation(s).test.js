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


//GET--------------------------------------------------------------------------------
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

// GET /reservations/:id - Get reservation with invalid ID format
test("GET /reservations/:id - Get reservation with invalid ID format", async (t) => {
    const invalidId = 'abc123';
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/${invalidId}`));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid reservation ID format.");
});


//GET ALL-----------------------------------------------------------------------------
// Happy path: Get all reservations
test("GET /reservations - Retrieve all reservations (happy path)", async (t) => {
const { body, statusCode } = await t.context.got.get("reservations");
t.is(statusCode, 200);
t.true(Array.isArray(body));
t.true(body.length > 0);
});

// Error case: Get reservations with invalid query parameters
test("GET /reservations - Retrieve reservations with invalid query parameters (error case)", async (t) => {
const response = await t.context.got.get("reservations", { searchParams: { invalidParam: "test" }});
t.is(response.statusCode, 400);
t.is(response.body.message, "Invalid query parameter");
});

// GET /reservations - Retrieve all reservations (no reservations found)
test("GET /reservations - Retrieve all reservations (no reservations found)", async (t) => {
    // Assuming the database is empty for this test
    const { body, statusCode } = await t.context.got.get("reservations");
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.is(body.length, 0);
});