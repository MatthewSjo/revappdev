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
                    title   : 'Grid of Performance Stats',
                    chartId : 'performance_grid',
                    order   : 1
                },{
                    title   : 'Scatter Chart',
                    chartId : 'performance_bubble',
                    order   : 2
                },{
                    title: 'Bar Chart Segment Return',
                    chartId: 'performance_bar',
                    order: 3
                },{
                    title: 'Tree Map Portfolio Weight vs Return',
                    chartId: 'performance_treemap',
                    order: 4
                },{
                    title: 'Grid of Top 10 Securities by Weight',
                    chartId: 'performanceTopTen_grid',
                    order: 5
                }] 
        },{
            name        : 'Risk',
            id          : 'risk',
            order       : 2,
            userDefined : false,
            charts      : [{
                    title: 'Tree Map Individual Security Weight VaR',
                    chartId: 'risk_treemap',
                    order   : 1
                },{
                    title: 'Bar Chart Weight Vs Contrib to VaR',
                    chartId: 'risk_bar',
                    order   : 2
                },{
                    title: 'Scatter of Portfolio Segment Return / VaR',
                    chartId: 'risk_bubble',
                    order   : 3
                },{
                    title: 'Pie Chart - Heat Map. Portfolio Absolute Weight',
                    chartId: 'risk_pie',
                    order   : 4
                },{
                    title: 'Grid of Top 10 Securities by Risk Weight',
                    chartId: 'riskTopTen_grid',
                    order   : 5
                }]             
        },{
            name        : 'Asset Allocation',
            id          : 'assetAllocation',
            order       : 3,
            userDefined : false,
            charts      : [{
                    title: 'Pie Chart of Portfolio Weight',
                    chartId: 'allocation_pie',
                    order   : 1
                },{
                    title: 'Bar Chart of Relative Weight',    
                    chartId: 'allocation_bar',
                    order   : 2
                }]             
        },{
            name        : 'Contribution',
            id          : 'contribution',
            order       : 4,
            userDefined : false,
            charts      : [{
                    title: 'Pie Chart - Heat Map. Portfolio Weight',
                    chartId: 'contribution_pie',
                    order   : 1
                },{
                    title: 'Column Chart of Portfolio Contribution Vs Benchmark Contribution',
                    chartId: 'contribution_column',
                    order   : 2
                },{
                    title: 'Bar Chart of Security Level Contribution',
                    chartId: 'contribution_bar',
                    order   : 3
                },{
                    title: 'Grid of Top 5 Bottom 5 Securities By Contribution',
                    chartId: 'contributionTopTen_grid',
                    order   : 4
                }]            
        },{
            name        : 'Attribution',
            id          : 'attribution',
            order       : 5,
            userDefined : false,
            charts      : [{
                    title: 'Column Chart of Attribution Effects',
                    chartId: 'attribution_column',
                    order   : 1
                },{
                    title: 'Bar Chart of Relative Weight Vs Total Effects',
                    chartId: 'attribution_bar',
                    order   : 2
                },{
                    title: 'Grid of Total Level Attribution Effects',
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
                    title: 'Fixed Income Contribution',
                    chartId: 'fixedIncomeContribution_bar',
                    order   : 2
                },{
                    title: 'Carry Contribution',
                    chartId: 'carryContribution_bar',
                    order   : 3
                },{
                    title: 'Yield Curve Contribution',
                    chartId: 'yieldCurveContribution_bar',
                    order   : 4
                },{
                    title: 'Risk Numbers',
                    chartId: 'riskNumbers_bar',
                    order   : 5
                },{
                    title: 'Column Charts of Fixed Income Exposures:',
                    chartId: '',
                    order   : 6
                },{
                    title: 'Interest Rates Exposure Column',
                    chartId: 'interestRatesExposure_column',
                    order   : 7
                },{
                    title: 'Credit Spreads Exposure',
                    chartId: 'creditSpreadsExposure_column',
                    order   : 8
                },{
                    title: 'DV01 Exposure Column',
                    chartId: 'dv01Exposure_column',
                    order   : 9
                },{
                    title: 'Grid of Risk Numbers:',
                    chartId: '',
                    order   : 10
                },{
                    title: 'Fixed Income Grid',
                    chartId: 'fixedIncome_grid',
                    order   : 11
                },{
                    title: 'Fixed Income Contribution Grid',
                    chartId: 'fixedIncomeContribution_grid',
                    order   : 12
                },{
                    title: 'Grid of FI Exposure',
                    chartId: '',
                    order   : 13
                },{
                    title: 'Fixed Income Exposure Grid',
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