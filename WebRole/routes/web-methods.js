// ------------------------------------------
// WEB METHOD ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/index.js in that
// they do not attempt to render views when called; instead, they return data objects.

var webApi = require('../web-api'),
    adapters = require('../adapters');
    
var languages       = require('../languages'),
    defaultLanguage = 'en-US';

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
        currentLanguage,
        oData = req.body.oData || {
            filter: '', // 'Code eq "EQUITY5"',
            orderby: '',
            skip: '',
            top: ''
        };

    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

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

    webApi.getSegmentsTreeNode(oData, params, req.session.token, currentLanguage, function (segments, analysis) {
        var jsonObj = adapter.convert(
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
    var params,
        currentLanguage,
        adapter;

    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

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

    webApi.getTimeSeries(params, req.session.token, currentLanguage, function (series, analysis) {
        var jsonObj = adapter.convert(
            series.data.dataPoints,
            req.body.seriesType,
            analysis,            
            req.body.measures,
            currentLanguage
        );

        res.json(jsonObj);
    });
};