'use strict';

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function validateReservationDay(reservationDay, reservationMonth, reservationYear) {
  if (reservationMonth === 2) {
    const maxDays = isLeapYear(reservationYear) ? 29 : 28;
    if (reservationDay < 1 || reservationDay > maxDays) {
      return {
        code: 400, error: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`,
      };
    }
  } else {
    const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();
    if (reservationDay < 1 || reservationDay > daysInMonth) {
      return {
        message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`, errorCode: 'validation.error',
      };
    }
  }
}

function validateTimeFormat(time) {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function validateInputs(body, userId, businessId) {
  const reservationTime = body.reservationTime ? body.reservationTime.trim() : '';
  const reservationDay = parseInt(body.reservationDay, 10);
  const reservationMonth = parseInt(body.reservationMonth, 10);
  const reservationYear = parseInt(body.reservationYear, 10);

  if (
    !reservationTime || typeof reservationTime !== 'string' || isNaN(reservationDay) || isNaN(reservationMonth) || isNaN(reservationYear) || 
    typeof body.numberOfPeople !== 'number' || body.numberOfPeople <= 0 || typeof userId !== 'number' || typeof businessId !== 'number'
  ) {
    return {
      valid: false,
      error: {
        message: 'Invalid data types or values.', code: 400,
      }
    };
  }

  if (!validateTimeFormat(reservationTime)) {
    return {
      valid: false,
      error: {
        message: 'Invalid time format. Expected HH:mm.', errorCode: 'validation.error',
      }
    };
  }

  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

  if (reservationDateUTC < todayUTC) {
    return {
      valid: false,
      error: {
        code: 409, message: 'Cannot reserve a date in the past.',
      }
    };
  }

  const dayValidationError = validateReservationDay(reservationDay, reservationMonth, reservationYear);
  if (dayValidationError) {
    return {
      valid: false,
      error: dayValidationError
    };
  }

  return { valid: true };
}

// Mock data for reservations
const examples = {
  'application/json': [
    {
      "reservationId": 0,
      "userId": 6,
      "reservationTime": "12:00",
      "businessName": "businessName",
      "reservationYear": 2025,
      "reservationDay": 5,
      "businessId": 1,
      "reservationMonth": 5,
      "numberOfPeople": 7,
      "username": "username"
    }
  ]
};

function findReservationById(reservationId) {
  return examples['application/json'].find(reservation => reservation.reservationId === reservationId);
}

exports.addReservation = function (body, userId, businessId) {
  return new Promise(function (resolve, reject) {
    try {
      const validation = validateInputs(body, userId, businessId);
      if (!validation.valid) {
        return reject(validation.error);
      }

      const newReservation = {
        reservationId: body.reservationId, userId: userId, businessId: businessId, reservationTime: body.reservationTime.trim(), reservationDay: parseInt(body.reservationDay, 10),
        reservationMonth: parseInt(body.reservationMonth, 10), reservationYear: parseInt(body.reservationYear, 10), numberOfPeople: body.numberOfPeople, username: body.username, businessName: body.businessName,
      };

      resolve(newReservation);
    } catch (error) {
      console.error('Error in reservation logic:', error);
      reject({
        message: 'Internal server error', errorCode: 'server.error',
      });
    }
  });
};

exports.modifyReservation = function (body, userId, reservationId) {
  return new Promise(function (resolve, reject) {
    try {
      const reservationTime = body.reservationTime ? body.reservationTime.trim() : '';
      const reservationDay = parseInt(body.reservationDay, 10);
      const reservationMonth = parseInt(body.reservationMonth, 10);
      const reservationYear = parseInt(body.reservationYear, 10);

      if (
        isNaN(reservationId) || typeof reservationId !== 'number' || typeof userId !== 'number' ||
        (body.reservationTime && typeof reservationTime !== 'string') || reservationId < 0 || userId < 0 ||
        (body.reservationDay && isNaN(reservationDay)) || (body.reservationMonth && isNaN(reservationMonth)) ||
        (body.reservationYear && isNaN(reservationYear)) || (body.numberOfPeople && (typeof body.numberOfPeople !== 'number' || body.numberOfPeople <= 0))
      ) {
        return reject({
          message: 'Invalid data types or values.', code: 400,
        });
      }

      if (body.reservationTime && !validateTimeFormat(reservationTime)) {
        return reject({
          message: 'Invalid time format. Expected HH:mm.', errorCode: 'validation.error',
        });
      }

      if (body.reservationDay || body.reservationMonth || body.reservationYear) {
        const today = new Date();
        const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

        if (reservationDateUTC < todayUTC) {
          return reject({
            code: 409, message: 'Cannot modify a reservation to a date in the past.',
          });
        }

        const dayValidationError = validateReservationDay(reservationDay, reservationMonth, reservationYear);
        if (dayValidationError) {
          return reject(dayValidationError);
        }
      }

      const existingReservation = findReservationById(reservationId);

      if (!existingReservation) {
        return reject({
          code: 404, message: 'Reservation not found.',
        });
      }

      const updatedReservation = {
        ...existingReservation,
        reservationTime: reservationTime || existingReservation.reservationTime,
        reservationDay: reservationDay || existingReservation.reservationDay,
        reservationMonth: reservationMonth || existingReservation.reservationMonth,
        reservationYear: reservationYear || existingReservation.reservationYear,
        numberOfPeople: body.numberOfPeople || existingReservation.numberOfPeople,
      };

      resolve(updatedReservation);
    } catch (error) {
      console.error('Error in modifying reservation:', error);
      reject({
        message: 'Internal server error', errorCode: 'server.error',
      });
    }
  });
};

exports.deleteReservation = function (userId, reservationId) {
  return new Promise((resolve, reject) => {
    if (typeof userId !== "number" || typeof reservationId !== "number") {
      return reject({
        code: 400, message: "Invalid data types. userId and reservationId must be numbers.",
      });
    }

    const reservation = findReservationById(reservationId);

    if (reservation) {
      return resolve({
        message: "Reservation deleted.",
      });
    } else {
      return reject({
        code: 404, message: "Reservation not found.",
      });
    }
  });
};