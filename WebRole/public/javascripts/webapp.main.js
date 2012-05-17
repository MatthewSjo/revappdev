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
    preloadImages           : []
});

// Main functions:
Zepto(function ($) {

    var theApp = {},
        loader = WebAppLoader, // Alias
        output = loader.getConsole(),
        eventManager = loader.getEventManager(),
        siteUrls = loader.getSharedModule('settings').siteUrls,
        el = loader.getSharedModule('pageElements'),
        lang = loader.getSharedModule('localizationManager').getLanguage() || {};

    // Test log method.
    output.log('Hello from Dan & Asa!');

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

    // ------------------------------------------
    // THE MAIN ENTRY POINT
    // ------------------------------------------

    theApp.startHere = function () {
        var appSettings = theApp.settings.getData('appSettingsData');
        var userSettings = theApp.settings.getData('userSettingsData');
        // var userSettingsDataObject = theApp.settings.getDataObject('userSettingsData');
        // var appSettingsDataObject = theApp.settings.getDataObject('appSettingsData');
        var lastLoggedOnUser = appSettings.lastLoggedOnUser;
        
        // userSettingsDataObject.set('username', 'daniel.attfield@statpro.com');
        theApp.settings.saveData('userSettingsData', lastLoggedOnUser);
        theApp.settings.loadData('userSettingsData', lastLoggedOnUser);
        
        theApp.settings.saveData('appSettingsData');
        // theApp.nav.goToPage($(el.homePage), 'dissolve');
        theApp.nav.goToPage($(el.portfolioAnalysisPage), 'dissolve');
        // theApp.mask.show('analysis');

        theApp.portfolioManager.selectPortfolio();
        
//        if (portfolioTotal) {
//            theApp.tabbar.getButton('portfolios').setBadgeText(portfolioTotal);
//        }        
    
    }

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onPortfolioLoaded', function (portfolio) {
        // When a new portfolio is loaded update timeperiods and analysis slots.
        theApp.repositories.timePeriodsSlot.setData(portfolio.timePeriods);
        theApp.portfolioManager.getAnalysis(portfolio.analysisLink);
        output.log('Loaded portfolio:', portfolio);
    });

    theApp.portfolioManager.on('onAnalysisReceived', function (data) {
        theApp.scroll.rebuild('analysis');
        $(el.analysisPage + '_partial').html(data);
        theApp.nav.goToPage($(el.analysisPage), 'dissolve');
    });

    // ------------------------------------------
    // TOOLBAR
    // ------------------------------------------

    theApp.toolbar = loader.loadModule('toolbar');

    theApp.toolbar.on('onTap', function () {
        theApp.scroll.goUp();
    });

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------

    var tabbarConfig = {
        tabbarId: el.tabbar,
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
         // { id: 'home', title: lang.tabbarHomeTitle, class: 'home' },
            { id: 'favourites', title: lang.tabbarFavouritesTitle, class: 'favourites' },
            { id: 'portfolios', title: lang.tabbarPortfolios, class: 'portfolios' },
            { id: 'analysis', title: lang.tabbarAnalysis, class: 'analysis' },
            { id: 'timePeriods', title: lang.tabbarTimePeriods, class: 'timeperiods' },
         // { id: 'infos', title: lang.tabbarInfos, class: 'infos' },
         // { id: 'more', title: lang.tabbarMore, class: 'more' }
            { id: 'settings', title: lang.tabbarSettings, class: 'settings' }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onFavouritesTap', function () {
        theApp.spinningWheel.getSlot('favourites').show();
    });

    theApp.tabbar.on('onPortfoliosTap', function () {
        theApp.spinningWheel.getSlot('portfolios').show('ADVISOR');
    });

    theApp.tabbar.on('onAnalysisTap', function () {
        theApp.spinningWheel.getSlot('analysis').show();
    });

    theApp.tabbar.on('onTimePeriodsTap', function () {
        theApp.spinningWheel.getSlot('timePeriods').show();
    });

    theApp.tabbar.on('onSettingsTap', function () {
        theApp.nav.goToPage($(el.settingsPage), 'dissolve');
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

    theApp.spinningWheel.on('onPortfoliosDone', function (key) {
        $('#myLoadingCharts').show();
        theApp.portfolioManager.selectPortfolio(key);
    });

    theApp.spinningWheel.on('onAnalysisDone', function (key) {
        // $('#myLoadingCharts').show();
        // theApp.portfolioManager.selectPortfolio(key);
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

        theApp.auth.doLogin(username, password, siteUrls.authenticate);
    });

    theApp.auth.on('onLoginSuccess', function (portfolioTotal) {
        // theApp.startHere();
    });

    theApp.auth.on('onLoginFailed', function (response) {
        // theApp.startHere();
        output.log('onLoginFailed response: ', response);
    });

    // ------------------------------------------
    // PAGE EVENTS
    // ------------------------------------------

    theApp.pageEventsManager = loader.loadModule('pageEventsManager');
    
    theApp.pageEventsManager.on('onStartupStart', function () {
        //theApp.startHere();
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
        theApp.analysisManager.update();
        theApp.scroll.rebuild('home');
        // theApp.mask.show('analysis');
        output.log('onHomeEnd');
    });

    theApp.pageEventsManager.on('onPortfoliosEnd', function () {
        $.post(siteUrls.portfolios, function (data) {
            theApp.scroll.rebuild('portfolios');
            $(el.portfoliosPage + '_partial').html(data);
        });
        output.log('onPortfoliosEnd');
    });

    theApp.pageEventsManager.on('onEulaEnd', function () {
        $.get(siteUrls.eula, function (data) {
            theApp.scroll.rebuild('eula');
            $(el.eulaPage + '_partial').html(data);
        }, 'xml');
        output.log('onEulaEnd');
    });

    theApp.pageEventsManager.on('onAnalysisEnd', function () {
        if (!theApp.dashboard) {
            theApp.dashboard = loader.loadModule('dashboard');
        }

        theApp.dashboard.on('onAnalysisLoaded', function () {
            // theApp.mask.show('analysis');
            theApp.scroll.rebuild('analysis');
        });

        theApp.dashboard.load();
        // theApp.mask.hide('analysis');
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

    // ------------------------------------------
    // EVENTS
    // ------------------------------------------

    $('#reloadApp').on('click', function () {
        theApp.nav.reloadApp();
    });

    // ------------------------------------------
    // ANALYSIS MANAGER
    // ------------------------------------------

    theApp.analysisManager = loader.loadModule('analysisManager');
    
    // NOTA BENE: the analysis manager is updated the first time when the home
    // page is loaded.
    theApp.analysisManager.on('onUpdated', function (analysisPage) {
        theApp.localStorage.save('analysisPages', analysisPages);

        var analysisSlotItems = jLinq.from(analysisPage.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.name,
                    code: record.id
                }
            });
        
        theApp.repositories.analysisSlot.setData(analysisSlotItems);
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
        theApp.scroll.rebuild('analysis');
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
