/**
 * Web(b) API Module
 */

var http = require('http'),
    path = require("path"),
    url = require("url");

var ResourceLinks = {
    eula: '',
    portfolios: ''
};

var account = {
    username: '',
    password: '',
    token: ''
}

// Helper function to make basic authentication
function makeBaseAuth(username, password) {
    var credString, token;

    credString = username + ':' + password;
    token = new Buffer(credString).toString("base64");

    return 'Basic ' + token;
}

function getRequestOptions(uri, token) {
    var hostName, pathName, queryString;
    
    hostName = url.parse(uri).host;
    queryString = url.parse(uri).search || '';
    pathName = url.parse(uri).pathname + queryString;
    
    return {
        host: hostName,
        port: '80',
        path: pathName,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token
        }
    };
}

function getResource(resourceName, options, callback) {
    var request, 
        data = '';

    // Set up the request.
    request = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });

        response.on('end', function () {
            var obj, resource;

            // Parse our JSON into an object we can use.
            // TODO: Manage errors.
            obj = JSON.parse(data);
            resource = obj[resourceName];

            // Invoke the callback function.
            callback(resource);
        }) 
    });

    request.on('error', function (e) {
        // Something went wrong.        
    });

    // post the data
    request.end();
};

function applyODataToURI(oData, URI) {
    var filter = oData.filter || '',
        orderby = oData.orderby || '',
        skip = oData.skip || '',
        top = oData.top || '';

    URI = URI
        .replace('{filter}', filter)
        .replace('{orderby}', orderby)
        .replace('{skip}', skip)
        .replace('{top}', top);

    console.log('applyODataToURI: ', URI);
    // URI = URI.substr(29); // ASA: We need to remove the service root (included "https://") from the URI.
        
    return URI;
};

exports.initService = function (username, password, uri, callback) {
    var token, options;

    account.username = username;
    account.password = password;

    token = makeBaseAuth(username, password);
    account.token = token;

    options = getRequestOptions(uri, token);
    getResource('service', options, function (service) {
        ResourceLinks.eula = service.eula.links.self.href;
        ResourceLinks.portfolios = service.portfolios.links.portfoliosQuery.href;
        callback(service);
    });
};

exports.getPortfolios = function (oData, callback) {
    var options, portfoliosQuery;

    portfoliosQuery = applyODataToURI(oData, ResourceLinks.portfolios);
    options = getRequestOptions(portfoliosQuery, account.token);
    getResource('portfolios', options, function (portfolios) {
        callback(portfolios);
    });
};