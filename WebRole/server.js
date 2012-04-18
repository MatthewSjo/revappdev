// ------------------------------------------
// NODE.JS + EXPRESS SERVER SETUP
// ------------------------------------------

// Module Dependencies
var express = require('express'),
    routes = require('./routes'),
    wm = require('./routes/web-methods');

// Create and make global reference to new server,
// and define which port it should be listening to.
var app = module.exports = express.createServer(),
    port = process.env.port || 1337;

// Server Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "pWqxFbVCoBh7smF4AWHGq3EokVDUAiufcemR5OFYMq07rWXZqYrsQBopYZz4nFu" }));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

// Environment Configurations
app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// ------------------------------------------
// MIDDLEWARE FUNCTIONS
// ------------------------------------------

function isAuthenticated(req, res, next) {
    // If the token variable in the session exists, we continue with the request.
    // Otherwise, the user is not authenticated, so redirect to the login page.
    req.session.token ? next() : res.json({ redirect: true, url: '/' });
}

debugger;   // Using debugger here doesn't stop the execution but it's necessary to
            // add the server.js file to the list of scripts in the debugger window.

// ------------------------------------------
// ROUTING REGISTRATION
// ------------------------------------------
app.post('/portfolioAnalysis', site.portfolioAnalysis);

// Site Routes (GET):
app.get('/', routes.login);
app.get('/index', routes.index);
app.get('/dashboard', isAuthenticated, routes.dashboard);
app.get('/portfolios', routes.portfolios);
app.get('/eula', routes.eula);

// Site Routes (POST):
app.post('/authenticate', routes.authenticate);
app.post('/defaultAnalysis', routes.defaultAnalysis);

// Web Methods:
app.get('/isUserAuthenticated', wm.isUserAuthenticated);

// ------------------------------------------
// INITIALISATION
// ------------------------------------------

// Start the server listening on the specified port.
app.listen(port);

// Write to the console to confirm that the server is listening.
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);