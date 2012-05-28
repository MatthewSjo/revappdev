// ------------------------------------------
// CHARTS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartComponents', plugins: ['helper'], sharedModules: ['chartManager'],
    dataObjects: ['charts'], hasEvents: true, isShared: true }, function () {
    
    var chartComponents     = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper'),
        chartManager        = this.getSharedModule('chartManager'),
        createdCharts       = {},
        chartsDataObject    = this.getDataObject('charts'),
        chartsData          = null;


    chartsDataObject.define({
        // ------------------------------------------
        // BAR CHARTS
        // ------------------------------------------

        'performance_bar': {
            chartId: 'performance_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['rp'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }},
        'risk_bar': {
            chartId: 'risk_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['wp', 'contributionvar'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }},
        'allocation_bar': {
            chartId: 'allocation_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['wover'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Excess Weight %' }
            }},
        'contribution_bar': {
            chartId: 'contribution_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'securities',
            measures: ['ctp'],
            includeMeasuresFor: ['securities'],
            options: {
                hAxis: { title: 'Contribution' }
            }},
        'attribution_bar': {
            chartId: 'attribution_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['wendover', 'etotal'],
            includeMeasuresFor: ['childSegments']
        },
        'fixedIncomeContribution_bar': {
            chartId: 'fixedIncomeContribution_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'none',
            measures: ['ctpyc', 'ctpspread', 'ctpcur'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#FF6600', '#CC0000', '#FFCC00']
            }},
        'carryContribution_bar': {
            chartId: 'carryContribution_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'none',
            measures: ['ctpsystcarry', 'ctpspeccarry'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336600', '#990000']
            }},
        'yieldCurveContribution_bar': {
            chartId: 'yieldCurveContribution_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'none',
            measures: ['ctpshift', 'ctptwist', 'ctpbutterfly', 'ctprolldown'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#CD66CD', '#339900', '#FF9900', '#660000']
            }},
        'riskNumbers_bar': {
            chartId: 'riskNumbers_bar',
            chartType: 'BarChart',
            timePeriods: 'Earliest',
            include: 'none',
            measures: ['ytmpend', 'mdpend'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336699', '#530066']
            }},
        
    // ------------------------------------------
    // BUBBLE CHARTS
    // ------------------------------------------
        
        'performance_bubble': {
            chartId: 'performance_bubble',
            chartType: 'BubbleChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['stddevann', 'returnannifgtyr', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Annualized Volatility' },
                vAxis: { title: 'Annualized Return' }
            }},
        'risk_bubble': {
            chartId: 'risk_bubble',
            chartType: 'BubbleChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: '% Value at Risk' },
                vAxis: { title: 'Return' }
            }},

    // ------------------------------------------
    // COLUMN CHARTS
    // ------------------------------------------
        
        'contribution_column': {
            chartId: 'contribution_column',
            chartType: 'ColumnChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['ctp', 'ctb'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Return %' }
            }},
        'interestRatesExposure_column': {
            chartId: 'interestRatesExposure_column',
            chartType: 'ColumnChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['interestratesdown100percent', 'interestratesdown50percent', 'interestratesup50percent', 'interestratesup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }},
        'creditSpreadsExposure_column': {
            chartId: 'creditSpreadsExposure_column',
            chartType: 'ColumnChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['creditspreadsdown100percent', 'creditspreadsdown50percent', 'creditspreadsup50percent', 'creditspreadsup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }},
        'dv01Exposure_column': {
            chartId: 'dv01Exposure_column',
            chartType: 'ColumnChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#3399CC', '#336699', '#003366']
            }},
        'attribution_column': {
            chartId: 'attribution_column',
            chartType: 'ColumnChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['etotal', 'ealloc', 'eselecinter'],
            includeMeasuresFor: ['childSegments'],
            options: {
                colors: ['#003366', '#FF6600', '#990066']
            }},

    // ------------------------------------------
    // PIE CHARTS
    // ------------------------------------------
        
        'allocation_pie': {
            chartId: 'allocation_pie',
            chartType: 'PieChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['wpabsoluteend'],
            includeMeasuresFor: ['childSegments']
        },
        'contribution_pie': {
            chartId: 'contribution_pie',
            chartType: 'PieChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: false,
            measures: ['wpabsoluteend', 'ctp'],
            includeMeasuresFor: ['childSegments']
        },
        'risk_pie': {
            chartId: 'risk_pie',
            chartType: 'PieChart',
            timePeriods: 'Earliest',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: true,
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['childSegments']
        },

    // ------------------------------------------
    // GRIDS
    // ------------------------------------------

        'performance_grid': {
            chartId: 'performance_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'none',
            measures: [
                'rp', 'returnann', 'stddevann', 'relr',
                'periodaverage', 'oneperiodhigh', 'oneperiodlow',
                'maxloss', 'percentpositiveperiods', 'correlation',
                'alpha', 'beta', 'rsquared', 'sharperatio',
                'treynorratio', 'inforatioxs'
            ],
            includeMeasuresFor: ['segment']
        },
        'attribution_grid': {
            chartId: 'attribution_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: [
                'ctp', 'ctb', 'ealloclocal', 'eselecinterlocal', 'etotalc', 'etotalmca'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncome_grid': {
            chartId: 'fixedIncome_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: [
                'ttmpend', 'ytmpend', 'mdpend', 'durwpend', 'spreadpend'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeContribution_grid': {
            chartId: 'fixedIncomeContribution_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: [
                'ctp', 'ctpyc', 'ctpcarry', 'ctpspread', 'ctpcur', 'ctpother', 'ctpresidual'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeExposure_grid': {
            chartId: 'fixedIncomeExposure_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: [
                'wpend', 'interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'performanceTopTen_grid': {
            chartId: 'performanceTopTen_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'wpend-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'contributionTopTen_grid': {
            chartId: 'contributionTopTen_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'ctp-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'riskTopTen_grid': {
            chartId: 'riskTopTen_grid',
            chartType: 'Table',
            timePeriods: 'Earliest',
            include: 'securities',
            measures: ['wpend', 'expectedshortfallpercent', 'valueatriskpercent', 'expectedvolatilitypercent'],
            oData: { orderby: 'valueatriskpercent-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
    
    // ------------------------------------------
    // TREE MAP CHARTS
    // ------------------------------------------

        'performance_treemap': {
            chartId: 'performance_treemap',
            chartType: 'TreeMap',
            timePeriods: 'Earliest',
            include: 'securities',
            measures: ['wpabsoluteend', 'rp'],
            includeMeasuresFor: ['segment', 'securities']
        },
        'risk_treemap': {
            chartId: 'risk_treemap',
            chartType: 'TreeMap',
            timePeriods: 'Earliest',
            include: 'childSegments',
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['segment', 'childSegments']
        }
    });

    chartsData = chartsDataObject.getData();

    // Public
    function load(chartsToLoad) {
        var chartToLoad, chartId;

        for (var i = 0; i < chartsToLoad.length; i++) {
            chartId = chartsToLoad[i].chartId;
            // If the chart has been created...
            if(createdCharts[chartId]) {
                // Use it else...
                chartToLoad = createdCharts[chartId];
            } else {
                // Create a new chart and return it.
                chartToLoad = chartManager.create(chartsData[chartId])
                createdCharts[chartId] = chartToLoad;
            }

            chartManager.load(chartToLoad);
        }
    }

    // TODO: Investigate...
    chartManager.on('onAnalysisLoaded', function(){
        // eventManager.raiseEvent('onAnalysisLoaded');
    });

    chartComponents.load = load;

    return chartComponents;
});