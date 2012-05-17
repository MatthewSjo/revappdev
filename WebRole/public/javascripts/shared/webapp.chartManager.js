// ------------------------------------------
// CHART MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartManager', sharedModules: ['settings', 'chartDefaults'], isShared: true, hasEvents: true }, function () {
    var chartBase = {},
        charts = [],
        eventManager = this.getEventManager(),
        chartDefaults = this.getSharedModule('chartDefaults'),
        siteUrls = this.getSharedModule('settings').siteUrls,
        output = this.getConsole(),
        chartCount = 0,
        chartTotal = 0;

    // Function to be called when the chart has successfully loaded and drawn itself.
    function onChartReady() {
        // If all of the charts created have been loaded...
        if (++chartCount === chartTotal) {
            // ...fire the onAnalysisLoaded event.
            eventManager.raiseEvent('onAnalysisLoaded');
        }
    }

    // Function to create a new chart.
    // 'config' - An object containing configuration properties for the chart to be created.
    function create(config) {
        var id = config.chartId,
            type = config.chartType,
            options = config.options || {},
            defaults = {},
            chart = null;

        // Return nothing if a chart ID or chart type has not been specified.
        if (!id || !type) {
            output.log('Chart ID or type is not specified.');
            return;
        }

        // Retrieve the defaults for the given chart type, if available.
        defaults = (chartDefaults && chartDefaults[type])
            ? chartDefaults[type]
            : {};

        // Apply defaults then any overrides to a new object.
        options = $.extend({}, defaults, options);

        // Create a new visualization wrapper instance, using the type, options and ID.
        chart = new google.visualization.ChartWrapper({
            chartType: type,
            options: options,
            containerId: id
        });

        // Although it's not part of the Google API, store 
        // the parameters for this chart in the object.
        chart.timePeriods = config.timePeriods;
        chart.include = config.include;
        chart.measures = config.measures;
        chart.includeMeasuresFor = config.includeMeasuresFor;

        // Increase the running chart total.
        chartTotal++;

        // Register the chart with the ready event listener.
        google.visualization.events.addListener(chart, 'ready', onChartReady);

        // Return the chart.
        return chart;
    }

    // Function to load the given chart with data.
    // 'chart'  - The instance of the Google Visualization API chart object to load.
    function load(chart) {
        var type, params;

        // Don't attempt to load the chart if it doesn't exist yet.
        if (chart === null) {
            return;
        }

        // Define our basic parameters.
        params = {
            type: chart.getChartType(),
            timePeriods: chart.timePeriods,
            include: chart.include,
            measures: chart.measures,
            includeMeasuresFor: chart.includeMeasuresFor
        };

        $.post(siteUrls.segmentsTreeNode, params, function (data) {
            var dataTable;

            output.log(data);

            // Create a new visualization DataTable instance based on the data.
            dataTable = new google.visualization.DataTable(data);

            // Set the data table for the chart.
            chart.setDataTable(dataTable);

            // Draw the chart.
            chart.draw();

            // Set up the chart to be redrawn on change of orientation.
            $(document).on('orientationchange', function (event) {
                chart.draw();
            });
        });
    }

    chartBase.create = create;
    chartBase.load = load;

    return chartBase;
});