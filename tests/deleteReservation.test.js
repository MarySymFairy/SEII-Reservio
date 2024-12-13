// const http = require("http");
// const test = require("ava");
// const got = require("got");

// const app = require('../index.js');

// test.before(async (t) => {
//     t.context.server = http.createServer(app);
//     const server = t.context.server.listen();
//     const { port } = server.address();
//     t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` });
// });

// test.after.always((t) => {

//     t.context.server.close();
// });

// // DELETE -----------------------------------------------------------------------------
// test("DELETE /reservations/:id - Delete nonexistent reservation", async (t) => {
//     const reservationId = 56;
//     const error = await t.throwsAsync(() =>
//       t.context.got.delete(`reservations/${reservationId}?userId=0`, {
//         throwHttpErrors: true, // Ensure errors are thrown for non-2xx status codes
//       })
//     );
  
//     // Check that the response has the expected status code and error message
//     t.is(error.response.statusCode, 404);
//     t.regex(error.response.body.message, /Reservation not found/);
//   });

//   test("DELETE /reservations/:id - Delete reservation (happy path)", async (t) => {
//     try {
//         // Create a reservation
//         const postResponse = await t.context.got.post('reservations', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2,
//             },
//             json: {
//                 // Remove manual 'reservationId' assignment to let the server auto-assign it
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });

//         t.is(postResponse.statusCode, 200);
//         t.truthy(postResponse.body);
//         const createdReservationId = postResponse.body.reservationId;

//         // GET the created reservation
//         const getResponse = await t.context.got.get(`reservations/${createdReservationId}?userId=6`);
//         t.is(getResponse.statusCode, 200);
//         t.deepEqual(getResponse.body, {
//             'reservationId': createdReservationId,
//             'userId': 6,
//             'businessId': 2,
//             'reservationTime': '20:00',
//             'reservationDay': 25,
//             'reservationMonth': 12,
//             'reservationYear': 2025,
//             'numberOfPeople': 3,
//             'username': "username",
//             'businessName': "businessName"
//         });

//         // DELETE the created reservation with reservationId in the body
//         const deleteResponse = await t.context.got.delete(`reservations/${createdReservationId}?userId=6`, {
//             json: { reservationId: createdReservationId }, // Include reservationId in the body
//             responseType: 'json', // Ensure response is parsed as JSON
//         });

//         t.is(deleteResponse.statusCode, 200);
//         t.deepEqual(deleteResponse.body, { message: "Reservation deleted successfully.", reservationId: createdReservationId });

//         // Optionally, verify that the reservation has been deleted
//         const verifyDeleteResponse = await t.context.got.get(`reservations/${createdReservationId}?userId=6`, {
//             throwHttpErrors: false, // Prevent throwing on non-2xx responses
//             responseType: 'json',
//         });
//         t.is(verifyDeleteResponse.statusCode, 404);
//         t.deepEqual(verifyDeleteResponse.body, { message: "Reservation not found." });

//     } catch (error) {
//         console.error("Error during test:", error.response ? error.response.body : error.message);
//         t.fail("Test failed due to an error.");
//     }
// });



// test("DELETE /reservations/:id - Missing reservation ID", async (t) => {
//     const error = await t.throwsAsync(() => t.context.got.delete("reservations/?userId=6"));
//     t.is(error.response.statusCode, 405); // Adjust based on actual behavior
//     t.regex(error.response.body.message, /DELETE method not allowed/);
// });

// test("DELETE /reservations/:id - Delete reservation with invalid ID format", async (t) => {
//     const error = await t.throwsAsync(() => t.context.got.delete("reservations/invalidId"));
//     t.is(error.response.statusCode, 400);
//     t.regex(error.response.body.message, /request\.query should have required property/);
// });