var WebAppLoader = (function () {
    var webAppLoader = {},
        modules = {},
        statics = {},
        shared = {},
        plugins = {};

    disableLog = false;

    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------

    function isArray(obj) {
        return (obj && obj.constructor)
            ? obj.constructor == Array
            : false;
    }

    // ------------------------------------------
    // BASIC EVENT MANAGER
    // ------------------------------------------

    var eventManager = (function () {
        var eventObj = {},
            events = {};

        // Simple Event Manager.
        function on(event, callback) {
            events[event] = callback;
        }

        function raiseEvent(event) {
            var args = Array.prototype.slice.call(arguments, 1);

            if (events[event]) {
                events[event](args);
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

    // ------------------------------------------
    // OUTPUT
    // ------------------------------------------

    var output = (function () {
        var output = {},
            log = (disableLog)
                ? function () { }
                : function () { console.log.apply(console, arguments); };

        output.log = log;

        return output;
    })();

    // ------------------------------------------
    // LOADER
    // ------------------------------------------

    function getPlugins(pluginsToLoad) {
        var pluginsLoaded = {},
            i;

        if (isArray(pluginsToLoad)) {
            var plugin, pluginName;

            for (i = 0; i < pluginsToLoad.length; i++) {
                pluginName = pluginsToLoad[i];
                plugin = webAppLoader[pluginName] || {};
                pluginsLoaded[pluginName] = plugin;
            }
        }

        return pluginsLoaded;
    }

    function addModule(config, source) {
        var moduleName = config.name || '',
            hasEvents = config.hasEvents || false,
            isShared = config.isShared || false,
            isPlugin = config.isPlugin || false,
            pluginsToLoad = (isArray(config.plugins))
                ? config.plugins
                : [];

        if (isShared) {
            addSharedModule(moduleName, source);

        } else {
            modules[moduleName] = {
                pluginsToLoad: getPlugins(pluginsToLoad),
                source: source,
                hasEvents: hasEvents,
                loaded: false
            };
        }
    }

    function addSharedModule(moduleName, source) {
        var sharedModule = {}

        sharedModule = source.call({
            plugins: { output: output, eventManager: eventManager },
            shared: shared
        });

        webAppLoader[moduleName] = shared[moduleName] = sharedModule;
    }

    function loadModule(moduleName, calledBy) {
        var module = modules[moduleName],
            moduleToLoad = {},
            modulesQueued = {};

        // Check if module has been loaded as plugin.
        for (moduleAsPlugin in module.pluginsToLoad) {
            // Prevent circular references.
            if ((moduleName != moduleAsPlugin) && (moduleAsPlugin != calledBy)) {
                if (!modules[moduleAsPlugin].loaded) {
                    module.pluginsToLoad[moduleAsPlugin] = loadModule(moduleAsPlugin, moduleName);
                } else {
                    module.pluginsToLoad[moduleAsPlugin] = modules[moduleAsPlugin].bin;
                }
            } else {
                // This is the list of circular references.
                modulesQueued[moduleName] = moduleName;
            }
        }

        if (!module.loaded) {
            // Add default output support.
            module.pluginsToLoad.output = output;

            if (module.hasEvents) {
                module.pluginsToLoad.eventManager = eventManager;
            }

            moduleToLoad = module.source.call({
                plugins: module.pluginsToLoad
            });

            if (module.hasEvents) {
                moduleToLoad['on'] = eventManager.on;
            }

            module.loaded = true;
            module.bin = moduleToLoad;
        }

        return module.bin;
    }

    function unloadModule(moduleName) {
        var module = modules[moduleName];

        if (module) {
            delete modules[moduleName]
        }
    }

    function execute(moduleName, methodName, params) {
        var tempModule;

        tempModule = loadModule(moduleName);
        if (tempModule[methodName]) {
            return (isArray(params))
                ? tempModule[methodName].apply(tempModule, params)
                : tempModule[methodName].call(tempModule, params);
        }
    }

    webAppLoader.eventManager = eventManager;
    webAppLoader.addModule = addModule;
    webAppLoader.loadModule = loadModule;
    webAppLoader.unloadModule = unloadModule;
    webAppLoader.execute = execute;

    return webAppLoader;
})();