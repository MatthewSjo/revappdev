// ------------------------------------------
// ANALYSIS DASHBOARD
// ------------------------------------------

WebAppLoader.addModule({ name: 'dashboard', sharedModules: ['chartManager'], hasEvents: true }, function () {
    var dashboard = {},
        chartManager = this.getSharedModule('chartManager'),
        eventManager = this.getEventManager(),
        bubbleChart = {},
        treeMapChart = {},
        columnChart = {},
        gridChart = {},
        lineChart = {},
        chartTotal = 5,
        chartCount = 0;

    function onChartReady() {
        ++chartCount;

        if (chartCount === chartTotal) {
            eventManager.raiseEvent('onAnalysisLoaded');
        }
    }

    function load() {
        // chartManager.load(bubbleChart);
        // chartManager.load(columnChart);
        chartManager.load(gridChart);        
        /* chartManager.load(lineChart);
        chartManager.load(treeMapChart); */
    }

    bubbleChart = chartManager.create({
        chartId: 'performance_bubble',
        chartType: 'BubbleChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            hAxis: { title: 'Annualized Tracking Error' },
            vAxis: { title: 'Annualized Relative Return' }
        }
    });

    treeMapChart = chartManager.create({
        chartId: 'performance_heatmap',
        chartType: 'TreeMap'
    });

    columnChart = chartManager.create({
        chartId: 'performance_column',
        chartType: 'ColumnChart',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['rp'],
        includeMeasuresFor: ['segment', 'childSegments'],
        options: {
            vAxis: { title: 'Return %' }
        }
    });

    gridChart = chartManager.create({
        chartId: 'performance_grid',
        chartType: 'Table',
        timePeriods: 'Earliest',
        include: 'childSegments',
        measures: ['rp', 'valueatriskpercent', 'wpabsolute'],
        includeMeasuresFor: ['segment', 'childSegments']
    });

    lineChart = chartManager.create({
        chartId: 'performance_line',
        chartType: 'LineChart'
    });

    google.visualization.events.addListener(bubbleChart, 'ready', onChartReady);
    google.visualization.events.addListener(treeMapChart, 'ready', onChartReady);
    google.visualization.events.addListener(columnChart, 'ready', onChartReady);
    google.visualization.events.addListener(gridChart, 'ready', onChartReady);
    google.visualization.events.addListener(lineChart, 'ready', onChartReady);

    dashboard.load = load;

    return dashboard;
});