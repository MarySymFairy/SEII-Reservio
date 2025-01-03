'use strict';

// Common validation function
function validateAvailabilityInputs(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  if (
    typeof businessId !== 'number' || typeof reservationDay !== 'number' ||
    typeof reservationMonth !== 'number' || typeof reservationYear !== 'number' ||
    typeof numberOfPeople !== 'number' || businessId < 0 || reservationDay <= 0 ||
    reservationMonth <= 0 || reservationYear < 2024 || numberOfPeople <= 0 || 
    numberOfPeople > 100 || !Number.isInteger(numberOfPeople) || !Number.isInteger(businessId) ||
    !Number.isInteger(reservationDay) || !Number.isInteger(reservationMonth) || !Number.isInteger(reservationYear)
  ) {
    throw {
      code: 400,
      message: "Invalid businessId, reservationDay, reservationMonth, reservationYear, or numberOfPeople."
    };
  }
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
exports.getAvailability = async function(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople) {
  return new Promise(function(resolve, reject) {
    try {
      validateAvailabilityInputs(businessId, reservationDay, reservationMonth, reservationYear, numberOfPeople);
    } catch (error) {
      return reject(error);
    }

    const availableHours = [ "18:00", "20:00" ]; // Define all possible reservation times

    // Mock existing reservations data
    const businessReservations = [
      {
        reservationId: 1,
        userId: 6,
        ownerId: 7,
        businessId: 1,
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
        businessId: 1,
        reservationTime: '18:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 2,
        numberOfPeople: 99,
        reservationMonth: 5,
        username: "username2"
      },
      {
        reservationId: 3,
        userId: 7,
        ownerId: 7,
        businessId: 1,
        reservationTime: '20:00',
        businessName: "businessName",
        reservationYear: 2026,
        reservationDay: 2,
        numberOfPeople: 10,
        reservationMonth: 5,
        username: "username3"
      }
    ];

    // Fetch reservations for the specified business and date
    const existingReservations = businessReservations.filter(reservation => 
      reservation.reservationDay === reservationDay &&
      reservation.reservationMonth === reservationMonth &&
      reservation.reservationYear === reservationYear &&
      reservation.businessId === businessId
    );

    // Extract reserved times
    const reservedTimes = existingReservations.map(reservation => reservation.reservationTime);

    // Determine available times by excluding reserved times
    const freeHours = availableHours.filter(hour => !reservedTimes.includes(hour));
    const freeHoursWithTime = freeHours.map(hour => { return { reservationTime: hour }; });

    // (Optional) If there's a capacity limit per time slot, you can add additional checks here
    // For example, assuming a maximum of 10 people per time slot
    const MAX_CAPACITY_PER_SLOT = 100;
    const capacityCheck = existingReservations.reduce((total, reservation) => total + reservation.numberOfPeople, 0);

    if (capacityCheck + numberOfPeople > MAX_CAPACITY_PER_SLOT) {
      return reject({
        code: 404,
        message: "No available hour found."
      });
    }

    const freeHoursArray = freeHoursWithTime.map(item => item.reservationTime);

    // Resolve with available reservation times
    resolve(freeHoursArray);
  });
}