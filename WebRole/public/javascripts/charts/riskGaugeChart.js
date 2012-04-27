function setupGaugeChart() {

    var chart;

    function drawChart() {

        chart = new google.visualization.Gauge(document.getElementById('risk_gauge'));

        var options = {
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

        chart.draw(data, options);
    }

    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['% VaR', 3.452],
        ['Annualized Volatility', 23.801]
    ]);

    $(document).on('chartContainerReady', drawChart);

    $(document).on('orientationchange', function (event) {
        chart.clearChart();
        drawChart();
    });
}

google.setOnLoadCallback(setupGaugeChart);