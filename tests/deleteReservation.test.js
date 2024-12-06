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


//DELETE-----------------------------------------------------------------------------
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

