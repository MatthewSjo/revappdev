// ------------------------------------------
// DATA OBJECT
// ------------------------------------------

WebAppLoader.addExtension({ name: 'dataObject', plugins: ['helper'], hasEvents: true }, function (module) {
    var extension       = {},
        loader          = module.loader, // The loader object shared by all modules.
        output          = this.getConsole(),
        eventManager    = this.getEventManager(),
        helper          = this.getPlugin('helper');

    var dataObject = (function() {
        var dataObject = {};

        dataObject.name = 'dataObject';
        dataObject.sayHello = function () {
            console.log('HELLO!', Object.keys(this));
        };

        return dataObject;
    })();

    // Invoked when a new module is added.
    function extendAddModule(config, moduleToAdd) {
        // Code example:
        //      var hasEvents = helper.getValueAs(config.hasEvents, 'boolean');
        //      moduleToAdd.hasEvents = hasEvents;
        var dataObjects = helper.getValueAs(config.dataObjects, 'array');
        
        moduleToAdd.dataObjects = dataObjects;
        
        // return moduleToAdd;
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
    module.getDataObject = function (objectlName) {
        var isDataObjectAvailable = this.dataObjects.some(function(m){
            return m === objectlName;
        });
            
        // If the shared module is in the list of the available modules return it.
        return (isDataObjectAvailable)
            ? Object.create(dataObject)
            : null;
    };

    // Shared module loader methods:
    // Add code here

    // Public WebAppLoader methods;
    // Add code here

    extension.extendAddModule = extendAddModule;
    // extension.extendLoadModule = extendLoadModule;

    return extension;
});