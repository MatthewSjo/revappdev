
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    site = require('./site/site'),
    wm = require('./web-method');

var app = module.exports = express.createServer();
var port = process.env.port || 1337;

// Configuration

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

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

function loggedIn(req, res, next) {
    console.log('loggedIn', req.session.user);
    req.session.user != null
	    ? next()
	    : res.redirect("/iPadLogin?url=" + req.url);
}

debugger;   // Using debugger here don't stop the execution but it's necessary to
            // add the server.js file to the list of scripts in the debugger window.

// Site routes:
app.get('/', site.index);
app.get('/iPadLogin', site.iPadLogin);
app.get('/dashboard', loggedIn, site.dashboard);
app.get('/portfolios', site.portfolios);
app.get('/eula', site.eula);
app.get('/test', site.test);
app.post('/defaultAnalysis', site.defaultAnalysis);
app.post('/authenticate', site.authenticate);

// Web methods:
app.get('/isUserLoggedIn', wm.isUserLoggedIn);


app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
