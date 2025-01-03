'use strict';

// Import utilities for JSON response handling
var utils = require('../utils/writer.js');
// Import the Default service which contains the core business logic
//var Default = require('../service/DefaultService');
var DefaultReservation = require('../service/ReservationService');
var DefaultBusiness = require('../service/BusinessService');
var DefaultAvailability = require('../service/AvailabilityService');
var DefaultNotification = require('../service/NotificationService');
var DefaultViewReservation = require('../service/ViewReservationService');

// Add a new reservation
module.exports.addReservation = function addReservation(_, res, next, body, userId, businessId) {
  DefaultReservation.addReservation(body, userId, businessId)
    .then(function (response) {
      // Write a successful response
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      // Write an error response
      utils.writeJson(res, response, response.code);
      next();
    });
};

// Delete an existing reservation
module.exports.deleteReservation = function deleteReservation(_, res, next, userId, reservationId) {
  DefaultReservation.deleteReservation(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// Get availability for reservations
module.exports.getAvailability = function getAvailability(_, res, next, businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  DefaultAvailability.getAvailability(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// Retrieve businesses by category
module.exports.getBusinessesByCategory = function getBusinessesByCategory(_, res, next, categoryName) {
  DefaultBusiness.getBusinessesByCategory(categoryName)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// Modify an existing reservation
module.exports.modifyReservation = function modifyReservation(_, res, next, body, userId, reservationId) {
  DefaultReservation.modifyReservation(body, userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// Notify a user about their reservation
module.exports.notifyUser = function notifyUser(_, res, next, userId, reservationId) {
  DefaultNotification.notifyUser(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// Search businesses by a keyword
module.exports.searchBusinessByKeyword = function searchBusinessByKeyword(_, res, next, keyword) {
  DefaultBusiness.searchBusinessByKeyword(keyword)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// View a specific reservation
module.exports.viewAReservation = function viewAReservation(_, res, next, reservationId, userId) {
  DefaultViewReservation.viewAReservation(reservationId, userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// View all reservations for a specific business
module.exports.viewBusinessReservations = function viewBusinessReservations(_, res, next, ownerId, businessId, day, month, year) {
  DefaultViewReservation.viewBusinessReservations(ownerId, businessId, day, month, year)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// View business statistics
module.exports.viewBusinessStatistics = function viewBusinessStatistics(_, res, next, ownerId, businessId) {
  DefaultBusiness.viewBusinessStatistics(ownerId, businessId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

// View reservations for a specific user
module.exports.viewReservations = function viewReservations(_, res, next, userId) {
  DefaultViewReservation.viewReservations(userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};
