// ------------------------------------------
// CONSOLE MANGER
// ------------------------------------------

WebAppLoader.addExtension({ name: 'consoleManager', plugins: ['helper'] }, function (module) {
    var extension       = {},
        loader          = module.loader, // The loader object shared by all modules.
        helper          = this.getPlugin('helper'),
        disableLog      = false;

    /* ----------------------- ON/OFF ----------------------- /

        var consoleManager = (function () {
            var consoleManager = {},
                log = (disableLog)
                    ? function () { }
                    : function () { console.log.apply(console, arguments); };

            consoleManager.log = log;

            return consoleManager;
        })();
       
    // ------------------------------------------------------ */

    var consoleManager = WebAppLoader.getConsole();

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

    // Public
    function getConsole() {
        return consoleManager;
    }

    // Module methods:
    module.getConsole = function () {
        return this.loader.getConsole();
    };

    // Shared module loader methods:
    loader.getConsole = getConsole;

    // Public WebAppLoader methods;
    WebAppLoader.getConsole = getConsole;

    // Please uncomment only the methods that you have implemented.
    // extension.extendAddModule = extendAddModule;
    // extension.extendLoadModule = extendLoadModule;

    return extension;
});