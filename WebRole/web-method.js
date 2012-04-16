exports.isUserLoggedIn = function (req, res) {
    var logged = req.session.user != null;
    res.json({ logged: logged, success: true });
};