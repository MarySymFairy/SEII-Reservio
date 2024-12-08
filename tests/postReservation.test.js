const http = require("node:http");

const test = require("ava");
const got = require("got");

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

// Mock data
const validReservation = {
  reservationTime: "18:00",
  reservationYear: 2024,
  reservationMonth: 12,
  reservationDay: 25,
  numberOfPeople: 4
};

const userId = 1;
const businessId = 123;

// Helper to get the current year
const currentYear = new Date().getFullYear();

// Success case
test('POST /reservations - Success case', async (t) => {
  const response = await t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: validReservation
  });

  t.is(response.statusCode, 200);
  t.truthy(response.body);
  t.is(response.body["user-id"], userId);
  t.is(response.body["business-id"], businessId);
  t.is(response.body.reservationTime, validReservation.reservationTime);
  t.is(response.body.reservationYear, validReservation.reservationYear);
  t.is(response.body.reservationMonth, validReservation.reservationMonth);
  t.is(response.body.reservationDay, validReservation.reservationDay);
  t.is(response.body.numberOfPeople, validReservation.numberOfPeople);
  t.truthy(response.body["reservation-id"]);
});

// Validation tests
test('POST /reservations - Month out of range', async (t) => {
  const invalidReservation = { ...validReservation, reservationMonth: 13 };

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: invalidReservation
  }));

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /month must be between 1 and 12/i);
});

test('POST /reservations - Day out of range for 31-day month', async (t) => {
  const invalidReservation = { ...validReservation, reservationMonth: 1, reservationDay: 32 };

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: invalidReservation
  }));

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /day must be valid for the given month/i);
});

test('POST /reservations - Day out of range for 30-day month', async (t) => {
  const invalidReservation = { ...validReservation, reservationMonth: 4, reservationDay: 31 };

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: invalidReservation
  }));

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /day must be valid for the given month/i);
});

test('POST /reservations - February 30th', async (t) => {
  const invalidReservation = { ...validReservation, reservationMonth: 2, reservationDay: 30 };

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: invalidReservation
  }));

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /day must be valid for February/i);
});

test('POST /reservations - Year less than current year', async (t) => {
  const invalidReservation = { ...validReservation, reservationYear: currentYear - 1 };

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: invalidReservation
  }));

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /year must not be in the past/i);
});

test('POST /reservations - Non-unique reservation-id', async (t) => {
  const duplicateReservation = { ...validReservation, "reservation-id": 1 };

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': businessId },
    json: duplicateReservation
  }));

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /reservation-id must be unique/i);
});

test('POST /reservations - Nonexistent user-id', async (t) => {
  const invalidUserId = 9999; // Assuming this user does not exist

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': invalidUserId, 'business-id': businessId },
    json: validReservation
  }));

  t.is(error.response.statusCode, 404);
  t.regex(error.response.body.error, /user-id does not exist/i);
});

test('POST /reservations - Nonexistent business-id', async (t) => {
  const invalidBusinessId = 9999; // Assuming this business does not exist

  const error = await t.throwsAsync(() => t.context.got.post('reservations', {
    searchParams: { 'user-id': userId, 'business-id': invalidBusinessId },
    json: validReservation
  }));

  t.is(error.response.statusCode, 404);
  t.regex(error.response.body.error, /business-id does not exist/i);
});