// ------------------------------------------
// ROUTING
// ------------------------------------------

var http            = require('http'),
    webApi          = require('../web-api'),
    expose          = require('../node_modules/express-expose'),
    languages       = require('../languages'),
    defaultLanguage = 'en-US';

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
// LANGUAGE HELPER FUNCTIONS
// ------------------------------------------

function getLanguage(lang, host) {
    var language = lang || defaultLanguage;

    language = language.charAt(0).toLowerCase() + 
               language.charAt(1).toLowerCase() + 
               '-' +
               language.charAt(3).toUpperCase() + 
               language.charAt(4).toUpperCase();

    return (languages[language] && languages[language][host])
        ? languages[language][host]
        : languages[defaultLanguage][host];
}

function getServerLanguage(lang) {
    return getLanguage(lang, 'server');
}

function getClientLanguage(lang) {
    return getLanguage(lang, 'client');
}

// ------------------------------------------
// VIEW ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/web-methods.js in that
// they do not attempt to return data objects when called; instead, they render views. 

// Homepage
exports.index = function (req, res) {
    var viewModel = {}, 
        requestedLanguage;
    
    // At this point, we've not called the Web API which manages 
    // the language on the server side, so we need to set the language 
    // based on the querystring provided, or the default language.
    requestedLanguage = req.query.lang || defaultLanguage;
    viewModel.lang = getServerLanguage(requestedLanguage);

    // Add some extra information to the viewModel.
    viewModel.environment = GLOBAL_ENVIRONMENT;
    viewModel.version = GLOBAL_VERSION;

    // Set client side language.
    res.exposeRequire();
    res.expose(getClientLanguage(requestedLanguage), 'language');

    res.render('index', viewModel);
};

// Authentication
exports.authenticate = function (req, res, next) {
    var email, token, language;

    // Assign the culture code to a variable if we had a language 
    // specified as part of the body, otherwise use the default.
    language = req.body.lang || defaultLanguage;

    // Extract the email and authentication token from the request body.
    email = req.body.email;
    token = req.body.token;

    // Remove any previous session data.
    req.session = {};

    // Attempt to consume the service.
    webApi.initService(email, token, GLOBAL_WAPI_URI, language, function (resource) {
        var obj, currentLanguage;

        // Create an object to pass down as JSON to the calling function.
        obj = { authenticated: !resource.error };
        console.log('authenticate', resource);

        // If the authentication was unsuccessful...
        if (resource.error) {

            // We need to use the language to define error strings.
            currentLanguage = getServerLanguage(language);

            // The API doesn't return a 'username or password incorrect'
            // message, merely an HTTP 401 status code. Therefore, check
            // if the code is 401, and display a more appropriate message,
            // or use the default 'unknown error' if anything else has
            // gone wrong.
            obj.message = (resource.error.httpStatusCode === 401) ?
                currentLanguage.errors.invalidCredentialsText :
                currentLanguage.errors.unknownErrorText;

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
        };

    webApi.getPortfolios(oData, datatype, req.session.token, function (resource, datatype) {
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
        maxAttempts = 3; // TODO: We could use a const to set the maxAttempts.

    webApi.getPortfolioAnalysis(req.body.uri, maxAttempts, req.session.token, function (analysis) {
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
    var datatype = req.body.datatype || '',
        maxAttempts = 3;

    webApi.getPortfolioAnalysis(req.body.uri, maxAttempts, req.session.token, function (analysis) {
        var viewModel = analysis.data || {};

        switch (datatype) {
            case 'json':
                res.json(viewModel);
                break;
            default:
                // Set language and layout.
                viewModel.layout = false;
                res.render('analysis', viewModel);
                break;
        }
    });
};

// EULA
exports.eula = function (req, res) {

    webApi.getEula('fragment', req.session.token, function (resource) {
        var viewModel = {
            eula: resource.data || {},
            layout: false
        };

        res.render('eula', viewModel);
    });
};