const http = require("http");
const test = require("ava");
const got = require("got");

const app = require('../index.js');

// Setup the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const {port} = server.address();
    t.context.got = got.extend({responseType: 'json', prefixUrl: `http://localhost:${port}`});
});

// Close the server after tests
test.after.always(t => {
    t.context.server.close();
});

// Helper function to post a reservation
const postReservation = async (t, searchParams, json) => {
    return await t.context.got.post('reservations', {
        searchParams,
        json,
    });
};

// Helper function to assert error responses
const assertErrorResponse = (t, error, statusCode, messageRegex) => {
    t.is(error.response.statusCode, statusCode);
    t.regex(error.response.body.message, messageRegex);
};

// Happy Scenario
test('POST /reservations - successful case', async t => {
    try {
        const response = await postReservation(t, {userId: 0, businessId: 2}, {
            reservationId: 0, userId: 0, businessId: 2, reservationTime: "20:00", reservationDay: 25, reservationMonth: 12, 
            reservationYear: 2025, numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });

        t.is(response.statusCode, 200);
        t.deepEqual(response.body, {
            reservationId: 0, userId: 0, businessId: 2, reservationTime: "20:00", reservationDay: 25,
            reservationMonth: 12, reservationYear: 2025, numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
    } catch (error) {
        console.error('Error:', error.response ? error.response.body : error.message);
        t.fail('Request failed');
    }
});

// Unhappy Scenarios
test('POST /reservations - missing userId', async t => {
    try {
        await postReservation(t, {businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: 5,
            reservationMonth: 11, reservationYear: 2024, numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /userId/);
    }
});

test('POST /reservations - missing businessId', async t => {
    try {
        await postReservation(t, {userId: 1}, {
            reservationId: 0, userId: 1, reservationTime: "12:00", reservationDay: 5, reservationMonth: 11,
            reservationYear: 2024, numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /businessId/);
    }
});

test('POST /reservations - missing reservationTime', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationDay: 5, reservationMonth: 11, reservationYear: 2024,
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /reservationTime/);
    }
});

test('POST /reservations - invalid reservationTime format', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "25:00", reservationDay: 5, reservationMonth: 11, reservationYear: 2024,
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /reservationTime/);
    }
});

test('POST /reservations - invalid reservationDay', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: 32, reservationMonth: 11, reservationYear: 2024,
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /reservationDay should be <= 31/);
    }
});

test('POST /reservations - invalid reservationMonth', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: 5, reservationMonth: 13, reservationYear: 2024,
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /reservationMonth should be <= 12/);
    }
});

test('POST /reservations - invalid reservationYear', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: 5, reservationMonth: 11, reservationYear: 'aB',
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /reservationYear should be integer/);
    }
});

test('POST /reservations - invalid numberOfPeople type', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: "5", reservationMonth: 11, reservationYear: 2024,
            numberOfPeople: "three", username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /(reservationDay|numberOfPeople)/);
    }
});

test('POST /reservations - reservation date in the past', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: 1, reservationMonth: 1, reservationYear: 2020,
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /should be >= 2024/);
    }
});

test('POST /reservations - numberOfPeople is zero or negative', async t => {
    try {
        await postReservation(t, {userId: 1, businessId: 101}, {
            reservationId: 0, userId: 1, businessId: 101, reservationTime: "12:00", reservationDay: 5, reservationMonth: 11, reservationYear: 2024,
            numberOfPeople: 0, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        assertErrorResponse(t, error, 400, /numberOfPeople/);
    }
});

test('POST /reservations - invalid day for February (non-leap year)', async t => {
    try {
        await postReservation(t, {userId: 0, businessId: 2}, {
            reservationId: 16, userId: 0, businessId: 2, reservationTime: "12:00", reservationDay: 30, reservationMonth: 2, reservationYear: 2026,
            numberOfPeople: 3, username: "username", businessName: "Cafe Central"
        });
        t.fail('Request should have failed');
    } catch (error) {
        t.is(error.response.statusCode, 400);
        t.regex(error.response.body.error, /Invalid reservation day/);
    }
});