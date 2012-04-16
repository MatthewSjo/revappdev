var host = 'revapidev.statpro.com';
var url = '/v1/';
var webbApiUri = 'https://revapidev.statpro.com/v1/';
var http = require('http');
var revApp = require('../rev-app');
var webbApi = require('../webb-api');

/*
// ------------------------------------------
// How to use revApp instead of webbApi:
// ------------------------------------------
var options;

options = revApp.getRequestOptions(revApp.WEBAPI_HOST, revApp.WEBAPI_URL, req.session.token);
revApp.getServiceResource(options, renderDashboard);

function renderDashboard(viewModel) {
res.render('dashboard', viewModel);
}

*/

// Homepage
exports.index = function (req, res) {
    console.log('index');
    res.render('index');
};

exports.iPadLogin = function (req, res) {
    console.log('iPadLogin');
    res.render('iPadLogin');
};

// Login
exports.authenticate = function (req, res, next) {
    console.log('authenticate');
    var userName, password;

    // Retrieve the user object from the form body.
    userName = req.body.usr;
    password = req.body.pw;

    // Persist our authorization token for future headers.
    req.session.token = revApp.makeBaseAuth(userName, password);
    req.session.username = userName;
    req.session.password = password;
    res.json({ logged: true, succes: true, name: userName });
};

exports.portfolios = function (req, res) {
    var oData = {
        filter: '', // 'Code eq "EQUITY5"',
        orderby: '',
        skip: '',
        top: ''
    };

    webbApi.getPortfolios(oData, function (portfolios) {
        var viewModel;
        // links.defaultAnalysis.href
        viewModel = portfolios || {};
        viewModel.layout = false;
        res.render('portfolios', viewModel);
    });
};

exports.defaultAnalysis = function (req, res) {
    webbApi.getDefaultAnalysis(req.body.uri, function (defaultAnalysis) {
        var viewModel = {};
        // links.defaultAnalysis.href
        viewModel = defaultAnalysis || {};
        viewModel.layout = false;
        res.render('defaultAnalysis', viewModel);
    });
};

exports.eula = function (req, res) {
    webbApi.getEula('fragment', function (eula) {
        var viewModel = {};
        // links.defaultAnalysis.href
        viewModel.eula = eula || {};
        viewModel.layout = false;
        res.render('eula', viewModel);
        // res.redirect(eula);
    });
};

exports.test = function (req, res) {
    var viewModel = {};
    // links.defaultAnalysis.href
    viewModel.items = [
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' },
        { name: 'f' },
        { name: 'g' },
        { name: 'h' },
        { name: 'i' },
        { name: 'm' },
        { name: 'n' },
        { name: 'o' },
        { name: 'p' },
        { name: 'q' },
        { name: 'r' },
        { name: 's' },
        { name: 't' },
        { name: 'u' },
        { name: 'v' },
        { name: 'z' }
    ];

    viewModel.layout = false;
    res.render('test', viewModel);
    // res.redirect(eula);
};

exports.dashboard = function (req, res) {
    webbApi.initService(req.session.username, req.session.password, webbApiUri, function (service) {
        var viewModel;

        viewModel = service;
        viewModel.layout = false;
        res.render('dashboard', viewModel);
    });
};