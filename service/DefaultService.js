'use strict';


/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer User-id of the logged in user that made the reservation
 * businessId Integer Business-id of the business that the reservation is made for
 * returns Reservation
 **/
exports.addReservation = function(body,userId,businessId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
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
  "reservationYear" : 2,
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
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

