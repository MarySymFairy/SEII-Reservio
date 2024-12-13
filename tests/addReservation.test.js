// const http = require("http");
// const test = require("ava");
// const got = require("got");

// const app = require('../index.js');

// test.before(async t => {
//     t.context.server = http.createServer(app);
//     const server = t.context.server.listen();
//     const { port } = server.address();
//     t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` });
// });

// test.after.always(t => {
//     t.context.server.close();
// });

// // Happy Scenario
// test('POST /reservations - successful case', async t => {
//     try {
//         const response = await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2, // Use valid business ID
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName", // Match mock data
//             },
//         });

//         t.is(response.statusCode, 200);
//         t.deepEqual(response.body, {
//             'reservationId': 1,
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
//     } catch (error) {
//         console.error('Error:', error.response ? error.response.body : error.message);
//         t.fail('Request failed');
//     }
// });

// //Unhappy Scenario: User ID is not provided
// test('POST /reservations - missing userId', async t => {
//     try {
//         await t.context.got.post('reservations?businessId=2', {
//             searchParams: {
//                 'businessId': 2 // Missing 'userId'
//             },
//             json: {
//                 'reservationId': 1,
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
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /userId/); // Check for specific error message
//     }
// });

// //Unhappy Scenario: Business ID is not provided
// test('POST /reservations - missing businessId', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6', {
//             searchParams: {
//                 'userId': 6 // Missing 'businessId'
//             },
//             json: {
//                 'reservationId': 1,
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
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Expecting 400 Bad Request
//         t.regex(error.response.body.message, /businessId/); // Check that the error mentions missing businessId
//     }
// });


// //Unhappy Scenario: Missing Required Body Parameters
// //ReservationTime
// test('POST /reservations - missing reservationTime', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 // Missing 'reservationTime'
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /reservationTime/); // Check for specific error message
//     }
// });


// //Invalid Time Format
// test('POST /reservations - invalid reservationTime format', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=6', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '25:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /reservationTime/); // Check for specific error message
//     }
// });

// //Invalid Reservation Day Format
// test('POST /reservations - invalid reservationDay', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 35, // Invalid day
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /reservationDay should be <= 31/); // Check specific error message
//     }
// });

// //Invalid Reservation Month Format
// test('POST /reservations - invalid reservationMonth', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 15, // Invalid month
//                 'reservationYear': 2025,
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /reservationMonth should be <= 12/); // Check specific error message
//     }
// });

// //Invalid Reservation Year Format
// test('POST /reservations - invalid reservationYear', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 'ab', // Invalid type: should be an integer
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         //console.log('DEBUG: Error response:', error.response.body); // Debugging
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /reservationYear should be integer/); // Check specific error message
//     }
// });



// //Unhappy Scenario: Invalid Data Type of numberOfPeople
// test('POST /reservations - invalid numberOfPeople type', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': "25" , // Invalid type: should be an integer
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': "three", // Invalid type: should be an integer
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /(reservationDay|numberOfPeople)/); // Check for specific error message
//     }
// });

// //Unhappy Scenario: Date in the Past
// //manually added in openapi.yaml minimum year is 2024
// test('POST /reservations - reservation date in the past', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 2020, // Invalid: should be >= 2024
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /should be >= 2024/); // Match the actual message
//     }
// });


// //Unhappy Scenario: Negative Or Zero Number of People
// test('POST /reservations - numberOfPeople is zero or negative', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 25,
//                 'reservationMonth': 12,
//                 'reservationYear': 2025,
//                 'numberOfPeople': 0, // Invalid: should be > 0
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Bad Request
//         t.regex(error.response.body.message, /numberOfPeople/); // Check for specific error message
//     }
// });

// // Invalid Day for February (non-leap year)
// test('POST /reservations - invalid day for February (non-leap year)', async t => {
//     try {
//         await t.context.got.post('reservations?userId=6&businessId=2', {
//             searchParams: {
//                 'userId': 6,
//                 'businessId': 2,
//             },
//             json: {
//                 'reservationId': 1,
//                 'userId': 6,
//                 'businessId': 2,
//                 'reservationTime': '20:00',
//                 'reservationDay': 30, // Invalid day
//                 'reservationMonth': 2, // February
//                 'reservationYear': 2026, // Non-leap year
//                 'numberOfPeople': 3,
//                 'username': "username",
//                 'businessName': "businessName"
//             },
//         });
//         console.log('here');
//         const daysInMonth = new Date(reservationYear, reservationMonth, 0).getDate();
//         console.log('here');
//         console.log(daysInMonth);

//         t.fail('Request should have failed');
//     } catch (error) {
//         t.is(error.response.statusCode, 400); // Ensure it fails with 400
//         t.regex(error.response.body.error, /Invalid reservation day/); // Match the specific error
//     }
// });