// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'colorManager', isShared: true }, function () {
    var colorManager = {},
        output = this.getConsole();

    // Removes the hex in front of a hex value if there is one.
    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }

    // Returns a hex value for the given number.
    function toHex(n) {
        n = parseInt(n, 10);

        if (isNaN(n)) {
            return "00";
        }

        n = Math.max(0, Math.min(n, 255));

        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    }

    // Returns a hex value for the given RGB value.
    function rgbToHex(r, g, b) {
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    // Gets the red RGB value for the passed hex value.
    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    // Gets the green RGB value for the passed hex value.
    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    // Gets the blue RGB value for the passed hex value.
    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    // Transforms the integer provided into a byte value.
    function getByteValue(value) {
        return parseInt(value, 10) & 255;
    }

    // Helper method to interpolate between two min and max values given a specific value.
    function interpolate(min, max, value) {
        return getByteValue(getByteValue(min) * (1 - value) + getByteValue(max) * value);
    }

    function getColorInRange(value, min, max, reverseGradient) {
        var colors = [],
            red = '#cc0000',
            yellow = '#ffff00',
            green = '#339900',
            key, color, previousKey, previousColor, storedColor,
            i, p, pr, cr, pg, cg, pb, cb;

        // Range check. If the value is out of range, return the most extreme colour. This shouldn't occur, but for
        // hard-coded absolute ranges where the actual values may not always fit, it's better to return a colour.
        if (value < min) {
            return red;
        }

        if (value > max) {
            return green;
        }

        if (reverseGradient) {
            // If the value is positive, the colour will be between red and yellow.
            if (value > 0) {
                colors.push([0, yellow]);
                colors.push([max, red]);                
            } else {
                colors.push([min, green]);
                colors.push([0, yellow]);                
            }
        } else {
            // If the value is positive, the colour will be between yellow and green.
            if (value > 0) {
                colors.push([max, green]);
                colors.push([0, yellow]);
            } else {
                colors.push([0, yellow]);
                colors.push([min, red]);
            }
        }

        storedColor = [0, yellow];

        for (i = 0; i < colors.length; i++) {
            key = colors[i][0];
            color = colors[i][1];
            previousKey = storedColor[0];
            previousColor = storedColor[1];

            if (key >= value) {
                p = ((value - previousKey) / (key - previousKey));
                pr = hexToR(previousColor);
                cr = hexToR(color);
                pg = hexToG(previousColor);
                cg = hexToG(color);
                pb = hexToB(previousColor);
                cb = hexToB(color);

                return rgbToHex(interpolate(pr, cr, p), interpolate(pg, cg, p), interpolate(pb, cb, p));
            }

            storedColor = colors[i];
        }

        return yellow;
    }

    colorManager.getColorInRange = getColorInRange;

    return colorManager;
});