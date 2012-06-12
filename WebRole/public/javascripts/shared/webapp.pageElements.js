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
        themesPage                          : '#themes',
        languageSettingsPages               : '#languageSettings',
        errorPage                           : '#error',

        // Elements.
        portfolioAnalysisLink               : '.defaultAnalysisLink',
        toolbar                             : '.toolbar',
        loginButton                         : '#loginButton',
        loginErrorText                      : '#loginErrorText',
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
        analysisTitle                       : '#analysisTitle',
        loadingText                         : '#loadingText',
        listLanguagesPages                  : '#listLanguagesPages',
        timePeriodStartDateText             : '#timePeriodStartDateText',
        timePeriodEndDateText               : '#timePeriodEndDateText',
        errorMessageText                    : '#errorMessageText'
    };

    return pageElements;
});