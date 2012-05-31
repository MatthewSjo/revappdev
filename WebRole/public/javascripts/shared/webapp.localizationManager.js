// ------------------------------------------
// LOCALIZATION MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'localizationManager', isShared: true }, function (config) {
    var manager     = {},
        output      = this.getConsole(),
        language    = require('language');

    manager.sayHello = function () {
        output.log(language.hello);
    };

    // Public
    function get(text) {
        var localizedString = language[text] || '';

        return localizedString;
    }

    // Public
    function getLanguage() {
        return language;
    }

    manager.get = get;
    manager.getLanguage = getLanguage;

    return manager;
});