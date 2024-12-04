const http = require('http');
const test = require('ava');
const got = require('got');
const listen = require('test-listen');
const app = require('../index.js');

test.before(async t => {
    t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
    t.context.got = got.extend({ responseType: 'json', prefixUrl: http://localhost:${port} });
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

// Error case: Retrieve business statistics with invalid owner-id ???
test("GET /business-statistics - Retrieve business statistics with invalid owner-id (error case)", async t => {
    const { body, statusCode } = await t.context.got.get('business-statistics?owner-id=9999');
    t.is(statusCode, 404);
    t.is(body.message, "Business owner not found.");
});