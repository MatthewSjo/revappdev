// ------------------------------------------
// REPOSITORIES
// ------------------------------------------

WebAppLoader.addModule({ name: 'repositories', sharedModules: ['settings', 'localizationManager'], hasEvents: true }, function () {
    var repositories    = {},
        eventManager    = this.loader.eventManager || {},
        output          = this.loader.output || {},
        settings        = this.loader.shared.settings || {},
        lang            = this.loader.shared.localizationManager.getLanguage() || {};

    // Portfolio Slot Repository
    repositories.portfoliosSlot = (function () {
        var repository = {},
            portfoliosSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getPortfoliosSlotItems() {
            return portfoliosSlotItems;
        }

        function setPortfoliosSlotItems(items) {
            portfoliosSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function loadData(callback) {
            var slotItems = {};
            $.post(settings.siteUrls.portfolios, { datatype: 'json' }, function (data) {
                if (data) {
                    $.each(data.items, function (i, val) {
                        slotItems[val.code] = val.name;
                    });
                } else {
                    slotItems.err = lang.noPortfolioSlotAvailable;
                }

                setPortfoliosSlotItems(slotItems);
                callback(slotItems);
            }, 'json');
        }

        function getData(callback) {
            // TODO: Check if portfoliosListChanged is true...
            if (settings.appSettings.loadPortfoliosSlotDataOnce) {
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
    repositories.analysisSlot = (function () {
        var repository = {},
            analysisSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getAnalysisSlotItems() {
            return analysisSlotItems;
        }

        function setAnalysisSlotItems(items) {
            analysisSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function getData(callback) {
            var items = settings.analysisTypes || lang.noAnalysisAvailable;
            callback(items);
        }

        repository.getData = getData;
        repository.on = on;

        return repository;
    })();

    // Time Period Slot Repository.
    repositories.timePeriodsSlot = (function () {
        var repository = {},
            timePeriodsSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getTimePeriodsSlotItems() {
            return timePeriodsSlotItems || { err: lang.noTimePeriodAvailable };
        }

        function setTimePeriodsSlotItems(items) {
            timePeriodsSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
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

    return repositories;
});