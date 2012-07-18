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
        performanceBarTitle                 : 'Rendimento di Segmento',
        riskBarTitle                        : 'Peso vs. Contribuzione al VaR',
        allocationbarTitle                  : 'Peso Relativo',
        contributionBarTitle                : 'Contribuzione a Livello di Singolo Titolo',
        attributionBarTitle                 : 'Peso Relativo vs. Effetti Totali',
        fixedIncomeContributionBarTitle     : 'Contribuzione Fixed Income',
        carryContributionBarTitle           : 'Contribuzione di Carry',
        yieldCurveContributionBarTitle      : 'Contribuzione di Curva dei Tassi',
        riskNumbersBarTitle                 : 'Numeri di Rischio',
        performanceBubbleTitle              : 'Rendimento di Portafoglio vs. Volatilità',
        riskBubbleTitle                     : 'Rendimento di Portafoglio vs. VaR',
        contributionColumnTitle             : 'Contribuzione di Portafoglio vs. Contribuzione del Benchmark',
        interestRatesExposureColumnTitle    : 'Exposure ai Tassi d\'Interesse',
        creditSpreadsExposureColumnTitle    : 'Exposure ai Credit Spreads',
        dv01ExposureColumnTitle             : 'Exposure DV01',
        attributionColumnTitle              : 'Effetti di Attribuzione',
        allocationPieTitle                  : 'Peso di Portafoglio',
        contributionPieTitle                : 'Peso di Portafoglio vs. Contribuzione al Rendimento',
        riskPietitle                        : 'Peso di Portafoglio vs. Contribuzione al VaR',
        performanceGridTitle                : 'Statistiche di Performance',
        attributionGridTitle                : 'Effetti di Attribuzione Livello Totale',
        fixedIncomeGridTitle                : 'Statistiche di Fixed Income',
        fixedIncomeContributionGridTitle    : 'Contributi di Fixed Income',
        fixedIncomeExposureGridTitle        : 'Exposure di Fixed Income',
        performanceTopTenGridTitle          : 'Migliori 10 Titoli per Peso',
        contributionTopTenGridTitle         : 'Migliori 5 / Peggiori 5 Titoli per Contribuzione',
        riskTopTenGridTitle                 : 'Migliori 10 Titoli per Peso di Rischio',
        performanceTreemapTitle             : 'Peso di Portafoglio vs. Rendimento',
        riskTreemapTitle                    : 'Pesi dei Titoli Individuali vs. VaR',
        performanceLineTitle                : 'Rendimento di Periodo',
        fixedIncomeContributionsGroupTitle  : 'Contributi Fixed Income',
        fixedIncomeExposuresGroupTitle      : 'Exposures Fixed Income',
        fixedIncomeRiskNumbersGroupTitle    : 'Numeri di Rischio Fixed Income'
    },

    chartTypes: {
        AreaChart                           : 'Area',
        BarChart                            : 'Barra',
        BubbleChart                         : 'Bolla',
        ColumnChart                         : 'Colonna',
        Group                               : 'Gruppo',
        LineChart                           : 'Linea',
        PieChart                            : 'Torta',
        ScatterChart                        : 'Dispersione',
        SteppedAreaChart                    : 'Stepped Area',
        Table                               : 'Griglia',
        TreeMap                             : 'Mappa di Calore'
    },

    chartTexts: {
        addNewPage                          : 'Aggiungi...'
    },

    // ------------------------------------------------------------------ | E |

    errors: {
        chartFailedText                     : 'Impossibile caricare il grafico.',
        accountEmptyText                    : 'Nessun portafoglio presente.',
        portfolioNotFoundText               : 'Il portafoglio richiesto non è stato trovato.',
        analysisFailedText                  : 'Impossibile recuperare l\'analisi del portafoglio richiesto.'
    },

    // ------------------------------------------------------------------ | S |

    shared: {
        decimalSymbol               : ',',
        groupingSymbol              : '.'
    }, 

    spinningWheel: {
        noPortfolioSlotAvailable    : 'Nessun portafoglio disponibile.',
        noAnalysisSlotAvailable     : 'Nessuna analisi disponibile.',
        noTimePeriodSlotAvailable   : 'Nessun periodo disponibile.',
        noFavouritesSlotAvailable   : 'Nessun preferito',
        done                        : 'OK',
        cancel                      : 'Chiudi'
    },

    // ------------------------------------------------------------------ | T |
    
    tabbar: {
        favourites                  : 'Preferiti',
        home                        : 'Home',
        portfolios                  : 'Portafogli',
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
        endDate                     : 'Data di Fine',
        startDate                   : 'Data d\'Inizio'  
    },
    
    // ------------------------------------------------------------------ | E |

    errorPage: {
        errorText                   : 'Errore'
    },

    errors: {
        unknownErrorText            : 'Si è verificato un errore sconosciuto.',
        invalidCredentialsText      : 'Nome utente o password non corretti.'
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
        adjustedsharpe              : 'Sharpe Aggiustato',
        alpha                       : 'Alpha',
        annavetomaxloss             : 'Media Annualizzata: Perdita Massima',
        annualalpha                 : 'Alpha Annualizzato',
        bearbeta                    : 'Beta Bear',
        bearcaptureratio            : 'Bear-Market Capture Ratio',
        bearcorrelation             : 'Bear-Market Correlazione',
        bearcovariance              : 'Covarianza Bear-Market',
        bearmeanreturn              : 'Bear-Market Rendimento Medio',
        beta                        : 'Beta',
        bpresenceflag               : 'Tenuto Tutto il Periodo - Benchmark',
        bullbeta                    : 'Beta Bull',
        bullcaptureratio            : 'Bull-Market Capture Ratio',
        bullcorrelation             : 'Bull-Market Correlazione',
        bullcovariance              : 'Bull-Market Covarianza',
        bullmeanreturn              : 'Bull-Market Rendimento Medio',
        calmar                      : 'Indice di Calmar',
        contributiones              : 'Contribuzione all\'Expected Shortfall',
        contributioneu              : 'Contribuzione all\'Expected Upside',
        contributionpu              : 'Contribuzione al Potential Upside',
        contributionvar             : 'Contribuzione al VaR',
        contributionvolatility      : 'Contribuzione alla Volatilità',
        correlation                 : 'Correlazione',
        covariance                  : 'Covarianza',
        creditspreadsdown100        : 'Credit Spread giú di 100bps ([CUR])',
        creditspreadsdown100percent : 'Credit Spread giú di 100bps',
        creditspreadsdown50         : 'Credit Spread giú di 50bps ([CUR])',
        creditspreadsdown50percent  : 'Credit Spread giú di 50bps',
        creditspreadsdv01           : 'Credit Spread DV01 ([CUR])',
        creditspreadsdv01percent    : 'Credit Spread DV01',
        creditspreadsup100          : 'Credit Spread sú di 100bps ([CUR])',
        creditspreadsup100percent   : 'Credit Spread sú di 100bps',
        creditspreadsup50           : 'Credit Spread sú di 50bps ([CUR])',
        creditspreadsup50percent    : 'Credit Spread sú di 50bps',
        ctb                         : 'Contribuzione - Benchmark ([CUR])',
        ctbcur                      : 'Contribuzione di Currency - Benchmark',
        ctblocal                    : 'Contribuzione - Benchmark (Locale)',
        ctbreconcile                : 'Contribuzione - Benchmark Riconciliazione ([CUR])',
        ctp                         : 'Contribuzione ([CUR])',
        ctpbutterfly                : 'Contribuzione di Butterfly',
        ctpcarry                    : 'Contribuzione di Carry',
        ctpcashflow                 : 'Contribuzione di Cashflow ([CUR])',
        ctpcur                      : 'Contribuzione di Currency ([CUR])',
        ctplocal                    : 'Contribuzione (Locale)',
        ctpother                    : 'Altra Contribuzione',
        ctpresidual                 : 'Contribuzione Residuale',
        ctprolldown                 : 'Contribuzione di Roll-Down',
        ctpshift                    : 'Contribuzione di Shift',
        ctpspeccarry                : 'Contribuzione di Carry Specifico',
        ctpspread                   : 'Contribuzione di Spread',
        ctpsystcarry                : 'Contribuzione di Carry Sistematico',
        ctptrading                  : 'Contribuzione di Trading ([CUR])',
        ctptwist                    : 'Contribuzione di Twist',
        ctpyc                       : 'Contribuzione di Curva',
        diversificationgrade        : 'Grado di Diversificazione',
        downsiderisk                : 'Rischio di Downside',
        downsideriskannualised      : 'Rischio di Downside Annualizzato',
        durwpend                    : 'Peso di Duration - Fine',
        durwpstart                  : 'Peso di Duration - Inizio',
        ealloc                      : 'Effetto di Market Allocation',
        eallocc                     : 'Effetto di Currency Allocation ([CUR])',
        ealloclocal                 : 'Effetto di Market Allocation (Locale)',
        ecompoundc                  : 'Effetto di Currency Compounding ([CUR])',
        egalloc                     : 'Effetto di Market Allocation (Geometrico)',
        egallocc                    : 'Effetto di Currency Allocation (Geometrico) ([CUR])',
        egalloclocal                : 'Effetto di Market Allocation (Geometrico) (Local)',
        egcompoundc                 : 'Effetto di Currency Compounding (Geometrico) ([CUR])',
        egselec                     : 'Effetto di Selection (Geometrico)',
        egseleclocal                : 'Effetto di Selection (Geometrico) (Locale)',
        egtimingc                   : 'Effetto di Currency Timing (Geometrico) ([CUR])',
        egtotal                     : 'Effetto di Attribution Totale (Geometrico) ([CUR])',
        egtotalc                    : 'Effetto di Currency Totale (Geometrico) ([CUR])',
        egtotallocal                : 'Effetto di Mercato Totale (Geometrico) (Local)',
        egtotalmca                  : 'Effetto di  Attribution Totale (Geometrico) ([CUR])',
        einter                      : 'Effetto di Interaction',
        einterlocal                 : 'Effect di Interaction (Locale)',
        eselec                      : 'Effetto di Selection',
        eselecinter                 : 'Effetto di Selection (Incl. Interaction)',
        eselecinterlocal            : 'Effetto di Selection (Incl. Interaction) (Localw)',
        eseleclocal                 : 'Effetto di Selection (Locale)',
        etimingc                    : 'Effetto di Currency Timing ([CUR])',
        etotal                      : 'Effetti di Attribution Totale ([CUR])',
        etotalc                     : 'Effetti di Currency Totale ([CUR])',
        etotallocal                 : 'Effetti di Market Totale (Locale)',
        etotalmca                   : 'Effetti di Attribution Totale ([CUR])',
        expectedshortfall           : 'Expected Shortfall ([CUR])',
        expectedshortfallpercent    : 'Expected Shortfall %',
        expectedupside              : 'Expected Upside ([CUR])',
        expectedupsidepercent       : 'Expected Upside %',
        expectedvolatility          : 'Volatilità Attesa ([CUR])',
        expectedvolatilitypercent   : 'Volatilità Attesa %',
        expostconditionalsharpe     : 'Sharpe Condizionale Ex-Post',
        expostexpectedshortfall     : 'Expected Shortfall Ex-Post',
        expostexpectedshortfallrel  : 'Expected Shortfall Ex-Post Relativa',
        expostvar                   : 'VaR Ex-Post',
        expostvarrel                : 'VaR Ex-Post Relativo',
        fromdate                    : 'Da Data',
        gainstolosses               : 'Guadagni: Perdite',
        gainstolossesgeometric      : 'Guadagni: Perdite (Geometrico)',
        grossexposureend            : 'Exposure Lorda - Fine ([CUR])',
        grossexposurestart          : 'Exposure Lorda - Inizio ([CUR])',
        indexedreturnatend          : 'Rendimento Indicizzato - Fine',
        indexedreturnatstart        : 'Rendimento Indicizzato - Inizio',
        inflationratesdown50        : 'Tassi d\'Inflazione giú di 50bps ([CUR])',
        inflationratesdown50percent : 'Tassi d\'Inflazione giú di 50bps',
        inflationratesdv01          : 'DV01 Tassi d\'Inflazione ([CUR])',
        inflationratesdv01percent   : 'DV01 Tassi d\'Inflazione',
        inflationratesup50          : 'Tassi d\'Inflazione sú di 50bps ([CUR])',
        inflationratesup50percent   : 'Tassi d\'Inflazione sú di 50bps',
        inforatiorel                : 'Information Ratio (Geometrica)',
        inforatioxs                 : 'Information Ratio',
        interestratesdown100        : 'Tassi d\'Interesse giú di 100bps ([CUR])',
        interestratesdown100percent : 'Tassi d\'Interesse giú di 100bps',
        interestratesdown50         : 'Tassi d\'Interesse giú di 50bps ([CUR])',
        interestratesdown50percent  : 'Tassi d\'Interesse giú di 50bps',
        interestratesdv01           : 'DV01 Tassi d\'Interesse ([CUR])',
        interestratesdv01percent    : 'DV01 Tassi d\'Interesse',
        interestratesup100          : 'Tassi d\'Interesse sú di 100bps ([CUR])',
        interestratesup100percent   : 'Tassi d\'Interesse sú di 100bps',
        interestratesup50           : 'Tassi d\'Interesse sú di 50bps ([CUR])',
        interestratesup50percent    : 'Tassi d\'Interesse sú di 50bps',
        jensensalpha                : 'Alpha Jensen',
        kurtosis                    : 'Kurtosi',
        leverage                    : 'Leva - Media',
        leveragebeg                 : 'Leva - Inizio',
        leverageend                 : 'Leva - Fine',
        longexposureend             : 'Exposure Lunga - Fine ([CUR])',
        longexposurestart           : 'Exposure Lunga - Inizio ([CUR])',
        marginales                  : 'Expected Shortfall Marginale',
        marginaleu                  : 'Expected Upside Marginale',
        marginalpu                  : 'Potential Upside Marginale',
        marginalvar                 : 'VaR Marginale',
        marginalvolatility          : 'Volatilità Marginale',
        marketvaluecomputableassets : 'Market Value Computable Assets ([CUR])',
        maxloss                     : 'Perdita Massima',
        maxlossrel                  : 'Perdita Massima Relativa',
        mdpend                      : 'Modified Duration - Fine',
        mdpstart                    : 'Modified Duration - Inizio',
        msquared                    : 'M-Quadrato',
        msquaredann                 : 'M-Quadrato',
        msquaredexcessann           : 'M-Quadrato Eccesso',
        mvend                       : 'Market Value - Fine ([CUR])',
        mvstart                     : 'Market Value - Inizio ([CUR])',
        netexposureend              : 'Exposure Netta - Fine ([CUR])',
        netexposurestart            : 'Exposure Netta - Inizio ([CUR])',
        numberofsubperiods          : 'Numero di [SUBPERIODS]',
        oneperiodhigh               : 'Rendimento Maggiore [SUBPERIOD]',
        oneperiodlow                : 'Rendimento Minore [SUBPERIOD]',
        outstanding                 : 'Market Value ([CUR])',
        pandl                       : 'Profitti e Perdite ([CUR])',
        percentnegativeperiods      : '% Negativa [SUBPERIODS]',
        percentnegativeperiodsrel   : 'Eccesso % di [SUBPERIODS] Negativi',
        percentpositiveperiods      : '% Positiva [SUBPERIODS]',
        percentpositiveperiodsrel   : 'Eccesso % di [SUBPERIODS] Positivi',
        periodaverage               : 'Rendimento [SUBPERIOD]',
        periodinforatiorel          : 'Information Ratio (Geometrico) [SUBPERIOD]',
        periodinforatioxs           : 'Information Ratio [SUBPERIOD]',
        periodname                  : 'Nome di Periodo',
        periodsharpe                : 'Indice di Sharpe [SUBPERIOD]',
        periodsharpegeo             : 'Indice di Sharpe (Geometrico) [SUBPERIOD]',
        periodtrackerrrel           : 'Tracking Error (Geometrico) [SUBPERIOD]',
        periodtrackerrxs            : 'Tracking Error [SUBPERIOD]',
        periodtreynor               : 'Treynor Ratio [SUBPERIOD]',
        potentialupside             : 'Potential Upside ([CUR])',
        potentialupsidepercent      : 'Potential Upside %',
        ppresenceflag               : 'Tenuto Tutto il Periodo',
        rb                          : 'Rendimento - Benchmark ([CUR])',
        rbcur                       : 'Rendimento di Currency - Benchmark ([CUR])',
        rblocal                     : 'Rendimento - Benchmark (Locale)',
        recoveryperiod              : 'Giorni di Recupero dopo Perdita Massima',
        recoveryperiodrel           : 'Giorni di Recupero dopo Perdita Massima Relativa',
        rel1periodhigh              : 'Maggiore Rendimento Relativo [SUBPERIOD]',
        rel1periodlow               : 'Minore Rendimento Relativo [SUBPERIOD]',
        relannualaverage            : 'Rendimento Relativo Annualizzato',
        relperiodaverage            : 'Rendimento Relativo (Media [SUBPERIOD])',
        relr                        : 'Rendimento Relativo ([CUR])',
        relreturnannifgtyr          : 'Rendimento Relativo (Annualizzato se > 1 Anno)',
        relrgeom                    : 'Rendimento Relativo (Geometrico) ([CUR])',
        relrgeomlocal               : 'Rendimento Relativo (Geometrico) (Locale)',
        relrlocal                   : 'Rendimento Relativo (Locale)',
        returnann                   : 'Rendimento Annualizzato [SUBPERIOD]',
        returnannifgtyr             : 'Rendimento (Annualizzato se > 1 Anno)',
        riskfreereturnann           : 'Rendimento Risk-free Annualizzato',
        riskfreereturnout           : 'Rendimento Risk-free',
        riskfreereturnperiod        : 'Rendimento Risk-free [SUBPERIOD]',
        riskweight                  : 'Peso (Rischio)',
        rp                          : 'Rendimento ([CUR])',
        rpbutterfly                 : 'Rendimento di Butterfly',
        rpcarry                     : 'Rendimento di Carry',
        rpcur                       : 'Rendimento di Currency ([CUR])',
        rplocal                     : 'Rendimento (Locale)',
        rpother                     : 'Altro Rendimento',
        rpresidual                  : 'Rendimento Residuale',
        rprolldown                  : 'Rendimento di Roll-Down',
        rpshift                     : 'Rendimento di Shift',
        rpspeccarry                 : 'Rendimento di Carry Specifico',
        rpspread                    : 'Rendimento di Spread',
        rpsystcarry                 : 'Rendimento di Carry Sistematico',
        rptwist                     : 'Rendimento di Twist',
        rpyc                        : 'Rendimento di Curva',
        rsquared                    : 'R-Quadrato',
        segmentname                 : 'Nome di Segmento',
        sharperatio                 : 'Indice di Sharpe',
        sharperatiogeo              : 'Indice di Sharpe (Geometrico)',
        shortexposureend            : 'Exposure Corta - Fine ([CUR])',
        shortexposurestart          : 'Exposure Corta - Inizio ([CUR])',
        skewness                    : 'Skewness',
        sortinoratio                : 'Indice di Sortino [SUBPERIOD] ',
        sortinoratioannualised      : 'Indice di Sortino',
        spreadpend                  : 'Spread - Fine',
        spreadpstart                : 'Spread - Inizio',
        standarderror               : 'Errore Standard',
        stddevann                   : 'Volatilità Annualizzata',
        stddevperiod                : 'Volatilità [SUBPERIOD]',
        stresstest10cash            : 'Stress Test 10 - Cash',
        stresstest10percent         : 'Stress Test 10 - Percentuale',
        stresstest1cash             : 'Stress Test 1 - Cash',
        stresstest1percent          : 'Stress Test 1 - Percentuale',
        stresstest2cash             : 'Stress Test 2 - Cash',
        stresstest2percent          : 'Stress Test 2 - Percentuale',
        stresstest3cash             : 'Stress Test 3 - Cash',
        stresstest3percent          : 'Stress Test 3 - Percentuale',
        stresstest4cash             : 'Stress Test 4 - Cash',
        stresstest4percent          : 'Stress Test 4 - Percentuale',
        stresstest5cash             : 'Stress Test 5 - Cash',
        stresstest5percent          : 'Stress Test 5 - Percentuale',
        stresstest6cash             : 'Stress Test 6 - Cash',
        stresstest6percent          : 'Stress Test 6 - Percentuale',
        stresstest7cash             : 'Stress Test 7 - Cash',
        stresstest7percent          : 'Stress Test 7 - Percentuale',
        stresstest8cash             : 'Stress Test 8 - Cash',
        stresstest8percent          : 'Stress Test 8 - Percentuale',
        stresstest9cash             : 'Stress Test 9 - Cash',
        stresstest9percent          : 'Stress Test 9 - Percentuale',
        testedbeta                  : 'Beta (Testato)',
        testedcorrelation           : 'Correlazione (Testato)',
        todate                      : 'A Oggi',
        trackingerrorrel            : 'Tracking Error',
        trackingerrorxs             : 'Tracking Error',
        treynorratio                : 'Indice di Treynor',
        tstatbeta2                  : 'T-stat (Beta-2)',
        tstatcorrel2                : 'T-stat (Correl.-2)',
        ttmpend                     : 'Tempo a Scadenza - Fine',
        ttmpstart                   : 'Tempo a Scadenza - Inizio',
        valueatrisk                 : 'VaR ([CUR])',
        valueatriskpercent          : '% VaR',
        variance                    : 'Varianza',
        wb                          : 'Peso Medio - Benchmark',
        wbbeg                       : 'Peso Inizio - Benchmark',
        wbegover                    : 'Peso in Eccesso - Inizio',
        wbend                       : 'Peso Fine - Benchmark',
        wendover                    : 'Peso in Eccesso - Fine',
        wover                       : 'Peso in Eccesso - Medio',
        wp                          : 'Peso Medio',
        wpabsolute                  : 'Peso Assoluto - Medio',
        wpabsolutebeg               : 'Peso Assoluto - Inizio',
        wpabsoluteend               : 'Peso Assoluto - Fine',
        wpbeg                       : 'Peso - Inizio',
        wpend                       : 'Peso - Fine',
        wpgross                     : 'Peso Lordo - Medio',
        wpgrossbeg                  : 'Peso Lordo - Inizio',
        wpgrossend                  : 'Peso Lordo - Fine',
        xs1periodhigh               : 'Maggiore Rendimento Relativo [SUBPERIOD]',
        xs1periodlow                : 'Minore Rendimento Relativo [SUBPERIOD]',
        xsannualaverage             : 'Rendimento Relativo Annualizzato',
        xsperiodaverage             : 'Rendimento Relativo [SUBPERIOD]',
        xsreturnannifgtyr           : 'Rendimento Relativo (Annualizzato se > 1 Anno)',
        ytmpend                     : 'Rendimento a Scadenza - Fine',
        ytmpstart                   : 'Rendimento a Scadenza - Inizio'
    },

    // ------------------------------------------------------------------ | P |

    portfoliosAnalysisPage: {
        portfoliosAnalysisText      : 'Analisi di Portafoglio'
    },

    portfoliosPage: {
        portfoliosText              : 'Portafoglio'
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
        analysisPageText            : 'Pagina di Analisi',
        analysisPagesText           : 'Pagine di Analisi',
        userPageText                : 'Analisi Utente',
        userPagesText               : 'Analisi Utenti',
        defaultPagesText            : 'Analisi Predefinite',
        pageNameText                : 'Nome Pagina',
        saveText                    : 'Salva',
        resetText                   : 'Resetta',
        aboutText                   : 'Informazioni',
        resetCurrentSettingsText    : 'Resetta Impostazioni Correnti',
        resetAllSettingsText        : 'Resetta Tutto'
    },

    shared: {
        backText                    : 'Indietro',
        statProText                 : 'StatPro International SARL',
        versionText                 : 'Versione',
        Monthly                     : 'Mensile',
        Weekly                      : 'Settimanale',
        Quarterly                   : 'Trimestrale'        
    },

    // -------------------------- | END OF FILE | -------------------------- \\
    //                     A way to avoid missing comma                      \\

    eof                             : 'Arrivederci'
};