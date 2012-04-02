var host = 'revapidev.statpro.com';
var url = '/v1/';
var http = require('http');

function makeBaseAuth(username, password) {
    var credString, token;

    credString = username + ':' + password;
    token = new Buffer(credString).toString("base64");

    return 'Basic ' + token;
}

function getRequestOptions(req) {
    return {
        host: host,
        port: '80',
        path: url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': req.session.token
        }
    };
}

// Homepage
exports.index = function (req, res) {
    // If user has not already created a valid authorization token...
    if (typeof req.session.token === 'undefined') {
        res.render('index');
    } else {
        res.redirect('/portfolios');
    }
};

exports.portfolios = function (req, res) {
    var options, request, view;

    options = getRequestOptions(req);

    // Set up the request.
    request = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            var obj, viewModel;

            // Parse our JSON into an object we can use.
            obj = JSON.parse(chunk);
            viewModel = obj.service;

            // Redirect to the login page.
            res.render('portfolios', viewModel);
        });
    });

    request.on('error', function (e) {
        // Something went wrong.        
    });

    // post the data
    request.end();
};

// Login
exports.login = function (req, res) {

    var user;

    // Retrieve the user object from the form body.
    user = req.body.user;

    // Persist our authorization token for future headers.
    req.session.token = makeBaseAuth(user.username, user.password);

    // Redirect to the portfolios page.
    res.redirect('/portfolios');

};