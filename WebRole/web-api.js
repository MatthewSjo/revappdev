// ------------------------------------------
// WEB API MODULE
// ------------------------------------------

// Module Dependencies
var http = require('http'),
    path = require("path"),
    url = require("url");

var MAX_ATTEMPTS = 1;

// Current Analysis
var currentAnalysis = {};

function getCurrentAnalysis(token, resource){
    if (resource) {
        return currentAnalysis[token][resource] || null;
    } else {
        return currentAnalysis[token] || null;
    }
}

function setCurrentAnalysis(token, analysis, value){
    if (!currentAnalysis[token]){
        currentAnalysis[token] = {};
    }

    currentAnalysis[token][analysis] = value || null;
}


// Resource Links
var resourceLinks = {};

function getResourceLink(token, resource){
    return resourceLinks[token][resource];
}

function setResourceLink(token, resource, link){
    if (!resourceLinks[token]){
        resourceLinks[token] = {};
    }

    resourceLinks[token][resource] = link;
}


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

// Processes the HTTP response from the Revolution Web API, and provides,
// if required, a localized error message depending on:
//
// 1) The HTTP status code returned as standard
// 2) A custom error code returned by the Revolution Web API 
//
// 'statusCode' - The HTTP status code returned by the response.
// 'data'       - The body content of the response.
// 'language'   - An object containing localized display strings for use on the server side.
function processResponse(statusCode, data, language) {
    var parts, code, error;

    // If the HTTP status code isn't an error...
    if (statusCode < 400) {
        // ...there's nothing else to do, so return false.
        return false;
    }

    // Assume this is an unknown error.
    error = {
        message: language.errors.unknownErrorText,
        httpStatusCode: statusCode,
        internalErrorCode: null
    };

    // We've got an error, so the data could contain a custom error message
    // from the Revolution Web API. Attempt to split on the semi-colon.
    parts = data.split(';');

    // If the content has split successfully, and the first element in the
    // array contains 'REVAPI_ERROR', we have a custom error.
    if (parts.length > 1 && parts[0].indexOf('REVAPI_ERROR') !== -1) {

        // Retrieve the custom error code.
        code = parseInt(parts[0].split('=')[1], 10);

        // Default to the message actually returned from the API,
        // and persist the custom error code in our error object.
        error.internalErrorCode = code;
        error.message = parts[1];

        // If the custom error code matches a resource in the language object when we
        // adding the 'error' prefix necessary to retrieve a potential localized message 
        // from the language file...
        if (language.errors['error' + code]) {
            // ...use that message instead of the one returned by the API.
            error.message = language.errors['error' + code];
        }
    }

    // Return the error object.
    return error;
}

// Constructs, sends, and attempts to parse the response from an HTTP request
// for a particular resource.
// 'resourceName'   - A string defining the JSON root property for the data requested.
// 'options'        - An object created by the getRequestOptions function, containing
//                    the required parameters to make a resource request.
// 'language'       - An object containing display strings for use on the server side.
//                    This will be localized if the request contains a valid 'lang' 
//                    querystring, otherwise defaulting to 'en_US'.
// 'callback'       - A JavaScript function to be called when the response has arrived.
//                    Will always be called, regardless of the outcome of the request,
//                    and will receive an object containing a 'data' property, which 
//                    may be null, and an error property, which will either be boolean false 
//                    (indicating that the request was successful), a boolean true, or a 
//                    complete error object (both indicating that the request failed).
function getResource(resourceName, options, language, callback) {
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
            var obj, error;

            // Process the response.
            error = processResponse(response.statusCode, data, language);

            // If we've had an error object returned by the processing of the response...
            if (error) {
                
                // ...an error has occurred, so we've got no data.
                resource.data = null;
                // Add the error object we've been provided.
                resource.error = error;
            
            } else {

                try {
                    
                    // Attempt to parse our JSON into an object we can use.
                    obj = JSON.parse(data);
                    // Assign the requested property as our returnable resource.
                    resource.data = obj[resourceName];

                } catch (e) {

                    // Something went wrong while parsing, so just assign the data we've
                    // got to the resource object.
                    resource.data = data;

                    // Flag the resource as erroneous.
                    resource.error = {
                        message: language.errors.unknownErrorText,
                        httpStatusCode: response.statusCode,
                        internalErrorCode: null
                    };
                }
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

    // Replace the placeholders, ensuring that the filter and orderby strings are suitably 
    // escaped, since their syntax can require the use of whitespace and special characters.
    if (uri) {
        uri = uri.replace('{filter}', escape(filter))
                 .replace('{orderby}', escape(orderby))
                 .replace('{skip}', skip)
                 .replace('{top}', top);
    }
    
    return uri;
}

// Replaces segments tree node placeholders in URIs.
// Returns the given URI string with placeholders replaced with appropriate values.
// 'params'  - An object containing parameter values to be inserted into the URI. 
// 'uri'    - The Uniform Resource Identifier, which contains filter placeholders 
//            to be replaced by the oData property values.
function applySegmentParamsToURI(params, uri) {
    var timePeriods = params.timePeriods || '',
        include = params.include || '',
        measures = params.measures || '',
        includeMeasuresFor = params.includeMeasuresFor || '',
        startDate = params.startDate || '',
        endDate = params.endDate || '',
        seriesType = params.seriesType || '';

    uri = uri.replace('{timePeriodsList}', timePeriods)
             .replace('{dataToInclude}', include)
             .replace('{measuresList}', measures)
             .replace('{measuresFor}', includeMeasuresFor)
             .replace('{startDate}', startDate)
             .replace('{endDate}', endDate)
             .replace('{seriesType}', seriesType);

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
// 'language'   - An object containing display strings for use on the server side.
//                This will be localized if the request contains a valid 'lang' 
//                querystring, otherwise defaulting to 'en_US'.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.initService = function (email, token, uri, language, callback) {
    var options;

    // Generate the request configuration.
    options = getRequestOptions(uri, token);

    // Attempt to get the service's entry point resource.
    getResource('service', options, language, function (resource) {

        if (!resource.error && resource.data) {
            // Populate the resources object.
            setResourceLink(token, 'eula', resource.data.eula.links.self.href);
            setResourceLink(token, 'portfolios', resource.data.portfolios.links.portfoliosQuery.href);
        }

        // Invoke the callback function, passing in the resource JSON.
        callback(resource);
    });
};

// Attempts to retrieve a list of portfolios, optionally filtered by oData values.
// 'oData'      - An object containing filtering values to be inserted into a URI. 
// 'datatype'   - A string defining whether the resource should be returned as HTML or JSON.
// 'token'      - A Base64-encoded string representing a user's username and password.
// 'language'   - An object containing display strings for use on the server side.
//                This will be localized if the request contains a valid 'lang' 
//                querystring, otherwise defaulting to 'en_US'.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getPortfolios = function (oData, datatype, token, language, callback) {
    var options, portfoliosQuery;

    // Format a portfolio querystring based on the oData and the portfolio resource link.
    portfoliosQuery = applyODataToURI(oData, getResourceLink(token, 'portfolios'));

    // Generate the request configuration based on the portfolio query.
    options = getRequestOptions(portfoliosQuery, token);

    // Attempt to get a list of the user's portfolios, filtered by the query.
    getResource('portfolios', options, language, function (resource) {
        callback(resource, datatype);
    });
};

// Attempts to retrieve the default analysis for the requested portfolio.
// 'uri'            - The Uniform Resource Identifier representing the default analysis resource.
// 'attempts'       - The attempts setting specifies the maximum number of times to try 
//                    access to the resource.
// 'token'          - A Base64-encoded string representing a user's username and password.
// 'language'       - An object containing display strings for use on the server side.
//                    This will be localized if the request contains a valid 'lang' 
//                    querystring, otherwise defaulting to 'en_US'.
// 'callback'       - A JavaScript function to be called when the response has arrived.
//                    Will always be called, regardless of the outcome of the request,
//                    and will receive an object containing a 'data' property, which 
//                    may be null, and an error property, which will either be boolean false 
//                    (indicating that the request was successful), a boolean true, or a 
//                    complete error object (both indicating that the request failed).
exports.getPortfolioAnalysis = function (uri, attempts, token, language, callback) {
    var options;

    // Generate the request configuration.
    options = getRequestOptions(uri, token);
    
    attempts = (attempts > MAX_ATTEMPTS)
        ? MAX_ATTEMPTS
        : attempts;

    // Attempt to get the portfolio analysis for the requested portfolio.
    getResource('portfolioAnalysis', options, language, function (resource) {
        var status;

        if (!resource.error && resource.data) {

            // Determine the current status of the analysis.
            status = resource.data.analysis.status;

            // If the current analysis is still calculating or there were errors...
            if (status === 'InProgress' || status === 'FailedWithErrors') {
                if (attempts === 0) {
                    resource.error = true;
                    callback(resource);
                    return;
                }
                attempts -= 1;
                // ...attempt to get the last successful analysis.
                uri = uri.replace('lastSuccessful=false', 'lastSuccessful=true');
                // Use the modified URI with this function.
                exports.getPortfolioAnalysis(uri, attempts, token, language, callback);
                return;
            }

            // Populate the resources object.
            setResourceLink(token, 'segmentsTreeNode', resource.data.analysis.results.links.segmentsTreeRootNodeQuery.href);
            setResourceLink(token, 'timeSeries', resource.data.analysis.results.links.timeSeriesQuery.href);

            // Persist the current analysis' currency and stats frequency for other API calls.
            setCurrentAnalysis(token, 'currency', resource.data.analysis.currency);
            setCurrentAnalysis(token, 'statisticsFrequency', resource.data.analysis.statisticsFrequency);
        }

        callback(resource);
    });
};

// Attempts to retrieve the specified segment tree nodes for the requested portfolio.
// 'oData'      - An object containing filtering values to be inserted into a URI. 
// 'params'     - An object containing additional parameter values to be inserted into a URI. 
// 'token'      - A Base64-encoded string representing a user's username and password.
// 'language'   - An object containing display strings for use on the server side.
//                This will be localized if the request contains a valid 'lang' 
//                querystring, otherwise defaulting to 'en_US'.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getSegmentsTreeNode = function (oData, params, token, language, callback) {
    var options, filterQuery, segmentsTreeNodeQuery, uri;

    uri = params.url || getResourceLink(token, 'segmentsTreeNode') || null;
    if (uri) {

        // Format a segments tree node querystring based on the oData and the tree node resource link.
        filterQuery = applyODataToURI(oData, uri);

        // Format the querystring with filters applied to add further parameters.
        segmentsTreeNodeQuery = applySegmentParamsToURI(params, filterQuery);

        // Generate the request configuration based on the segment tree node query.
        options = getRequestOptions(segmentsTreeNodeQuery, token);

        // Attempt to get the specified segment tree nodes.
        getResource('segmentsTreeNode', options, language, function (resource) {
            callback(resource, getCurrentAnalysis(token));
        });
    } else {
        
        console.log('getSegmentsTreeNode - no URI');
    }
};

// Attempts to retrieve the specified time series for the requested portfolio.
// 'params'     - An object containing additional parameter values to be inserted into a URI. 
// 'token'      - A Base64-encoded string representing a user's username and password.
// 'language'   - An object containing display strings for use on the server side.
//                This will be localized if the request contains a valid 'lang' 
//                querystring, otherwise defaulting to 'en_US'.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getTimeSeries = function (params, token, language, callback) {
    var options, timeSeriesQuery;

    // Format the querystring with filters applied to add further parameters.
    timeSeriesQuery = applySegmentParamsToURI(params, params.url || getResourceLink(token, 'timeSeries'));

    // Generate the request configuration based on the time series query.
    options = getRequestOptions(timeSeriesQuery, token);

    // Attempt to get the specified time series.
    getResource('timeSeries', options, language, function (resource) {
        callback(resource, getCurrentAnalysis(token));
    });
};

// Attempts to retrieve the End User Licence Agreement in the specified format.
// 'eulaFormat' - A string defining the format in which the EULA should be provided.
//                Can be one of: 'document' (retrieves the HTML fragment and Revolution 
//                CSS), 'fragment' (retrieves only the HTML fragment), 'css' (retrieves
//                only the EULA CSS). If undefined, will default to 'document' format.
// 'token'      - A Base64-encoded string representing a user's username and password.
// 'language'   - An object containing display strings for use on the server side.
//                This will be localized if the request contains a valid 'lang' 
//                querystring, otherwise defaulting to 'en_US'.
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getEula = function (eulaFormat, token, language, callback) {
    var options;

    function getEulaDoc(eulaUri) {
        // Generate the request configuration.
        options = getRequestOptions(eulaUri, token);
        // Attempt to get the EULA.
        getResource('', options, language, function (eulaDoc) {
            callback(eulaDoc);
        });
    }

    // Generate the request configuration.
    options = getRequestOptions(getResourceLink(token, 'eula'), token);

    // Attempt to get the EULA link dependent on the format requested.
    getResource('eula', options, language, function (resource) {
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