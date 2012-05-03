// ------------------------------------------
// TEST
// ------------------------------------------

WebAppLoader.addModule({ name: 'test', isShared: true }, function () {
    var test = {},
        output = this.plugins.output || {},
        shared = this.shared || {};

    function sayHello() {
        output.log('sayHello ' + shared.settings.getVersion());
    }
    
    test.sayHello = sayHello;

    return test;
});