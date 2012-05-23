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
            }
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