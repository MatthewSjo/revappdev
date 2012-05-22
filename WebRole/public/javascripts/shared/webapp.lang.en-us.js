// ------------------------------------------
// LANG PACK EN_US
// ------------------------------------------

WebAppLoader.addModule({ name: 'en_US', isShared: true }, function () {
    var en_US   = {},
        output  = this.getConsole();

    en_US = {
        hello: 'hello',

        // Shared
        decimalSymbol               : '.',
        groupingSymbol              : ',',

        // Spinning wheel.
        noPortfolioSlotAvailable    : 'No portfolio available',
        noAnalysisSlotAvailable     : 'No analysis available',
        noTimePeriodSlotAvailable   : 'No time period available',
        noFavouritesSlotAvailable   : 'No favourites',

        // Tabbar.
        tabbarFavouritesTitle       : 'Favourites',
        tabbarHomeTitle             : 'Home',
        tabbarPortfolios            : 'Portfolios',
        tabbarAnalysis              : 'Analysis',
        tabbarTimePeriods           : 'Time Periods',
        tabbarInfos                 : 'Infos',
        tabbarMore                  : 'More',
        tabbarSettings              : 'Settings'

    }

    return en_US;
});