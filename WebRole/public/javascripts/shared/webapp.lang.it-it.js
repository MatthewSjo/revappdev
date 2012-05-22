// ------------------------------------------
// LANG PACK IT-IT
// ------------------------------------------

WebAppLoader.addModule({ name: 'it_IT', isShared: true }, function () {
    var it_IT = {},
        output = this.getConsole();

    it_IT.hello = "Ciao";
    
    // Shared
    it_IT.decimalSymbol = ',';
    it_IT.groupingSymbol = '.';

    return it_IT;
});