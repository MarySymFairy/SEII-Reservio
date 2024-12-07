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

// Error case: Delete reservation that has already been deleted ???? μοιάζει με το προηγούμενο
test("DELETE /reservations/:id - Delete already deleted reservation", async (t) => {
    // Assuming reservation ID 3 has been previously deleted
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/3"));
    t.is(error.response.statusCode, 410); // Gone
    t.is(error.response.body.message, "Reservation has already been deleted.");
});

// Error case: Delete reservation with invalid ID format
test("DELETE /reservations/:id - Delete reservation with invalid ID format", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/invalid-id"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid reservation ID format.");
});

// Error case: Delete reservation without authorization
test("DELETE /reservations/:id - Unauthorized delete request", async (t) => {
    const error = await t.throwsAsync(() => 
        t.context.got.delete("reservations/1", {
            headers: { Authorization: "InvalidToken" },
        })
    );
    t.is(error.response.statusCode, 401);
    t.is(error.response.body.message, "Unauthorized access.");
});

// Error case: Delete reservation with missing ID parameter
test("DELETE /reservations/:id - Missing reservation ID", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/"));
    t.is(error.response.statusCode, 404); // Assuming this would be treated as a not found endpoint
    t.is(error.response.body.message, "Reservation ID is required."); // Customize based on your API
});

// Error case: Delete reservation that is linked to other constraints ????
test("DELETE /reservations/:id - Delete reservation with database constraint violation", async (t) => {
    // Assuming reservation ID 2 is linked to a payment record or other constraints
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/2"));
    t.is(error.response.statusCode, 409);
    t.is(error.response.body.message, "Cannot delete reservation due to existing dependencies.");
});