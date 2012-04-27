function setupHeatmapChart() {

    var chart;

    function drawChart() {

        chart = new google.visualization.TreeMap(document.getElementById('performance_heatmap'));

        var options = {
            fontFamily: 'Futura-Medium',
            fontSize: 12,
            forceIFrame: false,
            headerHeight: 25,
            minColor: '#cc0000',
            midColor: '#ffffff',
            maxColor: '#6699cc',
            maxDepth: 3
        };

        // Add pinch handling to climb back up the tree.
        var element = $('#performance_heatmap');

        element.on('pinchIn', function () {
            treemap.goUpAndDraw();
        });

        chart.draw(data, options);
    }

    // Create and populate the data table.
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Location');
    data.addColumn('string', 'Parent');
    data.addColumn('number', 'Portfolio Weight');
    data.addColumn('number', 'Portfolio Return');

    data.addRows([
        ['Total', null, 0, 0],
        ['Energy', 'Total', 0, 0],
        ['Materials', 'Total', 0, 0],
        ['Industrials', 'Total', 0, 0],
        ['Consumer Discretionary', 'Total', 0, 0],
        ['Consumer Staples', 'Total', 0, 0],
        ['Health Care', 'Total', 0, 0],
        ['Financials', 'Total', 0, 0],
        ['Information Technology', 'Total', 0, 0],
        ['Telecommunication Services', 'Total', 0, 0],
        ['Utilities', 'Total', 0, 0],
        ['Unclassified', 'Total', 0, 0],
        ['Energy Level 2', 'Energy', 0, 0],
        ['Materials Level 2', 'Materials', 0, 0],
        ['Capital Goods', 'Industrials', 0, 0],
        ['Consumer Durables & Apparel', 'Consumer Discretionary', 0, 0],
        ['Retailing', 'Consumer Discretionary', 0, 0],
        ['Food & Staples Retailing', 'Consumer Staples', 0, 0],
        ['Food Beverage & Tobacco', 'Consumer Staples', 0, 0],
        ['Pharmaceuticals Biotechnology & Life Sciences', 'Health Care', 0, 0],
        ['Banks', 'Financials', 0, 0],
        ['Insurance', 'Financials', 0, 0],
        ['Real Estate', 'Financials', 0, 0],
        ['Software & Services', 'Information Technology', 0, 0],
        ['Semiconductors & Semiconductor Equipment', 'Information Technology', 0, 0],
        ['Telecommunication Services Level 2', 'Telecommunication Services', 0, 0],
        ['Utilities Level 2', 'Utilities', 0, 0],
        ['BP Plc', 'Energy Level 2', 3.18947937048214, -2.60990147933955],
        ['Tullow Oil Plc', 'Energy Level 2', 7.18025796134332, 95.1769274031484],
        ['Anglo American Plc', 'Materials Level 2', 14.8135995048988, -15.0874825608189],
        ['Lonmin', 'Materials Level 2', 9.54962583618734, -68.3293540086247],
        ['Rolls Royce Group', 'Capital Goods', 3.24736351689266, 75.9695844197175],
        ['Burberry Group', 'Consumer Durables & Apparel', 5.01701218163596, 257.3372161094],
        ['Next Plc', 'Retailing', 12.4007605145769, 226.230621131369],
        ['Tesco Plc', 'Food & Staples Retailing', 2.50407159677734, -4.60976061849586],
        ['Diageo Plc', 'Food Beverage & Tobacco', 7.07987767558531, 84.2205195992627],
        ['Glaxosmithkline Plc', 'Pharmaceuticals Biotechnology & Life Sciences', 8.07269604519012, 35.2703159543191],
        ['Barclays Plc', 'Banks', 1.65974854659096, -31.958454813449],
        ['Aviva Plc', 'Insurance', 2.40658752043966, -15.7940427889188],
        ['Prudential Plc', 'Insurance', 3.56039478489288, 59.8615870368599],
        ['Land Securities Group', 'Real Estate', 4.58369615582763, -24.1826125971253],
        ['Sage Group Plc', 'Software & Services', 1.52279498671978, 57.2909331920891],
        ['ARM Holdings Plc', 'Semiconductors & Semiconductor Equipment', 1.95781911383666, 405.959008215629],
        ['Vodafone Group Plc', 'Telecommunication Services Level 2', 0.960774311735042, 51.5283112594346],
        ['International Power Plc', 'Utilities Level 2', 2.01466420948252, 56.2437766647292],
        ['Severn Trent Plc', 'Utilities Level 2', 8.27877616690493, 45.1200828913694]
    ]);

    $(document).on('chartContainerReady', drawChart);

    $(document).on('orientationchange', function (event) {
        chart.clearChart();
        drawChart();
    });
}

google.setOnLoadCallback(setupHeatmapChart);