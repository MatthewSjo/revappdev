// ------------------------------------------
// ROUTING
// ------------------------------------------

var webApiUri       = 'https://revapidev.statpro.com/v1/', // 'https://revapistage.statpro.com/v1', // 
    http            = require('http'),
    webApi          = require('../web-api'),
    expose          = require('../node_modules/express-expose'),
    languages       = require('../languages'),
    defaultLanguage = 'en_US';

/* ----------------------- ON/OFF ----------------------- /

var serverSideObj = {
    location: 'server side',
    sayHello: function(){
        return 'Hello from ' + this.location;
    }
}

var os = require('os');

var osInfo = {
    platform: os.platform(),
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptime: os.uptime(),
    loadavg :os.loadavg(),
    totalmem :os.totalmem(),
    freemem :os.freemem(),
    cpus: os.cpus()
};

    // res.expose(serverSideObj, 'express.serverObj');
    // res.expose(osInfo, 'express.os');

// ------------------------------------------------------ */

// ------------------------------------------
// VIEW ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/web-methods.js in that
// they do not attempt to return data objects when called; instead, they render views. 

// Homepage
exports.index = function (req, res) {
    var viewModel = {}, 
        currentLanguage;
    
    // Set server side language.
    currentLanguage = req.query.lang || defaultLanguage;
    viewModel.lang = languages[currentLanguage].server;

    // Set client side language.
    res.exposeRequire();
    res.expose(languages[currentLanguage].client, 'language');

    res.render('index', viewModel);
};

// Authentication
exports.authenticate = function (req, res, next) {
    var email, token, currentLanguage;

    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

    // Extract the email and authentication token from the request body.
    email = req.body.email;
    token = req.body.token;

    // Clear any authentication tokens in session that might currently exist.
    delete req.session.token;

    // Attempt to consume the service.
    webApi.initService(email, token, webApiUri, currentLanguage, function (resource) {
        var obj;

        // Create an object to pass down as JSON to the calling function.
        obj = { authenticated: !resource.error };
        console.log('authenticate', resource);

        // If the authentication was unsuccessful...
        if (resource.error) {

            // The API doesn't return a 'username or password incorrect'
            // message, merely an HTTP 401 status code. Therefore, check
            // if the code is 401, and display a more appropriate message,
            // or use the default 'unknown error' if anything else has
            // gone wrong.
            obj.message = (resource.error.httpStatusCode === 401) ?
                currentLanguage.errors.invalidCredentialsText :
                resource.error.message;

        } else {

            // Persist our authorization token in a session variable.
            req.session.token = token;

            // Otherwise, pass down the number of portfolios available to the user.
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
        },
        currentLanguage;

    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

    webApi.getPortfolios(oData, datatype, req.session.token, currentLanguage, function (resource, datatype) {
        var viewModel = resource.data || {};

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
    var datatype = req.body.datatype || '',
        maxAttempts = 3, // TODO: We could use a const to set the maxAttempts.
        currentLanguage;

    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

    webApi.getPortfolioAnalysis(req.body.uri, maxAttempts, req.session.token, currentLanguage, function (analysis) {
        var viewModel = analysis.data || {};

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
    var maxAttempts = 3,
        currentLanguage;

    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

    webApi.getPortfolioAnalysis(req.body.uri, maxAttempts, req.session.token, currentLanguage, function (analysis) {
        var viewModel = analysis.data || {};

        viewModel.layout = false;
        res.render('analysis', viewModel);
    });
};

// EULA
exports.eula = function (req, res) {
    var currentLanguage;
    
    // If we had a language specified as part of the querystring,
    // retrieve it from the language module, otherwise load the default.
    currentLanguage = languages[req.query.lang || defaultLanguage].server;

    webApi.getEula('fragment', req.session.token, currentLanguage, function (resource) {
        var viewModel = {
            eula: resource.data || {},
            layout: false
        };

        res.render('eula', viewModel);
    });
};