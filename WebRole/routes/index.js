// ------------------------------------------
// ROUTING
// ------------------------------------------

var host = 'revapidev.statpro.com',
    url = '/v1/',
    webApiUri = 'https://revapidev.statpro.com/v1/',
    http = require('http'),
    webApi = require('../web-api');

// ------------------------------------------
// VIEW ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/web-methods.js in that
// they do not attempt to return data objects when called; instead, they render views. 

// Homepage
exports.index = function (req, res) {
    res.render('index');
};

// Login Page
exports.login = function (req, res) {
    res.render('login');
};

// Authentication
exports.authenticate = function (req, res, next) {
    var email, token;

    // Extract the email and authentication token from the request body.
    email = req.body.email;
    token = req.body.token;

    // Clear any authentication tokens in session that might currently exist.
    delete req.session.token;

    // Attempt to consume the service.
    webApi.initService(email, token, webApiUri, function (resource) {
        var obj;

        // Create an object to pass down as JSON to the calling function.
        obj = { authenticated: !resource.error };

        // If the authentication was successful...
        if (!resource.error) {
            // Persist our authorization token in a session variable.
            req.session.token = token;
            // Also pass down the number of portfolios available to the user.
            obj.portfolioTotal = resource.data.portfolios.total;
        }

        // Respond with a confirmation object, indicating whether the
        // user's credentials have been accepted by the service.
        res.json(obj);
    });
};

// Portfolios List
exports.portfolios = function (req, res) {
    var datatype = req.body.datatype || '',
        oData = req.body.oData || {
            filter: '', // 'Code eq "EQUITY5"',
            orderby: '',
            skip: '',
            top: ''
        };

    webApi.getPortfolios(oData, datatype, function (resource, datatype) {
        var viewModel;
        viewModel = resource.data || {};

        switch (datatype) {
            case 'json':
                res.json(viewModel);
                break;
            default:
                viewModel.layout = false;
                res.render('portfolios', viewModel);
                break;
        }
    });
};

// Portfolio Analysis
exports.portfolioAnalysis = function (req, res) {
    var datatype = req.body.datatype || '';
    webApi.getPortfolioAnalysis(req.body.uri, function (analysis) {
        var viewModel = {};
        viewModel = analysis.data || {};
        
        switch (datatype) {
            case 'json':
                res.json(viewModel);
                break;
            default:
                viewModel.layout = false;
                res.render('portfolioAnalysis', viewModel);
                break;
        }
    });
};

// Analysis
exports.analysis = function (req, res) {
    webApi.getPortfolioAnalysis(req.body.uri, function (analysis) {
        var viewModel = {};
        viewModel = analysis.data || {};
        viewModel.layout = false;
        res.render('analysis', viewModel);
    });
};

// EULA
exports.eula = function (req, res) {
    webApi.getEula('fragment', function (resource) {
        var viewModel = {};

        viewModel.eula = resource.data || {};
        viewModel.layout = false;

        res.render('eula', viewModel);
    });
};

exports.dashboard = function (req, res) {
};