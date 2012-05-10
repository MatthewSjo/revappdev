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