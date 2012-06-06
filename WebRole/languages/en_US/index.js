// ==================================================== //
// Revolution Mobile App Localization File              //
// ==================================================== //

// Overview:    Contains definitions for localizable text properties in all scripts.
// Culture:     "en_US" (English, United States)

// ------------------------------------------
// CLIENT SIDE DEFINITIONS
// ------------------------------------------

exports.client = {
    hello: 'hello',

    // ------------------------------------------------------------------ | S |

    shared: {
        decimalSymbol               : '.',
        groupingSymbol              : ','
    }, 

    spinningWheel: {
        noPortfolioSlotAvailable    : 'No portfolio available',
        noAnalysisSlotAvailable     : 'No analysis available',
        noTimePeriodSlotAvailable   : 'No time period available',
        noFavouritesSlotAvailable   : 'No favourites'
    },

    // ------------------------------------------------------------------ | T |
    
    tabbar: {
        favourites                  : 'Favourites',
        home                        : 'Home',
        portfolios                  : 'Portfolios',
        analysis                    : 'Analysis',
        timePeriods                 : 'Time Periods',
        infos                       : 'Infos',
        more                        : 'More',
        settings                    : 'Settings'
    },

    chart: {
        performanceBarTitle                 : 'Bar Chart Segment Return',
        riskBarTitle                        : 'Bar Chart Weight Vs Contrib to VaR',
        allocationbarTitle                  : 'Bar Chart of Relative Weight',
        contributionBarTitle                : 'Bar Chart of Security Level Contribution',
        attributionBarTitle                 : 'Bar Chart of Relative Weight Vs Total Effects',
        fixedIncomeContributionBarTitle     : 'Fixed Income Contribution',
        carryContributionBarTitle           : 'Carry Contribution',
        yieldCurveContributionBarTitle      : 'Yield Curve Contribution',
        riskNumbersBarTitle                 : 'Risk Numbers',
        performanceBubbleTitle              : 'Scatter Chart',
        riskBubbleTitle                     : 'Scatter of Portfolio Segment Return / VaR',
        contributionColumnTitle             : 'Column Chart of Portfolio Contribution Vs Benchmark Contribution',
        interestRatesExposureColumnTitle    : 'Interest Rates Exposure Column',
        creditSpreadsExposure_columnTitle   : 'Credit Spreads Exposure',
        dv01ExposureColumnTitle             : 'DV01 Exposure Column',
        attributionColumnTitle              : 'Column Chart of Attribution Effects',
        allocationPieTitle                  : 'Pie Chart of Portfolio Weight',
        contributionPieTitle                : 'Pie Chart - Heat Map. Portfolio Weight',
        riskPietitle                        : 'Pie Chart - Heat Map. Portfolio Absolute Weight',
        performanceGridTitle                : 'Grid of Performance Stats',
        attributionGridTitle                : 'Grid of Total Level Attribution Effects',
        fixedIncomeGridTitle                : 'Fixed Income Grid',
        fixedIncomeContributionGridTitle    : 'Fixed Income Contribution Grid',
        fixedIncomeExposureGridTitle        : 'Fixed Income Exposure Grid',
        performanceTopTenGridTitle          : 'Grid of Top 10 Securities by Weight',
        contributionTopTenGridTitle         : 'Grid of Top 5 Bottom 5 Securities By Contribution',
        riskTopTenGridTitle                 : 'Grid of Top 10 Securities by Risk Weight',
        performanceTreemapTitle             : 'Tree Map Portfolio Weight vs Return',
        riskTreemapTitle                    : 'Tree Map Individual Security Weight VaR',
        performanceLineTitle                : 'Performance Line'
    },

    // -------------------------- | END OF FILE | -------------------------- \\
    //                     A way to avoid missing comma                      \\

    eof                             : 'Goodbye'
};

// ------------------------------------------
// SERVER SIDE DEFINITIONS
// ------------------------------------------

exports.server = {
    hello: 'hello',

    // ------------------------------------------------------------------ | A |
    
    analysisPage: {
        analysisText                : 'Analysis',
        backText                    : 'Back'
    },
    
    analysisSettingsPage: {
        settingsText                : 'Analysis Page',
        backText                    : 'Back'
    },

    analysisSettingsPages: {
        settingsText                : 'Analysis Pages',
        backText                    : 'Back'
    },

    // ------------------------------------------------------------------ | E |

    eulaPage: {
        eulaText                    : 'EULA',
        backText                    : 'Back'
    },

    // ------------------------------------------------------------------ | H |
    
    homePage: {
        logOutText                  : 'Log out',
        portfoliosText              : 'Portfolios',
        viewEulaText                : 'View EULA',
        testText                    : 'Test'
    },

    // ------------------------------------------------------------------ | L |

    loginPage: {
        loginText                   : 'Login',
        signUpText                  : 'Sign Up',
        supportText                 : 'Support',
        userNamePlaceholderText     : 'User Name',
        passwordPlaceholderText     : 'Password'
    },

    // ------------------------------------------------------------------ | M |

    measures: {
        adjustedsharpe              : 'Adjusted Sharpe',
        alpha                       : 'Alpha',
        annavetomaxloss             : 'Annualized Average:Max Loss',
        annualalpha                 : 'Annualized Alpha',
        bearbeta                    : 'Bear Beta',
        bearcaptureratio            : 'Bear-Market Capture Ratio',
        bearcorrelation             : 'Bear-Market Correlation',
        bearcovariance              : 'Bear-Market Covariance',
        bearmeanreturn              : 'Bear-Market Mean Return',
        beta                        : 'Beta',
        bpresenceflag               : 'Held for Full Period - Benchmark',
        bullbeta                    : 'Bull Beta',
        bullcaptureratio            : 'Bull-Market Capture Ratio',
        bullcorrelation             : 'Bull-Market Correlation',
        bullcovariance              : 'Bull-Market Covariance',
        bullmeanreturn              : 'Bull-Market Mean Return',
        calmar                      : 'Calmar',
        contributiones              : 'Contribution to Expected Shortfall',
        contributioneu              : 'Contribution to Expected Upside',
        contributionpu              : 'Contribution to Potential Upside',
        contributionvar             : 'Contribution to Value At Risk',
        contributionvolatility      : 'Contribution to Volatility',
        correlation                 : 'Correlation',
        covariance                  : 'Covariance',
        creditspreadsdown100        : 'Credit Spreads Down 100bps ([CUR])',
        creditspreadsdown100percent : 'Credit Spreads Down 100bps',
        creditspreadsdown50         : 'Credit Spreads Down 50bps ([CUR])',
        creditspreadsdown50percent  : 'Credit Spreads Down 50bps',
        creditspreadsdv01           : 'Credit Spreads DV01 ([CUR])',
        creditspreadsdv01percent    : 'Credit Spreads DV01',
        creditspreadsup100          : 'Credit Spreads Up 100bps ([CUR])',
        creditspreadsup100percent   : 'Credit Spreads Up 100bps',
        creditspreadsup50           : 'Credit Spreads Up 50bps ([CUR])',
        creditspreadsup50percent    : 'Credit Spreads Up 50bps',
        ctb                         : 'Contribution - Benchmark ([CUR])',
        ctbcur                      : 'Contribution Currency - Benchmark ([CUR])',
        ctblocal                    : 'Contribution - Benchmark (Local)',
        ctbreconcile                : 'Contribution - Benchmark Reconciliation ([CUR])',
        ctp                         : 'Contribution ([CUR])',
        ctpbutterfly                : 'Butterfly Contribution',
        ctpcarry                    : 'Carry Contribution',
        ctpcashflow                 : 'Cashflow Contribution ([CUR])',
        ctpcur                      : 'Contribution Currency ([CUR])',
        ctplocal                    : 'Contribution (Local)',
        ctpother                    : 'Other Contribution ',
        ctpresidual                 : 'Residual Contribution',
        ctprolldown                 : 'Roll-Down Contribution',
        ctpshift                    : 'Shift Contribution',
        ctpspeccarry                : 'Specific Carry Contribution',
        ctpspread                   : 'Spread Contribution',
        ctpsystcarry                : 'Systematic Carry Contribution',
        ctptrading                  : 'TradingContribution ([CUR])',
        ctptwist                    : 'Twist Contribution',
        ctpyc                       : 'Yield Curve Contribution',
        diversificationgrade        : 'Diversification Grade',
        downsiderisk                : 'Down Side Risk',
        downsideriskannualised      : 'Annualized Down Side Risk',
        durwpend                    : 'Duration Weight End',
        durwpstart                  : 'Duration Weight Start',
        ealloc                      : 'Effect Market Allocation',
        eallocc                     : 'Effect Currency Allocation ([CUR])',
        ealloclocal                 : 'Effect Market Allocation (Local)',
        ecompoundc                  : 'Effect Currency Compounding  ([CUR])',
        egalloc                     : 'Effect Market Allocation (Geometric)',
        egallocc                    : 'Effect Currency Allocation (Geometric) ([CUR])',
        egalloclocal                : 'Effect Market Allocation (Geometric) (Local)',
        egcompoundc                 : 'Effect Currency Compounding (Geometric) ([CUR])',
        egselec                     : 'Effect Selection (Geometric)',
        egseleclocal                : 'Effect Selection (Geometric) (Local)',
        egtimingc                   : 'Effect Currency Timing (Geometric) ([CUR])',
        egtotal                     : 'Effect Total Attribution (Geometric) ([CUR])',
        egtotalc                    : 'Effect Total Currency (Geometric) ([CUR])',
        egtotallocal                : 'Effect Total Market (Geometric) (Local)',
        egtotalmca                  : 'Effect Total Attribution (Geometric) ([CUR])',
        einter                      : 'Effect Interaction',
        einterlocal                 : 'Effect Interaction (Local)',
        eselec                      : 'Effect Selection',
        eselecinter                 : 'Effect Selection (Incl. Interaction)',
        eselecinterlocal            : 'Effect Selection (Incl. Interaction) (Local)',
        eseleclocal                 : 'Effect Selection (Local)',
        etimingc                    : 'Effect Currency Timing ([CUR])',
        etotal                      : 'Effects Total Attribution ([CUR])',
        etotalc                     : 'Effect Total Currency ([CUR])',
        etotallocal                 : 'Effect Total Market (Local)',
        etotalmca                   : 'Effects Total Attribution ([CUR])',
        expectedshortfall           : 'Expected Shortfall ([CUR])',
        expectedshortfallpercent    : '% Expected Shortfall',
        expectedupside              : 'Expected Upside ([CUR])',
        expectedupsidepercent       : '% Expected Upside',
        expectedvolatility          : 'Expected Volatility ([CUR])',
        expectedvolatilitypercent   : '% Expected Volatility',
        expostconditionalsharpe     : 'Ex-Post Conditional Sharpe',
        expostexpectedshortfall     : 'Ex-Post Expected Shortfall',
        expostexpectedshortfallrel  : 'Ex-Post Relative Expected Shortfall',
        expostvar                   : 'Ex-Post VaR',
        expostvarrel                : 'Ex-Post Relative VaR',
        fromdate                    : 'From Date',
        gainstolosses               : 'Gains:Losses',
        gainstolossesgeometric      : 'Gains:Losses (Geometric)',
        grossexposureend            : 'Gross Exposure at End ([CUR])',
        grossexposurestart          : 'Gross Exposure at Start ([CUR])',
        indexedreturnatend          : 'Indexed Return at End',
        indexedreturnatstart        : 'Indexed Return at Start',
        inflationratesdown50        : 'Inflation Rates Down 50bps ([CUR])',
        inflationratesdown50percent : 'Inflation Rates Down 50bps',
        inflationratesdv01          : 'Inflation Rates DV01 ([CUR])',
        inflationratesdv01percent   : 'Inflation Rates DV01',
        inflationratesup50          : 'Inflation Rates Up 50bps ([CUR])',
        inflationratesup50percent   : 'Inflation Rates Up 50bps',
        inforatiorel                : 'Information Ratio (Geometric)',
        inforatioxs                 : 'Information Ratio',
        interestratesdown100        : 'Interest Rates Down 100bps ([CUR])',
        interestratesdown100percent : 'Interest Rates Down 100bps',
        interestratesdown50         : 'Interest Rates Down 50bps ([CUR])',
        interestratesdown50percent  : 'Interest Rates Down 50bps',
        interestratesdv01           : 'Interest Rates DV01 ([CUR])',
        interestratesdv01percent    : 'Interest Rates DV01',
        interestratesup100          : 'Interest Rates Up 100bps ([CUR])',
        interestratesup100percent   : 'Interest Rates Up 100bps',
        interestratesup50           : 'Interest Rates Up 50bps ([CUR])',
        interestratesup50percent    : 'Interest Rates Up 50bps',
        jensensalpha                : 'Jensens Alpha',
        kurtosis                    : 'Kurtosis',
        leverage                    : 'Leverage Mean',
        leveragebeg                 : 'Leverage at Start',
        leverageend                 : 'Leverage at End',
        longexposureend             : 'Long Exposure at End ([CUR])',
        longexposurestart           : 'Long Exposure at Start ([CUR])',
        marginales                  : 'Marginal Expected Shortfall',
        marginaleu                  : 'Marginal Expected Upside',
        marginalpu                  : 'Marginal Potential Upside',
        marginalvar                 : 'Marginal Value At Risk',
        marginalvolatility          : 'Marginal Volatility',
        marketvaluecomputableassets : 'Market Value Computable Assets ([CUR])',
        maxloss                     : 'Maximum Loss',
        maxlossrel                  : 'Maximum Loss, Relative',
        mdpend                      : 'Modified Duration End',
        mdpstart                    : 'Modified Duration Start',
        msquared                    : 'M-Squared',
        msquaredann                 : 'M-Squared',
        msquaredexcessann           : 'M-Squared Excess',
        mvend                       : 'Market Value at End ([CUR])',
        mvstart                     : 'Market Value at Start ([CUR])',
        netexposureend              : 'Net Exposure at End ([CUR])',
        netexposurestart            : 'Net Exposure at Start ([CUR])',
        numberofsubperiods          : 'Number of [SUBPERIODS]',
        oneperiodhigh               : 'Highest [SUBPERIOD] Return',
        oneperiodlow                : 'Lowest [SUBPERIOD] Return',
        outstanding                 : 'Market Value ([CUR])',
        pandl                       : 'Profit and Loss ([CUR])',
        percentnegativeperiods      : '% Negative [SUBPERIODS]',
        percentnegativeperiodsrel   : 'Excess % of Negative [SUBPERIODS]',
        percentpositiveperiods      : '% Positive [SUBPERIODS]',
        percentpositiveperiodsrel   : 'Excess % of Positive [SUBPERIODS]',
        periodaverage               : '[SUBPERIOD] Return',
        periodinforatiorel          : '[SUBPERIOD] Information Ratio (Geometric)',
        periodinforatioxs           : '[SUBPERIOD] Information Ratio',
        periodname                  : 'Period Name',
        periodsharpe                : '[SUBPERIOD] Sharpe Ratio',
        periodsharpegeo             : '[SUBPERIOD] Sharpe Ratio (Geometric)',
        periodtrackerrrel           : '[SUBPERIOD] Tracking Error (Geometric)',
        periodtrackerrxs            : '[SUBPERIOD] Tracking Error',
        periodtreynor               : '[SUBPERIOD] Treynor Ratio',
        potentialupside             : 'Potential Upside ([CUR])',
        potentialupsidepercent      : '% Potential Upside',
        ppresenceflag               : 'Held for Full Period',
        rb                          : 'Return - Benchmark ([CUR])',
        rbcur                       : 'Return Currency - Benchmark ([CUR])',
        rblocal                     : 'Return - Benchmark (Local)',
        recoveryperiod              : 'Recovery Days after Max Loss',
        recoveryperiodrel           : 'Recovery Days after Max Relative Loss',
        rel1periodhigh              : 'Highest [SUBPERIOD] Relative Return',
        rel1periodlow               : 'Lowest [SUBPERIOD] Relative Return',
        relannualaverage            : 'Annualized Relative Return',
        relperiodaverage            : 'Relative Return ([SUBPERIOD] Average)',
        relr                        : 'Relative Return ([CUR])',
        relreturnannifgtyr          : 'Relative Return (Annualized if > 1 Year)',
        relrgeom                    : 'Relative Return (Geometric) ([CUR])',
        relrgeomlocal               : 'Relative Return (Geometric) (Local)',
        relrlocal                   : 'Relative Return (Local)',
        returnann                   : 'Annualized [SUBPERIOD] Return',
        returnannifgtyr             : 'Return (Annualized if > 1 Year)',
        riskfreereturnann           : 'Annualized Risk Free Return',
        riskfreereturnout           : 'Risk Free Return',
        riskfreereturnperiod        : '[SUBPERIOD] Risk Free Return',
        riskweight                  : 'Risk Weight',
        rp                          : 'Return ([CUR])',
        rpbutterfly                 : 'Butterfly Return',
        rpcarry                     : 'Carry Return',
        rpcur                       : 'Return Currency ([CUR])',
        rplocal                     : 'Return (Local)',
        rpother                     : 'Other Return',
        rpresidual                  : 'Residual Return',
        rprolldown                  : 'Roll-Down Return',
        rpshift                     : 'Shift Return',
        rpspeccarry                 : 'Specific Carry Return',
        rpspread                    : 'Spread Return',
        rpsystcarry                 : 'Systematic Carry Return',
        rptwist                     : 'Twist Return',
        rpyc                        : 'Yield Curve Return',
        rsquared                    : 'R-Squared',
        segmentname                 : 'Segment Name',
        sharperatio                 : 'Sharpe Ratio',
        sharperatiogeo              : 'Sharpe Ratio (Geometric)',
        shortexposureend            : 'Short Exposure at End ([CUR])',
        shortexposurestart          : 'Short Exposure at Start ([CUR])',
        skewness                    : 'Skewness',
        sortinoratio                : '[SUBPERIOD] Sortino Ratio',
        sortinoratioannualised      : 'Sortino Ratio',
        spreadpend                  : 'Spread End',
        spreadpstart                : 'Spread Start',
        standarderror               : 'Standard Error',
        stddevann                   : 'Annualized Volatility',
        stddevperiod                : '[SUBPERIOD] Volatility',
        stresstest10cash            : 'Stress Test 10 - Cash',
        stresstest10percent         : 'Stress Test 10 - Percent',
        stresstest1cash             : 'Stress Test 1 - Cash',
        stresstest1percent          : 'Stress Test 1 - Percent',
        stresstest2cash             : 'Stress Test 2 - Cash',
        stresstest2percent          : 'Stress Test 2 - Percent',
        stresstest3cash             : 'Stress Test 3 - Cash',
        stresstest3percent          : 'Stress Test 3 - Percent',
        stresstest4cash             : 'Stress Test 4 - Cash',
        stresstest4percent          : 'Stress Test 4 - Percent',
        stresstest5cash             : 'Stress Test 5 - Cash',
        stresstest5percent          : 'Stress Test 5 - Percent',
        stresstest6cash             : 'Stress Test 6 - Cash',
        stresstest6percent          : 'Stress Test 6 - Percent',
        stresstest7cash             : 'Stress Test 7 - Cash',
        stresstest7percent          : 'Stress Test 7 - Percent',
        stresstest8cash             : 'Stress Test 8 - Cash',
        stresstest8percent          : 'Stress Test 8 - Percent',
        stresstest9cash             : 'Stress Test 9 - Cash',
        stresstest9percent          : 'Stress Test 9 - Percent',
        testedbeta                  : 'Beta (Tested)',
        testedcorrelation           : 'Correlation (Tested)',
        todate                      : 'To Date',
        trackingerrorrel            : 'Tracking Error',
        trackingerrorxs             : 'Tracking Error',
        treynorratio                : 'Treynor Ratio',
        tstatbeta2                  : 'T-stat (Beta-2)',
        tstatcorrel2                : 'T-stat (Correlation-2)',
        ttmpend                     : 'Time to Maturity End',
        ttmpstart                   : 'Time to Maturity Start',
        valueatrisk                 : 'Value At Risk ([CUR])',
        valueatriskpercent          : '% Value At Risk',
        variance                    : 'Variance',
        wb                          : 'Weight Mean - Benchmark',
        wbbeg                       : 'Weight at Start - Benchmark',
        wbegover                    : 'Excess Weight at Start',
        wbend                       : 'Weight at End - Benchmark',
        wendover                    : 'Excess Weight at End',
        wover                       : 'Excess Weight Mean',
        wp                          : 'Weight Mean',
        wpabsolute                  : 'Absolute Weight Mean',
        wpabsolutebeg               : 'Absolute Weight at Start',
        wpabsoluteend               : 'Absolute Weight at End',
        wpbeg                       : 'Weight at Start',
        wpend                       : 'Weight at End',
        wpgross                     : 'Gross Weight Mean',
        wpgrossbeg                  : 'Gross Weight at Start',
        wpgrossend                  : 'Gross Weight at End',
        xs1periodhigh               : 'Highest [SUBPERIOD] Relative Return',
        xs1periodlow                : 'Lowest [SUBPERIOD] Relative Return',
        xsannualaverage             : 'Annualized Relative Return',
        xsperiodaverage             : 'Relative [SUBPERIOD] Return',
        xsreturnannifgtyr           : 'Relative Return (Annualized if > 1 Year)',
        ytmpend                     : 'Yield to Maturity End',
        ytmpstart                   : 'Yield to Maturity Start'
    },

    // ------------------------------------------------------------------ | P |

    portfoliosAnalysisPage: {
        portfoliosAnalysisText      : 'Portfolios Analysis',
        backText                    : 'Back'
    },

    portfoliosPage: {
        portfoliosText              : 'Portfolios',
        backText                    : 'Back'
    },

    // ------------------------------------------------------------------ | S |

    settingsPage: {
        settingsText                : 'Settings',
        backText                    : 'Back'
    },

    shared: {
        Monthly                     : 'Monthly',
        Weekly                      : 'Weekly',
        Quarterly                   : 'Quarterly'
    },

    // -------------------------- | END OF FILE | -------------------------- \\
    //                     A way to avoid missing comma                      \\

    eof                             : 'Goodbye'
};