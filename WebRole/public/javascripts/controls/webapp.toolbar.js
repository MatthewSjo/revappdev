// ------------------------------------------
// TOOLBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'toolbar', plugins: [], sharedModules: ['pageElements', 'localizationManager'], hasEvents: true }, function () {
    var toolbar         = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        settings        = this.getSharedModule('settings'),
        el              = this.getSharedModule('pageElements'),
        manager         = this.getSharedModule('localizationManager');

    $(el.toolbar).click(function () {
        eventManager.raiseEvent('onTap');
    });

    return toolbar;
});