// ------------------------------------------
// ANALYSIS DASHBOARD
// ------------------------------------------

WebAppLoader.addModule({ name: 'dashboard', sharedModules: ['chartManager'], hasEvents: true }, function () {
    var dashboard = {},
        chartManager = this.getSharedModule('chartManager');

    var charts = {};

    function load(chartsToLoad) {
        for (var i = 0; i < chartsToLoad.length; i++) {
            chartManager.load(charts[chartsToLoad[i].chartId]);
        }
    }

    // ------------------------------------------
    // BAR CHARTS
    // ------------------------------------------
    
    var performanceBarChart = chartManager.create({
        chartId: 'performance_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['rp'],
        includeMeasuresFor: ['childSegments'],
        options: {
            hAxis: { title: 'Return' }
        }
    });
    charts.performance_bar = performanceBarChart;

    var riskBarChart = chartManager.create({
        chartId: 'risk_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wp', 'contributionvar'],
        includeMeasuresFor: ['childSegments'],
        options: {
            hAxis: { title: 'Return' }
        }
    });

    var allocationBarChart = chartManager.create({
        chartId: 'allocation_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wover'],
        includeMeasuresFor: ['childSegments'],
        options: {
            hAxis: { title: 'Excess Weight %' }
        }
    });

    var contributionBarChart = chartManager.create({
        chartId: 'contribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['ctp'],
        includeMeasuresFor: ['securities'],
        options: {
            hAxis: { title: 'Contribution' }
        }
    });

    var attributionBarChart = chartManager.create({
        chartId: 'attribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wendover', 'etotal'],
        includeMeasuresFor: ['childSegments']
    });

    var fixedIncomeContributionBarChart = chartManager.create({
        chartId: 'fixedIncomeContribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'none',
        measures: ['ctpyc', 'ctpspread', 'ctpcur'],
        includeMeasuresFor: ['segment'],
        options: {
            chartArea: { left: 10, width: '60%', height: '80%' },
            colors: ['#FF6600', '#CC0000', '#FFCC00']
        }
    });

    var carryContributionBarChart = chartManager.create({
        chartId: 'carryContribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'none',
        measures: ['ctpsystcarry', 'ctpspeccarry'],
        includeMeasuresFor: ['segment'],
        options: {
            chartArea: { left: 10, width: '60%', height: '80%' },
            colors: ['#336600', '#990000']
        }
    });

    var yieldCurveContributionBarChart = chartManager.create({
        chartId: 'yieldCurveContribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'none',
        measures: ['ctpshift', 'ctptwist', 'ctpbutterfly', 'ctprolldown'],
        includeMeasuresFor: ['segment'],
        options: {
            chartArea: { left: 10, width: '60%', height: '80%' },
            colors: ['#CD66CD', '#339900', '#FF9900', '#660000']
        }
    });

    var riskNumbersBarChart = chartManager.create({
        chartId: 'riskNumbers_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'none',
        measures: ['ytmpend', 'mdpend'],
        includeMeasuresFor: ['segment'],
        options: {
            chartArea: { left: 10, width: '60%', height: '80%' },
            colors: ['#336699', '#530066']
        }
    });

    // ------------------------------------------
    // BUBBLE CHARTS
    // ------------------------------------------

    var performanceBubbleChart = chartManager.create({
        chartId: 'performance_bubble',
        chartType: 'BubbleChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['stddevann', 'returnannifgtyr', 'wpabsolute'],
        includeMeasuresFor: ['childSegments'],
        options: {
            hAxis: { title: 'Annualized Volatility' },
            vAxis: { title: 'Annualized Return' }
        }
    });
    charts.performance_bubble = performanceBubbleChart;

    var riskBubbleChart = chartManager.create({
        chartId: 'risk_bubble',
        chartType: 'BubbleChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
        includeMeasuresFor: ['childSegments'],
        options: {
            hAxis: { title: '% Value at Risk' },
            vAxis: { title: 'Return' }
        }
    });

    // ------------------------------------------
    // COLUMN CHARTS
    // ------------------------------------------

    var contributionColumnChart = chartManager.create({
        chartId: 'contribution_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['ctp', 'ctb'],
        includeMeasuresFor: ['childSegments'],
        options: {
            vAxis: { title: 'Return %' }
        }
    });

    var interestRatesExposureColumnChart = chartManager.create({
        chartId: 'interestRatesExposure_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['interestratesdown100percent', 'interestratesdown50percent', 'interestratesup50percent', 'interestratesup100percent'],
        includeMeasuresFor: ['childSegments'],
        options: {
            vAxis: { title: 'Exposure %' },
            colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
        }
    });

    var creditSpreadsExposureColumnChart = chartManager.create({
        chartId: 'creditSpreadsExposure_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['creditspreadsdown100percent', 'creditspreadsdown50percent', 'creditspreadsup50percent', 'creditspreadsup100percent'],
        includeMeasuresFor: ['childSegments'],
        options: {
            vAxis: { title: 'Exposure %' },
            colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
        }
    });

    var dv01ExposureColumnChart = chartManager.create({
        chartId: 'dv01Exposure_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'],
        includeMeasuresFor: ['childSegments'],
        options: {
            vAxis: { title: 'Exposure %' },
            colors: ['#3399CC', '#336699', '#003366']
        }
    });

    var attributionColumnChart = chartManager.create({
        chartId: 'attribution_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['etotal', 'ealloc', 'eselecinter'],
        includeMeasuresFor: ['childSegments'],
        options: {
            colors: ['#003366', '#FF6600', '#990066']
        }
    });

    // ------------------------------------------
    // PIE CHARTS
    // ------------------------------------------

    var allocationPieChart = chartManager.create({
        chartId: 'allocation_pie',
        chartType: 'PieChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wpabsoluteend'],
        includeMeasuresFor: ['childSegments']
    });

    var contributionPieChart = chartManager.create({
        chartId: 'contribution_pie',
        chartType: 'PieChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        isHeatMap: true,
        isGradientReversed: false,
        measures: ['wpabsoluteend', 'ctp'],
        includeMeasuresFor: ['childSegments']
    });

    var riskPieChart = chartManager.create({
        chartId: 'risk_pie',
        chartType: 'PieChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        isHeatMap: true,
        isGradientReversed: true,
        measures: ['wpabsoluteend', 'contributionvar'],
        includeMeasuresFor: ['childSegments']
    });

    // ------------------------------------------
    // GRIDS
    // ------------------------------------------

    var performanceGrid = chartManager.create({
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
    });

    var attributionGrid = chartManager.create({
        chartId: 'attribution_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'ctp', 'ctb', 'ealloclocal', 'eselecinterlocal', 'etotalc', 'etotalmca'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    var fixedIncomeGrid = chartManager.create({
        chartId: 'fixedIncome_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'ttmpend', 'ytmpend', 'mdpend', 'durwpend', 'spreadpend'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    var fixedIncomeContributionGrid = chartManager.create({
        chartId: 'fixedIncomeContribution_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'ctp', 'ctpyc', 'ctpcarry', 'ctpspread', 'ctpcur', 'ctpother', 'ctpresidual'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    var fixedIncomeExposureGrid = chartManager.create({
        chartId: 'fixedIncomeExposure_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'wpend', 'interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    var performanceTopTenGrid = chartManager.create({
        chartId: 'performanceTopTen_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['wpend', 'rp', 'ctp'],
        oData: { orderby: 'wpend-Earliest desc', top: 10 },
        includeMeasuresFor: ['securities']
    });
    charts.performanceTopTen_grid = performanceTopTenGrid;

    var contributionTopTenGrid = chartManager.create({
        chartId: 'contributionTopTen_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['wpend', 'rp', 'ctp'],
        oData: { orderby: 'ctp-Earliest desc', top: 10 },
        includeMeasuresFor: ['securities']
    });
    charts.contributionTopTen_grid = contributionTopTenGrid;

    var riskTopTenGrid = chartManager.create({
        chartId: 'riskTopTen_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['wpend', 'expectedshortfallpercent', 'valueatriskpercent', 'expectedvolatilitypercent'],
        oData: { orderby: 'valueatriskpercent-Earliest desc', top: 10 },
        includeMeasuresFor: ['securities']
    });
    charts.riskTopTen_grid = riskTopTenGrid;

    // ------------------------------------------
    // TREE MAP CHARTS
    // ------------------------------------------

    var performanceTreeMap = chartManager.create({
        chartId: 'performance_treemap',
        chartType: 'TreeMap',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['wpabsoluteend', 'rp'],
        includeMeasuresFor: ['segment', 'securities']
    });

    var riskTreeMap = chartManager.create({
        chartId: 'risk_treemap',
        chartType: 'TreeMap',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wpabsoluteend', 'contributionvar'],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    dashboard.load = load;

    return dashboard;
});