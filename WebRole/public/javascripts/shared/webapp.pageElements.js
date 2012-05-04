// ------------------------------------------
// PAGE ELEMENTS
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageElements', isShared: true }, function () {
    var pageElements = {};

    pageElements = {
        // App pages.
        blankPage               : '#blank_page',
        dashboardPage           : '#dashboard',
        homePage                : '#home',
        portfoliosPage          : '#portfolios',
        portfolioAnalysisPage   : '#portfolioAnalysis',
        analysisPage            : '#analysis',
        eulaPage                : '#eula',

        // Elements.
        portfolioAnalysisLink   : '.defaultAnalysisLink',
        toolbar                 : '.toolbar',
        loginButton             : '#loginButton',
        loadingMask             : '#myloading',
        userNameTextbox         : '#userNameTextbox',
        passwordTextbox         : '#passwordTextbox',
        tabbar                  : 'nav#tabbar'
    };

    return pageElements;
});