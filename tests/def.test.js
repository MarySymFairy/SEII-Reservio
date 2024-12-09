// Test for modifyReservationconst test = require('ava');
const DefaultService = require('../service/DefaultService');

// Test for modifyReservation
test('modifyReservation - Happy path', async t => {
  const body = {
    reservationTime: "19:00",
    businessName: "Test Business",
    reservationYear: 2024,
    reservationDay: 25,
    businessId: 123,
    reservationMonth: 12,
    numberOfPeople: 4,
    username: "testuser"
  };
  const userId = 1;
  const reservationId = 1;

  const modifiedReservation = await DefaultService.modifyReservation(body, userId, reservationId);
  t.is(modifiedReservation['reservation-id'], reservationId);
  t.is(modifiedReservation['user-id'], userId);
  t.is(modifiedReservation.reservationTime, body.reservationTime);
  t.is(modifiedReservation.businessName, body.businessName);
  t.is(modifiedReservation.reservationYear, body.reservationYear);
  t.is(modifiedReservation.reservationDay, body.reservationDay);
  t.is(modifiedReservation['business-id'], body.businessId);
  t.is(modifiedReservation.reservationMonth, body.reservationMonth);
  t.is(modifiedReservation.numberOfPeople, body.numberOfPeople);
  t.is(modifiedReservation.username, body.username);
});

test('modifyReservation - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(null, 1, 1));
  t.is(error.message, "Invalid input parameters");
});

test('modifyReservation - Missing userId', async t => {
  const body = {
    reservationTime: "19:00",
    businessName: "Test Business",
    reservationYear: 2024,
    reservationDay: 25,
    businessId: 123,
    reservationMonth: 12,
    numberOfPeople: 4,
    username: "testuser"
  };
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(body, null, 1));
  t.is(error.message, "Invalid input parameters");
});

test('modifyReservation - Missing reservationId', async t => {
  const body = {
    reservationTime: "19:00",
    businessName: "Test Business",
    reservationYear: 2024,
    reservationDay: 25,
    businessId: 123,
    reservationMonth: 12,
    numberOfPeople: 4,
    username: "testuser"
  };
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(body, 1, null));
  t.is(error.message, "Invalid input parameters");
});

test('modifyReservation - Missing body', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(null, 1, 1));
  t.is(error.message, "Invalid input parameters");
});

test('modifyReservation - Invalid reservation time format', async t => {
  const body = {
    reservationTime: "25:00",
    businessName: "Test Business",
    reservationYear: 2024,
    reservationDay: 25,
    businessId: 123,
    reservationMonth: 12,
    numberOfPeople: 4,
    username: "testuser"
  };
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(body, 1, 1));
  t.is(error.message, "Invalid reservation time format.");
});

test('modifyReservation - Missing required fields', async t => {
  const body = {
    reservationTime: null,
    businessName: "Test Business",
    reservationYear: 2024,
    reservationDay: 25,
    businessId: 123,
    reservationMonth: 12,
    numberOfPeople: 4,
    username: "testuser"
  };
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(body, 1, 1));
  t.is(error.message, "Missing or invalid required fields.");
});

// Test for addReservation
test('addReservation - Happy path', async t => {
  const body = {
    reservationTime: "18:00",
    businessName: "Test Business",
    reservationYear: 2024,
    reservationDay: 25,
    reservationMonth: 12,
    numberOfPeople: 4,
    username: "testuser"
  };
  const userId = 1;
  const businessId = 123;

  const reservation = await DefaultService.addReservation(body, userId, businessId);
  t.is(reservation['user-id'], userId);
  t.is(reservation['business-id'], businessId);
  t.is(reservation.reservationTime, body.reservationTime);
});

test('addReservation - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.addReservation(null, 1, 123));
  t.is(error.message, "Invalid input parameters");
});

// Test for deleteReservation
test('deleteReservation - Happy path', async t => {
  const userId = 1;
  const reservationId = 1;

  const deletedReservation = await DefaultService.deleteReservation(userId, reservationId);
  t.is(deletedReservation['user-id'], userId);
  t.is(deletedReservation['reservation-id'], reservationId);
  t.is(deletedReservation.status, "deleted");
});

test('deleteReservation - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.deleteReservation(null, 1));
  t.is(error.message, "Invalid input parameters");
});

// Test for getAvailability
test('getAvailability - Happy path', async t => {
  const businessId = 123;
  const reservationDay = 25;
  const reservationMonth = 12;
  const reservationYear = 2024;
  const numberOfPeople = 4;

  const availableHours = await DefaultService.getAvailability(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople);
  t.true(Array.isArray(availableHours));
  t.true(availableHours.length > 0);
});

test('getAvailability - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.getAvailability(null, 25, 12, 2024, 4));
  t.is(error.message, "Invalid input parameters");
});

// Test for getBusinessesByCategory
test('getBusinessesByCategory - Happy path', async t => {
  const categoryName = "Breakfast";

  const businesses = await DefaultService.getBusinessesByCategory(categoryName);
  t.true(Array.isArray(businesses));
  t.true(businesses.length > 0);
  businesses.forEach(business => {
    t.is(business.businessCategory, categoryName);
  });
});

test('getBusinessesByCategory - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.getBusinessesByCategory(null));
  t.is(error.message, "Invalid input parameters");
});

// Test for modifyReservation
test('modifyReservation - Happy path', async t => {
  const userId = 1;
  const reservationId = 1;
  const body = {
    reservationTime: "19:00",
    numberOfPeople: 5
  };

  const response = await DefaultService.modifyReservation(userId, reservationId, body);
  t.is(response.code, 200);
  t.is(response.message, "Reservation updated successfully.");
});

test('modifyReservation - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(null, 1, {}));
  t.is(error.statusCode, 400);
  t.is(error.message, "Invalid input parameters");
});

test('modifyReservation - Reservation not found', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(1, 9999, { reservationTime: "19:00", numberOfPeople: 5 }));
  t.is(error.statusCode, 404);
  t.is(error.message, "Reservation not found");
});

test('modifyReservation - Unauthorized access', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(2, 1, { reservationTime: "19:00", numberOfPeople: 5 }));
  t.is(error.statusCode, 401);
  t.is(error.message, "Unauthorized access.");
});

test('modifyReservation - Missing required fields', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(1, 1, { reservationTime: null, numberOfPeople: 5 }));
  t.is(error.statusCode, 422);
  t.is(error.message, "Missing or invalid required fields.");
});

test('modifyReservation - Invalid reservation time format', async t => {
  const error = await t.throwsAsync(() => DefaultService.modifyReservation(1, 1, { reservationTime: "25:00", numberOfPeople: 5 }));
  t.is(error.statusCode, 422);
  t.is(error.message, "Invalid reservation time format.");
});

// Test for notifyUser
test('notifyUser - Happy path', async t => {
  const userId = 1;
  const reservationId = 1;

  const notificationMessage = await DefaultService.notifyUser(userId, reservationId);
  t.is(notificationMessage, `User ${userId}, you have a reservation (ID: ${reservationId}) in 2 hours.`);
});

test('notifyUser - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.notifyUser(null, 1));
  t.is(error.message, "Invalid input parameters");
});

// Test for searchBusiness
test('searchBusiness - Happy path', async t => {
  const keyword = "keyword";

  const businesses = await DefaultService.searchBusiness(keyword);
  t.true(Array.isArray(businesses));
  t.true(businesses.length > 0);
  businesses.forEach(business => {
    t.is(business.keyword, keyword);
  });
});

test('searchBusiness - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.searchBusiness(null));
  t.is(error.message, "Invalid input parameters");
});

// Test for viewReservations
test('viewReservations - Happy path', async t => {
  const userId = 1;

  const reservations = await DefaultService.viewReservations(userId);
  t.true(Array.isArray(reservations));
  t.true(reservations.length > 0);
  reservations.forEach(reservation => {
    t.is(reservation['user-id'], userId);
  });
});

test('viewReservations - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.viewReservations(null));
  t.is(error.message, "Invalid input parameters");
});

// Test for viewAReservation
test('viewAReservation - Happy path', async t => {
  const reservationId = 1;
  const userId = 1;

  const reservation = await DefaultService.viewAReservation(reservationId, userId);
  t.is(reservation['reservation-id'], reservationId);
  t.is(reservation['user-id'], userId);
});

test('viewAReservation - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.viewAReservation(null, 1));
  t.is(error.message, "Invalid input parameters");
});

// Test for viewBusinessReservations
test('viewBusinessReservations - Happy path', async t => {
  const ownerId = 1;
  const day = 25;
  const month = 12;
  const year = 2024;

  const reservations = await DefaultService.viewBusinessReservations(ownerId, day, month, year);
  t.true(Array.isArray(reservations));
  t.true(reservations.length > 0);
  reservations.forEach(reservation => {
    t.is(reservation['reservationDay'], day);
    t.is(reservation['reservationMonth'], month);
    t.is(reservation['reservationYear'], year);
  });
});

test('viewBusinessReservations - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.viewBusinessReservations(null, 25, 12, 2024));
  t.is(error.message, "Invalid input parameters");
});

// Test for viewBusinessStatistics
test('viewBusinessStatistics - Happy path', async t => {
  const ownerId = 1;

  const statistics = await DefaultService.viewBusinessStatistics(ownerId);
  t.true(Array.isArray(statistics));
  t.true(statistics.length > 0);
  statistics.forEach(stat => {
    t.true(stat.hasOwnProperty('month'));
    t.true(stat.hasOwnProperty('numberOfReservations'));
  });
});

test('viewBusinessStatistics - Missing parameters', async t => {
  const error = await t.throwsAsync(() => DefaultService.viewBusinessStatistics(null));
  t.is(error.message, "Invalid input parameters");
});