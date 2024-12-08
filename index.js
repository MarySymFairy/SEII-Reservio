'use strict';

const path = require('path');
const __dirname = path.resolve();
const http = require('http');
const oas3Tools = require('oas3-tools');

const serverPort = 8080;

// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(dirname, './controllers')
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();

if (require.main === module) {
    http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
}

module.exports = app;
