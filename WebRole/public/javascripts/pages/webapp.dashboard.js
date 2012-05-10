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
        chartManager.load(gridChart);
        chartManager.load(bubbleChart);
        chartManager.load(columnChart);
        chartManager.load(lineChart);
        chartManager.load(treeMapChart);        
    }

    bubbleChart = chartManager.create({
        chartId: 'performance_bubble',
        chartType: 'BubbleChart',
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
        options: {
            vAxis: { title: 'Return %' }
        }
    });

    gridChart = chartManager.create({
        chartId: 'performance_grid',
        chartType: 'Table'
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