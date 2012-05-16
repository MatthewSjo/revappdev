// ------------------------------------------
// EXTENSION NAME
// ------------------------------------------

WebAppLoader.addExtension({ name: 'extensionName', plugins: ['helper'] }, function (module) {
    var extension       = {},
        loader          = module.loader, // The loader object shared by all modules.
        helper          = this.getPlugin('helper');

    // Invoked when a new module is added.
    function extendAddModule(config, moduleToAdd) {
        // Code example:
        //      var hasEvents = helper.getValueAs(config.hasEvents, 'boolean');
        //      moduleToAdd.hasEvents = hasEvents;
    }

    // Invoked when a module is loaded.
    function extendLoadModule(moduleToLoad) {
        // Code example:
        //      if (moduleToLoad.hasEvents) {
        //          moduleToLoad.bin.on = eventManager.on;
        //      }
    }

    // Private functions.
    // Add code here.

    // Module methods:
    // Add code here.

    // Shared module loader methods:
    // Add code here

    // Public WebAppLoader methods;
    // Add code here

    // Please uncomment only the methods that you have implemented.
    // extension.extendAddModule = extendAddModule;
    // extension.extendLoadModule = extendLoadModule;

    return extension;
});