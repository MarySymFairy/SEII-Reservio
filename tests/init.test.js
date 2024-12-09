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

////GET /businesses //////////////////////////////////////////////////////////////////////////////////////////
//Happy path: Retrieve all businesses
test("GET /user/{userID}/businesses - Retrieve all businesses", async t => {
    const { body, statusCode } = await t.context.got.get('users/1/businesses?category-name=Breakfast');
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.true(body.length > 0);
}
)
//Error case: Get businesses by invalid category
test("GET /user/{userID}/businesses - Get businesses by invalid category", async t => {
    const { body, statusCode } = await t.context.got("users/1/businesses?category-name=InvalidCategory", {
        throwHttpErrors: false,
    });   
    t.is(statusCode, 404);
});
//Happy path: Search business by keyword
test("GET /user/{userID}/businesses/search - Search business by keyword", async t => {
    const { body, statusCode } = await t.context.got("users/1/businesses/search?keyword='keyword'");
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.is(body[0].keyword, "keyword");
}
)
//Error case: Search business by invalid keyword
test("GET /users/{userID}/businesses/search - Search business by invalid keyword", async t => {
    const {body, statusCode} = await t.context.got("users/1/businesses/search?keyword=InvalidKeyword", {
        throwHttpErrors: false
    });
    t.is(statusCode, 404);
});
//Error case: Get businesses by invalid user ID
test("GET /user/{userID}/businesses - Get businesses by invalid user ID", async t => {
    const {body, statusCode} = await t.context.got("users/999/businesses?category-name=breakfast", {
        throwHttpErrors: false
    });
    t.is(statusCode, 404);
});   