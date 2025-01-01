'use strict';

/**
 * FR9: The system must be able to notify the logged in user for his reservation at the reservation date.
 *
 * userId Integer Retrieve the ID of the user
 * reservationId Integer Retrieve the ID of the reservation
 * returns You have a reservation in 2 hours
 **/
exports.notifyUser = function(userId,reservationId) {
  return new Promise(function(resolve, reject) {
    if (typeof userId !== "number" || typeof reservationId !== "number" || 
      userId < 0 || reservationId < 0 || isNaN(userId) || isNaN(reservationId) || 
      !Number.isInteger(userId) || !Number.isInteger(reservationId)) {
        return reject({
          code: 400,
          message: "Invalid data types. userId and reservationId must be numbers.",
        });
    }

    var examples = {};
    examples['application/json'] = {
      "message" : "You have a reservation in 2 hours"
    };

    const userReservations = [
      {
        userId: 6,
        reservationId: 0,
        reservationTime: '12:00',
        reservationDay: 25,
        reservationMonth: 12,
        reservationYear: 2025,
        numberOfPeople: 3,
        username: "username",
        businessName: "businessName"
      }
    ];

    console.log("CHECKME");
    console.log("USER",userId, "RESERVATION", reservationId);

    const filteredUserReservations = userReservations.filter(reservation => reservation.userId === userId && reservation.reservationId === reservationId);
    if (filteredUserReservations.length > 0) {
      resolve([examples['application/json']]);
    } else {
      return reject({
        code: 404,
        message: "Reservation not found."
      });
    }
  });
}