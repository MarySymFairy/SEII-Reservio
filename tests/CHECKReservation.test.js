const http = require("http");
const test = require("ava");
const got = require("got");

const app = require("../index.js");

test.before(async (t) => {
  t.context.server = http.createServer(app);
  const server = t.context.server.listen();
  const { port } = server.address();
  t.context.got = got.extend({
    responseType: "json",
    prefixUrl: `http://localhost:${port}`,
  });
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
  numberOfPeople: 4,
};

const userId = 1;
const businessId = 123;

// Helper to store reservation ID
let reservationId;

// --- HAPPY PATH FLOW ---

// Step 1: Create a reservation (POST)
test.serial("POST /reservations - Create reservation (happy path)", async (t) => {
  const response = await t.context.got.post("reservations", {
    searchParams: { "user-id": userId, "business-id": businessId },
    json: validReservation,
  });

  t.is(response.statusCode, 200);
  t.truthy(response.body);
  reservationId = response.body["reservation-id"];
  t.truthy(reservationId, "Reservation ID should be returned");

  // Verify response matches expected data
  t.is(response.body["user-id"], userId);
  t.is(response.body["business-id"], businessId);
  t.is(response.body.reservationTime, validReservation.reservationTime);
  t.is(response.body.reservationYear, validReservation.reservationYear);
  t.is(response.body.reservationMonth, validReservation.reservationMonth);
  t.is(response.body.reservationDay, validReservation.reservationDay);
  t.is(response.body.numberOfPeople, validReservation.numberOfPeople);
});

// Step 2: Update the reservation (PUT)
test.serial("PUT /reservations/:id - Update reservation (happy path)", async (t) => {
  t.truthy(reservationId, "Reservation ID should exist from the POST test");

  const updatedReservation = {
    reservationTime: "19:00",
    numberOfPeople: 5,
  };

  const response = await t.context.got.put(`reservations/${reservationId}`, {
    json: updatedReservation,
  });

  t.is(response.statusCode, 200);
  t.is(response.body.numberOfPeople, updatedReservation.numberOfPeople);
  t.is(response.body.reservationTime, updatedReservation.reservationTime);
});

// Step 3: Delete the reservation (DELETE)
test.serial("DELETE /reservations/:id - Delete reservation (happy path)", async (t) => {
  t.truthy(reservationId, "Reservation ID should exist from the POST test");

  const response = await t.context.got.delete(`reservations/${reservationId}`);
  t.is(response.statusCode, 200);
  t.is(response.body.message, "Reservation deleted.");
});

// --- UNHAPPY PATHS ---

// POST Validation Tests
test("POST /reservations - Month out of range", async (t) => {
  const invalidReservation = { ...validReservation, reservationMonth: 13 };

  const error = await t.throwsAsync(() =>
    t.context.got.post("reservations", {
      searchParams: { "user-id": userId, "business-id": businessId },
      json: invalidReservation,
    })
  );

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /month must be between 1 and 12/i);
});

test("POST /reservations - Day out of range for 31-day month", async (t) => {
  const invalidReservation = { ...validReservation, reservationMonth: 1, reservationDay: 32 };

  const error = await t.throwsAsync(() =>
    t.context.got.post("reservations", {
      searchParams: { "user-id": userId, "business-id": businessId },
      json: invalidReservation,
    })
  );

  t.is(error.response.statusCode, 400);
  t.regex(error.response.body.error, /day must be valid for the given month/i);
});

// PUT Validation Tests
test("PUT /reservations/:id - Modify reservation with invalid ID format", async (t) => {
  const invalidReservationId = "invalid-id";
  const body = { numberOfPeople: 3 };

  const error = await t.throwsAsync(() =>
    t.context.got.put(`reservations/${invalidReservationId}`, { json: body })
  );

  t.is(error.response.statusCode, 400);
  t.is(error.response.body.message, "Invalid reservation ID format.");
});

test("PUT /reservations/:id - Modify reservation with empty body", async (t) => {
  const error = await t.throwsAsync(() =>
    t.context.got.put(`reservations/${reservationId}`, { json: {} })
  );

  t.is(error.response.statusCode, 400);
  t.is(error.response.body.message, "Request body cannot be empty.");
});

// DELETE Validation Tests
test("DELETE /reservations/:id - Delete nonexistent reservation", async (t) => {
  const invalidReservationId = 9999;

  const error = await t.throwsAsync(() =>
    t.context.got.delete(`reservations/${invalidReservationId}`)
  );

  t.is(error.response.statusCode, 404);
  t.is(error.response.body.message, "Reservation not found.");
});

test("DELETE /reservations/:id - Unauthorized delete request", async (t) => {
  const error = await t.throwsAsync(() =>
    t.context.got.delete(`reservations/${reservationId}`, {
      headers: { Authorization: "InvalidToken" },
    })
  );

  t.is(error.response.statusCode, 401);
  t.is(error.response.body.message, "Unauthorized access.");
});
