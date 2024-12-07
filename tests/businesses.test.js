const http = require("node:http");

const test = require("ava");
const got = require("got");
const listen = require("test-listen");

const app = require('../index.js');

// Initialize the test environment
test.before(async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({
      prefixUrl: t.context.prefixUrl,
      responseType: "json",
      throwHttpErrors: false,
    });
  });
  
  // Cleanup after tests
  test.after.always((t) => {
    t.context.server.close();
  });


// GET /businesses 

// Happy path: Retrieve All Businesses
test("GET /businesses - Retrieve all businesses", async t => {
    const { body, statusCode } = await t.context.got.get('businesses');
    t.is(statusCode, 200);
    t.true(Array.isArray(body));
    t.true(body.length > 0);
});

// Happy path: Get business by category
test("GET /businesses - Get businesses by category", async t => {
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
test("GET /businesses/search - Search business by keyword", async t => {
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

//Error case: Empty Keyword
test("GET /businesses/search - Empty keyword", async (t) => {
    const error = await t.throwsAsync(() =>
        t.context.got("businesses/search?keyword=")
    );
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Keyword cannot be empty");
});

// Error case: Get businesses with invalid query parameter
test("GET /businesses - Invalid query parameters", async (t) => {
    const error = await t.throwsAsync(() => t.context.got("businesses?invalidParam=value"));
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Invalid query parameter");
});

//Error case: Nonexistent Resource
test("GET /businesses/:id - Nonexistent business", async (t) => {
    const error = await t.throwsAsync(() => t.context.got("businesses/99999"));
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "Business not found");
});



// POST /businesses

//Happy path: Create a New Business
test("POST /businesses - Add a new business", async (t) => {
    const payload = { name: "New Business", category: "Retail" };
    const { body, statusCode } = await t.context.got.post("businesses", { json: payload });
    t.is(statusCode, 201);
    t.is(body.name, "New Business");
    t.is(body.category, "Retail");
});

//Error case: Missing Required Fields
test("POST /businesses - Missing required fields", async (t) => {
    const payload = { name: "New Business" }; // Missing critical fields like `category`
    const error = await t.throwsAsync(() =>
        t.context.got.post("businesses", { json: payload })
    );
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Required fields are missing");
});

//Error case: Invalid Data Format
test("POST /businesses - Invalid data format", async (t) => {
    const payload = { name: 12345, category: true }; // Invalid types
    const error = await t.throwsAsync(() =>
        t.context.got.post("businesses", { json: payload })
    );
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Invalid data format");
});

//Error case: Duplicate Entry
test("POST /businesses - Duplicate entry", async (t) => {
    const payload = { name: "Existing Business", category: "Food" };
    await t.context.got.post("businesses", { json: payload }); // First insert
    const error = await t.throwsAsync(() =>
        t.context.got.post("businesses", { json: payload })
    );
    t.is(error.response.statusCode, 409);
    t.is(error.response.body.message, "Business already exists");
});



// PUT /businesses

//Happy path: Update an Existing Business
test("PUT /businesses/:id - Update a business", async (t) => {
    const payload = { name: "Updated Business", category: "Tech" };
    const { body, statusCode } = await t.context.got.put("businesses/1", { json: payload });
    t.is(statusCode, 200);
    t.is(body.name, "Updated Business");
    t.is(body.category, "Tech");
});

//Error case: Nonexistent Resource
test("PUT /businesses/:id - Nonexistent business", async (t) => {
    const payload = { name: "Updated Business", category: "Tech" };
    const error = await t.throwsAsync(() =>
        t.context.got.put("businesses/99999", { json: payload })
    );
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "Business not found");
});


//Error case: Missing Required Fields
test("PUT /businesses/:id - Missing required fields", async (t) => {
    const payload = {}; // Missing name and category
    const error = await t.throwsAsync(() =>
        t.context.got.put("businesses/1", { json: payload })
    );
    t.is(error.response.statusCode, 400);
    t.is(error.response.body.message, "Required fields are missing");
});

//Error case: Invalid Data Format
test("PUT /businesses/:id - Invalid data format", async (t) => {
    const payload = { name: true, category: 123 }; // Invalid types
    const error = await t.throwsAsync(() =>
        t.context.got.put("businesses/1", { json: payload })
    );
    t.is(error.response.statusCode, 422);
    t.is(error.response.body.message, "Invalid data format");
});




// DELETE /businesses

//Happy path: Delete an Existing Business
test("DELETE /businesses/:id - Delete a business", async (t) => {
    const { statusCode } = await t.context.got.delete("businesses/1");
    t.is(statusCode, 204); // No content
});

//Error case: Nonexistent Resource
test("DELETE /businesses/:id - Nonexistent business", async (t) => {
    const error = await t.throwsAsync(() =>
        t.context.got.delete("businesses/99999")
    );
    t.is(error.response.statusCode, 404);
    t.is(error.response.body.message, "Business not found");
});


//Error case: Unauthorized Access
test("DELETE /businesses/:id - Unauthorized access", async (t) => {
    const error = await t.throwsAsync(() =>
        t.context.got.delete("businesses/1", { headers: { Authorization: "InvalidToken" } })
    );
    t.is(error.response.statusCode, 401);
    t.is(error.response.body.message, "Unauthorized");
});

