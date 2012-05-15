// ------------------------------------------
// CHART MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartManager', sharedModules: ['settings', 'chartDefaults'], isShared: true }, function () {
    var chartBase = {},
        charts = [],
        chartDefaults = this.getSharedModule('chartDefaults'),
        siteUrls = this.getSharedModule('settings').siteUrls,
        output = this.getConsole();

    function overrideDefaults(defaults, overrides) {
        var property;

        if (defaults) {
            for (property in overrides) {
                if (defaults[property] === undefined) {
                    defaults[property] = overrides[property];
                }
            }
        }

        return defaults;
    }

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

        // Apply our overrides if any were specified.
        options = overrideDefaults(defaults, options);

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

        // Return our chart.
        return chart;
    }

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
        });
    }

    function registerChart(chart) {
        // Store a reference to this chart in our charts array.
        charts.push(chart);
    }

    function unregisterChart(chartObj) {
        var index;

        // Attempt to find the requested chart in our array.
        index = $.inArray(chart, charts);

        // If present, remove it from the collection.
        if (index && index !== -1) {
            charts.splice(index, 1);
        }
    }

    function clearRegisteredCharts() {
        charts.length = 0;
    }

    chartBase.create = create;
    chartBase.load = load;
    chartBase.registerChart = registerChart;
    chartBase.unregisterChart = unregisterChart;
    chartBase.clearRegisteredCharts = clearRegisteredCharts;

    return chartBase;
});