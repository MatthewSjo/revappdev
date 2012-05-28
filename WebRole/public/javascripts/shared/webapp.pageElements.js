// ------------------------------------------
// PAGE ELEMENTS
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageElements', isShared: true }, function () {
    var pageElements = {};

    pageElements = {
        // App pages.
        blankPage                           : '#blank_page',
        dashboardPage                       : '#dashboard',
        homePage                            : '#home',
        portfoliosPage                      : '#portfolios',
        portfolioAnalysisPage               : '#portfolioAnalysis',
        analysisPage                        : '#analysis',
        eulaPage                            : '#eula',
        settingsPage                        : '#settings',
        loginPage                           : '#revolutionLogin',
        startupPage                         : '#startup',
        chartSettingsPage                   : '#chartSettings',

        // Elements.
        portfolioAnalysisLink               : '.defaultAnalysisLink',
        toolbar                             : '.toolbar',
        loginButton                         : '#loginButton',
        loadingMask                         : '#myloading',
        chartLoadingMask                    : '#myLoadingCharts',
        userNameTextbox                     : '#userNameTextbox',
        passwordTextbox                     : '#passwordTextbox',
        tabbar                              : 'nav#tabbar',
        listAnalysisSettingsDefaultPages    : '#listAnalysisSettingsDefaultPages',
        listAnalysisSettingsUserPages       : '#listAnalysisSettingsUserPages',
        chartsSelectbox                     : '#chartsSelectbox',
        analysisPageNameTextbox             : '#analysisPageNameTextbox',
        saveChartSettings                   : '#saveChartSettings',
        addNewAnalysisPage                  : '#addNewAnalysisPage',
        analysisTitle                       : '#analysisTitle'
    };

    return pageElements;
});