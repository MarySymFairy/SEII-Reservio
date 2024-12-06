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


//POST-------------------------------------------------------------------------------
// Happy path: Add reservation
test("Post /reservations - Add reservation (happy path)", async (t) => {
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

// Error case: Missing fields
test("Post /reservations - Add reservation (missing fields)", async (t) => {
        const body = {
                userId: 1,
                businessId: 1,
                reservationTime: "18:00",
                reservationYear: 2024,
                reservationMonth: 12,
                reservationDay: 15
        };
        const error = await t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
        t.is(error.response.statusCode, 400);
        t.is(error.response.body.message, "Missing required fields");
});

// Error case: Add reservation with invalid data types
test("Post /reservations - Add reservation with invalid data types (error case)", async (t) => {
    const body = {
        userId: "one", // Should be number
        businessId: 1,
        reservationTime: "18:00",
        reservationYear: 2024,
        reservationMonth: 12,
        reservationDay: 15,
        numberOfPeople: "four" // Should be number
    };
    const error = await t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid data types");
});

//Error Case: Invalid Month (Out of Range)
test("Post /reservations - Add reservation with invalid month (out of range)", async (t) => {
    const body = {
        userId: 1,
        businessId: 1,
        reservationTime: "18:00",
        reservationYear: 2024,
        reservationMonth: 13, // Invalid month
        reservationDay: 15,
        numberOfPeople: 4
    };
    const error = await t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid month. Must be between 1 and 12.");
});

//Error Case: Negative or Zero People Count
test("Post /reservations - Add reservation with invalid number of people", async (t) => {
    const body = {
        userId: 1,
        businessId: 1,
        reservationTime: "18:00",
        reservationYear: 2024,
        reservationMonth: 12,
        reservationDay: 15,
        numberOfPeople: 0 // Invalid count
    };
    const error = await t.throwsAsync(() => t.context.got.post('reservations', {json: body}));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid number of people. Must be greater than zero.");
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
