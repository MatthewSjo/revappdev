// ------------------------------------------
// NAV
// ------------------------------------------

WebAppLoader.addModule({ name: 'nav', hasEvents: true }, function () {
    var nav              = {},
        eventManager    = this.getEventManager();

    // Navigate to an external page.
    function navigateTo(url) {
        window.location = url;
    }

    // Future uses.
    function goToPage(idPage, animation) {
        jQT.goTo($(idPage), 'fade');
    }

    nav.goToPage = goToPage;

    return nav;
});
