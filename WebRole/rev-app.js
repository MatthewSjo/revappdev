/**
 * Rev App Module
 */

// External references:
//
// name:    How do you share constants in NodeJS modules?
// url:     http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules
//

var http = require('http');

// ----------------------------------------------
// PRIVATE
// ----------------------------------------------

// Helper function to define consts in node.js
function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}
// ----------------------------------------------
// PUBLIC
// ----------------------------------------------

// Pages consts as definited in index.jade
define("PAGE_DASHBOARD", '#dashboard');
define("PAGE_PORTFOLIOS", '#portfolios');
// Web API consts
define("WEBAPI_HOST", 'revapidev.statpro.com');
define("WEBAPI_URL", '/v1/');

// Helper function to make basic authentication
exports.makeBaseAuth = function (username, password) {
    var credString, token;

    credString = username + ':' + password;
    token = new Buffer(credString).toString("base64");

    return 'Basic ' + token;
}

exports.getRequestOptions = function (webApiHost, webApiUrl, reqToken) {
    return {
        host: webApiHost,
        port: '80',
        path: webApiUrl,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': reqToken
        }
    };
}

exports.getServiceResource = function (options, callback) {
    var request;

    // Set up the request.
    request = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            var obj, viewModel;

            // Parse our JSON into an object we can use.
            obj = JSON.parse(chunk);
            viewModel = obj.service;
            viewModel.layout = false;

            // Invoke the callback function.
            callback(viewModel);
            //res.render('dashboard', viewModel);
        });
    });

    request.on('error', function (e) {
        // Something went wrong.        
    });

    // post the data
    request.end();
};


