
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    webbAPI = require('./webbAPI');

var app = module.exports = express.createServer();
var port = process.env.port || 1337;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Login
app.post('/login', function (req, res) {
    console.log('login: ', req.body.usr);
    res.json(webbAPI.login(req.body.usr, req.body.pw));
});

// Test
app.get('/test', function (req, res) {
    console.log('test: ', req.body.usr);
    res.json(req.body);
});

// Routes
app.get('/', routes.index);

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// NowJS component
var nowjs = require("now");
var everyone = nowjs.initialize(app);

nowjs.on('connect', function () {
    this.now.webbAPI = {};
    this.now.webbAPI.URI = 'https://revapidev.statpro.com/v1';
    console.log("Joined: " + this.now.name);
});

nowjs.on('disconnect', function () {
    console.log("Left: " + this.now.name);
});

everyone.now.distributeMessage = function (message) {
    everyone.now.receiveMessage(this.now.name, message);
};

everyone.now.encodeBase64 = function (value) {
    console.log('this.now.auth: ' + this.now.auth);
    console.log('value: ' + value);
    // return new Buffer(value).toString('base64')
}

everyone.now.decodeBase64 = function (value) {
    return new Buffer(value, 'base64').toString('ascii')
}