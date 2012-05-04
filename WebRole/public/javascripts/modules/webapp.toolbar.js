// ------------------------------------------
// TOOLBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'toolbar', plugins: [], sharedModules: ['pageElements', 'localizationManager'], hasEvents: true }, function () {
    var toolbar         = {},
        output          = this.loader.output || {},
        settings        = this.loader.shared.settings || {},
        el              = this.loader.shared.pageElements || {},
        eventManager    = this.loader.eventManager || {},
        manager         = this.loader.shared.localizationManager || {};

    $(el.toolbar).click(function () {
        eventManager.raiseEvent('onClick');
    });

    return toolbar;
});