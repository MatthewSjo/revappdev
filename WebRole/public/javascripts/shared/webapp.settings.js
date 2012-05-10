// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'settings', isShared: true }, function () {
    var settings        = {},
        appSettings     = {},
        siteUrls        = {},
        analysisTypes   = {},
        output          = this.getConsole();

    // APP SETTINGS.
    appSettings = {
        loadPortfoliosSlotDataOnce: true
    };

    // URLs.
    siteUrls = {
        portfolios          : '/portfolios',
        autenticate         : '/authenticate',
        index               : '/index',
        portfolioAnalysis   : '/portfolioAnalysis',
        analysis            : '/analysis',
        eula                : '/eula'
    };

    // Analysis types.
    analysisTypes = {
        dashboard           : 'Dashboard',
        performances        : 'Performances',
        risk                : 'Risk',
        assetAllocation     : 'Asset Allocation',
        contribution        : 'Contribution',
        attribution         : 'Attribution',
        fixedIncome         : 'FixedIncome',
        balanced            : 'Balanced'
    };

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
    settings.analysisTypes = analysisTypes;

    return settings;
});