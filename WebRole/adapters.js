// ------------------------------------------
// DATA ADAPTERS
// ------------------------------------------

// Object definitions and functions to assist in the transformation of service data
// into a JSON-formatted shape for consumption by various application components.
var convert = function (node, dataToInclude, measures, language) {
    var i,
        len,
        child,
        children,
        measureId,
        columnArray = [],
        rowArray = [];

    // If we're dealing with the top level segment...
    if (dataToInclude === 'none') {

        // ...just add the row for the total level.
        if (node.segment) {
            this.addRow(rowArray, node.segment);
        }

    } else {

        // Retrieve the segments or securities from the relevant 'included data' property.
        if (dataToInclude === 'childSegments') {
            children = node[dataToInclude].segments;
        } else {
            children = node[dataToInclude].securities;
        }

        len = children.length;

        // Loop around the segments or securities, adding rows if they are defined.
        for (i = 0; i < len; i++) {
            child = children[i];
            if (child) {
                this.addRow(rowArray, child);
            }
        }
    }

    // If this adapter has an addColumn function and measures to add...
    if (this.addColumn && measures) {

        // ...create a column for each measure.
        len = measures.length;

        for (i = 0; i < len; i++) {
            // Obtain the measure ID.
            measureId = measures[i];
            // Retrieve the localized measure name from the language module.
            // TODO: Replace currency and subperiod placeholders.
            this.addColumn(columnArray, language.measures[measureId]);
        }
    }

    // Return the object required by the Google Visualization API.
    return {
        cols: this.columns.concat(columnArray),
        rows: rowArray
    };
};

// Bubble Chart
exports.BubbleChart = {

    columns: [
	    { label: 'ID', type: 'string' },
	    { label: 'X Coordinate', type: 'number' },
	    { label: 'Y Coordinate', type: 'number' },
	    { label: 'Name', type: 'string' },
	    { label: 'Size', type: 'number' }
    ],

    convert: convert,

    addRow: function (rowArray, segment) {
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
};

// Bar / Column Chart
exports.BarChart = 
exports.ColumnChart = {

    columns: [
	    { label: 'X Value', type: 'string' },
    ],

    convert: convert,

    addColumn: function (columnArray, name) {
        columnArray.push({ label: name, type: 'number' });
    },

    addRow: function (rowArray, segment) {
        var i,
            measures = segment.measures[0].measures,
            len = measures.length,
            cells = [{ v: segment.name}];

        for (i = 0; i < len; i++) {
            cells.push({ v: measures[i].val });
        }

        rowArray.push({ c: cells });
    }
};

// Line / Area Chart
exports.LineChart =
exports.AreaChart = {

    columns: [
	    { label: 'X Value', type: 'string' },
    ],

    convert: convert,

    addColumn: function (columnArray, name) {
        columnArray.push({ label: name, type: 'number' });
    },

    addRow: function (rowArray, segment) {
        var i,
            measures = segment.measures[0].measures,
            len = measures.length,
            cells = [{ v: segment.name }];

        for (i = 0; i < len; i++) {
            cells.push({ v: measures[i].val });
        }

        rowArray.push({ c: cells });
    }
};

// Pie Chart
exports.PieChart = {

    columns: [
	    { label: 'Name', type: 'string' },
        { label: 'Value', type: 'number' }
    ],

    convert: convert,

    addRow: function (rowArray, segment) {
        rowArray.push({ 
            c: [
                { v: segment.name },
                { v: segment.measures[0].measures[0].val }
            ]
        });
    }
};

// Table
exports.Table = {

    columns: [
	    { label: '', type: 'string' }
    ],

    convert: convert,

    addColumn: function (columnArray, name) {
        columnArray.push({ label: name, type: 'number' });
    },

    addRow: function (rowArray, segment) {
        var i,
            measures = segment.measures[0].measures,
            len = measures.length,
            cells = [{ v: segment.name }];

        for (i = 0; i < len; i++) {
            cells.push({ v: measures[i].val });
        }

        rowArray.push({ c: cells });
    }
};

// Tree Map Chart
exports.TreeMap = {

    columns: [
	    { label: 'Name', type: 'string' },
	    { label: 'Parent Name', type: 'string' },
	    { label: 'Size', type: 'number' },
	    { label: 'Color', type: 'number' }
    ],

    convert: convert,

    addRow: function (rowArray, segment) {
        var measures = segment.measures[0].measures;

        rowArray.push({
            c: [
		        { v: segment },
		        { v: segment },
		        { v: measures[0].val },
		        { v: measures[1].val }
	        ]
        });
    }
};