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

/* Use this for high compatibility (iDevice + Android)*/
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// Main functions:
Zepto(function ($) {
    var theApp          = {},
        loader          = WebAppLoader, // Alias
        output          = loader.getConsole(),
        eventManager    = loader.getEventManager(),
        siteUrls        = loader.getSharedModule('settings').siteUrls,
        el              = loader.getSharedModule('pageElements'),
        lang            = loader.getSharedModule('localizationManager').getLanguage() || {};

    // Test log method.
    output.log('Hello from Dan & Asa!');

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

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onTimePeriodDataReceived', function (timePeriods) {
        // $('#myLoadingCharts').hide();
        // .css("display", "none");
        theApp.repositories.timePeriodsSlot.setData(timePeriods);
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
            // {id: 'more', title: lang.tabbarMore, class: 'more' }
            {id: 'settings', title: lang.tabbarSettings, class: 'settings' }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onHomeTap', function () {
        
            window.location = './'; // TODO: Move this code in webapp.nav.
            return false;
        
        /* ----------------------- ON/OFF ----------------------- /
        
        theApp.tabbar.getButton(0).setDisabled(true);
        theApp.tabbar.getButton(1).setBadgeText('99');
        theApp.tabbar.getButton(1).setDisabled(true);
        theApp.tabbar.getButton('infos').setDisabled(false);

        loader.unloadModule('it_IT');
        console.log(loader.getInfo());

        loader.loadModule('test').sayHello();
        loader.loadModule('test').sayHello();

        var test = loader.loadModule('test');
        test.sayHello();

        loader.unloadModule('test');
        test.sayHello();
        loader.loadModule('test').sayHello();

        test = loader.loadModule('test');
        test.sayHello();

        test = loader.reloadModule('test');
        test.sayHello();

        // ------------------------------------------------------ */

    });

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

    theApp.tabbar.on('onInfosTap', function () {
        output.log(loader.getInfo());
        jQT.goTo($('#portfolios'), 'pop');
    });

    theApp.tabbar.on('onMoreTap', function () {
        location.reload();
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


    // ------------------------------------------
    // PORTFOLIOS LIST
    // ------------------------------------------

    theApp.portfoliosList = loader.loadModule('portfoliosList');

    theApp.portfoliosList.on('onDataReceived', function (data) {
        theApp.scroll.rebuild('analysis');
        $(el.analysisPage + '_partial').html(data);
    });

    // ------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------

    theApp.auth = loader.loadModule('auth');

    theApp.auth.on('onLoginSuccess', function (portfolioTotal) {
        theApp.nav.goToPage($(el.homePage), 'dissolve');
        // theApp.nav.goToPage($(el.portfolioAnalysisPage), 'dissolve');
        // theApp.mask.show('analysis');

        theApp.portfolioManager.selectPortfolio();
        
        if (portfolioTotal) {
            theApp.tabbar.getButton('portfolios').setBadgeText(portfolioTotal);
        }
    });

    theApp.auth.on('onLoginFailed', function (response) {
        output.log('onLoginFailed response: ', response);
    });

    // ------------------------------------------
    // PAGE EVENTS
    // ------------------------------------------

    theApp.pageEventsManager = loader.loadModule('pageEventsManager');

    theApp.pageEventsManager.on('onLoginStart', function () {
        theApp.tabbar.hide();
        output.log('onLoginStart');
    });

    theApp.pageEventsManager.on('onHomeEnd', function () {
        theApp.tabbar.show();
        theApp.scroll.rebuild('home');
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
        output.log('onAnalysisEnd');
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

    // Login
    $(el.loginButton).on('tap', function () {
        var username, password;

        // Obtain the username and password from the form.
        username = $(el.userNameTextbox).val();
        password = $(el.passwordTextbox).val();

        theApp.auth.doLogin(username, password, siteUrls.authenticate);
    });

        // Login
    $('#reloadApp').on('tap', function () {
        window.location = './'; // TODO: Move this code in webapp.nav.
        return false;
    });

    // Test
    $('#showSlot').on('tap', function () {
        //theApp.tabbar.hide();
        //theApp.tabbar.show();
        //        //alert('click');
        //        // $('optgroup[label="Line Charts"]').children('option:first').val()
        //        //alert($('#lol').val('1'));
        //        //alert($('optgroup[label="Line Charts"]').children('option:first').val());
        //        var $selectdrop = $('#lol');
        //        $selectdrop.change(function () {
        //            // $('.panels>div').hide();
        //            // $('#' + $selectdrop.val()).show();
        //            // alert();
        //        }).trigger('change');

        //        //$('#lol').tap();
        //        //$('optgroup[label="Line Charts"]').show();
    });

    $('#lol').on('change', function () {
//        theApp.tabbar.hide();
//        //theApp.tabbar.show();
//        function showTabbar() {
//            theApp.tabbar.show();
//            clearTimeout(t);
//        }
//        var t = setTimeout(showTabbar, 1000);

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

});
