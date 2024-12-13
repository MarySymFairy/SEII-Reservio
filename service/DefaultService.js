'use strict';


/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer UserId of the logged in user that made the reservation
 * businessId Integer BusinessId of the business that the reservation is made for
 * returns Reservation
 **/
exports.addReservation = function (body, userId, businessId) {
  return new Promise(function (resolve, reject) {
    try {
      const reservationTime = body.reservationTime ? body.reservationTime.trim() : '';
      const reservationDay = parseInt(body.reservationDay, 10);
      const reservationMonth = parseInt(body.reservationMonth, 10);
      const reservationYear = parseInt(body.reservationYear, 10);

      // Validate inputs
      if (
        !reservationTime ||
        typeof reservationTime !== 'string' ||
        isNaN(reservationDay) ||
        isNaN(reservationMonth) ||
        isNaN(reservationYear) ||
        typeof body.numberOfPeople !== 'number' ||
        body.numberOfPeople <= 0 ||
        typeof userId !== 'number' ||
        typeof businessId !== 'number'
      ) {
        return reject({
          message: 'Invalid data types or values.',
          code: 400,
        });
      }

      // Validate time format
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(reservationTime)) {
        return reject({
          message: 'Invalid time format. Expected HH:mm.',
          errorCode: 'validation.error',
        });
      }

      // Validate date fields
      const today = new Date();
      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

      if (reservationDateUTC < todayUTC) {
        return reject({
          code: 409,
          message: 'Cannot reserve a date in the past.',
        });
      }

      // Validate February days
      const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();

      // Validate February days
      const isLeapYear = (year) => {
        (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
      };

      if (reservationMonth === 2) {
        const maxDays = isLeapYear(reservationYear) ? 29 : 28;
        if (reservationDay < 1 || reservationDay > maxDays) {
          return reject({
            code: 400,
            error: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`,
          });
        }
      } else if (reservationDay < 1 || reservationDay > daysInMonth) {
        return reject({
          message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`,
          errorCode: 'validation.error',
        });
      }

      // Validate time availability
      // if (!Availability[businessId]?.includes(reservationTime)) {
      //   return reject({
      //     status: 409,
      //     message: 'Reservation time is not available.',
      //   });
      // }

      // Create the reservation
      const newReservation = {
        'reservationId': body['reservationId'],
        'userId': userId,
        'businessId': businessId,
        reservationTime,
        reservationDay,
        reservationMonth,
        reservationYear,
        numberOfPeople: body.numberOfPeople,
        username: body.username,
        businessName: body.businessName,
      };

      // if (!UserReservations[userId]) {
      //   UserReservations[userId] = [];
      // }
      // UserReservations[userId].push(newReservation);

      resolve(newReservation);

    } catch (error) {
      console.error('Error in reservation logic:', error);
      reject({
        message: 'Internal server error',
        errorCode: 'server.error',
      });
    }
  });
};








/**
 * Deletes a single reservation based on the reservationID supplied
 * FR8 - The logged in user must be able to cancel his existing reservation 
 *
 * userId Integer Retrieve the ID of the user
 * reservationId Integer ID of reservation to delete
 * returns Reservation deleted.
 **/
exports.deleteReservation = function (userId, reservationId) {
  return new Promise((resolve, reject) => {
    // Validate input types
    if (typeof userId !== "number" || typeof reservationId !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. userId and reservationId must be numbers.",
      });
    }

    var examples = {};
    examples['application/json'] = {
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
    };

    const reservation = Object.values(examples).find(reservation => reservation.reservationId === reservationId);

    // Simulate database check
    if (reservation) {
      return resolve({
        message: "Reservation deleted.",
      });
    } else{
      return reject ({
        code: 404,
        message: "Reservation not found.",
      });
    }
  });
};


  // var examples = {};
  // examples['application/json'] = { 
  //   "message" : 'Reservation deleted.'
  // };
    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  // });
// }








/**
 * In order to have the available hours for the specific reservation you want to create.  FR3: The logged in user must be able to start a reservation process by selecting a business  FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * businessId Integer BusinessId of the business that the reservation is made for
 * reservationDay Integer The arranged reservation day
 * reservationMonth Integer The arranged reservation month
 * reservationYear Integer The arranged reservation year
 * numberOfPeople Integer The arranged number of people that will be in the reservation
 * returns inline_response_200
 **/
exports.getAvailability = function(businessId,reservationDay,reservationMonth,reservationYear,numberOfPeople) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "availableHours" : [ "18:00", "20:00" ]
    };
    if (isNaN(businessId) || typeof businessId !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. businessId must be a number.",
      });
    } else if (isNaN(reservationDay) || typeof reservationDay !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. reservationDay must be a number.",
      });
    } else if (isNaN(reservationMonth) || typeof reservationMonth !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. reservationMonth must be a number.",
      });
    } else if (isNaN(reservationYear) || typeof reservationYear !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. reservationYear must be a number.",
      });
    } else if (isNaN(numberOfPeople) || typeof numberOfPeople !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. numberOfPeople must be a number.",
      });
    }

    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
    var examples = {};
    examples['application/json'] = [ {
      "ownerId" : 6,
      "businessName" : "businessName",
      "businessCategory" : "Breakfast",
      "keyword" : "keyword",
      "businessId" : 0
    }, {
      "ownerId" : 6,
      "businessName" : "businessName",
      "businessCategory" : "Breakfast",
      "keyword" : "keyword",
      "businessId" : 0
    } ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Modifies a single reservation based on the reservationId supplied
 * FR7 - The logged-in user must be able to modify his reservation 
 *
 * body Reservation Reservation to be modified (numberOfPeople, date, time)
 * userId Integer Retrieve the ID of the user
 * reservationId Long ID of the reservation to modify
 * returns List
 **/
exports.modifyReservation = function(body,userId,reservationId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
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
    "reservationId" : 1,
    "userId" : 6,
    "reservationTime" : "12:00",
    "businessName" : "businessName",
    "reservationYear" : 2025,
    "reservationDay" : 7,
    "businessId" : 1,
    "reservationMonth" : 5,
    "numberOfPeople" : 7,
    "username" : "username"
  } ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * FR9: The system must be able to notify the logged in user for his reservation at the reservation date.
 *
 * userId Integer Retrieve the ID of the user
 * reservationId Integer Retrieve the ID of the reservation
 * returns You have a reservation in 2 hours
 **/
exports.notifyUser = function(userId,reservationId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "message" : "message"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * FR2: The logged in user must be able to search for a business with a keyword.  
 *
 * keyword String The keyword to search for businesses.
 * returns List
 **/
exports.searchBusinessByKeyword = function(keyword) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
      "ownerId" : 6,
      "businessName" : "businessName",
      "businessCategory" : "Breakfast",
      "keyword" : "keyword",
      "businessId" : 0
    }, {
      "ownerId" : 6,
      "businessName" : "businessName",
      "businessCategory" : "Breakfast",
      "keyword" : "keyword",
      "businessId" : 0
    } ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
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
    if (isNaN(userId) || typeof userId !== "number" || !Number.isInteger(userId)) {
      return reject({
        code: 400,
        message: "Invalid user ID format.",
      });
    } else if ( isNaN(reservationId) || typeof reservationId !== "number" || !Number.isInteger(reservationId)) {
      return reject({
        code: 400,
        message: "Invalid reservation ID format.",
      });
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
    }else {
      return reject({
        code: 404,
        message: "Reservation not found.",
      })    
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
    if (typeof userId !== "number" || !Number.isInteger(userId)) {
      return reject({
          code: 400,
          message: "Invalid user ID format.", // Match expected output
      });
    } 
  

    var examples = {};
    examples['application/json'] = [ {
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
    } ];

    const userReservations = examples['application/json'].filter(reservation => reservation.userId === userId);

    if (userReservations.length > 0) {
        return resolve(userReservations);
    } else {
        return resolve([]); // Return empty array if no reservations are found
    }
  });
};




//BUSINESS FUNCTIONS

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
    if (typeof ownerId !== "number" || typeof businessId !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. userId and reservationId must be numbers.",
      });
    }
    if (typeof day !== "number" || typeof month !== "number" || typeof year !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. day, month, and year must be numbers.",
      });
    }
    
    var examples = {};
    examples['application/json'] = [ {
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
    } ];

    console.log("CHECKME");
    console.log(ownerId, businessId, day, month, year);

    //Filter if business reservations exist (in mock data)
    const filtered = examples['application/json'].filter(
      (r) => r.ownerId === ownerId && r.businessId === businessId && r.reservationDay === day && r.reservationMonth === month && r.reservationYear === year
    );
    
    if (filtered.length > 0) {
      resolve(filtered);
    } else{
      reject({code: 404, message: "No business reservations found."});
    }
  });
}    



/**
 * FR12: The business owner must be able to view the statistics of his business reservations. 
 *
 * ownerId Integer OwnerId of the business owner of the business that the reservations were made in.
 * returns List
 **/
exports.viewBusinessStatistics = function(businessId, ownerId) {
  return new Promise(function(resolve, reject) {
    if (typeof ownerId !== "number" || typeof businessId !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. userId and reservationId must be numbers.",
      });
    }

    var examples = {};
    examples['application/json'] = [ {
      "month" : 0,
      "numberOfReservations" : 6,
      "ownerId" : 7,
      "businessId" : 8
    }, {
      "month" : 0,
      "numberOfReservations" : 6,
      "ownerId" : 7,
      "businessId" : 8
    } ];

    console.log("CHECKME");
    console.log("OWNER",ownerId, "BUSINESS",businessId);
    // filter if ownerId and businessId exist (in mock data)
    const filtStat = examples['application/json'].filter(
      b => b.ownerId === ownerId && b.businessId === businessId
    );
    
    if (filtStat.length > 0) {
      resolve(filtStat);
    }
    else {
      return reject({
        code: 404,
        message: "Business statistics not found."
      });
    }


    // if (Object.keys(examples).length > 0) {
    //   resolve(examples[Object.keys(examples)[0]]);
    // } else {
    //   resolve();
    // }
  });
}



