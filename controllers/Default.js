'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.addReservation = function addReservation (_, res, next, body, userId, businessId) {
  Default.addReservation(body, userId, businessId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.deleteReservation = function deleteReservation (_, res, next, userId, reservationId) {
  Default.deleteReservation(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.getAvailability = function getAvailability (_, res, next, businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  Default.getAvailability(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.getBusinessesByCategory = function getBusinessesByCategory (_, res, next, categoryName) {
  Default.getBusinessesByCategory(categoryName)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.modifyReservation = function modifyReservation (_, res, next, body, userId, reservationId) {
  Default.modifyReservation(body, userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.notifyUser = function notifyUser (_, res, next, userId, reservationId) {
  Default.notifyUser(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.searchBusinessByKeyword = function searchBusinessByKeyword (_, res, next, keyword) {
  Default.searchBusinessByKeyword(keyword)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.viewAReservation = function viewAReservation (_, res, next, reservationId, userId) {
  Default.viewAReservation(reservationId, userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.viewBusinessReservations = function viewBusinessReservations (_, res, next, ownerId, businessId, day, month, year) {
  Default.viewBusinessReservations(ownerId, businessId, day, month, year)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.viewBusinessStatistics = function viewBusinessStatistics (_, res, next, ownerId, businessId) {
  Default.viewBusinessStatistics(ownerId, businessId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};

module.exports.viewReservations = function viewReservations (_, res, next, userId) {
  Default.viewReservations(userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
      next();
    });
};
