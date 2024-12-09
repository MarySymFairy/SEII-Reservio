'use strict';


/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer User-id of the logged in user that made the reservation
 * businessId Integer Business-id of the business that the reservation is made for
 * returns Reservation
 **/
exports.addReservation = function(body, userId, businessId) {
  return new Promise(function(resolve, reject) {
    if (!body || !userId || !businessId) {
      return reject(new Error("Invalid input parameters"));
    }

    // Example reservation data
    var reservation = {
      "reservation-id": 0,
      "user-id": userId,
      "reservationTime": body.reservationTime,
      "businessName": body.businessName,
      "reservationYear": body.reservationYear,
      "reservationDay": body.reservationDay,
      "business-id": businessId,
      "reservationMonth": body.reservationMonth,
      "numberOfPeople": body.numberOfPeople,
      "username": body.username
    };

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(reservation);
    }, 1000);
  });
}


/**
 * Deletes a single reservation based on the reservationID supplied
 * FR8 - The logged in user must be able to cancel his existing reservation 
 *
 * userId Integer Retrieve the ID of the user
 * reservationId Integer ID of reservation to delete
 * returns Reservation deleted.
 **/
exports.deleteReservation = function(userId, reservationId) {
  return new Promise(function(resolve, reject) {
    if (!userId || !reservationId) {
      return reject(new Error("Invalid input parameters"));
    }

    // Example deleted reservation data
    var deletedReservation = {
      "reservation-id": reservationId,
      "user-id": userId,
      "status": "deleted"
    };

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(deletedReservation);
    }, 1000);
  });
}


/**
 * In order to have the available hours for the specific reservation you want to create.  FR3: The logged in user must be able to start a reservation process by selecting a business  FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * businessId Integer Business-id of the business that the reservation is made for
 * reservationDay Integer The arranged reservation day
 * reservationMonth Integer The arranged reservation month
 * reservationYear Integer The arranged reservation year
 * numberOfPeople Integer The arranged number of people that will be in the reservation
 * returns inline_response_200
 **/
exports.getAvailability = function(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  return new Promise(function(resolve, reject) {
    if (!businessId || !reservationDay || !reservationMonth || !reservationYear || !numberOfPeople) {
      return reject(new Error("Invalid input parameters"));
    }

    // Example available hours data
    var availableHours = [
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00"
    ];

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(availableHours);
    }, 1000);
  });
}


/**
 * FR1: The logged in user must be able to view the businesses that are included in the system divided by categories. 
 *
 * categoryName String The name of the category that the business belongs to.
 * returns List
 **/
exports.getBusinessesByCategory = function(categoryName) {
  return new Promise(function(resolve, reject) {
    if (!categoryName) {
      return reject(new Error("Invalid input parameters"));
    }

    var examples = {};
    examples['application/json'] = [
      {
        "owner-id": 6,
        "businessName": "businessName",
        "businessCategory": "Breakfast",
        "keyword": "keyword",
        "business-id": 0
      },
      {
        "owner-id": 6,
        "businessName": "businessName",
        "businessCategory": "Breakfast",
        "keyword": "keyword",
        "business-id": 0
      }
    ];

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(examples['application/json']);
    }, 1000);
  });
}


/**
 * Modifies a single reservation based on the reservation-id supplied
 * FR7 - The logged-in user must be able to modify his reservation 
 *
 * body Reservation Reservation to be modified (numberOfPeople, date, time)
 * userId Integer Retrieve the ID of the user
 * reservationId Long ID of the reservation to modify
 * returns List
 **/
exports.modifyReservation = function(body, userId, reservationId) {
  return new Promise(function(resolve, reject) {
    if (!body || !userId || !reservationId) {
      return reject(new Error("Invalid input parameters"));
    }

    // Example modified reservation data
    var modifiedReservation = {
      "reservation-id": reservationId,
      "user-id": userId,
      "reservationTime": body.reservationTime,
      "businessName": body.businessName,
      "reservationYear": body.reservationYear,
      "reservationDay": body.reservationDay,
      "business-id": body.businessId,
      "reservationMonth": body.reservationMonth,
      "numberOfPeople": body.numberOfPeople,
      "username": body.username
    };

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(modifiedReservation);
    }, 1000);
  });
}
// exports.modifyReservation = function(userId, reservationId, body) {
//   return new Promise(function(resolve, reject) {
//     if (!userId || !reservationId || !body) {
//       return reject(new Error("Invalid input parameters"));
//     }

//     // Simulate fetching the reservation from the database
//     const reservation = simulateExistingReservation(reservationId);

//     if (!reservation) {
//       return reject(new Error("Reservation not found"));
//     }

//     if (reservation.userId !== userId) {
//       return reject(new Error("Unauthorized access."));
//     }

//     // Validate the body fields
//     if (body.numberOfPeople == null || body.reservationTime == null) {
//       return reject(new Error("Missing or invalid required fields."));
//     }

//     // Simulate constraint validation
//     if (body.reservationTime === "25:00") {
//       return reject(new Error("Invalid reservation time format."));
//     }

//     // Simulate updating the reservation in the database
//     const updatedReservation = { ...reservation, ...body };

//     resolve(updatedReservation);
//   });
// };

// function simulateExistingReservation(id) {
//   // Simulate a database fetch
//   const reservations = [
//     { reservationId: 1, userId: 1, numberOfPeople: 2, reservationTime: "18:00" },
//     // Add more reservations as needed
//   ];
//   return reservations.find(res => res.reservationId === id);
// }


/**
 * FR9: The system must be able to notify the logged in user for his reservation at the reservation date.
 *
 * userId Integer Retrieve the ID of the user
 * reservationId Integer Retrieve the ID of the reservation
 * returns You have a reservation in 2 hours
 **/
exports.notifyUser = function(userId, reservationId) {
  return new Promise(function(resolve, reject) {
    if (!userId || !reservationId) {
      return reject(new Error("Invalid input parameters"));
    }

    // Example notification message
    var notificationMessage = `User ${userId}, you have a reservation (ID: ${reservationId}) in 2 hours.`;

    // Simulate async operation (e.g., sending notification)
    setTimeout(() => {
      resolve(notificationMessage);
    }, 1000);
  });
}


/**
 * FR2: The logged in user must be able to search for a business with a keyword.  
 *
 * keyword String The keyword to search for businesses.
 * returns List
 **/
exports.searchBusiness = function(keyword) {
  return new Promise(function(resolve, reject) {
    if (!keyword) {
      return reject(new Error("Invalid input parameters"));
    }

    var examples = {};
    examples['application/json'] = [
      {
        "owner-id": 6,
        "businessName": "businessName",
        "businessCategory": "Breakfast",
        "keyword": keyword,
        "business-id": 0
      },
      {
        "owner-id": 6,
        "businessName": "businessName",
        "businessCategory": "Breakfast",
        "keyword": keyword,
        "business-id": 0
      }
    ];

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(examples['application/json']);
    }, 1000);
  });
}


/**
 * FR10: The logged in user must be able to view his reservations. 
 *
 * userId Integer Retrieve the ID of the user
 * returns List of reservations
 **/
exports.viewReservations = function(userId) {
  return new Promise(function(resolve, reject) {
    if (!userId) {
      return reject(new Error("Invalid input parameters"));
    }

    var examples = {};
    examples['application/json'] = [
      {
        "reservation-id": 0,
        "user-id": userId,
        "reservationTime": "18:00",
        "businessName": "businessName",
        "reservationYear": 2024,
        "reservationDay": 25,
        "business-id": 123,
        "reservationMonth": 12,
        "numberOfPeople": 4,
        "username": "username"
      },
      {
        "reservation-id": 1,
        "user-id": userId,
        "reservationTime": "19:00",
        "businessName": "businessName",
        "reservationYear": 2024,
        "reservationDay": 26,
        "business-id": 123,
        "reservationMonth": 12,
        "numberOfPeople": 2,
        "username": "username"
      }
    ];

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(examples['application/json']);
    }, 1000);
  });
}

/**
 * FR10: The logged in user must be able to view a single reservation.
 *
 * reservationId Integer Reservation-id of the reservation submitted to the system
 * userId Integer User-id of the logged in user that made the reservation
 * returns Reservation
 **/
exports.viewAReservation = function(reservationId, userId) {
  return new Promise(function(resolve, reject) {
    if (!reservationId || !userId) {
      return reject(new Error("Invalid input parameters"));
    }

    var examples = {};
    examples['application/json'] = {
      "reservation-id": reservationId,
      "user-id": userId,
      "reservationTime": "18:00",
      "businessName": "businessName",
      "reservationYear": 2024,
      "reservationDay": 25,
      "business-id": 123,
      "reservationMonth": 12,
      "numberOfPeople": 4,
      "username": "username"
    };

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(examples['application/json']);
    }, 1000);
  });
}


/**
 * FR11: The business owner must be able to view the reservations of his business. 
 *
 * ownerId Integer Owner-id of the business owner
 * day Integer Reservation day
 * month Integer Reservation month
 * year Integer Reservation year
 * returns List
 **/
exports.viewBusinessReservations = function(ownerId, day, month, year) {
  return new Promise(function(resolve, reject) {
    if (!ownerId || !day || !month || !year) {
      return reject(new Error("Invalid input parameters"));
    }

    var examples = {};
    examples['application/json'] = [
      {
        "reservation-id": 0,
        "user-id": 1,
        "reservationTime": "18:00",
        "businessName": "businessName",
        "reservationYear": year,
        "reservationDay": day,
        "business-id": 123,
        "reservationMonth": month,
        "numberOfPeople": 4,
        "username": "username"
      },
      {
        "reservation-id": 1,
        "user-id": 2,
        "reservationTime": "19:00",
        "businessName": "businessName",
        "reservationYear": year,
        "reservationDay": day,
        "business-id": 123,
        "reservationMonth": month,
        "numberOfPeople": 2,
        "username": "username"
      }
    ];

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(examples['application/json']);
    }, 1000);
  });
}


/**
 * FR12: The business owner must be able to view the statistics of his business reservations. 
 *
 * ownerId Integer Owner-id of the business owner of the business that the reservations were made in.
 * returns List
 **/
exports.viewBusinessStatistics = function(ownerId) {
  return new Promise(function(resolve, reject) {
    if (!ownerId) {
      return reject(new Error("Invalid input parameters"));
    }

    // Example statistics data
    var statistics = [
      { "month": 1, "numberOfReservations": 6 },
      { "month": 2, "numberOfReservations": 8 },
      { "month": 3, "numberOfReservations": 10 },
      { "month": 4, "numberOfReservations": 12 },
      { "month": 5, "numberOfReservations": 14 },
      { "month": 6, "numberOfReservations": 16 },
      { "month": 7, "numberOfReservations": 18 },
      { "month": 8, "numberOfReservations": 20 },
      { "month": 9, "numberOfReservations": 22 },
      { "month": 10, "numberOfReservations": 24 },
      { "month": 11, "numberOfReservations": 26 },
      { "month": 12, "numberOfReservations": 28 }
    ];

    // Simulate async operation (e.g., database interaction)
    setTimeout(() => {
      resolve(statistics);
    }, 1000);
  });
}
// exports.viewBusinessStatistics = function(ownerId) {
//   return new Promise(function(resolve, reject) {
//     if (!ownerId) {
//       return reject(new Error("Invalid input parameters"));
//     }

//     // Example statistics data
//     var statistics = {
//       "totalReservations": 100,
//       "totalCustomers": 250,
//       "averageReservationSize": 2.5,
//       "mostPopularTime": "18:00",
//       "mostPopularDay": "Saturday"
//     };

//     // Simulate async operation (e.g., database interaction)
//     setTimeout(() => {
//       resolve(statistics);
//     }, 1000);
//   });
// }



