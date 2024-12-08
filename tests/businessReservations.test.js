const http = require('http');
const test = require('ava');
const got = require('got');
const app = require('../index.js');

test.before(async (t) => {
  t.context.server = http.createServer(app);
  const server = t.context.server.listen();
  const { port } = server.address();
  t.context.got = got.extend({
    responseType: 'json',
    prefixUrl: `http://localhost:${port}`,
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