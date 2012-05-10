// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartDefaults', isShared: true }, function () {
    var chartDefaults = {},
        commonSettings = {},
        bubbleChart = {},
        columnChart = {},
        gaugeChart = {},
        gridChart = {},
        lineChart = {},
        treeMapChart = {},
        output = this.loader.output || {};

    // COMMON CHART SETTINGS
    commonSettings = {
        forceIFrame: false,
        labelFontName: 'Futura-Medium',
        labelFontSize: 12,
        titleFontName: 'Futura-CondensedExtraBold',
        titleFontSize: 25
    };

    // BUBBLE CHART
    bubbleChart = {
        chartArea: { left: 80, top: 35, width: '70%', height: '80%' },
        fontName: '',
        fontSize: 12,
        forceIFrame: false,
        hAxis: {
            titleTextStyle: {
                fontName: '',
                fontSize: 25
            }
        },
        vAxis: {
            titleTextStyle: {
                fontName: 'Futura-CondensedExtraBold',
                fontSize: 25
            }
        }
    };

    // COLUMN CHART
    columnChart = {
        chartArea: { right: 0, width: '85%', height: '80%' },
        colors: ['#18c900', '#CC0000'],
        fontName: 'Futura-Medium',
        fontSize: 12,
        forceIFrame: false,
        isStacked: true,
        legend: 'none',
        vAxis: {
            titleTextStyle: {
                fontName: 'Futura-CondensedExtraBold',
                fontSize: 25
            }
        }
    };

    // GAUGE CHART
    gaugeChart = {
        forceIFrame: false,
        height: 250,
        greenFrom: 0,
        greenTo: 4,
        yellowFrom: 4,
        yellowTo: 6,
        redFrom: 6,
        redTo: 20,
        max: 20,
        minorTicks: 5
    };

    // GRID CHART
    gridChart = {
        allowHtml: true,
        alternatingRowStyle: true,
        cssClassNames: {
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow'
        }
    };

    // LINE CHART
    lineChart = {
        chartArea: { left: 80, top: 35, width: '75%', height: '80%' },
        fontName: 'Futura-Medium',
        fontSize: 12,
        forceIFrame: false
    };

    // TREE MAP (HEATMAP) CHART
    treeMapChart = {
        fontFamily: 'Futura-Medium',
        fontSize: 12,
        forceIFrame: false,
        headerHeight: 25,
        minColor: '#cc0000',
        midColor: '#ffffff',
        maxColor: '#6699cc',
        maxDepth: 3
    };

    function changeSetting(key, value) {
        commonSettings[key] = value;
        output.log('change setting');
    }

    // Assign the specific chart defaults to the container object.
    chartDefaults.BubbleChart = bubbleChart;
    chartDefaults.ColumnChart = columnChart;
    chartDefaults.Gauge = gaugeChart;
    chartDefaults.LineChart = lineChart;
    chartDefaults.Table = gridChart;
    chartDefaults.TreeMap = treeMapChart;

    // 
    chartDefaults.set = changeSetting; // Alias

    return chartDefaults;
});