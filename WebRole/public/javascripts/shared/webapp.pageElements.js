﻿// ------------------------------------------
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
        loginPage                           : '#login',
        startupPage                         : '#startup',
        chartSettingsPage                   : '#chartSettings',
        themesPage                          : '#themes',
        languageSettingsPages               : '#languageSettings',
        errorPage                           : '#error',
        fullScreenPage                      : '#fullScreenPage',
	

        // Elements.
        portfolioAnalysisLink               : '.defaultAnalysisLink',
        toolbar                             : '.toolbar',
        loginButton                         : '#loginButton',
        loginErrorText                      : '#loginErrorText',
        loadingMask                         : '#myloading',
        chartLoadingMask                    : '#myLoadingCharts',
        turnLoadingMask                     : '#turnLoadingMask',
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
        errorMessageText                    : '#errorMessageText',
        stayLoggedCheckbox                  : '#stayLoggedCheckbox',
        userEmailLabel                      : '#userEmailLabel',
        summaryTitleName                    : '#summaryTitleName',
        summaryTitleBenchmarkName           : '#summaryTitleBenchmarkName',
        resetCurrentSettingsButton          : '#resetCurrentSettingsButton',
        resetAllSettingsButton              : '#resetAllSettingsButton',
        reloadAppButton                     : '#reloadAppButton',
        analysisComponentFullScreenButton   : '.analysisComponentFullScreenButton',
        fullScreenContainer                 : '#fullScreenContainer',
        minimizeButton                      : '#minimizeButton',
        fullScreenMask                      : '#fullScreenMask',
	    turnIcon                            : '#turnIcon'
    };

    return pageElements;
});