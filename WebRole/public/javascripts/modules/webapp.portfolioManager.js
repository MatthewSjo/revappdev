// ------------------------------------------
// PORTFOLIO MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfolioManager', plugins: [], sharedModules: ['settings', 'ajaxManager', 'localizationManager'],
    dataObjects: ['portfolio'], hasEvents: true
}, function () {
    var portfolioManager = {},
        output = this.getConsole(),
        eventManager = this.getEventManager(),
        settings = this.getSharedModule('settings'),
        portfolioDataObj = this.getDataObject('portfolio'),
        lang = this.getSharedModule('localizationManager').getLanguage() || {},
        ajaxManager = this.getSharedModule('ajaxManager'),
        lastPortfolioIdUsed = '',
        lastPortfolioUsed = {};

    portfolioDataObj.define({
        code: '',
        name: '',
        type: '',
        analysisLink: '',
        currency: '',
        version: '',
        timeStamp: '',
        timePeriods: []
    });

    function loadPortfolioAnalysis(portfolioCode, callback) {

        function onGetAnalysisCompleted() {
            callback(lastPortfolioUsed);
        }

        function onLoadPortfolioCompleted(defaultAnalysisLink) {
            getAnalysis(defaultAnalysisLink, onGetAnalysisCompleted);
        }

        loadPortfolio(portfolioCode, onLoadPortfolioCompleted);
    }

    function loadPortfolio(portfolioCode, callback) {
        var defaultPortfolioCode,
            portfolio = {
                code: '',
                type: '',
                analysisLink: '',
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
                // Return the first available portfolio.
                return '';
            }
        }

        lastPortfolioIdUsed = portfolio.code = getPortfolioCode();
        loadPortfolioData(onLoadPortfolioDataCompleted);

        function loadPortfolioData(callback) {
            var oData = {},
                defaultAnalysisLink = null;

            // Filter on the portfolio code if provided, otherwise just
            // retrieve the first portfolio in the default list.
            if (portfolio.code) {
                oData.filter = "Code eq '" + portfolio.code + "'";
            } else {
                oData.start = 0;
                oData.top = 1;
            }

            ajaxManager.post(settings.siteUrls.portfolios, { oData: oData, datatype: 'json' }, function (data) {
                
                // If no portfolio data was returned for our query...
                if (!data || !data.items || data.items.length < 1) {
                    // ...raise a failure event and return.
                    eventManager.raiseEvent('onFailed', lang.errors.portfolioNotFoundText);
                    return;
                }

                // Persist the portfolio code and the link to its default analysis.
                portfolio.code = data.items[0].code;
                defaultAnalysisLink = data.items[0].links.defaultAnalysis.href;
                
                // Call the callback.
                callback({ defaultAnalysisLink: defaultAnalysisLink });

            }, 'json');
        }

        function onLoadPortfolioDataCompleted(data) {
            if (data.defaultAnalysisLink) {
                portfolio.analysisLink = data.defaultAnalysisLink;
                loadPortfolioAnalysis(data.defaultAnalysisLink, onLoadPortfolioAnalysisCompleted);
            }
        }

        function loadPortfolioAnalysis(defaultAnalysisLink, callback) {
            ajaxManager.post(settings.siteUrls.portfolioAnalysis, { uri: defaultAnalysisLink, datatype: 'json' }, function (data) {

                // If no analysis data was returned for the given portfolio...
                if (!data || !data.analysis) {
                    // ...raise a failure event and return.
                    eventManager.raiseEvent('onFailed', lang.errors.analysisFailedText);
                    return;
                }

                // Persist the basic portfolio information.
                portfolio.name = data.name || '';
                portfolio.type = data.type || '';
                portfolio.currency = data.analysis.currency || '';
                portfolio.version = data.analysis.version || '';

                // If we have results, persist their basic details also.
                if (data.analysis.results) {
                    portfolio.timeStamp = data.analysis.results.timeStamp || '';
                    portfolio.timePeriods = data.analysis.results.timePeriods || [];
                }

                // Call the callback.
                callback();

            }, 'json');
        }

        function onLoadPortfolioAnalysisCompleted() {
            
            // Persist the currently selected portfolio.
            portfolioDataObj.setData(portfolio);
            lastPortfolioUsed = portfolio;

            // Raise notification events.
            eventManager.raiseEvent('onPortfolioLoaded', portfolio);
            eventManager.raiseEvent('onTimePeriodsLoaded', portfolio.timePeriods);

            // Call the callback, passing the analysis link.
            callback(portfolio.analysisLink);
        }
    }

    // Public
    function getAnalysis(uri, callback) {
        ajaxManager.post(settings.siteUrls.analysis, { uri: uri, datatype: 'json' }, function (data) {

            // If no analysis HTML template data was returned for the given portfolio...
            if (!data) {
                // ...raise a failure event and return.
                eventManager.raiseEvent('onFailed', lang.errors.analysisFailedText);
                return;
            }

            // Raise notification events.
            eventManager.raiseEvent('onAnalysisLoaded', data);

            // Call the callback.
            callback();
        }, 'json');
    }

    portfolioManager.loadPortfolio = loadPortfolio;
    portfolioManager.getAnalysis = getAnalysis;
    portfolioManager.loadPortfolioAnalysis = loadPortfolioAnalysis;

    return portfolioManager;
});