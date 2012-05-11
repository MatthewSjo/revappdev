// ------------------------------------------
// AUTHENTICATION
// ------------------------------------------

WebAppLoader.addModule({ name: 'auth', plugins: ['base64'], hasEvents: true }, function () {
    var auth            = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        base64          = this.getPlugin('base64');

    function doLogin(username, password, url) {
        var token;

        token = 'Basic ' + base64.encode(username + ':' + password);

        // Post the created token and the user's email to the authenticate action.
        $.post(url, { email: username, token: token }, function (response) {
            // If our response indicates that the user has been authenticated...
            if (response.authenticated) {
                eventManager.raiseEvent('onLoginSuccess', response.portfolioTotal);
            } else {
                eventManager.raiseEvent('onLoginFailed', response);
            }
        }, 'json');
    }

    auth.doLogin = doLogin;

    return auth;
});
