'use strict';




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
