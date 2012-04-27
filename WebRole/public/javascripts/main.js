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
    var mobileApp = {},
        log;

    var appSettings = {
        disableLog: false,
        loadPortfoliosSlotDataOnce: false
    };

    var appRepository = {
        portfoliosSlotItems: null
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

    // Ajax Data types.
    var ajaxDataTypesParams = {
        json: '?datatype=json'
    };

    // App pages.
    var appPages = {
        blank: '#blank_page',
        dashboard: '#dashboard',
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

    // Member variables.
    var lastSlotPortfolioSelected,
        lastSlotAnalysisSelected;

    log = (appSettings.disableLog)
        ? function () { }
        : function () { console.log.apply(console, arguments); };

    log('Hello from Dan & Asa');

    mobileApp.onDocumentReady = function () {
        log('mobileApp.onDocumentReady');

        // Global Ajax Call
        $(document).on('ajaxStart', onAjaxStart);
        $(document).on('ajaxComplete', onAjaxComplete);

        // Login
        $(appElements.loginButton).tappable(onLoginButtonClick);

        // Blank Page
        $(document).on('pageAnimationEnd', appPages.blank, onBlankEnd);

        // Dashboard
        $(document).on('pageAnimationStart', appPages.dashboard, onDashboardStart);
        $(document).on('pageAnimationEnd', appPages.dashboard, onDashboardEnd);

        // Portfolios
        $(document).on('pageAnimationEnd', appPages.portfolios, onPortfolioEnd);

        // Analysis
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
    // DASHBOARD PAGE
    // ------------------------------------------

    function onDashboardStart(e, info) {
        log('#dashboard start:', e, info);
    }

    function onDashboardEnd(e, info) {
        log('#dashboard end:', e, info);
        if (info.direction === 'in') {
            mobileApp.scroll.rebuild('dashboard');
            // selectTabbarItem('dashboard');
        }
    }

    // ------------------------------------------
    // PORTFOLIOS PAGE
    // ------------------------------------------

    function onPortfolioEnd(e, info) {
        if (info.direction === 'in') {
            $.get(siteUrls.portfolios, function (data) {
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
    // SPINNING WHEEL
    // ------------------------------------------

    function onSlotCancel() {
        SpinningWheel.close();
    }

    function onPortfoliosSlotDone() {
        var results = SpinningWheel.getSelectedValues();
        mobileApp.setLastSlotPortfolioSelected(results.keys[0]);
        log('values: ' + results.values.join(' ') + '<br />keys: ' + results.keys.join(', '));
        SpinningWheel.close();
    }

    function onAnalysisSlotDone() {
        var results = SpinningWheel.getSelectedValues();
        mobileApp.setLastSlotAnalysisSelected(results.keys[0]);
        log('values: ' + results.values.join(' ') + '<br />keys: ' + results.keys.join(', '));
        SpinningWheel.close();
    }

    mobileApp.showPortfoliosSlot = function () {
        var slotItems = {},
            defaultItem = mobileApp.getLastSlotPortfolioSelected();

        function initSlot() {
            SpinningWheel.addSlot(slotItems, '', defaultItem);
            SpinningWheel.setCancelAction(onSlotCancel);
            SpinningWheel.setDoneAction(onPortfoliosSlotDone);
            SpinningWheel.open();
        }

        function loadSlodData(callback) {
            $.get(siteUrls.portfolios + ajaxDataTypesParams.json, function (data) {
                var dataJson = {};

                try {
                    dataJson = JSON.parse(data);
                } catch (e) { }

                $.each(dataJson.items, function (i, val) {
                    slotItems[val.code] = val.name;
                });

                callback();
            }, 'json');
        }

        // TODO: Check if portfoliosListChanged is true...
        if (appSettings.loadPortfoliosSlotDataOnce) {
            if (!appRepository.portfoliosSlotItems) {
                loadSlodData(function () {
                    appRepository.portfoliosSlotItems = slotItems;
                    initSlot();
                });
            } else {
                slotItems = appRepository.portfoliosSlotItems;
                initSlot();
            }
        } else {
            loadSlodData(initSlot);
        }
    };

    mobileApp.showAnalysisSlot = function () {
        var defaultItem = mobileApp.getLastSlotAnalysisSelected();

        SpinningWheel.addSlot(analysisTypes, '', defaultItem);
        SpinningWheel.setCancelAction(onSlotCancel);
        SpinningWheel.setDoneAction(onAnalysisSlotDone);
        SpinningWheel.open();
    };

    mobileApp.getLastSlotPortfolioSelected = function () {
        return lastSlotPortfolioSelected || '';
    };

    mobileApp.setLastSlotPortfolioSelected = function (portfolioCode) {
        lastSlotPortfolioSelected = portfolioCode;
        // TODO: Add code here to store the value locally.
    };

    mobileApp.getLastSlotAnalysisSelected = function () {
        return lastSlotAnalysisSelected || '';
    };

    mobileApp.setLastSlotAnalysisSelected = function (analysisCode) {
        lastSlotAnalysisSelected = analysisCode;
        // TODO: Add code here to store the value locally.
    };


    // ------------------------------------------
    // ISCROLL
    // ------------------------------------------

    mobileApp.scroll = (function () {
        var myScroll, scroll = {};

        function rebuildScroll(id, optionConfig) {
            var wrapper = 'div#' + id + ' #wrapper',
                options = optionConfig || {}; // { hScrollbar: false, vScrollbar: true }

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
    // HELPER FUNCTION
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

    // Returns the mobile app.
    return mobileApp;
})();

// Main functions:
Zepto(function ($) {
    console.log('Hello from zepto');
    MobileApp.onDocumentReady();

    function selectTabbarItem(item) {
        var tabbarItem = $('#' + item + '_tabbar');
        $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
        $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
    }
});