// ------------------------------------------
// WEB METHOD ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/index.js in that
// they do not attempt to render views when called; instead, they return data objects.

var webApi = require('../web-api'),
    adapters = require('../adapters');

// Local Authentication Confirmation
exports.isUserAuthenticated = function (req, res) {
    // If the token variable in the session is not truthy, we 
    // haven't got one, and the user is not authenticated.
    res.json({ authenticated: !req.session.token });
};

// Segments Tree Node Retrieval
exports.segmentsTreeNode = function (req, res) {
    var params,
        columnDefs,
        oData = req.body.oData || {
            filter: '', // 'Code eq "EQUITY5"',
            orderby: '',
            skip: '',
            top: ''
        };

    // Define the parameters for the segment tree node call, including 
    // defaults if the request body doesn't contain any.
    params = {
        timePeriods: req.body.timePeriods,
        include: req.body.include,
        measures: req.body.measures,
        includeMeasuresFor: req.body.includeMeasuresFor
    };

    webApi.getSegmentsTreeNode(oData, params, function (segments) {
        var adapter = adapters[req.body.type],
            jsonObj = adapter.convert(
                segments.data,
                req.body.include,
                req.body.measures
            );

        res.json(jsonObj);
    });
};