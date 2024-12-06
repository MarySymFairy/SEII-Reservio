import http from "node:http";

import test from "ava";
import got from "got";
//import listen from "test-listen";

import app from '../index.js';

test.before(async (t) => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const {port} = server.address();
    t.context.got = got.extend({responseType: 'json', prefixUrl: `http://localhost:${port}`});
});

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






//GET ALL-----------------------------------------------------------------------------
// Happy path: Get all reservations
test("GET /reservations - Retrieve all reservations (happy path)", async (t) => {
const { body, statusCode } = await t.context.got.get("reservations");
t.is(statusCode, 200);
t.true(Array.isArray(body));
t.true(body.length > 0);
});

// Error case: Get reservations with invalid query parameters ???
test("GET /reservations - Retrieve reservations with invalid query parameters (error case)", async (t) => {
const response = await t.context.got.get("reservations", { searchParams: { invalidParam: "test" }});
t.is(response.statusCode, 400);
t.is(response.body.message, "Invalid query parameter");
});
