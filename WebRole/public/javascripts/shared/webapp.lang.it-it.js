// ------------------------------------------
// LANG PACK IT-IT
// ------------------------------------------

WebAppLoader.addModule({ name: 'it_IT', isShared: true }, function () {
    var it_IT   = {},
        output  = this.getConsole();

    it_IT.hello = "Ciao";

    return it_IT;
});