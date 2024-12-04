const http = require('http');
const test = require('ava');
const got = require('got');
const listen = require('test-listen');
const app = require('../index.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({
        http2: true,
        throwHttpErrors: false,
        responseType: "json",
        prefixUrl: t.context.prefixUrl,
    });
});

test.after.always((t) => {
    t.context.server.close();
});

// GET /business-reservations - Retrieve all reservations
test("GET /business-reservations - Retrieve all reservations (happy path)", async (t) => {
    const { body, statusCode } = await t.context.got.get("business-reservations");
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
});
