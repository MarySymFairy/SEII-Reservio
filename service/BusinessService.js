'use strict';

function validateCategoryName(categoryName) {
  const allowedCategories = ["breakfast", "brunch", "lunch", "dinner", "drinks"];
  if (!allowedCategories.includes(categoryName.toLowerCase())) {
    return {
      valid: false,
      error: {
        statusCode: 400, 
        message: "categoryName should be equal to one of the allowed values: breakfast, brunch, lunch, dinner, drinks"
      }
    };
  }
  return { valid: true };
}

function validateKeyword(keyword) {
  if (typeof keyword !== 'string') {
    return {
      valid: false,
      error: {
        code: 400,
        message: "Invalid keyword."
      }
    };
  }
  return { valid: true };
}

function validateOwnerAndBusinessId(ownerId, businessId) {
  if (!Number.isInteger(ownerId) || typeof ownerId !== "number" || 
    typeof businessId !== "number" || !Number.isInteger(businessId) || 
    ownerId < 0 || businessId < 0) {
      return {
        valid: false,
        error: {
          code: 400,
          message: "Invalid data types. userId and reservationId must be numbers.",
        }
      };
  }
  return { valid: true };
}

/**
 * FR1: The logged in user must be able to view the businesses that are included in the system divided by categories. 
 *
 * categoryName String The name of the category that the business belongs to.
 * returns List
 **/
exports.getBusinessesByCategory = function(categoryName) {
  return new Promise(function(resolve, reject) {
    const validation = validateCategoryName(categoryName);
    if (!validation.valid) {
      return reject(validation.error);
    }

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
    const validation = validateKeyword(keyword);
    if (!validation.valid) {
      return reject(validation.error);
    }

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
 * FR12: The business owner must be able to view the statistics of his business reservations. 
 *
 * ownerId Integer OwnerId of the business owner of the business that the reservations were made in.
 * returns List
 **/
exports.viewBusinessStatistics = function(businessId, ownerId) {
  return new Promise(function(resolve, reject) {
    const validation = validateOwnerAndBusinessId(ownerId, businessId);
    if (!validation.valid) {
      return reject(validation.error);
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