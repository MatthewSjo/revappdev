// ------------------------------------------
// LANGUAGE SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'languageSettingsPage', plugins: ['helper'], sharedModules: ['settings', 'pageElements'], hasEvents: true }, function () {
    var languageSettingsPage    = {},
        output                  = this.getConsole(),
        eventManager            = this.getEventManager(),
        helper                  = this.getPlugin('helper'),
        languages               = this.getSharedModule('settings').languages,
        el                      = this.getSharedModule('pageElements'),
        isCreated               = false;

    function onLanguageClick() {
        var language = JSON.parse($(this).data("link"));

        if (language) {
            eventManager.raiseEvent('onLanguageSelected', language);
        }

        return false;
    }

    function create() {
        for (var i = 0; i < languages.length; i++) {
            $(el.listLanguagesPages).append(
                $('<li>').attr('class', 'forward').append(
                    $('<a>').attr({ 'href': '#', 'data-link': JSON.stringify(languages[i]) })
                    .html(languages[i].name)
                    .on('click', onLanguageClick)
                )
            );
       }
    }

    languageSettingsPage.create = create;

    return languageSettingsPage;
});