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
test("GET /businesses - Retrieve all businesses", async t => {
    const { body, statusCode } = await t.context.got.get('businesses?category-name=breakfast', {
        responseType: 'json',
    });
    t.is(statusCode, 200);
    t.true(Array.isArray(body.businesses));
    t.true(body.businesses.length > 0);
}
)
//Error case: Get businesses by invalid category
test("GET /businesses - Get businesses by invalid category", async (t) => {
    const { statusCode } = await t.context.got("businesses?category-name=blablabla", {
      throwHttpErrors: false,
      responseType: 'json',
    });
    t.is(statusCode, 404);
  });
// //Happy path: Search business by keyword
// test("GET /businesses/search - Search business by keyword", async t => {
//     const { body, statusCode } = await t.context.got("businesses/search?keyword=keyword", {
//         responseType: 'json',
//     });
//     t.is(statusCode, 200);
//     t.true(Array.isArray(body.businesses));
//     t.is(body[0].keyword, "keyword");
// }
// )
// //Error case: Search business by invalid keyword
// test("GET /users/{userID}/businesses/search - Search business by invalid keyword", async t => {
//     const {body, statusCode} = await t.context.got("businesses/search?keyword=InvalidKeyword", {
//         throwHttpErrors: false
//     });
//     t.is(statusCode, 404);
// });
 