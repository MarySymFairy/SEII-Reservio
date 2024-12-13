// const http = require('http'); // Import HTTP module
// const test = require('ava'); // Import AVA for testing
// const got = require('got'); // Import got for making HTTP requests

// const app = require('../index.js'); // Import your app

// // Set up the server before tests run
// test.before(async (t) => {
//     // Create and start the server
//     t.context.server = http.createServer(app);
//     const server = t.context.server.listen();
//     const { port } = server.address();
    
//     // Set up got instance for making HTTP requests
//     t.context.got = got.extend({
//         responseType: 'json',
//         prefixUrl: `http://localhost:${port}`
//     });
// });

// // Clean up after tests have run
// test.after.always((t) => {
//     // Close the server after all tests
//     t.context.server.close();
// });


// // Test to check if the GET /api endpoint returns the correct response
// test('GET /api returns correct response and status code', async (t) => {
//     const { body, statusCode } = await t.context.got('api');
//     t.is(body.message, 'It works!'); // Check if the message in the response is correct
//     t.is(statusCode, 200); // Check if the status code is 200
// });
