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

        // If the authentication was successful...
        if (!resource.error) {
            // Persist our authorization token in a session variable.
            req.session.token = token;
        }

        // Respond with a confirmation object, indicating whether the
        // user's credentials have been accepted by the service.
        res.json({ authenticated: !resource.error });
    });
};

// Portfolios List
exports.portfolios = function (req, res) {
    var oData = {
        filter: '', // 'Code eq "EQUITY5"',
        orderby: '',
        skip: '',
        top: ''
    };

    webApi.getPortfolios(oData, function (resource) {
        var viewModel;

        viewModel = resource.data || {};
        viewModel.layout = false;

        res.render('portfolios', viewModel);
    });
};

exports.defaultAnalysis = function (req, res) {
    webApi.getDefaultAnalysis(req.body.uri, function (resource) {
        var viewModel = {};

        viewModel = resource.data || {};
        viewModel.layout = false;

        res.render('defaultAnalysis', viewModel);
    });
};

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