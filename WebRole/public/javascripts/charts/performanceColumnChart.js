function setupChart() {

    var chart;

    function drawChart() {

        chart = new google.visualization.ColumnChart(document.getElementById('absolute_performance'));

        var options = {
            chartArea: { right: 0, width: '85%', height: '80%' },
            colors: ['#18c900', '#CC0000'],
            fontName: 'Futura-Medium',
            fontSize: 12,
            forceIFrame: false,
            isStacked: true,
            legend: 'none',
            vAxis: {
                title: 'Return %',
                titleTextStyle: {
                    fontName: 'Futura-CondensedExtraBold',
                    fontSize: 25
                }
            }
        };

        chart.draw(data, options);
    }
    
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Name');
    data.addColumn('number', 'Positive Return');
    data.addColumn('number', 'Negative Return');

    data.addRow(['Dec 09', 3.42, null]);
    data.addRow(['Jan 10', null, -5.57]);
    data.addRow(['Feb 10', null, -0.59]);
    data.addRow(['Mar 10', 7.10, null]);
    data.addRow(['Apr 10', null, -4.13]);
    data.addRow(['May 10', null, -10.82]);
    data.addRow(['Jun 10', null, -3.74]);
    data.addRow(['Jul 10', 12.64, null]);
    data.addRow(['Aug 10', null, -2.11]);
    data.addRow(['Sep 10', 9.44, null]);
    data.addRow(['Oct 10', 5.14, null]);
    data.addRow(['Nov 10', null, -3.56]);
    data.addRow(['Dec 10', 7.43, null]);
    data.addRow(['Jan 11', 0.83, null]);
    data.addRow(['Feb 11', 3.99, null]);
    data.addRow(['Mar 11', null, -1.79]);
    data.addRow(['Apr 11', 6.22, null]);
    data.addRow(['May 11', null, -2.38]);
    data.addRow(['Jun 11', null, -1.99]);
    data.addRow(['Jul 11', 0.10, null]);
    data.addRow(['Aug 11', null, -7.89]);
    data.addRow(['Sep 11', null, -11.54]);
    data.addRow(['Oct 11', 13.82, null]);
    data.addRow(['Nov 11', null, -2.70]);
    data.addRow(['Dec 11', null, -0.80]);
    data.addRow(['Jan 12', 5.58, null]);
    data.addRow(['Feb 12', 3.54, null]);
    data.addRow(['Mar 12', null, -2.30]);

    $(document).on('chartContainerReady', drawChart);

    $(document).on('orientationchange', function (event) {
        chart.clearChart();
        drawChart();
    });
}

google.setOnLoadCallback(setupChart);