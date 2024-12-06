import http from "node:http";

import test from "ava";
import got from "got";

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


//GET NOTIFICATION---------------------------------------------------------------------
// GET /reservations/{reservation-id}/notification - Notify user about reservation (happy path)
test("GET /reservations/{reservation-id}/notification - Notify user (happy path)", async (t) => {
    const reservationId = 1;
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`);
    t.is(statusCode, 200);
    t.is(body.message, "Notification sent successfully.");
});

// GET /reservations/{reservation-id}/notification - Notify user about non-existent reservation (error case)
test("GET /reservations/{reservation-id}/notification - Notify user about non-existent reservation (error case)", async (t) => {
    const reservationId = 9999; // non-existent reservationId
    const { body, statusCode } = await t.context.got.get(`reservations/${reservationId}/notification`);
    t.is(statusCode, 404);
    t.is(body.message, "Reservation not found.");
});
