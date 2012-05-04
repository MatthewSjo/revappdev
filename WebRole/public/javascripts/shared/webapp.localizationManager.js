// ------------------------------------------
// LOCALIZATION MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'localizationManager', sharedModules: ['en_US', 'it_IT'], isShared: true }, function (config) {
    var manager             = {},
        output              = this.loader.output || {},
        defaultLanguage     = 'en_US',
        languages           = { en_US: this.loader.shared.en_US,
                                it_IT: this.loader.shared.it_IT 
                                },
        language            = languages[defaultLanguage];

    manager.sayHello = function () {
        output.log(language.hello);
    };

    // Public
    function setLanguage(lang) {
        language = languages[lang];
    }

    // Public
    function get(text) {
        var localizedString = language[text] || '';

        return localizedString
    }

    // Public
    function getLanguage() {
        return language;
    }

    manager.get = get;
    manager.getLanguage = getLanguage;
    manager.setLanguage = setLanguage;

    return manager;
});