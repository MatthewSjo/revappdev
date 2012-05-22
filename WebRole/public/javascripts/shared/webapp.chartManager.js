// ------------------------------------------
// CHART MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartManager',
                         sharedModules: ['settings', 'chartDefaults', 'colorManager', 'localizationManager'], 
                         isShared: true, hasEvents: true }, function () {
    var chartBase = {},
        charts = [],
        eventManager = this.getEventManager(),
        chartDefaults = this.getSharedModule('chartDefaults'),
        siteUrls = this.getSharedModule('settings').siteUrls,
        colorManager = this.getSharedModule('colorManager'),
        lang = this.getSharedModule('localizationManager').getLanguage() || {};
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
        chart.oData = config.oData;
        chart.isHeatMap = config.isHeatMap;
        chart.isGradientReversed = config.isGradientReversed;

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

        // Get the current chart type.
        type = chart.getChartType();

        // Define our basic parameters.
        params = {
            type: type,
            timePeriods: chart.timePeriods,
            include: chart.include,
            measures: chart.measures,
            includeMeasuresFor: chart.includeMeasuresFor,
            oData: chart.oData
        };

        $.post(siteUrls.segmentsTreeNode, params, function (data) {
            var dataTable, formatter, i, min, max, values = [], sliceOptions = [];

            output.log(data);

            // Create a new visualization DataTable instance based on the data.
            dataTable = new google.visualization.DataTable(data);

            // Create a new number formatter.
            formatter = new google.visualization.NumberFormat({
                decimalSymbol: lang.decimalSymbol,
                fractionDigits: 3,
                groupingSymbol: lang.groupingSymbol,
                negativeColor: '#cc0000',
                negativeParens: false
            });

            // Loop round the columns, applying the formatter to 'number' columns.
            for (i = 0; i < dataTable.getNumberOfColumns(); i++) {
                if (dataTable.getColumnType(i) === 'number') {
                    formatter.format(dataTable, i);
                }
            }

            // Set the data table for the chart.
            chart.setDataTable(dataTable);

            // If our chart is a pie chart and we're displaying it as a heatmap...
            if (type === 'PieChart' && chart.isHeatMap) {

                // ...collate the heatmap measure from the datatable.
                for (i = 0; i < dataTable.getNumberOfRows(); i++) {
                    values.push(dataTable.getValue(i, 2));
                }

                // Get the highest and lowest values from the heatmap measure values.
                min = Math.min.apply(Math, values);
                max = Math.max.apply(Math, values);

                // Generate absolute minmax values.
                if (Math.abs(min) > Math.abs(max)) {
                    max = Math.abs(min);
                    min = -(Math.abs(min));
                } else {
                    max = Math.abs(max);
                    min = -(Math.abs(max));
                }

                // Loop round the values, and use the colorManager to generate 
                // a colour in the gradient range for that measure value.
                for (i = 0; i < values.length; i++) {
                    sliceOptions.push({
                        color: colorManager.getColorInRange(values[i], min, max, chart.isGradientReversed)
                    });
                }

                chart.setOption('slices', sliceOptions);
            }

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