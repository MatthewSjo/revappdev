// ------------------------------------------
// HELPER
// ------------------------------------------

WebAppLoader.addModule({ name: 'helper', isPlugin: true }, function () {
    var helper = {};

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    helper.capitaliseFirstLetter = capitaliseFirstLetter;

    return helper;
});