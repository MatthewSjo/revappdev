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
        output = this.getConsole();

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
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        hAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        },
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // COLUMN CHART
    columnChart = {
        chartArea: { right: 0, width: '85%', height: '80%' },
        colors: ['#18c900', '#CC0000'],
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        isStacked: true,
        legend: 'none',
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // GAUGE CHART
    gaugeChart = {
        forceIFrame: commonSettings.forceIFrame,
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
        forceIFrame: commonSettings.forceIFrame,
        cssClassNames: {
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow'
        }
    };

    // LINE CHART
    lineChart = {
        chartArea: { left: 80, top: 35, width: '75%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame
    };

    // TREE MAP (HEATMAP) CHART
    treeMapChart = {
        fontFamily: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
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

    chartDefaults.set = changeSetting; // Alias

    return chartDefaults;
});