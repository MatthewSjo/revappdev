// ------------------------------------------
// LANG PACK EN_US
// ------------------------------------------

WebAppLoader.addModule({ name: 'en_US', isShared: true }, function () {
    var en_US   = {},
        output  = this.getConsole();

    en_US = {
        hello: 'hello',

        // Spinning wheel.
        noPortfolioSlotAvailable    : 'No portfolio available',
        noAnalysisSlotAvailable     : 'No analysis available',
        noTimePeriodSlotAvailable   : 'No time period available',

        // Tabbar.
        tabbarHomeTitle             : 'Home',
        tabbarPortfolios            : 'Portfolios',
        tabbarAnalysis              : 'Analysis',
        tabbarTimePeriods           : 'Time Periods',
        tabbarInfos                 : 'Infos',
        tabbarMore                  : 'More'

    }

    return en_US;
});