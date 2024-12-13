const http = require("http");
const test = require("ava");
const got = require("got");

const app = require('../index.js');

test.before(async (t) => {
    // t.context.server = http.createServer(app);
    // const server = t.context.server.listen();
    // const {port} = server.address();
    // t.context.got = got.extend({responseType: 'json', prefixUrl: `http://localhost:${port}`});
    t.context.server = app.listen(8080); // Bind to a fixed port
    t.context.got = got.extend({ responseType: 'json', prefixUrl: 'http://localhost:8080' });
});

test.after.always(t => {
    t.context.server.close();
});


// GET /businessReservations

//Happy path: Retrieve all reservations 
test("GET /businessReservations - Retrieve all reservations", async (t) => {
    const { body, statusCode } = await t.context.got.get("business-reservations"); //or business - reservations
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
});


//Unhappy path: Get businesses reservations with invalid query parameter
test("GET /businessReservations - Invalid query parameters", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("business-reservations?invalidParam=value"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid query parameter");
});

//Unhappy path: No existing reservations
 test("GET /businessReservations - No existing reservations/", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("business-reservations"));
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "No business reservations found.");
  }); 
  

//Unhappy path: Nonexistent Resource
test("GET /businessReservations/:id - Nonexistent businessReservations", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("business-reservations/99999"));
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "Business reservations not found");
});

// Unhappy path: Invalid ID format when fetching a business reservation
test("GET /businessReservations/:id - Invalid ID format", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get("business-reservations/invalid-id"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid reservation ID format");
});

