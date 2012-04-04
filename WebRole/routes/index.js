var host = 'revapidev.statpro.com';
var url = '/v1/';
var webbApiUri = 'https://revapidev.statpro.com/v1/';
var http = require('http');
var revApp = require('../rev-app');
var webbApi = require('../webb-api');

// Homepage
exports.index = function (req, res) {
    console.log('index');
    res.render('index');
};

// Login
exports.login = function (req, res, next) {
    console.log('login');
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

exports.authenticate = function (req, res) {
    console.log('auth');
    res.redirect('/');
};

exports.portfolios = function (req, res) {
    //    var options;

    //    options = revApp.getRequestOptions(revApp.WEBAPI_HOST, revApp.WEBAPI_URL, req.session.token);
    //    revApp.getServiceResource(options, renderPortfolios);

    //    function renderPortfolios(viewModel) {
    //        res.render('portfolios', viewModel);
    //    }
    var oData = {
        filter: '', // 'Code eq "EQUITY5"',
        orderby: '',
        skip: '',
        top: ''
    };

    webbApi.getPortfolios(oData, onPortfolios);

    function onPortfolios(service) {
        var viewModel;

        viewModel = service;
        viewModel.layout = false;
        res.render('portfolios', viewModel);
    }
};

exports.dashboard = function (req, res) {
    webbApi.initService(req.session.username, req.session.password, webbApiUri, serviceInited);

    function serviceInited(service) {
        var viewModel;
        
        viewModel = service;
        viewModel.layout = false;
        res.render('dashboard', viewModel);
    }

    //    var options;

    //    options = revApp.getRequestOptions(revApp.WEBAPI_HOST, revApp.WEBAPI_URL, req.session.token);
    //    revApp.getServiceResource(options, renderDashboard);

    //    function renderDashboard(viewModel) {
    //    res.render('dashboard', viewModel);
    //    }


};