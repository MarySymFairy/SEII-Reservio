'use strict';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import oas3Tools from 'oas3-tools';

// Get the current directory equivalent of `__dirname` in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var serverPort = 8080;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

export default app;