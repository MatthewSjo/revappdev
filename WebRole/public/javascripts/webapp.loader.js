// ------------------------------------------
// WEB APP LOADER
// ------------------------------------------

var WebAppLoader = {};

(function () {
    var modules         = [],
        module          = {},
        extensions      = {}, // List of extensions.
        sharingOptions  = { sharingDenied: 0, sharingAllowed: 1 },

    // Loader settings:
        disableLog      = false,
        suppressErrors  = false,
        sharingSetting  = sharingOptions.sharingAllowed;

    // TODO: Make loader settings available to all extensions.

    // Set the default module object. This will be used as base when modules,
    // plugins and shared modules will be created later.
    module = {
    
    // Properties:
        name                : '',
        source              : null,
        bin                 : null,
        added               : false,
        loaded              : false,
        unloaded            : false,
        isPlugin            : false,
        isShared            : false,
        hasEvents           : false,
        plugins             : [],
        sharedModules       : [],
        
    // Private methods:
        getPlugin           : function(pluginName) {
            var isPluginAvailable = this.plugins.some(function(m){
                return m === pluginName;
            });
            
            // If the plugin is in the list of the available plugins return it.
            return (isPluginAvailable)
                ? this.loader.getPlugin(pluginName)
                : null;
        },
        getSharedModule     : function(sharedModuleName) {
            var isSharedModuleAvailable = this.sharedModules.some(function(m){
                return m === sharedModuleName;
            });
            
            // If the shared module is in the list of the available modules return it.
            return (isSharedModuleAvailable)
                ? this.loader.getSharedModule(sharedModuleName)
                : null;
        },
        getEventManager     : function (){
            // if the module manages events return the event manager.
            return (this.hasEvents) 
                ? this.loader.getEventManager()
                : null;
        },
        getConsole          : function () {
            return this.loader.getConsole();
        },

    // Shared objects:
        loader: {}
    };

    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------

    // Private function that throws an error only if suppressErrors is false. 
    function throwException(message, functionName) {
        var messageHeader = (functionName)
            ? ' - ' + functionName + ' exception! '
            : '';

        if (!suppressErrors) {
            throw (messageHeader + message);
        }
    }

    // Private function
    function getValueAs(value, type) {
        function getValue(exp, type, defaultValue) {
            return (typeof exp === type) ? exp : defaultValue;
        }

        function getValueAsArray(exp, defaultValue) {
            return (Array.isArray(exp)) ? exp : defaultValue;
        }

        switch (type) {
            case 'boolean':
                return getValue(value, 'boolean', false);
            case 'b':
                return getValue(value, 'boolean', false);
            case 'string':
                return getValue(value, 'string', '');
            case 's':
                return getValue(value, 'string', '');
            case 'number':
                return getValue(value, 'number', 0);
            case 'n':
                return getValue(value, 'number', 0);
            case 'object':
                return getValue(value, 'object', {});
            case 'o':
                return getValue(value, 'object', {});
            case 'array':
                return getValueAsArray(value, []);
            case 'a':
                return getValueAsArray(value, []);
            default:
                return value;
        }
    }
    
    // ------------------------------------------
    // BUILT-IN - EVENT MANAGER
    // ------------------------------------------

    // Public
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
                events[event].apply(null, args);
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
    // BUILT-IN - CONSOLE
    // ------------------------------------------

    // Public
    var consoleManager = (function () {
        var consoleManager = {},
            log = (disableLog)
                ? function () { }
                : function () { console.log.apply(console, arguments); };

        consoleManager.log = log;

        return consoleManager;
    })();

    // ------------------------------------------
    // LOADER
    // ------------------------------------------

    // Private function that checks if the specified module exists.
    function moduleExists(moduleName) {
        modules.some(function(m) { return m.name === moduleName; });
    }

    // Attempt to retrieve a module.
    //
    // 'moduleName'     - The module name.
    // 'moduleType'     - A string that defining the module type. 
    //                    Can be one of: 'plugin' (search in the list of modules
    //                    tagged as plugins), 'shared' (search in the list of
    //                    modules tagged as shared) or empty (search in all 
    //                    available modules).
    // [PRIVATE]
    function getModule(moduleName, moduleType) {
        var module = {};
    
        module = modules.filter(function(m) {
            switch(moduleType) {
                case 'plugin':
                    return m.name === moduleName && m.isPlugin;
                    break;
                case 'shared':
                    return m.name === moduleName && m.isShared;
                    break;
                case 'extension':
                    return m.name === moduleName && m.isExtension;
                    break;
                default:
                    return m.name === moduleName;
            }   
        })[0] || null;
            
        return module;
    }
    
    // Public
    function addModule(config, source) {
        var name                    = getValueAs(config.name, 'string'),
            hasEvents               = getValueAs(config.hasEvents, 'boolean'),
            isShared                = getValueAs(config.isShared, 'boolean'),
            isPlugin                = getValueAs(config.isPlugin, 'boolean'),
            pluginsToLoad           = getValueAs(config.plugins, 'array'),
            sharedModulesToLoad     = getValueAs(config.sharedModules, 'array'),
            errorMessage            = '',
            isSharingDenied         = '';

        // If the module doesn't exist...
        if (!moduleExists(name)) {

            // ... check if sharing is allowed or denied for this module and then...
            isSharingDenied = (
                isShared 
                && sharedModulesToLoad.length > 0)
                && (sharingSetting === sharingOptions.sharingDenied
            );

            if (isSharingDenied) {
                errorMessage += '"' + name + '" is a shared module and cannot load any other shared modules. ';
                errorMessage += 'Set "isShared" to false or remove "sharedModules" to solve the problem.';
                throwException(errorMessage, 'addModule');
            }
            
            // ... create a new module and add it to the list of modules.
            var moduleToAdd = Object.create(module);

            moduleToAdd.source          = source;
            moduleToAdd.isPlugin        = isPlugin;
            moduleToAdd.name            = name;
            moduleToAdd.isShared        = isShared;
            moduleToAdd.hasEvents       = hasEvents;
            moduleToAdd.plugins         = pluginsToLoad;
            moduleToAdd.sharedModules   = sharedModulesToLoad;
            moduleToAdd.added           = true;
            
            if (moduleToAdd.isPlugin) {
                moduleToAdd.getConsole = getConsole;
                moduleToAdd.getEventManager = getEventManager;
            } else {
                extendAddModule(config, moduleToAdd);
            }
            

            modules.push(moduleToAdd);    
        }
    }

    // Public
    function loadModule(moduleName, moduleType) {
        var moduleToLoad;

        // Get the module.
        moduleToLoad = getModule(moduleName, moduleType);
        
        // Return immediately if nothing is found.
        if (!moduleToLoad) {
            return moduleToLoad; // moduleToLoad should be null at this point.
        }

        // If the module exists but its source is still not executed, loaded it.
        if(!moduleToLoad.loaded) {
            if (moduleToLoad.isExtension){
                moduleToLoad.bin = moduleToLoad.source(module);
                extensions[moduleName] = moduleToLoad.bin; //source.call(this, module)
            } else {
                moduleToLoad.bin = moduleToLoad.source();
            }

            moduleToLoad.loaded = true;
            moduleToLoad.unloaded = false;

            // If the module supports events attach the 'on' method to it.
            if (moduleToLoad.hasEvents) {
                moduleToLoad.bin.on = eventManager.on;
            }
        }
        
        extendLoadModule(moduleToLoad);

        // If something goes wrong return null.
        return (moduleToLoad.loaded)
            ? moduleToLoad.bin
            : null;
    }

    // Public
    function unloadModule(moduleName) {
        var moduleToUnload,
            success = false;

        // Get the module.
        moduleToUnload = getModule(moduleName);
        
        if (moduleToUnload) {
            moduleToUnload.bin = null;
            moduleToUnload.loaded = false;
            moduleToUnload.unloaded = true;
            success = true;
        }

        return success;
    }

    // Public
    function reloadModule(moduleName) {
        if (unloadModule(moduleName)) {
            return loadModule(moduleName);
        }
    }

    // Public
    function getInfo(outputAsHtml) {
        var modulesFound            = [],
            pluginsFound            = [],
            sharedModulesFound      = [],
            unloadedModulesFound    = [],
            message                 = '',
            breakLine               = '\n';

        if (getValueAs(outputAsHtml, 'boolean')) {
            breakLine = '</br>';
        }
        
        modulesFound = modules.filter(function(m){ return (m.isPlugin == false && m.isShared == false); });
        pluginsFound = modules.filter(function(m){ return (m.isPlugin == true); });
        sharedModulesFound = modules.filter(function(m){ return (m.isShared == true); });

        function addToMessage(text) {
            message += (getValueAs(text, 'string')) + breakLine;
        }

        function getModulesInfo(moduleList, caption) {
            var module  = null,
                status  = '',
                len     = 0;

            len = moduleList.length;

            addToMessage(caption + '(' + len + ')');
            addToMessage(/* break line */);

            for (var i = 0; i < len; i += 1) {
                module = moduleList[i];
                
                if (module.loaded) { status = 'loaded'; }
                if (module.unloaded) { status = 'unloaded'; }
                if (module.added && (!module.loaded && !module.unloaded)) { status = 'added'; }

                addToMessage ('- ' + status.toUpperCase() + ':\t' + module.name + ': ');
            }
            
            addToMessage(/* break line */);
        }

        addToMessage('TOTAL NUMBER MODULES: ' + modules.length);
        addToMessage(/* break line */);

        getModulesInfo(modulesFound, 'STANDARD MODULES');
        getModulesInfo(pluginsFound, 'PLUGINS');
        getModulesInfo(sharedModulesFound, 'SHARED MODULES');

        return message;
    }

    // Public
    function loadSharedModule(moduleName) {
        return loadModule(moduleName, 'shared');
    }

    // Public
    function getEventManager() {
        return eventManager;
    }

    // Public
    function getConsole() {
        return consoleManager;
    }

    // Public
    function extend(name, source) {
        WebAppLoader[name] = source();
    }

    function init(){
        alert('INIT!');
    }

    // ------------------------------------------
    // EXTENSIONS
    // ------------------------------------------
    
    // Public
    function addExtension(config, source) {
        var name                    = getValueAs(config.name, 'string'),
            hasEvents               = getValueAs(config.hasEvents, 'boolean'),
            pluginsToLoad           = getValueAs(config.plugins, 'array'),
            sharedModulesToLoad     = getValueAs(config.sharedModules, 'array');

        // If the module doesn't exist...
        if (!moduleExists(name)) {

            // ... create a new module and add it to the list of modules.
            var moduleToAdd = Object.create(module);

            moduleToAdd.source          = source;
            moduleToAdd.name            = name;
            moduleToAdd.isExtension     = true;           
            moduleToAdd.plugins         = pluginsToLoad;
            moduleToAdd.sharedModules   = sharedModulesToLoad;
            moduleToAdd.added           = true;
            moduleToAdd.hasEvents       = hasEvents;

            modules.push(moduleToAdd);   
            loadModule(name, 'extension');
        }
    }

    // Private
    function extendAddModule(config, moduleToAdd) {
        var moduleToExtend = moduleToAdd;

        for(ext in extensions) {
            if (extensions[ext].extendAddModule) {
                extensions[ext].extendAddModule(config, moduleToAdd);
            }
        } 
    }

    // Private
    function extendLoadModule(moduleToLoad) {
        var moduleToExtend = moduleToLoad;

        for(ext in extensions) {
            if (extensions[ext].extendLoadModule) {
                extensions[ext].extendLoadModule(moduleToLoad);
            }
        } 
    }
    
    // ------------------------------------------
    // MODULE OBJECT
    // ------------------------------------------

    module.loader = (function(){
        var loader = {};
        
        function getPlugin(pluginName) {
            return loadModule(pluginName, 'plugin');
        }

        function getSharedModule(sharedModuleName) {
            return loadModule(sharedModuleName, 'shared');
        }
        
        function getEventManager() {
            return eventManager;
        }

        function getConsole() {
            return consoleManager; // Don't call getConsole() from here.
        }

        loader.getPlugin = getPlugin;
        loader.getSharedModule = getSharedModule;
        loader.getEventManager = getEventManager;
        loader.getConsole = getConsole;

        return loader;
                
    })();
    
    //Add public methods to the loader.
    WebAppLoader.addModule = addModule;
    WebAppLoader.loadModule = loadModule;
    WebAppLoader.unloadModule = unloadModule;
    WebAppLoader.getSharedModule = loadSharedModule;
    WebAppLoader.getEventManager = getEventManager;
    WebAppLoader.getConsole = getConsole;
    WebAppLoader.getInfo = getInfo;
    WebAppLoader.reloadModule = reloadModule;
    WebAppLoader.addExtension = addExtension;
    WebAppLoader.init = init;

})();