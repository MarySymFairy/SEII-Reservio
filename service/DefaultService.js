'use strict';


const { use } = require('..');
const userID = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
const businessID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const reservationID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ownerID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CategoryName = ["Breakfast", "Lunch", "Dinner"];

const Users = {
  0: {userID: 0, username: "username", password: "admin", role: "user"},
  1: {userID:105 ,username: "user1", password: "password1", role: "user"},
  2: {userID:106 ,username: "user2", password: "password2", role: "user"},
};

const Owners = {
  1: {ownerID: 1, username: "owner1", password: "password1", role: "owner"},
  2: {ownerID: 2, username: "owner2", password: "password2", role: "owner"},
};  

const Businesses = {
  1: {owner: 1, name: "Business 1", category: "Breakfast", keyword: "keyword"},
  2: { owner: 2, name: "Cafe Central", category: "Lunch", keyword: "keyword" }, // Updated name
  3: {owner: 3, name: "Business 3", category: "Dinner", keyword: "keyword"},
};

const UserReservations = {
  105: [
    {date: "2024-12-05", time: "18:00", business: "Business 1", people: 7},
    {date: "2024-12-05", time: "19:00", business: "Business 2", people: 7},
  ],
  106: [
    {date: "2024-12-05", time: "20:00", business: "Business 3", people: 7},
    {date: "2024-12-05", time: "21:00", business: "Business 4", people: 7},
  ],
};

const BusinessReservations = {
  1: [
    {date: "2024-12-05", time: "18:00", user: 105, people: 7, username: "user1"},

    {date: "2024-12-05", time: "19:00", user: 106, people: 7, username: "user2"},
  ],
  2: [
    {date: "2024-12-05", time: "20:00", user: 107, people: 7, username: "user3"},
    {date: "2024-12-05", time: "21:00", user: 108, people: 7, username: "user4"},
  ],
};

const BusinessStatistics = {
  1: [
    {month: 1, reservations: 10},
    {month: 2, reservations: 20},
  ],
  2: [
    {month: 1, reservations: 10},
    {month: 2, reservations: 20},
  ],
};

const Notifications = {
  1: "Notification sent successfully.",
};

const Reservations = {
  1: {user: 105, business: 1, date: "2024-12-05", time: "18:00", people: 7},
  2: {user: 106, business: 2, date: "2024-12-05", time: "19:00", people: 7},
};

const Availability = {
  1: ["12:00", "18:00", "19:00"],
  2: ["12:00", "20:00", "21:00"],
  default: [],
};

/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer User-id of the logged in user that made the reservation
 * businessId Integer Business-id of the business that the reservation is made for
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
        typeof businessId !== 'number' ||
        !Users[userId] ||
        !Businesses[businessId]
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
          status: 409,
          message: 'Cannot reserve a date in the past.',
        });
      }

      // Validate February days
      const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();

      // Validate February days
      const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

      if (reservationMonth === 2) {
          const maxDays = isLeapYear(reservationYear) ? 29 : 28;
          if (reservationDay < 1 || reservationDay > maxDays) {
              console.error(`Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}`);
              return reject({
                  message: `Invalid reservation day. Expected a number between 1 and ${maxDays} for February.`,
                  errorCode: 'validation.error',
              });
          }
        } else if (reservationDay < 1 || reservationDay > daysInMonth) {
        return reject({
          message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`,
          errorCode: 'validation.error',
        });
      }

      // Validate time availability
      if (!Availability[businessId]?.includes(reservationTime)) {
        return reject({
          status: 409,
          message: 'Reservation time is not available.',
        });
      }

      // Create the reservation
      const newReservation = {
        'reservation-id': body['reservation-id'],
        'user-id': userId,
        'business-id': businessId,
        reservationTime,
        reservationDay,
        reservationMonth,
        reservationYear,
        numberOfPeople: body.numberOfPeople,
        username: Users[userId]?.username || body.username,
        businessName: Businesses[businessId]?.name || body.businessName,
      };

      if (!UserReservations[userId]) {
        UserReservations[userId] = [];
      }
      UserReservations[userId].push(newReservation);

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
exports.deleteReservation = function(userId,reservationId) {
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
 * In order to have the available hours for the specific reservation you want to create.  FR3: The logged in user must be able to start a reservation process by selecting a business  FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * businessId Integer Business-id of the business that the reservation is made for
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
  "availableHours" : [ "18:00", "18:00" ]
};
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
  "owner-id" : 6,
  "businessName" : "businessName",
  "businessCategory" : "Breakfast",
  "keyword" : "keyword",
  "business-id" : 0
}, {
  "owner-id" : 6,
  "businessName" : "businessName",
  "businessCategory" : "Breakfast",
  "keyword" : "keyword",
  "business-id" : 0
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
exports.modifyReservation = function(body,userId,reservationId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 5,
  "business-id" : 1,
  "reservationMonth" : 5,
  "numberOfPeople" : 7,
  "username" : "username"
}, {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 5,
  "business-id" : 1,
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
  "owner-id" : 6,
  "businessName" : "businessName",
  "businessCategory" : "Breakfast",
  "keyword" : "keyword",
  "business-id" : 0
}, {
  "owner-id" : 6,
  "businessName" : "businessName",
  "businessCategory" : "Breakfast",
  "keyword" : "keyword",
  "business-id" : 0
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
 * reservationId Integer Reservation-id of the reservation submitted to the system
 * userId Integer User-id of the logged in user that made the reservation
 * returns Reservation
 **/
exports.viewAReservation = function(reservationId,userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 5,
  "business-id" : 1,
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
 * ownerId Integer Owner-id of the business owner
 * day Integer Reservation day
 * month Integer Reservation month
 * year Integer Reservation year
 * returns List
 **/
exports.viewBusinessReservations = function(ownerId,day,month,year) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 1,
  "people" : 2,
  "reservationMonth" : 5,
  "username" : "username"
}, {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 1,
  "people" : 2,
  "reservationMonth" : 5,
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
 * FR12: The business owner must be able to view the statistics of his business reservations. 
 *
 * ownerId Integer Owner-id of the business owner of the business that the reservations were made in.
 * returns List
 **/
exports.viewBusinessStatistics = function(ownerId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "month" : 0,
  "numberOfReservations" : 6
}, {
  "month" : 0,
  "numberOfReservations" : 6
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
 * userId Integer User-id of the logged in user that made the reservation
 * returns List
 **/
exports.viewReservations = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 5,
  "business-id" : 1,
  "reservationMonth" : 5,
  "numberOfPeople" : 7,
  "username" : "username"
}, {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2025,
  "reservationDay" : 5,
  "business-id" : 1,
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
