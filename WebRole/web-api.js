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
    portfolios: '',
    segmentsTreeNode: '',
    timeSeries: ''
};

// Current Analysis
var currentAnalysis = {
    currency: '',
    statisticsFrequency: ''
};

// User Account
var account = {
    email: '',
    token: ''
};

var MAX_ATTEMPTS = 5;

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

    // Replace the placeholders, ensuring that the filter and orderby strings are suitably 
    // escaped, since their syntax can require the use of whitespace and special characters.
    uri = uri.replace('{filter}', escape(filter))
             .replace('{orderby}', escape(orderby))
             .replace('{skip}', skip)
             .replace('{top}', top);

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
exports.getPortfolios = function (oData, datatype, callback) {
    var options, portfoliosQuery;

    // Format a portfolio querystring based on the oData and the portfolio resource link.
    portfoliosQuery = applyODataToURI(oData, ResourceLinks.portfolios);

    // Generate the request configuration based on the portfolio query.
    options = getRequestOptions(portfoliosQuery, account.token);

    // Attempt to get a list of the user's portfolios, filtered by the query.
    getResource('portfolios', options, function (resource) {
        callback(resource, datatype);
    });
};

// Attempts to retrieve the default analysis for the requested portfolio.
// 'uri'            - The Uniform Resource Identifier representing the default analysis resource.
// 'attempts'       - The attempts setting specifies the maximum number of times to try 
//                    access to the resource.
// 'callback'       - A JavaScript function to be called when the response has arrived.
//                    Will always be called, regardless of the outcome of the request,
//                    and will receive an object containing a 'data' property, which 
//                    may be null, and an error property, which will either be boolean false 
//                    (indicating that the request was successful), a boolean true, or a 
//                    complete error object (both indicating that the request failed).
exports.getPortfolioAnalysis = function (uri, attempts, callback) {
    var options;

    // Generate the request configuration.
    options = getRequestOptions(uri, account.token);
    
    attempts = (attempts > MAX_ATTEMPTS)
        ? MAX_ATTEMPTS
        : attempts;

    // Attempt to get the portfolio analysis for the requested portfolio.
    getResource('portfolioAnalysis', options, function (resource) {
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
                exports.getPortfolioAnalysis(uri, attempts, callback);
                return;
            }

            // Populate the resources object.
            ResourceLinks.segmentsTreeNode = resource.data.analysis.results.links.segmentsTreeRootNodeQuery.href;
            ResourceLinks.timeSeries = resource.data.analysis.results.links.timeSeriesQuery.href;

            // Persist the current analysis' currency and stats frequency for other API calls.
            currentAnalysis.currency = resource.data.analysis.currency;
            currentAnalysis.statisticsFrequency = resource.data.analysis.statisticsFrequency;
        }

        callback(resource);
    });
};

// Attempts to retrieve the specified segment tree nodes for the requested portfolio.
// 'oData'      - An object containing filtering values to be inserted into a URI. 
// 'params'     - An object containing additional parameter values to be inserted into a URI. 
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getSegmentsTreeNode = function (oData, params, callback) {
    var options, filterQuery, segmentsTreeNodeQuery;

    // Format a segments tree node querystring based on the oData and the tree node resource link.
    filterQuery = applyODataToURI(oData, params.url || ResourceLinks.segmentsTreeNode);

    // Format the querystring with filters applied to add further parameters.
    segmentsTreeNodeQuery = applySegmentParamsToURI(params, filterQuery);

    // Generate the request configuration based on the segment tree node query.
    options = getRequestOptions(segmentsTreeNodeQuery, account.token);

    // Attempt to get the specified segment tree nodes.
    getResource('segmentsTreeNode', options, function (resource) {
        callback(resource, currentAnalysis);
    });
};

// Attempts to retrieve the specified time series for the requested portfolio.
// 'params'     - An object containing additional parameter values to be inserted into a URI. 
// 'callback'   - A JavaScript function to be called when the response has arrived.
//                Will always be called, regardless of the outcome of the request,
//                and will receive an object containing a 'data' property, which 
//                may be null, and an error property, which will either be boolean false 
//                (indicating that the request was successful), a boolean true, or a 
//                complete error object (both indicating that the request failed).
exports.getTimeSeries = function (params, callback) {
    var options, timeSeriesQuery;

    // Format the querystring with filters applied to add further parameters.
    timeSeriesQuery = applySegmentParamsToURI(params, params.url || ResourceLinks.timeSeries);

    // Generate the request configuration based on the time series query.
    options = getRequestOptions(timeSeriesQuery, account.token);

    // Attempt to get the specified time series.
    getResource('timeSeries', options, function (resource) {
        callback(resource, currentAnalysis);
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