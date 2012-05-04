// ------------------------------------------
// TEST
// ------------------------------------------

WebAppLoader.addModule({ name: 'test', plugins: ['base64'], sharedModules: ['settings', 'localizationManager'] }, function (config) {
    var test        = {},
        output      = this.loader.output || {},
        settings    = this.loader.shared.settings || {},
        manager     = this.loader.shared.localizationManager || {};

    function sayHello() {
        // output.log('sayHello ' + config.name + settings.getVersion());
        // var msg = manager.sayHello();
        // output.log('sayHello ' + msg);
    }

    test.sayHello = sayHello;

    return test;
});