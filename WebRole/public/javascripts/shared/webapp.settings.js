// ------------------------------------------
// SETTINGS
// ------------------------------------------

WebAppLoader.addModule({ name: 'settings', dataObjects: ['appSettings', 'userSettings'], isShared: true }, function () {
    var settings            = {},
        appSettings         = {},
        siteUrls            = {},
        analysisTypes       = {},
        output              = this.getConsole(),
        userSettingsDataObj = this.getDataObject('userSettings')
        appSettingsDataObj  = this.getDataObject('appSettings');

    userSettingsDataObj.define({
        automaticLogin  : false,
        username        : 'daniel.attfield@statpro.com',
        password        : 'StatPro123',
        language        : 'en-US'
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

    // Analysis types.
    analysisTypes = {
        dashboard           : 'Dashboard',
        performance         : 'Performance',
        risk                : 'Risk',
        assetAllocation     : 'Asset Allocation',
        contribution        : 'Contribution',
        attribution         : 'Attribution',
        fixedIncome         : 'Fixed Income',
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

    // Data Objects
    // settings.appSettingsData = appSettingsData;
    // settings.userSettingsData = userSettingsData;

    return settings;
});