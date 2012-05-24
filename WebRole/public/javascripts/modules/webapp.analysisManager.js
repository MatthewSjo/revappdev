﻿// ------------------------------------------
// ANALYSIS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisManager', plugins: ['helper'], 
    sharedModules: [], dataObjects: ['analysisPages'], hasEvents: true }, function () {

    var analysisManager         = {},
        output                  = this.getConsole(),
        eventManager            = this.getEventManager(),
        helper                  = this.getPlugin('helper'),
        analysisPagesDataObj    = this.getDataObject('analysisPages'),
        charts                  = [],
        analysisPages           = {};

    // TODO: Add a method called changeChartPosition or changeChartOrder...

    analysisPagesDataObj.define({
        items: [{
            name        : 'Performances',
            id          : 'performances',
            order       : 1,
            userDefined : false,
            charts      : [{
                    title   : '',
                    chartId : 'performance_bar',
                    order   : 5
                },{
                    title   : '',
                    chartId : 'risk_bar',
                    order   : 4
                }/*,{
                    title: '',
                    chartId: 'performanceTopTen_grid',
                    order: 3
                },{
                    title: '',
                    chartId: 'contributionTopTen_grid',
                    order: 2
                },{
                    title: '',
                    chartId: 'riskTopTen_grid',
                    order: 1
                }*/] 
        },{
            name        : 'Risk',
            id          : 'risk',
            order       : 2,
            userDefined : false,
            charts      : [{
                    chartId: 'risk_bubble',
                    order   : 1
                },{
                    chartId: 'contribution_bar',
                    order   : 2
                }]             
        },{
            name        : 'Asset Allocation',
            id          : 'assetAllocation',
            order       : 3,
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
            order       : 5,
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
            order       : 6,
            userDefined : false,
            charts      : [{
                    chartId: 'performance_column',
                    order   : 1
                },{
                    chartId: 'performance_heatmap',
                    order   : 2
                }]             
        } ,{
            name        : 'Test',
            id          : 'test1',
            order       : 100,
            userDefined : true,
            charts      : [{
                    chartId: 'performance_bar',
                    order   : 1
                },{
                    chartId: 'risk_bar',
                    order   : 2
                }]             
        }]
    });

    // Public
    function restoreDefaults() {
        analysisPages = analysisPagesDataObj.getData();
    }

    function analysisUpdated() {
        // eventManager.raiseEvent('onUpdated', analysisPages);
        eventManager.raiseEvent('onUpdated', analysisPagesDataObj.getData());
    }

    function init(lastUsernameUsed) {
        var userAnalysisPages;
        
        if (lastUsernameUsed) {
            analysisPagesDataObj.loadData(lastUsernameUsed);
        } 

        analysisUpdated();
    }
        
    analysisManager.init = init;
    analysisManager.update = init; // Alias

    return analysisManager;
});