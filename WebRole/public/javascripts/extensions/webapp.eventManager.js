// ------------------------------------------
// EVENT MANAGER
// ------------------------------------------

WebAppLoader.addExtension({ name: 'eventManager', plugins: ['helper'] }, function (module) {
    var extension       = {},
        loader          = module.loader, // The loader object shared by modules.
        helper          = this.getPlugin('helper');

    /* ----------------------- ON/OFF ----------------------- /

    var eventManager = (function () {
        var eventObj = {},
            events = {};

        // TODO: Add a queue for all events fired before the object has declared
        // the event listener.

        // Simple Event Manager.
        function on(event, callback) {
            events[event] = callback;
        }

        function raiseEvent(event) {
            var args = Array.prototype.slice.call(arguments, 1),
                params = null;

            params = (args.length === 1)
                ? args[0]
                : args;

            if (events[event]) {
                events[event](params);
            }
        }

        function init(obj) {
            obj['on'] = on;
            obj['raiseEvent'] = raiseEvent;
        }

        eventObj.on = on;
        eventObj.raiseEvent = raiseEvent;
        eventObj.init = init;

        return eventObj;
    })();

    // ------------------------------------------------------ */

    var eventManager = WebAppLoader.getEventManager();

    function extendAddModule(config, moduleToAdd) {
        var hasEvents = helper.getValueAs(config.hasEvents, 'boolean'); // this.getValueAs(config.hasEvents, 'boolean');
        moduleToAdd.hasEvents = hasEvents;
        
        console.log('I\'m exetndig this module', moduleToAdd, config);
        return moduleToAdd;
    }

    function extendLoadModule(moduleToLoad) {
        // If the module supports events attach the 'on' method to it.
        if (moduleToLoad.hasEvents) {
            moduleToLoad.bin.on = eventManager.on;
        }
        
        return moduleToLoad;
    }

    // Public
    function getEventManager() {
        return eventManager;
    }

    module.getEventManager = function (){
        // if the module manages events return the event manager.
        return (this.hasEvents) 
            ? this.loader.getEventManager()
            : null;
    };

    loader.getEventManager = getEventManager;

    // Add properties and methods to the global WebAppLoader;
    WebAppLoader.getEventManager = getEventManager;

    extension.extendAddModule = extendAddModule;
    extension.extendLoadModule = extendLoadModule;

    // Public methods.

    return extension;
});