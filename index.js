'use strict';

const path = require('path');
const http = require('http');
const oas3Tools = require('oas3-tools');

const serverPort = 8080;

// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(dirname, './controllers') // Use dirname correctly
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();

// Only start the server if this script is run directly
if (require.main === module) {
    http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
}

module.exports = app;
module.exports = app;
