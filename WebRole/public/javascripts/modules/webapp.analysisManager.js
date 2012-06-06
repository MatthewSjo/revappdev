// ------------------------------------------
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
                    chartId : 'performance_grid',
                    order   : 1
                },{
                    chartId : 'performance_bubble',
                    order   : 2
                },{
                    chartId: 'performance_bar',
                    order: 3
                },{
                    chartId: 'performance_treemap',
                    order: 4
                },{
                    chartId: 'performanceTopTen_grid',
                    order: 5
                }] 
        },{
            name        : 'Risk',
            id          : 'risk',
            order       : 2,
            userDefined : false,
            charts      : [{
                    chartId: 'risk_treemap',
                    order   : 1
                },{
                    chartId: 'risk_bar',
                    order   : 2
                },{
                    chartId: 'risk_bubble',
                    order   : 3
                },{
                    chartId: 'risk_pie',
                    order   : 4
                },{
                    chartId: 'riskTopTen_grid',
                    order   : 5
                }]             
        },{
            name        : 'Asset Allocation',
            id          : 'assetAllocation',
            order       : 3,
            userDefined : false,
            charts      : [{
                    chartId: 'allocation_pie',
                    order   : 1
                },{
                    chartId: 'allocation_bar',
                    order   : 2
                }]             
        },{
            name        : 'Contribution',
            id          : 'contribution',
            order       : 4,
            userDefined : false,
            charts      : [{
                    chartId: 'contribution_pie',
                    order   : 1
                },{
                    chartId: 'contribution_column',
                    order   : 2
                },{
                    chartId: 'contribution_bar',
                    order   : 3
                },{
                    chartId: 'contributionTopTen_grid',
                    order   : 4
                }]            
        },{
            name        : 'Attribution',
            id          : 'attribution',
            order       : 5,
            userDefined : false,
            charts      : [{
                    chartId: 'attribution_column',
                    order   : 1
                },{
                    chartId: 'attribution_bar',
                    order   : 2
                },{
                    chartId: 'attribution_grid',
                    order   : 3
                }]              
        },{
            name        : 'Fixed Income',
            id          : 'fixedIncome',
            order       : 6,
            userDefined : false,
            charts      : [{
                    title: 'Bar Charts of Fixed Income Contributions:',
                    chartId: '',
                    order   : 1
                },{
                    chartId: 'fixedIncomeContribution_bar',
                    order   : 2
                },{
                    chartId: 'carryContribution_bar',
                    order   : 3
                },{
                    chartId: 'yieldCurveContribution_bar',
                    order   : 4
                },{
                    chartId: 'riskNumbers_bar',
                    order   : 5
                },{
                    title: 'Column Charts of Fixed Income Exposures:',
                    chartId: '',
                    order   : 6
                },{
                    chartId: 'interestRatesExposure_column',
                    order   : 7
                },{
                    chartId: 'creditSpreadsExposure_column',
                    order   : 8
                },{
                    chartId: 'dv01Exposure_column',
                    order   : 9
                },{
                    title: 'Grid of Risk Numbers:',
                    chartId: '',
                    order   : 10
                },{
                    chartId: 'fixedIncome_grid',
                    order   : 11
                },{
                    chartId: 'fixedIncomeContribution_grid',
                    order   : 12
                },{
                    title: 'Grid of FI Exposure',
                    chartId: '',
                    order   : 13
                },{
                    chartId: 'fixedIncomeExposure_grid',
                    order   : 14
                }]   
        } ,{
            name        : 'User Defined Test Page',
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