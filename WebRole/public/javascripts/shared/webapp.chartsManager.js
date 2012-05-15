// ------------------------------------------
// CHARTS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartsManager', plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var chartsManager = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper')
        charts          = { items: [] };


    // Private
    function addChart(chart) {

        /* ----------------------- ON/OFF ----------------------- /

        var chartId = '';

        chartId = (chart && chart.chartId)
            ? chart.name
            : null;

        if (chartId) {
            // If the object already exists throw an error.
            if (helper.hasValue(charts[chartId])) {
                throw('chartsManager.addChart: chart already exists!', chartId);
            } else {
                charts[chartId] = chart;
            }
        }

        // ------------------------------------------------------ */

        if (chart && chart.chartId) {
            charts.items.push(chart);
        }
    }

    // ------------------------------------------
    // CHARTS
    // ------------------------------------------

    // A generic bubble chart
    addChart({
        chartName   : 'Performance Bubble Chart',
        chartId     : 'performance_bubble',
        chartType   : 'BubbleChart',
        options     : {
            hAxis: { title: 'Annualized Tracking Error' }, // TODO: Localize titles.
            vAxis: { title: 'Annualized Relative Return' }
        }
    });

    // A generic bubble tree map chart
    addChart({
        chartName   : 'Performance Tree Map Chart',
        chartId     : 'performance_heatmap',
        chartType   : 'TreeMap'
    });

    // A generic column chart
    addChart({
        chartName   : 'Performance Column Chart',
        chartId     : 'performance_column',
        chartType   : 'ColumnChart',
        options     : {
            vAxis: { title: 'Return %' } // TODO: Localize title.
        }
    });

    // A generic grid chart
    addChart({
        chartName   : 'Performance Grid Chart', 
        chartId     : 'performance_grid',
        chartType   : 'Table'
    });
    
    // A generic line chart
    addChart({
        chartName   : 'Performance Line Chart',
        chartId     : 'performance_line',
        chartType   : 'LineChart'
    });

    // Public
    function getCharts() {
        return charts.items;
    }

    chartsManager.getCharts = getCharts;

    return chartsManager;
});