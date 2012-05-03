// ------------------------------------------
// MAIN MOBILE APP
// ------------------------------------------

// Main variables.
var MobileApp = {}, // Main app namespace
    webApp = WebAppLoader; // Alias   

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

MobileApp = (function () {
    var mobileApp = {};

    var appSettings = {
        disableLog: false,
        loadPortfoliosSlotDataOnce: true
    };

    var appRepository = {
        timePeriodsSlotItems: null
    };

    var appState = {
        portfoliosListChanged: false // Future uses. Setting this flag to true will force to reload portfolios.
    };

    // URLs.
    var siteUrls = {
        portfolios: '/portfolios',
        autenticate: '/authenticate',
        index: '/index',
        portfolioAnalysis: '/portfolioAnalysis',
        analysis: '/analysis',
        eula: '/eula'
    };

    // App pages.
    var appPages = {
        blank: '#blank_page',
        dashboard: '#dashboard',
        home: '#home',
        portfolios: '#portfolios',
        portfolioAnalysis: '#portfolioAnalysis',
        analysis: '#analysis',
        eula: '#eula'
    };

    var appElements = {
        portfolioAnalysisLink: '.defaultAnalysisLink',
        toolbar: '.toolbar',
        loginButton: '#loginButton',
        loadingMask: '#myloading',
        userNameTextbox: '#userNameTextbox',
        passwordTextbox: '#passwordTextbox'
    };

    // Analysis types.
    var analysisTypes = {
        dashboard: 'Dashboard',
        performances: 'Performances',
        risk: 'Risk',
        assetAllocation: 'Asset Allocation',
        contribution: 'Contribution',
        attribution: 'Attribution',
        fixedIncome: 'FixedIncome',
        balanced: 'Balanced'
    };

    var appMessages = {
        noPortfolioAvailable: 'No portfolio available',
        noAnalysisAvailable: 'No analysis available',
        noTimePeriodAvailable: 'No time period available'
    };

    // ------------------------------------------
    // LOG
    // ------------------------------------------

    var log = (appSettings.disableLog)
        ? function () { }
        : function () { console.log.apply(console, arguments); };

    log('Hello from Dan & Asa');

    // ------------------------------------------
    // EVENT MANAGER
    // ------------------------------------------

    var eventManager = (function () {
        var eventObj = {},
            events = {};

        // Simple Event Manager.
        function on(event, callback) {
            events[event] = callback;
        }

        function raiseEvent(event) {
            var args = Array.prototype.slice.call(arguments, 1);

            if (events[event]) {
                events[event](args);
            }
        }

        function init(obj) {
            obj['on'] = on;
            obj['raiseEvent'] = raiseEvent;
        }

        eventObj.on = on;
        eventObj.raiseEvent = raiseEvent;
        eventObj.init = init;

        return eventObj;
    })();

    // ------------------------------------------
    // REPOSITORIES
    // ------------------------------------------

    var appRepositories = {};

    // Portfolio Slot Repository
    appRepositories.portfoliosSlot = (function () {
        var repository = {},
            portfoliosSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getPortfoliosSlotItems() {
            return portfoliosSlotItems;
        }

        function setPortfoliosSlotItems(items) {
            portfoliosSlotItems = items;
            raiseEvent('onItemsChanged', items);
        }

        function loadData(callback) {
            var slotItems = {};
            $.post(siteUrls.portfolios, { datatype: 'json' }, function (data) {
                if (data) {
                    $.each(data.items, function (i, val) {
                        slotItems[val.code] = val.name;
                    });
                } else {
                    slotItems.err = appMessages.noPortfolio;
                }

                setPortfoliosSlotItems(slotItems);
                callback(slotItems);
            }, 'json');
        }

        function getData(callback) {
            // TODO: Check if portfoliosListChanged is true...
            if (appSettings.loadPortfoliosSlotDataOnce) {
                if (!getPortfoliosSlotItems()) {
                    loadData(function (slotItems) {
                        callback(slotItems);
                    });
                } else {
                    callback(getPortfoliosSlotItems());
                }
            } else {
                loadData(function (slotItems) {
                    callback(slotItems);
                });
            }
        }

        repository.getData = getData;
        repository.on = on;

        return repository;
    })();

    // Analysis Slot Repository.
    appRepositories.analysisSlot = (function () {
        var repository = {},
            analysisSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getAnalysisSlotItems() {
            return analysisSlotItems;
        }

        function setAnalysisSlotItems(items) {
            analysisSlotItems = items;
            raiseEvent('onItemsChanged', items);
        }

        function getData(callback) {
            var items = analysisTypes || appMessages.noAnalysisAvailable;
            callback(items);
        }

        repository.getData = getData;
        repository.on = on;

        return repository;
    })();

    // Time Period Slot Repository.
    appRepositories.timePeriodsSlot = (function () {
        var repository = {},
            timePeriodsSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getTimePeriodsSlotItems() {
            return timePeriodsSlotItems || { err: appMessages.noTimePeriodAvailable };
        }

        function setTimePeriodsSlotItems(items) {
            timePeriodsSlotItems = items;
            raiseEvent('onItemsChanged', items);
        }

        function setData(timePeriods) {
            var slotItems = [];

            $.each(timePeriods, function (i, val) {
                slotItems[val.code] = val.name;
            });

            setTimePeriodsSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getTimePeriodsSlotItems(); //appRepository.timePeriodsSlotItems; //getTimePeriodsSlotItems()
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    // ------------------------------------------
    // SPINNING WHEEL SLOT
    // ------------------------------------------

    mobileApp.spinningWheel = WebAppLoader.loadModule('spinningWheel');
    WebAppLoader.unloadModule('spinningWheel');

    // ------------------------------------------
    // ISCROLL
    // ------------------------------------------

    mobileApp.scroll = WebAppLoader.loadModule('scroll');
    WebAppLoader.unloadModule('scroll');

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------

    mobileApp.tabbar = WebAppLoader.loadModule('tabbar');
    WebAppLoader.unloadModule('tabbar');

    // ------------------------------------------
    // NAVIGATION
    // ------------------------------------------

    mobileApp.nav = (function () {
        var auth = {};

        // Navigate to an external page.
        function navigateTo(url) {
            window.location = url;
        }

        // Future uses.
        function goToPage(idPage, animation) {
            jQT.goTo($(idPage), 'fade');
        }

        auth.goToPage = goToPage;

        return auth;
    })();

    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------

    // Create a partial selector.
    function partial(id) {
        return id + '_partial';
    }

    // Navigate to an external page.
    function navigateTo(url) {
        window.location = url;
    }

    // Future uses.
    function goToPage(idPage) {
        //jQT.goTo($(idPage), 'fade');
    }

    // ------------------------------------------
    // DOM EVENTS
    // ------------------------------------------

    mobileApp.onDocumentReady = function () {
        log('mobileApp.onDocumentReady');

        // Global Ajax Call
        $(document).on('ajaxStart', onAjaxStart);
        $(document).on('ajaxComplete', onAjaxComplete);

        // Login
        // $(appElements.loginButton).tappable(onLoginButtonClick);

        // Blank Page
        $(document).on('pageAnimationEnd', appPages.blank, onBlankEnd);

        // Home
        $(document).on('pageAnimationStart', appPages.home, onHomeStart);
        $(document).on('pageAnimationEnd', appPages.home, onHomeEnd);

        // Portfolios
        $(document).on('pageAnimationEnd', appPages.portfolios, onPortfolioEnd);

        // Portfolios Analysis
        $(document).on('click', appElements.portfolioAnalysisLink, onPortfolioAnalysisClick);

        // EULA
        $(document).on('pageAnimationEnd', appPages.eula, onEulaEnd);

        // Toolbar
        $(appElements.toolbar).click(onToolbarClick);
    };

    // ------------------------------------------
    // GLOBAL AJAX EVENTS
    // ------------------------------------------

    function onAjaxStart(event, request, settings) {
        $(appElements.loadingMask).show();
        log('ajaxStart', event, request, settings);
    }

    function onAjaxComplete(event, request, settings) {
        $(appElements.loadingMask).css("display", "none");
        // Return false to cancel this request.
        var obj = {};
        try {
            obj = JSON.parse(request.response);
        } catch (e) {

        }

        log('ajaxComplete', event, request, settings, obj);
    }

    // ------------------------------------------
    // LOGIN
    // ------------------------------------------

    // Require helper.js
    mobileApp.auth = WebAppLoader.loadModule('auth');

    // ------------------------------------------
    // BLANK PAGE
    // ------------------------------------------

    function onBlankEnd(e, info) {
        if (info.direction === 'in') {
            navigateTo(siteUrls.index);
        }
    }

    // ------------------------------------------
    // HOME PAGE
    // ------------------------------------------

    function onHomeStart(e, info) {
        log('#home start:', e, info);
    }

    function onHomeEnd(e, info) {
        log('#home end:', e, info);
        if (info.direction === 'in') {
            mobileApp.scroll.rebuild('home');
            // selectTabbarItem('dashboard');
        }
    }

    // ------------------------------------------
    // PORTFOLIOS PAGE
    // ------------------------------------------

    function onPortfolioEnd(e, info) {
        if (info.direction === 'in') {
            $.post(siteUrls.portfolios, function (data) {
                mobileApp.scroll.rebuild('portfolios');
                //selectTabbarItem('portfolios');
                $(partial(appPages.portfolios)).html(data);
                //                var myList = new iScroll('wrapper-mylist', {
                //                    momentum: true,
                //                    hScrollbar: false,
                //                    vScrollbar: false
                //                });
            });
        }
    }

    // ------------------------------------------
    // DEFAULT ANALYSIS PAGE
    // ------------------------------------------

    function onPortfolioAnalysisClick(e) {
        var uri = $(this).attr("data-link");
        $.post(siteUrls.analysis, { uri: uri }, function (data) {
            mobileApp.scroll.rebuild('analysis');
            $(partial(appPages.analysis)).html(data);
        });
        return false;
    }

    // ------------------------------------------
    // EULA PAGE
    // ------------------------------------------

    function onEulaEnd(e, info) {
        if (info.direction === 'in') {
            $.get(siteUrls.eula, function (data) {
                mobileApp.scroll.rebuild('eula');
                $(partial(appPages.eula)).html(data);
            }, 'xml');
        }
    }

    // ------------------------------------------
    // TOOLBAR
    // ------------------------------------------

    function onToolbarClick() {
        mobileApp.scroll.goUp();
    }

    // ------------------------------------------
    // LOGIC
    // ------------------------------------------

    mobileApp.portfoliosManager = (function () {
        var manager = {};

        return manager;
    })();

    function updateTabBar(portfolioCode) {
        var defaultPortfolioCode,
            portfolio = {
                code: '',
                type: '',
                currency: '',
                version: '',
                timeStamp: '',
                timePeriods: []
            };
        // Load default portfolio.

        function getPortfolioCode() {
            // TODO: Add code here to select the right portfolio code from:
            // - First portfolio
            // - Default portfolio
            // - Last saved portfolio
            // - Etc. etc.
            if (portfolioCode) {
                return portfolioCode;
            } else {
                return 'advisor'; // null; //'ASA_EQ01' // 'advisor'
            }
        }

        portfolio.code = getPortfolioCode();
        loadPortfolioData(onLoadPortfolioDataCompleted);

        function loadPortfolioData(callback) {
            var oData = {},
                defaultAnalysisLink = null;

            if (portfolio.code) {
                oData.filter = escape("Code eq '" + portfolio.code + "'");
            } else {
                oData.start = 0;
                oData.top = 1;
            }

            $.post(siteUrls.portfolios, { oData: oData, datatype: 'json' }, function (data) {
                if (data && data.items[0]) {
                    log('loadPortfolioData', data);
                    portfolio.code = data.items[0].code;
                    defaultAnalysisLink = data.items[0].links.defaultAnalysis.href;
                }
                callback({
                    defaultAnalysisLink: defaultAnalysisLink
                });
            }, 'json');
        }

        function onLoadPortfolioDataCompleted(data) {
            if (data.defaultAnalysisLink) {
                // mobileApp.setLastSlotPortfolioSelected(data.portfolioCode);
                loadPortfolioAnalysis(data.defaultAnalysisLink, onLoadPortfolioAnalysisCompleted);
            }
        }

        function loadPortfolioAnalysis(defaultAnalysisLink, callback) {
            $.post(siteUrls.portfolioAnalysis, { uri: defaultAnalysisLink, datatype: 'json' }, function (data) {
                log('loadPortfolioAnalysis', data);
                if (data && data.analysis) {
                    portfolio.type = data.type || '';
                    portfolio.currency = data.analysis.currency || '';
                    portfolio.version = data.analysis.version || '';
                    if (data.analysis.results) {
                        portfolio.timeStamp = data.analysis.results.timeStamp || '';
                        portfolio.timePeriods = data.analysis.results.timePeriods || [];
                    }
                }
                callback();
            }, 'json');
        }

        function onLoadPortfolioAnalysisCompleted() {
            appRepositories.timePeriodsSlot.setData(portfolio.timePeriods);
            //            var timePeriodsSlotItems = [];

            //            $.each(portfolio.timePeriods, function (i, val) {
            //                timePeriodsSlotItems[val.code] = val.name;
            //            });

            //            appRepository.timePeriodsSlotItems = timePeriodsSlotItems;
        }

    }

    mobileApp.updateTabBar = updateTabBar;
    mobileApp.timePeriodsSlot = appRepositories.timePeriodsSlot;
    mobileApp.pages = appPages;

    // Repositories
    mobileApp.repositories = {
        portfoliosSlot: appRepositories.portfoliosSlot,
        analysisSlot: appRepositories.analysisSlot,
        timePeriodsSlot: appRepositories.timePeriodsSlot
    };

    // Returns the mobile app.
    return mobileApp;
})();

// Main functions:
Zepto(function ($) {
    // App pages.
    var appPages = {
        blank: '#blank_page',
        dashboard: '#dashboard',
        home: '#home',
        portfolios: '#portfolios',
        portfolioAnalysis: '#portfolioAnalysis',
        analysis: '#analysis',
        eula: '#eula'
    };

    // Elements.
    var appElements = {
        portfolioAnalysisLink: '.defaultAnalysisLink',
        toolbar: '.toolbar',
        loginButton: '#loginButton',
        loadingMask: '#myloading',
        userNameTextbox: '#userNameTextbox',
        passwordTextbox: '#passwordTextbox'
    };

    // URLs.
    var siteUrls = {
        portfolios: '/portfolios',
        autenticate: '/authenticate',
        index: '/index',
        portfolioAnalysis: '/portfolioAnalysis',
        analysis: '/analysis',
        eula: '/eula'
    };

    console.log('Hello from zepto');
    MobileApp.onDocumentReady();

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------

    var tabbarConfig = {
        tabbarId: 'nav#tabbar',
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
            { id: 'home', title: 'Home', class: 'home' },
            { id: 'portfolios', title: 'Portfolios', class: 'portfolios' },
            { id: 'analysis', title: 'Analysis', class: 'analysis' },
            { id: 'timePeriods', title: 'Time Periods', class: 'timeperiods' },
            { id: 'infos', title: 'Infos', class: 'infos' },
            { id: 'more', title: 'More', class: 'more' }
        ]
    };

    MobileApp.tabbar.create(tabbarConfig);

    // ------------------------------------------
    // SPINNING WHEEL
    // ------------------------------------------

    var slotConfig = {
        items: [
            { id: 'portfolios', repository: MobileApp.repositories.portfoliosSlot },
            { id: 'analysis', repository: MobileApp.repositories.analysisSlot },
            { id: 'timePeriods', repository: MobileApp.repositories.timePeriodsSlot }
        // { id: 'test', repository: { getData: function (callback) { callback({ a: 'a', b: 'b' }); } }}
        ]
    };

    MobileApp.spinningWheel.create(slotConfig);

    // ------------------------------------------
    // EVENTS
    // ------------------------------------------

    MobileApp.tabbar.on('onHomeTap', function () {
        // MobileApp.tabbar.hide();
        // MobileApp.tabbar.buttons[0].setDisabled(true);
        MobileApp.tabbar.getButton(0).setDisabled(true);
        MobileApp.tabbar.getButton(1).setBadgeText('99');
        MobileApp.tabbar.getButton(1).setDisabled(true);
        MobileApp.tabbar.getButton('infos').setDisabled(false);
        // WebAppLoader.loadModule('output').disableLogging(true);
        // WebAppLoader.unloadModule('output');
        // WebAppLoader.output.log("STATIC!!!");
        webApp.settings.set('test', 'test');
    });

    MobileApp.tabbar.on('onPortfoliosTap', function () {
        //MobileApp.slot.showPortfolios();
        MobileApp.spinningWheel.getSlot('portfolios').show('ADVISOR');
    });

    MobileApp.tabbar.on('onAnalysisTap', function () {
        // MobileApp.slot.showAnalysis();
        MobileApp.spinningWheel.getSlot('analysis').show();
    });

    MobileApp.tabbar.on('onTimePeriodsTap', function () {
        // MobileApp.slot.showTimePeriods();
        MobileApp.spinningWheel.getSlot('timePeriods').show();
    });

    MobileApp.tabbar.on('onInfosTap', function () {
        //        MobileApp.tabbar.getButton('home').setDisabled(false);
        //        MobileApp.tabbar.getButton(1).setDisabled(false);
        //        MobileApp.tabbar.getButton(1).setBadgeText('!');
        console.log(webApp.settings.get('test'));

        jQT.goTo($('#portfolios'), 'pop');
    });

    MobileApp.tabbar.on('onMoreTap', function () {
        location.reload();
        // jQT.goTo($('#login'), 'cube');
    });

    MobileApp.spinningWheel.on('onPortfoliosDone', function (key) {
        MobileApp.updateTabBar(key);
    });

    // Login
    $(appElements.loginButton).on('tap', function () {
        var username, password;

        // Obtain the username and password from the form.
        username = $(appElements.userNameTextbox).val();
        password = $(appElements.passwordTextbox).val();

        MobileApp.auth.doLogin(username, password, siteUrls.autenticate);
    });

    MobileApp.auth.on('onLoginSuccess', function () {
        MobileApp.nav.goToPage($(appPages.home), 'dissolve');
        MobileApp.tabbar.show();
        MobileApp.updateTabBar();
    });

    function selectTabbarItem(item) {
        var tabbarItem = $('#' + item + '_tabbar');
        $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
        $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
    }
});