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
        disableLog      = true,
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
                case 'shared':
                    return m.name === moduleName && m.isShared;
                case 'extension':
                    return m.name === moduleName && m.isExtension;
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

        for(var ext in extensions) {
            if (extensions[ext].extendAddModule) {
                extensions[ext].extendAddModule(config, moduleToAdd);
            }
        } 
    }

    // Private
    function extendLoadModule(moduleToLoad) {
        var moduleToExtend = moduleToLoad;

        for(var ext in extensions) {
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
// ------------------------------------------
// BASE64
// ------------------------------------------

WebAppLoader.addModule({ name: 'base64', isPlugin: true}, function () {
    var base64 = {},
        keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // private method for UTF-8 encoding
    function utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    // private method for UTF-8 decoding
    function utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

    // public method for encoding
    function encode(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                      keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }

        return output;
    }

    // public method for decoding
    function decode(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = utf8_decode(output);

        return output;

    }

    base64.encode = encode;
    base64.decode = decode;

    return base64;
});
// ------------------------------------------
// HELPER
// ------------------------------------------

WebAppLoader.addModule({ name: 'helper', isPlugin: true }, function () {
    var helper = {};
    // var output = this.getConsole();
    // ------------------------------------------
    // STRING FUNCTIONS
    // ------------------------------------------

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function startsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    function endsWith(str, suffix) {
        return str.match(suffix + "$") == suffix;
    }

    // ------------------------------------------
    // DATA TYPE FUNCTIONS
    // ------------------------------------------

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

    // Public
    function getType(value) {
        var TYPES = {
            'undefined'        : 'undefined',
            'number'           : 'number',
            'boolean'          : 'boolean',
            'string'           : 'string',
            '[object Function]': 'function',
            '[object RegExp]'  : 'regexp',
            '[object Array]'   : 'array',
            '[object Date]'    : 'date',
            '[object Error]'   : 'error'
        },
        TOSTRING = Object.prototype.toString;

        function type(o) {
            return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
        } 
        
        return type(value);      
    }

    // Public
    function hasValue(value) {
        return (value != undefined && value != null);
    }

    // ------------------------------------------
    // GENERIC FUNCTIONS
    // ------------------------------------------

    function createUUID() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    function removeObjectFromArray(arrayItems, propertyToCheck, value) {
        var removedObject = null;

         for(var i = arrayItems.length-1; i >= 0; i--){  
            if(arrayItems[i] && arrayItems[i][propertyToCheck] === value){                     
                removedObject = arrayItems.splice(i,1);
                break;
            }
        }
       
        return removedObject;
    }

    function getObjectFromArray(arrayItems, propertyToCheck, value) {
        var object = null;

         for(var i = arrayItems.length-1; i >= 0; i--){  
            if(arrayItems[i] && arrayItems[i][propertyToCheck] === value){                     
                object = arrayItems[i];
                break;
            }
        }
       
        return object;
    }

    function getURLParameter(name) {
        var param = decodeURIComponent(
            (location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
        );  
        return (param === 'null')
            ? null
            : param;
    }

    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes[0].nodeValue;
    }

    helper.capitaliseFirstLetter = capitaliseFirstLetter;
    helper.getValueAs = getValueAs;
    helper.startsWith = startsWith;
    helper.endsWith = endsWith;
    helper.getType = getType;
    helper.hasValue = hasValue;
    helper.createUUID = createUUID;
    helper.removeObjectFromArray = removeObjectFromArray;
    helper.getURLParameter = getURLParameter;
    helper.getObjectFromArray = getObjectFromArray;
    helper.htmlDecode = htmlDecode;

    return helper;
});
// ------------------------------------------
// LOCAL STORAGE MANAGER
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'storage', plugins: ['helper'], hasEvents: true, isPlugin: true }, function () {
    var storage  = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper'),
        revolutionNamespace = 'Revolution';
        usedSpace           = 0;

    // Public
    function getUsedSpace() {
        return JSON.stringify(localStorage).length;
    }

    // Private
    function getNamespacedName(itemName, namespace) {
        var namespacedName = null;

        if (itemName && (typeof itemName === 'string')) {
            namespacedName = (namespace || revolutionNamespace) + helper.capitaliseFirstLetter(itemName);
        }

        return namespacedName;
    }

    // Private
    function setItem(key, value) {
        localStorage.setItem(key, value);
        output.log('Storage - setItem:', key, value);
    }

    // Private
    function getItem(key) {
        return localStorage.getItem(key);
    }

    // Public
    function load(itemName, namespace) {
        var name        = getNamespacedName(itemName, namespace),
            storedItem  = getItem(name),
            value       = null;
        
        // Check if the value exists and try to retrieve it.
        if (storedItem) {
            // Check if the value is a stringified JSON object.
            if (helper.startsWith(storedItem, '{"')) {
                try {
                    value = JSON.parse(storedItem);
                } catch (e) {
                    output.log('Storage - failed to parse stored item:', key, value);
                }
            } else {
                value = storedItem;
            }
        }
        
        return value;    
    }

    // Public
    function save(itemName, itemValue, namespace) {
        var name = getNamespacedName(itemName, namespace),
            value = ''; //stringifiedValue = '';

        if (name && helper.hasValue(itemValue)) {
            value = (typeof itemValue === 'object')
                ? JSON.stringify(itemValue)
                : itemValue;
            
            setItem(name, value);
                        
        } else {
            output.log('Storage - cannot save item.', itemName, itemValue);
        }
    }

    // Public
    function remove(itemName, namespace) {
        var name = getNamespacedName(itemName, namespace);

        if (name) {
            localStorage.removeItem(name);
            output.log('Storage - removed item.', name);
        }
    }

    // Public
    function count() {
        output.log('count()', localStorage.length);
    }

    // Public
    function clearAll() {
        localStorage.clear();  
        output.log('clearAll()');
    }

    storage.load = load;
    storage.save = save;
    storage.remove = remove;
    storage.count = count;
    storage.clearAll = clearAll;
    storage.getUsedSpace = getUsedSpace;

    return storage;
});
// ------------------------------------------
// DATA OBJECT
// ------------------------------------------

WebAppLoader.addExtension({ name: 'dataObject', plugins: ['helper', 'storage'], hasEvents: true }, function (module) {
    var extension       = {},
        loader          = module.loader, // The loader object shared by all modules.
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        storage         = this.getPlugin('storage'),
        helper          = this.getPlugin('helper');
        dataObjects     = {};

    var dataObject = (function() {
        var dataObject  = {};

        // NOTA BENE:  
        // dataObject.data = {}; // This is a shared property.
        // this.data = {}; // If declared inside a function it's a private property.

        // TODO: Try to define methods using enumerable option set to false in order 
        // to add properties to the object directly instead to store them in data[..].

//        dataObject.name = 'dataObject@' + Date.now();
//        dataObject.sayHello = function () {
//            console.log('HELLO!', Object.keys(this));
//        };
        
        // Public
        function define(properties) {
            this.data = {};
            this.defaults = {};
            for (var property in properties) {
                this.data[property] = properties[property];
                // Store default properties also so we can restore them in a second moment.
                this.defaults[property] = properties[property];
            }   
        }

        // Public
        function get(property) {
            return this.data[property];
        }

        // Public
        function set(property, value) {
             this.data[property] = value;
        }
        
        // Public
        function saveData(username) {
            // The privateId property is set when the getDataObject method is
            // invoked the first time.
            storage.save (this.privateId, this.data, username);
        }

        // Public
        function loadData(username) {
            return this.data = storage.load(this.privateId, username) 
                || this.defaults // If no data try to get defaults
                || null;         // or null
        }

        // Public
        function getData() {
            return this.data || {};
        }

        // Public
        function setData(value) {
            return this.data = value;
        }

        dataObject.define = define;
        dataObject.get = get;
        dataObject.set = set;
        dataObject.getData = getData;
        dataObject.setData = setData;
        dataObject.saveData = saveData;
        dataObject.loadData = loadData;

        return dataObject;
    })();

    // Invoked when a new module is added.
    function extendAddModule(config, moduleToAdd) {
        // Code example:
        //      var hasEvents = helper.getValueAs(config.hasEvents, 'boolean');
        //      moduleToAdd.hasEvents = hasEvents;
        var dataObjects = helper.getValueAs(config.dataObjects, 'array');
        
        moduleToAdd.dataObjects = dataObjects;
    }
    
    // TODO: Add properties to store lowercase and uppuercase values.
    // Invoked when a module is loaded.
    function extendLoadModule(moduleToLoad) {
        if (moduleToLoad.dataObjects && moduleToLoad.dataObjects.length > 0) {
            moduleToLoad.bin.getData = function (dataObjectName) {
                // return this[dataObjectName].getData();
                return dataObjects[dataObjectName].getData();
            };
            
            moduleToLoad.bin.saveData = function (dataObjectName, username) {
                // return this[dataObjectName].saveData(username);
                return dataObjects[dataObjectName].saveData(username);
            };
            
            moduleToLoad.bin.loadData = function (dataObjectName, username) {
                // return this[dataObjectName].loadData(username);
                return dataObjects[dataObjectName].loadData(username);
            };

            moduleToLoad.bin.getDataObject = function (dataObjectName) {
                return this[dataObjectName];
            };
        }
    }

    // Private functions.
    // Add code here.

    // Module methods:
    module.getDataObject = function (objectlName) {
        var isDataObjectAvailable = this.dataObjects.some(function(m){
            return m === objectlName;
        });
        
        var newDataObject = null;
           
        // If the shared module is in the list of the available modules return it.
        if (isDataObjectAvailable) {
            if (!dataObjects[objectlName]) {
                newDataObject = Object.create(dataObject);
                newDataObject.privateId = objectlName;
                dataObjects[objectlName] = newDataObject;
            } else {
                throw ('Data object "' + objectlName + '" already exists.');
            }
        }

        return newDataObject;

        /*
        return (isDataObjectAvailable)
            ? Object.create(dataObject)
            : null;
        */
    };

    // Shared module loader methods:
    // Add code here

    // Public WebAppLoader methods;
    // Add code here

    extension.extendAddModule = extendAddModule;
    extension.extendLoadModule = extendLoadModule;

    return extension;
});
// ------------------------------------------
// PORTFOLIOS LIST
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfoliosList', plugins: [],
    sharedModules: ['settings', 'pageElements', 'ajaxManager'], hasEvents: true }, function () {
    var portfoliosList  = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        settings        = this.getSharedModule('settings'),
        el              = this.getSharedModule('pageElements'),
        ajaxManager     = this.getSharedModule('ajaxManager');
    
    $(document).on('click', el.portfolioAnalysisLink, onPortfolioAnalysisClick);

    function onPortfolioAnalysisClick(e) {
        var uri = $(this).attr("data-link");

        ajaxManager.post(settings.siteUrls.analysis, { uri: uri }, function (data) {
            eventManager.raiseEvent('onDataReceived', data);
        });
        
        return false;
    }
    
    return portfoliosList;
});
// ------------------------------------------
// ISCROLL
// ------------------------------------------

WebAppLoader.addModule({ name: 'scroll' }, function () {
    var scroll = {},
        myScroll; // Please don't initialize myScroll.

    /* Use this for high compatibility (iDevice + Android)*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    function rebuildScroll(id, optionConfig) {
        var wrapper = 'div#' + id + ' #wrapper',
            options = optionConfig || {}; // { hScrollbar: false, vScrollbar: true }

        options.useTransform = false;
        options.onBeforeScrollStart = function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                e.preventDefault();
            }
        };
        // options.snap = 'hr';
        // options.momentum = true;

        if (myScroll) {
            myScroll.destroy();
            myScroll = null;
        }

        if ($(wrapper).get(0)) {
            setTimeout(function () {
                myScroll = new iScroll($(wrapper).get(0), options);
            }, 25); // Usually timers should be set to a minimum of 25 milliseconds to work properly.
        }
    }

    function goUp() {
        try {
            myScroll.scrollTo(0, 0, 200);
        } catch (e) {

        }
    }

    scroll.rebuild = rebuildScroll;
    scroll.goUp = goUp;

    return scroll;
});
// ------------------------------------------
// SPINNING WHEEL SLOT
// ------------------------------------------

WebAppLoader.addModule({ name: 'spinningWheel', plugins: ['helper'], hasEvents: true }, function () {
    var spinningWheel   = {},
        slots           = [],
        slotIndices     = {},
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper');

    function getSlot(index) {
        if (typeof index == 'string') {
            index = slotIndices[index];
        }

        return slots[index];
    }

    function create(config) {
        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id);

            slotIndices[val.id] = i;
            slots[i] = {
                id: val.id,
                repository: val.repository,
                lastItemSelected: '', // TODO: Get a value from the config.
                onDoneHandler: 'on' + id + 'Done',
                onCancelHandler: 'on' + id + 'Cancel',
                onSlotCancel: function () {
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onCancelHandler);
                },
                onSlotDone: function () {
                    var key, value, results;

                    results = SpinningWheel.getSelectedValues();
                    key = results.keys[0] || '';
                    value = results.values[0] || '';

                    slots[i].lastItemSelected = key;
                    SpinningWheel.close();
                    eventManager.raiseEvent(slots[i].onDoneHandler, key, value);
                },
                show: function (defaultItem) {
                    function initSlot(slotItems) {
                        SpinningWheel.addSlot(slotItems, '', defaultItem || slots[i].lastItemSelected);
                        SpinningWheel.setCancelAction(slots[i].onSlotCancel);
                        SpinningWheel.setDoneAction(slots[i].onSlotDone);
                        SpinningWheel.open();
                    }

                    this.repository.getData(initSlot);
                }
            };
        });
    }

    spinningWheel.create = create;
    spinningWheel.getSlot = getSlot;

    return spinningWheel;
});
// ------------------------------------------
// SWIPE BUTTON
// ------------------------------------------

WebAppLoader.addModule({ name: 'swipeButton', plugins: ['helper'],
    sharedModules: ['settings', 'pageElements', 'ajaxManager'], hasEvents: true }, function () {
    var swipeButton     = {},
        output          = this.getConsole(),
        helper          = this.getPlugin('helper'),
        eventManager    = this.getEventManager(),
        el              = this.getSharedModule('pageElements');
    
      function addTo(containerId, label, callback, autoRemove, buttonClass) {
        $(containerId + ' li').swipeDelete({
            btnLabel: label,
            btnClass: buttonClass,
            click: function(e){
                e.preventDefault();
                if (autoRemove) {
                    $(this).parents('li').remove();
                }
                output.log('swipe');
                callback($(this));
            }
        });
    }

    swipeButton.addTo = addTo;

    return swipeButton;
});
// ------------------------------------------
// TABBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'tabbar', plugins: ['helper'], hasEvents: true }, function () {
    var tabbar          = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper'),
        tabbarId        = '',
        buttons         = [],
        buttonIndices   = {},
        visible         = true;

    function hide() {
        // $(tabbarId).hide();
        output.log('tabbar.hide()');
        $(tabbarId).css({ opacity: 0 });
        visible = false;
    }

    function show() {
        // $(tabbarId).show();
        // $(tabbarId).css({ transition: 'visibility 1s ease-in-out' }); //show();
        $(tabbarId).css({ opacity: 1 });
        visible = true;
        output.log('tabbar.show()');
    }

    function getButton(index) {
        if (typeof index == 'string') {
            index = buttonIndices[index];
        }

        return buttons[index];
    }

    function create(config) {
        var buttonPrefix = config.buttonPrefix || 'tabbar_btn',
                badgePrefix = 'tabbar_badge',
                that = this;

        tabbarId = config.tabbarId || 'nav#tabbar';
        visible = (typeof config.visible == 'boolean')
                ? config.visible
                : true;

        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id),
                    itemsCount = config.items.length || 1,
                    buttonWidth = 100 / itemsCount;

            buttonIndices[val.id] = i;
            buttons[i] = {
                id: val.id,
                linkId: buttonPrefix + id,
                badgeId: badgePrefix + id,
                title: val.title,
                btnClass: val.btnClass,
                highlight: val.highlight || false,
                eventHandler: 'on' + id + 'Tap',
                isHighlighted: false,
                isDisabled: false,
                setHighlight: function (highlighted) {
                    var tabbarItem = $('#' + this.linkId);

                    if(this.highlight) {
                        this.isHighlighted = !highlighted;
                        if (this.isHighlighted) {
                            $("#tabbar a").removeClass("current");
                            $("#tabbar div").removeClass("current");
                            this.isHighlighted = false;    
                        } else {
                            $("#tabbar a").addClass("current").not(tabbarItem).removeClass("current");
                            $("#tabbar div").addClass("current").not(tabbarItem).removeClass("current");
                            this.isHighlighted = true;
                        }
                    }
                },
                toggleHighlighted: function () {
                    if (this.highlight) {
                        this.setHighlight(!this.isHighlighted);
                    }
                },
                setDisabled: function (disabled) {
                    var opacity = (disabled) ? 0.20 : 1,
                            badgeBackColor = (disabled) ? '#333' : '#f00';

                    this.isDisabled = disabled;
                    $('#' + this.linkId).css({ opacity: opacity });
                    $('#' + this.badgeId).css({ backgroundColor: badgeBackColor });

                },
                setBadgeText: function (text) {
                    var badge = $('#' + this.badgeId),
                            displayBadge = true;

                    if (text) {
                        badge.html(text);
                        badge.show();
                    } else {
                        badge.hide();
                    }
                }
            };

            $(tabbarId + ' ul').append(
                    $('<li>').css('width', buttonWidth + '%').append(
                        $('<a>').attr('id', buttons[i].linkId).append(
                            $('<small>').attr({
                                id: buttons[i].badgeId,
                                'class': 'badge right',
                                style: 'display: none;'
                            })).append(
                            $('<strong>').append(buttons[i].title)).append(
                            $('<div>').attr('class', buttons[i].btnClass)
                        )));
        });

        $(tabbarId + ' ul li a').each(function (i) {
            $(this).on('click', function () {
                if (visible) {
                    if (!buttons[i].isDisabled) {
                        output.log(buttons[i].title + ' was tapped');
                        buttons[i].toggleHighlighted();

                        eventManager.raiseEvent(buttons[i].eventHandler, buttons[i]);
                            // ? !buttons[i].isHighlighted 
                            // : false);
                    } else {
                        output.log(buttons[i].title + ' is disabled');
                    }
                }
            });
        });

        if (!visible) {
            // $(tabbarId).hide();
            $(tabbarId).css({ opacity: 0 });
        } else {
            // $(tabbarId).show();
            $(tabbarId).css({ opacity: 1 });
        }
    }

    tabbar.create = create;
    tabbar.hide = hide;
    tabbar.show = show;
    tabbar.buttons = buttons;
    tabbar.getButton = getButton;

    return tabbar;
});


// ------------------------------------------
// TOOLBAR
// ------------------------------------------

WebAppLoader.addModule({ name: 'toolbar', plugins: ['helper'], sharedModules: ['pageElements'], hasEvents: true }, function () {
    var toolbar          = {},
        output           = this.getConsole(),
        eventManager     = this.getEventManager(),
        settings         = this.getSharedModule('settings'),
        el               = this.getSharedModule('pageElements'),
        helper           = this.getPlugin('helper'),
        toolbarId        = '',
        buttons          = [],
        buttonIndices    = {},
        visible          = true,
        buttonWidth      = 30,
        buttonPadding    = 5,
        buttonsCount     = 0;

    $(el.toolbar).click(function () {
        eventManager.raiseEvent('onTap');
        output.log('toolbar tapped!');
    });
    
    // Enlarge and center the title to prevet ellispsis.
    $('#jqt .toolbar > h1').width(300).css('margin', '1px 0 0 -150px');

    function getButton(index) {
        if (typeof index == 'string') {
            index = buttonIndices[index];
        }

        return buttons[index];
    }

    function create(config) {
        var buttonPrefix = config.buttonPrefix || 'toolbar_btn',
                that = this;

        toolbarId = config.toolbarId || '.toolbar';
        visible = helper.getValueAs(config.visible, 'boolean');

        $.each(config.items, function (i, val) {
            var id = helper.capitaliseFirstLetter(val.id),
                    itemsCount = config.items.length || 1;

            buttonIndices[val.id] = i;
            buttons[i] = {
                id: val.id,
                buttonId: buttonPrefix + id,
                // linkId: buttonPrefix + id,
                // badgeId: badgePrefix + id,
                title: val.title,
                btnClass: val.btnClass,
                eventHandler: 'on' + id + 'Tap',
                isDisabled: false,
                isSelected: false,
                select: function () {
                    var button     = $('#' + buttons[i].buttonId),
                        classOn    = buttons[i].btnClass + '_on',
                        classOff   = buttons[i].btnClass + '_off';
                    
                    button.removeClass(classOff);
                    button.addClass(classOn);
                    this.isSelected = true;
                },
                deselect: function () {
                    var button     = $('#' + buttons[i].buttonId),
                        classOn    = buttons[i].btnClass + '_on',
                        classOff   = buttons[i].btnClass + '_off';
                    
                    button.removeClass(classOn);
                    button.addClass(classOff);
                    this.isSelected = false;
                }
//                setDisabled: function (disabled) {
//                    var opacity = (disabled) ? 0.20 : 1,
//                            badgeBackColor = (disabled) ? '#333' : '#f00';

//                    this.isDisabled = disabled;
//                    $('#' + this.linkId).css({ opacity: opacity });
//                    $('#' + this.badgeId).css({ backgroundColor: badgeBackColor });

//                },
//                setBadgeText: function (text) {
//                    var badge = $('#' + this.badgeId),
//                            displayBadge = true;

//                    if (text) {
//                        badge.html(text);
//                        badge.show();
//                    } else {
//                        badge.hide();
//                    }
//                }
            };

            $(toolbarId).append(
                $('<div>')
                    .addClass('toolbar_button ' + buttons[i].btnClass + '_off')
                    .attr({ 
                        id: buttons[i].buttonId,
                        style: 'right: ' + (buttonsCount * buttonWidth + buttonPadding) + 'px;'
                    })
                    .on('click', function(event){
                        var isSelected = buttons[i].isSelected,
                            classOn    = buttons[i].btnClass + '_on',
                            classOff   = buttons[i].btnClass + '_off';
                        
                        output.log('toolbar button tapped!');
                        
                        if (isSelected) {
                            isSelected = false;
                            $(this).removeClass(classOn);
                            $(this).addClass(classOff);
                        } else {
                            isSelected = true;
                            $(this).removeClass(classOff);
                            $(this).addClass(classOn);
                        }
                        
                        buttons[i].isSelected = isSelected;
                        eventManager.raiseEvent(buttons[i].eventHandler, isSelected);
                        event.stopPropagation();
                    })
            );

            buttonsCount += 1;
        });
    }

    toolbar.create = create;
    toolbar.getButton = getButton;

    return toolbar;
});
// ------------------------------------------
// AJAX MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'ajaxManager', plugins: ['helper'], hasEvents: true, isShared: true }, function () {

    var ajaxManager  = {},
        output       = this.getConsole(),
        eventManager = this.getEventManager(),
        helper       = this.getPlugin('helper'),
        token        = '';

    // Public
    function getToken() {
        return token;
    }

    // Public
    function setToken(tokenValue) {
        token = tokenValue || null;
    }

    // Public
    function post(urlValue, dataValue, callbackValue, typeValue) {
        var url      = '',
            data     = {},
            type     = typeValue, // || 'json',
            callback = callbackValue || null;

        url = urlValue;

        if (typeof dataValue !== 'function') {
            data = dataValue || {};
            if (token && !data.token) {
                data.token = token;
            }
        } else {
            callback = dataValue;
            type = callbackValue;
        }

        $.post(url, data, callback, type);

    }

    function get() {

    }

    ajaxManager.post = post;
    ajaxManager.getToken = getToken;
    ajaxManager.setToken = setToken;
    ajaxManager.get = get;

    return ajaxManager;
});
// ------------------------------------------
// CHARTS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartComponents', plugins: ['helper'], sharedModules: ['chartManager', 'localizationManager'],
    dataObjects: ['charts'], hasEvents: true, isShared: true }, function () {
    
    var chartComponents     = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper'),
        chartManager        = this.getSharedModule('chartManager'),
        lang                = this.getSharedModule('localizationManager').getLanguage() || {},
        createdCharts       = {},
        chartsDataObject    = this.getDataObject('charts'),
        chartsData          = null;

    chartsDataObject.define({
        // ------------------------------------------
        // BAR CHARTS
        // ------------------------------------------

        'performance_bar': {
            chartId: 'performance_bar',
            title: lang.chart.performanceBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['rp'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }
        },
        'risk_bar': {
            chartId: 'risk_bar',
            title: lang.chart.riskBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wp', 'contributionvar'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }
        },
        'allocation_bar': {
            chartId: 'allocation_bar',
            title: lang.chart.allocationbarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wover'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Excess Weight %' }
            }
        },
        'contribution_bar': {
            chartId: 'contribution_bar',
            title: lang.chart.contributionBarTitle,
            chartType: 'BarChart',
            include: 'securities',
            measures: ['ctp'],
            includeMeasuresFor: ['securities'],
            options: {
                hAxis: { title: 'Contribution' }
            }
        },
        'attribution_bar': {
            chartId: 'attribution_bar',
            title: lang.chart.attributionBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wendover', 'etotal'],
            includeMeasuresFor: ['childSegments']
        },
        'fixedIncomeContribution_bar': {
            chartId: 'fixedIncomeContribution_bar',
            title: lang.chart.fixedIncomeContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpyc', 'ctpspread', 'ctpcur'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#FF6600', '#CC0000', '#FFCC00']
            }
        },
        'carryContribution_bar': {
            chartId: 'carryContribution_bar',
            title: lang.chart.carryContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpsystcarry', 'ctpspeccarry'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336600', '#990000']
            }
        },
        'yieldCurveContribution_bar': {
            chartId: 'yieldCurveContribution_bar',
            title: lang.chart.yieldCurveContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpshift', 'ctptwist', 'ctpbutterfly', 'ctprolldown'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#CD66CD', '#339900', '#FF9900', '#660000']
            }
        },
        'riskNumbers_bar': {
            chartId: 'riskNumbers_bar',
            title: lang.chart.riskNumbersBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ytmpend', 'mdpend'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336699', '#530066']
            }
        },

        // ------------------------------------------
        // BUBBLE CHARTS
        // ------------------------------------------

        'performance_bubble': {
            chartId: 'performance_bubble',
            title: lang.chart.performanceBubbleTitle,
            chartType: 'BubbleChart',
            include: 'childSegments',
            measures: ['stddevann', 'returnannifgtyr', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Annualized Volatility' },
                vAxis: { title: 'Annualized Return' }
            }
        },
        'risk_bubble': {
            chartId: 'risk_bubble',
            title: lang.chart.riskBubbleTitle,
            chartType: 'BubbleChart',
            include: 'childSegments',
            measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: '% Value at Risk' },
                vAxis: { title: 'Return' }
            }
        },

        // ------------------------------------------
        // COLUMN CHARTS
        // ------------------------------------------

        'contribution_column': {
            chartId: 'contribution_column',
            title: lang.chart.contributionColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['ctp', 'ctb'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Return %' }
            }
        },
        'interestRatesExposure_column': {
            chartId: 'interestRatesExposure_column',
            title: lang.chart.interestRatesExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['interestratesdown100percent', 'interestratesdown50percent', 'interestratesup50percent', 'interestratesup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }
        },
        'creditSpreadsExposure_column': {
            chartId: 'creditSpreadsExposure_column',
            title: lang.chart.creditSpreadsExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['creditspreadsdown100percent', 'creditspreadsdown50percent', 'creditspreadsup50percent', 'creditspreadsup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }
        },
        'dv01Exposure_column': {
            chartId: 'dv01Exposure_column',
            title: lang.chart.dv01ExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#3399CC', '#336699', '#003366']
            }
        },
        'attribution_column': {
            chartId: 'attribution_column',
            title: lang.chart.attributionColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['etotal', 'ealloc', 'eselecinter'],
            includeMeasuresFor: ['childSegments'],
            options: {
                colors: ['#003366', '#FF6600', '#990066']
            }
        },

        // ------------------------------------------
        // PIE CHARTS
        // ------------------------------------------

        'allocation_pie': {
            chartId: 'allocation_pie',
            title: lang.chart.allocationPieTitle,
            chartType: 'PieChart',
            include: 'childSegments',
            measures: ['wpabsoluteend'],
            includeMeasuresFor: ['childSegments']
        },
        'contribution_pie': {
            chartId: 'contribution_pie',
            title: lang.chart.contributionPieTitle,
            chartType: 'PieChart',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: false,
            measures: ['wpabsoluteend', 'ctp'],
            includeMeasuresFor: ['childSegments']
        },
        'risk_pie': {
            chartId: 'risk_pie',
            title: lang.chart.riskPietitle,
            chartType: 'PieChart',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: true,
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['childSegments']
        },

        // ------------------------------------------
        // GRIDS
        // ------------------------------------------

        'performance_grid': {
            chartId: 'performance_grid',
            title: lang.chart.performanceGridTitle,
            chartType: 'Table',
            include: 'none',
            measures: [
                'rp', 'returnann', 'stddevann', 'relr',
                'periodaverage', 'oneperiodhigh', 'oneperiodlow',
                'maxloss', 'percentpositiveperiods', 'correlation',
                'alpha', 'beta', 'rsquared', 'sharperatio',
                'treynorratio', 'inforatioxs'
            ],
            includeMeasuresFor: ['segment']
        },
        'attribution_grid': {
            chartId: 'attribution_grid',
            title: lang.chart.attributionGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ctp', 'ctb', 'ealloclocal', 'eselecinterlocal', 'etotalc', 'etotalmca'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncome_grid': {
            chartId: 'fixedIncome_grid',
            title: lang.chart.fixedIncomeGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ttmpend', 'ytmpend', 'mdpend', 'durwpend', 'spreadpend'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeContribution_grid': {
            chartId: 'fixedIncomeContribution_grid',
            title: lang.chart.fixedIncomeContributionGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ctp', 'ctpyc', 'ctpcarry', 'ctpspread', 'ctpcur', 'ctpother', 'ctpresidual'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeExposure_grid': {
            chartId: 'fixedIncomeExposure_grid',
            title: lang.chart.fixedIncomeExposureGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'wpend', 'interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'performanceTopTen_grid': {
            chartId: 'performanceTopTen_grid',
            title: lang.chart.performanceTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'wpend-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'contributionTopTen_grid': {
            chartId: 'contributionTopTen_grid',
            title: lang.chart.contributionTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'ctp-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'riskTopTen_grid': {
            chartId: 'riskTopTen_grid',
            title: lang.chart.riskTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'expectedshortfallpercent', 'valueatriskpercent', 'expectedvolatilitypercent'],
            oData: { orderby: 'valueatriskpercent-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },

        // ------------------------------------------
        // TREE MAP CHARTS
        // ------------------------------------------

        'performance_treemap': {
            chartId: 'performance_treemap',
            title: lang.chart.performanceTreemapTitle,
            chartType: 'TreeMap',
            include: 'securities',
            measures: ['wpabsoluteend', 'rp'],
            includeMeasuresFor: ['segment', 'securities']
        },
        'risk_treemap': {
            chartId: 'risk_treemap',
            title: lang.chart.riskTreemapTitle,
            chartType: 'TreeMap',
            include: 'childSegments',
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['segment', 'childSegments']
        },

        // ------------------------------------------
        // LINE CHARTS
        // ------------------------------------------

        'performance_line': {
            chartId: 'performance_line',
            title: lang.chart.performanceLineTitle,
            chartType: 'LineChart',
            measures: ['rp', 'rb'],
            seriesType: 'cumulativeIndexed'
        },

        // ------------------------------------------
        // CHART GROUPS
        // ------------------------------------------

        'fi_contribution_group': {
            chartId: 'fi_contribution_group',
            title: lang.chart.fixedIncomeContributionsGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'fixedIncomeContribution_bar',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'carryContribution_bar',
                width: '50%',
                height: '100%'

            }, {
                chartId: 'yieldCurveContribution_bar',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'riskNumbers_bar',
                width: '50%',
                height: '100%'
            }]
        },
        'fi_exposures_group': {
            chartId: 'fi_exposures_group',
            title: lang.chart.fixedIncomeExposuresGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'interestRatesExposure_column',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'creditSpreadsExposure_column',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'dv01Exposure_column',
                width: '50%',
                height: '100%'
            }]
        },
        'fi_gridRiskNumber_group': {
            chartId: 'fi_gridRiskNumber_group',
            title: lang.chart.fixedIncomeRiskNumbersGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'fixedIncome_grid',
                width: '100%',
                height: '100%'
            }, {
                chartId: 'fixedIncomeContribution_grid',
                width: '100%',
                height: '100%'
            }]
        }
    });

    chartsData = chartsDataObject.getData();

    // Public
    function load(chartsToLoad) {
        var chartToLoad, chartId, timePeriodId,
            newRequest = true;

        for (var i = 0; i < chartsToLoad.length; i++) {
            chartId = chartsToLoad[i].chartId;
            timePeriodId = chartsToLoad[i].timePeriodId;

            // If the chart has been created...
            if (createdCharts[chartId]) {
                // Use it else...
                chartToLoad = createdCharts[chartId];
            } else {
                // Create a new chart and return it.
                chartToLoad = chartManager.create(chartsData[chartId]);
                createdCharts[chartId] = chartToLoad;
            }

            // Add the requested time period to the chart if it exists.
            if (timePeriodId) {
                chartToLoad.timePeriods = timePeriodId;
            }

            chartManager.load(chartToLoad, newRequest);

            // Change the status of newRequest only if a valid chart has been loaded.
            if (chartToLoad) {
                newRequest = false;
            }
        }
    }

    function render(charts, renderTo) {
        var chartsToLoad = [],
            htmlToAppend = '';

        function openAnalysisSection(chartTitle) {
            htmlToAppend = '';
            htmlToAppend +=
                '<div class="analysisSummarySection">' +
                '    <h2>' + chartTitle + '</h2>' +
                '    <div class="analysisComponentContainer">';
        }

        function addChartToAnalysisSection(chartToAdd, containerClass) {
            htmlToAppend +=
                '        <div id="' + chartToAdd.chartId + '" class="' + containerClass + '"></div>';
        }

        function addChartToGroup(chartToAdd) {
            htmlToAppend +=
                '        <div id="' + chartToAdd.chartId +
                '" class="halfSizeChart" style="width: ' + chartToAdd.width + ';' +
                'height: ' + chartToAdd.height + ';"></div>';
        }

        function closeAnalysisSection() {
            htmlToAppend +=
                '        <div style="clear: both;"></div>' +
                '    </div>' +
                '</div>';
        }

        function appendHtmlToAnalysisSection() {
            $(renderTo).append($(htmlToAppend));
        }

        function addChartToChartsToRender(chartToAdd) {
            var chartsToRender = [],
                isGroup = false,
                containerClass;

            // Exit if the chart to add doesn't exist.
            if (!chartToAdd) {
                output.log('addChartToChartsToRender: Skipped empty chart');
                return;
            }

            // Extract the charts to render if the current chart is a group.
            if (chartToAdd.chartType === 'Group') {
                chartsToRender = chartToAdd.charts;
                isGroup = true;
            } else {
                chartsToRender.push(chartToAdd);
            }

            if (isGroup) {
                openAnalysisSection(chartToAdd.title);
            }

            // Define a wrapper DIV class for the chart container depending on
            // the chart type. If the chart is a table, it sets its own height,
            // so an explicit class defining height is not required.
            containerClass = (chartToAdd.chartType === 'Table') ? '' : 'chartContainer';

            // Create the chart containers according to the chart types.
            for (var i = 0; i < chartsToRender.length; i++) {
                chart = chartsData[chartsToRender[i].chartId] || null;

                // Add current chart to the list of charts to load.
                chartsToLoad.push(chart);

                if (chart) {
                    if (isGroup) {
                        addChartToGroup(chartsToRender[i]);
                    } else {
                        openAnalysisSection(chart.title);
                        addChartToAnalysisSection(chartsToRender[i], containerClass);
                        closeAnalysisSection();
                        appendHtmlToAnalysisSection();
                    }
                }
            }

            if (isGroup) {
                closeAnalysisSection();
                appendHtmlToAnalysisSection();
            }
        }

        for (var i = 0; i < charts.length; i++) {
            addChartToChartsToRender(chartsData[charts[i].chartId] || null);
        }

        load(chartsToLoad);
    }

    // TODO: Investigate...
    chartManager.on('onAnalysisLoaded', function () {
        eventManager.raiseEvent('onAllChartsLoaded');
    });

    chartManager.on('onAnalysisLoading', function (chartCount, chartTotal) {
        eventManager.raiseEvent('onChartsLoading', chartCount, chartTotal);
    });

    chartComponents.load = load;
    chartComponents.render = render;

    return chartComponents;
});
// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartDefaults', isShared: true }, function () {
    var chartDefaults = {},
        commonSettings = {},
        barChart = {},
        bubbleChart = {},
        columnChart = {},
        gaugeChart = {},
        gridChart = {},
        lineChart = {},
        pieChart = {},
        treeMapChart = {},
        output = this.getConsole();

    // COMMON CHART SETTINGS
    commonSettings = {
        forceIFrame: false,
        labelFontName: 'HelveticaNeue-Light',
        labelFontSize: 12,
        titleFontName: 'HelveticaNeue-Bold',
        titleFontSize: 25
    };

    // BUBBLE CHART
    bubbleChart = {
        chartArea: { left: 80, top: 35, width: '70%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        hAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        },
        sizeAxis: {
            maxSize: 100,
            maxValue: 100,
            minSize: 1,
            minValue: 1
        },
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // BAR CHART
    barChart = {
        chartArea: { left: '20%', width: '60%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // COLUMN CHART
    columnChart = {
        chartArea: { left: '10%', width: '70%', height: '75%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        vAxis: {
            titleTextStyle: {
                fontName: commonSettings.titleFontName,
                fontSize: commonSettings.titleFontSize
            }
        }
    };

    // GAUGE CHART
    gaugeChart = {
        forceIFrame: commonSettings.forceIFrame,
        height: 250,
        greenFrom: 0,
        greenTo: 4,
        yellowFrom: 4,
        yellowTo: 6,
        redFrom: 6,
        redTo: 20,
        max: 20,
        minorTicks: 5
    };

    // GRID CHART
    gridChart = {
        allowHtml: true,
        alternatingRowStyle: true,
        forceIFrame: commonSettings.forceIFrame,
        cssClassNames: {
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow',
            selectedTableRow: 'selectedTableRow',
            hoverTableRow: 'hoverTableRow'
        }
    };

    // LINE CHART
    lineChart = {
        chartArea: { left: 80, top: 35, width: '75%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame
    };

    // PIE CHART
    pieChart = {
        chartArea: { left: 80, width: '75%', height: '80%' },
        fontName: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        is3D: true
    };

    // TREE MAP (HEATMAP) CHART
    treeMapChart = {
        fontFamily: commonSettings.labelFontName,
        fontSize: commonSettings.labelFontSize,
        forceIFrame: commonSettings.forceIFrame,
        headerHeight: 25,
        minColor: '#cc0000',
        midColor: '#ffffff',
        maxColor: '#6699cc',
        maxDepth: 3
    };

    function changeSetting(key, value) {
        commonSettings[key] = value;
        output.log('change setting');
    }

    // Assign the specific chart defaults to the container object.
    chartDefaults.BarChart = barChart;
    chartDefaults.BubbleChart = bubbleChart;
    chartDefaults.ColumnChart = columnChart;
    chartDefaults.Gauge = gaugeChart;
    chartDefaults.LineChart = lineChart;
    chartDefaults.PieChart = pieChart;
    chartDefaults.Table = gridChart;
    chartDefaults.TreeMap = treeMapChart;

    chartDefaults.set = changeSetting; // Alias

    return chartDefaults;
});
// ------------------------------------------
// CHART MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartManager',
    sharedModules: ['settings', 'chartDefaults', 'colorManager', 'localizationManager', 'ajaxManager'],
    isShared: true, hasEvents: true
}, function () {
    var chartBase = {},
        charts = [],
        eventManager = this.getEventManager(),
        chartDefaults = this.getSharedModule('chartDefaults'),
        siteUrls = this.getSharedModule('settings').siteUrls,
        colorManager = this.getSharedModule('colorManager'),
        lang = this.getSharedModule('localizationManager').getLanguage() || {},
        ajaxManager = this.getSharedModule('ajaxManager'),
        output = this.getConsole(),
        chartCount = 0,
        chartTotal = 0,
        isLoading = false;

    function resetCounter() {
        chartCount = 0;
        chartTotal = 0;
        isLoading = false;
    }

    function startCounter() {
        resetCounter();
        isLoading = true;
    }

    function stopCounter() {
        resetCounter();
    }

    // Function to be called when the chart has finished attempting to load.
    // NOTE: 'Finished' does not necessarily infer success - a chart may have 
    // unsuccessfully attempted to load and in doing so will pass an error
    // object as an argument to this function.
    function onChartReady(errorObj) {
        var container;

        // Regardless of any error state, we still want the attempted load count to be
        // updated and the 'onAnalysisLoading' and 'onAnalysisLoaded' events raised.
        if (isLoading) {
            chartCount += 1;
            eventManager.raiseEvent('onAnalysisLoading', chartCount, chartTotal);

            // If all of the charts created have been loaded...
            if (chartCount === chartTotal) {
                // ...fire the onAnalysisLoaded event.
                stopCounter();
                eventManager.raiseEvent('onAnalysisLoaded');
            }
        }

        // If we've got an error...
        if (errorObj && errorObj.id) {
            // ...retrieve the container of the chart causing the problem.
            container = google.visualization.errors.getContainer(errorObj.id);
            // Display a generic error message rather than a potentially confusing Google one.
            $('#' + container.id).html(lang.errors.chartFailedText);
        }
    }

    // Function to create a new chart.
    // 'config' - An object containing configuration properties for the chart to be created.
    function create(config) {

        if (!config) {
            output.log('Config is not specified.');
            return;
        }

        var id = config.chartId || null,
            type = config.chartType || null,
            options = config.options || {},
            defaults = {},
            chart = null;

        // Return nothing if a chart ID or chart type has not been specified.
        if (!id || !type) {
            output.log('Chart ID or type is not specified.');
            return;
        }

        // Retrieve the defaults for the given chart type, if available.
        defaults = (chartDefaults && chartDefaults[type])
            ? chartDefaults[type]
            : {};

        // Apply defaults then any overrides to a new object.
        options = $.extend({}, defaults, options);

        // Create a new visualization wrapper instance, using the type, options and ID.
        chart = new google.visualization.ChartWrapper({
            chartType: type,
            options: options,
            containerId: id
        });

        // Although it's not part of the Google API, store 
        // the parameters for this chart in the object.
        chart.endDate = config.endDate;
        chart.include = config.include;
        chart.includeMeasuresFor = config.includeMeasuresFor;
        chart.isGradientReversed = config.isGradientReversed;
        chart.isHeatMap = config.isHeatMap;
        chart.measures = config.measures;
        chart.oData = config.oData;
        chart.seriesType = config.seriesType;
        chart.startDate = config.startDate;
        chart.timePeriods = config.timePeriods;

        // Register the chart with the ready and error event listeners.
        google.visualization.events.addListener(chart, 'ready', onChartReady);
        google.visualization.events.addListener(chart, 'error', onChartReady);

        // Return the chart.
        return chart;
    }

    // Function to load the given chart with data.
    // 'chart'  - The instance of the Google Visualization API chart object to load.
    function load(chart, newRequest) {
        var type, params, url, formatter;

        // Don't attempt to load the chart if it doesn't exist yet.
        if (!chart) {
            return;
        }

        // Restart the counter every new request.
        if (newRequest) {
            startCounter();
        }

        // Increase the running chart total.
        chartTotal++;

        // Get the current chart type.
        type = chart.getChartType();

        // Create a new number formatter.
        formatter = new google.visualization.NumberFormat({
            decimalSymbol: lang.shared.decimalSymbol,
            fractionDigits: 3,
            groupingSymbol: lang.shared.groupingSymbol,
            negativeColor: '#cc0000',
            negativeParens: false
        });

        // Define our basic parameters.
        params = {
            type: type
        };

        // Only include parameters in the object if they exist.
        if (chart.endDate) { params.endDate = chart.endDate; }
        if (chart.include) { params.include = chart.include; }
        if (chart.includeMeasuresFor) { params.includeMeasuresFor = chart.includeMeasuresFor; }
        if (chart.measures) { params.measures = chart.measures; }
        if (chart.oData) { params.oData = chart.oData; }
        if (chart.startDate) { params.startDate = chart.startDate; }
        if (chart.seriesType) { params.seriesType = chart.seriesType; }
        if (chart.timePeriods) { params.timePeriods = chart.timePeriods; }

        // Define the correct URL to use to retrieve data based on the chart type.
        url = (type === 'LineChart') ? siteUrls.timeSeries : siteUrls.segmentsTreeNode;

        // Callback function to be invoked when data is returned from the server.
        function onDataLoaded(data) {
            var dataTable, i, min, max, values = [], sliceOptions = [];

            output.log(data);

            // Create a new visualization DataTable instance based on the data.
            dataTable = new google.visualization.DataTable(data);

            // Loop round the columns, applying the formatter to 'number' columns.
            for (i = 0; i < dataTable.getNumberOfColumns(); i++) {
                if (dataTable.getColumnType(i) === 'number') {
                    formatter.format(dataTable, i);
                }
            }

            // If our chart is a pie chart and we're displaying it as a heatmap...
            if (type === 'PieChart' && chart.isHeatMap) {

                // ...collate the heatmap measure from the datatable.
                for (i = 0; i < dataTable.getNumberOfRows(); i++) {
                    values.push(dataTable.getValue(i, 2));
                }

                // Get the highest and lowest values from the heatmap measure values.
                min = Math.min.apply(Math, values);
                max = Math.max.apply(Math, values);

                // Generate absolute minmax values.
                if (Math.abs(min) > Math.abs(max)) {
                    max = Math.abs(min);
                    min = -(Math.abs(min));
                } else {
                    max = Math.abs(max);
                    min = -(Math.abs(max));
                }

                // Loop round the values, and use the colorManager to generate 
                // a colour in the gradient range for that measure value.
                for (i = 0; i < values.length; i++) {
                    sliceOptions.push({
                        color: colorManager.getColorInRange(values[i], min, max, chart.isGradientReversed)
                    });
                }

                chart.setOption('slices', sliceOptions);
            }

            // Set the data table for the chart.
            chart.setDataTable(dataTable);

            // Draw the chart.
            chart.draw();

            // Set up the chart to be redrawn on change of orientation.
            $(document).on('orientationchange', function (event) {
                chart.draw();
            });
        }

        // Attempt to load the data.
        // NOTE: The dataType is set to 'text' rather than 'json' to stop Zepto
        // attempting to parse dates which the Google Visualization API expects 
        // to parse itself, causing an error.
        ajaxManager.post(url, params, onDataLoaded, 'text');
    }

    chartBase.create = create;
    chartBase.load = load;

    return chartBase;
});
// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'colorManager', isShared: true }, function () {
    var colorManager = {},
        output = this.getConsole();

    // Removes the hex in front of a hex value if there is one.
    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }

    // Returns a hex value for the given number.
    function toHex(n) {
        var hexValues = '0123456789ABCDEF';

        // Test that we've got a number.
        n = parseInt(n, 10);

        // If not, return a default value.
        if (isNaN(n)) {
            return "00";
        }

        // Ensure our value is within range (0 - 255).
        n = Math.max(0, Math.min(n, 255));

        // Return the appropriate characters from the hex values string.
        return hexValues.charAt((n - n % 16) / 16) + hexValues.charAt(n % 16);
    }

    // Returns a hex value for the given RGB value.
    function rgbToHex(r, g, b) {
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    // Gets the red RGB value for the passed hex value.
    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    // Gets the green RGB value for the passed hex value.
    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    // Gets the blue RGB value for the passed hex value.
    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    // Transforms the integer provided into a byte value.
    function getByteValue(value) {
        return parseInt(value, 10) & 255;
    }

    // Helper method to interpolate between two min and max values given a specific value.
    function interpolate(min, max, value) {
        return getByteValue(getByteValue(min) * (1 - value) + getByteValue(max) * value);
    }

    function getColorInRange(value, min, max, reverseGradient) {
        var colors = [],
            red = '#cc0000',
            yellow = '#ffff00',
            green = '#339900',
            key, color, previousKey, previousColor, storedColor,
            i, p;

        // Range check. If the value is out of range, return the most extreme colour. This shouldn't occur, but for
        // hard-coded absolute ranges where the actual values may not always fit, it's better to return a colour.
        if (value < min) {
            return red;
        }

        if (value > max) {
            return green;
        }

        if (reverseGradient) {
            // If the value is positive, the colour will be between red and yellow.
            if (value > 0) {
                colors.push([0, yellow]);
                colors.push([max, red]);                
            } else {
                colors.push([min, green]);
                colors.push([0, yellow]);                
            }
        } else {
            // If the value is positive, the colour will be between yellow and green.
            if (value > 0) {
                colors.push([max, green]);
                colors.push([0, yellow]);
            } else {
                colors.push([0, yellow]);
                colors.push([min, red]);
            }
        }

        // Store our middle colour.
        storedColor = [0, yellow];

        for (i = 0; i < colors.length; i++) {
            
            key = colors[i][0];
            
            if (key >= value) {

                color = colors[i][1];
                previousKey = storedColor[0];
                previousColor = storedColor[1];
                p = ((value - previousKey) / (key - previousKey));

                // Generate a new hex colour by interpolating between the 
                // R, G and B values of the current and previous colours.
                return rgbToHex(
                    interpolate(hexToR(previousColor), hexToR(color), p), 
                    interpolate(hexToG(previousColor), hexToG(color), p), 
                    interpolate(hexToB(previousColor), hexToB(color), p)
                );
            }

            storedColor = colors[i];
        }

        // If the dictionary was empty, the value was 
        // exactly zero, so return the middle value.
        return yellow;
    }

    colorManager.getColorInRange = getColorInRange;

    return colorManager;
});
// ------------------------------------------
// LOADING MASK MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'loadingMaskManager', sharedModules: ['pageElements'], plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var loadingMaskManager  = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        el                  = this.getSharedModule('pageElements'),
        helper              = this.getPlugin('helper'),
        loadingText         = null,
        masks               = {};


    // Define the loading mask text.
    loadingText = $(el.loadingText);

    // Define all the available masks.
    masks.ajax = {
        name    : 'ajax',
        enabled : true,
        el      : el.loadingMask
    };

    masks.analysis = {
        name    : 'analysis',
        enabled : true,
        el      : el.chartLoadingMask
    };
    
    masks['default'] = masks.ajax;

    $(el.loadingMask).click(function(){
        hide('ajax');
    });

    $(el.chartLoadingMask).click(function(){
        hide('analysis');
    });

    /* ----------------------- ON/OFF ----------------------- /

    function showAnalysisMask(fade) {

    }

    function hideAnalysisMask(fade) {
    
    }

    function showAjaxMask() {

    }

    function hideAjaxMask() {

    }

    // ------------------------------------------------------ */
    
    function show(type /* TODO: fade */) {
        var mask = masks[type || 'default'] || null;

        if (mask && mask.enabled) {
            $(mask.el).hide();
            $(mask.el).show();
        }
    }

    function hide(type /* TODO: fade */) {
        var mask = masks[type || 'default'] || null;

        if (mask) {
            $(mask.el).css("display", "none");
        }
    }
    
    function updateAnalysisText(text) {
        loadingText.html(text);
    }

    // TODO: Add code to prevent showing of any masks and or to enable/disable them.
    loadingMaskManager.show = show;
    loadingMaskManager.hide = hide;
    loadingMaskManager.updateAnalysisText = updateAnalysisText;

    return loadingMaskManager;
});
// ------------------------------------------
// LOCALIZATION MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'localizationManager', isShared: true }, function (config) {
    var manager     = {},
        output      = this.getConsole(),
        language    = require('language');

    manager.sayHello = function () {
        output.log(language.hello);
    };

    // Public
    function get(text) {
        var localizedString = language[text] || '';

        return localizedString;
    }

    // Public
    function getLanguage() {
        return language;
    }

    manager.get = get;
    manager.getLanguage = getLanguage;

    return manager;
});
// ------------------------------------------
// LOCAL STORAGE MANAGER
// ---------------------    ---------------------

WebAppLoader.addModule({ name: 'localStorageManager', sharedModules: [], plugins: ['helper'], hasEvents: true, isShared: true }, function () {
    var localStorageManager  = {},
        output              = this.getConsole(),
        eventManager        = this.getEventManager(),
        helper              = this.getPlugin('helper'),
        revolutionNamespace = 'Revolution';

    // Private
    function getNamespacedName(itemName, namespace) {
        var namespacedName = null;

        if (itemName && (typeof itemName === 'string')) {
            namespacedName = (namespace || revolutionNamespace) + helper.capitaliseFirstLetter(itemName);
        }

        return namespacedName;
    }

    // Private
    function setItem(key, value) {
        localStorage.setItem(key, value);
        output.log('Local Storage Manager - setItem:', key, value);
    }

    // Private
    function getItem(key) {
        return localStorage.getItem(key);
    }

    // Public
    function load(itemName, namespace) {
        var name        = getNamespacedName(itemName, namespace),
            storedItem  = getItem(name),
            value       = null;
        
        // Check if the value exists and try to retrieve it.
        if (storedItem) {
            // Check if the value is a stringified JSON object.
            if (helper.startsWith(storedItem, '{"')) {
                try {
                    value = JSON.parse(storedItem);
                } catch (e) {
                    output.log('Local Storage Manager - failed to parse stored item:', key, value);
                }
            } else {
                value = storedItem;
            }
        }
        
        return value;    
    }

    // Public
    function save(itemName, itemValue, namespace) {
        var name = getNamespacedName(itemName, namespace),
            value = ''; //stringifiedValue = '';

        if (name && helper.hasValue(itemValue)) {
            value = (typeof itemValue === 'object')
                ? JSON.stringify(itemValue)
                : itemValue;
            
            setItem(name, value);
                        
        } else {
            output.log('Local Storage Manager - cannot save item.', itemName, itemValue);
        }
    }

    // Public
    function remove(itemName, namespace) {
        var name = getNamespacedName(itemName, namespace);

        if (name) {
            localStorage.removeItem(name);
            output.log('Local Storage Manager - removed item.', name);
        }
    }

    // Public
    function count() {
        output.log('count()', localStorage.length);
    }

    // Public
    function clearAll() {
        localStorage.clear();  
        output.log('clearAll()');
    }

    function clearUserSettings(username) {
        for (var key in localStorage) {
            if(helper.startsWith(key, username)) {
                localStorage.removeItem(key);
            }
        }
    }

    localStorageManager.load = load;
    localStorageManager.save = save;
    localStorageManager.remove = remove;
    localStorageManager.count = count;
    localStorageManager.clearAll = clearAll;
    localStorageManager.clearUserSettings = clearUserSettings;

    return localStorageManager;
});
// ------------------------------------------
// PAGE ELEMENTS
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageElements', isShared: true }, function () {
    var pageElements = {};

    pageElements = {
        // App pages.
        blankPage                           : '#blank_page',
        dashboardPage                       : '#dashboard',
        homePage                            : '#home',
        portfoliosPage                      : '#portfolios',
        portfolioAnalysisPage               : '#portfolioAnalysis',
        analysisPage                        : '#analysis',
        eulaPage                            : '#eula',
        settingsPage                        : '#settings',
        loginPage                           : '#login',
        startupPage                         : '#startup',
        chartSettingsPage                   : '#chartSettings',
        themesPage                          : '#themes',
        languageSettingsPages               : '#languageSettings',
        errorPage                           : '#error',

        // Elements.
        portfolioAnalysisLink               : '.defaultAnalysisLink',
        toolbar                             : '.toolbar',
        loginButton                         : '#loginButton',
        loginErrorText                      : '#loginErrorText',
        loadingMask                         : '#myloading',
        chartLoadingMask                    : '#myLoadingCharts',
        userNameTextbox                     : '#userNameTextbox',
        passwordTextbox                     : '#passwordTextbox',
        tabbar                              : 'nav#tabbar',
        listAnalysisSettingsDefaultPages    : '#listAnalysisSettingsDefaultPages',
        listAnalysisSettingsUserPages       : '#listAnalysisSettingsUserPages',
        chartsSelectbox                     : '#chartsSelectbox',
        analysisPageNameTextbox             : '#analysisPageNameTextbox',
        saveChartSettings                   : '#saveChartSettings',
        addNewAnalysisPage                  : '#addNewAnalysisPage',
        analysisTitle                       : '#analysisTitle',
        loadingText                         : '#loadingText',
        listLanguagesPages                  : '#listLanguagesPages',
        timePeriodStartDateText             : '#timePeriodStartDateText',
        timePeriodEndDateText               : '#timePeriodEndDateText',
        errorMessageText                    : '#errorMessageText',
        stayLoggedCheckbox                  : '#stayLoggedCheckbox',
        userEmailLabel                      : '#userEmailLabel',
        summaryTitleName                    : '#summaryTitleName',
        summaryTitleBenchmarkName           : '#summaryTitleBenchmarkName',
        resetCurrentSettingsButton          : '#resetCurrentSettingsButton',
        resetAllSettingsButton              : '#resetAllSettingsButton',
        reloadAppButton                     : '#reloadAppButton'
    };

    return pageElements;
});
// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'settings', dataObjects: ['appSettings', 'userSettings'], isShared: true }, function () {
    var settings            = {},
        appSettings         = {},
        siteUrls            = {},
        languages           = [],
        output              = this.getConsole(),
        userSettingsDataObj = this.getDataObject('userSettings'),
        appSettingsDataObj  = this.getDataObject('appSettings');

    userSettingsDataObj.define({
        automaticLogin      : false,
        username            : 'asa.fama@statpro.com',
        password            : 'StatPro123',
        language            : 'en-US',
        lastUsedLanguage    : 'none'
    });

    appSettingsDataObj.define({
        lastLoggedOnUser    : 'asa.fama@statpro.com'
    });
    
    // APP SETTINGS.
    appSettings = {
        loadPortfoliosSlotDataOnce: true
    };

    // URLs.
    siteUrls = {
        portfolios          : '/portfolios',
        authenticate        : '/authenticate',
        index               : '/index',
        portfolioAnalysis   : '/portfolioAnalysis',
        analysis            : '/analysis',
        segmentsTreeNode    : '/segmentsTreeNode',
        timeSeries          : '/timeSeries',
        eula                : '/eula'
    };

    // LANGUAGES
    languages = [{
        id      : 'en-US',
        value   : 'en-US',
        name    : 'English'
    }, {
        id      : 'it-IT',
        value   : 'it-IT',
        name    : 'Italiano'
    }];

    function changeSetting(key, value) {
        appSettings[key] = value;
        output.log('change setting');
    }

    function get(key) {
        return appSettings[key];
    }

    function getVersion() {
        return '1.0';
    }

    settings.changeSetting = changeSetting;
    settings.set = changeSetting; // Alias
    settings.get = get;
    settings.getVersion = getVersion;
    settings.appSettings = appSettings;
    settings.siteUrls = siteUrls;
    settings.languages = languages;

    return settings;
});
// ------------------------------------------
// ANALYSIS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisManager', plugins: ['helper'], 
    sharedModules: [], dataObjects: ['analysisPages'], hasEvents: true }, function () {

    var analysisManager         = {},
        output                  = this.getConsole(),
        eventManager            = this.getEventManager(),
        helper                  = this.getPlugin('helper'),
        analysisPagesDataObj    = this.getDataObject('analysisPages'),
        charts                  = [],
        analysisPages           = {};

    // TODO: Add a method called changeChartPosition or changeChartOrder...

    analysisPagesDataObj.define({
        items: [{
            name        : 'Performance',
            id          : 'performance',
            order       : 1,
            userDefined : false,
            charts      : [{
                    chartId : 'performance_line',
                    order   : 1
                }, {
                    chartId : 'performance_grid',
                    order   : 2
                },{
                    chartId : 'performance_bubble',
                    order   : 3
                },{
                    chartId: 'performance_bar',
                    order   : 4
                },{
                    chartId: 'performance_treemap',
                    order   : 5
                },{
                    chartId: 'performanceTopTen_grid',
                    order   : 6
                }] 
        },{
            name        : 'Risk',
            id          : 'risk',
            order       : 2,
            userDefined : false,
            charts      : [{
                    chartId: 'risk_treemap',
                    order   : 1
                },{
                    chartId: 'risk_bar',
                    order   : 2
                },{
                    chartId: 'risk_bubble',
                    order   : 3
                },{
                    chartId: 'risk_pie',
                    order   : 4
                },{
                    chartId: 'riskTopTen_grid',
                    order   : 5
                }]             
        },{
            name        : 'Asset Allocation',
            id          : 'assetAllocation',
            order       : 3,
            userDefined : false,
            charts      : [{
                    chartId: 'allocation_pie',
                    order   : 1
                },{
                    chartId: 'allocation_bar',
                    order   : 2
                }]             
        },{
            name        : 'Contribution',
            id          : 'contribution',
            order       : 4,
            userDefined : false,
            charts      : [{
                    chartId: 'contribution_pie',
                    order   : 1
                },{
                    chartId: 'contribution_column',
                    order   : 2
                },{
                    chartId: 'contribution_bar',
                    order   : 3
                },{
                    chartId: 'contributionTopTen_grid',
                    order   : 4
                }]            
        },{
            name        : 'Attribution',
            id          : 'attribution',
            order       : 5,
            userDefined : false,
            charts      : [{
                    chartId: 'attribution_column',
                    order   : 1
                },{
                    chartId: 'attribution_bar',
                    order   : 2
                },{
                    chartId: 'attribution_grid',
                    order   : 3
                }]              
        },{
            name        : 'Fixed Income',
            id          : 'fixedIncome',
            order       : 6,
            userDefined : false,
            charts      : [{
                    title: 'Bar Charts of Fixed Income Contributions:',
                    chartId: '',
                    order   : 1
                },{
                    chartId: 'fixedIncomeContribution_bar',
                    order   : 2
                },{
                    chartId: 'carryContribution_bar',
                    order   : 3
                },{
                    chartId: 'yieldCurveContribution_bar',
                    order   : 4
                },{
                    chartId: 'riskNumbers_bar',
                    order   : 5
                },{
                    title: 'Column Charts of Fixed Income Exposures:',
                    chartId: '',
                    order   : 6
                },{
                    chartId: 'interestRatesExposure_column',
                    order   : 7
                },{
                    chartId: 'creditSpreadsExposure_column',
                    order   : 8
                },{
                    chartId: 'dv01Exposure_column',
                    order   : 9
                },{
                    title: 'Grid of Risk Numbers:',
                    chartId: '',
                    order   : 10
                },{
                    chartId: 'fixedIncome_grid',
                    order   : 11
                },{
                    chartId: 'fixedIncomeContribution_grid',
                    order   : 12
                },{
                    title: 'Grid of FI Exposure',
                    chartId: '',
                    order   : 13
                },{
                    chartId: 'fixedIncomeExposure_grid',
                    order   : 14
                }]   
        } ,{
            name        : 'User Defined Test Page',
            id          : 'test1',
            order       : 100,
            userDefined : true,
            charts      : [{
                    chartId: 'fi_contribution_group', //'performance_bar',
                    order   : 1
                }/*,{
                    chartId: 'risk_bar',
                    order   : 2
                }*/]             
        }]
    });

    // Public
    function restoreDefaults() {
        analysisPages = analysisPagesDataObj.getData();
    }

    function analysisUpdated() {
        // eventManager.raiseEvent('onUpdated', analysisPages);
        eventManager.raiseEvent('onUpdated', analysisPagesDataObj.getData());
    }

    function init(lastUsernameUsed) {
        var userAnalysisPages;
        
        if (lastUsernameUsed) {
            analysisPagesDataObj.loadData(lastUsernameUsed);
        } 

        analysisUpdated();
    }
        
    analysisManager.init = init;
    analysisManager.update = init; // Alias

    return analysisManager;
});
// ------------------------------------------
// AUTHENTICATION
// ------------------------------------------

WebAppLoader.addModule({ name: 'auth', plugins: ['base64'], sharedModules: ['ajaxManager'], hasEvents: true }, function () {
    var auth            = {},
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        base64          = this.getPlugin('base64'),
        ajaxManager     = this.getSharedModule('ajaxManager'),
        hash            = '';

    function doLogin(username, password, url) {
        var token, tokenHash;
        
        hash = '';
        tokenHash = base64.encode(username + ':' + password);
        token = 'Basic ' + tokenHash;

        // Post the created token and the user's email to the authenticate action.
        ajaxManager.post(url, { email: username, token: token }, function (response) {
            // If our response indicates that the user has been authenticated...
            if (response.authenticated) {
                hash = tokenHash;
                eventManager.raiseEvent('onLoginSuccess', token); //response.portfolioTotal
            } else {
                eventManager.raiseEvent('onLoginFailed', response.message);
            }
        }, 'json');
    }

    function getHash() {
        return hash;
    }

    auth.doLogin = doLogin;
    auth.getHash = getHash;

    return auth;
});

// ------------------------------------------
// FAVOURITES MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'favouritesManager', plugins: ['helper'], 
    sharedModules: [], dataObjects: ['favourites'], hasEvents: true }, function () {

    var favouritesManager    = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        favouritesDataObj    = this.getDataObject('favourites'),
        favourites           = {};
/*
    theApp.lastAnalysisObjectUsed = {
        portfolioId: '',
        portfolioName: '',
        analysisId: 'performances',
        analysisName: 'Performances',
        timePeriodId: 'Earliest',
        timePeriodName: 'Earliest',
        chartId : 'performance_bar',
        timeStamp: ''
    };
*/
    favouritesDataObj.define({
        items: [/*{
            title: 'First Portfolio - Performances - Earliest',
            favouriteId: '@~~<first>~~@performancesEarliest', // Unusual id.
            portfolioId: '@~~<first>~~@',
            analysisId: 'performances',
            timePeriodId: 'Earliest'
        }*/]
    });

    function createIdFromAnalysisDataObject(analysisDataObject) {
        var favouriteId = null,
            dataObj     = analysisDataObject;

        if (dataObj.portfolioId &&  dataObj.analysisId && dataObj.timePeriodId) {
            favouriteId = dataObj.portfolioId +  dataObj.analysisId + dataObj.timePeriodId;
        }

        return favouriteId;
    }
    
    function getFavourteFromAnalysisDataObject(analysisDataObject) {
        var favouriteObj = {};

        favouriteObj.title        = analysisDataObject.portfolioName + ' - ' +
                                    analysisDataObject.analysisName + ' - ' +
                                    analysisDataObject.timePeriodName;
        favouriteObj.favouriteId  = analysisDataObject.portfolioId +
                                    analysisDataObject.analysisId +
                                    analysisDataObject.timePeriodId;
        favouriteObj.portfolioId  = analysisDataObject.portfolioId;
        favouriteObj.analysisId   = analysisDataObject.analysisId;
        favouriteObj.timePeriodId = analysisDataObject.timePeriodId;

        return favouriteObj;
    }

    function getAnalysisDataObjectFromFavourte(favouriteId) {
        var favourites         = favouritesDataObj.getData(),
            analysisDataObject = null,
            favourite          = {};

        for (var i = 0; i < favourites.items.length; i++) {
            favourite = favourites.items[i];
            if (favourite.favouriteId === favouriteId) {
                // Create a new analysisDataObject and populate it with
                // values from favourite.
                analysisDataObject = {}; 
                analysisDataObject.portfolioId = favourite.portfolioId;
                analysisDataObject.analysisId = favourite.analysisId;
                analysisDataObject.timePeriodId= favourite.timePeriodId;
                return analysisDataObject;   
            }
        }

        return analysisDataObject;
    }

    function favouriteExists(favouriteId) {
        var favourites = favouritesDataObj.getData();
    }

    function favouritesUpdated() {
        eventManager.raiseEvent('onFavouritesUpdated', favouritesDataObj.getData());
    }

    function init(lastUsernameUsed) {
        var favourites;
        
        if (lastUsernameUsed) {
            favouritesDataObj.loadData(lastUsernameUsed);
        } 

        favouritesUpdated();
    }
        
    favouritesManager.init = init;
    favouritesManager.update = init; // Alias
    favouritesManager.createIdFromAnalysisDataObject = createIdFromAnalysisDataObject;
    favouritesManager.getFavourteFromAnalysisDataObject = getFavourteFromAnalysisDataObject;
    favouritesManager.favouriteExists = favouriteExists;
    favouritesManager.getAnalysisDataObjectFromFavourte = getAnalysisDataObjectFromFavourte;

    return favouritesManager;
});
// ------------------------------------------
// NAV
// ------------------------------------------

WebAppLoader.addModule({ name: 'nav', hasEvents: true }, function () {
    var nav              = {},
        eventManager    = this.getEventManager();

    // Navigate to an external page.
    function navigateTo(url) {
        window.location = url;
    }

    // Future uses.
    function goToPage(idPage, animation) {
        jQT.goTo($(idPage), animation || 'fade');
    }

    function reloadApp(params) {
        var paramsToAdd = params || '';

        window.location = './' + paramsToAdd;
        return false;
    }

    nav.goToPage = goToPage;
    nav.reloadApp = reloadApp;

    return nav;
});

// ------------------------------------------
// EVENT PAGE MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageEventsManager', plugins: ['helper'], sharedModules: ['pageElements', 'loadingMaskManager'], hasEvents: true }, function () {
    var pageEventsManager   = {},
        eventManager        = this.getEventManager(),
        output              = this.getConsole(),
        helper              = this.getPlugin('helper'),
        el                  = this.getSharedModule('pageElements'),
        mask                = this.getSharedModule('loadingMaskManager');

    $('div[data-pageEvents]').each(function () {
        var eventHandler = '';

        switch ($(this).attr("data-pageEvents")) {
            case 'start':
                $(this).on('pageAnimationStart', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'Start');
                    }
                });
                break;

            case 'end':
                $(this).on('pageAnimationEnd', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'End');
                    }
                });
                break;

            case 'both':
                $(this).on('pageAnimationStart', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'Start');
                    }
                });

                $(this).on('pageAnimationEnd', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'End');
                    }
                });
                break;

            case 'none':
                break;

            default:
        }
    });

    // ------------------------------------------
    // GLOBAL AJAX EVENTS
    // ------------------------------------------

    // Global Ajax Call
    $(document).on('ajaxStart', onAjaxStart);
    $(document).on('ajaxComplete', onAjaxComplete);

    function onAjaxStart(event, request, settings) {
        mask.show('ajax');
        output.log('ajaxStart', event, request, settings);
    }

    function onAjaxComplete(event, request, settings) {
        mask.hide('ajax');
        // Return false to cancel this request.
        var obj = {};
        try {
            obj = JSON.parse(request.response);
        } catch (e) {

        }

        output.log('ajaxComplete', event, request, settings, obj);
    }

    return pageEventsManager;
});
// ------------------------------------------
// PORTFOLIO MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'portfolioManager', plugins: [], sharedModules: ['settings', 'ajaxManager', 'localizationManager'],
    dataObjects: ['portfolio'], hasEvents: true
}, function () {
    var portfolioManager = {},
        output = this.getConsole(),
        eventManager = this.getEventManager(),
        settings = this.getSharedModule('settings'),
        portfolioDataObj = this.getDataObject('portfolio'),
        lang = this.getSharedModule('localizationManager').getLanguage() || {},
        ajaxManager = this.getSharedModule('ajaxManager'),
        lastPortfolioIdUsed = '',
        lastPortfolioUsed = {};

    portfolioDataObj.define({
        code: '',
        name: '',
        type: '',
        analysisLink: '',
        currency: '',
        version: '',
        timeStamp: '',
        timePeriods: []
    });

    function loadPortfolioAnalysis(portfolioCode, callback) {

        function onGetAnalysisCompleted() {
            callback(lastPortfolioUsed);
        }

        function onLoadPortfolioCompleted(defaultAnalysisLink) {
            getAnalysis(defaultAnalysisLink, onGetAnalysisCompleted);
        }

        loadPortfolio(portfolioCode, onLoadPortfolioCompleted);
    }

    function loadPortfolio(portfolioCode, callback) {
        var defaultPortfolioCode,
            portfolio = {
                code: '',
                type: '',
                analysisLink: '',
                currency: '',
                version: '',
                timeStamp: '',
                timePeriods: []
            };

        // Load default portfolio.

        function getPortfolioCode() {
            // TODO: Add code here to select the right portfolio code from:
            // - First portfolio
            // - Default portfolio
            // - Last saved portfolio
            // - Etc. etc.
            if (portfolioCode) {
                return portfolioCode;
            } else {
                // Return the first available portfolio.
                return '';
            }
        }

        lastPortfolioIdUsed = portfolio.code = getPortfolioCode();
        loadPortfolioData(onLoadPortfolioDataCompleted);

        function loadPortfolioData(callback) {
            var oData = {},
                defaultAnalysisLink = null;

            // Filter on the portfolio code if provided, otherwise just
            // retrieve the first portfolio in the default list.
            if (portfolio.code) {
                oData.filter = "Code eq '" + portfolio.code + "'";
            } else {
                oData.start = 0;
                oData.top = 1;
            }

            ajaxManager.post(settings.siteUrls.portfolios, { oData: oData, datatype: 'json' }, function (data) {
                
                // If no portfolio data was returned for our query...
                if (!data || !data.items || data.items.length < 1) {
                    // ...raise a failure event and return.
                    eventManager.raiseEvent('onFailed', lang.errors.portfolioNotFoundText);
                    return;
                }

                // Persist the portfolio code and the link to its default analysis.
                portfolio.code = data.items[0].code;
                defaultAnalysisLink = data.items[0].links.defaultAnalysis.href;
                
                // Call the callback.
                callback({ defaultAnalysisLink: defaultAnalysisLink });

            }, 'json');
        }

        function onLoadPortfolioDataCompleted(data) {
            if (data.defaultAnalysisLink) {
                portfolio.analysisLink = data.defaultAnalysisLink;
                loadPortfolioAnalysis(data.defaultAnalysisLink, onLoadPortfolioAnalysisCompleted);
            }
        }

        function loadPortfolioAnalysis(defaultAnalysisLink, callback) {
            ajaxManager.post(settings.siteUrls.portfolioAnalysis, { uri: defaultAnalysisLink, datatype: 'json' }, function (data) {

                // If no analysis data was returned for the given portfolio...
                if (!data || !data.analysis) {
                    // ...raise a failure event and return.
                    eventManager.raiseEvent('onFailed', lang.errors.analysisFailedText);
                    return;
                }

                // Persist the basic portfolio information.
                portfolio.name = data.name || '';
                portfolio.type = data.type || '';
                portfolio.currency = data.analysis.currency || '';
                portfolio.version = data.analysis.version || '';

                // If we have results, persist their basic details also.
                if (data.analysis.results) {
                    portfolio.timeStamp = data.analysis.results.timeStamp || '';
                    portfolio.timePeriods = data.analysis.results.timePeriods || [];
                }

                // Call the callback.
                callback();

            }, 'json');
        }

        function onLoadPortfolioAnalysisCompleted() {
            
            // Persist the currently selected portfolio.
            portfolioDataObj.setData(portfolio);
            lastPortfolioUsed = portfolio;

            // Raise notification events.
            eventManager.raiseEvent('onPortfolioLoaded', portfolio);
            eventManager.raiseEvent('onTimePeriodsLoaded', portfolio.timePeriods);

            // Call the callback, passing the analysis link.
            callback(portfolio.analysisLink);
        }
    }

    // Public
    function getAnalysis(uri, callback) {
        ajaxManager.post(settings.siteUrls.analysis, { uri: uri, datatype: 'json' }, function (data) {

            // If no analysis HTML template data was returned for the given portfolio...
            if (!data) {
                // ...raise a failure event and return.
                eventManager.raiseEvent('onFailed', lang.errors.analysisFailedText);
                return;
            }

            // Raise notification events.
            eventManager.raiseEvent('onAnalysisLoaded', data);

            // Call the callback.
            callback();
        }, 'json');
    }

    portfolioManager.loadPortfolio = loadPortfolio;
    portfolioManager.getAnalysis = getAnalysis;
    portfolioManager.loadPortfolioAnalysis = loadPortfolioAnalysis;

    return portfolioManager;
});
// ------------------------------------------
// REPOSITORIES
// ------------------------------------------

WebAppLoader.addModule({ name: 'repositories', sharedModules: ['settings', 'localizationManager', 'ajaxManager'],
    hasEvents: true }, function () {
    var repositories    = {},
        eventManager    = this.getEventManager(),
        output          = this.getConsole(),
        settings        = this.getSharedModule('settings'),
        ajaxManager     = this.getSharedModule('ajaxManager'),
        lang            = this.getSharedModule('localizationManager').getLanguage() || {};

    // Portfolio Slot Repository
    repositories.portfoliosSlot = (function () {
        var repository = {},
            portfoliosSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getPortfoliosSlotItems() {
            return portfoliosSlotItems;
        }

        function setPortfoliosSlotItems(items) {
            portfoliosSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function loadData(callback) {
            var slotItems = {};
            ajaxManager.post(settings.siteUrls.portfolios, { datatype: 'json' }, function (data) {
                if (data) {
                    $.each(data.items, function (i, val) {
                        slotItems[val.code] = val.name;
                    });
                } else {
                    slotItems.err = lang.spinningWheel.noPortfolioSlotAvailable;
                }

                setPortfoliosSlotItems(slotItems);
                callback(slotItems);
            }, 'json');
        }

        function getData(callback) {
            // TODO: Check if portfoliosListChanged is true...
            if (settings.appSettings.loadPortfoliosSlotDataOnce) {
                if (!getPortfoliosSlotItems()) {
                    loadData(function (slotItems) {
                        callback(slotItems);
                    });
                } else {
                    callback(getPortfoliosSlotItems());
                }
            } else {
                loadData(function (slotItems) {
                    callback(slotItems);
                });
            }
        }

        repository.getData = getData;
        repository.on = on;

        return repository;
    })();

    // Analysis Slot Repository.
    repositories.analysisSlot = (function () {
        var repository = {},
            analysisSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getAnalysisSlotItems() {
            return analysisSlotItems;
            return (analysisSlotItems)
                ? analysisSlotItems
                : { err: lang.spinningWheel.noAnalysisSlotAvailable };
        }

        function setAnalysisSlotItems(items) {
            analysisSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function setData(analysisPages) {
            var slotItems = {};

            $.each(analysisPages, function (i, val) {
                slotItems[val.code] = val.name;
            });

            setAnalysisSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getAnalysisSlotItems();
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    // Time Period Slot Repository.
    repositories.timePeriodsSlot = (function () {
        var repository = {},
            timePeriodsSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getTimePeriodsSlotItems() {
            return (timePeriodsSlotItems)
                ? timePeriodsSlotItems
                : { err: lang.spinningWheel.noTimePeriodSlotAvailable };
        }

        function setTimePeriodsSlotItems(items) {
            timePeriodsSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function setData(timePeriods) {
            var slotItems = null;

            if (timePeriods && timePeriods.length > 0) {
                slotItems = {};
                
                $.each(timePeriods, function (i, val) {
                    slotItems[val.code] = val.name;
                });
            }

            setTimePeriodsSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getTimePeriodsSlotItems(); //appRepository.timePeriodsSlotItems; //getTimePeriodsSlotItems()
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    // Favourites Slot Repository.
    repositories.favouritesSlot = (function () {
        var repository = {},
            favouritesSlotItems = null;

        // Add event handlers to the object.
        eventManager.init(this);

        function getFavouritesSlotItems() {
            return (favouritesSlotItems)
                ? favouritesSlotItems
                : { err: lang.spinningWheel.noFavouritesSlotAvailable };
        }

        function setFavouritesSlotItems(items) {
            favouritesSlotItems = items;
            eventManager.raiseEvent('onItemsChanged', items);
        }

        function setData(favourites) {
            var slotItems = null;

            if (favourites && favourites.length > 0) {
                slotItems = {};
                
                $.each(favourites, function (i, val) {
                    slotItems[val.code] = val.name;
                });
            }

            setFavouritesSlotItems(slotItems);
        }

        function getData(callback) {
            var items = getFavouritesSlotItems();
            callback(items);
        }

        repository.getData = getData;
        repository.setData = setData;
        repository.on = on;

        return repository;
    })();

    return repositories;
});
// ------------------------------------------
// TEST
// ------------------------------------------

WebAppLoader.addModule({ name: 'test', plugins: ['base64'], sharedModules: ['settings', 'localizationManager'] }, function (config) {
    var test        = {},
        output      = this.getConsole(),
        settings    = this.getSharedModule('settings'),
        manager     = this.getSharedModule('localizationManager'),
        dateCreated = Date.now();

    function sayHello() {
        // output.log('sayHello ' + config.name + settings.getVersion());
        // var msg = manager.sayHello();
        output.log('sayHello at ' + dateCreated);
    }

    test.sayHello = sayHello;

    return test;
});
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
// ------------------------------------------
// ANALYSIS SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisSettingsPage', plugins: ['helper'], 
    sharedModules: ['settings', 'pageElements', 'localizationManager'], hasEvents: true }, function () {
    var analysisSettingsPage = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        settings             = this.getSharedModule('settings'),
        lang                 = this.getSharedModule('localizationManager').getLanguage() || {},
        el                   = this.getSharedModule('pageElements');

    function onAnalysisPageClick() {
        var pageId = $(this).data("link");

        if (pageId) {
            eventManager.raiseEvent('onClick', pageId);
        }

        return false;
    }

    function onNewAnalysisPageClick() {
        var pageId = helper.createUUID();
        
        eventManager.raiseEvent('onClick', pageId);

        return false;
    }

    function create(analysisPages) {
        var analysisPage, isUserDefined, pageName, pageId, appendTo;

        // Clear the page.
        $(el.listAnalysisSettingsUserPages).html('');
        $(el.listAnalysisSettingsDefaultPages).html('');

        for (var i = 0; i < analysisPages.length; i++) {
            analysisPage    = analysisPages[i];
            pageName        = analysisPage.name;
            pageId          = analysisPage.id;
            isUserDefined   = analysisPage.userDefined;
            appendTo        = (isUserDefined)
                ? el.listAnalysisSettingsUserPages
                : el.listAnalysisSettingsDefaultPages; 
            
            if (isUserDefined) {
                $(appendTo).append(
                    $('<li>').attr('class', 'arrow').append(
                        $('<a>').attr({ 'href': '#', 'data-link': pageId, 'data-swipe': true })
                        .html(pageName)
                        .on('click', onAnalysisPageClick)
                    )
                );
            } else {
                $(appendTo).append( 
                    $('<li>').attr('class', '').append(
                        $('<a>').attr({ 'href': '#', 'data-link' : pageId })
                        .html(pageName)
                        // .on('click', onAnalysisPageClick)
                    )
                );  
            }
        }
        
        $(appendTo).append(
            $('<li>').attr('class', 'arrow').append(
                $('<a>').attr({ 'href': '#', 'data-link' : pageId })
                .html(lang.chartTexts.addNewPage) // TODO: Localize string 'Add New Page...'
                .on('click', onNewAnalysisPageClick)
            )
        );
    
        eventManager.raiseEvent('onPageLoaded');
    }

    // $(el.addNewAnalysisPage).on('click', onNewAnalysisPageClick);

    analysisSettingsPage.create = create;

    return analysisSettingsPage;
});
// ------------------------------------------
// CHART SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartSettingsPage',
    plugins: ['helper'], sharedModules: ['settings', 'pageElements', 'localizationManager'],
    hasEvents: true
}, function () {
    var chartSettingsPage = {},
        output            = this.getConsole(),
        eventManager      = this.getEventManager(),
        helper            = this.getPlugin('helper'),
        lang              = this.getSharedModule('localizationManager').getLanguage() || {},
        settings          = this.getSharedModule('settings'),
        el                = this.getSharedModule('pageElements'),
        analysisId        = '';

    function create(charts) {
        var chartType;

        for (var i = 0; i < charts.length; i++) {
            chartType = '(' + lang.chartTypes[charts[i].chartType] + ') ';

            $(el.chartsSelectbox).append(
                $('<option>').attr('value', charts[i].chartId)
                    .html(chartType + charts[i].chartTitle)
                );
        }
    }

    function update(analysisPage) {
        // NOTA BENE: The current version of Zepto doesn't support
        // multiple selection based on array.

        // Reset the select box.
        // $(el.chartsSelectbox + ' > option').removeAttr('selected');
        $(el.chartsSelectbox).children('option:selected').removeAttr('selected');
        $(el.chartsSelectbox).attr('selectedIndex', '-1');

        for (var i = 0; i < analysisPage.charts.length; i++) {
            $(el.chartsSelectbox + ' [value="' + analysisPage.charts[i].chartId + '"]').attr('selected', 'selected');
        }

        $(el.analysisPageNameTextbox).val(analysisPage.name);
        analysisId = analysisPage.id;
    }

    function getSettings() {
        var settings = {
            name: '',
            id: '',
            order: new Date().getTime(),
            userDefined: true,
            charts: []
        },
            chartOrder = 1;

        settings.name = $(el.analysisPageNameTextbox).val();
        settings.id = analysisId;

        // $(el.chartsSelectbox + ' > option').each(function (chart){
        $(el.chartsSelectbox).children('option:selected').each(function (chart) {
            settings.charts.push({
                chartId: $(this).val(),
                order: chartOrder
            });

            chartOrder += 1;
        });

        return settings;
    }

    $(el.saveChartSettings).on('click', function () {
        eventManager.raiseEvent('onSettingsChanged', getSettings());
    });

    chartSettingsPage.create = create;
    chartSettingsPage.update = update;
    chartSettingsPage.getSettings = getSettings;

    return chartSettingsPage;
});
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
// ------------------------------------------
// MAIN MOBILE WEB APP
// ------------------------------------------

// Initialize jQTouch.
var jQT = new $.jQTouch({
    addGlossToIcon          : true,
    themeSelectionSelector  : '#jqt #themes ul',
    useFastTouch            : true,
    statusBar               : 'default',
    hoverDelay              : 10,
    pressDelay              : 10,
    preloadImages           : [
        'images/sw-slot-border.png',
        'images/sw-alpha.png',
        'images/sw-button-cancel.png',
        'images/sw-button-done.png',
        'images/sw-header.png'
    ]
});

// Main functions:
Zepto(function ($) {

    var theApp       = {},
        loader       = WebAppLoader, // Alias
        output       = loader.getConsole(),
        eventManager = loader.getEventManager(),
        helper       = loader.loadModule('helper'),
        siteUrls     = loader.getSharedModule('settings').siteUrls,
        el           = loader.getSharedModule('pageElements'),
        lang         = loader.getSharedModule('localizationManager').getLanguage() || {};

    // Test log method.
    output.log('Hello from Dan & Asa!');

    theApp.lastUsernameUsed = '';
    theApp.lastPasswordUsed = '';
    theApp.lastFavouriteSelected = '';

    // Default settings.
    theApp.lastAnalysisObjectUsed = {
        portfolioId: '',
        portfolioName: '',
        analysisId: 'performance',
        analysisName: 'Performance',
        timePeriodId: 'Earliest',
        timePeriodName: 'Earliest',
        chartId: 'performance_bar',
        timeStamp: ''
    };

        /* ----------------------- ON/OFF ----------------------- /
    'Switch comments off changing /* in //* and viceversa'
    // ------------------------------------------------------ */

    // ------------------------------------------
    // COMPONENTS CREATION
    // ------------------------------------------

    // Repositories
    theApp.repositories = loader.loadModule('repositories');

    // IScroll
    theApp.scroll = loader.loadModule('scroll');

    // Navigation
    theApp.nav = loader.loadModule('nav');

    // Loading Mask Manager
    theApp.mask = loader.loadModule('loadingMaskManager');

    // Loading Settings
    theApp.settings = loader.loadModule('settings');

    // Swipe View
    theApp.swipeView = loader.loadModule('swipeView');

    // Analysis Settings Page
    theApp.analysisSettingsPage = loader.loadModule('analysisSettingsPage');

    // Chart Settings Page
    theApp.chartSettingsPage = loader.loadModule('chartSettingsPage');

    // Chart Components
    theApp.chartComponents = loader.loadModule('chartComponents');

    // Ajax Manager
    theApp.ajaxManager = loader.loadModule('ajaxManager');

    // Swipe Button Control
    theApp.swipeButton = loader.loadModule('swipeButton');

    // ------------------------------------------
    // LAST ANALYSIS DATA OBJECT
    // ------------------------------------------

    theApp.getLastAnalysisObjectUsed = function () {
        return theApp.lastAnalysisObjectUsed;
    };

    theApp.setLastAnalysisObjectUsed = function (obj) {
        for (var property in obj) {
            if (theApp.lastAnalysisObjectUsed.hasOwnProperty(property)) {
                theApp.lastAnalysisObjectUsed[property] = obj[property];
            }
        }
    };

    theApp.tryToChangeLanguage = function (language) {
        var currentLanguage = helper.getURLParameter('lang') || 'en-US';

        if (language && currentLanguage && (language.toLowerCase() !== currentLanguage.toLowerCase())) {
            theApp.nav.reloadApp('?lang=' + language);
        }
    };

    // ------------------------------------------
    // THE MAIN ENTRY POINT (Before Login)
    // ------------------------------------------

    theApp.startHere = function () {
        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = {},
            lastLoggedOnUser = '',
            language = '',
            username = '',
            password = '';

        // Try to get the last logged on user.
        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        if (lastLoggedOnUser) {
            theApp.settings.loadData('userSettings', lastLoggedOnUser);
            userSettingsData = theApp.settings.getData('userSettings');

            // Try to get username and password.
            username = userSettingsData.username || '';
            password = userSettingsData.password || '';
            language = userSettingsData.language || '';

            if (username !== '') {
                theApp.tryToChangeLanguage(language);
            }

            // With the language defined, set the CultureInfo property of the 
            // JavaScript Date object, so date.js can hook in for localization.
            Date.CultureInfo = lang.cultureInfo;

            if (userSettingsData.automaticLogin) {
                // If username and password fields are available...
                if (username && password) {
                    // .. try to login or...
                    theApp.doLogin(username, password);
                } else {
                    // ... go to the login page using the last logged on user.
                    theApp.goToLoginPage(username || lastLoggedOnUser);
                }
            } else {
                theApp.goToLoginPage(username || lastLoggedOnUser);
            }
        } else {
            theApp.goToLoginPage();
        }
    };

    theApp.doLogin = function (username, password) {
        theApp.lastUsernameUsed = username.toLowerCase();
        theApp.lastPasswordUsed = password;
        theApp.auth.doLogin(username, password, siteUrls.authenticate);
    };

    theApp.goToLoginPage = function (username) {
        theApp.tabbar.hide();

        // Set the field's value.
        $(el.userNameTextbox).val(username || '');

        // Show the login page.
        setTimeout(function () {
            theApp.nav.goToPage($(el.loginPage), 'dissolve');
        }, 1000);
    };

    // ------------------------------------------
    // INIT APP (After Login)
    // ------------------------------------------

    theApp.init = function () {
        var lastLoggedOnUser = '',
            automaticLogin = false,
            analysisDataObject = {};

        theApp.nav.goToPage($(el.startupPage), 'dissolve');
        theApp.tabbar.show();

        //    - Update  with the current username [and password] the user settings data object
        //      and the lastLoggedOnUser property of app settings.

        var appSettingsData = theApp.settings.loadData('appSettings'),
            userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        lastLoggedOnUser = (appSettingsData && appSettingsData.lastLoggedOnUser)
            ? appSettingsData.lastLoggedOnUser.toLowerCase()
            : null;

        appSettingsData.lastLoggedOnUser = theApp.lastUsernameUsed;
        theApp.settings.saveData('appSettings');

        userSettingsData.username = theApp.lastUsernameUsed;
        userSettingsData.password = theApp.lastPasswordUsed;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        automaticLogin = helper.getValueAs(userSettingsData.automaticLogin, 'boolean');

        //  TODO:
        //    - If the current user and the last logged on user are different clear
        //      the revolution shared space in the local storage.
        //
        //    - Init the localizationManager using the user language (or the default one).
        //    - Init the themeManager using the last theme used (or the default one).        
        var lastThemeUsed = theApp.themesManager.loadData('theme', theApp.lastUsernameUsed);
        theApp.themesManager.switchStyle(lastThemeUsed);

        //
        //    - Load the favourites and fill the favourites slot.
        //    - Load the analysis settings (page and charts) and fill the analysis slot. 
        //      NB: storing the analysis settings is important because we reuse them later!
        //
        var lastAnalysisObjectUsed = userSettingsData.lastAnalysisObjectUsed || null;

        //    - Try to retrieve the last analysisDataObject used. This should contain:
        //          - id analysis page
        //          - id portfolio
        //          - id time periods
        //          - ?!? id last chart viewed ?!? or the first available.
        //    - If this information is not available try to retrieve it from
        //          - the favourites
        //            OR
        //          - the default or the last or the most viewed portfolio code
        //          - the default analysis page code
        //          - the default time periods code
        //
        //    - When this information is available call updateAnalysisPage({analysisDataObject})
        theApp.updateSettingsPage({ email: theApp.lastUsernameUsed, automaticLogin: automaticLogin });
        theApp.analysisManager.update(theApp.lastUsernameUsed);
        theApp.favouritesManager.update(theApp.lastUsernameUsed);
        theApp.updateAnalysisPage(lastAnalysisObjectUsed);
    };

    theApp.updateAnalysisPage = function (analysisDataObjectValue) {
        // theApp.portfolioManager.loadPortfolio(analysisDataObject.portfolioId);
        var analysisDataObject = analysisDataObjectValue || theApp.getLastAnalysisObjectUsed();

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        theApp.nav.goToPage($(el.analysisPage), 'dissolve');
        theApp.mask.show('analysis');

        // TODO: 
        // Get analysis name and timeperiods name from respective ids and select 
        // the right spinning wheel.

        function renderAnalysisPage(portfolio) {
            var chartsToRender = [],
                analysisPagesData = {},
                analysisPage = {},
                portfolioId = portfolio.code,
                portfolioName = portfolio.name,
                analysisPageCharts = null,
                analysisPageTitle = '',
                i;


            analysisPagesData = theApp.analysisManager.getData('analysisPages');

            analysisPage = jLinq.from(analysisPagesData.items)
                .equals('id', analysisDataObject.analysisId)
                .select();

            // If no analysis page has been found load the first one.            
            if (analysisPage[0] && analysisPage[0].charts) {
                analysisPageCharts = analysisPage[0].charts;
                analysisPageTitle = analysisPage[0].name;
            } else {
                analysisPageCharts = analysisPagesData.items[0].charts;
                analysisPageTitle = analysisPagesData.items[0].name;
            }

            chartsToRender = jLinq.from(analysisPageCharts)
                .sort('order')
                .select();

            // Update the page title.
            $(el.analysisTitle).html(analysisPageTitle);

            // Add the currently requested time period to each of the chart config objects.
            $.each(chartsToRender, function (index, chart) {
                chart.timePeriodId = analysisDataObject.timePeriodId;
            });

            // Loop around the provided time periods for the portfolio,
            // and get hold of the start and end date for that particular
            // period, breaking the loop when found.
            $.each(portfolio.timePeriods, function (index, period) {
                var startDate, endDate;

                if (period.code === analysisDataObject.timePeriodId) {
                    startDate = Date.parse(period.startDate);
                    endDate = Date.parse(period.endDate);

                    $(el.timePeriodStartDateText).html(startDate.toString('MMM d, yyyy'));
                    $(el.timePeriodEndDateText).html(endDate.toString('MMM d, yyyy'));
                    return false;
                }
            });

            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.setLastAnalysisObjectUsed({
                portfolioId: portfolioId,
                portfolioName: portfolioName
            });

            // Deselect Settings button when charts have been rendered.
            theApp.tabbar.getButton('settings').setHighlight(false);

            theApp.saveLastAnalysisObjectUsed();
            theApp.synchronizeFavouriteButton();
            theApp.chartComponents.render(chartsToRender, '#analysis_partial');
        }

        function onLoadPortfolioAnalysisCompleted(portfolio) {
            renderAnalysisPage(portfolio);
        }

        theApp.portfolioManager.loadPortfolioAnalysis(
            analysisDataObject.portfolioId,
            onLoadPortfolioAnalysisCompleted
        );
    };

    theApp.saveLastAnalysisObjectUsed = function () {
        // TODO: Add code here to save in the user space the last analysis object used.
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.lastAnalysisObjectUsed = theApp.getLastAnalysisObjectUsed();
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
    };

    theApp.chartComponents.on('onAllChartsLoaded', function () {
        theApp.scroll.rebuild('analysis');
        theApp.mask.updateAnalysisText(' ');
        theApp.mask.hide('analysis');
    });

    theApp.chartComponents.on('onChartsLoading', function (chartCount, chartTotal) {
        theApp.mask.updateAnalysisText('Loading ' + chartCount + ' of ' + chartTotal);
    });


    // ------------------------------------------
    // SETTINGS PAGES
    // ------------------------------------------

    theApp.showAnalysisSettingsPage = function () {
        var analysisPagesData = {}, analysisPages;

        analysisPagesData = theApp.analysisManager.getData('analysisPages');

        analysisPages = jLinq.from(analysisPagesData.items)
            .sort('order', 'userDefined')
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    userDefined: record.userDefined
                };
            });

        theApp.analysisSettingsPage.create(analysisPages);
    };

    theApp.analysisSettingsPage.on('onClick', function (analysisId) {
        theApp.nav.goToPage(el.chartSettingsPage, 'slideup');
        theApp.showChartSettingsPage(analysisId);
    });

    theApp.analysisSettingsPage.on('onPageLoaded', function () {
        // containerId, label, callback, autoRemove, buttonClass
        theApp.swipeButton.addTo('#listAnalysisSettingsUserPages', 'Delete', theApp.onUserPageDeleted, true);
    });

    theApp.onUserPageDeleted = function ($button) {
        var userPageId = $button.parent().parent().data('link') || null,
            analysisPagesData;

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        if (helper.removeObjectFromArray(analysisPagesData.items, 'id', userPageId)) {
            theApp.analysisManager.saveData('analysisPages', theApp.lastUsernameUsed);
            theApp.updateAnalysisSlot(analysisPagesData);
        }
        // alert(userPageId);
    };

    theApp.showChartSettingsPage = function (analysisId) {
        var analysisPagesData = {},
            chartComponentsData = {},
            analysisPage = {},
            charts = theApp.showChartSettingsPage.charts;

        if (!analysisId) {
            return; // TODO: Add a message error.
        }

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        chartComponentsData = theApp.chartComponents.getData('charts');

        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', analysisId)
            .select(function (record) {
                return {
                    name: record.name,
                    id: record.id,
                    charts: record.charts
                };
            })[0] || null;

        if (!analysisPage) {
            analysisPage = {
                name: '',
                id: analysisId,
                charts: []
            };
        }

        // TODO: Add comments...
        if (charts.length === 0) {
            for (var chart in chartComponentsData) {
                charts.push({
                    chartId: chartComponentsData[chart].chartId,
                    chartType: chartComponentsData[chart].chartType,
                    chartTitle: chartComponentsData[chart].title // chartTitle
                });
            }

            theApp.chartSettingsPage.create(charts);
        }

        theApp.chartSettingsPage.update(analysisPage);
    };

    theApp.chartSettingsPage.on('onSettingsChanged', function (updatedAnalysisPage) {
        var analysisPage, analysisPagesData;

        updatedAnalysisPage.name = updatedAnalysisPage.name || 'Untitled'; // TODO: Localize string 'Untitled'

        analysisPagesData = theApp.analysisManager.getData('analysisPages');
        analysisPage = jLinq.from(analysisPagesData.items)
            .equals('id', updatedAnalysisPage.id)
            .select()[0] || null;

        if (analysisPage) {
            $.extend(analysisPage, updatedAnalysisPage);
        } else {
            analysisPagesData.items.push(updatedAnalysisPage);
        }

        theApp.analysisManager.saveData('analysisPages', theApp.lastUsernameUsed);
        theApp.updateAnalysisSlot(analysisPagesData);

        // Show the new analysis page.
        theApp.setLastAnalysisObjectUsed({
            analysisId: updatedAnalysisPage.id,
            analysisName: updatedAnalysisPage.name
        });
        theApp.updateAnalysisPage();

    });

    // Memoization pattern.
    theApp.showChartSettingsPage.charts = [];

    theApp.updateSettingsPage = function (settings) {
        var email = settings.email || null,
            automaticLogin = settings.automaticLogin || false;

        // If an email has been specified update the field.
        if (email) {
            $(el.userEmailLabel).html(theApp.lastUsernameUsed);
        }

        // Update the automatic login checkbox.
        if (automaticLogin) {
            $(el.stayLoggedCheckbox).attr('checked', true);
        } else {
            $(el.stayLoggedCheckbox).removeAttr('checked');
        }
    };

    // ------------------------------------------
    // LANGUAGE SETTINGS PAGE
    // ------------------------------------------

    theApp.languageSettingsPage = loader.loadModule('languageSettingsPage');
    theApp.languageSettingsPage.create();

    theApp.languageSettingsPage.on('onLanguageSelected', function (language) {
        var userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.language = language.value;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);
        output.log('onLanguageSelected', language);
        theApp.nav.reloadApp('?lang=' + language.value);
    });

    // ------------------------------------------
    // PORTFOLIO MANAGER
    // ------------------------------------------

    theApp.portfolioManager = loader.loadModule('portfolioManager');

    theApp.portfolioManager.on('onPortfolioLoaded', function (portfolio) {
        // When a new portfolio is loaded update timeperiods and analysis slots.
        theApp.repositories.timePeriodsSlot.setData(portfolio.timePeriods);
        output.log('Loaded portfolio:', portfolio);
    });

    theApp.portfolioManager.on('onAnalysisLoaded', function (data) {
        theApp.scroll.rebuild('analysis');
        theApp.updateAnalysisInfo(data);
        theApp.mask.hide('analysis');
        theApp.tabbar.show();
    });

    theApp.portfolioManager.on('onFailed', function (message) {
        theApp.scroll.rebuild('error');
        $(el.errorMessageText).html(message);
        theApp.nav.goToPage($(el.errorPage));
        theApp.mask.hide('analysis');
    });

    theApp.updateAnalysisInfo = function (data) {
        var i, benchmarks, benchmarkPlaceholder;

        if (data) {
            // Define the CSS word-break rules depending on 
            // the whitespace available in the portfolio name.
            if (data.name.indexOf(' ') === -1) {
                $(el.summaryTitleName).attr('style', 'word-break: break-all;');
            } else {
                $(el.summaryTitleName).attr('style', 'word-break: normal;');
            }

            // Update the portfolio name.
            $(el.summaryTitleName).html(data.name);

            // Clear out any existing benchmarks.
            benchmarkPlaceholder = $(el.summaryTitleBenchmarkName);
            benchmarkPlaceholder.html('');

            // Loop around any benchmarks we have, 
            // adding their names to the placeholder.
            benchmarks = data.analysis.benchmarks || [];

            for (i = 0; i < benchmarks.length; i++) {
                if (i > 0) {
                    benchmarkPlaceholder.append(', ');
                }
                benchmarkPlaceholder.append(benchmarks[i].name);
            }

            // Clear the analysis partial of existing elements.
            $(el.analysisPage + '_partial').html('');
        }
    };

    // ------------------------------------------
    // TOOLBAR
    // ------------------------------------------

    var toolbarConfig = {
        toolbarId: '#analysis .toolbar',  // el.tabbar,
        buttonPrefix: 'toolbar_btn',
        visible: true,
        items: [
            { id: 'favourite', title: lang.tabbar.favourites, btnClass: 'favourite' }
        // { id: 'favourite2', title: lang.tabbar.favourites, btnClass: 'favourite' }
        ]
    };

    theApp.toolbar = loader.loadModule('toolbar');
    theApp.toolbar.create(toolbarConfig);

    theApp.toolbar.on('onTap', function () {
        theApp.scroll.goUp();
    });

    theApp.toolbar.on('onFavouriteTap', function (isSelected) {
        if (isSelected) {
            theApp.addToFavourites();
        } else {
            theApp.removeFromFavourites();
        }
    });

    // ------------------------------------------
    // TABBAR
    // ------------------------------------------
    /* 
    theApp.lastAnalysisObjectUsed = {
    portfolioId: '',
    portfolioName: '',
    analysisId: 'performances',
    analysisName: 'Performances',
    timePeriodId: 'Earliest',
    timePeriodName: 'Earliest',
    chartId : 'performance_bar',
    timeStamp: ''
    };    
    
    */
    var tabbarConfig = {
        tabbarId: el.tabbar,
        buttonPrefix: 'tabbar_btn',
        visible: false,
        items: [
        // { id: 'home', title: lang.tabbar.home, btnClass: 'home' },
            {id: 'favourites', title: lang.tabbar.favourites, btnClass: 'favourites' },
            { id: 'portfolios', title: lang.tabbar.portfolios, btnClass: 'portfolios' },
            { id: 'analysis', title: lang.tabbar.analysis, btnClass: 'analysis' },
            { id: 'timePeriods', title: lang.tabbar.timePeriods, btnClass: 'timeperiods' },
        // { id: 'infos', title: lang.tabbar.infos, btnClass: 'infos' },
        // { id: 'more', title: lang.tabbar.more, btnClass: 'more' }
            {id: 'settings', title: lang.tabbar.settings, btnClass: 'settings', highlight: true }
        ]
    };

    theApp.tabbar = loader.loadModule('tabbar');
    theApp.tabbar.create(tabbarConfig);

    theApp.tabbar.on('onFavouritesTap', function () {
        theApp.spinningWheel.getSlot('favourites').show(theApp.lastFavouriteSelected);
    });

    theApp.tabbar.on('onPortfoliosTap', function () {
        theApp.spinningWheel.getSlot('portfolios').show(theApp.getLastAnalysisObjectUsed().portfolioId); //'ADVISOR');
    });

    theApp.tabbar.on('onAnalysisTap', function () {
        theApp.spinningWheel.getSlot('analysis').show(theApp.getLastAnalysisObjectUsed().analysisId);
    });

    theApp.tabbar.on('onTimePeriodsTap', function () {
        theApp.spinningWheel.getSlot('timePeriods').show(theApp.getLastAnalysisObjectUsed().timePeriodId);
    });

    theApp.tabbar.on('onSettingsTap', function (button) {
        if (button.isHighlighted) {
            theApp.nav.goToPage($(el.settingsPage));
        } else {
            theApp.nav.goToPage($(el.analysisPage));
            // theApp.updateAnalysisPage();
        }
    });

    // ------------------------------------------
    // SPINNING WHEEL
    // ------------------------------------------

    var slotConfig = {
        items: [
            { id: 'favourites', repository: theApp.repositories.favouritesSlot },
            { id: 'portfolios', repository: theApp.repositories.portfoliosSlot },
            { id: 'analysis', repository: theApp.repositories.analysisSlot },
            { id: 'timePeriods', repository: theApp.repositories.timePeriodsSlot }
        ]
    };

    theApp.spinningWheel = loader.loadModule('spinningWheel');
    theApp.spinningWheel.create(slotConfig);

    theApp.spinningWheel.on('onPortfoliosDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ portfolioId: key, portfolioName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onAnalysisDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ analysisId: key, analysisName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onTimePeriodsDone', function (key, value) {
        theApp.setLastAnalysisObjectUsed({ timePeriodId: key, timePeriodName: value });
        theApp.updateAnalysisPage();
    });

    theApp.spinningWheel.on('onFavouritesDone', function (key, value) {
        var analysisDataObject = theApp.favouritesManager.getAnalysisDataObjectFromFavourte(key);

        if (analysisDataObject) {
            theApp.setLastAnalysisObjectUsed(analysisDataObject);
            theApp.updateAnalysisPage();
        }
    });

    // ------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------

    theApp.auth = loader.loadModule('auth');

    // Login
    $(el.loginButton).on('click', function () {
        var username, password;

        // Obtain the username and password from the form.
        username = $(el.userNameTextbox).val();
        password = $(el.passwordTextbox).val();

        theApp.doLogin(username, password);
    });

    theApp.auth.on('onLoginSuccess', function (token) {
        // If the user login successfully store the token.
        theApp.ajaxManager.setToken(token);
        theApp.init();
    });

    theApp.auth.on('onLoginFailed', function (message) {
        $(el.loginErrorText).html(message);
        output.log('onLoginFailed response: ', message);
    });

    // ------------------------------------------
    // PAGE EVENTS
    // ------------------------------------------

    theApp.pageEventsManager = loader.loadModule('pageEventsManager');

    theApp.pageEventsManager.on('onStartupStart', function () {
        output.log('onStartupEnd');
    });

    theApp.pageEventsManager.on('onLoginStart', function () {
        theApp.tabbar.hide();
        output.log('onLoginStart');
    });

    theApp.pageEventsManager.on('onHomeStart', function () {
        output.log('onHomeStart');
    });

    theApp.pageEventsManager.on('onHomeEnd', function () {
        theApp.tabbar.show();
        theApp.scroll.rebuild('home');
        output.log('onHomeEnd');
    });

    theApp.pageEventsManager.on('onEulaEnd', function () {
        $.get(siteUrls.eula, function (data) {
            theApp.scroll.rebuild('eula');
            $(el.eulaPage + '_partial').append('<div class="genericContainer">' + helper.htmlDecode(data) + '</div>');
        });
        output.log('onEulaEnd');
    });

    theApp.pageEventsManager.on('onAnalysisEnd', function () {
        theApp.scroll.rebuild('analysis');

        // Deselect Settings button.
        theApp.tabbar.getButton('settings').setHighlight(false);

        output.log('onAnalysisEnd');
    });

    theApp.pageEventsManager.on('onSettingsStart', function () {
        theApp.scroll.rebuild('settings');
        output.log('onSettingsStart');
    });

    theApp.pageEventsManager.on('onSettingsEnd', function () {
        // theApp.scroll.rebuild('settings');
        output.log('onSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisSettingsEnd', function () {
        theApp.scroll.rebuild('analysisSettings');
        output.log('onAnalysisSettingsEnd');
    });

    theApp.pageEventsManager.on('onAnalysisPagesSettingsStart', function () {
        theApp.scroll.rebuild('analysisPagesSettings');
        theApp.showAnalysisSettingsPage();
        output.log('onAnalysisPagesSettingsStart');
    });

    theApp.pageEventsManager.on('onChartSettingsEnd', function () {
        // theApp.scroll.rebuild('chartSettings');
        // TODO: focus() doesn't work on iOS...
        setTimeout(function () {
            $(el.analysisPageNameTextbox).focus();
        }, 200);

        output.log('onChartSettingsStart');
    });

    // ------------------------------------------
    // SETTINGS PAGE EVENTS
    // ------------------------------------------

    $(el.reloadAppButton).on('click', function () {
        theApp.nav.reloadApp();
    });

    $(el.resetAllSettingsButton).on('click', function () {
        theApp.localStorage.clearAll();
        theApp.nav.reloadApp();
    });

    $(el.resetCurrentSettingsButton).on('click', function () {
        theApp.localStorage.clearUserSettings(theApp.lastUsernameUsed);
        theApp.nav.goToPage($(el.settingsPage));
    });

    $(el.stayLoggedCheckbox).on('click', function () {
        var stayLogged = $(el.stayLoggedCheckbox + ':checked').val()
            ? true
            : false,
        userSettingsData = theApp.settings.loadData('userSettings', theApp.lastUsernameUsed);

        userSettingsData.automaticLogin = stayLogged;
        theApp.settings.saveData('userSettings', theApp.lastUsernameUsed);

        output.log(stayLogged);
    });

    // ------------------------------------------
    // ANALYSIS MANAGER
    // ------------------------------------------

    theApp.analysisManager = loader.loadModule('analysisManager');

    // NOTA BENE: the analysis manager is updated the first time when the home
    // page is loaded.
    theApp.analysisManager.on('onUpdated', function (analysisPages) {
        theApp.updateAnalysisSlot(analysisPages);
    });

    theApp.updateAnalysisSlot = function (analysisPages) {
        var analysisSlotItems = jLinq.from(analysisPages.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.name,
                    code: record.id
                };
            });

        theApp.repositories.analysisSlot.setData(analysisSlotItems);
    };

    // ------------------------------------------
    // FAVOURITES MANAGER
    // ------------------------------------------

    theApp.favouritesManager = loader.loadModule('favouritesManager');

    theApp.favouritesManager.on('onFavouritesUpdated', function (favourites) {
        theApp.updateFavouritesSlot(favourites);
    });

    theApp.updateFavouritesSlot = function (favourites) {
        var favouritesSlotItems = jLinq.from(favourites.items)
            .sort('order')
            .select(function (record) {
                return {
                    name: record.title,
                    code: record.favouriteId
                };
            });

        theApp.repositories.favouritesSlot.setData(favouritesSlotItems);
    };

    theApp.analysisDataObjectToFavourite = function (analysisDataObject) {
        var favourite = null;

        favourite = theApp.favouritesManager.getFavourteFromAnalysisDataObject(analysisDataObject);
        return favourite || null;
    };

    // - favouriteId [optional]
    theApp.favouriteExists = function (favouriteId) {
        var favouriteToCheck = theApp.getFavouriteById(favouriteId);

        return (favouriteToCheck && true);
    };

    theApp.getFavouriteById = function (favouriteId) {
        var favourite = null,
            favouriteToCheck = null,
            favouritesData = theApp.favouritesManager.getData('favourites');

        if (!favouriteId) {
            favourite = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
            favouriteId = favourite.favouriteId;
        }

        favouriteToCheck = jLinq.from(favouritesData.items)
            .equals('favouriteId', favouriteId)
            .select()[0] || null;

        return (favouriteToCheck);
    };

    theApp.addToFavourites = function () {
        var favouriteToAdd = {},
            favouritesData = null;

        favouriteToAdd = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToAdd) {
            if (!theApp.favouriteExists(favouriteToAdd.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                favouritesData.items.push(favouriteToAdd);
                theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                theApp.favouritesManager.update(theApp.lastUsernameUsed);
                theApp.setLastFavouriteSelected(favouriteToAdd.favouriteId);
            }
        }
    };

    theApp.removeFromFavourites = function () {
        var favouriteToRemove = {},
            favouritesData = null;

        favouriteToRemove = theApp.analysisDataObjectToFavourite(theApp.lastAnalysisObjectUsed);
        if (favouriteToRemove) {
            if (theApp.favouriteExists(favouriteToRemove.favouriteId)) {
                favouritesData = theApp.favouritesManager.getData('favourites');
                if (helper.removeObjectFromArray(favouritesData.items, 'favouriteId', favouriteToRemove.favouriteId)) {
                    theApp.favouritesManager.saveData('favourites', theApp.lastUsernameUsed);
                    theApp.favouritesManager.update(theApp.lastUsernameUsed);
                }
            }
        }
    };

    // - favouriteId [optional]
    theApp.synchronizeFavouriteButton = function (favouriteId) {
        var favourite = theApp.getFavouriteById(favouriteId),
            favouriteButton = theApp.toolbar.getButton('favourite');

        if (favourite && favouriteButton) {
            theApp.setLastFavouriteSelected(favourite.favouriteId);
            favouriteButton.select();
        } else {
            favouriteButton.deselect();
        }
    };

    theApp.setLastFavouriteSelected = function (favouriteId) {
        theApp.lastFavouriteSelected = favouriteId;
    };

    // ------------------------------------------
    // THEMES MANAGER
    // ------------------------------------------

    theApp.themesManager = loader.loadModule('themesManager');

    theApp.themesManager.on('onThemeChanged', function (themeName) {
        // theApp.scroll.rebuild('analysis');
        // $(el.analysisPage + '_partial').html(data);
        var themeData = theApp.themesManager.getData('theme') || null;

        if (themeData) {
            themeData.name = themeName;
            theApp.themesManager.saveData('theme', theApp.lastUsernameUsed);
        }

        output.log('onThemeChanged', themeName);
    });

    // ------------------------------------------
    // PORTFOLIOS LIST
    // ------------------------------------------
    //
    // NOTA BENE:
    // PortfoliosList has been removed from the app but the code is still here
    // for testing purpose.

    theApp.portfoliosList = loader.loadModule('portfoliosList');

    theApp.portfoliosList.on('onDataReceived', function (data) {
        // theApp.scroll.rebuild('analysis');
        $(el.analysisPage + '_partial').html(data);
    });

    // ------------------------------------------
    // TEARDOWN
    // ------------------------------------------

    // Unload modules from the loader after they have been loaded by the app.
    loader.unloadModule('repositories');
    loader.unloadModule('scroll');
    loader.unloadModule('tabbar');
    loader.unloadModule('spinningWheel');

    theApp.startHere();
});


