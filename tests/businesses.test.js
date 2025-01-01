const test = require('ava'); // Test framework
const got = require('got'); // HTTP client
const http = require('http'); // HTTP server
const app = require('../index.js'); // Import the app to test

// Setup: Start the server before tests
test.before(async (t) => {
    t.context.server = http.createServer(app); // Create server instance
    const server = t.context.server.listen(); // Start listening
    const { port } = server.address(); // Get the server's port
    t.context.got = got.extend({ responseType: 'json', prefixUrl: `http://localhost:${port}` }); // Create a got instance with the server's base URL
});

// Cleanup: Close the server after all tests
test.after.always((t) => {
    t.context.server.close(); // Ensure the server is closed after tests
});

// Test: Fetch businesses by a valid category name
test("GET /businesses?categoryName=breakfast - Should return a list of businesses for a valid categoryName", async (t) => {
    const { body, statusCode } = await t.context.got.get('businesses?categoryName=breakfast');
    // Assert the status code is 200
    t.is(statusCode, 200, "Response status should be 200");
    // Assert the response is an array and not empty
    t.true(Array.isArray(body), "Response body should be an array");
    t.true(body.length > 0, "Response body should not be empty");

    // Assert the response contains expected properties
    const business = body[0];
    t.not(business.businessId, undefined, "Business should have a businessId");
    t.not(business.businessName, undefined, "Business should have a businessName");
    t.not(business.ownerId, undefined, "Business should have an ownerId");
    t.not(business.categoryName, undefined, "Business should have a categoryName");
    t.not(business.keyword, undefined, "Business should have a keyword");
});

// Test: Invalid category name
test("GET /businesses?categoryName=invalidCategory - Should return an error message for an invalid categoryName", async (t) => {
    const invalid_category = "invalidCategory"; // Example of an invalid category
    const error = await t.throwsAsync(() => t.context.got.get(`businesses?categoryName=${invalid_category}`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Empty category name
test("GET /businesses?categoryName= - Should return an error message for an empty categoryName", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`businesses?categoryName=`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Response status should be 400");
});

// Test: Fetch businesses by a valid keyword
test("GET /businesses/search?keyword=keyword - Should return a list of businesses for a valid keyword", async (t) => {
    const { body, statusCode } = await t.context.got.get('businesses/search?keyword=keyword');
    // Assert the status code is 200
    t.is(statusCode, 200, "Response status should be 200");
    // Assert the response is an array and not empty
    t.true(Array.isArray(body), "Response body should be an array");
    t.true(body.length > 0, "Response body should not be empty");

    // Assert the response contains expected properties
    const business = body[0];
    t.not(business.businessId, undefined, "Business should have a businessId");
    t.not(business.businessName, undefined, "Business should have a businessName");
    t.not(business.ownerId, undefined, "Business should have an ownerId");
    t.not(business.businessCategory, undefined, "Business should have a categoryName");
    t.not(business.keyword, undefined, "Business should have a keyword");
});

// Test: Invalid keyword
test("GET /businesses/search?keyword=invalidKeyword - Should return an error message for an invalid keyword", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`businesses/search?1`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Bad input parameter");
});

// Test: Empty keyword
test("GET /businesses/search?keyword= - Should return an error message for an empty keyword", async (t) => {
    const error = await t.throwsAsync(() => t.context.got.get(`businesses/search?`));
    // Assert the status code is 400
    t.is(error.response.statusCode, 400, "Bad input parameter");
});

// Test: Keyword not found
test("GET /businesses/search?keyword=keyword - Should return an error message for a keyword that does not exist", async (t) => {
    const invalidKeyword = "cute"; // Example of a keyword that does not exist
    const error = await t.throwsAsync(() => t.context.got.get(`businesses/search?keyword=${invalidKeyword}`));
    // Assert the status code is 404
    t.is(error.response.statusCode, 404, "Business not found with the given keyword");
});

