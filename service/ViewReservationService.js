'use strict';

// Common validation function
function validateId(id, name) {
  if (isNaN(id) || typeof id !== "number" || !Number.isInteger(id) || id < 0) {
    throw {
      code: 400,
      message: `Invalid ${name} format.`,
    };
  }
}

/**
 * FR10: The logged in user must be able to view his reservations. 
 *
 * reservationId Integer ReservationId of the reservation submitted to the system
 * userId Integer UserId of the logged in user that made the reservation
 * returns Reservation
 **/
exports.viewAReservation = function(userId, reservationId) {
  return new Promise(function(resolve, reject) {
    try {
      validateId(userId, "user ID");
      validateId(reservationId, "reservation ID");
    } catch (error) {
      return reject(error);
    }
    
    var examples = {};
    examples['application/json'] = [{
      "reservationId" : 0,
      "userId" : 6,
      "reservationTime" : "12:00",
      "businessName" : "businessName",
      "reservationYear" : 2025,
      "reservationDay" : 5,
      "businessId" : 1,
      "reservationMonth" : 5,
      "numberOfPeople" : 7,
      "username" : "username"
    }];

    // Find reservation based on reservationId and userId
    const reservation = examples['application/json'].find(
      (res) => res.reservationId === reservationId && res.userId === userId
    );

    if (reservation) {
      return resolve(reservation);
    } else {
      return reject({
        code: 404,
        message: "Reservation not found.",
      });
    }
  });
};

/**
 * FR10: The logged in user must be able to view his reservations. 
 *
 * userId Integer UserId of the logged in user that made the reservation
 * returns List
 **/
exports.viewReservations = function(userId) {
  return new Promise(function(resolve, reject) {
    try {
      validateId(userId, "user ID");
    } catch (error) {
      return reject(error);
    }
    
    var examples = {};
    examples['application/json'] = [{
      "reservationId" : 0,
      "userId" : 6,
      "reservationTime" : "12:00",
      "businessName" : "businessName",
      "reservationYear" : 2025,
      "reservationDay" : 5,
      "businessId" : 1,
      "reservationMonth" : 5,
      "numberOfPeople" : 7,
      "username" : "username"
    }, {
      "reservationId" : 0,
      "userId" : 6,
      "reservationTime" : "12:00",
      "businessName" : "businessName",
      "reservationYear" : 2025,
      "reservationDay" : 5,
      "businessId" : 1,
      "reservationMonth" : 5,
      "numberOfPeople" : 7,
      "username" : "username"
    }];

    const userReservations = examples['application/json'].filter(reservation => reservation.userId === userId);

    if (userReservations.length > 0) {
      return resolve(userReservations);
    } else {
      return resolve([]); // Return empty array if no reservations are found
    }
  });
};

/**
 * FR11: The business owner must be able to view the reservations of his business. 
 *
 * ownerId Integer OwnerId of the business owner
 * day Integer Reservation day
 * month Integer Reservation month
 * year Integer Reservation year
 * returns List
 **/
exports.viewBusinessReservations = function(ownerId, businessId, day, month, year) {
  return new Promise(function(resolve, reject) {
    try {
      validateId(ownerId, "owner ID");
      validateId(businessId, "business ID");
      validateId(day, "day");
      validateId(month, "month");
      validateId(year, "year");
    } catch (error) {
      return reject(error);
    }
    
    var examples = {};
    examples['application/json'] = [{
      "reservationId" : 0,
      "userId" : 6,
      "ownerId" : 7,
      "businessId" : 8,
      "reservationTime" : "20:00",
      "businessName" : "businessName",
      "reservationYear" : 2026,
      "reservationDay" : 1,
      "people" : 2,
      "reservationMonth" : 5,
      "username" : "username"
    }, {
      "reservationId" : 0,
      "userId" : 6,
      "ownerId" : 7,
      "businessId" : 8,
      "reservationTime" : "20:00",
      "businessName" : "businessName",
      "reservationYear" : 2026,
      "reservationDay" : 1,
      "people" : 2,
      "reservationMonth" : 5,
      "username" : "username"
    }];

    // Filter if business reservations exist (in mock data)
    const filtered = examples['application/json'].filter(
      (r) => r.ownerId === ownerId && r.businessId === businessId && r.reservationDay === day && r.reservationMonth === month && r.reservationYear === year
    );
    
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject({code: 404, message: "No business reservations found."});
    }
  });
};


