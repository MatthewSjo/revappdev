// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'settings', isShared: true }, function () {
    var settings = {},
        appSettings = {},
        output = this.plugins.output || {},
        shared = this.shared || {};

    appSettings = {
        loadPortfoliosSlotDataOnce: false
    };

    function changeSetting(key, value) {
        appSettings[key] = value;
        output.log('change setting');
        shared.test.sayHello();
    }

    function get(key) {
        return appSettings[key];
    }

    function getVersion() {
        return '1.0';
    }

    settings.changeSetting = changeSetting;
    settings.set = changeSetting; // Alias
    settings.get = get;
    settings.getVersion = getVersion;

    return settings;
});