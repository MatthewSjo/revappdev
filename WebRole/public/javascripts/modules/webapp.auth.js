// ------------------------------------------
// AUTHENTICATION
// ------------------------------------------

WebAppLoader.addModule({ name: 'auth', plugins: ['base64'], sharedModules: ['ajaxManager'], hasEvents: true }, function () {
    var auth            = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        base64          = this.getPlugin('base64'),
        ajaxManager     = this.getSharedModule('ajaxManager'),
        hash            = '';

    function doLogin(username, password, url) {
        var token, tokenHash;
        
        hash = '';
        tokenHash = base64.encode(username + ':' + password);
        token = 'Basic ' + tokenHash;

        // Post the created token and the user's email to the authenticate action.
        ajaxManager.post(url, { email: username, token: token }, function (response) {
            // If our response indicates that the user has been authenticated...
            if (response.authenticated) {
                hash = tokenHash;
                eventManager.raiseEvent('onLoginSuccess', token); //response.portfolioTotal
            } else {
                eventManager.raiseEvent('onLoginFailed', response.message);
            }
        }, 'json');
    }

    function getHash() {
        return hash;
    }

    auth.doLogin = doLogin;
    auth.getHash = getHash;

    return auth;
});
