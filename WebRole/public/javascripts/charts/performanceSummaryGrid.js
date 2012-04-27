function setupGrid() {

    var grid;

    function drawGrid() {

        grid = new google.visualization.Table(document.getElementById('performance_grid'));

        var options = {
            allowHtml: true,
            alternatingRowStyle: true,
            cssClassNames: {
                headerRow: 'headerRow',
                tableRow: 'tableRow',
                oddTableRow: 'oddTableRow'
            }
        };

        grid.draw(data, options);
    }
    
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Measure');
    data.addColumn('number', 'Portfolio');
    data.addColumn('number', 'Benchmark');

    data.addRow(['Return (USD)', 17.084, 1.547]);
    data.addRow(['Annualised Monthly Return', 5.239, 3.716]);
    data.addRow(['Annualised Volatility', 21.611, 11.737]);
    data.addRow(['Relative Return (USD)', 15.537, 0.000]);
    data.addRow(['Monthly Return', 0.426, 0.305]);
    data.addRow(['Highest Monthly Return', 13.819, 7.374]);
    data.addRow(['Lowest Monthly Return', -11.536, -13.068]);
    data.addRow(['Maximum Loss', 21.957, 14.367]);
    data.addRow(['% Positive Monthly Returns', 46.429, 25.000]);
    data.addRow(['Correlation', 0.299, null]);
    data.addRow(['Alpha', 0.419, null]);
    data.addRow(['Beta', 0.550, null]);
    data.addRow(['R-Squared', 0.089, null]);
    data.addRow(['Sharpe Ratio', 0.242, 0.317]);
    data.addRow(['Treynor Ratio', 9.516, 3.716]);
    data.addRow(['Information Ratio', 0.072, null]);

    $(document).on('chartContainerReady', drawGrid);

    $(document).on('orientationchange', function (event) {
        grid.clearChart();
        drawGrid();
    });
}

google.setOnLoadCallback(setupGrid);