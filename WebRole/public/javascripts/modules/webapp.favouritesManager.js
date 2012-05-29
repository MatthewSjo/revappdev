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
        items: [/*{
            title: 'First Portfolio - Performances - Earliest',
            favouriteId: '@~~<first>~~@performancesEarliest', // Unusual id.
            portfolioId: '@~~<first>~~@',
            analysisId: 'performances',
            timePeriodId: 'Earliest'
        }*/]
    });

    function createIdFromAnalysisDataObject(analysisDataObject) {
        var favouriteId = null,
            dataObj     = analysisDataObject;

        if (dataObj.portfolioId &&  dataObj.analysisId && dataObj.timePeriodId) {
            favouriteId = dataObj.portfolioId +  dataObj.analysisId + dataObj.timePeriodId;
        }

        return favouriteId;
    }
    
    function getFavourteFromAnalysisDataObject(analysisDataObject) {
        var favouriteObj = {};

        favouriteObj.title        = analysisDataObject.portfolioName + ' - ' +
                                    analysisDataObject.analysisName + ' - ' +
                                    analysisDataObject.timePeriodName;
        favouriteObj.favouriteId  = analysisDataObject.portfolioId +
                                    analysisDataObject.analysisId +
                                    analysisDataObject.timePeriodId;
        favouriteObj.portfolioId  = analysisDataObject.portfolioId;
        favouriteObj.analysisId   = analysisDataObject.analysisId;
        favouriteObj.timePeriodId = analysisDataObject.timePeriodId;

        return favouriteObj;
    }

    function getAnalysisDataObjectFromFavourte(favouriteId) {
        var favourites         = favouritesDataObj.getData(),
            analysisDataObject = null,
            favourite          = {};

        for (var i = 0; i < favourites.items.length; i++) {
            favourite = favourites.items[i];
            if (favourite.favouriteId === favouriteId) {
                // Create a new analysisDataObject and populate it with
                // values from favourite.
                analysisDataObject = {}; 
                analysisDataObject.portfolioId = favourite.portfolioId;
                analysisDataObject.analysisId = favourite.analysisId;
                analysisDataObject.timePeriodId= favourite.timePeriodId;
                return analysisDataObject;   
            }
        }

        return analysisDataObject;
    }

    function favouriteExists(favouriteId) {
        var favourites = favouritesDataObj.getData();
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
    favouritesManager.getFavourteFromAnalysisDataObject = getFavourteFromAnalysisDataObject;
    favouritesManager.favouriteExists = favouriteExists;
    favouritesManager.getAnalysisDataObjectFromFavourte = getAnalysisDataObjectFromFavourte;

    return favouritesManager;
});