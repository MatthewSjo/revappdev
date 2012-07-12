var webApi          = require('../web-api'),
    adapters        = require('../adapters'),
    languages       = require('../languages'),
    defaultLanguage = 'en-US';

// ------------------------------------------
// LANGUAGE HELPER FUNCTIONS
// ------------------------------------------

function getServerLanguage(lang) {
    var language = lang || defaultLanguage;

    language = language.charAt(0).toLowerCase() +
               language.charAt(1).toLowerCase() +
               '-' +
               language.charAt(3).toUpperCase() +
               language.charAt(4).toUpperCase();

    return (languages[language] && languages[language]['server'])
        ? languages[language]['server']
        : languages[defaultLanguage]['server'];
}

// ------------------------------------------
// WEB METHOD ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/index.js in that
// they do not attempt to render views when called; instead, they return data objects.

// Local Authentication Confirmation
exports.isUserAuthenticated = function (req, res) {
    // If the token variable in the session is not truthy, we 
    // haven't got one, and the user is not authenticated.
    res.json({ authenticated: !req.session.token });
};

// Segments Tree Node Retrieval
exports.segmentsTreeNode = function (req, res) {
    var params,
        adapter,
        oData = req.body.oData || {
            filter: '', // 'Code eq "EQUITY5"',
            orderby: '',
            skip: '',
            top: ''
        };

    // Get the correct adapter dependent on the chart type.
    adapter = adapters[req.body.type];

    // Define the parameters for the segment tree node call, including 
    // defaults if the request body doesn't contain any.
    params = {
        timePeriods: req.body.timePeriods,
        include: req.body.include,
        measures: req.body.measures,
        includeMeasuresFor: req.body.includeMeasuresFor
    };

    webApi.getSegmentsTreeNode(oData, params, req.session.token, function (segments, analysis, language) {
        var currentLanguage, jsonObj;

        // Retrieve the language passed from the API.
        currentLanguage = getServerLanguage(language);

        jsonObj = adapter.convert(
            segments.data,
            req.body.include,
            analysis,
            req.body.measures,
            currentLanguage            
        );

        res.json(jsonObj);
    });
};

// Time Series Retrieval
exports.timeSeries = function (req, res) {
    var params, adapter;

    // Get the correct adapter dependent on the chart type.
    adapter = adapters[req.body.type];

    // Define the parameters for the segment tree node call, including 
    // defaults if the request body doesn't contain any.
    params = {        
        endDate: req.body.endDate,
        startDate: req.body.startDate,
        measures: req.body.measures,
        seriesType: req.body.seriesType,
        include: req.body.include
    };

    webApi.getTimeSeries(params, req.session.token, function (series, analysis, language) {
        var currentLanguage, jsonObj;

        // Retrieve the language passed from the API.
        currentLanguage = getServerLanguage(language);

        jsonObj = adapter.convert(
            series.data.dataPoints,
            req.body.seriesType,
            analysis,            
            req.body.measures,
            currentLanguage
        );

        res.json(jsonObj);
    });
};