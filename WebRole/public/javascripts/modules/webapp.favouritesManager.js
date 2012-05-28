// ------------------------------------------
// FAVOURITES MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'favouritesManager', plugins: ['helper'], 
    sharedModules: [], dataObjects: ['favourites'], hasEvents: true }, function () {

    var favouritesManager    = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        favouritesDataObj    = this.getDataObject('favourites'),
        favourites           = {};
/*
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
*/
    favouritesDataObj.define({
        items: [{
            title: 'First Portfolio - Performances - Earliest',
            favouriteId: '@~~<first>~~@performancesEarliest', // Unusual id.
            portfolioId: '@~~<first>~~@',
            analysisId: 'performances',
            timePeriodId: 'Earliest'
        }]
    });

    function createIdFromAnalysisDataObject(analysisDataObject) {
        var favouriteId = null,
            dataObj     = analysisDataObject;

        if (dataObj.portfolioId &&  dataObj.analysisId && dataObj.timePeriodId) {
            favouriteId = dataObj.portfolioId +  dataObj.analysisId + dataObj.timePeriodId;
        }

        return favouriteId;
    }
    
    function favouritesUpdated() {
        eventManager.raiseEvent('onFavouritesUpdated', favouritesDataObj.getData());
    }

    function init(lastUsernameUsed) {
        var favourites;
        
        if (lastUsernameUsed) {
            favouritesDataObj.loadData(lastUsernameUsed);
        } 

        favouritesUpdated();
    }
        
    favouritesManager.init = init;
    favouritesManager.update = init; // Alias
    favouritesManager.createIdFromAnalysisDataObject = createIdFromAnalysisDataObject;

    return favouritesManager;
});