// ------------------------------------------
// HELPER
// ------------------------------------------

WebAppLoader.addModule({ name: 'helper', isPlugin: true }, function () {
    var helper = {};

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getValueAs(value, type) {
        function getValue(exp, type, defaultValue) {
            return (typeof exp === type) ? exp : defaultValue;
        }

        function getValueAsArray(exp, defaultValue) {
            return (Array.isArray(exp)) ? exp : defaultValue;
        }

        switch (type) {
            case 'boolean':
                return getValue(value, 'boolean', false);
            case 'b':
                return getValue(value, 'boolean', false);
            case 'string':
                return getValue(value, 'string', '');
            case 's':
                return getValue(value, 'string', '');
            case 'object':
                return getValue(value, 'object', {});
            case 'o':
                return getValue(value, 'object', {});
            case 'array':
                return getValueAsArray(value, []);
            case 'a':
                return getValueAsArray(value, []);
            default:
                return value;
        }
    }

    helper.capitaliseFirstLetter = capitaliseFirstLetter;
    helper.getValueAs = getValueAs;

    return helper;
});