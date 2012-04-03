
/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes');

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
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
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
	    : res.redirect("/login?url=" + req.url);
}

// Routes
app.get('/', routes.index);
app.post('/login', routes.login);
app.get('/portfolios', routes.portfolios);
app.post('/authenticate', routes.authenticate);


app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);