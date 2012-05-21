// ------------------------------------------
// DATA ADAPTERS
// ------------------------------------------

// Object definitions and functions to assist in the transformation of service data
// into a JSON-formatted shape for consumption by various application components.

// ------------------------------------------
// DATA COLUMN FUNCTIONS
// ------------------------------------------

function addColumn(columnArray, name) {
    columnArray.push({ label: name, type: 'number' });
}

function addMeasureColumns(columnArray, measures, language) {
    var i, len, measureId;

    // If we're adding measures...
    if (measures) {

        // ...create a column for each one.
        len = measures.length;

        for (i = 0; i < len; i++) {
            // Obtain the measure ID.
            measureId = measures[i];
            // Retrieve the localized measure name from the language module.
            // TODO: Replace currency and subperiod placeholders.
            this.addColumn(columnArray, language.measures[measureId]);
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

function addTreeMapRow(rowArray, nodeName, parentName, sizeValue, colorValue) {
    rowArray.push({
        c: [
		    { v: nodeName },
		    { v: parentName },
            { v: sizeValue },
		    { v: colorValue }		    
	    ]
    });
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

function addMeasureRows(rowArray, measures, language) {

    // ...create a column for each measure.
    len = measures.length;

    for (i = 0; i < len; i++) {
        // Obtain the measure ID.
        measure = measures[i];
        // Retrieve the localized measure name from the language module.
        // TODO: Replace currency and subperiod placeholders.
        rowArray.push({
            c: [{ v: language.measures[measure.id] }, { v:  measure.val }]
        });
    }
}

// ------------------------------------------
// DATA CONVERSION FUNCTIONS
// ------------------------------------------

function convert(node, dataToInclude, measures, language) {
    var columnArray = [],
        rowArray = [],
        children;

    // Switch on the dataToInclude parameter.
    if (dataToInclude === 'none') {

        if (this.addMeasureRows) {
            this.addColumn(columnArray, node.segment.name);
            this.addMeasureRows(rowArray, node.segment.measures[0].measures, language);
        } else {
            if (this.addMeasureColumns) {
                this.addMeasureColumns(columnArray, measures, language);
            }
            this.addRow(rowArray, node.segment);
        }

    } else {

        // Retrieve the segments or securities from the relevant 'included data' property.
        children = (dataToInclude === 'childSegments') ? 
            node[dataToInclude].segments :
            node[dataToInclude].securities;

        if (this.addMeasureColumns) {
            this.addMeasureColumns(columnArray, measures, language);
        }
        this.addSegmentRows(rowArray, children);
    }

    // Return the object required by the Google Visualization API.
    return {
        cols: this.columns.concat(columnArray),
        rows: rowArray
    };
};

function treeMapConvert(node, dataToInclude) {
    var i, 
        len,
        parent,
        children,
        child,
        measures, 
        rowArray = [];
    
    // Get the parent segment.
    parent = node.segment;
    
    // Add the root node.
    this.addRow(rowArray, parent.name, null, 0, 0);

    // Retrieve the segments or securities from the relevant 'included data' property.
    children = (dataToInclude === 'childSegments') ?
        node[dataToInclude].segments :
        node[dataToInclude].securities;

    // Determine the number of child segments.
    len = children.length;    

    // Loop around the segments, extracting names and measures for each row.
    for (i = 0; i < len; i++) {
        child = children[i];
        measures = child.measures[0].measures;
        this.addRow(rowArray, child.name, parent.name, measures[0].val, measures[1].val);
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