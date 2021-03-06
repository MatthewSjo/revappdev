﻿// ------------------------------------------
// NAV
// ------------------------------------------

WebAppLoader.addModule({ name: 'nav', hasEvents: true }, function () {
    var nav             = {},
        eventManager    = this.getEventManager();

    // Navigate to an external page.
    function navigateTo(url) {
        window.location = url;
    }

    // Future uses.
    function goToPage(idPage, animation) {
        jQT.goTo($(idPage), animation || 'fade');
    }

    function reloadApp(params) {
        var paramsToAdd = params || '';

        window.location = './' + paramsToAdd;
        return false;
    }

    nav.goToPage = goToPage;
    nav.reloadApp = reloadApp;

    return nav;
});
