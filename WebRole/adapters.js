// ------------------------------------------
// DATA ADAPTERS
// ------------------------------------------

// Object definitions and functions to assist in the transformation of service data
// into a JSON-formatted shape for consumption by various application components.

// ------------------------------------------
// MEASURE PLACEHOLDER REPLACEMENT FUNCTION
// ------------------------------------------

function getMeasureName(measureId, analysis, language) {
    var name, 
        frequency,
        subPeriodPlaceholder    = '[SUBPERIOD]',
        subPeriodsPlaceholder   = '[SUBPERIODS]', 
        currencyPlaceholder     = '[CUR]';
    
    // Get the localised version of the statistics frequency.
    frequency = language.shared[analysis.statisticsFrequency];

    // Get the localised version of the measure name.
    name = language.measures[measureId];

    // Replace any placeholders.
    name = name.replace(subPeriodPlaceholder, frequency)
               .replace(subPeriodsPlaceholder, frequency)
               .replace(currencyPlaceholder, analysis.currency);

    return name;
}

// ------------------------------------------
// DATA COLUMN FUNCTIONS
// ------------------------------------------

function addColumn(columnArray, name) {
    columnArray.push({ label: name, type: 'number' });
}

function addMeasureColumns(columnArray, measures, analysis, language) {
    var i, len, measureId, measureName;

    // If we're adding measures...
    if (measures) {

        // ...create a column for each one.
        len = measures.length;

        for (i = 0; i < len; i++) {
            // Obtain the measure ID.
            measureId = measures[i];
            // Get the localised measure name.
            measureName = getMeasureName(measureId, analysis, language);
            // Add the column.
            this.addColumn(columnArray, measureName);
        }
    }
}

// ------------------------------------------
// DATA ROW FUNCTIONS
// ------------------------------------------

function addRow(rowArray, segment) {
    var i,
        measures = segment.measures[0].measures,
        len = measures.length,
        cells = [{ v: segment.name}];

    for (i = 0; i < len; i++) {
        cells.push({ v: measures[i].val });
    }

    rowArray.push({ c: cells });
}

function addBubbleChartRow(rowArray, segment) {
    rowArray.push({
        c: [
		    { v: '' }, // Empty string to prevent label displaying over bubble.
		    { v: segment.measures[0].measures[0].val },
		    { v: segment.measures[0].measures[1].val },
		    { v: segment.name },
		    { v: segment.measures[0].measures[2].val }
	    ]
    });
}

function addTreeMapRow(rowArray, nodeName, parentName, sizeValue, colorValue, classifierName) {

    function generateUniqueNodeName(name) {
        var i, len = rowArray.length, exists = false;
        
        // Check that the nodeName does not already exist in the collection.
        for (i = 0; i < len; i++) {
            if (rowArray[i].c[0].v === name) {
                exists = true;
                break;
            }
        }

        // If the name exists...
        if (exists) {
            // ...try and generate another recursively, appended with a 
            // space. This is so we can appear to display multiple rows 
            // with the same name, but have unique IDs from the perspective 
            // of the Google Visualization API.
            return generateUniqueNodeName(name + ' ');
        } else {
            return name;
        }
    }

    rowArray.push({
        c: [
		    { v: generateUniqueNodeName(nodeName) },
		    { v: parentName },
            { v: sizeValue },
		    { v: colorValue }
	    ]
    });
}

function addLineChartRow(rowArray, dataPoint, seriesType) {
    var i,
        dateParts, year, month, day,
        measures = dataPoint.m,
        len = measures.length,
        isCumulative = (seriesType !== 'raw'),
        cells = [];

    dateParts = isCumulative ? dataPoint.d.split('-') : dataPoint.s.split('-');

    year = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10) - 1;
    day = parseInt(dateParts[2], 10);

    cells.push({ v: 'Date(' + year + ', ' + month + ', ' + day + ')' });

    for (i = 0; i < len; i++) {
        cells.push({ v: measures[i] });
    }

    rowArray.push({ c: cells });
}

function addSegmentRows(rowArray, segments) {
    var i,
        len = segments.length,
        segment;

    // Loop around the segments or securities, adding rows if they are defined.
    for (i = 0; i < len; i++) {
        segment = segments[i];
        if (segment) {
            this.addRow(rowArray, segment);
        }
    }
}

function addSeriesRows(rowArray, series, seriesType) {
    var i,
        len = series.length,
        seriesPoint;

    // Loop around the series, adding rows if they are defined.
    for (i = 0; i < len; i++) {
        seriesPoint = series[i];
        if (seriesPoint) {
            addLineChartRow(rowArray, seriesPoint, seriesType);
        }
    }
}

function addMeasureRows(rowArray, measures, analysis, language) {
    var i, len, measure;

    // ...create a column for each measure.
    len = measures.length;

    for (i = 0; i < len; i++) {
        // Obtain the measure.
        measure = measures[i];
        // Add the row to the array.        
        rowArray.push({
            c: [
                { v: getMeasureName(measure.id, analysis, language) },
                { v: measure.val }
            ]
        });
    }
}

// ------------------------------------------
// DATA CONVERSION FUNCTIONS
// ------------------------------------------

function convert(node, dataToInclude, analysis, measures, language) {
    var columnArray = [],
        rowArray = [],
        children;

    // Switch on the dataToInclude parameter.
    if (dataToInclude === 'none') {

        if (this.addMeasureRows) {
            this.addColumn(columnArray, node.segment.name);
            this.addMeasureRows(rowArray, node.segment.measures[0].measures, analysis, language);
        } else {
            if (this.addMeasureColumns) {
                this.addMeasureColumns(columnArray, measures, analysis, language);
            }
            this.addRow(rowArray, node.segment);
        }

    } else {

        // Retrieve the segments or securities from the relevant 'included data' property.
        children = (dataToInclude === 'childSegments') ? 
            node[dataToInclude].segments :
            node[dataToInclude].securities;

        if (this.addMeasureColumns) {
            this.addMeasureColumns(columnArray, measures, analysis, language);
        }
        this.addSegmentRows(rowArray, children);
    }

    // Return the object required by the Google Visualization API.
    return {
        cols: this.columns.concat(columnArray),
        rows: rowArray
    };
};

function lineChartConvert(dataPoints, seriesType, analysis, measures, language) {
    var columnArray = [],
        rowArray = [],
        children;

    if (this.addMeasureColumns) {
        this.addMeasureColumns(columnArray, measures, analysis, language);
    }
    addSeriesRows(rowArray, dataPoints.items, seriesType);

    // Return the object required by the Google Visualization API.
    return {
        cols: this.columns.concat(columnArray),
        rows: rowArray
    };
};

function treeMapConvert(node, dataToInclude, analysis) {
    var i,
        len,
        parent,
        children,
        child,
        measures,
        isSecurityLevel = (dataToInclude === 'securities'),
        classifierName = '',
        rowArray = [];
    
    // Get the parent segment.
    parent = node.segment;
    
    // Add the root node.
    this.addRow(rowArray, parent.name, null, 0, 0);

    // Retrieve the segments or securities from the relevant 'included data' property.
    children = isSecurityLevel ? node[dataToInclude].securities : node[dataToInclude].segments;

    if (!isSecurityLevel) {
        classifierName = node[dataToInclude].classifier.name;
    }

    // Determine the number of child segments.
    len = children.length;    

    // Loop around the segments, extracting names and measures for each row.
    for (i = 0; i < len; i++) {
        child = children[i];
        measures = child.measures[0].measures;
        this.addRow(rowArray, child.name, parent.name, measures[0].val, measures[1].val, classifierName);
    }

    // Return the object required by the Google Visualization API.
    return {
        cols: this.columns,
        rows: rowArray
    };
};

// ------------------------------------------
// COMMON ADAPTER OBJECTS
// ------------------------------------------

var i,
    charts = [
        'AreaChart',
        'BarChart',
        'BubbleChart',
        'ColumnChart',
        'LineChart',
        'PieChart',
        'ScatterChart',
        'SteppedAreaChart',
        'Table',
        'TreeMap'
    ];

for (i = 0; i < charts.length; i++) {
    exports[charts[i]] = {
        addColumn: addColumn,
        addMeasureColumns: addMeasureColumns,
        addRow: addRow,
        addSegmentRows: addSegmentRows,
        convert: convert,
        columns: [{ label: '', type: 'string'}]
    };
}

// ------------------------------------------
// SPECIALIST ADAPTER OVERRIDES
// ------------------------------------------

// Table
exports.Table.addMeasureRows = addMeasureRows;

// Bubble Chart
exports.BubbleChart.addRow = addBubbleChartRow;
exports.BubbleChart.columns = [
    { label: 'ID', type: 'string' },
	{ label: 'X Coordinate', type: 'number' },
	{ label: 'Y Coordinate', type: 'number' },
	{ label: 'Name', type: 'string' },
	{ label: 'Size', type: 'number' }
];

// Tree Map
exports.TreeMap.addRow = addTreeMapRow;
exports.TreeMap.convert = treeMapConvert;
exports.TreeMap.columns = [
	{ label: 'Name', type: 'string' },
	{ label: 'Parent Name', type: 'string' },
	{ label: 'Size', type: 'number' },
	{ label: 'Color', type: 'number' }
];

// Line Chart
exports.LineChart.convert = lineChartConvert;
exports.LineChart.columns = [{ label: 'Date', type: 'date' }];