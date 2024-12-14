'use strict';


/**
 * FR4: The logged in user must be able to set his reservation details in the selected business. FR6: The logged in user must be able to submit his reservation in the system. FR5: The logged in user must be able to select an available hour for his reservation. 
 *
 * body Reservation Submit reservation to the system
 * userId Integer UserId of the logged in user that made the reservation
 * businessId Integer BusinessId of the business that the reservation is made for
 * returns Reservation
 **/
// exports.addReservation = function (body, userId, businessId) {
//   return new Promise(function (resolve, reject) {
//     try {
//       //const { reservationDay, reservationMonth, reservationYear, numberOfPeople } = body;
//       const reservationTime = body.reservationTime ? body.reservationTime.trim() : '';
//       const reservationDay = parseInt(body.reservationDay, 10);
//       const reservationMonth = parseInt(body.reservationMonth, 10);
//       const reservationYear = parseInt(body.reservationYear, 10);

//       // Validate inputs
//       if (
//         typeof reservationDay !== 'number' ||
//         typeof reservationMonth !== 'number' ||
//         typeof reservationYear !== 'number' ||
//         typeof numberOfPeople !== 'number' ||

//         !reservationTime ||
//         typeof reservationTime !== 'string' ||
//         isNaN(reservationDay) ||
//         isNaN(reservationMonth) ||
//         isNaN(reservationYear) ||
//         typeof body.numberOfPeople !== 'number' ||
//         body.numberOfPeople <= 0 ||
//         typeof userId !== 'number' ||
//         typeof businessId !== 'number'
//       ) {
//         return reject({
//           message: 'Invalid data types or values.',
//           code: 400,
//         });
//       }

//       // Validate time format
//       const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
//       if (!timeRegex.test(reservationTime)) {
//         return reject({
//           message: 'Invalid time format. Expected HH:mm.',
//           errorCode: 'validation.error',
//         });
//       }

//       // Validate date fields
//       const today = new Date();
//       const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
//       const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

//       if (reservationDateUTC < todayUTC) {
//         return reject({
//           code: 409,
//           message: 'Cannot reserve a date in the past.',
//         });
//       }

//       // Validate February days
//       const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();

//       // Validate February days
//       const isLeapYear = (year) => {
//         (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
//       };

//       if (reservationMonth === 2) {
//         const maxDays = isLeapYear(reservationYear) ? 29 : 28;
//         if (reservationDay < 1 || reservationDay > maxDays) {
//           return reject({
//             code: 400,
//             error: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`,
//           });
//         }
//       } else if (reservationDay < 1 || reservationDay > daysInMonth) {
//         return reject({
//           message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`,
//           errorCode: 'validation.error',
//         });
//       }

//       // Validate time availability
//       // if (!Availability[businessId]?.includes(reservationTime)) {
//       //   return reject({
//       //     status: 409,
//       //     message: 'Reservation time is not available.',
//       //   });
//       // }

//       // Create the reservation
//       const newReservation = {
//         'reservationId': body['reservationId'],
//         'userId': userId,
//         'businessId': businessId,
//         reservationTime,
//         reservationDay,
//         reservationMonth,
//         reservationYear,
//         numberOfPeople: body.numberOfPeople,
//         username: body.username,
//         businessName: body.businessName,
//       };

//       // if (!UserReservations[userId]) {
//       //   UserReservations[userId] = [];
//       // }
//       // UserReservations[userId].push(newReservation);

//       resolve(newReservation);

//     } catch (error) {
//       console.error('Error in reservation logic:', error);
//       reject({
//         message: 'Internal server error',
//         errorCode: 'server.error',
//       });
//     }
//   });
// };

exports.addReservation = function (body, userId, businessId) {
  return new Promise(async function (resolve, reject) {
    try {
      const { reservationDay, reservationMonth, reservationYear, numberOfPeople } = body;

      // Validate input parameters
      if (
        typeof reservationDay !== 'number' ||
        typeof reservationMonth !== 'number' ||
        typeof reservationYear !== 'number' ||
        typeof numberOfPeople !== 'number' ||
        userId <= 0 ||
        businessId <= 0 ||
        numberOfPeople <= 0
      ) {
        return reject({
          message: 'Invalid data types or values.',
          code: 400,
        });
      }

      // Validate reservation date
      const today = new Date();
      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

      if (reservationDateUTC < todayUTC) {
        return reject({
          code: 409,
          message: 'Cannot reserve a date in the past.',
        });
      }

      // Validate February days
      const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };

      const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();

      if (reservationMonth === 2) {
        const maxDays = isLeapYear(reservationYear) ? 29 : 28;
        if (reservationDay < 1 || reservationDay > maxDays) {
          return reject({
            code: 400,
            error: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`,
          });
        }
      } else if (reservationDay < 1 || reservationDay > daysInMonth) {
        return reject({
          message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`,
          errorCode: 'validation.error',
        });
      }

      // Fetch reservation availability
      const availableTimes = await exports.getAvailability(
        businessId,
        reservationDay,
        reservationMonth,
        reservationYear,
        numberOfPeople
      );

      if (!availableTimes || availableTimes.length === 0) {
        return reject({
          code: 409,
          message: 'No available reservation times for the selected date and number of people.',
        });
      }

      // Select a reservation time (e.g., the first available time)
      const selectedTime = availableTimes[0].reservationTime;

      if (!selectedTime) {
        return reject({
          code: 409,
          message: 'No available reservation times found.',
        });
      }

      // Create the reservation
      const newReservation = {
        reservationId: generateReservationId(), // Implement ID generation logic
        userId,
        businessId,
        reservationTime: selectedTime,
        reservationDay,
        reservationMonth,
        reservationYear,
        numberOfPeople,
        username: body.username,
        businessName: body.businessName,
      };

      // Save the reservation (e.g., to a database)
      // Example: await database.saveReservation(newReservation);

      resolve(newReservation);

    } catch (error) {
      console.error('Error in addReservation:', error);
      reject({
        message: 'Internal server error',
        code: 500,
      });
    }
  });
};

/**
 * Generates a unique reservation ID.
 * Implement this function based on your application's requirements.
 **/
function generateReservationId() {
  return Math.floor(Math.random() * 1000000); // Example implementation
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
exports.getAvailability = function(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  return new Promise(function(resolve, reject) {
    const availableHours = [ "18:00", "20:00" ]; // Define all possible reservation times

    // Mock existing reservations data
    const businessReservations = [
      {
        reservationId: 1,
        userId: 6,
        ownerId: 7,
        reservationTime: '20:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 1,
        numberOfPeople: 2,
        reservationMonth: 5,
        username: "username",
      },
      {
        reservationId: 2,
        userId: 6,
        ownerId: 7,
        reservationTime: '18:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 2,
        numberOfPeople: 10,
        reservationMonth: 5,
        username: "username2"
      },
      {
        reservationId: 3,
        userId: 7,
        ownerId: 7,
        reservationTime: '20:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 2,
        numberOfPeople: 10,
        reservationMonth: 5,
        username: "username3"
      }
    ];

    // Input Validation
    if (
      typeof businessId !== 'number' ||
      typeof reservationDay !== 'number' ||
      typeof reservationMonth !== 'number' ||
      typeof reservationYear !== 'number' ||
      typeof numberOfPeople !== 'number' ||
      businessId <= 0 ||
      reservationDay <= 0 ||
      reservationMonth <= 0 ||
      reservationYear <= 0 ||
      numberOfPeople <= 0
    ) {
      return reject({
        code: 400,
        message: "Invalid businessId, reservationDay, reservationMonth, reservationYear, or numberOfPeople."
      });
    }

    // Fetch reservations for the specified business and date
    const existingReservations = businessReservations.filter(reservation => 
      reservation.reservationDay === reservationDay &&
      reservation.reservationMonth === reservationMonth &&
      reservation.reservationYear === reservationYear
    );

    // Extract reserved times
    const reservedTimes = existingReservations.map(reservation => reservation.reservationTime);

    // Determine available times by excluding reserved times
    const freeHours = availableHours.filter(hour => !reservedTimes.includes(hour));
    const freeHoursWithTime = freeHours.map(hour => { return { reservationTime: hour }; });

    // (Optional) If there's a capacity limit per time slot, you can add additional checks here
    // For example, assuming a maximum of 10 people per time slot
    const MAX_CAPACITY_PER_SLOT = 10;
    const capacityCheck = existingReservations.reduce((total, reservation) => total + reservation.numberOfPeople, 0);

    if (capacityCheck + numberOfPeople > MAX_CAPACITY_PER_SLOT) {
      return reject({
        code: 404,
        message: "No available hour found."
      });
    }

    // Resolve with available reservation times
    resolve(freeHoursWithTime);
  });
}

// exports.getAvailability = function(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
//   return new Promise(function(resolve, reject) {
//     const availableHours = [ "18:00", "19:00", "20:00" ]; // Define all possible reservation times

//     // Mock existing reservations data
//     const businessReservations = [
//       {
//         reservationId: 1,
//         userId: 6,
//         businessId: 2,
//         reservationTime: '20:00',
//         reservationYear: 2026,
//         reservationDay: 1,
//         reservationMonth: 5,
//         numberOfPeople: 2,
//         username: "username",
//       },
//       // Add more reservations as needed
//     ];

//     // Input Validation
//     if (
//       typeof businessId !== 'number' ||
//       typeof reservationDay !== 'number' ||
//       typeof reservationMonth !== 'number' ||
//       typeof reservationYear !== 'number' ||
//       typeof numberOfPeople !== 'number' ||
//       businessId <= 0 ||
//       reservationDay <= 0 ||
//       reservationMonth <= 0 ||
//       reservationYear <= 0 ||
//       numberOfPeople <= 0
//     ) {
//       return reject({
//         code: 400,
//         message: "Invalid businessId, reservationDay, reservationMonth, reservationYear, or numberOfPeople."
//       });
//     }

//     // Fetch reservations for the specified business and date
//     const existingReservations = businessReservations.filter(reservation => 
//       reservation.businessId === businessId &&
//       reservation.reservationDay === reservationDay &&
//       reservation.reservationMonth === reservationMonth &&
//       reservation.reservationYear === reservationYear
//     );

//     // Extract reserved times
//     const reservedTimes = existingReservations.map(reservation => reservation.reservationTime);

//     // Determine available times by excluding reserved times
//     const freeHours = availableHours.filter(hour => !reservedTimes.includes(hour));
//     const freeHoursWithTime = freeHours.map(hour => ({ reservationTime: hour }));

//     // (Optional) If there's a capacity limit per time slot, you can add additional checks here
//     // For example, assuming a maximum of 10 people per time slot
//     const MAX_CAPACITY_PER_SLOT = 10;
//     const capacityCheck = existingReservations.reduce((total, reservation) => total + reservation.numberOfPeople, 0);

//     if (capacityCheck + numberOfPeople > MAX_CAPACITY_PER_SLOT) {
//       return reject({
//         code: 409, // Conflict
//         message: "No available hour found due to capacity limits."
//       });
//     }

//     // Resolve with available reservation times
//     resolve(freeHoursWithTime);
//   });
// };

/**
 * FR1: The logged in user must be able to view the businesses that are included in the system divided by categories. 
 *
 * categoryName String The name of the category that the business belongs to.
 * returns List
 **/
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
exports.modifyReservation = function (body, userId, reservationId) {
  return new Promise(function (resolve, reject) {
    try {
      const reservationTime = body.reservationTime ? body.reservationTime.trim() : '';
      const reservationDay = parseInt(body.reservationDay, 10);
      const reservationMonth = parseInt(body.reservationMonth, 10);
      const reservationYear = parseInt(body.reservationYear, 10);

      // Validate inputs
      if (
        isNaN(reservationId) || typeof reservationId !== 'number' || typeof userId !== 'number' ||
        (body.reservationTime && typeof reservationTime !== 'string') || reservationId < 0 || userId < 0 ||
        (body.reservationDay && isNaN(reservationDay)) ||
        (body.reservationMonth && isNaN(reservationMonth)) ||
        (body.reservationYear && isNaN(reservationYear)) ||
        (body.numberOfPeople && (typeof body.numberOfPeople !== 'number' || body.numberOfPeople <= 0))
      ) {
        return reject({
          message: 'Invalid data types or values.',
          code: 400,
        });
      }

      // Validate time format if provided
      if (body.reservationTime) {
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(reservationTime)) {
          return reject({
            message: 'Invalid time format. Expected HH:mm.',
            errorCode: 'validation.error',
          });
        }
      }

      // Validate date fields if provided
      if (body.reservationDay || body.reservationMonth || body.reservationYear) {
        const today = new Date();
        const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

        if (reservationDateUTC < todayUTC) {
          return reject({
            code: 409,
            message: 'Cannot modify a reservation to a date in the past.',
          });
        }

        // Validate February days
        const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();
        const isLeapYear = (year) =>
          (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

        if (reservationMonth === 2) {
          const maxDays = isLeapYear(reservationYear) ? 29 : 28;
          if (reservationDay < 1 || reservationDay > maxDays) {
            return reject({
              code: 400,
              error: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`,
            });
          }
        } else if (reservationDay < 1 || reservationDay > daysInMonth) {
          return reject({
            message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`,
            errorCode: 'validation.error',
          });
        }
      }

      // Fetch the existing reservation (mocked here; replace with actual logic to retrieve reservations)
      // const existingReservation = UserReservations[userId]?.find(r => r.reservationId === reservationId);
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
        username: 'username'
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
        reservationTime: reservationTime || existingReservation.reservationTime,
        reservationDay: reservationDay || existingReservation.reservationDay,
        reservationMonth: reservationMonth || existingReservation.reservationMonth,
        reservationYear: reservationYear || existingReservation.reservationYear,
        numberOfPeople: body.numberOfPeople || existingReservation.numberOfPeople,
      };

      // Save the updated reservation (mocked here; replace with actual save logic)
      // const index = UserReservations[userId].findIndex(r => r.reservationId === reservationId);
      // UserReservations[userId][index] = updatedReservation;

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
 * Finds a reservation by ID and user ID.
 * Implement this function based on your application's requirements.
 **/
async function findReservationById(reservationId, userId) {
  // Example implementation:
  // const reservation = await database.findReservation({ reservationId, userId });
  // return reservation;
  
  // Mock implementation for demonstration:
  const reservations = [
    {
      reservationId: 1,
      userId: 6,
      businessId: 2,
      reservationTime: '20:00',
      reservationDay: 25,
      reservationMonth: 12,
      reservationYear: 2025,
      numberOfPeople: 3,
      username: "username",
      businessName: "businessName"
    },
    // Add more reservations as needed
  ];

  return reservations.find(reservation => reservation.reservationId === reservationId && reservation.userId === userId);
}
// exports.modifyReservation = function(body, userId, reservationId) {
//   return new Promise(function(resolve, reject) {
//     const { numberOfPeople, reservationDay, reservationMonth, reservationYear } = body;
//     if (
//       typeof numberOfPeople !== 'number' ||
//       typeof reservationDay !== 'number' ||
//       typeof reservationMonth !== 'number' ||
//       typeof reservationYear !== 'number' ||
//       numberOfPeople <= 0 ||
//       reservationDay <= 0 ||
//       reservationMonth <= 0 ||
//       reservationYear <= 0 ||
//       typeof userId !== 'number' ||
//       typeof reservationId !== 'number'
//     ) {
//       return reject({
//         code: 400,
//         message: "Invalid data types or values."
//       });
//     }
//     // Mock existing reservations data
//     const reservations = [
//       {
//         reservationId: 1,
//         userId: 6,
//         businessId: 2,
//         reservationTime: '20:00',
//         reservationDay: 25,
//         reservationMonth: 12,
//         reservationYear: 2025,
//         numberOfPeople: 3,
//         username: "username",
//         businessName: "businessName"
//       },
//       // Add more reservations as needed
//     ];
//     // Find the reservation to modify
//     const reservationIndex = reservations.findIndex(
//       reservation => reservation.reservationId === reservationId && reservation.userId === userId
//     );

//     if (reservationIndex === -1) {
//       return reject({
//         code: 404,
//         message: "Reservation not found."
//       });
//     }

//     const today = new Date();
//     const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
//     const reservationDateUTC = Date.UTC(reservationYear, reservationMonth - 1, reservationDay);

//     if (reservationDateUTC < todayUTC) {
//       return reject({
//         code: 409,
//         message: "Cannot reserve a date in the past."
//       });
//     }

//     const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();
//     if (reservationDay < 1 || reservationDay > daysInMonth) {
//       return reject({
//         code: 400,
//         message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`
//       });
//     }

//     // Validate February days
//     const isLeapYear = (year) => {
//       return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
//     };

//     if (reservationMonth === 2) {
//       const maxDays = isLeapYear(reservationYear) ? 29 : 28;
//       if (reservationDay < 1 || reservationDay > maxDays) {
//         return reject({
//           code: 400,
//           message: `Invalid reservation day for February: ${reservationDay}. Max allowed: ${maxDays}.`
//         });
//       }
//     } else if (reservationDay < 1 || reservationDay > daysInMonth) {
//       return reject({
//         code: 400,
//         message: `Invalid reservation day. Expected a number between 1 and ${daysInMonth}.`
//       });
//     }

//     const availableTimes = await exports.getAvailability(reservations[reservationIndex].businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople);
//     const selectedTime = availableTimes[0].reservationTime;

//     if(!selectedTime) {
//       return reject({
//         code: 404,
//         message: "No available hour found."
//       });
//     }





//     // Update the reservation details
//     const updatedReservation = {
//       ...reservation,
//       numberOfPeople,
//       reservationTime: selectedTime,
//       reservationDay,
//       reservationMonth,
//       reservationYear
//     };

//     // Return the updated reservation
//     resolve(updatedReservation);
//   });
// };

/**
 * FR9: The system must be able to notify the logged in user for his reservation at the reservation date.
 *
 * userId Integer Retrieve the ID of the user
 * reservationId Integer Retrieve the ID of the reservation
 * returns You have a reservation in 2 hours
 **/
exports.notifyUser = function(userId,reservationId) {
  return new Promise(function(resolve, reject) {
    const notification = {
      message: "You have a reservation in 2 hours"
    };
    const userReservations = [
      {
        userId: 6,
        reservationId: 1,
        reservationTime: "20:00",
        reservationDay: 25,
        reservationMonth: 12,
        reservationYear: 2025,
        numberOfPeople: 3,
        username: "username",
        businessName: "businessName"
      }
    ];
    if (typeof userId !== 'number' || typeof reservationId !== 'number'){
      return reject({
        code: 400,
        message: "Invalid userId or reservationId."
      });
    } else { 
      const filteredUserReservations = userReservations.filter(reservation => reservation.userId === userId && reservation.reservationId === reservationId);
      if (filteredUserReservations.length > 0) {
        resolve([notification]);
      } else {
        return reject({
          code: 404,
          message: "Reservation not found."
        });
      }
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
    if (isNaN(userId) || typeof userId !== "number" || !Number.isInteger(userId)) {
      return reject({
        code: 400,
        message: "Invalid user ID format.",
      });
    } else if ( isNaN(reservationId) || typeof reservationId !== "number" || !Number.isInteger(reservationId)) {
      return reject({
        code: 400,
        message: "Invalid reservation ID format.",
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
    if (typeof userId !== "number" || !Number.isInteger(userId)) {
      return reject({
          code: 400,
          message: "Invalid user ID format.", // Match expected output
      });
    } 
  

    var examples = {};
    examples['application/json'] = [ {
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
    }, {
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
    } ];

    const userReservations = examples['application/json'].filter(reservation => reservation.userId === userId);

    if (userReservations.length > 0) {
        return resolve(userReservations);
    } else {
        return resolve([]); // Return empty array if no reservations are found
    }
  });
};