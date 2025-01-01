var ResponsePayload = function (code, payload) {
  this.code = code;
  this.payload = payload;
};

exports.respondWithCode = function (code, payload) {
  return new ResponsePayload(code, payload);
};

// Helper function to determine the response code
function determineCode(arg1, arg2) {
  if (arg2 && Number.isInteger(arg2)) {
    return arg2;
  }
  if (arg1 && Number.isInteger(arg1)) {
    return arg1;
  }
  return 200; // Default code
}

// Helper function to determine the payload
function determinePayload(arg1, code) {
  if (code && arg1) {
    return arg1;
  }
  return arg1 || null;
}

// Main function to write JSON response
var writeJson = exports.writeJson = function (response, arg1, arg2) {
  if (arg1 instanceof ResponsePayload) {
    return writeJson(response, arg1.payload, arg1.code);
  }

  const code = determineCode(arg1, arg2);
  let payload = determinePayload(arg1, code);

  if (typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }

  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(payload);
};
