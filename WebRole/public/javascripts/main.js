// ------------------------------------------
// MAIN MOBILE APP
// ------------------------------------------

// Main variables.
var MobileApp = {};   // Main app namespace

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

    mobileApp.slot = (function (repository) {
        var lastSlotPortfolioSelected, lastSlotAnalysisSelected, lastSlotTimePeriodSelected,
            slot = {};

        // Add event handlers to the object.
        eventManager.init(this);

        function onSlotCancel() {
            SpinningWheel.close();
            raiseEvent('onSlotCancel');
        }

        function onPortfoliosSlotDone() {
            var key, results;

            results = SpinningWheel.getSelectedValues();
            key = results.keys[0] || '';

            setPortfolio(key);
            SpinningWheel.close();
            raiseEvent('onPortfoliosSlotDone', key);
        }

        function onAnalysisSlotDone() {
            var key, results;

            results = SpinningWheel.getSelectedValues();
            key = results.keys[0] || '';

            setAnalysis(key);
            SpinningWheel.close();
            raiseEvent('onAnalysisSlotDone', key);
        }

        function onTimePeriodsSlotDone() {
            var key, results;

            results = SpinningWheel.getSelectedValues();
            key = results.keys[0] || '';

            setTimePeriod(key);
            raiseEvent('onTimePeriodsSlotDone', key);
            SpinningWheel.close();
        }

        // PUBLIC
        function showPortfolios() {
            //var slotItems = {},
            var defaultItem = getPortfolio();

            function initSlot(slotItems) {
                SpinningWheel.addSlot(slotItems, '', defaultItem);
                SpinningWheel.setCancelAction(onSlotCancel);
                SpinningWheel.setDoneAction(onPortfoliosSlotDone);
                SpinningWheel.open();
            }

            repository.portfolios.getData(initSlot);
        }

        // PUBLIC
        function showAnalysis() {
            var defaultItem = getAnalysis();

            function initSlot(slotItems) {
                SpinningWheel.addSlot(slotItems, '', defaultItem);
                SpinningWheel.setCancelAction(onSlotCancel);
                SpinningWheel.setDoneAction(onAnalysisSlotDone);
                SpinningWheel.open();
            }

            repository.analysis.getData(initSlot);
        }

        // PUBLIC
        function showTimePeriods() {
            var defaultItem = getTimePeriod();

            function initSlot(slotItems) {
                SpinningWheel.addSlot(slotItems, '', defaultItem);
                SpinningWheel.setCancelAction(onSlotCancel);
                SpinningWheel.setDoneAction(onTimePeriodsSlotDone);
                SpinningWheel.open();
            }

            repository.timePeriods.getData(initSlot);
        }

        // PUBLIC
        function getPortfolio() {
            return lastSlotPortfolioSelected || '';
        }

        // PUBLIC
        function setPortfolio(portfolioCode) {
            lastSlotPortfolioSelected = portfolioCode;
        }

        // PUBLIC
        function getAnalysis() {
            return lastSlotAnalysisSelected || '';
        }

        // PUBLIC
        function setAnalysis(analysisCode) {
            lastSlotAnalysisSelected = analysisCode;
        }

        // PUBLIC
        function getTimePeriod() {
            return lastSlotTimePeriodSelected || '';
        }

        // PUBLIC
        function setTimePeriod(timePeriodCode) {
            lastSlotTimePeriodSelected = timePeriodCode;
        }

        slot.showPortfolios = showPortfolios;
        slot.showAnalysis = showAnalysis;
        slot.showTimePeriods = showTimePeriods;
        slot.getPortfolio = getPortfolio;
        slot.setPortfolio = setPortfolio;
        slot.getAnalysis = getAnalysis;
        slot.setAnalysis = setAnalysis;
        slot.getTimePeriod = getTimePeriod;
        slot.setTimePeriod = setTimePeriod;
        slot.on = on;

        return slot;
    })({
        portfolios: appRepositories.portfoliosSlot,
        analysis: appRepositories.analysisSlot,
        timePeriods: appRepositories.timePeriodsSlot
    });

    //mobileApp.slot.on('onPortfoliosSlotDone', function (data) { alert(data); });

    // ------------------------------------------
    // ISCROLL
    // ------------------------------------------

    mobileApp.scroll = (function () {
        var myScroll, scroll = {};

        function rebuildScroll(id) {
            var wrapper = 'div#' + id + ' #wrapper',
                options = {}; // { hScrollbar: false, vScrollbar: true }

            if (myScroll) {
                myScroll.destroy();
                myScroll = null;
            }

            if ($(wrapper).get(0)) {
                setTimeout(function () {
                    myScroll = new iScroll($(wrapper).get(0), options);
                }, 0);
            }
        }

        function goUp() {
            try {
                myScroll.scrollTo(0, 0, 200);
            } catch (e) {

            }
        }

        scroll.rebuild = rebuildScroll;
        scroll.goUp = goUp;

        return scroll;
    })();

    // ------------------------------------------
    // TAB BAR
    // ------------------------------------------

    

    mobileApp.tabbar = (function () {
        var tabbar          = {},
            btnHome         = '#tabbar_btnHome',
            btnPortfolios   = '#tabbar_btnPortfolios',
            btnAnalysis     = '#tabbar_btnAnalysis',
            btnTimePeriods  = '#tabbar_btnTimePeriods',
            btnInfos        = '#tabbar_btnInfos';

        // Add event handlers to the object.
        eventManager.init(this);

        $(document).on('tap', btnHome, function () { raiseEvent('onHomeTap'); });
        $(document).on('tap', btnPortfolios, function () { raiseEvent('onPortfoliosTap'); });
        $(document).on('tap', btnAnalysis, function () { raiseEvent('onAnalysisTap'); });
        $(document).on('tap', btnTimePeriods, function () { raiseEvent('onTimePeriodsTap'); });
        $(document).on('tap', btnInfos, function () { raiseEvent('onInfosTap'); });

        tabbar.on = on;

        return tabbar;
    })();

    mobileApp.tabbar.on('onPortfoliosTap', function () {
        mobileApp.slot.showPortfolios();
    });

    mobileApp.tabbar.on('onPortfoliosTap', function () {
        mobileApp.slot.showPortfolios();
    });

    mobileApp.tabbar.on('onAnalysisTap', function () {
        mobileApp.slot.showAnalysis();
    });

    mobileApp.tabbar.on('onTimePeriodsTap', function () {
        mobileApp.slot.showTimePeriods();
    });


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
        $(appElements.loginButton).tappable(onLoginButtonClick);

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

        // Load defaults when the index page is loaded.
        if (window.location.pathname === siteUrls.index) {
            updateTabBar();
        }
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

    function onLoginButtonClick() {
        log('onLoginButtonClick');

        var username, password, token;

        // Obtain the username and password from the form.
        username = $(appElements.userNameTextbox).val();
        password = $(appElements.passwordTextbox).val();

        // Create a Base64 encoded token from the credentials.
        token = 'Basic ' + helper.Base64.encode(username + ':' + password);
        //token = 'Basic YXNhLmZhbWFAc3RhdHByby5jb206U3RhdFBybzEyMw==';

        // Post the created token and the user's email to the authenticate action.
        $.post(siteUrls.autenticate, { email: username, token: token }, function (response) {
            // If our response indicates that the user has been authenticated...
            if (response.authenticated) {
                // ...redirect to the default page.
                navigateTo(siteUrls.index);
            }
        }, 'json');

        return false;
    }

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
        $.post(siteUrls.portfolioAnalysis, { uri: uri }, function (data) {
            mobileApp.scroll.rebuild('portfolioAnalysis');
            $(partial(appPages.portfolioAnalysis)).html(data);
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
                return null; // null; //'ASA_EQ01' // 'advisor'
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

            log(oData.filter);
            $.post(siteUrls.portfolios, { oData: oData, datatype: 'json' }, function (data) {
                if (data && data.items[0]) {
                    log('loadPortfolio', data);
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
    // Returns the mobile app.
    return mobileApp;
})();

// Main functions:
Zepto(function ($) {
    console.log('Hello from zepto');
    MobileApp.onDocumentReady();

    MobileApp.slot.on('onPortfoliosSlotDone', function (data) {
        alert(data);
        MobileApp.updateTabBar(data);
    });

    MobileApp.slot.on('onTimePeriodsSlotDone', function (data) {
        alert(data);
        // MobileApp.updateTabBar(data);
    });

    function selectTabbarItem(item) {
        var tabbarItem = $('#' + item + '_tabbar');
        $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
        $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
    }
});