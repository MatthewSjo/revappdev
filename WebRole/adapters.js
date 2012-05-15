// ------------------------------------------
// DATA ADAPTERS
// ------------------------------------------

// Object definitions and functions to assist in the transformation of service data
// into a JSON-formatted shape for consumption by various application components.

var convert = function (node, dataToInclude, measures) {
    var i,
        children,
        len,
        segment,
        rowArray = [];

    // If we're dealing with the top level segment...
    if (dataToInclude === 'none') {
        
        // ...just add the row for the total level.
        if (node.segment) {
            this.addRow(rowArray, node.segment);
        }

    } else {
        
        // Retrieve the segments from the relevant 'included data' property.
        children = node[dataToInclude].segments;
        len = children.length;

        // Loop around the segments, adding rows if they are defined.
        for (i = 0; i < len; i++) {
            segment = children[i];
            if (segment) {
                this.addRow(rowArray, segment);
            }
        }
    }

    // If this adapter has an addColumn function and measures to add...
    if (this.addColumn && measures) {
        
        // ...create a column for each measure.
        len = measures.length;

        for (i = 0; i < len; i++) {
            this.addColumn(measures[i]); // TODO: Display localized name rather than ID.
        }
    }

    // Return the object required by the Google Visualization API.
    return {
        cols: this.columns,
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
		        {v: segment.measures[0].measures[0].val },
		        { v: segment.measures[0].measures[1].val },
		        { v: segment.name },
		        { v: segment.measures[0].measures[2].val }
	        ]
        });
    }
};

// Column Chart
exports.ColumnChart = {

    columns: [
	    { label: 'X Value', type: 'string' },
    ],

    convert: convert,

    addColumn: function (name) {
        this.columns.push({ label: 'Positive ' + name, type: 'number' });
        this.columns.push({ label: 'Negative ' + name, type: 'number' });
    },

    addRow: function (rowArray, segment) {
        var i,
            measures = segment.measures[0].measures,
            len = measures.length,
            cells = [{ v: segment.name}];

        for (i = 0; i < len; i++) {
            cells.push({ v: (measures[i].val > 0) ? measures[i].val : null });
            cells.push({ v: (measures[i].val < 0) ? measures[i].val : null });
        }

        rowArray.push({ c: cells });
    }
};

// Table
exports.Table = {

    columns: [
	    { label: 'Segment', type: 'string' }
    ],

    convert: convert,

    addColumn: function (name) {
        this.columns.push({ label: name, type: 'number' });
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