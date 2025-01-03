'use strict';

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Validates the reservation day for February and other months.
 * @param {number} reservationDay - The day of the reservation.
 * @param {number} reservationMonth - The month of the reservation.
 * @param {number} reservationYear - The year of the reservation.
 * @returns {Object|undefined} - Returns an error object if validation fails, otherwise undefined.
 */
function validateReservationDay(reservationDay, reservationMonth, reservationYear) {
  if (reservationMonth === 2) {
    const maxDays = isLeapYear(reservationYear) ? 29 : 28;
    if (reservationDay < 1 || reservationDay > maxDays) {
      return {
        code: 400,
        error: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`,
      };
    }
  } else {
    const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();
    if (reservationDay < 1 || reservationDay > daysInMonth) {
      return {
        message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`,
        errorCode: 'validation.error',
      };
    }
  }
}

function validateTimeFormat(reservationTime) {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(reservationTime)) {
    return { message: 'Invalid time format. Expected HH:mm.', errorCode: 'validation.error' };
  }
  return null;
}

function validateDateNotInPast(reservationYear, reservationMonth, reservationDay) {
  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

  if (reservationDateUTC < todayUTC) {
    return { code: 409, message: 'Cannot reserve a date in the past.' };
  }
  return null;
}

function validateInputs(body, userId, businessId) {
  const reservationTime = body.reservationTime ? body.reservationTime.trim() : '';
  const reservationDay = parseInt(body.reservationDay, 10);
  const reservationMonth = parseInt(body.reservationMonth, 10);
  const reservationYear = parseInt(body.reservationYear, 10);

  if (!reservationTime || typeof reservationTime !== 'string' || isNaN(reservationDay) || isNaN(reservationMonth) || isNaN(reservationYear) ||
      typeof body.numberOfPeople !== 'number' || body.numberOfPeople <= 0 || typeof userId !== 'number' || typeof businessId !== 'number') {
    return { message: 'Invalid data types or values.', code: 400 };
  }

  const timeFormatError = validateTimeFormat(reservationTime);
  if (timeFormatError) {
    return timeFormatError;
  }

  const datePastError = validateDateNotInPast(reservationYear, reservationMonth, reservationDay);
  if (datePastError) {
    return datePastError;
  }

  const dayValidationError = validateReservationDay(reservationDay, reservationMonth, reservationYear);
  if (dayValidationError) {
    return dayValidationError;
  }

  return null;
}

/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer UserId of the logged in user that made the reservation
 * businessId Integer BusinessId of the business that the reservation is made for
 * returns Reservation
 **/
exports.addReservation = function (body, userId, businessId) {
  return new Promise(function (resolve, reject) {
    try {
      const validationError = validateInputs(body, userId, businessId);
      if (validationError) {
        return reject(validationError);
      }

      const newReservation = {
        reservationId: body.reservationId,
        userId: userId,
        businessId: businessId,
        reservationTime: body.reservationTime.trim(),
        reservationDay: parseInt(body.reservationDay, 10),
        reservationMonth: parseInt(body.reservationMonth, 10),
        reservationYear: parseInt(body.reservationYear, 10),
        numberOfPeople: body.numberOfPeople,
        username: body.username,
        businessName: body.businessName,
      };

      resolve(newReservation);
    } catch (error) {
      console.error('Error in reservation logic:', error);
      reject({
        message: 'Internal server error',
        errorCode: 'server.error',
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
exports.modifyReservation = function (body, userId, reservationId) {
  return new Promise(function (resolve, reject) {
    try {
      if (isNaN(reservationId) || typeof reservationId !== 'number' || typeof userId !== 'number' || reservationId < 0 || userId < 0) {
        return reject({
          message: 'Invalid data types or values.',
          code: 400,
        });
      }

      if (body.reservationTime) {
        const timeFormatError = validateTimeFormat(body.reservationTime.trim());
        if (timeFormatError) {
          return reject(timeFormatError);
        }
      }

      if (body.reservationDay || body.reservationMonth || body.reservationYear) {
        const validationError = validateInputs(body, userId, reservationId);
        if (validationError) {
          return reject(validationError);
        }
      }

      // Fetch the existing reservation (mocked here; replace with actual logic to retrieve reservations)
      const existingReservation = {
        reservationId: 0,
        userId: 6,
        reservationTime: '12:00',
        businessName: 'businessName',
        reservationYear: 2025,
        reservationDay: 5,
        businessId: 1,
        reservationMonth: 5,
        numberOfPeople: 7,
        username: 'username',
      }; // Mock data

      if (!existingReservation) {
        return reject({
          code: 404,
          message: 'Reservation not found.',
        });
      }

      // Modify the reservation with provided data
      const updatedReservation = {
        ...existingReservation,
        reservationTime: body.reservationTime || existingReservation.reservationTime,
        reservationDay: body.reservationDay || existingReservation.reservationDay,
        reservationMonth: body.reservationMonth || existingReservation.reservationMonth,
        reservationYear: body.reservationYear || existingReservation.reservationYear,
        numberOfPeople: body.numberOfPeople || existingReservation.numberOfPeople,
      };

      resolve(updatedReservation);
    } catch (error) {
      console.error('Error in modifying reservation:', error);
      reject({
        message: 'Internal server error',
        errorCode: 'server.error',
      });
    }
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
exports.deleteReservation = function (userId, reservationId) {
  return new Promise((resolve, reject) => {
    // Validate input types
    if (typeof userId !== "number" || typeof reservationId !== "number") {
      return reject({
        code: 400,
        message: "Invalid data types. userId and reservationId must be numbers.",
      });
    }

    var examples = {};
    examples['application/json'] = {
      "reservationId" : 0,
      "userId" : 6,
      "reservationTime" : "12:00",
      "businessName" : "businessName",
      "reservationYear" : 2025,
      "reservationDay" : 5,
      "businessId" : 1,
      "reservationMonth" : 5,
      "numberOfPeople" : 7,
      "username" : "username"
    };

    const reservation = Object.values(examples).find(reservation => reservation.reservationId === reservationId);

    // Simulate database check
    if (reservation) {
      return resolve({
        message: "Reservation deleted.",
      });
    } else{
      return reject ({
        code: 404,
        message: "Reservation not found.",
      });
    }
  });
};