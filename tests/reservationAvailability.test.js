const http = require('http');
const test = require('ava');
const got = require('got');
const app = require('../index.js');

test.before(async (t) => {
  t.context.server = http.createServer(app);
  const server = t.context.server.listen();
  const { port } = server.address();
  t.context.got = got.extend({
    responseType: 'json',
    prefixUrl: `http://localhost:${port}`,
  });
});

test.after.always((t) => {
  t.context.server.close();
});

//GET AVAILABILITY------------------------------------------------------------------------
// GET /reservations/availability - Retrieve reservation availability (happy path)
test("GET /reservations/availability - Retrieve reservation availability (happy path)", async (t) => {
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
test("GET /reservations/availability - Retrieve reservation availability with invalid businessId (error case)", async (t) => {
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