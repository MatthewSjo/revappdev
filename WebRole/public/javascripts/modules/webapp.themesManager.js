// ------------------------------------------
// THEMES MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'themesManager', plugins: ['helper'], sharedModules: ['pageElements'], 
    dataObjects: ['theme'], hasEvents: true }, function () {
    var themesManager   = {},
        eventManager    = this.getEventManager(),
        output          = this.getConsole(),
        helper          = this.getPlugin('helper'),
        el              = this.getSharedModule('pageElements'),
        themeDataObj    = this.getDataObject('theme'),
        defaultStyle    = 'Awesome';

    themeDataObj.define({
        name: defaultStyle
    });

    $(el.themesPage + ' ul li a').on('click', onThemeChange);

    // Private
    function onThemeChange(event) {
        var theme = $(this).attr("data-title") || null;
        eventManager.raiseEvent('onThemeChanged', theme);
    }

    // Public
    function switchStyle(theme) {
        var style = null;
        if (typeof theme === 'object' && theme.name) {
            style = theme.name;
        } else {
            style = theme;
        }
        jQT.switchStyle(style || defaultStyle);
    }

    themesManager.switchStyle = switchStyle;

    return themesManager;
});