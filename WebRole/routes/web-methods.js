// ------------------------------------------
// WEB METHOD ROUTING
// ------------------------------------------

// NOTE: These methods are distinct from the routes in routes/index.js in that
// they do not attempt to render views when called; instead, they return data objects.

// Local Authentication Confirmation
exports.isUserAuthenticated = function (req, res) {
    // If the token variable in the session is not truthy, we 
    // haven't got one, and the user is not authenticated.
    res.json({ authenticated: !req.session.token });
};