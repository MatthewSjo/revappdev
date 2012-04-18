// ------------------------------------------
// WEB API MODULE
// ------------------------------------------

// Module Dependencies
var http = require('http'),
    path = require("path"),
    url = require("url");

// Resource Links
var ResourceLinks = {
    eula: '',
    portfolios: ''
};

// User Account
var account = {
    email: '',
    token: ''
};

// ------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------

// Generates and returns a configuration object for an HTTP GET request.
// 'uri'    - The Uniform Resource Identifier of the resource to be requested.
// 'token'  - A Base64-encoded string representing a user's username and password.
function getRequestOptions(uri, token) {
    var hostName, pathName, queryString;

    // Extract the hostname, querystring and path from the URI.
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

// Constructs, sends, and attempts to parse the response from an HTTP request
// for a particular resource.
// 'resourceName'   - A string defining the JSON root property for the data requested.
// 'options'        - An object created by the getRequestOptions function, containing
//                    the required parameters to make a resource request.
// 'callback'       - A JavaScript function to be called when the response has arrived.
//                    Will always be called, regardless of the outcome of the request,
//                    and will receive an object containing a 'data' property, which 
//                    may be null, and an error property, which will either be boolean false 
//                    (indicating that the request was successful), a boolean true, or a 
//                    complete error object (both indicating that the request failed).
function getResource(resourceName, options, callback) {
    var request, data = '', resource;

    // Define an empty resource object.
    resource = {
        data: null,
        error: false
    };

    // Set up the request.
    request = http.request(options, function (response) {

        // Define the encoding for the response.
        response.setEncoding('utf8');

        // Attach an event handler to the 'data' event, which will 
        // be raised every time the response sends a chunk of data.
        response.on('data', function (chunk) {
            // Concatenate the latest chunk onto the existing data string.
            data += chunk;
        });

        // Attach an event handler to the 'end' event, which will be 
        // raised once all chunks have been sent via the 'data' event.
        response.on('end', function () {
            var obj;

            try {
                // Attempt to parse our JSON into an object we can use...
                obj = JSON.parse(data);
                // ...and assign the requested property as our returnable resource.
                resource.data = obj[resourceName];
            } catch (e) {
                // Something went wrong while parsing, so just assign the data we've
                // got to the resource object.
                resource.data = data;
                // Flag the resource as erroneous.
                resource.error = true;
            }

            // Invoke the callback function, passing the resource object.
            callback(resource);
        });
    });

    // Attach an error event handler in the event that the request fails entirely.
    request.on('error', function (e) {
        // Assign the error object to the resource.
        resource.error = e;
        // Invoke the callback function, passing the resource object.
        callback(resource);
    });

    // Post the data.
    request.end();
}

// Replaces filter placeholders in URIs.
// Returns the given URI string with placeholders replaced with appropriate values.
// 'oData'  - An object containing filtering values to be inserted into the URI. 
// 'uri'    - The Uniform Resource Identifier, which contains filter placeholders 
//            to be replaced by the oData property values.
function applyODataToURI(oData, uri) {
    var filter = oData.filter || '',
        orderby = oData.orderby || '',
        skip = oData.skip || '',
        top = oData.top || '';

    uri = uri.replace('{filter}', filter)
             .replace('{orderby}', orderby)
             .replace('{skip}', skip)
             .replace('{top}', top);

    return uri;
}

// ------------------------------------------
// PUBLIC METHODS
// ------------------------------------------

// Attempts to consume the StatPro Revolution Web API, persists user details,
// and creates references to commonly used resources.
// 'email'      - The user's email, used as a username to log in to the system.
// 'token'      - A Base64-encoded string representing a user's username and password.
// 'uri'        - The Uniform Resource Identifier representing the entry point of the Web API.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.initService = function (email, token, uri, callback) {
    var options;

    // Persist the user's email address and token in the user's account.
    account.email = email;
    account.token = token;

    // Generate the request configuration.
    options = getRequestOptions(uri, account.token);

    // Attempt to get the service's entry point resource.
    getResource('service', options, function (resource) {

        if (!resource.error && resource.data) {
            // Populate the resources object.
            ResourceLinks.eula = resource.data.eula.links.self.href;
            ResourceLinks.portfolios = resource.data.portfolios.links.portfoliosQuery.href;
        }

        // Invoke the callback function, passing in the resource JSON.
        callback(resource);
    });
};

// Attempts to retrieve a list of portfolios, optionally filtered by oData values.
// 'oData'      - An object containing filtering values to be inserted into a URI. 
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getPortfolios = function (oData, callback) {
    var options, portfoliosQuery;

    // Format a portfolio querystring based on the oData and the portfolio resource link.
    portfoliosQuery = applyODataToURI(oData, ResourceLinks.portfolios);

    // Generate the request configuration based on the portfolio query.
    options = getRequestOptions(portfoliosQuery, account.token);

    // Attempt to get a list of the user's portfolios, filtered by the query.
    getResource('portfolios', options, function (resource) {
        callback(resource);
    });
};

// Attempts to retrieve the default analysis for the requested portfolio.
// 'uri'        - The Uniform Resource Identifier representing the default analysis resource.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getDefaultAnalysis = function (uri, callback) {
    var options;

    // Generate the request configuration.
    options = getRequestOptions(uri, account.token);

    // Attempt to get the default analysis for the requested portfolio.
    getResource('defaultAnalysis', options, function (resource) {
        callback(resource);
    });
};

// Attempts to retrieve the End User Licence Agreement in the specified format.
// 'format'     - A string defining the format in which the EULA should be provided.
//                Can be one of: 'document' (retrieves the HTML fragment and Revolution 
//                CSS), 'fragment' (retrieves only the HTML fragment), 'css' (retrieves
//                only the EULA CSS). If undefined, will default to 'document' format.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getEula = function (eulaFormat, callback) {
    var options;

    function getEulaDoc(eulaUri) {
        // Generate the request configuration.
        options = getRequestOptions(eulaUri, account.token);
        // Attempt to get the EULA.
        getResource('', options, function (eulaDoc) {
            callback(eulaDoc);
        });
    }

    // Generate the request configuration.
    options = getRequestOptions(ResourceLinks.eula, account.token);

    // Attempt to get the EULA link dependent on the format requested.
    getResource('eula', options, function (resource) {
        var eulaUri = '';
        
        switch (eulaFormat) {
            case 'document':
                eulaUri = resource.data.links.eulaDocument.href;
                break;
            case 'fragment':
                eulaUri = resource.data.links.eulaFragment.href;
                break;
            case 'css':
                eulaUri = resource.data.links.eulaFragmentStyles.href;
                break;
            default:
                eulaUri = resource.data.links.eulaDocument.href;
                break;
        }
        
        // Use the URI specified to retrieve the EULA.
        getEulaDoc(eulaUri);
    });    
};