var webbAPI = 'https://revapidev.statpro.com/v1';

exports.login = function (usr, pw) {
    var authorization, authorizationBase64;

    authorization = usr + pw;
    authorizationBase64 = new Buffer(authorization).toString('base64');
    return { auth: authorizationBase64 };
}