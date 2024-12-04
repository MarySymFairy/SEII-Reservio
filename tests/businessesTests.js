const http = require('http');
const test = require('ava');
const got = require('got');
const listen = require('test-listen');
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

// GET /businesses - Retrieve all businesses
test("GET /businesses - Retrieve all businesses (happy path)", async t => {
    const { body, statusCode } = await t.context.got.get('businesses');
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.true(body.length > 0);
});

// Happy path: Get business by category
test("GET /businesses - Get businesses by category (happy path)", async t => {
  const { body, statusCode } = await t.context.got("businesses?category-name=Breakfast");
  t.is(statusCode, 200);
  t.true(Array.isArray(body));
  t.is(body[0].businessCategory, "Breakfast");
});

// Error case: Get businesses by invalid category
test("GET /businesses - Get businesses by invalid category", async t => {
  const error = await t.throwsAsync(() => t.context.got("businesses?category-name=InvalidCategory"));
  t.is(error.response.statusCode, 404);
  t.is(error.response.body.message, "Category not found.");
});

// Happy path: Search business by keyword
test("GET /businesses/search - Search business by keyword (happy path)", async t => {
  const { body, statusCode } = await t.context.got("businesses/search?keyword=keyword");
  t.is(statusCode, 200);
  t.true(Array.isArray(body));
  t.is(body[0].keyword, "keyword");
});

// Error case: Search business by invalid keyword
test("GET /businesses/search - Search business by invalid keyword", async t => {
  const error = await t.throwsAsync(() => t.context.got("businesses/search?keyword=InvalidKeyword"));
  t.is(error.response.statusCode, 404);
  t.is(error.response.body.message, "No businesses found.");
});

// Error case: Get businesses with invalid query parameter ????
test("GET /businesses - Get businesses with invalid query parameter", async t => {
    const error = await t.throwsAsync(() => t.context.got("businesses?invalidParam=value"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid query parameter");
});
