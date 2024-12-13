'use strict';

const { type } = require("ramda");




/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer UserId of the logged in user that made the reservation
 * businessId Integer BusinessId of the business that the reservation is made for
 * returns Reservation
 **/
exports.addReservation = function(body,userId,businessId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
    'reservationId': 1,
    'userId': 6,
    'businessId': 2,
    'reservationTime': '20:00',
    'reservationDay': 25,
    'reservationMonth': 12,
    'reservationYear': 2025,
    'numberOfPeople': 3,
    'username': "username",
    'businessName': "businessName"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
exports.deleteReservation = function(userId,reservationId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "Reservation deleted."
};
console.log(`Attempting to delete reservationId: ${reservationId} for userId: ${userId}`);
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


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
// exports.getAvailability = function(businessId,reservationDay,reservationMonth,reservationYear,numberOfPeople) {
//   return new Promise(function(resolve, reject) {
//     const availableHours = [ "18:00", "20:00" ];
//      const availableReservations = availableHours.map(hour => {
//        return {
//         reservationTime: hour
//       };
//     });
//     if (typeof businessId !== 'number' || typeof reservationDay !== 'number' || typeof reservationMonth !== 'number' || typeof reservationYear !== 'number' || typeof numberOfPeople !== 'number') {
//       return reject({
//         code: 400,
//         message: "Invalid businessId, reservationDay, reservationMonth, reservationYear, or numberOfPeople."
//       });
//     } else {
//       resolve(availableReservations);
//     }
//   });
// }


exports.getAvailability = function(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  return new Promise(function(resolve, reject) {
    const availableHours = [ "18:00", "20:00" ]; // Define all possible reservation times

    // Mock existing reservations data
    const businessReservations = [
      {
        reservationId: 1,
        userId: 6,
        ownerId: 7,
        reservationTime: '20:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 1,
        numberOfPeople: 2,
        reservationMonth: 5,
        username: "username",
      },
      {
        reservationId: 2,
        userId: 6,
        ownerId: 7,
        reservationTime: '18:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 2,
        numberOfPeople: 10,
        reservationMonth: 5,
        username: "username2"
      },
      {
        reservationId: 3,
        userId: 7,
        ownerId: 7,
        reservationTime: '20:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 2,
        numberOfPeople: 10,
        reservationMonth: 5,
        username: "username3"
      }
    ];

    // Input Validation
    if (
      typeof businessId !== 'number' ||
      typeof reservationDay !== 'number' ||
      typeof reservationMonth !== 'number' ||
      typeof reservationYear !== 'number' ||
      typeof numberOfPeople !== 'number' ||
      businessId <= 0 ||
      reservationDay <= 0 ||
      reservationMonth <= 0 ||
      reservationYear <= 0 ||
      numberOfPeople <= 0
    ) {
      return reject({
        code: 400,
        message: "Invalid businessId, reservationDay, reservationMonth, reservationYear, or numberOfPeople."
      });
    }

    // Fetch reservations for the specified business and date
    const existingReservations = businessReservations.filter(reservation => 
      reservation.reservationDay === reservationDay &&
      reservation.reservationMonth === reservationMonth &&
      reservation.reservationYear === reservationYear
    );

    // Extract reserved times
    const reservedTimes = existingReservations.map(reservation => reservation.reservationTime);

    // Determine available times by excluding reserved times
    const freeHours = availableHours.filter(hour => !reservedTimes.includes(hour));
    const freeHoursWithTime = freeHours.map(hour => { return { reservationTime: hour }; });

    // (Optional) If there's a capacity limit per time slot, you can add additional checks here
    // For example, assuming a maximum of 10 people per time slot
    const MAX_CAPACITY_PER_SLOT = 10;
    const capacityCheck = existingReservations.reduce((total, reservation) => total + reservation.numberOfPeople, 0);

    if (capacityCheck + numberOfPeople > MAX_CAPACITY_PER_SLOT) {
      return reject({
        code: 404,
        message: "No available hour found."
      });
    }

    // Resolve with available reservation times
    resolve(freeHoursWithTime);
  });
}

/**
 * FR1: The logged in user must be able to view the businesses that are included in the system divided by categories. 
 *
 * categoryName String The name of the category that the business belongs to.
 * returns List
 **/
// service/DefaultService.js

exports.getBusinessesByCategory = function(categoryName) {
  return new Promise(function(resolve, reject) {
    const businesses = [ 
      { 
        "ownerId": 6, 
        "businessName": "businessName", 
        "categoryName": "breakfast", 
        "keyword": "keyword", 
        "businessId": 1 
      },
      { 
        "ownerId": 6, 
        "businessName": "businessName", 
        "categoryName": "breakfast", 
        "keyword": "keyword", 
        "businessId": 1 
      }
    ];

    const filteredBusinesses = businesses.filter(b => 
      b.categoryName.toLowerCase() === categoryName.toLowerCase()
    );

    if (filteredBusinesses.length > 0) {
      resolve(filteredBusinesses);
    } else {
      reject({ 
        statusCode: 400, 
        message: "categoryName should be equal to one of the allowed values: breakfast, brunch, lunch, dinner, drinks"
      });
    }
  });
};





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
    'reservationId': 1,
    'userId': 6,
    'businessId': 2,
    'reservationTime': '20:00',
    'reservationDay': 25,
    'reservationMonth': 12,
    'reservationYear': 2025,
    'numberOfPeople': 3,
    'username': "username",
    'businessName': "businessName"
}, {
  'reservationId': 1,
  'userId': 6,
  'businessId': 2,
  'reservationTime': '20:00',
  'reservationDay': 25,
  'reservationMonth': 12,
  'reservationYear': 2025,
  'numberOfPeople': 3,
  'username': "username",
  'businessName': "businessName"
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
    const notification = {
      message: "You have a reservation in 2 hours"
    };
    const userReservations = [
      {
        userId: 6,
        reservationId: 1,
        reservationTime: "20:00",
        reservationDay: 25,
        reservationMonth: 12,
        reservationYear: 2025,
        numberOfPeople: 3,
        username: "username",
        businessName: "businessName"
      }
    ];
    if (typeof userId !== 'number' || typeof reservationId !== 'number'){
      return reject({
        code: 400,
        message: "Invalid userId or reservationId."
      });
    } else { 
      const filteredUserReservations = userReservations.filter(reservation => reservation.userId === userId && reservation.reservationId === reservationId);
      if (filteredUserReservations.length > 0) {
        resolve([notification]);
      } else {
        return reject({
          code: 404,
          message: "Reservation not found."
        });
      }
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
  const businesses = [{
  "ownerId" : 6,
  "businessName" : "businessName",
  "categoryName" : "breakfast",
  "keyword" : "keyword",
  "businessId" : 1
}, {
  "ownerId" : 6,
  "businessName" : "businessName",
  "categoryName" : "breakfast",
  "keyword" : "keyword",
  "businessId" : 1
} ];
console.log(typeof keyword);
if (typeof keyword !== 'string') {
  return reject({
    code: 400,
    message: "Invalid keyword."
  });
} else {
  const filteredBusinesses = businesses.filter(b => b.keyword === keyword);
  if (filteredBusinesses.length > 0) {
    resolve(filteredBusinesses);
  } else {
    return reject({
      code: 404,
      message: "Businesses not found with that keyword."
    });
  }
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
exports.viewAReservation = function(reservationId,userId) {
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

    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * FR11: The business owner must be able to view the reservations of his business. 
 *
 * ownerId Integer OwnerId of the business owner
 * day Integer Reservation day
 * month Integer Reservation month
 * year Integer Reservation year
 * returns List
 **/
exports.viewBusinessReservations = function(ownerId,day,month,year) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
    'reservationId': 1,
    'userId': 6,
    'businessId': 2,
    'reservationTime': '20:00',
    'reservationDay': 25,
    'reservationMonth': 12,
    'reservationYear': 2025,
    'numberOfPeople': 3,
    'username': "username",
    'businessName': "businessName"
}, {
  'reservationId': 1,
  'userId': 6,
  'businessId': 2,
  'reservationTime': '20:00',
  'reservationDay': 25,
  'reservationMonth': 12,
  'reservationYear': 2025,
  'numberOfPeople': 3,
  'username': "username",
  'businessName': "businessName"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * FR12: The business owner must be able to view the statistics of his business reservations. 
 *
 * ownerId Integer OwnerId of the business owner of the business that the reservations were made in.
 * returns List
 **/
exports.viewBusinessStatistics = function(businessId,ownerId) {
  return new Promise(function(resolve, reject) {
    const businessStatistics = [
      {
        'ownerId': 1,
        'businessId': 1,
        'month': 1,
        'numberOfReservations': 6

      },
      {
        'ownerId': 1,
        'businessId': 1,
        'month': 1,
        'numberOfReservations': 6
      }
    ];
    if (typeof ownerId !== 'number' || typeof businessId !== 'number') {
      return reject({
        code: 400,
        message: "Invalid ownerId or businessId."
      });
    } else {
      const filteredBusinessStatistics = businessStatistics.filter(b => b.ownerId === ownerId && b.businessId === businessId);
      if (filteredBusinessStatistics.length > 0) {
        resolve(filteredBusinessStatistics);
      }
      else {
        return reject({
          code: 404,
          message: "Business statistics not found."
        });
      }
    }
  });
}


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