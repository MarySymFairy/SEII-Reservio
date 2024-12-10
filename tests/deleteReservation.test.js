const http = require("http");
const test = require("ava");
const got = require("got");

const app = require('../index.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` });
});

test.after.always((t) => {
    t.context.server.close();
});

// DELETE -----------------------------------------------------------------------------
// Happy path: Delete reservation
test("DELETE /reservations/:id - Delete nonexistent reservation", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/9999"));
    t.is(error.response.statusCode, 404);
    t.regex(error.response.body.message, /not found/);
});

test("DELETE /reservations/:id - Unauthorized delete request", async (t) => {
    const error = await t.throwsAsync(() =>
        t.context.got.delete("reservations/1", {
            headers: { Authorization: "InvalidToken" },
        })
    );
    t.is(error.response.statusCode, 404); // Adjust based on actual behavior
    t.regex(error.response.body.message, /not found/);
});

test("DELETE /reservations/:id - Delete reservation (happy path)", async (t) => {
    try {
        // Create a reservation
        const response = await t.context.got.post('reservations', {
            searchParams: {
                'user-id': 0,
                'business-id': 2, // Use valid business ID
            },
            json: {
                'reservation-id': 0,
                'user-id': 0,
                'business-id': 2,
                'reservationTime': "20:00",
                'reservationDay': 25,
                'reservationMonth': 12,
                'reservationYear': 2025,
                'numberOfPeople': 3,
                'username': "username",
                'businessName': "Cafe Central", // Match mock data
            },
        });

        t.is(response.statusCode, 200); //!!!! EDO THEMA
        console.log("here");
        t.truthy(response.body);

        //THEMA EDO
        console.log("here");


        //GET /reservations/:id
        const getResponse = await t.context.got.get("reservations/0?user-id=0");
        console.log(getResponse.body);
        t.is(getResponse.statusCode, 200);
        t.deepEqual(getResponse.body, {
            'reservation-id': 0,
            'user-id': 0,
            'business-id': 2,
            'reservationTime': "20:00",
            'reservationDay': 25,
            'reservationMonth': 12,
            'reservationYear': 2025,
            'numberOfPeople': 3,
            'username': "username",
            'businessName': "Cafe Central",
        });

        // Delete the created reservation
        const { body, statusCode } = await t.context.got.delete("reservations/0?user-id=0");
        t.is(statusCode, 200);
        t.deepEqual(body, { message: "Reservation deleted." });

    } catch (error) {
        console.error("Error during test:", error.response ? error.response.body : error.message);
        t.fail("Test failed due to an error.");
    }
});


test("DELETE /reservations/:id - Missing reservation ID", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/"));
    t.is(error.response.statusCode, 405); // Adjust based on actual behavior
    t.regex(error.response.body.message, /DELETE method not allowed/);
});

test("DELETE /reservations/:id - Delete reservation with invalid ID format", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.delete("reservations/invalid-id"));
    t.is(error.response.statusCode, 400);
    t.regex(error.response.body.message, /request\.query should have required property/);
});
