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
    pressDelay              : 10,
    preloadImages           : [
        'stylesheets/sw-slot-border.png',
        'stylesheets/sw-alpha.png',
        'stylesheets/sw-button-cancel.png',
        'stylesheets/sw-button-done.png',
        'stylesheets/sw-header.png'
    ]
});

// Main functions:
Zepto(function ($) {

    var theApp = {},
        loader = WebAppLoader, // Alias
        output = loader.getConsole(),
        eventManager = loader.getEventManager(),
        helper = loader.loadModule('helper'),
        siteUrls = loader.getSharedModule('settings').siteUrls,
        el = loader.getSharedModule('pageElements'),
        lang = loader.getSharedModule('localizationManager').getLanguage() || {};

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

    // ------------------------------------------
    // LAST ANALYSIS DATA OBJECT
    // ------------------------------------------

    theApp.getLastAnalysisObjectUsed = function () {
        return theApp.lastAnalysisObjectUsed;
    };

    theApp.setLastAnalysisObjectUsed = function (obj) {
        for (property in obj) {
            if (theApp.lastAnalysisObjectUsed.hasOwnProperty(property)) {
                theApp.lastAnalysisObjectUsed[property] = obj[property];
            }
        }
    };

    theApp.tryToChangeLanguage = function (language) {
        var currentLanguage = helper.getURLParameter('lang') || 'en-US';

        if (language && currentLanguage && (language.toLowerCase() !== currentLanguage.toLowerCase())) {
            theApp.nav.reloadApp('?lang=' + language);
        }
    }

    // ------------------------------------------
    // THE MAIN ENTRY POINT (Before Login)
    // ------------------------------------------

    theApp.startHere = function () {
        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = {},
            lastLoggedOnUser = '',
            language = '',
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

            if (username !== '') {
                theApp.tryToChangeLanguage(language);
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
            theApp.goToLoginPage();
        }
    }

    theApp.doLogin = function (username, password) {
        theApp.lastUsernameUsed = username.toLowerCase();
        theApp.lastPasswordUsed = password;
        theApp.auth.doLogin(username, password, siteUrls.authenticate);
    };

    theApp.goToLoginPage = function (username) {
        theApp.tabbar.hide();

        // Set the field's value.
        $(el.userNameTextbox).val(username || '');

        // Show the login page.
        setTimeout(function () {
            theApp.nav.goToPage($(el.loginPage), 'dissolve');
        }, 1000);
    }

    // ------------------------------------------
    // INIT APP (After Login)
    // ------------------------------------------

    theApp.init = function () {
        var lastLoggedOnUser = '',
            automaticLogin = false,
            analysisDataObject = {};

        theApp.nav.goToPage($(el.startupPage), 'dissolve');
        theApp.tabbar.show();

        //    - Update  with the current username [and password] the user settings data object
        //      and the lastLoggedOnUser property of app settings.

        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        appSettingsData.lastLoggedOnUser = theApp.lastUsernameUsed;
        theApp.settings.saveData('appSettings');

        userSettingsData.username = theApp.lastUsernameUsed;
        userSettingsData.password = theApp.lastPasswordUsed;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        automaticLogin = helper.getValueAs(userSettingsData.automaticLogin, 'boolean');

        //  TODO:
        //    - If the current user and the last logged on user are different clear
        //      the revolution shared space in the local storage.
        //
        //    - Init the localizationManager using the user language (or the default one).
        //    - Init the themeManager using the last theme used (or the default one).        
        var lastThemeUsed = theApp.themesManager.loadData('theme', theApp.lastUsernameUsed);
        theApp.themesManager.switchStyle(lastThemeUsed);

        //
        //    - Load the favourites and fill the favourites slot.
        //    - Load the analysis settings (page and charts) and fill the analysis slot. 
        //      NB: storing the analysis settings is important because we reuse them later!
        //
        var lastAnalysisObjectUsed = userSettingsData.lastAnalysisObjectUsed || null;

        //    - Try to retrieve the last analysisDataObject used. This should contain:
        //          - id analysis page
        //          - id portfolio
        //          - id time periods
        //          - ?!? id last chart viewed ?!? or the first available.
        //    - If this information is not available try to retrieve it from
        //          - the favourites
        //            OR
        //          - the default or the last or the most viewed portfolio code
        //          - the default analysis page code
        //          - the default time periods code
        //
        //    - When this information is available call updateAnalysisPage({analysisDataObject})
        theApp.updateSettingsPage({ email: theApp.lastUsernameUsed, automaticLogin: automaticLogin });
        theApp.analysisManager.update(theApp.lastUsernameUsed);
        theApp.favouritesManager.update(theApp.lastUsernameUsed);
        theApp.updateAnalysisPage(lastAnalysisObjectUsed);
    };

    theApp.updateAnalysisPage = function (analysisDataObjectValue) {
        // theApp.portfolioManager.loadPortfolio(analysisDataObject.portfolioId);
        var analysisDataObject = analysisDataObjectValue || theApp.getLastAnalysisObjectUsed();

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        theApp.nav.goToPage($(el.analysisPage), 'dissolve');
        theApp.mask.show('analysis');

        // TODO: 
        // Get analysis name and timeperiods name from respective ids and select 
        // the right spinning wheel.

        function renderAnalysisPage(portfolio) {
            var chartsToRender = [],
                analysisPagesData = {},
                analysisPage = {},
                portfolioId = portfolio.code,
                portfolioName = portfolio.name,
                analysisPageCharts = null,
                portfolioName = portfolio.name,
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

            // Add the currently requested time period to each of the chart config objects.
            $.each(chartsToRender, function (index, chart) {
                chart.timePeriodId = analysisDataObject.timePeriodId;
            });

            // Loop around the provided time periods for the portfolio,
            // and get hold of the start and end date for that particular
            // period, breaking the loop when found.
            $.each(portfolio.timePeriods, function (index, period) {
                var startDate, endDate;

                if (period.code === analysisDataObject.timePeriodId) {
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
        // TODO: Add code here to save in the user space the last analysis object used.
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.lastAnalysisObjectUsed = theApp.getLastAnalysisObjectUsed();
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
    };

    theApp.chartComponents.on('onAllChartsLoaded', function () {
        theApp.scroll.rebuild('analysis');
        theApp.mask.updateAnalysisText(' ');
        theApp.mask.hide('analysis');
    });

    theApp.chartComponents.on('onChartsLoading', function (chartCount, chartTotal) {
        theApp.mask.updateAnalysisText('Loading ' + chartCount + ' of ' + chartTotal);
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
                }
            });

        theApp.analysisSettingsPage.create(analysisPages);
    };

    theApp.analysisSettingsPage.on('onClick', function (analysisId) {
        theApp.nav.goToPage(el.chartSettingsPage, 'slideup');
        theApp.showChartSettingsPage(analysisId);
    });

    theApp.analysisSettingsPage.on('onPageLoaded', function () {
        // containerId, label, callback, autoRemove, buttonClass
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
        // alert(userPageId);
    }

    theApp.showChartSettingsPage = function (analysisId) {
        var analysisPagesData = {},
            chartComponentsData = {},
            analysisPage = {},
            charts = theApp.showChartSettingsPage.charts;

        if (!analysisId) return; // TODO: Add a message error.

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        chartComponentsData = theApp.chartComponents.getData('charts');

        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', analysisId)
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    charts: record.charts
                }
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
        theApp.scroll.rebuild('analysis');
        theApp.updateAnalysisInfo(data);
        theApp.mask.hide('analysis');
        theApp.tabbar.show();
    });

    theApp.portfolioManager.on('onFailed', function (message) {
        theApp.scroll.rebuild('error');
        $(el.errorMessageText).html(message);
        theApp.nav.goToPage($(el.errorPage));
        theApp.mask.hide('analysis');
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
        toolbarId: '#analysis .toolbar',  // el.tabbar,
        buttonPrefix: 'toolbar_btn',
        visible: true,
        items: [
            { id: 'favourite', title: lang.tabbar.favourites, class: 'favourite' }
        // { id: 'favourite2', title: lang.tabbar.favourites, class: 'favourite' }
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

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------
    /* 
    theApp.lastAnalysisObjectUsed = {
    portfolioId: '',
    portfolioName: '',
    analysisId: 'performances',
    analysisName: 'Performances',
    timePeriodId: 'Earliest',
    timePeriodName: 'Earliest',
    chartId : 'performance_bar',
    timeStamp: ''
    };    
    
    */
    var tabbarConfig = {
        tabbarId: el.tabbar,
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
        // { id: 'home', title: lang.tabbar.home, class: 'home' },
            {id: 'favourites', title: lang.tabbar.favourites, class: 'favourites' },
            { id: 'portfolios', title: lang.tabbar.portfolios, class: 'portfolios' },
            { id: 'analysis', title: lang.tabbar.analysis, class: 'analysis' },
            { id: 'timePeriods', title: lang.tabbar.timePeriods, class: 'timeperiods' },
        // { id: 'infos', title: lang.tabbar.infos, class: 'infos' },
        // { id: 'more', title: lang.tabbar.more, class: 'more' }
            {id: 'settings', title: lang.tabbar.settings, class: 'settings', highlight: true }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

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
            // theApp.updateAnalysisPage();
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
        $(el.loginErrorText).html(message)
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
        theApp.scroll.rebuild('settings');
        output.log('onSettingsStart');
    });

    theApp.pageEventsManager.on('onSettingsEnd', function () {
        // theApp.scroll.rebuild('settings');
        output.log('onSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisSettingsEnd', function () {
        theApp.scroll.rebuild('analysisSettings');
        output.log('onAnalysisSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisPagesSettingsStart', function () {
        theApp.scroll.rebuild('analysisPagesSettings');
        theApp.showAnalysisSettingsPage();
        output.log('onAnalysisPagesSettingsStart');
    });

    theApp.pageEventsManager.on('onChartSettingsEnd', function () {
        // theApp.scroll.rebuild('chartSettings');
        // TODO: focus() doesn't work on iOS...
        setTimeout(function () {
            $(el.analysisPageNameTextbox).focus();
        }, 200);

        output.log('onChartSettingsStart');
    });

    // ------------------------------------------
    // EVENTS
    // ------------------------------------------

    $('#reloadApp').on('click', function () {
        theApp.localStorage.clearAll();
        theApp.nav.reloadApp();
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
                }
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
                }
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
    }

    // ------------------------------------------
    // THEMES MANAGER
    // ------------------------------------------

    theApp.themesManager = loader.loadModule('themesManager');

    theApp.themesManager.on('onThemeChanged', function (themeName) {
        // theApp.scroll.rebuild('analysis');
        // $(el.analysisPage + '_partial').html(data);
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
        // theApp.scroll.rebuild('analysis');
        $(el.analysisPage + '_partial').html(data);
    });

    // ------------------------------------------
    // TEST PAGE
    // ------------------------------------------

    theApp.localStorage = loader.loadModule('localStorageManager');

    $('#btnTestSaveToLS').on('click', function () {
        var analysisPages = {
            items: [{
                name: 'Contribution',
                userDefined: false,
                charts: [{
                    name: 'barChart1'
                }, {
                    name: 'barChart2'
                }]
            }, {
                name: 'My Analysis',
                userDefined: true,
                charts: [{
                    name: 'lineChart1'
                }, {
                    name: 'lineChart2'
                }]
            }]
        };

        theApp.localStorage.save('analysisPages', analysisPages);
        theApp.localStorage.save('number', 75);
        theApp.localStorage.save('boolean', false);
        theApp.localStorage.save('date', new Date);
    });

    $('#btnLoadFromLS').on('click', function () {
        output.log('Loaded:', theApp.localStorage.load('analysisPages'));
        output.log('Loaded:', theApp.localStorage.load('number'));
        output.log('Loaded:', theApp.localStorage.load('boolean'));
        output.log('Loaded:', theApp.localStorage.load('date'));
    });

    $('#btnItemsCountLS').on('click', function () {
        theApp.localStorage.count();
    });

    $('#btnTestClearAllLS').on('click', function () {
        // theApp.localStorage.clearAll();
        theApp.localStorage.remove('analysisPages');
        theApp.localStorage.remove('number');
        theApp.localStorage.remove('boolean');
        theApp.localStorage.remove('date');
    });

    // ------------------------------------------
    // TEARDOWN
    // ------------------------------------------

    // Unload modules from the loader after they have been loaded by the app.
    loader.unloadModule('repositories');
    loader.unloadModule('scroll');
    loader.unloadModule('tabbar');
    loader.unloadModule('spinningWheel');

    //    function selectTabbarItem(item) {
    //        var tabbarItem = $('#' + item + '_tabbar');
    //        $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
    //        $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
    //    }

    theApp.startHere();
});

    /* ----------------------- ON/OFF ----------------------- /
       
       
         // Time Stamp getter/setter
        _timeStamp: '',
        get timeStamp() {
            return this._timeStamp;
        },
        set timeStamp(value) {
            this._timeStamp = value;
        }    
    
    
    // ------------------------------------------------------ */
