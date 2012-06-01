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

    var theApp       = {},
        loader       = WebAppLoader, // Alias
        output       = loader.getConsole(),
        eventManager = loader.getEventManager(),
        helper       = loader.loadModule('helper'),
        siteUrls     = loader.getSharedModule('settings').siteUrls,
        el           = loader.getSharedModule('pageElements'),
        lang         = loader.getSharedModule('localizationManager').getLanguage() || {};

    // Test log method.
    output.log('Hello from Dan & Asa!');

    theApp.lastUsernameUsed = '';
    theApp.lastPasswordUsed = '';
    theApp.lastPortfolioIdUsed = '';

    // Default settings.
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

    // ------------------------------------------
    // LAST ANALYSIS DATA OBJECT
    // ------------------------------------------

    theApp.getLastAnalysisObjectUsed = function() {
        return theApp.lastAnalysisObjectUsed;
    };

    theApp.setLastAnalysisObjectUsed = function(obj) {
        for(property in obj) {
            if (theApp.lastAnalysisObjectUsed.hasOwnProperty(property)) {
                theApp.lastAnalysisObjectUsed[property] = obj[property];   
            }
        }
    };
    
    // ------------------------------------------
    // THE MAIN ENTRY POINT (Befor Login)
    // ------------------------------------------

    theApp.startHere = function () {
        var appSettingsData     = theApp.settings.loadData('appSettings'),
            userSettingsData    = {}, 
            lastLoggedOnUser    = '',
            username            = '',
            password            = '';
            
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

    theApp.doLogin = function(username, password) {
        theApp.lastUsernameUsed = username.toLowerCase();
        theApp.lastPasswordUsed = password;
        theApp.auth.doLogin(username, password, siteUrls.authenticate);
    };

    theApp.goToLoginPage = function (username) {
        theApp.tabbar.hide();

        // Set the fields value.
        $(el.userNameTextbox).val(username || '');
        //$(el.passwordTextbox).val('');

        // Show the login page
        setTimeout(function (){
            theApp.nav.goToPage($(el.loginPage), 'dissolve');
        }, 1000);
    }

    // ------------------------------------------
    // INIT APP (After Login)
    // ------------------------------------------

    theApp.init = function () {
        var lastLoggedOnUser = '',
            analysisDataObject = {};

        theApp.nav.goToPage($(el.startupPage), 'dissolve');
        theApp.tabbar.show();

        //    - Update  with the current username [and password] the user settings data object
        //      and the lastLoggedOnUser property of app settings.

        var appSettingsData     = theApp.settings.loadData('appSettings'),
            userSettingsData    = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);
        
        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;
        
        appSettingsData.lastLoggedOnUser =  theApp.lastUsernameUsed;
        theApp.settings.saveData('appSettings');

        userSettingsData.username = theApp.lastUsernameUsed;
        userSettingsData.password = theApp.lastPasswordUsed;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

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

        theApp.analysisManager.update(theApp.lastUsernameUsed);
        theApp.favouritesManager.update(theApp.lastUsernameUsed);
        theApp.updateAnalysisPage();
    };

    theApp.updateAnalysisPage = function(analysisDataObjectValue) {
        // theApp.portfolioManager.loadPortfolio(analysisDataObject.portfolioId);
        var analysisDataObject = analysisDataObjectValue || theApp.getLastAnalysisObjectUsed();

        theApp.nav.goToPage($(el.analysisPage), 'dissolve');
        theApp.mask.show('analysis');
        
        // TODO: 
        // Get analysis name and timeperiods name from respective ids and select 
        // the right spinning wheel.

        function renderAnalysisPage (portfolio) {
            var chartsToRender      = [], 
                analysisPagesData   = {},
                analysisPage        = {},
                portfolioId         = portfolio.code,
                portfolioName       = portfolio.name;

            analysisPagesData = theApp.analysisManager.getData('analysisPages');

            analysisPage = jLinq.from(analysisPagesData.items)
                .equals('id', analysisDataObject.analysisId)
                .select();

            chartsToRender = jLinq.from(analysisPage[0].charts)
                .sort('order')
                .select();

            $(el.analysisTitle).html(analysisPage[0].name);

            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.setLastAnalysisObjectUsed({ 
                portfolioId: portfolioId, 
                portfolioName: portfolioName 
                });
            theApp.lastPortfolioIdUsed = portfolioId;
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
    };

    theApp.chartComponents.on('onAllChartsLoaded', function(){
        theApp.mask.updateAnalysisText(' ');
        theApp.mask.hide('analysis');    
    });

    theApp.chartComponents.on('onChartsLoading', function(chartCount, chartTotal){
        theApp.mask.updateAnalysisText('Loading ' + (chartCount) + ' of ' +  chartTotal);
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
        theApp.nav.goToPage(el.chartSettingsPage);
        theApp.showChartSettingsPage(analysisId);
    });

    theApp.showChartSettingsPage = function (analysisId) {
        var analysisPagesData    = {}, 
            chartComponentsData  = {},
            analysisPage         = {},
            charts               = theApp.showChartSettingsPage.charts;
        
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
        if(charts.length === 0){
            for (var chart in chartComponentsData) {
                charts.push({
                    chartId: chartComponentsData[chart].chartId,
                    chartType: chartComponentsData[chart].chartType,
                    chartTitle: chartComponentsData[chart].chartId // chartTitle
                });
            }

            theApp.chartSettingsPage.create(charts);
        }
        
        theApp.chartSettingsPage.update(analysisPage);
    };

    theApp.chartSettingsPage.on('onSettingsChanged', function(updatedAnalysisPage){
        var analysisPage, analysisPagesData;

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
    });

    // Memoization pattern.
    theApp.showChartSettingsPage.charts = [];

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onPortfolioLoaded', function (portfolio) {
        // When a new portfolio is loaded update timeperiods and analysis slots.
        theApp.repositories.timePeriodsSlot.setData(portfolio.timePeriods);
        output.log('Loaded portfolio:', portfolio);
    });

    theApp.portfolioManager.on('onAnalysisReceived', function (data) {
        theApp.scroll.rebuild('analysis');
        $(el.analysisPage + '_partial').html(data);
        
        theApp.nav.goToPage($(el.analysisPage), 'dissolve');
        theApp.tabbar.show();
    });

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
        if(isSelected) {
            theApp.addToFavourites();
        } else {
            theApp.removeFromFavourites();
        }
    });

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------

    var tabbarConfig = {
        tabbarId: el.tabbar,
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
         // { id: 'home', title: lang.tabbar.home, class: 'home' },
            { id: 'favourites', title: lang.tabbar.favourites, class: 'favourites' },
            { id: 'portfolios', title: lang.tabbar.portfolios, class: 'portfolios' },
            { id: 'analysis', title: lang.tabbar.analysis, class: 'analysis' },
            { id: 'timePeriods', title: lang.tabbar.timePeriods, class: 'timeperiods' },
         // { id: 'infos', title: lang.tabbar.infos, class: 'infos' },
         // { id: 'more', title: lang.tabbar.more, class: 'more' }
            { id: 'settings', title: lang.tabbar.settings, class: 'settings' }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onFavouritesTap', function () {
        theApp.spinningWheel.getSlot('favourites').show();
    });

    theApp.tabbar.on('onPortfoliosTap', function () {
        theApp.spinningWheel.getSlot('portfolios').show(theApp.lastPortfolioIdUsed); //'ADVISOR');
    });

    theApp.tabbar.on('onAnalysisTap', function () {
        theApp.spinningWheel.getSlot('analysis').show();
    });

    theApp.tabbar.on('onTimePeriodsTap', function () {
        theApp.spinningWheel.getSlot('timePeriods').show();
    });

    theApp.tabbar.on('onSettingsTap', function () {
        theApp.nav.goToPage($(el.settingsPage), 'flip');
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
         // { id: 'test', repository: { getData: function (callback) { callback({ a: 'a', b: 'b' }); } }}
        ]
    };

    theApp.spinningWheel = loader.loadModule('spinningWheel');
    theApp.spinningWheel.create(slotConfig);

    theApp.spinningWheel.on('onPortfoliosDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ portfolioId: key, portfolioName: value});
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onAnalysisDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ analysisId: key, analysisName: value });
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

    theApp.auth.on('onLoginFailed', function (response) {
        output.log('onLoginFailed response: ', response);
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

//    theApp.pageEventsManager.on('onPortfoliosEnd', function () {
//        $.post(siteUrls.portfolios, function (data) {
//            theApp.scroll.rebuild('portfolios');
//            $(el.portfoliosPage + '_partial').html(data);
//        });
//        output.log('onPortfoliosEnd');
//    });

    theApp.pageEventsManager.on('onEulaEnd', function () {
        $.get(siteUrls.eula, function (data) {
            theApp.scroll.rebuild('eula');
            $(el.eulaPage + '_partial').html(data);
        }, 'xml');
        output.log('onEulaEnd');
    });

    theApp.pageEventsManager.on('onAnalysisEnd', function () {
        theApp.scroll.rebuild('analysis');
        output.log('onAnalysisEnd');
    });

    theApp.pageEventsManager.on('onSettingsStart', function () {
        // theApp.scroll.rebuild('settings');
        output.log('onSettingsStart');
    });

    theApp.pageEventsManager.on('onSettingsEnd', function () {
        theApp.scroll.rebuild('settings');
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

    // ------------------------------------------
    // EVENTS
    // ------------------------------------------

    $('#reloadApp').on('click', function () {
        theApp.localStorage.clearAll();
        theApp.nav.reloadApp();
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
    
    // NOTA BENE: the analysis manager is updated the first time when the home
    // page is loaded.
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
        var favourite           = null,
            favouriteToCheck    = null,
            favouritesData      = theApp.favouritesManager.getData('favourites');

        if(!favouriteId){
            favourite = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
            favouriteId = favourite.favouriteId;
        }

        favouriteToCheck = jLinq.from(favouritesData.items)
            .equals('favouriteId', favouriteId)
            .select()[0] || null;

        return (favouriteToCheck && true);
    };
    
    theApp.addToFavourites = function () {
        var favouriteToAdd = {},
            favouritesData = null;

        favouriteToAdd = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToAdd) {
            if(!theApp.favouriteExists(favouriteToAdd.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                favouritesData.items.push(favouriteToAdd);
                theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                theApp.favouritesManager.update(theApp.lastUsernameUsed);
            }
        }
    };

    theApp.removeFromFavourites = function () {
        var favouriteToRemove   = {},
            favouritesData      = null;
 
        favouriteToRemove = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToRemove) {
            if(theApp.favouriteExists(favouriteToRemove.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                if (helper.removeObjectFromArray(favouritesData.items, 'favouriteId', favouriteToRemove.favouriteId)) {
                    theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                    theApp.favouritesManager.update(theApp.lastUsernameUsed);
                }
            }
        }
    };
    
    // - favouriteId [optional]
    theApp.synchronizeFavouriteButton = function(favouriteId) {
        var favouriteButton = theApp.toolbar.getButton('favourite');

        if(theApp.favouriteExists(favouriteId) && favouriteButton) {
            favouriteButton.select();
        } else {
            favouriteButton.deselect();
        }
    };

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
                name        : 'Contribution',
                userDefined : false,
                charts      : [{
                        name: 'barChart1'
                    },{
                        name: 'barChart2'
                    }] 
            },{
                name        : 'My Analysis',
                userDefined : true,
                charts      : [{
                        name: 'lineChart1'
                    },{
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
