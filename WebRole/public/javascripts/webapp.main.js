// ------------------------------------------
// MAIN MOBILE WEB APP
// ------------------------------------------

// Initialize jQTouch.
var jQT = new $.jQTouch({
    addGlossToIcon: true,
    themeSelectionSelector: '#jqt #themes ul',
    useFastTouch: true,
    statusBar: 'default',
    hoverDelay: 10,
    pressDelay: 10,
    preloadImages: []
});

/* Use this for high compatibility (iDevice + Android)*/
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// Main functions:
Zepto(function ($) {
    var theApp = {},
        loader = WebAppLoader, // Alias
        output = loader.output,
        eventManager = loader.eventManager,
        siteUrls = loader.shared.settings.siteUrls,
        el = loader.shared.pageElements,
        lang = loader.shared.localizationManager.getLanguage() || {};

    // Te
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

    // Authentication
    theApp.auth = loader.loadModule('auth');

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onTimePeriodDataReceived', function (timePeriods) {
        theApp.repositories.timePeriodsSlot.setData(timePeriods);
    });

    // ------------------------------------------
    // TOOLBAR
    // ------------------------------------------
    theApp.toolbar = loader.loadModule('toolbar');

    theApp.toolbar.on('onClick', function () {
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
            { id: 'home', title: lang.tabbarHomeTitle, class: 'home' },
            { id: 'portfolios', title: lang.tabbarPortfolios, class: 'portfolios' },
            { id: 'analysis', title: lang.tabbarAnalysis, class: 'analysis' },
            { id: 'timePeriods', title: lang.tabbarTimePeriods, class: 'timeperiods' },
            { id: 'infos', title: lang.tabbarInfos, class: 'infos' },
            { id: 'more', title: lang.tabbarMore, class: 'more' }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onHomeTap', function () {
        // MobileApp.tabbar.hide();
        // MobileApp.tabbar.buttons[0].setDisabled(true);
        theApp.tabbar.getButton(0).setDisabled(true);
        theApp.tabbar.getButton(1).setBadgeText('99');
        theApp.tabbar.getButton(1).setDisabled(true);
        theApp.tabbar.getButton('infos').setDisabled(false);

        loader.shared.settings.set('test', 'test');
        // loader.loadModule('settings').set('test', 'test');
        loader.loadModule('test', { name: 'revolution' }).sayHello();

    });

    theApp.tabbar.on('onPortfoliosTap', function () {
        //MobileApp.slot.showPortfolios();
        theApp.spinningWheel.getSlot('portfolios').show('ADVISOR');
    });

    theApp.tabbar.on('onAnalysisTap', function () {
        // MobileApp.slot.showAnalysis();
        theApp.spinningWheel.getSlot('analysis').show();
    });

    theApp.tabbar.on('onTimePeriodsTap', function () {
        // MobileApp.slot.showTimePeriods();
        theApp.spinningWheel.getSlot('timePeriods').show();
    });

    theApp.tabbar.on('onInfosTap', function () {
        //        MobileApp.tabbar.getButton('home').setDisabled(false);
        //        MobileApp.tabbar.getButton(1).setDisabled(false);
        //        MobileApp.tabbar.getButton(1).setBadgeText('!');
        output.log(loader.shared.settings.get('test'));
        // loader.unloadModule('base64');
        output.log(loader.getInfo());
        jQT.goTo($('#portfolios'), 'pop');
    });

    theApp.tabbar.on('onMoreTap', function () {
        location.reload();
        // jQT.goTo($('#login'), 'cube');
    });

    // ------------------------------------------
    // SPINNING WHEEL
    // ------------------------------------------

    var slotConfig = {
        items: [
            { id: 'portfolios', repository: theApp.repositories.portfoliosSlot },
            { id: 'analysis', repository: theApp.repositories.analysisSlot },
            { id: 'timePeriods', repository: theApp.repositories.timePeriodsSlot }
        // { id: 'test', repository: { getData: function (callback) { callback({ a: 'a', b: 'b' }); } }}
        ]
    };

    theApp.spinningWheel = loader.loadModule('spinningWheel');
    theApp.spinningWheel.create(slotConfig);

    theApp.spinningWheel.on('onPortfoliosDone', function (key) {
        // theApp.updateTabBar(key);
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

    theApp.auth.on('onLoginSuccess', function () {
        theApp.nav.goToPage($(el.homePage), 'dissolve');
        // theApp.tabbar.show();
        // theApp.updateTabBar();
        theApp.portfolioManager.selectPortfolio();
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

    // ------------------------------------------
    // EVENTS
    // ------------------------------------------

    // Login
    $(el.loginButton).on('tap', function () {
        var username, password;

        // Obtain the username and password from the form.
        username = $(el.userNameTextbox).val();
        password = $(el.passwordTextbox).val();

        theApp.auth.doLogin(username, password, siteUrls.autenticate);
    });

    // Unload modules from the loader after they have been loaded by the app.
    loader.unloadModule('repositories');
    loader.unloadModule('scroll');
    loader.unloadModule('tabbar'); // Unload the webApp tabbar.
    loader.unloadModule('spinningWheel');

    //    function selectTabbarItem(item) {
    //        var tabbarItem = $('#' + item + '_tabbar');
    //        $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
    //        $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
    //    }

});