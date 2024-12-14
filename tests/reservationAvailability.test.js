const test = require("ava");
const got = require("got");
const http = require('http');
const app = require('../index.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const {port} = server.address();
    t.context.got = got.extend({responseType: 'json', prefixUrl: `http://localhost:${port}`});
});

test.after.always((t) => {
    t.context.server.close();
});

test("GET /reservations/availability - Should return the availability of a business based on the specific parameters", async (t) => {
    const { body, statusCode } = await t.context.got.get("reservations/availability?businessId=8&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=7");
    t.is(statusCode, 200, "Response status should be 200");
    t.true(Array.isArray(body), "Response body should be an array");
    t.true(body.length > 0, "Response body should not be empty");

    const availability = body[0];
    t.not(availability.reservationTime, undefined, "Availability should have a reservationTime");
});


const invalid = "invalid";

test("GET /reservations/availability - Should return an error message for an invalid businessId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=${invalid}&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an invalid reservationDay", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=${invalid}&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an invalid reservationMonth", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=5&reservationMonth=${invalid}&reservationYear=2025&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an invalid reservationYear", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=5&reservationMonth=5&reservationYear=${invalid}&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an invalid numberOfPeople", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=${invalid}`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an empty businessId", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an empty reservationDay", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=&reservationMonth=5&reservationYear=2025&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an empty reservationMonth", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=5&reservationMonth=&reservationYear=2025&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an empty reservationYear", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=5&reservationMonth=5&reservationYear=&numberOfPeople=7`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return an error message for an empty numberOfPeople", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=5&reservationMonth=5&reservationYear=2025&numberOfPeople=`));
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

test("GET /reservations/availability - Should return a not found availability ", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`reservations/availability?businessId=8&reservationDay=2&reservationMonth=5&reservationYear=2026&numberOfPeople=2`));
    t.is(error.response.statusCode, 404, "Response status should be 404");
});