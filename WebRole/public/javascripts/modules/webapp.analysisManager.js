// ------------------------------------------
// ANALYSIS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisManager', plugins: ['helper'], 
    sharedModules: ['chartsManager'], hasEvents: true }, function () {

    var analysisManager     = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper')
        chartsManager       = this.getSharedModule('chartsManager'),
        charts              = [],
        analysisPages       = {};

    // TODO: Add a method called changeChartPosition or changeChartOrder...

    // Public
    function restoreDefaults() {
        // Delete any previous analysis pages.
        analysisPages = {};

        analysisPages = {
            items: [{
                name        : 'Performances',
                id          : 'performances',
                order       : 1,
                userDefined : false,
                charts      : [{
                        chartId : 'performance_bubble',
                        order   : 1
                    },{
                        chartId: 'performance_heatmap',
                        order   : 2
                    }] 
            },{
                name        : 'Risk',
                id          : 'risk',
                order       : 6,
                userDefined : false,
                charts      : [{
                        chartId: 'performance_column',
                        order   : 1
                    },{
                        chartId: 'performance_grid',
                        order   : 2
                    }]             
            },{
                name        : 'Asset Allocation',
                id          : 'assetAllocation',
                order       : 5,
                userDefined : false,
                charts      : [{
                        chartId: 'performance_line',
                        order   : 1
                    },{
                        chartId: 'performance_grid',
                        order   : 2
                    }]             
            },{
                name        : 'Contribution',
                id          : 'contribution',
                order       : 4,
                userDefined : false,
                charts      : [{
                        chartId: 'performance_column',
                        order   : 1
                    },{
                        chartId: 'performance_heatmap',
                        order   : 2
                    }]             
            },{
                name        : 'Attribution',
                id          : 'attribution',
                order       : 3,
                userDefined : false,
                charts      : [{
                        chartId: 'performance_bubble',
                        order   : 1
                    },{
                        chartId: 'performance_grid',
                        order   : 2
                    }]             
            },{
                name        : 'Fixed Income',
                id          : 'fixedIncome',
                order       : 2,
                userDefined : false,
                charts      : [{
                        chartId: 'performance_column',
                        order   : 1
                    },{
                        chartId: 'performance_heatmap',
                        order   : 2
                    }]             
            }]
        };

        saveAnalysisPages();
    }

    // Private
    function saveAnalysisPages() {
        analysisUpdated();
    }

    function analysisUpdated() {
        eventManager.raiseEvent('onUpdated', analysisPages);
    }

    function init() {
        restoreDefaults();
    }
    
    function getPages() {
        return analysisPages.items;
    }
        
    analysisManager.init = init;
    analysisManager.update = init; // Alias
    analysisManager.getPages = getPages;

    return analysisManager;
});