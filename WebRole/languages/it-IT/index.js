// ==================================================== //
// Revolution Mobile App Localization File              //
// ==================================================== //

// Overview:    Contains definitions for localizable text properties in all scripts.
// Culture:     "it_IT" (Italiano, Italiano)

// ------------------------------------------
// CLIENT SIDE DEFINITIONS
// ------------------------------------------

exports.client = {
    hello: 'Ciao',

    // CultureInfo object from the date.js source for the it-IT culture.
    cultureInfo: {
        name: "it-IT",
        englishName: "Italian (Italy)",
        nativeName: "italiano (Italia)",
        dayNames: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
        abbreviatedDayNames: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
        shortestDayNames: ["do", "lu", "ma", "me", "gi", "ve", "sa"],
        firstLetterDayNames: ["d", "l", "m", "m", "g", "v", "s"],
        monthNames: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
        abbreviatedMonthNames: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
        amDesignator: "",
        pmDesignator: "",
        firstDayOfWeek: 1,
        twoDigitYearMax: 2029,
        dateElementOrder: "dmy",
        formatPatterns: {
            shortDate: "dd/MM/yyyy",
            longDate: "dddd d MMMM yyyy",
            shortTime: "H.mm",
            longTime: "H.mm.ss",
            fullDateTime: "dddd d MMMM yyyy H.mm.ss",
            sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
            universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
            rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
            monthDay: "dd MMMM",
            yearMonth: "MMMM yyyy"
        },
        regexPatterns: {
            jan: /^gen(naio)?/i,
            feb: /^feb(braio)?/i,
            mar: /^mar(zo)?/i,
            apr: /^apr(ile)?/i,
            may: /^mag(gio)?/i,
            jun: /^giu(gno)?/i,
            jul: /^lug(lio)?/i,
            aug: /^ago(sto)?/i,
            sep: /^set(tembre)?/i,
            oct: /^ott(obre)?/i,
            nov: /^nov(embre)?/i,
            dec: /^dic(embre)?/i,
            sun: /^do(m(enica)?)?/i,
            mon: /^lu(n(edì)?)?/i,
            tue: /^ma(r(tedì)?)?/i,
            wed: /^me(r(coledì)?)?/i,
            thu: /^gi(o(vedì)?)?/i,
            fri: /^ve(n(erdì)?)?/i,
            sat: /^sa(b(ato)?)?/i,
            future: /^next/i,
            past: /^last|past|prev(ious)?/i,
            add: /^(\+|after|from)/i,
            subtract: /^(\-|before|ago)/i,
            yesterday: /^yesterday/i,
            today: /^t(oday)?/i,
            tomorrow: /^tomorrow/i,
            now: /^n(ow)?/i,
            millisecond: /^ms|milli(second)?s?/i,
            second: /^sec(ond)?s?/i,
            minute: /^min(ute)?s?/i,
            hour: /^h(ou)?rs?/i,
            week: /^w(ee)?k/i,
            month: /^m(o(nth)?s?)?/i,
            day: /^d(ays?)?/i,
            year: /^y((ea)?rs?)?/i,
            shortMeridian: /^(a|p)/i,
            longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
            timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,
            ordinalSuffix: /^\s*(st|nd|rd|th)/i,
            timeContext: /^\s*(\:|a|p)/i
        },
        abbreviatedTimeZoneStandard: {
            GMT: "-000",
            EST: "-0400",
            CST: "-0500",
            MST: "-0600",
            PST: "-0700"
        },
        abbreviatedTimeZoneDST: {
            GMT: "-000",
            EDT: "-0500",
            CDT: "-0600",
            MDT: "-0700",
            PDT: "-0800"
        }
    },

    // ------------------------------------------------------------------ | C |

    chart: {
        performanceBarTitle                 : 'Segment Return',
        riskBarTitle                        : 'Weight vs. Contribution to VaR',
        allocationbarTitle                  : 'Relative Weight',
        contributionBarTitle                : 'Security Level Contribution',
        attributionBarTitle                 : 'Relative Weight vs. Total Effects',
        fixedIncomeContributionBarTitle     : 'Fixed Income Contribution',
        carryContributionBarTitle           : 'Carry Contribution',
        yieldCurveContributionBarTitle      : 'Yield Curve Contribution',
        riskNumbersBarTitle                 : 'Risk Numbers',
        performanceBubbleTitle              : 'Portfolio Return vs. Volatility',
        riskBubbleTitle                     : 'Portfolio Return vs. VaR',
        contributionColumnTitle             : 'Portfolio Contribution vs. Benchmark Contribution',
        interestRatesExposureColumnTitle    : 'Interest Rates Exposure',
        creditSpreadsExposureColumnTitle    : 'Credit Spreads Exposure',
        dv01ExposureColumnTitle             : 'DV01 Exposure',
        attributionColumnTitle              : 'Attribution Effects',
        allocationPieTitle                  : 'Portfolio Weight',
        contributionPieTitle                : 'Portfolio Weight vs. Contribution to Return',
        riskPietitle                        : 'Portfolio Weight vs. Contribution to VaR',
        performanceGridTitle                : 'Performance Statistics',
        attributionGridTitle                : 'Total Level Attribution Effects',
        fixedIncomeGridTitle                : 'Fixed Income Statistics',
        fixedIncomeContributionGridTitle    : 'Fixed Income Contribution',
        fixedIncomeExposureGridTitle        : 'Fixed Income Exposure',
        performanceTopTenGridTitle          : 'Top 10 Securities by Weight',
        contributionTopTenGridTitle         : 'Top 5 / Bottom 5 Securities by Contribution',
        riskTopTenGridTitle                 : 'Top 10 Securities by Risk Weight',
        performanceTreemapTitle             : 'Portfolio Weight vs. Return',
        riskTreemapTitle                    : 'Individual Security Weight vs. VaR',
        performanceLineTitle                : 'Return Over Period',
        fixedIncomeContributionsGroupTitle  : 'Fixed Income Contributions',
        fixedIncomeExposuresGroupTitle      : 'Fixed Income Exposures',
        fixedIncomeRiskNumbersGroupTitle    : 'Fixed Income Risk Numbers'
    },

    chartTypes: {
        AreaChart                           : 'Area',
        BarChart                            : 'Bar',
        BubbleChart                         : 'Bubble',
        ColumnChart                         : 'Column',
        Group                               : 'Group',
        LineChart                           : 'Line',
        PieChart                            : 'Pie',
        ScatterChart                        : 'Scatter',
        SteppedAreaChart                    : 'Stepped Area',
        Table                               : 'Grid',
        TreeMap                             : 'Heatmap'
    },

    chartTexts: {
        addNewPage                          : 'Aggiungi...'
    },

    // ------------------------------------------------------------------ | E |

    errors: {
        chartFailedText                     : 'Impossibile caricare il grafico.',
        accountEmptyText                    : 'Nessun portfolio presente.',
        portfolioNotFoundText               : 'Il portfolio richiesto non è stato trovato.',
        analysisFailedText                  : 'Impossibile recuperare l\'analisi del portfolio richiesta.'
    },

    // ------------------------------------------------------------------ | S |

    shared: {
        decimalSymbol               : ',',
        groupingSymbol              : '.'
    }, 

    spinningWheel: {
        noPortfolioSlotAvailable    : 'Nessun portfolio disponibile.',
        noAnalysisSlotAvailable     : 'Nessuna analisi disponibile.',
        noTimePeriodSlotAvailable   : 'Nessun periodo disponibile.',
        noFavouritesSlotAvailable   : 'Nessun preferito'
    },

    // ------------------------------------------------------------------ | T |
    
    tabbar: {
        favourites                  : 'Preferiti',
        home                        : 'Home',
        portfolios                  : 'Portfolio',
        analysis                    : 'Analisi',
        timePeriods                 : 'Periodi',
        infos                       : 'Info',
        more                        : 'Di piú',
        settings                    : 'Impostazioni'
    },

    // -------------------------- | END OF FILE | -------------------------- \\
    //                     A way to avoid missing comma                      \\

    eof                             : 'Arrivederci'
};

// ------------------------------------------
// SERVER SIDE DEFINITIONS
// ------------------------------------------

exports.server = {
    hello: 'Ciao',

    // ------------------------------------------------------------------ | A |
    
    aboutPage: {
        aboutText                   : 'Informazioni su',
        githubText                  : 'Fork our app repository on <a href="https://github.com/statprorevolution/revappdev">github</a>.',
        mobileText                  : 'StatPro Revolution Mobile',
        openSourceText              : 'This project is made possible by open source software.',
        poweredText                 : 'Powered by the StatPro Revolution Web API.'
    },

    analysisPage: {
        analysisText                : 'Analisi',
        endDate                     : 'Fine Data',
        startDate                   : 'Inizio Data'  
    },
    
    // ------------------------------------------------------------------ | E |

    errorPage: {
        errorText                   : 'Errori'
    },

    errors: {
        unknownErrorText            : 'Si è verificato un errore sconosciuto.',
        invalidCredentialsText      : 'Nome utente o password incorretti.'
    },

    eulaPage: {
        eulaText                    : 'EULA'
    },

    // ------------------------------------------------------------------ | H |
    
    homePage: {
        logOutText                  : 'Esci',
        portfoliosText              : 'Portfolio',
        viewEulaText                : 'Vedi EULA',
        testText                    : 'Test'
    },

    // ------------------------------------------------------------------ | L |

    languageSettingsPage: {
        settingsText                : 'Lingua'
    },

    loginPage: {
        loginText                   : 'Accedi',
        signUpText                  : 'Sottoscrivi',
        supportText                 : 'Supporto',
        userNamePlaceholderText     : 'Nome Utente',
        passwordPlaceholderText     : 'Password'
    },

    // ------------------------------------------------------------------ | M |

    measures: {
        adjustedsharpe              : 'Adjusted Sharpe',
        alpha                       : 'Alpha',
        annavetomaxloss             : 'Media ann.: Perdita massima',
        annualalpha                 : 'Alpha annuale',
        bearbeta                    : 'Beta Bear',
        bearcaptureratio            : 'Bear Capture Ratio',
        bearcorrelation             : 'Correlazione Bear',
        bearcovariance              : 'Bear Covarianza',
        bearmeanreturn              : 'Bear Mean Return',
        beta                        : 'Beta',
        bpresenceflag               : 'Held for Full Period - Benchmark',
        bullbeta                    : 'Beta Bull',
        bullcaptureratio            : 'Bull Capture Ratio',
        bullcorrelation             : 'Correlazione Bull',
        bullcovariance              : 'Bull Covarianza',
        bullmeanreturn              : 'Bull Mean Return',
        calmar                      : 'Calmar',
        contributiones              : 'Contribution to Expected Shortfall',
        contributioneu              : 'Contribution to Expected Upside',
        contributionpu              : 'Contribution to Potential Upside',
        contributionvar             : 'Contribution al VaR',
        contributionvolatility      : 'Contribution to Volatility',
        correlation                 : 'Correlazione',
        covariance                  : 'Covarianza',
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
        ctp                         : 'Contributo ([CUR])',
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
        diversificationgrade        : 'Grado di Diversificazione',
        downsiderisk                : 'Rischio di ribasso',
        downsideriskannualised      : 'Rischio annuo di ribasso',
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
        expectedvolatility          : 'Volatilità Attesa ([CUR])',
        expectedvolatilitypercent   : '% Volatilità Attesa',
        expostconditionalsharpe     : 'Ex-Post Conditional Sharpe',
        expostexpectedshortfall     : 'Ex-Post Expected Shortfall',
        expostexpectedshortfallrel  : 'Ex-Post Relative Expected Shortfall',
        expostvar                   : 'Ex-Post VaR',
        expostvarrel                : 'Ex-Post Relative VaR',
        fromdate                    : 'From Date',
        gainstolosses               : 'Guadagni: perdite',
        gainstolossesgeometric      : 'Guadagni: perdite (geometrica)',
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
        inforatiorel                : 'Rapporto info (geometrica)',
        inforatioxs                 : 'Rapporto info',
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
        jensensalpha                : 'Alpha Jensen',
        kurtosis                    : 'Kurtosis',
        leverage                    : 'Leverage Mean',
        leveragebeg                 : 'Leverage at Start',
        leverageend                 : 'Leverage at End',
        longexposureend             : 'Long Exposure at End ([CUR])',
        longexposurestart           : 'Long Exposure at Start ([CUR])',
        marginales                  : 'Marginal Expected Shortfall',
        marginaleu                  : 'Marginal Expected Upside',
        marginalpu                  : 'Marginal Potential Upside',
        marginalvar                 : 'Marginal VaR',
        marginalvolatility          : 'Marginal Volatility',
        marketvaluecomputableassets : 'Market Value Computable Assets ([CUR])',
        maxloss                     : 'Perdita massima',
        maxlossrel                  : 'Perdita massima relativa',
        mdpend                      : 'Modified Duration End',
        mdpstart                    : 'Modified Duration Start',
        msquared                    : 'M-Quadrato',
        msquaredann                 : 'M-Quadrato',
        msquaredexcessann           : 'M-Squared Excess',
        mvend                       : 'Market Value at End ([CUR])',
        mvstart                     : 'Market Value at Start ([CUR])',
        netexposureend              : 'Net Exposure at End ([CUR])',
        netexposurestart            : 'Net Exposure at Start ([CUR])',
        numberofsubperiods          : 'Number of [SUBPERIODS]',
        oneperiodhigh               : 'Highest [SUBPERIOD] Return',
        oneperiodlow                : 'Lowest [SUBPERIOD] Return',
        outstanding                 : 'Valore di mercato ([CUR])',
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
        relannualaverage            : 'Media annua rel.',
        relperiodaverage            : 'Relative Return ([SUBPERIOD] Average)',
        relr                        : 'Relative Return ([CUR])',
        relreturnannifgtyr          : 'Relative Return (Annualized if > 1 Year)',
        relrgeom                    : 'Relative Return (Geometric) ([CUR])',
        relrgeomlocal               : 'Relative Return (Geometric) (Local)',
        relrlocal                   : 'Relative Return (Local)',
        returnann                   : 'Annualized [SUBPERIOD] Return',
        returnannifgtyr             : 'Return (Annualized if > 1 Year)',
        riskfreereturnann           : 'Tasso medio senza rischio per periodo',
        riskfreereturnout           : 'Rendimento privo di rischio',
        riskfreereturnperiod        : '[SUBPERIOD] Risk Free Return',
        riskweight                  : 'Risk Weight',
        rp                          : 'Ritorno ([CUR])',
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
        rsquared                    : 'R-Quadrato',
        segmentname                 : 'Segmento',
        sharperatio                 : 'Rapporto Sharpe',
        sharperatiogeo              : 'Rapporto Sharpe (geometrica)',
        shortexposureend            : 'Short Exposure at End ([CUR])',
        shortexposurestart          : 'Short Exposure at Start ([CUR])',
        skewness                    : 'Skewness',
        sortinoratio                : '[SUBPERIOD] Sortino Ratio',
        sortinoratioannualised      : 'Rapporto Sortino',
        spreadpend                  : 'Spread End',
        spreadpstart                : 'Spread Start',
        standarderror               : 'Errore standard',
        stddevann                   : 'Volatilità annua',
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
        testedbeta                  : 'Beta testato',
        testedcorrelation           : 'Correlazione testata',
        todate                      : 'To Date',
        trackingerrorrel            : 'Errore di tracking',
        trackingerrorxs             : 'Errore di tracking',
        treynorratio                : 'Rapporto Treynor',
        tstatbeta2                  : 'T-stat (Beta-2)',
        tstatcorrel2                : 'T-stat (Correl.-2)',
        ttmpend                     : 'Time to Maturity End',
        ttmpstart                   : 'Time to Maturity Start',
        valueatrisk                 : 'VaR ([CUR])',
        valueatriskpercent          : '% VaR',
        variance                    : 'Varianza',
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
        xsannualaverage             : 'Media annua rel.',
        xsperiodaverage             : 'Relative [SUBPERIOD] Return',
        xsreturnannifgtyr           : 'Relative Return (Annualized if > 1 Year)',
        ytmpend                     : 'Yield to Maturity End',
        ytmpstart                   : 'Yield to Maturity Start'
    },

    // ------------------------------------------------------------------ | P |

    portfoliosAnalysisPage: {
        portfoliosAnalysisText      : 'Analisi Portfolio'
    },

    portfoliosPage: {
        portfoliosText              : 'Portfolio'
    },

    // ------------------------------------------------------------------ | S |

    settingsPages: {
        settingsText                : 'Impostazioni',
        applicationSettingsText     : 'Impostazioni Applicazione',
        userPreferencesText         : 'Preferenze Utente',
        languagesText               : 'Lingue',
        autoLoginText               : 'Accesso Automatico',
        licenseText                 : 'Licenza',
        themesText                  : 'Temi',
        reloadText                  : 'Ricarica Applicazione',
        analysisPageText            : 'Analisi',
        analysisPagesText           : 'Personalizza Analisi',
        userPageText                : 'Analisi Utente',
        userPagesText               : 'Analisi Utenti',
        defaultPagesText            : 'Analisi Predefinite',
        pageNameText                : 'Nome Pagina',
        saveText                    : 'Salva',
        resetText                   : 'Resetta',
        aboutText                   : 'Informazioni',
        resetCurrentSettingsText    : 'Resetta Settaggi Correnti',
        resetAllSettingsText        : 'Resetta Tutto'
    },

    shared: {
        backText                    : 'Indietro',
        statProText                 : 'StatPro International SARL',
        versionText                 : 'Versione',
        Monthly                     : 'Mensile',
        Weekly                      : 'Settimanale',
        Quarterly                   : 'Quadrimestrale'        
    },

    // -------------------------- | END OF FILE | -------------------------- \\
    //                     A way to avoid missing comma                      \\

    eof                             : 'Arrivederci'
};