exports.dashboard = function (req, res) {
    webbApi.initService(req.session.username, req.session.password, webbApiUri, function (service) {
        var viewModel;

        viewModel = service;
        viewModel.layout = false;
        res.render('dashboard', viewModel);
    });
};