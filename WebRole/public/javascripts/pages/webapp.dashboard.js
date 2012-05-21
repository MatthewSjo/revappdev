// ------------------------------------------
// ANALYSIS DASHBOARD
// ------------------------------------------

WebAppLoader.addModule({ name: 'dashboard', sharedModules: ['chartManager'], hasEvents: true }, function () {
    var dashboard = {},
        chartManager = this.getSharedModule('chartManager'),

        performanceBarChart = {},
        performanceTreeMap = {},
        riskBarChart = {},
        attributionBarChart = {},
        attributionColumnChart = {},
        contributionBarChart = {},
        contributionPieChart = {},
        riskTreeMap = {},
        riskPieChart = {},
        allocationBarChart = {},
        fixedIncomeContributionBarChart = {},
        fixedIncomeGrid = {},
        fixedIncomeContributionGrid = {},
        fixedIncomeExposureGrid = {},
        carryContributionBarChart = {},
        yieldCurveContributionBarChart = {},
        riskNumbersBarChart = {},
        performanceBubbleChart = {},
        riskBubbleChart = {},
        contributionColumnChart = {},
        interestRatesExposureColumnChart = {},
        creditSpreadsExposureColumnChart = {},
        dv01ExposureColumnChart = {},
        performanceGrid = {},
        allocationPieChart = {};

    function load(callback) {

        // Performance
        chartManager.load(performanceBarChart);
        chartManager.load(performanceBubbleChart);
        chartManager.load(performanceGrid);
        chartManager.load(performanceTreeMap);

        // Allocation
        chartManager.load(allocationBarChart);
        chartManager.load(allocationPieChart);

        // Risk
        chartManager.load(riskBarChart);
        chartManager.load(riskBubbleChart);
        chartManager.load(riskTreeMap);
        chartManager.load(riskPieChart);

        // Attribution
        chartManager.load(attributionBarChart);
        chartManager.load(attributionColumnChart);

        // Contribution
        chartManager.load(contributionColumnChart);
        chartManager.load(contributionBarChart);
        chartManager.load(contributionPieChart);

        // Fixed Income
        chartManager.load(fixedIncomeContributionBarChart);
        chartManager.load(carryContributionBarChart);
        chartManager.load(yieldCurveContributionBarChart);
        chartManager.load(riskNumbersBarChart);

        chartManager.load(fixedIncomeGrid);
        chartManager.load(fixedIncomeContributionGrid);
        chartManager.load(fixedIncomeExposureGrid);

        // Fixed Income Exposure
        chartManager.load(interestRatesExposureColumnChart);
        chartManager.load(creditSpreadsExposureColumnChart);
        chartManager.load(dv01ExposureColumnChart);

        chartManager.on('onAnalysisLoaded', callback);
    }

    // ------------------------------------------
    // BAR CHARTS
    // ------------------------------------------

    performanceBarChart = chartManager.create({
        chartId: 'performance_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['rp'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            hAxis: { title: 'Return' }
        }
    });

    riskBarChart = chartManager.create({
        chartId: 'risk_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wp', 'contributionvar'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            hAxis: { title: 'Return' }
        }
    });

    allocationBarChart = chartManager.create({
        chartId: 'allocation_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wover'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            hAxis: { title: 'Excess Weight %' }
        }
    });

    contributionBarChart = chartManager.create({
        chartId: 'contribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['ctp'],
        includeMeasuresFor: ['segment', 'securities'],
        options: {
            hAxis: { title: 'Contribution' }
        }
    });

    attributionBarChart = chartManager.create({
        chartId: 'attribution_bar',
        chartType: 'BarChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wendover', 'etotal'],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    fixedIncomeContributionBarChart = chartManager.create({
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

    carryContributionBarChart = chartManager.create({
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

    yieldCurveContributionBarChart = chartManager.create({
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

    riskNumbersBarChart = chartManager.create({
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

    performanceBubbleChart = chartManager.create({
        chartId: 'performance_bubble',
        chartType: 'BubbleChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['stddevann', 'returnannifgtyr', 'wpabsolute'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            hAxis: { title: 'Annualized Volatility' },
            vAxis: { title: 'Annualized Return' }
        }
    });

    riskBubbleChart = chartManager.create({
        chartId: 'risk_bubble',
        chartType: 'BubbleChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            hAxis: { title: '% Value at Risk' },
            vAxis: { title: 'Return' }
        }
    });

    // ------------------------------------------
    // COLUMN CHARTS
    // ------------------------------------------

    contributionColumnChart = chartManager.create({
        chartId: 'contribution_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['ctp', 'ctb'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            vAxis: { title: 'Return %' }
        }
    });

    interestRatesExposureColumnChart = chartManager.create({
        chartId: 'interestRatesExposure_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['interestratesdown100percent', 'interestratesdown50percent', 'interestratesup50percent', 'interestratesup100percent'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            vAxis: { title: 'Exposure %' },
            colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
        }
    });

    creditSpreadsExposureColumnChart = chartManager.create({
        chartId: 'creditSpreadsExposure_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['creditspreadsdown100percent', 'creditspreadsdown50percent', 'creditspreadsup50percent', 'creditspreadsup100percent'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            vAxis: { title: 'Exposure %' },
            colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
        }
    });

    dv01ExposureColumnChart = chartManager.create({
        chartId: 'dv01Exposure_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            vAxis: { title: 'Exposure %' },
            colors: ['#3399CC', '#336699', '#003366']
        }
    });

    attributionColumnChart = chartManager.create({
        chartId: 'attribution_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['etotal', 'ealloc', 'eselecinter'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            colors: ['#003366', '#FF6600', '#990066']
        }
    });

    // ------------------------------------------
    // PIE CHARTS
    // ------------------------------------------

    allocationPieChart = chartManager.create({
        chartId: 'allocation_pie',
        chartType: 'PieChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['wpabsoluteend'],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    contributionPieChart = chartManager.create({
        chartId: 'contribution_pie',
        chartType: 'PieChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        isHeatMap: true,
        isGradientReversed: false,
        measures: ['wpabsoluteend', 'ctp'],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    riskPieChart = chartManager.create({
        chartId: 'risk_pie',
        chartType: 'PieChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        isHeatMap: true,
        isGradientReversed: true,
        measures: ['wpabsoluteend', 'contributionvar'],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    // ------------------------------------------
    // GRIDS
    // ------------------------------------------

    performanceGrid = chartManager.create({
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

    attributionGrid = chartManager.create({
        chartId: 'attribution_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'ctp', 'ctb', 'ealloclocal', 'eselecinterlocal', 'etotalc', 'etotalmca'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    fixedIncomeGrid = chartManager.create({
        chartId: 'fixedIncome_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'ttmpend', 'ytmpend', 'mdpend', 'durwpend', 'spreadpend'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    fixedIncomeContributionGrid = chartManager.create({
        chartId: 'fixedIncomeContribution_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'ctp', 'ctpyc', 'ctpcarry', 'ctpspread', 'ctpcur', 'ctpother', 'ctpresidual'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    fixedIncomeExposureGrid = chartManager.create({
        chartId: 'fixedIncomeExposure_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: [
            'wpend', 'interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'
        ],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    // ------------------------------------------
    // TREE MAP CHARTS
    // ------------------------------------------

    performanceTreeMap = chartManager.create({
        chartId: 'performance_treemap',
        chartType: 'TreeMap',
        timePeriods: 'Earliest',
        include: 'securities',
        measures: ['wpabsoluteend', 'rp'],
        includeMeasuresFor: ['segment', 'securities']
    });

    riskTreeMap = chartManager.create({
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