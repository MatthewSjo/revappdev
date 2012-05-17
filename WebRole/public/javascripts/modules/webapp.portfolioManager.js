// ------------------------------------------
// PORTFOLIO MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfolioManager', plugins: [], sharedModules: ['settings'], dataObjects: ['portfolio', 'test'], hasEvents: true }, function () {
    var portfolioManager    = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        settings            = this.getSharedModule('settings'),
        portfolioData       = this.getDataObject('portfolio'),
        testData            = this.getDataObject('test');

    function selectPortfolio(portfolioCode) {
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
                return 'advisor'; //'EXFIF'; // null; //'ASA_EQ01' // 'advisor'
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

            $.post(settings.siteUrls.portfolios, { oData: oData, datatype: 'json' }, function (data) {
                if (data && data.items && data.items[0]) {
                    output.log('loadPortfolioData', data);
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
                portfolio.analysisLink = data.defaultAnalysisLink;
                // mobileApp.setLastSlotPortfolioSelected(data.portfolioCode);
                loadPortfolioAnalysis(data.defaultAnalysisLink, onLoadPortfolioAnalysisCompleted);
            }
        }

        function loadPortfolioAnalysis(defaultAnalysisLink, callback) {
            $.post(settings.siteUrls.portfolioAnalysis, { uri: defaultAnalysisLink, datatype: 'json' }, function (data) {
                output.log('loadPortfolioAnalysis', data);
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
            // repositories.timePeriodsSlot.setData(portfolio.timePeriods);
            eventManager.raiseEvent('onPortfolioLoaded', portfolio);
            eventManager.raiseEvent('onTimePeriodDataReceived', portfolio.timePeriods);
        }
    }
    
    // Public
    function getAnalysis(uri) {
        $.post(settings.siteUrls.analysis, { uri: uri }, function (data) {
            eventManager.raiseEvent('onAnalysisReceived', data);
        });
    
    }

    portfolioManager.selectPortfolio = selectPortfolio;
    portfolioManager.getAnalysis = getAnalysis;

    return portfolioManager;
});