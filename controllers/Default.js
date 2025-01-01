'use strict';

// Import utilities for JSON response handling
var utils = require('../utils/writer.js');
// Import the Default service which contains the core business logic
var Default = require('../service/DefaultService');

// Add a new reservation
module.exports.addReservation = function addReservation(req, res, next, body, userId, businessId) {
  Default.addReservation(body, userId, businessId)
    .then(function (response) {
      // Write a successful response
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      // Write an error response
      utils.writeJson(res, response, response.code);
    });
};

// Delete an existing reservation
module.exports.deleteReservation = function deleteReservation(req, res, next, userId, reservationId) {
  Default.deleteReservation(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// Get availability for reservations
module.exports.getAvailability = function getAvailability(req, res, next, businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  Default.getAvailability(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// Retrieve businesses by category
module.exports.getBusinessesByCategory = function getBusinessesByCategory(req, res, next, categoryName) {
  Default.getBusinessesByCategory(categoryName)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// Modify an existing reservation
module.exports.modifyReservation = function modifyReservation(req, res, next, body, userId, reservationId) {
  Default.modifyReservation(body, userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// Notify a user about their reservation
module.exports.notifyUser = function notifyUser(req, res, next, userId, reservationId) {
  Default.notifyUser(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// Search businesses by a keyword
module.exports.searchBusinessByKeyword = function searchBusinessByKeyword(req, res, next, keyword) {
  Default.searchBusinessByKeyword(keyword)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// View a specific reservation
module.exports.viewAReservation = function viewAReservation(req, res, next, reservationId, userId) {
  Default.viewAReservation(reservationId, userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// View all reservations for a specific business
module.exports.viewBusinessReservations = function viewBusinessReservations(req, res, next, ownerId, businessId, day, month, year) {
  Default.viewBusinessReservations(ownerId, businessId, day, month, year)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// View business statistics
module.exports.viewBusinessStatistics = function viewBusinessStatistics(req, res, next, ownerId, businessId) {
  Default.viewBusinessStatistics(ownerId, businessId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

// View reservations for a specific user
module.exports.viewReservations = function viewReservations(req, res, next, userId) {
  Default.viewReservations(userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};
