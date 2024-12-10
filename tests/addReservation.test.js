const http = require("http");
const test = require("ava");
const got = require("got");

const app = require('../index.js');

test.before(async t => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` });
});

test.after.always(t => {
    t.context.server.close();
});

//Happy Scenario
test('POST /reservations - successful case', async t => {
    try {
        const response = await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 1,
                'reservationTime': "12:00",
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });

        t.is(response.statusCode, 200);
        t.deepEqual(response.body, {
            'reservation-id': 0,
            'user-id': 1,
            'business-id': 4,
            'reservationTime': "12:00",
            'reservationDay': 5,
            'reservationMonth': 11,
            'reservationYear': 2024,
            'numberOfPeople': 3,
            'username': "username",
            'businessName': "Cafe Central"
        });
    } catch (error) {
        
        console.error('Error:', error.response ? error.response.body : error.message);
        t.fail('Request failed');
    }
});

//Unhappy Scenario: User ID is not provided
test('POST /reservations - missing user-id', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'business-id': 101 // Missing 'user-id'
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 1,
                'reservationTime': "12:00",
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /user-id/); // Check for specific error message
    }
});

//Unhappy Scenario: Business ID is not provided
test('POST /reservations - missing business-id', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1 // Missing 'business-id'
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'reservationTime': "12:00",
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Expecting 400 Bad Request
        t.regex(error.response.body.message, /business-id/); // Check that the error mentions missing business-id
    }
});


//Unhappy Scenario: Missing Required Body Parameters
//ReservationTime
test('POST /reservations - missing reservationTime', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                // 'reservationTime' is missing
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /reservationTime/); // Check for specific error message
    }
});


//Invalid Time Format
test('POST /reservations - invalid reservationTime format', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "25:00", // Invalid time
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /reservationTime/); // Check for specific error message
    }
});

//Invalid Reservation Day Format
test('POST /reservations - invalid reservationDay', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': 32, // Invalid day
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /reservationDay should be <= 31/); // Check specific error message
    }
});

//Invalid Reservation Month Format
test('POST /reservations - invalid reservationMonth', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': 5,
                'reservationMonth': 13, // Invalid month
                'reservationYear': 2024,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /reservationMonth should be <= 12/); // Check specific error message
    }
});

//Invalid Reservation Year Format
test('POST /reservations - invalid reservationYear', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 'aB', // Invalid year format
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        //console.log('DEBUG: Error response:', error.response.body); // Debugging
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /reservationYear should be integer/); // Check specific error message
    }
});



//Unhappy Scenario: Invalid Data Type of numberOfPeople
test('POST /reservations - invalid numberOfPeople type', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': "5", // Invalid type: should be an integer
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': "three", // Invalid type: should be an integer
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /(reservationDay|numberOfPeople)/); // Check for specific error message
    }
});

//Unhappy Scenario: Date in the Past
//manually added in openapi.yaml minimum year is 2024
test('POST /reservations - reservation date in the past', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': 1,
                'reservationMonth': 1,
                'reservationYear': 2020, // Past date
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /should be >= 2024/); // Match the actual message
    }
});


//Unhappy Scenario: Negative Or Zero Number of People
test('POST /reservations - numberOfPeople is zero or negative', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': 5,
                'reservationMonth': 11,
                'reservationYear': 2024,
                'numberOfPeople': 0, // Invalid value
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /numberOfPeople/); // Check for specific error message
    }
});

//Test Invalid Day for February
test('POST /reservations - invalid day for February (non-leap year)', async t => {
    try {
        await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 1,
                'business-id': 101
            },
            json: {
                'reservation-id': 0,
                'user-id': 1,
                'business-id': 101,
                'reservationTime': "12:00",
                'reservationDay': 30, // Invalid day
                'reservationMonth': 2, // February
                'reservationYear': 2026, // Non-leap year
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central"
            },
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400); // Bad Request
        t.regex(error.response.body.message, /Invalid reservation day. Expected a number between 1 and 28/);
    }
});
