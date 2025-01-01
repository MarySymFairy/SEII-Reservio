'use strict';

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
      "categoryName" : "breakfast",
      "keyword" : "keyword",
      "businessId" : 0
    }, {
      "ownerId" : 6,
      "businessName" : "businessName",
      "categoryName" : "breakfast",
      "keyword" : "keyword",
      "businessId" : 0
    } ];

    console.log("CHECKME", categoryName);
    const filteredBusinesses = examples['application/json'].filter(
      b => b.categoryName.toLowerCase() === categoryName.toLowerCase()
    );

    if (filteredBusinesses.length > 0) {
      resolve(filteredBusinesses);
    } else {
      reject({ 
        statusCode: 400, 
        message: "categoryName should be equal to one of the allowed values: breakfast, brunch, lunch, dinner, drinks"
      })
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

    if (typeof keyword !== 'string') {
      return reject({
        code: 400,
        message: "Invalid keyword."
      });
    }
    
    const filteredBusinesses = examples['application/json'].filter(
      b => b.keyword === keyword
    );

    if (filteredBusinesses.length > 0) {
      resolve(filteredBusinesses);
    } else {
      return reject({
        code: 404,
        message: "Businesses not found with that keyword."
      });
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
exports.viewBusinessReservations = function(ownerId, businessId, day, month, year) {
  return new Promise(function(resolve, reject) {
    if (typeof ownerId !== "number" || typeof businessId !== "number" || 
      !Number.isInteger(ownerId) || !Number.isInteger(businessId) || 
      ownerId < 0 || businessId < 0) {
        return reject({
          code: 400,
          message: "Invalid data types. userId and reservationId must be numbers.",
        });
    }
    if (typeof day !== "number" || typeof month !== "number" || typeof year !== "number" || 
      day < 0 || month < 0 || year < 0 || day > 31 || month > 12 || year < 2024) {
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
    if (!Number.isInteger(ownerId) || typeof ownerId !== "number" || 
      typeof businessId !== "number" || !Number.isInteger(businessId) || 
      ownerId < 0 || businessId < 0) {
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
  });
}