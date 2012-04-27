function setupBubbleChart() {

    var chart;

    function drawChart() {

        chart = new google.visualization.BubbleChart(document.getElementById('performance_bubble'));

        var options = {
            bubble: { textStyle: { fontSize: 0 } },
            chartArea: { left: 80, top: 35, width: '70%', height: '80%' },
            fontName: 'Futura-Medium',
            fontSize: 12,
            forceIFrame: false,
            hAxis: {
                title: 'Annualized Tracking Error',
                titleTextStyle: {
                    fontName: 'Futura-CondensedExtraBold',
                    fontSize: 25
                }
            },
            vAxis: {
                title: 'Annualized Relative Return',
                titleTextStyle: {
                    fontName: 'Futura-CondensedExtraBold',
                    fontSize: 25
                }
            }
        };

        chart.draw(data, options);
    }
    
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Id');
    data.addColumn('number', 'Percentage VaR');
    data.addColumn('number', 'Return');
    data.addColumn('string', 'Name');
    data.addColumn('number', 'Weight');

    data.addRow(['', 19.420096283, 7.541680494, 'Energy', 10.342450990045]);
    data.addRow(['', 14.401156009, -13.551331538, 'Materials', 18.0632319560607]);
    data.addRow(['', 17.75484829, 9.397628542, 'Industrials', 3.29970648578598]);
    data.addRow(['', 15.289599904, 22.82861033, 'Consumer Discretionary', 23.5077476576076]);
    data.addRow(['', 7.634657431, -1.93196855, 'Consumer Staples', 10.0641047816472]);
    data.addRow(['', 6.663360055, -0.372810186, 'Health Care', 7.52279857686852]);
    data.addRow(['', 12.820434373, 6.350423336, 'Financials', 10.6841302745409]);
    data.addRow(['', 16.934144803, 6.379767272, 'Information Technology', 4.37690099017805]);
    data.addRow(['', 4.673076106, 0.87111386, 'Telecommunication Services', 0.914071917635068]);
    data.addRow(['', 10.274613317, 3.404333389, 'Utilities', 11.224856369631]);

    $(document).on('chartContainerReady', drawChart);

    $(document).on('orientationchange', function (event) {
        chart.clearChart();
        drawChart();
    });
}

google.setOnLoadCallback(setupBubbleChart);