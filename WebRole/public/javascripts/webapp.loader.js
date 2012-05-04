// ------------------------------------------
// WEB APP LOADER
// ------------------------------------------

var WebAppLoader = (function () {
    var webAppLoader = {},
        modules = {},
        sharedModules = {},
        plugins = {},
        unloadedModules = {},
        sharingOptions = { sharingDenied: 0, sharingAllowed: 1 },

    // Loader settings:
        disableLog = false,
        suppressErrors = false,
        sharingSetting = sharingOptions.sharingAllowed;

    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------

    function isArray(obj) {
        return (obj && obj.constructor)
            ? obj.constructor == Array
            : false;
    }

    function throwException(message, functionName) {
        var messageHeader = (functionName)
            ? ' - ' + functionName + ' exception! '
            : '';

        if (!suppressErrors) {
            throw (messageHeader + message);
        }
    }

    // ------------------------------------------
    // BUILT-IN - EVENT MANAGER
    // ------------------------------------------

    var eventManager = (function () {
        var eventObj = {},
            events = {};

        // Simple Event Manager.
        function on(event, callback) {
            events[event] = callback;
        }

        function raiseEvent(event) {
            var args = Array.prototype.slice.call(arguments, 1),
                params = null;

            params = (args.length == 1)
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

    // ------------------------------------------
    // BUILT-IN - OUTPUT
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

    function loadResources(resourcesToLoad, repository) {
        var loadedResources = {}, i;

        if (isArray(resourcesToLoad)) {
            var resource, resourceName;

            for (i = 0; i < resourcesToLoad.length; i++) {
                resourceName = resourcesToLoad[i];
                resource = repository[resourceName] || {};
                loadedResources[resourceName] = resource.bin;
            }
        }

        return loadedResources;
    }

    function loadPlugins(pluginsToLoad) {
        return loadResources(pluginsToLoad, plugins);
    }

    function addPluginToLoader(pluginName) {
        var plugin = plugins[pluginName],
            loadedPlugin = {};

        if (!plugin.loaded) {
            // HERE!
            loadedPlugin = plugin.source.call({
                loader: {
                    output: output,
                    eventManager: (plugin.hasEvents)
                        ? eventManager
                        : {}
                }
            });

            if (plugin.hasEvents) {
                loadedPlugin['on'] = eventManager.on;
            }

            plugin.loaded = true;
            webAppLoader.plugins[pluginName] = plugin.bin = loadedPlugin;
        }
    }

    function loadSharedModules(sharedModulesToLoad) {
        return loadResources(sharedModulesToLoad, sharedModules);
    }

    function addSharedModuleToLoader(sharedModuleName) {
        var sharedModule = sharedModules[sharedModuleName],
            loadedSharedModule = {},
            sharingMethod = {};

        if (!sharedModule.loaded) {
            switch (sharingSetting) {
                case sharingOptions.sharingDenied:
                    sharingMethod = {};
                    break;
                case sharingOptions.sharingAllowed:
                    sharingMethod = loadSharedModules(sharedModule.sharedModulesToLoad);
                    break;
                default:
                    sharingMethod = {};
                    break;
            }

            // HERE!
            loadedSharedModule = sharedModule.source.call({
                loader: {
                    output: output,
                    eventManager: (sharedModule.hasEvents)
                        ? eventManager
                        : {},
                    plugins: loadPlugins(sharedModule.pluginsToLoad),
                    shared: sharingMethod
                }
            });

            if (sharedModule.hasEvents) {
                loadedSharedModule['on'] = eventManager.on;
            }

            sharedModule.loaded = true;
            webAppLoader.shared[sharedModuleName] = sharedModules[sharedModuleName].bin = loadedSharedModule;
        }
    }

    // Public
    function addModule(config, source) {
        var name = config.name || '',
            hasEvents = config.hasEvents || false,
            isShared = config.isShared || false,
            isPlugin = config.isPlugin || false,
            pluginsToLoad = (isArray(config.plugins))
                ? config.plugins
                : [],
            sharedModulesToLoad = (isArray(config.sharedModules))
                ? config.sharedModules
                : [],
            errorMessage = '';

        // Check if the module already exists.
        if (modules[name] || plugins[name] || sharedModules[name]) {
            errorMessage = 'A module named "' + name + '" has been already loaded.';
            throwException(errorMessage, 'addModule');
        }

        if (isPlugin) {
            plugins[name] = {
                source: source,
                hasEvents: hasEvents,
                loaded: false
            };

            addPluginToLoader(name);
            return;
        }

        var isSharingDenied = (isShared && sharedModulesToLoad.length > 0)
            && (sharingSetting === sharingOptions.sharingDenied);

        if (isSharingDenied) {
            var errorMessage = '';

            errorMessage += '"' + name + '" is a shared module and cannot load any other shared module. ';
            errorMessage += 'Set "isShared" to false or remove "sharedModules" to solve the problem.';
            throwException(errorMessage, 'addModule');
        }

        if (isShared) {
            sharedModules[name] = {
                pluginsToLoad: pluginsToLoad,
                sharedModulesToLoad: sharedModulesToLoad,
                source: source,
                hasEvents: hasEvents,
                loaded: false
            };

            addSharedModuleToLoader(name);
            return;
        }

        modules[name] = {
            pluginsToLoad: pluginsToLoad,
            sharedModulesToLoad: sharedModulesToLoad,
            source: source,
            hasEvents: hasEvents,
            loaded: false
        };
    }

    // Public
    function loadModule(moduleName, config) {
        var module = modules[moduleName],
            moduleToLoad = {},
            errorMessage;

        if (module) {
            if (!module.loaded) {
                // HERE!
                moduleToLoad = module.source.call({
                    loader: {
                        output: output,
                        eventManager: (module.hasEvents)
                            ? eventManager
                            : {},
                        plugins: loadPlugins(module.pluginsToLoad), // Lazy loading. 
                        shared: loadSharedModules(module.sharedModulesToLoad)
                    }
                }, config || {});

                if (module.hasEvents) {
                    moduleToLoad['on'] = eventManager.on;
                }

                module.loaded = true;
                webAppLoader.modules[moduleName] = module.bin = moduleToLoad;
            } else {
                errorMessage = '';
                errorMessage += '"' + moduleName + '" already exists.';
                throwException(errorMessage, 'loadModule');
            }
        }

        return (module && module.bin)
            ? module.bin
            : null;
    }

    // Public
    function unloadModule(moduleName) {
        var module = modules[moduleName],
            sharedModule = sharedModules[moduleName],
            plugin = plugins[moduleName],
            moduleToRemove = null,
            removeFrom = null,
            moduleType = '';

        if (module) {
            moduleToRemove = module;
            removeFrom = modules;
            moduleType = 'Module';
        }

        if (sharedModule) {
            moduleToRemove = sharedModule;
            removeFrom = sharedModules;
            moduleType = 'Shared Module';
        }

        if (plugin) {
            moduleToRemove = plugin;
            removeFrom = plugins;
            moduleType = 'Plugin';
        }

        // The module is ONLY removed from the loader.
        if (moduleToRemove) {
            unloadedModules[moduleName] = {
                type: moduleType
            }
            delete removeFrom[moduleName];
        }
    }

    // Public
    function execute(moduleName, methodName, params) {
        var tempModule;

        tempModule = loadModule(moduleName);
        if (tempModule[methodName]) {
            return (isArray(params))
                ? tempModule[methodName].apply(tempModule, params)
                : tempModule[methodName].call(tempModule, params);
        }
    }

    // Public
    function getInfo(htmlOutput) {
        var message = '',
            htmlOutput = htmlOutput || false,
            breakLine = '\n';

        if (htmlOutput) {
            breakLine = '</br>';
        }

        message += 'Modules:' + breakLine;
        for (var module in modules) {
            message += 'Module: ' + module + ' loaded: ' + modules[module].loaded + breakLine;
        }

        message += breakLine;

        message += 'Plugins:' + breakLine;
        for (var plugin in plugins) {
            message += 'Plugin: ' + plugin + ' loaded: ' + plugins[plugin].loaded + breakLine;
        }

        message += breakLine;

        message += 'Shared Modules:' + breakLine;
        for (var module in sharedModules) {
            message += 'Module: ' + module + ' loaded: ' + sharedModules[module].loaded + breakLine;
        }

        message += breakLine;

        message += 'Unloaded Modules:' + breakLine;
        for (var module in unloadedModules) {
            message += 'Module: ' + module + ' type: ' + unloadedModules[module].type + breakLine;
        }

        message += breakLine;

        return message;
    }

    function init() {
        alert('init');
    }

    function extend(name, source) {
        webAppLoader[name] = source();
    }

    webAppLoader = { modules: {}, plugins: {}, shared: {} };
    webAppLoader.addModule = addModule;
    webAppLoader.loadModule = loadModule;
    webAppLoader.unloadModule = unloadModule;
    webAppLoader.execute = execute;
    webAppLoader.getInfo = getInfo;
    webAppLoader.extend = extend;
    webAppLoader.init = init;
    webAppLoader.output = output;
    webAppLoader.eventManager = eventManager;

    return webAppLoader;
})();