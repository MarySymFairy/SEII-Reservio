'use strict';

const { use } = require('..');
const userID = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
const businessID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const reservationID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ownerID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CategoryName = ["breakfast", "lunch", "dinner"];

const Users = {
  1: {userID:105 ,username: "user1", password: "password1", role: "user"},
  2: {userID:106 ,username: "user2", password: "password2", role: "user"},
};

const Owners = {
  1: {ownerID: 1, username: "owner1", password: "password1", role: "owner"},
  2: {ownerID: 2, username: "owner2", password: "password2", role: "owner"},
};  

// const Businesses = {
//   1: {owner: 1, name: "Business 1", category: "Breakfast", keyword: "keyword"},
//   2: {owner: 2, name: "Business 2", category: "Lunch", keyword: "keyword"},
//   3: {owner: 3, name: "Business 3", category: "Dinner", keyword: "keyword"},
// };

const Businesses = [
  { id: 1, owner: 1, name: "Business 1", category: "breakfast", keyword: "cozy" },
  { id: 2, owner: 2, name: "Business 2", category: "lunch", keyword: "vegan" },
  { id: 3, owner: 3, name: "Business 3", category: "dinner", keyword: "family" },
];


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
  1: ["18:00", "19:00"],
  2: ["20:00", "21:00"],
  default: [],
};

/*
*
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer User-id of the logged in user that made the reservation
 * businessId Integer Business-id of the business that the reservation is made for
 * returns Reservation
 * var examples = {};
    examples['application/json'] = {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2,
  "reservationDay" : 5,
  "business-id" : 1,
  "reservationMonth" : 5,
  "numberOfPeople" : 7,
  "username" : "username"
};
 **/
exports.addReservation = function(body,userId,businessId) {
  return new Promise(function(resolve, reject) {
    //Validate data types
    if (
      typeof body.reservationTime !== "time" ||
      typeof body.businessName !== "string" ||
      typeof body.reservationYear !== "integer" ||
      typeof body.reservationDay !== "integer" ||
      typeof body.business-id !== "integer" ||
      typeof body.reservationMonth !== "integer" ||
      typeof body.numberOfPeople !== "integer" ||
      typeof body.username !== "string" ||
      typeof userId !== "integer" ||
      typeof businessId !== "integer" ||
      typeof userId === "undefined" ||
      typeof businessId === "undefined" ||
      body.reservationTime < 0 ||
      body.business-id < 0 ||
      body.reservationYear < 0 ||
      body.reservationDay < 0 ||
      body.reservationDay > 31 ||
      body.reservationMonth < 0 ||
      body.reservationMonth > 12 ||
      body.numberOfPeople < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the business exists
    if (!Businesses[businessId]) {
      return reject({status: 404, message: "Business not found."});
    }
    //Check if the user exists
    if (!Users[userId]) {
      return reject({
        message: "User not found.",
        code: 404
      });
    }
    //Check if the user has already made a reservation
    if (UserReservations[userId]) {
      return reject({
        status: 409,
        message: "User has already made a reservation."
      });
    }
    //Check if the business has already been reserved
    if (BusinessReservations[businessId]) {
      return reject({
        status: 409,
        message: "Business has already been reserved."
      });
    }
    //Check if the reservation date is in the past
    if (body.reservationYear === 2024 && body.reservationMonth === 12 && body.reservationDay === 5) {
      return reject({status: 409, message: "Cannot reserve a date in the past."});
    }
    //Check if the reservation is valid
    if (body.reservationTime !== Availability[businessId]) {
      return reject({status: 409, message: "Reservation time is not available."});
    }
    //Check if the username exists
    if (!Users[body.username]) {
      return reject({status: 404, message: "Username not found."});
    }
    // Check for existing reservation at the same time
    const existingReservation = UserReservations[userId].filter(
      (reservation) => reservation.date === body.date && reservation.time === body.time
    );
    if (existingReservation.length > 0) {
      return reject({status: 409, message: "Reservation already exists at this time."});
    }
    //Create the reservation
    const newReservation = {
      date: body.date,
      time: body.time,
      business: Businesses[businessId].name,
      people: body.people,
      username: Users[userId].username,
    };
    UserReservations[userId].push(newReservation);
    resolve({
      message: "Reservation submitted successfully.",
      code: 201,
    });
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
    //Validate data types
    if (
      typeof userId !== "integer" ||
      typeof reservationId !== "integer" ||
      typeof userId === "undefined" ||
      typeof reservationId === "undefined" ||
      userId < 0 ||
      reservationId < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }

    //Check if user exists
    if (!Users[userId]) {
      return reject({
        message: "User not found.",
        code: 404
      });
    }
    //Check if reservation exists
    const reservationIndex = UserReservations[userId].findIndex(
      (reservation) => reservation.id === reservationId
    );
    if (reservationIndex === -1) {
      return reject({
        message: "Reservation not found.",
        code: 404
      });
    }
    //Check if the user is authorized to delete the reservation
    if (Reservations[reservationId].user !== userId) {
      return reject({
        message: "Unauthorized access.",
        code: 401
      });
    }
    //Delete the reservation
    userReservations[userId].splice(reservationIndex, 1);
    Reservations[reservationId].deleted = true;
    resolve({
      message: "Reservation deleted.",
      code: 200
    });
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
    //Validate data types
    if (
      typeof businessId !== "integer" ||
      typeof reservationDay !== "integer" ||
      typeof reservationMonth !== "integer" ||
      typeof reservationYear !== "integer" ||
      typeof numberOfPeople !== "integer" ||
      typeof businessId === "undefined" ||
      typeof reservationDay === "undefined" ||
      typeof reservationMonth === "undefined" ||
      typeof reservationYear === "undefined" ||
      typeof numberOfPeople === "undefined" ||
      businessId < 0 ||
      reservationDay < 0 ||
      reservationDay > 31 ||
      reservationMonth < 0 ||
      reservationMonth > 12 ||
      reservationYear < 0 ||
      numberOfPeople < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the business exists
    if (!Businesses[businessId]) {
      return reject({status: 404, message: "Business not found."});
    }
    //Check if the reservation date is in the past
    if (reservationYear === 2024 && reservationMonth === 12 && reservationDay === 5) {
      return reject({status: 409, message: "Cannot reserve a date in the past."});
    }
    //Check if the business has available hours
    if (Availability[businessId]) {
      return resolve({
        availableHours: Availability[businessId],
        code: 200
      });
    }
  });
}



/**
 * FR1: The logged in user must be able to view the businesses that are included in the system divided by categories. 
 *
 * categoryName String The name of the category that the business belongs to.
 * returns List
 * var examples = {};
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
 **/
exports.getBusinessesByCategory = function (categoryName) {
  return new Promise(function (resolve, reject) {
    // Validate data types
    if (typeof categoryName !== "string" || categoryName.trim() === "") {
      return reject({
        message: "Invalid data types.",
        code: 400,
      });
    }
    // Check if the category exists
    if (!CategoryName.includes(categoryName)) {
      return reject({
        status: 404,
        message: "Category not found.",
      });
    }
    // Find businesses by category
    const results = Object.values(Businesses).filter(
    (business) => business.category.toLowerCase() === categoryName.toLowerCase()
    );
    resolve({
      businesses: results,
      code: 200,
    });
  });
};



/**
 * Modifies a single reservation based on the reservation-id supplied
 * FR7 - The logged-in user must be able to modify his reservation 
 *
 * body Reservation Reservation to be modified (numberOfPeople, date, time)
 * userId Integer Retrieve the ID of the user
 * reservationId Long ID of the reservation to modify
 * returns List
 * var examples = {};
    examples['application/json'] = [ {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2,
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
  "reservationYear" : 2,
  "reservationDay" : 5,
  "business-id" : 1,
  "reservationMonth" : 5,
  "numberOfPeople" : 7,
  "username" : "username"
} ];
 **/
exports.modifyReservation = function(body,userId,reservationId) {
  return new Promise(function(resolve, reject) {
    
    //Validate data types
    if (
      typeof body.reservationTime !== "time" ||
      typeof body.businessName !== "string" ||
      typeof body.reservationYear !== "integer" ||
      typeof body.reservationDay !== "integer" ||
      typeof body.business-id !== "integer" ||
      typeof body.reservationMonth !== "integer" ||
      typeof body.numberOfPeople !== "integer" ||
      typeof body.username !== "string" ||
      typeof userId !== "integer" ||
      typeof reservationId !== "integer" ||
      typeof userId === "undefined" ||
      typeof reservationId === "undefined" ||
      userId < 0 ||
      reservationId < 0 ||
      body.reservationTime < 0 ||
      body.business-id < 0 ||
      body.reservationYear < 0 ||
      body.reservationDay < 0 ||
      body.reservationDay > 31 ||
      body.reservationMonth < 0 ||
      body.reservationMonth > 12 ||
      body.numberOfPeople < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the user exists
    if (!Users[userId]) {
      return reject({
        message: "User not found.",
        code: 404
      });
    }
    //Check if the reservation exists
    if (!Reservations[reservationId]) {
      return reject({
        message: "Reservation not found.",
        code: 404
      });
    }
    //Check if the user is authorized to modify the reservation
    if (Reservations[reservationId].user !== userId) {
      return reject({
        message: "You are not authorized to modify this reservation.",
        code: 403
      });
    }
    //Check if the reservation date is in the past
    if (body.reservationYear === 2024 && body.reservationMonth === 12 && body.reservationDay === 5) {
      return reject({status: 409, message: "Cannot modify reservation to an expired date."});
    }
    //Check if the reservation is valid
    if (body.reservationTime !== Availability[Reservations[reservationId].business]) {
      return reject({status: 409, message: "Reservation time is not available."});
    }
    //Check if the username exists
    if (!Users[body.username]) {
      return reject({status: 404, message: "Username not found."});
    }
    //Modify the reservation
    Reservations[reservationId] = {
      date: body.date,
      time: body.time,
      business: Businesses[Reservations[reservationId].business].name,
      people: body.people,
      username: Users[userId].username,
    };
    resolve({
      message: "Reservation modified.",
      code: 200
    });
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
    //Validate data types
    if (
      typeof userId !== "integer" ||
      typeof reservationId !== "integer" ||
      typeof userId === "undefined" ||
      typeof reservationId === "undefined" ||
      userId < 0 ||
      reservationId < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the user exists
    if (!Users[userId]) {
      return reject({
        message: "User not found.",
        code: 404
      });
    }
    //Check if the reservation exists
    if (!Reservations[reservationId]) {
      return reject({
        message: "Reservation not found.",
        code: 404
      });
    }
  });
}


/**
 * FR2: The logged in user must be able to search for a business with a keyword.  
 *
 * keyword String The keyword to search for businesses.
 * returns List
 * var examples = {};
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
 **/
exports.searchBusinessByKeyword = function (keyword) {
  return new Promise(function (resolve, reject) {
    // Validate data types
    if (typeof keyword !== "string" || typeof keyword === "undefined") {
      return reject({
        message: "Invalid data types.",
        code: 400,
      });
    }

    // Filter businesses by keyword
    const filteredBusinesses = Businesses.filter(
      (business) => business.keyword.toLowerCase() === keyword.toLowerCase()
    );

    if (filteredBusinesses.length === 0) {
      return reject({ status: 404, message: "No businesses found." });
    }

    resolve({
      businesses: filteredBusinesses,
      code: 200,
    });
  });
};


/**
 * FR10: The logged in user must be able to view his reservations. 
 *
 * reservationId Integer Reservation-id of the reservation submitted to the system
 * userId Integer User-id of the logged in user that made the reservation
 * returns Reservation var examples = {};
    examples['application/json'] = {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2,
  "reservationDay" : 5,
  "business-id" : 1,
  "reservationMonth" : 5,
  "numberOfPeople" : 7,
  "username" : "username"
};
 **/
exports.viewAReservation = function(reservationId,userId) {
  return new Promise(function(resolve, reject) {
    //Validate data types
    if (
      typeof reservationId !== "integer" ||
      typeof userId !== "integer" ||
      typeof reservationId === "undefined" ||
      typeof userId === "undefined" ||
      reservationId < 0 ||
      userId < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the user exists
    if (!Users[userId]) {
      return reject({
        message: "User not found.",
        code: 404
      });
    }
    //Check if the reservation exists
    if (!Reservations[reservationId]) {
      return reject({
        message: "Reservation not found.",
        code: 404
      });
    }
    //Check if the user is authorized to view the reservation
    if (Reservations[reservationId].user !== userId) {
      return reject({
        message: "You are not authorized to view this reservation.",
        code: 403
      });
    }
    //Return the reservation
    resolve(Reservations[reservationId]);
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
 * var examples = {};
    examples['application/json'] = [ {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 5,
  "reservationDay" : 1,
  "people" : 2,
  "reservationMonth" : 5,
  "username" : "username"
}, {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 5,
  "reservationDay" : 1,
  "people" : 2,
  "reservationMonth" : 5,
  "username" : "username"
} ];
 **/
exports.viewBusinessReservations = function(ownerId,day,month,year) {
  return new Promise(function(resolve, reject) {
    //Validate data types
    if (
      typeof ownerId !== "integer" ||
      typeof day !== "integer" ||
      typeof month !== "integer" ||
      typeof year !== "integer" ||
      typeof ownerId === "undefined" ||
      typeof day === "undefined" ||
      typeof month === "undefined" ||
      typeof year === "undefined" ||
      ownerId < 0 ||
      day < 0 ||
      day > 31 ||
      month < 0 ||
      month > 12 ||
      year < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the owner exists
    if (!Owners[ownerId]) {
      return reject({status: 404, message: "Owner not found."});
    }
    //Check if the business exists
    if (!Businesses[ownerId]) {
      return reject({status: 404, message: "Business not found."});
    }
    //Check if the reservation date is in the past
    if (year === 2024 && month === 12 && day === 5) {
      return reject({status: 409, message: "Cannot view reservations for a date in the past."});
    }
    //Return the reservations
    if (BusinessReservations[ownerId]) {
      return resolve(BusinessReservations[ownerId]);
    }
  });
}


/**
 * FR12: The business owner must be able to view the statistics of his business reservations. 
 *
 * ownerId Integer Owner-id of the business owner of the business that the reservations were made in.
 * returns List
 * var examples = {};
    examples['application/json'] = [ {
  "month" : 0,
  "numberOfReservations" : 6
}, {
  "month" : 0,
  "numberOfReservations" : 6
} ];
 **/
exports.viewBusinessStatistics = function(ownerId) {
  return new Promise(function(resolve, reject) {  
    //Validate data types
    if (
      typeof ownerId !== "integer" ||
      typeof ownerId === "undefined" ||
      ownerId < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the owner exists
    if (!Owners[ownerId]) {
      return reject({status: 404, message: "Owner not found."});
    }
    //Return the statistics
    if (BusinessStatistics[ownerId]) {
      return resolve(BusinessStatistics[ownerId]);
    }
  });
}


/**
 * FR10: The logged in user must be able to view his reservations. 
 *
 * userId Integer User-id of the logged in user that made the reservation
 * returns List
 * var examples = {};
    examples['application/json'] = [ {
  "reservation-id" : 0,
  "user-id" : 6,
  "reservationTime" : "reservationTime",
  "businessName" : "businessName",
  "reservationYear" : 2,
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
  "reservationYear" : 2,
  "reservationDay" : 5,
  "business-id" : 1,
  "reservationMonth" : 5,
  "numberOfPeople" : 7,
  "username" : "username"
} ];
 **/
exports.viewReservations = function(userId) {
  return new Promise(function(resolve, reject) {
    //Validate data types
    if (
      typeof userId !== "integer" ||
      typeof userId === "undefined" ||
      userId < 0
    ) {
      return reject({
        message: "Invalid data types.",
        code: 400
      });
    }
    //Check if the user exists
    if (!Users[userId]) {
      return reject({
        message: "User not found.",
        code: 404
      });
    }
    //Return the reservations
    if (UserReservations[userId]) {
      return resolve(UserReservations[userId]);
    }
  });
}

