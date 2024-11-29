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

//Happy path: Add reservation
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

//Error case: Missing fields
test("Post /reservations - Add reservation (missing fields)", async t => {
    const body = {
        userId: 1,
        businessId: 1,
        reservationTime: "18:00",
        reservationYear: 2024,
        reservationMonth: 12,
        reservationDay: 15
    };
    const error = await  t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
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
