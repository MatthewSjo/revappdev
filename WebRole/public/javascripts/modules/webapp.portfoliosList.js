// ------------------------------------------
// PORTFOLIOS LIST
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfoliosList', plugins: [], sharedModules: ['settings', 'pageElements'], hasEvents: true }, function () {
    var portfoliosList  = {},
        output          = this.loader.output || {},
        settings        = this.loader.shared.settings || {},
        el              = this.loader.shared.pageElements || {},
        eventManager    = this.loader.eventManager || {};
    
    $(document).on('click', el.portfolioAnalysisLink, onPortfolioAnalysisClick);

    function onPortfolioAnalysisClick(e) {
        var uri = $(this).attr("data-link");

        $.post(settings.siteUrls.analysis, { uri: uri }, function (data) {
            eventManager.raiseEvent('onDataReceived', data);
        });
        
        return false;
    }


    return portfoliosList;
});