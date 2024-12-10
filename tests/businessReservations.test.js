const http = require('http');
const test = require('ava');
const got = require('got');
const listen = require('test-listen');
const app = require('../index.js');

test.before(async t => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({
        http2: true,
        throwHttpErrors: false,
        responseType: "json",
        prefixUrl: `http://localhost:${port}` //t.context.prefixUrl,
    });
});

test.after.always((t) => {
    t.context.server.close();
});

// GET /businessReservations

//Happy path: Retrieve all reservations 
test("GET /businessReservations - Retrieve all reservations", async (t) => {
    const { body, statusCode } = await t.context.got.get("businessReservations"); //or business - reservations
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
});


//Unhappy path: Get businesses reservations with invalid query parameter
test("GET /businessReservations - Invalid query parameters", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("businessesReservations?invalidParam=value"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid query parameter");
});

//Unhappy path: No existing reservations
 test("GET /businessReservations - No existing reservations/", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("businessReservations"));
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "No business reservations found.");
  }); 
  

//Unhappy path: Nonexistent Resource
test("GET /businessReservations/:id - Nonexistent businessReservations", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("businessReservations/99999"));
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "Business reservations not found");
});

// Unhappy path: Invalid ID format when fetching a business reservation
test("GET /businessReservations/:id - Invalid ID format", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("businessReservations/invalid-id"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid reservation ID format");
});
