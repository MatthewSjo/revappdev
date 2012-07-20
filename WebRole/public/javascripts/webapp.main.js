// ------------------------------------------
// MAIN MOBILE WEB APP
// ------------------------------------------

// Initialize jQTouch.
var jQT = new $.jQTouch({
    addGlossToIcon          : true,
    themeSelectionSelector  : '#jqt #themes ul',
    useFastTouch            : true,
    statusBar               : 'default',
    hoverDelay              : 10,
    pressDelay              : 2,
    preloadImages           : [
        'images/sw-slot-border.png',
        'images/sw-alpha.png',
        'images/sw-button-cancel.png',
        'images/sw-button-done.png',
        'images/sw-header.png'
    ]
});

// Main functions:
Zepto(function ($) {

    var theApp       = {},
        loader       = WebAppLoader, // Alias
        output       = loader.getConsole(),
        eventManager = loader.getEventManager(),
        helper       = loader.loadModule('helper'),
        device       = loader.loadModule('device'),
        siteUrls     = loader.getSharedModule('settings').siteUrls,
        el           = loader.getSharedModule('pageElements'),
        lang         = loader.getSharedModule('localizationManager').getLanguage() || {};

    // Test log method.
    output.log('Hello from Dan & Asa!');

    theApp.lastUsernameUsed = '';
    theApp.lastPasswordUsed = '';
    theApp.lastFavouriteSelected = '';

    // Default settings.
    theApp.lastAnalysisObjectUsed = {
        portfolioId: '',
        portfolioName: '',
        analysisId: 'performance',
        analysisName: 'Performance',
        timePeriodId: 'Earliest',
        timePeriodName: 'Earliest',
        chartId: 'performance_bar',
        timeStamp: ''
    };

    theApp.defaultLanguage = "en-US";
    
    /* ----------------------- ON/OFF ----------------------- /
       'Switch comments off changing /* in //* and viceversa'
    // ------------------------------------------------------ */

    // ------------------------------------------
    // COMPONENTS CREATION
    // ------------------------------------------

    // Repositories
    theApp.repositories = loader.loadModule('repositories');

    // IScroll
    theApp.scroll = loader.loadModule('scroll');

    // Navigation
    theApp.nav = loader.loadModule('nav');

    // Loading Mask Manager
    theApp.mask = loader.loadModule('loadingMaskManager');

    // Loading Settings
    theApp.settings = loader.loadModule('settings');
    theApp.automaticLanguageDetection = theApp.settings.appSettings.automaticLanguageDetection;

    // Swipe View
    theApp.swipeView = loader.loadModule('swipeView');

    // Analysis Settings Page
    theApp.analysisSettingsPage = loader.loadModule('analysisSettingsPage');

    // Chart Settings Page
    theApp.chartSettingsPage = loader.loadModule('chartSettingsPage');

    // Chart Components
    theApp.chartComponents = loader.loadModule('chartComponents');

    // Ajax Manager
    theApp.ajaxManager = loader.loadModule('ajaxManager');

    // Swipe Button Control
    theApp.swipeButton = loader.loadModule('swipeButton');
    
    // Local Storage Manager
    theApp.localStorage = loader.loadModule('localStorageManager');

    // Full Screen Manager
    theApp.presentationManager = loader.loadModule('presentationManager');
    
    // ------------------------------------------
    // LAST ANALYSIS DATA OBJECT
    // ------------------------------------------

    theApp.getLastAnalysisObjectUsed = function () {
        return theApp.lastAnalysisObjectUsed;
    };

    theApp.setLastAnalysisObjectUsed = function (obj) {
        for (var property in obj) {
            if (theApp.lastAnalysisObjectUsed.hasOwnProperty(property)) {
                theApp.lastAnalysisObjectUsed[property] = obj[property];
            }
        }
    };

    theApp.getLanguage = function () {
        return helper.getURLParameter('lang') || theApp.defaultLanguage;
    };

    theApp.tryToChangeLanguage = function (language) {
        var currentLanguage = theApp.getLanguage();

        if (language && currentLanguage && (language.toLowerCase() !== currentLanguage.toLowerCase())) {
            theApp.nav.reloadApp('?lang=' + language);
            return true;
        }

        return false;
    };

    // ------------------------------------------
    // THE MAIN ENTRY POINT (Before Login)
    // ------------------------------------------

    theApp.startHere = function () {
        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = {},
            lastLoggedOnUser = '',
            language = device.language() || '',
            username = '',
            password = '';

        // Try to get the last logged on user.
        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        if (lastLoggedOnUser) {
            theApp.settings.loadData('userSettings', lastLoggedOnUser);
            userSettingsData = theApp.settings.getData('userSettings');

            // Try to get username and password.
            username = userSettingsData.username || '';
            password = userSettingsData.password || '';
            language = userSettingsData.language || '';

            if (theApp.automaticLanguageDetection) {
                if (username !== '' && theApp.tryToChangeLanguage(language)) {
                    return;
                }
            } else {
                if (username !== '') {
                    theApp.tryToChangeLanguage(language);
                }
            }
            
            // With the language defined, set the CultureInfo property of the 
            // JavaScript Date object, so date.js can hook in for localization.
            Date.CultureInfo = lang.cultureInfo;

            if (userSettingsData.automaticLogin) {
                // If username and password fields are available...
                if (username && password) {
                    // .. try to login or...
                    theApp.doLogin(username, password);
                } else {
                    // ... go to the login page using the last logged on user.
                    theApp.goToLoginPage(username || lastLoggedOnUser);
                }
            } else {
                theApp.goToLoginPage(username || lastLoggedOnUser);
            }
        } else {
            if (theApp.automaticLanguageDetection) {
                if (!theApp.tryToChangeLanguage(language)) {
                    theApp.goToLoginPage();
                }
            } else {
                theApp.goToLoginPage();
            }
        }
    };

    theApp.doLogin = function (username, password) {
        theApp.lastUsernameUsed = username.toLowerCase();
        theApp.lastPasswordUsed = password;
        theApp.auth.doLogin(username, password, siteUrls.authenticate, theApp.getLanguage());
    };

    theApp.goToLoginPage = function (username) {
        theApp.tabbar.hide();

        // Set the field's value.
        $(el.userNameTextbox).val(username || '');

        // Show the login page.
        setTimeout(function () {
            theApp.nav.goToPage($(el.loginPage), 'dissolve');
        }, 1000);
    };

    // ------------------------------------------
    // INIT APP (After Login)
    // ------------------------------------------

    theApp.init = function () {
        var lastLoggedOnUser = '',
            automaticLogin = false,
            analysisDataObject = {};

        theApp.nav.goToPage($(el.startupPage), 'dissolve');
        theApp.tabbar.show();

        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        appSettingsData.lastLoggedOnUser = theApp.lastUsernameUsed;
        theApp.settings.saveData('appSettings');

        userSettingsData.username = theApp.lastUsernameUsed;
        userSettingsData.password = theApp.lastPasswordUsed;

        if (userSettingsData.lastUsedLanguage === 'none') {
            userSettingsData.language = theApp.getLanguage();
            userSettingsData.lastUsedLanguage = userSettingsData.language;
        }

        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        automaticLogin = helper.getValueAs(userSettingsData.automaticLogin, 'boolean');

        // Init the themeManager using the last theme used (or the default one).        
        var lastThemeUsed = theApp.themesManager.loadData('theme', theApp.lastUsernameUsed);
        theApp.themesManager.switchStyle(lastThemeUsed);

        // Try to retrieve the last analysisDataObject used.
        var lastAnalysisObjectUsed = userSettingsData.lastAnalysisObjectUsed || null;

        // Update all.
        theApp.updateSettingsPage({ email: theApp.lastUsernameUsed, automaticLogin: automaticLogin });
        theApp.analysisManager.update(theApp.lastUsernameUsed);
        theApp.favouritesManager.update(theApp.lastUsernameUsed);
        theApp.updateAnalysisPage(lastAnalysisObjectUsed);
    };

    theApp.updateAnalysisPage = function (analysisDataObjectValue) {
        var analysisDataObject = analysisDataObjectValue || theApp.getLastAnalysisObjectUsed();

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        theApp.nav.goToPage($(el.analysisPage), 'dissolve');

        function renderAnalysisPage(portfolio) {
            var chartsToRender = [],
                analysisPagesData = {},
                analysisPage = {},
                portfolioId = portfolio.code,
                portfolioName = portfolio.name,
                analysisPageCharts = null,
                analysisPageTitle = '',
                i;

            analysisPagesData = theApp.analysisManager.getData('analysisPages');

            analysisPage = jLinq.from(analysisPagesData.items)
                .equals('id', analysisDataObject.analysisId)
                .select();

            // If no analysis page has been found load the first one.            
            if (analysisPage[0] && analysisPage[0].charts) {
                analysisPageCharts = analysisPage[0].charts;
                analysisPageTitle = analysisPage[0].name;
            } else {
                analysisPageCharts = analysisPagesData.items[0].charts;
                analysisPageTitle = analysisPagesData.items[0].name;
            }

            chartsToRender = jLinq.from(analysisPageCharts)
                .sort('order')
                .select();

            // Update the page title.
            $(el.analysisTitle).html(analysisPageTitle);

            // Loop around the provided time periods for the portfolio,
            // and get hold of the start and end date for that particular
            // period, breaking the loop when found.
            $.each(portfolio.timePeriods, function (index, period) {
                var startDate, endDate;

                if (period.code === analysisDataObject.timePeriodId) {

                    // Add the currently requested time period to each of the chart config objects.
                    theApp.chartComponents.setTimePeriod(chartsToRender, period);

                    startDate = Date.parse(period.startDate);
                    endDate = Date.parse(period.endDate);

                    $(el.timePeriodStartDateText).html(startDate.toString('MMM d, yyyy'));
                    $(el.timePeriodEndDateText).html(endDate.toString('MMM d, yyyy'));
                    return false;
                }
            });

            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.setLastAnalysisObjectUsed({
                portfolioId: portfolioId,
                portfolioName: portfolioName
            });

            // Deselect Settings button when charts have been rendered.
            theApp.tabbar.getButton('settings').setHighlight(false);

            theApp.saveLastAnalysisObjectUsed();
            theApp.synchronizeFavouriteButton();

            theApp.chartComponents.render(chartsToRender, '#analysis_partial');
            theApp.synchronizeOrientation();
            $(el.analysisComponentFullScreenButton).on('click', function (e, info) {
                var chartId = $(this).attr('data-chartId');
                theApp.presentationManager.enterPresentationMode(chartId);
            });
        }

        function onLoadPortfolioAnalysisCompleted(portfolio) {
            renderAnalysisPage(portfolio);
        }

        theApp.portfolioManager.loadPortfolioAnalysis(
            analysisDataObject.portfolioId,
            onLoadPortfolioAnalysisCompleted
        );
    };

    theApp.saveLastAnalysisObjectUsed = function () {
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.lastAnalysisObjectUsed = theApp.getLastAnalysisObjectUsed();
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
    };

    theApp.chartComponents.on('onAllChartsLoaded', function () {
        output.log('onAllChartsLoaded');
    });

    theApp.chartComponents.on('onChartsLoading', function (chartCount, chartTotal) {
        output.log('onChartsLoading', chartCount, chartTotal);
    });

    // ------------------------------------------
    // SETTINGS PAGES
    // ------------------------------------------

    theApp.showAnalysisSettingsPage = function () {
        var analysisPagesData = {}, analysisPages;

        analysisPagesData = theApp.analysisManager.getData('analysisPages');

        analysisPages = jLinq.from(analysisPagesData.items)
            .sort('order', 'userDefined')
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    userDefined: record.userDefined
                };
            });

        theApp.analysisSettingsPage.create(analysisPages);
    };

    theApp.analysisSettingsPage.on('onClick', function (analysisId) {
        theApp.nav.goToPage(el.chartSettingsPage, 'slideup');
        theApp.showChartSettingsPage(analysisId);
    });

    theApp.analysisSettingsPage.on('onPageLoaded', function () {
        // swipeButton addTo(...) params: 
        //  - containerId, 
        //  - label, 
        //  - callback, 
        //  - autoRemove, 
        //  - buttonClass
        theApp.swipeButton.addTo('#listAnalysisSettingsUserPages', 'Delete', theApp.onUserPageDeleted, true);
    });

    theApp.onUserPageDeleted = function ($button) {
        var userPageId = $button.parent().parent().data('link') || null,
            analysisPagesData;

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        if (helper.removeObjectFromArray(analysisPagesData.items, 'id', userPageId)) {
            theApp.analysisManager.saveData('analysisPages', theApp.lastUsernameUsed);
            theApp.updateAnalysisSlot(analysisPagesData);
        }
    };

    theApp.showChartSettingsPage = function (analysisId) {
        var analysisPagesData = {},
            chartComponentsData = {},
            analysisPage = {},
            charts = theApp.showChartSettingsPage.charts;

        if (!analysisId) {
            return; // TODO: Add a message error.
        }

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        chartComponentsData = theApp.chartComponents.getData('charts');

        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', analysisId)
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    charts: record.charts
                };
            })[0] || null;

        if (!analysisPage) {
            analysisPage = {
                name: '',
                id: analysisId,
                charts: []
            };
        }

        // TODO: Add comments...
        if (charts.length === 0) {
            for (var chart in chartComponentsData) {
                charts.push({
                    chartId: chartComponentsData[chart].chartId,
                    chartType: chartComponentsData[chart].chartType,
                    chartTitle: chartComponentsData[chart].title // chartTitle
                });
            }

            theApp.chartSettingsPage.create(charts);
        }

        theApp.chartSettingsPage.update(analysisPage);
    };

    theApp.chartSettingsPage.on('onSettingsChanged', function (updatedAnalysisPage) {
        var analysisPage, analysisPagesData;

        updatedAnalysisPage.name = updatedAnalysisPage.name || 'Untitled'; // TODO: Localize string 'Untitled'

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', updatedAnalysisPage.id)
            .select()[0] || null;

        if (analysisPage) {
            $.extend(analysisPage, updatedAnalysisPage);
        } else {
            analysisPagesData.items.push(updatedAnalysisPage);
        }

        theApp.analysisManager.saveData('analysisPages', theApp.lastUsernameUsed);
        theApp.updateAnalysisSlot(analysisPagesData);

        // Show the new analysis page.
        theApp.setLastAnalysisObjectUsed({
            analysisId: updatedAnalysisPage.id,
            analysisName: updatedAnalysisPage.name
        });
        theApp.updateAnalysisPage();

    });

    // Memoization pattern.
    theApp.showChartSettingsPage.charts = [];

    theApp.updateSettingsPage = function (settings) {
        var email = settings.email || null,
            automaticLogin = settings.automaticLogin || false;

        // If an email has been specified update the field.
        if (email) {
            $(el.userEmailLabel).html(theApp.lastUsernameUsed);
        }

        // Update the automatic login checkbox.
        if (automaticLogin) {
            $(el.stayLoggedCheckbox).attr('checked', true);
        } else {
            $(el.stayLoggedCheckbox).removeAttr('checked');
        }
    };

    // ------------------------------------------
    // LANGUAGE SETTINGS PAGE
    // ------------------------------------------

    theApp.languageSettingsPage = loader.loadModule('languageSettingsPage');
    theApp.languageSettingsPage.create();

    theApp.languageSettingsPage.on('onLanguageSelected', function (language) {
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.language = language.value;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
        output.log('onLanguageSelected', language);
        theApp.nav.reloadApp('?lang=' + language.value);
    });

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onPortfolioLoaded', function (portfolio) {
        // When a new portfolio is loaded update timeperiods and analysis slots.
        theApp.repositories.timePeriodsSlot.setData(portfolio.timePeriods);
        output.log('Loaded portfolio:', portfolio);
    });

    theApp.portfolioManager.on('onAnalysisLoaded', function (data) {
        theApp.updateAnalysisInfo(data);
        theApp.tabbar.show();
    });

    theApp.portfolioManager.on('onFailed', function (message) {
        theApp.scroll.rebuild('error');
        $(el.errorMessageText).html(message);
        theApp.nav.goToPage($(el.errorPage));
    });

    theApp.updateAnalysisInfo = function (data) {
        var i, benchmarks, benchmarkPlaceholder;

        if (data) {
            // Define the CSS word-break rules depending on 
            // the whitespace available in the portfolio name.
            if (data.name.indexOf(' ') === -1) {
                $(el.summaryTitleName).attr('style', 'word-break: break-all;');
            } else {
                $(el.summaryTitleName).attr('style', 'word-break: normal;');
            }

            // Update the portfolio name.
            $(el.summaryTitleName).html(data.name);

            // Clear out any existing benchmarks.
            benchmarkPlaceholder = $(el.summaryTitleBenchmarkName);
            benchmarkPlaceholder.html('');

            // Loop around any benchmarks we have, 
            // adding their names to the placeholder.
            benchmarks = data.analysis.benchmarks || [];

            for (i = 0; i < benchmarks.length; i++) {
                if (i > 0) {
                    benchmarkPlaceholder.append(', ');
                }
                benchmarkPlaceholder.append(benchmarks[i].name);
            }

            // Clear the analysis partial of existing elements.
            $(el.analysisPage + '_partial').html('');
        }
    };

    // ------------------------------------------
    // TOOLBAR
    // ------------------------------------------

    var toolbarConfig = {
        toolbarId: '#analysis .toolbar',  // TODO: el.tabbar,
        buttonPrefix: 'toolbar_btn',
        visible: true,
        items: [
            { id: 'favourite', title: lang.tabbar.favourites, btnClass: 'favourite' }
            // { id: 'test', title: test, btnClass: 'favourite' } // Comment off to add a test button.
        ]
    };

    theApp.toolbar = loader.loadModule('toolbar');
    theApp.toolbar.create(toolbarConfig);

    theApp.toolbar.on('onTap', function () {
        theApp.scroll.goUp();
    });

    theApp.toolbar.on('onFavouriteTap', function (isSelected) {
        if (isSelected) {
            theApp.addToFavourites();
        } else {
            theApp.removeFromFavourites();
        }
    });

    theApp.toolbar.on('onTestTap', function (isSelected) {
        theApp.onTestApp();
    });

    // Test
    theApp.toolbar.on('onTestEvent', function () {
        alert('toolbar');
    });

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------

    var tabbarConfig = {
        tabbarId: el.tabbar,
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
            { id: 'favourites', title: lang.tabbar.favourites, btnClass: 'favourites' },
            { id: 'portfolios', title: lang.tabbar.portfolios, btnClass: 'portfolios' },
            { id: 'analysis', title: lang.tabbar.analysis, btnClass: 'analysis' },
            { id: 'timePeriods', title: lang.tabbar.timePeriods, btnClass: 'timeperiods' },
            { id: 'settings', title: lang.tabbar.settings, btnClass: 'settings', highlight: true }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onTestEvent', function () {
        alert('tabbar');
    });

    theApp.tabbar.on('onFavouritesTap', function () {
        theApp.spinningWheel.getSlot('favourites').show(theApp.lastFavouriteSelected);
    });

    theApp.tabbar.on('onPortfoliosTap', function () {
        theApp.spinningWheel.getSlot('portfolios').show(theApp.getLastAnalysisObjectUsed().portfolioId); //'ADVISOR');
    });

    theApp.tabbar.on('onAnalysisTap', function () {
        theApp.spinningWheel.getSlot('analysis').show(theApp.getLastAnalysisObjectUsed().analysisId);
    });

    theApp.tabbar.on('onTimePeriodsTap', function () {
        theApp.spinningWheel.getSlot('timePeriods').show(theApp.getLastAnalysisObjectUsed().timePeriodId);
    });

    theApp.tabbar.on('onSettingsTap', function (button) {
        if (button.isHighlighted) {
            theApp.nav.goToPage($(el.settingsPage));
        } else {
            theApp.nav.goToPage($(el.analysisPage));
        }
    });

    // ------------------------------------------
    // SPINNING WHEEL
    // ------------------------------------------

    var slotConfig = {
        items: [
            { id: 'favourites', repository: theApp.repositories.favouritesSlot },
            { id: 'portfolios', repository: theApp.repositories.portfoliosSlot },
            { id: 'analysis', repository: theApp.repositories.analysisSlot },
            { id: 'timePeriods', repository: theApp.repositories.timePeriodsSlot }
        ]
    };

    theApp.spinningWheel = loader.loadModule('spinningWheel');
    theApp.spinningWheel.create(slotConfig);

    theApp.spinningWheel.on('onPortfoliosDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ portfolioId: key, portfolioName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onAnalysisDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ analysisId: key, analysisName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onTimePeriodsDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ timePeriodId: key, timePeriodName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onFavouritesDone', function (key, value) {
        var analysisDataObject = theApp.favouritesManager.getAnalysisDataObjectFromFavourte(key);

        if (analysisDataObject) {
            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.updateAnalysisPage();
        }
    });

    // ------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------

    theApp.auth = loader.loadModule('auth');

    // Login
    $(el.loginButton).on('click', function () {
        var username, password;

        // Obtain the username and password from the form.
        username = $(el.userNameTextbox).val();
        password = $(el.passwordTextbox).val();

        theApp.doLogin(username, password);
    });

    theApp.auth.on('onLoginSuccess', function (token) {
        // If the user login successfully store the token.
        theApp.ajaxManager.setToken(token);
        theApp.init();
    });

    theApp.auth.on('onLoginFailed', function (message) {
        $(el.loginErrorText).html(message);
        output.log('onLoginFailed response: ', message);
    });

    // ------------------------------------------
    // PAGE EVENTS
    // ------------------------------------------

    theApp.pageEventsManager = loader.loadModule('pageEventsManager');

    theApp.pageEventsManager.on('onStartupStart', function () {
        output.log('onStartupEnd');
    });

    theApp.pageEventsManager.on('onLoginStart', function () {
        theApp.tabbar.hide();
        output.log('onLoginStart');
    });

    theApp.pageEventsManager.on('onHomeStart', function () {
        output.log('onHomeStart');
    });

    theApp.pageEventsManager.on('onHomeEnd', function () {
        theApp.tabbar.show();
        theApp.scroll.rebuild('home');
        output.log('onHomeEnd');
    });

    theApp.pageEventsManager.on('onEulaEnd', function () {
        $.get(siteUrls.eula, function (data) {
            theApp.scroll.rebuild('eula');
            $(el.eulaPage + '_partial').append('<div class="genericContainer">' + helper.htmlDecode(data) + '</div>');
        });
        output.log('onEulaEnd');
    });

    theApp.pageEventsManager.on('onAnalysisEnd', function () {
        theApp.scroll.rebuild('analysis');

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        output.log('onAnalysisEnd');
    });

    theApp.pageEventsManager.on('onSettingsStart', function () {
        theApp.scroll.rebuild('settings', true); // Pass in true to ensure form elements are clickable.
        output.log('onSettingsStart');
    });

    theApp.pageEventsManager.on('onSettingsEnd', function () {
        output.log('onSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisSettingsEnd', function () {
        theApp.scroll.rebuild('analysisSettings', true); // Pass in true to ensure form elements are clickable.
        output.log('onAnalysisSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisPagesSettingsStart', function () {
        theApp.scroll.rebuild('analysisPagesSettings', true); // Pass in true to ensure form elements are clickable.
        theApp.showAnalysisSettingsPage();
        output.log('onAnalysisPagesSettingsStart');
    });

    theApp.pageEventsManager.on('onChartSettingsEnd', function () {
        // TODO: focus() doesn't work on iOS...
        setTimeout(function () {
            $(el.analysisPageNameTextbox).focus();
        }, 200);

        output.log('onChartSettingsStart');
    });

    theApp.pageEventsManager.on('onAboutEnd', function () {
        theApp.scroll.rebuild('about', true); // Pass in true to ensure form elements are clickable.
        output.log('onAboutEnd');
    });

    theApp.pageEventsManager.on('onTestEnd', function () {
        theApp.scroll.rebuild('test');
        output.log('onTestEnd');
    });

    theApp.pageEventsManager.on('onResetEnd', function () {
        theApp.scroll.rebuild('reset', true); // Pass in true to ensure form elements are clickable.
        output.log('onResetEnd');
    });

    // ------------------------------------------
    // SETTINGS PAGE EVENTS
    // ------------------------------------------

    $(el.reloadAppButton).on('click', function () {
        theApp.nav.reloadApp();
    });

    $(el.resetAllSettingsButton).on('click', function () {
        theApp.localStorage.clearAll();
        theApp.nav.reloadApp();
    });

    $(el.resetCurrentSettingsButton).on('click', function () {
        theApp.localStorage.clearUserSettings(theApp.lastUsernameUsed);
        theApp.nav.goToPage($(el.settingsPage));
    });

    $(el.stayLoggedCheckbox).on('click', function () {
        var stayLogged = $(el.stayLoggedCheckbox + ':checked').val()
            ? true
            : false,
        userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.automaticLogin = stayLogged;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        output.log(stayLogged);
    });

    // ------------------------------------------
    // ANALYSIS MANAGER
    // ------------------------------------------

    theApp.analysisManager = loader.loadModule('analysisManager');

    // NOTA BENE: the analysis manager is updated the first time when the home
    // page is loaded.
    theApp.analysisManager.on('onUpdated', function (analysisPages) {
        theApp.updateAnalysisSlot(analysisPages);
    });

    theApp.updateAnalysisSlot = function (analysisPages) {
        var analysisSlotItems = jLinq.from(analysisPages.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.name,
                    code: record.id
                };
            });

        theApp.repositories.analysisSlot.setData(analysisSlotItems);
    };

    // ------------------------------------------
    // FAVOURITES MANAGER
    // ------------------------------------------

    theApp.favouritesManager = loader.loadModule('favouritesManager');

    theApp.favouritesManager.on('onFavouritesUpdated', function (favourites) {
        theApp.updateFavouritesSlot(favourites);
    });

    theApp.updateFavouritesSlot = function (favourites) {
        var favouritesSlotItems = jLinq.from(favourites.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.title,
                    code: record.favouriteId
                };
            });

        theApp.repositories.favouritesSlot.setData(favouritesSlotItems);
    };

    theApp.analysisDataObjectToFavourite = function (analysisDataObject) {
        var favourite = null;

        favourite = theApp.favouritesManager.getFavourteFromAnalysisDataObject(analysisDataObject);
        return favourite || null;
    };

    // - favouriteId [optional]
    theApp.favouriteExists = function (favouriteId) {
        var favouriteToCheck = theApp.getFavouriteById(favouriteId);

        return (favouriteToCheck && true);
    };

    theApp.getFavouriteById = function (favouriteId) {
        var favourite = null,
            favouriteToCheck = null,
            favouritesData = theApp.favouritesManager.getData('favourites');

        if (!favouriteId) {
            favourite = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
            favouriteId = favourite.favouriteId;
        }

        favouriteToCheck = jLinq.from(favouritesData.items)
            .equals('favouriteId', favouriteId)
            .select()[0] || null;

        return (favouriteToCheck);
    };

    theApp.addToFavourites = function () {
        var favouriteToAdd = {},
            favouritesData = null;

        favouriteToAdd = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToAdd) {
            if (!theApp.favouriteExists(favouriteToAdd.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                favouritesData.items.push(favouriteToAdd);
                theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                theApp.favouritesManager.update(theApp.lastUsernameUsed);
                theApp.setLastFavouriteSelected(favouriteToAdd.favouriteId);
            }
        }
    };

    theApp.removeFromFavourites = function () {
        var favouriteToRemove = {},
            favouritesData = null;

        favouriteToRemove = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToRemove) {
            if (theApp.favouriteExists(favouriteToRemove.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                if (helper.removeObjectFromArray(favouritesData.items, 'favouriteId', favouriteToRemove.favouriteId)) {
                    theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                    theApp.favouritesManager.update(theApp.lastUsernameUsed);
                }
            }
        }
    };

    // - favouriteId [optional]
    theApp.synchronizeFavouriteButton = function (favouriteId) {
        var favourite = theApp.getFavouriteById(favouriteId),
            favouriteButton = theApp.toolbar.getButton('favourite');

        if (favourite && favouriteButton) {
            theApp.setLastFavouriteSelected(favourite.favouriteId);
            favouriteButton.select();
        } else {
            favouriteButton.deselect();
        }
    };

    theApp.setLastFavouriteSelected = function (favouriteId) {
        theApp.lastFavouriteSelected = favouriteId;
    };

    // ------------------------------------------
    // THEMES MANAGER
    // ------------------------------------------

    theApp.themesManager = loader.loadModule('themesManager');

    theApp.themesManager.on('onThemeChanged', function (themeName) {
        var themeData = theApp.themesManager.getData('theme') || null;

        if (themeData) {
            themeData.name = themeName;
            theApp.themesManager.saveData('theme', theApp.lastUsernameUsed);
        }

        output.log('onThemeChanged', themeName);
    });

    // ------------------------------------------
    // PORTFOLIOS LIST
    // ------------------------------------------
    //
    // NOTA BENE:
    // PortfoliosList has been removed from the app but the code is still here
    // for testing purpose.

    theApp.portfoliosList = loader.loadModule('portfoliosList');

    theApp.portfoliosList.on('onDataReceived', function (data) {
        $(el.analysisPage + '_partial').html(data);
    });

    // ------------------------------------------
    // TEARDOWN
    // ------------------------------------------

    // Unload modules from the loader after they have been loaded by the app.
    loader.unloadModule('ajaxManager');
    loader.unloadModule('analysisManager');
    loader.unloadModule('analysisSettingsPage');
    loader.unloadModule('auth');
    loader.unloadModule('chartComponents');
    loader.unloadModule('chartSettingsPage');
    loader.unloadModule('device');
    loader.unloadModule('favouritesManager');
    loader.unloadModule('helper');
    loader.unloadModule('languageSettingsPage');
    loader.unloadModule('loadingMaskManager');
    loader.unloadModule('localStorageManager');
    loader.unloadModule('nav');
    loader.unloadModule('pageEventsManager');
    loader.unloadModule('portfoliosList');
    loader.unloadModule('portfolioManager');
    loader.unloadModule('repositories');
    loader.unloadModule('scroll');
    loader.unloadModule('tabbar');
    loader.unloadModule('settings');
    loader.unloadModule('spinningWheel');
    loader.unloadModule('swipeButton');
    loader.unloadModule('swipeView');
    loader.unloadModule('themesManager');
    loader.unloadModule('toolbar');
    loader.unloadModule('presentationManager');

    theApp.startHere();

    // ------------------------------------------
    // EXTRA FUNCTIONALITIES
    // ------------------------------------------

    theApp.synchronizeOrientation = function () {
        var animationSpeed  = 25,
            rebuildingDelay = 500,
            el              = null;

        if (theApp.presentationManager.isFullScreen()) {
            return;
        }

        animationSpeed  = (theApp.settings.appSettings.animatedChartResizing)
            ? 500
            : 25;

        theApp.mask.show('turn');

        // ASA TODO: Change left, top, width and height from chartDefaults instead of scaling all charts about .93...
        if (device.orientation() === 'landscape') {
            $('.analysisComponentContainer').animate({ height: '500px' }, { duration: animationSpeed, easing: 'ease-out', complete: function () {
                $('.chartContainer').css({'-webkit-transform': 'scale(.93)', '-webkit-transform-origin': 'left top'});
            }});

        } else {
            $('.chartContainer').css({'-webkit-transform': 'scale(.69)', '-webkit-transform-origin': 'left top'});
            $('.analysisComponentContainer').animate({ height: '375px' }, { duration: animationSpeed, easing: 'ease-out', complete: function () {}});
        }

        if (theApp.settings.appSettings.automaticChartRepositioning) {
            theApp.synchronizeOrientation.pendingCount += 1;
             
            // Rebuild the iScroll using a delay is necessary to ensure that the page height
            // is calculate correctly.
            setTimeout(function () {
                if (theApp.synchronizeOrientation.pendingCount > 0) {
                    theApp.synchronizeOrientation.pendingCount -= 1;
                }
            
                if (theApp.synchronizeOrientation.pendingCount === 0) {
                    theApp.scroll.rebuild('analysis');
                    if (theApp.synchronizeOrientation.chartToDisplay !== '') {
                        theApp.scroll.scrollToElement('#' + theApp.synchronizeOrientation.chartToDisplay, 75, 25);
                    }
             
                    theApp.mask.hide('turn');
                }
            }, animationSpeed + rebuildingDelay);
        } else {
            setTimeout(function () {
                theApp.scroll.rebuild('analysis');
                theApp.mask.hide('turn'); // ASA
            }, animationSpeed + rebuildingDelay);
        }
    };
    
    // Memoization pattern.
    theApp.synchronizeOrientation.pendingCount = 0;
    theApp.synchronizeOrientation.chartToDisplay = '';

    theApp.getCurrentChartDisplayedInViewport = function () {
        var approximativeHeaderHeight   = 75,
            horizon                     = 0, 
            charts                      = [],
            chart                       = {},
            positions                   = [],
            minY                        = 0;

        horizon = (device.orientation() === 'landscape')
            ? (device.maxHeight()) / 2 + approximativeHeaderHeight
            : (device.maxWidth()) / 2 + approximativeHeaderHeight;

        $('.snapper').each(function (){
            var id, y;
            y = Math.abs($(this).offset().top - approximativeHeaderHeight);
            id = $(this).data('chartid');
            y = (y >= horizon)
                ? y - horizon
                : y;
           
            positions.push(y);
            charts.push({y: y, chartId: id});
        });
        
        // Reference: http://ejohn.org/blog/fast-javascript-maxmin/
        minY = Math.min.apply(Math, positions);
        chart =  helper.getObjectFromArray(charts, 'y', minY);

        return chart.chartId;
    };


    $('body').bind('turn', function(event, info){
        theApp.synchronizeOrientation.chartToDisplay = theApp.getCurrentChartDisplayedInViewport();
        theApp.synchronizeOrientation();
    });

    // Generic test method.
    theApp.onTestApp = function () {
        // TODO: Add code here.
    };

    // Repositories
    theApp.blackbird = loader.loadModule('blackbird');
    theApp.blackbird.toggle();
    theApp.blackbird.debug('Hey what\'s happened?');
    theApp.blackbird.debug(JSON.stringify(theApp));
});

