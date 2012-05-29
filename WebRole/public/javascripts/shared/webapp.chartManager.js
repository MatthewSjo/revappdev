// ------------------------------------------
// CHART MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartManager',
    sharedModules: ['settings', 'chartDefaults', 'colorManager', 'localizationManager'],
    isShared: true, hasEvents: true
}, function () {
    var chartBase = {},
        charts = [],
        eventManager = this.getEventManager(),
        chartDefaults = this.getSharedModule('chartDefaults'),
        siteUrls = this.getSharedModule('settings').siteUrls,
        colorManager = this.getSharedModule('colorManager'),
        lang = this.getSharedModule('localizationManager').getLanguage() || {},
        output = this.getConsole(),
        chartCount = 0,
        chartTotal = 0,
        isLoading = false;

    function resetCounter() {
        chartCount = 0;
        chartTotal = 0;
        isLoading = false;
    }

    function startCounter() {
        resetCounter();
        isLoading = true;
    }

    function stopCounter() {
        resetCounter();
    }


    // Function to be called when the chart has successfully loaded and drawn itself.
    function onChartReady() {
        if (isLoading) {
            chartCount += 1;
            eventManager.raiseEvent('onAnalysisLoading', chartCount, chartTotal);
            
            // If all of the charts created have been loaded...
            if (chartCount === chartTotal) {
                // ...fire the onAnalysisLoaded event.
                stopCounter();
                eventManager.raiseEvent('onAnalysisLoaded');
            }
        }
    }

    // Function to create a new chart.
    // 'config' - An object containing configuration properties for the chart to be created.
    function create(config) {
        if (!config) {
            output.log('Config is not specified.');
            return;
        }

        var id = config.chartId || null,
            type = config.chartType || null,
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
        chart.endDate = config.endDate;
        chart.include = config.include;
        chart.includeMeasuresFor = config.includeMeasuresFor;
        chart.isGradientReversed = config.isGradientReversed;
        chart.isHeatMap = config.isHeatMap;
        chart.measures = config.measures;
        chart.oData = config.oData;
        chart.seriesType = config.seriesType;
        chart.startDate = config.startDate;
        chart.timePeriods = config.timePeriods;

        // Register the chart with the ready event listener.
        google.visualization.events.addListener(chart, 'ready', onChartReady);

        // Return the chart.
        return chart;
    }

    // Function to load the given chart with data.
    // 'chart'  - The instance of the Google Visualization API chart object to load.
    function load(chart, newRequest) {
        var type, params, url, formatter;

        // Don't attempt to load the chart if it doesn't exist yet.
        if (!chart) {
            return;
        }

        // Restart the counter every new request.
        if (newRequest) {
            startCounter();
        }

        // Increase the running chart total.
        chartTotal++;

        // Get the current chart type.
        type = chart.getChartType();

        // Create a new number formatter.
        formatter = new google.visualization.NumberFormat({
            decimalSymbol: lang.decimalSymbol,
            fractionDigits: 3,
            groupingSymbol: lang.groupingSymbol,
            negativeColor: '#cc0000',
            negativeParens: false
        });

        // Define our basic parameters.
        params = {
            type: type
        };

        // Only include parameters in the object if they exist.
        if (chart.endDate) { params.endDate = chart.endDate; }
        if (chart.include) { params.include = chart.include; }
        if (chart.includeMeasuresFor) { params.includeMeasuresFor = chart.includeMeasuresFor; }
        if (chart.measures) { params.measures = chart.measures; }
        if (chart.oData) { params.oData = chart.oData; }
        if (chart.startDate) { params.startDate = chart.startDate; }
        if (chart.seriesType) { params.seriesType = chart.seriesType; }
        if (chart.timePeriods) { params.timePeriods = chart.timePeriods; }

        // Define the correct URL to use to retrieve data based on the chart type.
        url = (type === 'LineChart') ? siteUrls.timeSeries : siteUrls.segmentsTreeNode;

        // Callback function to be invoked when data is returned from the server.
        function onDataLoaded(data) {
            var dataTable, i, min, max, values = [], sliceOptions = [];

            output.log(data);

            // Create a new visualization DataTable instance based on the data.
            dataTable = new google.visualization.DataTable(data);

            // Loop round the columns, applying the formatter to 'number' columns.
            for (i = 0; i < dataTable.getNumberOfColumns(); i++) {
                if (dataTable.getColumnType(i) === 'number') {
                    formatter.format(dataTable, i);
                }
            }

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

            // Set the data table for the chart.
            chart.setDataTable(dataTable);

            // Draw the chart.
            chart.draw();

            // Set up the chart to be redrawn on change of orientation.
            $(document).on('orientationchange', function (event) {
                chart.draw();
            });
        }

        // Attempt to load the data.
        // NOTE: The dataType is set to 'text' rather than 'json' to stop Zepto
        // attempting to parse dates which the Google Visualization API expects 
        // to parse itself, causing an error.
        $.post(url, params, onDataLoaded, 'text');
    }

    chartBase.create = create;
    chartBase.load = load;

    return chartBase;
});