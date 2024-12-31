'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.addReservation = function addReservation (_req, res, _, body, userId, businessId) {
  Default.addReservation(body, userId, businessId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.deleteReservation = function deleteReservation (_req, res, _, userId, reservationId) {
  Default.deleteReservation(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.getAvailability = function getAvailability (_req, res, _, businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  Default.getAvailability(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.getBusinessesByCategory = function getBusinessesByCategory (_req, res,_, categoryName) {
  Default.getBusinessesByCategory(categoryName)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.modifyReservation = function modifyReservation (_req, res,_, body, userId, reservationId) {
  Default.modifyReservation(body, userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.notifyUser = function notifyUser (_req, res,_, userId, reservationId) {
  Default.notifyUser(userId, reservationId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.searchBusinessByKeyword = function searchBusinessByKeyword (_req, res,_, keyword) {
  Default.searchBusinessByKeyword(keyword)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.viewAReservation = function viewAReservation (_req, res,_, reservationId, userId) {
  Default.viewAReservation(reservationId, userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.viewBusinessReservations = function viewBusinessReservations (_req, res,_, ownerId, businessId, day, month, year) {
  Default.viewBusinessReservations(ownerId, businessId, day, month, year)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.viewBusinessStatistics = function viewBusinessStatistics (_req, res,_, ownerId, businessId) {
  Default.viewBusinessStatistics(ownerId, businessId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};

module.exports.viewReservations = function viewReservations (_req, res,_, userId) {
  Default.viewReservations(userId)
    .then(function (response) {
      utils.writeJson(res, response, response.code);
    })
    .catch(function (response) {
      utils.writeJson(res, response, response.code);
    });
};
