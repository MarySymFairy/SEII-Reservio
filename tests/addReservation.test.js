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

test('addReservation - successful case', async t => {
    const response = await t.context.got.post('addReservation', {
        json: {
            body: {
                "reservationTime": "12:00",
                "businessName": "Cafe Central",
                "reservationDay": 5,
                "reservationMonth": 11,
                "reservationYear": 2024,
                "numberOfPeople": 3,
            },
            userId: 1,
            businessId: 101,
        },
    });

    t.is(response.statusCode, 200);
    t.deepEqual(response.body, {
        "reservation-id": 0,
        "user-id": 1,
        "reservationTime": "12:00",
        "businessName": "Cafe Central",
        "reservationDay": 5,
        "reservationMonth": 11,
        "reservationYear": 2024,
        "numberOfPeople": 3,
        "username": "username",
        "business-id": 101,
    });
});
