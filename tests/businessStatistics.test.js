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

// Happy path: Retrieve business statistics
test("GET /business-statistics - Retrieve business statistics (happy path)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics?owner-id=1');
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.true(body.length > 0);
    body.forEach(stat => {
        t.truthy(stat.month);
        t.truthy(stat.numberOfReservations);
    });
});

// Error case: Retrieve business statistics with invalid owner-id
test("GET /business-statistics - Retrieve business statistics with invalid owner-id (error case)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics?owner-id=9999');
    t.is(statusCode, 404);
    t.is(body.message, "Business owner not found.");
});

// Error case: Missing owner-id
test("GET /business-statistics - Retrieve business statistics with missing owner-id (error case)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics');
    t.is(statusCode, 400);
    t.is(body.message, "Missing or invalid owner-id parameter.");
});

// Error case: Invalid owner-id format (non-numeric)
test("GET /business-statistics - Retrieve business statistics with non-numeric owner-id (error case)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics?owner-id=abc');
    t.is(statusCode, 400);
    t.is(body.message, "Owner-id must be a valid number.");
});

// Error case: Owner-id as negative number
test("GET /business-statistics - Retrieve business statistics with negative owner-id (error case)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics?owner-id=-1');
    t.is(statusCode, 400);
    t.is(body.message, "Owner-id must be a positive integer.");
});

// Error case: Unexpected query parameter
test("GET /business-statistics - Retrieve business statistics with unexpected query parameter (error case)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics?owner-id=1&invalid-param=test');
    t.is(statusCode, 400);
    t.is(body.message, "Unexpected query parameters provided.");
});