google.load('visualization', '1', { packages: ['treemap', 'table'] });

function drawVisualization() {
    
    // Create and populate the data table.
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Location');
    data.addColumn('string', 'Parent');
    data.addColumn('number', 'Market trade volume (size)');
    data.addColumn('number', 'Market increase/decrease (color)');
    data.addRows([
        ["Global", null, 0, 0],
        ["America", "Global", 0, 0],
        ["Europe", "Global", 0, 0],
        ["Asia", "Global", 0, 0],
        ["Australia", "Global", 0, 0],
        ["Africa", "Global", 0, 0],
        ["Brazil", "America", 11, 10],
        ["USA", "America", 52, 31],
        ["Mexico", "America", 24, 12],
        ["Canada", "America", 16, -23],
        ["France", "Europe", 42, -11],
        ["Germany", "Europe", 31, -2],
        ["Sweden", "Europe", 22, -13],
        ["Italy", "Europe", 17, 4],
        ["UK", "Europe", 21, -5],
        ["China", "Asia", 36, 4],
        ["Japan", "Asia", 20, -12],
        ["India", "Asia", 40, 63],
        ["Laos", "Asia", 4, 34],
        ["Mongolia", "Asia", 1, -5],
        ["Israel", "Asia", 12, 24],
        ["Iran", "Asia", 18, 13],
        ["Pakistan", "Asia", 11, -52],
        ["Egypt", "Africa", 21, 0],
        ["S. Africa", "Africa", 30, 43],
        ["Sudan", "Africa", 12, 2],
        ["Congo", "Africa", 10, 12],
        ["Zair", "Africa", 8, 10],
    ]);

    // Create and draw the visualization.
    var treemap = new google.visualization.TreeMap(document.getElementById('visualization'));

    treemap.draw(data, {
        minColor: 'red',
        midColor: '#ddd',
        maxColor: '#0d0',
        headerHeight: 15,
        fontColor: 'black',
        showScale: true
    });
}

function drawTable() {
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Name');
    data.addColumn('number', 'Weight End');
    data.addColumn('number', 'Benchmark Weight End');
    data.addColumn('number', 'Excess Weight End');
    data.addColumn('number', 'Return (GBP)');
    data.addColumn('number', 'Benchmark Return (GBP)');
    data.addColumn('number', 'Relative Return (GBP)');
    data.addRows(5);

    data.setCell(0, 0, 'Information Technology');
    data.setCell(0, 1, 71.204);
    data.setCell(0, 2, 36.775);
    data.setCell(0, 3, 34.429);
    data.setCell(0, 4, 64.602);
    data.setCell(0, 5, 77.105);
    data.setCell(0, 6, -12.503);

    data.setCell(1, 0, 'Utilities');
    data.setCell(1, 1, 34.302);
    data.setCell(1, 2, 25.391);
    data.setCell(1, 3, 8.912);
    data.setCell(1, 4, 254585.713);
    data.setCell(1, 5, 61.793);
    data.setCell(1, 6, 254523.920);

    data.setCell(2, 0, 'Industrials');
    data.setCell(2, 1, 0.332);
    data.setCell(2, 2, 1.552);
    data.setCell(2, 3, -1.221);
    data.setCell(2, 4, -46.991);
    data.setCell(2, 5, 62.825);
    data.setCell(2, 6, -109.816);

    data.setCell(3, 0, 'Telecommunication Services');
    data.setCell(3, 1, -5.841);
    data.setCell(3, 2, 0);
    data.setCell(3, 3, -5.841);
    data.setCell(3, 4, -18.704);
    data.setCell(3, 5, null);
    data.setCell(3, 6, null);

    data.setCell(4, 0, 'Consumer Discretionary');
    data.setCell(4, 1, 0.003);
    data.setCell(4, 2, 36.282);
    data.setCell(4, 3, -36.278);
    data.setCell(4, 4, 15.432);
    data.setCell(4, 5, 32.077);
    data.setCell(4, 6, -16.645);

    var formatter = new google.visualization.NumberFormat({ negativeColor: 'red' });
    formatter.format(data, 1);
    formatter.format(data, 2);
    formatter.format(data, 3);
    formatter.format(data, 4);
    formatter.format(data, 5);
    formatter.format(data, 6);

    var table = new google.visualization.Table(document.getElementById('grid'));
    table.draw(data, { allowHtml: true });
}

function drawStuff() {
    drawVisualization();
    drawTable();
}

google.setOnLoadCallback(drawStuff);