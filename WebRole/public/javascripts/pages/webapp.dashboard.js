// ------------------------------------------
// ANALYSIS DASHBOARD
// ------------------------------------------

WebAppLoader.addModule({ name: 'dashboard', sharedModules: ['chartManager'], hasEvents: true }, function () {
    var dashboard = {},
        chartManager = this.getSharedModule('chartManager'),

        performanceBarChart = {},
        riskBarChart = {},
        attributionBarChart = {},
        attributionColumnChart = {},
        contributionBarChart = {},
        allocationBarChart = {},
        fixedIncomeContributionBarChart = {},
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

    function load() {

        // Performance
        chartManager.load(performanceBarChart);
        chartManager.load(performanceBubbleChart);
        chartManager.load(performanceGrid);

        // Allocation
        chartManager.load(allocationBarChart);
        chartManager.load(allocationPieChart);

        // Risk
        chartManager.load(riskBarChart);
        chartManager.load(riskBubbleChart);

        // Attribution
        chartManager.load(attributionBarChart);
        chartManager.load(attributionColumnChart);

        // Contribution
        chartManager.load(contributionColumnChart);
        chartManager.load(contributionBarChart);

        // Fixed Income
        chartManager.load(fixedIncomeContributionBarChart);
        chartManager.load(carryContributionBarChart);
        chartManager.load(yieldCurveContributionBarChart);
        chartManager.load(riskNumbersBarChart);

        // Fixed Income Exposure
        chartManager.load(interestRatesExposureColumnChart);
        chartManager.load(creditSpreadsExposureColumnChart);
        chartManager.load(dv01ExposureColumnChart);
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
            chartArea: { left: 15, width: '50%', height: '80%' }
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
            chartArea: { left: 15, width: '50%', height: '80%' }
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
            chartArea: { left: 15, width: '50%', height: '80%' }
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
            chartArea: { left: 15, width: '50%', height: '80%' }
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
            vAxis: { title: 'Exposure %' }
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
            vAxis: { title: 'Exposure %' }
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
            vAxis: { title: 'Exposure %' }
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

    dashboard.load = load;

    return dashboard;
});