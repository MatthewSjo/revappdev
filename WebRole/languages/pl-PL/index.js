// ==================================================== //
// Revolution Mobile App Localization File              //
// ==================================================== //

// Overview:    Contains definitions for localizable text properties in all scripts.
// Culture:     "pl_PL" (Polski, Polska)

// ------------------------------------------
// CLIENT SIDE DEFINITIONS
// ------------------------------------------

exports.client = {
    hello: 'Ciao',

    // CultureInfo object from the date.js source for the it-IT culture.
    cultureInfo: {
        name: "pl-PL",
        englishName: "Polish (Poland)",
        nativeName: "polski (Polska)",
        dayNames: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"],
        abbreviatedDayNames: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
        shortestDayNames: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
        firstLetterDayNames: ["N", "P", "W", "Ś", "C", "P", "S"],
        monthNames: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
        abbreviatedMonthNames: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"],
        amDesignator: "",
        pmDesignator: "",
        firstDayOfWeek: 1,
        twoDigitYearMax: 2029,
        dateElementOrder: "ymd",
        formatPatterns: {
            shortDate: "yyyy-MM-dd",
            longDate: "d MMMM yyyy",
            shortTime: "HH:mm",
            longTime: "HH:mm:ss",
            fullDateTime: "d MMMM yyyy HH:mm:ss",
            sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
            universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
            rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
            monthDay: "d MMMM",
            yearMonth: "MMMM yyyy"
        },
        regexPatterns: {
            jan: /^sty(czeń)?/i,
            feb: /^lut(y)?/i,
            mar: /^mar(zec)?/i,
            apr: /^kwi(ecień)?/i,
            may: /^maj/i,
            jun: /^cze(rwiec)?/i,
            jul: /^lip(iec)?/i,
            aug: /^sie(rpień)?/i,
            sep: /^wrz(esień)?/i,
            oct: /^paź(dziernik)?/i,
            nov: /^lis(topad)?/i,
            dec: /^gru(dzień)?/i,
            sun: /^niedziela/i,
            mon: /^poniedziałek/i,
            tue: /^wtorek/i,
            wed: /^środa/i,
            thu: /^czwartek/i,
            fri: /^piątek/i,
            sat: /^sobota/i,
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
        performanceBarTitle                 : 'Stopa zwrotu danego segmentu',
        riskBarTitle                        : 'Waga a kontrybucja do wartości narażonej na ryzyko (VaR)',
        allocationbarTitle                  : 'Waga względna',
        contributionBarTitle                : 'Kontrybucja indywidualnych instrumentów',
        attributionBarTitle                 : 'Relatywna waga a efekty łączne',
        fixedIncomeContributionBarTitle     : 'Kontrybucja papierów dłużnych',
        carryContributionBarTitle           : 'Kontrybucja carry',
        yieldCurveContributionBarTitle      : 'Kontrybucja krzywej dochodowości',
        riskNumbersBarTitle                 : 'Ryzyko',
        performanceBubbleTitle              : 'Stopa zwrotu portfela a zmienność/nieprzewidywalność',
        riskBubbleTitle                     : 'Stopa zwrotu portfela a wartość narażona na ryzyko (VaR)',
        contributionColumnTitle             : 'Kontrybucja portfela a kontrybucja benchmarka',
        interestRatesExposureColumnTitle    : 'Narażenie na zmiany stop procentowych',
        creditSpreadsExposureColumnTitle    : 'Narażenie na zmiany spreadów kredytowych',
        dv01ExposureColumnTitle             : 'DV01',
        attributionColumnTitle              : 'Efekty atrybucji',
        allocationPieTitle                  : 'Waga portfela',
        contributionPieTitle                : 'Waga w portfelu a kontrybucja do stopy zwrotu',
        riskPietitle                        : 'Waga w portfelu a kontrybucja dowartości narażonej na ryzyko (VaR)',
        performanceGridTitle                : 'Wyniki',
        attributionGridTitle                : 'Łączne efekty atrybucji',
        fixedIncomeGridTitle                : 'Statystyki papierów dłużnych',
        fixedIncomeContributionGridTitle    : 'Kontrybucja papierów dłużnych',
        fixedIncomeExposureGridTitle        : 'Narażenie papierów dłużnych',
        performanceTopTenGridTitle          : '10 największych pozycji',
        contributionTopTenGridTitle         : '5 pozycji z największą/najmniejszą kontrybucją do stopy zwrotu',
        riskTopTenGridTitle                 : '10 pozycji z największą kontrybucją do ryzyka',
        performanceTreemapTitle             : 'Waga a stopa zwrotu',
        riskTreemapTitle                    : 'Waga indywidualnych pozycji a wartość narażona na ryzyko (VaR)',
        performanceLineTitle                : 'Stopa zwrotu w wybranym przedziale czasu',
        fixedIncomeContributionsGroupTitle  : 'Kontrybucje papierów dłużnych',
        fixedIncomeExposuresGroupTitle      : 'Narażenie papierów dłużnych',
        fixedIncomeRiskNumbersGroupTitle    : 'Wrażliwość papierów dłużnych'
    },

    chartTypes: {
        AreaChart                           : 'Wykres obszaru',
        BarChart                            : 'Wykres słupkowy',
        BubbleChart                         : 'Wykres bąbelkowy',
        ColumnChart                         : 'Wykres kolumnowy',
        Group                               : 'Grupa',
        LineChart                           : 'Wykres liniowy',
        PieChart                            : 'Wykres kołowy',
        ScatterChart                        : 'Wykres punktowy',
        SteppedAreaChart                    : 'Stepped Area',
        Table                               : 'Siatka',
        TreeMap                             : 'Mapa cieplna'
    },

    chartTexts: {
        addNewPage                          : 'Dodaj nową stronę'
    },

    // ------------------------------------------------------------------ | E |

    errors: {
        chartFailedText                     : 'Nie jestem w stanie otworzyć wykresu.',
        accountEmptyText                    : 'To konto nie zawiera żadnych portfeli.',
        portfolioNotFoundText               : 'Wybrany portfel nie został znaleziony.',
        analysisFailedText                  : 'Nie jestem w stanie załadować wybranego portfela.'
    },

    // ------------------------------------------------------------------ | S |

    shared: {
        decimalSymbol               : ',',
        groupingSymbol              : '.'
    }, 

    spinningWheel: {
        noPortfolioSlotAvailable    : 'Nie masz żadnych portfeli.',
        noAnalysisSlotAvailable     : 'Analizy nie są dostępne.',
        noTimePeriodSlotAvailable   : 'Żaden przedział czasu nie jest dostępny.',
        noFavouritesSlotAvailable   : 'Brak ulubionych',
        done                        : 'OK',
        cancel                      : 'Anuluj'
    },

    // ------------------------------------------------------------------ | T |
    
    tabbar: {
        favourites                  : 'Ulubione',
        home                        : 'Strona główna',
        portfolios                  : 'Portfele',
        analysis                    : 'Analizy nie są dostępne',
        timePeriods                 : 'Przedziały czasu',
        infos                       : 'Info',
        more                        : 'Więcej',
        settings                    : 'Ustawienia'
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
        aboutText                   : 'Informacja o produkcie',
        githubText                  : 'Fork our app repository on <a href="https://github.com/statprorevolution/revappdev">github</a>.',
        mobileText                  : 'StatPro Revolution Mobile',
        openSourceText              : 'This project is made possible by open source software.',
        poweredText                 : 'Powered by the StatPro Revolution Web API.'
    },

    analysisPage: {
        analysisText                : 'Analizy nie są dostępne',
        endDate                     : 'Od dnia',
        startDate                   : 'Do dnia'  
    },
    
    // ------------------------------------------------------------------ | E |

    errorPage: {
        errorText                   : 'Błąd'
    },

    errors: {
        unknownErrorText            : 'Wystąpił (niezidentyfikowany) błąd.',
        invalidCredentialsText      : 'Wprowadziłeś niepoprawny login lub hasło.'
    },

    eulaPage: {
        eulaText                    : 'Umowa licencyjna użytkownika końcowego (EULA)'
    },

    // ------------------------------------------------------------------ | H |
    
    homePage: {
        logOutText                  : 'Wylogowanie',
        portfoliosText              : 'Portfele',
        viewEulaText                : 'Otwórz umowę licencyjną użytkownika końcowego (EULA)',
        testText                    : 'Test'
    },

    // ------------------------------------------------------------------ | L |

    languageSettingsPage: {
        settingsText                : 'Języki'
    },

    loginPage: {
        loginText                   : 'Logowanie',
        signUpText                  : 'Zarejestruj się',
        supportText                 : 'Pomoc',
        userNamePlaceholderText     : 'Login',
        passwordPlaceholderText     : 'Hasło'
    },

    // ------------------------------------------------------------------ | M |

    measures: {
        adjustedsharpe              : 'Skorygowany wskaznik Sharpe\'a',
        alpha                       : 'Alfa',
        annavetomaxloss             : 'Zanualizowana srednia: Maksymalna strata',
        annualalpha                 : 'Zanualizowana alfa',
        bearbeta                    : 'Beta podczas rynku znizkujacego',
        bearcaptureratio            : 'Wskaznik opanowania rynku znizkujacego',
        bearcorrelation             : 'Korelacja podczas rynku znizkujacego',
        bearcovariance              : 'Kowariancja podczas rynku znizkujacego',
        bearmeanreturn              : 'Przecietna stopa zwrotu podczas rynku zwyzkujacego',
        beta                        : 'Beta',
        bpresenceflag               : 'Instrument byl przez caly czas w benchmarku',
        bullbeta                    : 'Beta podczas rynku zwyzkujacego',
        bullcaptureratio            : 'Wskaznik opanowania rynku zwyzkujacego',
        bullcorrelation             : 'Korelacja podczas rynku zwyzkujacego',
        bullcovariance              : 'Kowariancja podczas rynku zwyzkujacego',
        bullmeanreturn              : 'Przecietna stopa zwrotu podczas rynku znizkujacego',
        calmar                      : 'Wskaznik Calmar',
        contributiones              : 'Kontrybucja do oczekiwanej straty',
        contributioneu              : 'Kontrybucja do oczekiwanego zysku',
        contributionpu              : 'Kontrybucja do potencjalnego zysku',
        contributionvar             : 'Wklad do wartosci narazonej na ryzyko (VaR)',
        contributionvolatility      : 'Kontrybucja do zmiennosci',
        correlation                 : 'Korelacja',
        covariance                  : 'Kowariancja',
        creditspreadsdown100        : 'Spread kredytowy 100bp w dól ([CUR])',
        creditspreadsdown100percent : 'Spread kredytowy 100bp w dól',
        creditspreadsdown50         : 'Spread kredytowy 50bp w dól ([CUR])',
        creditspreadsdown50percent  : 'Spread kredytowy 50bp w dól',
        creditspreadsdv01           : 'DV01 spreadu kredytowego ([CUR])',
        creditspreadsdv01percent    : 'DV01 spreadu kredytowego',
        creditspreadsup100          : 'Spread kredytowy 100bp wzwyz ([CUR])',
        creditspreadsup100percent   : 'Spread kredytowy 100bp wzwyz',
        creditspreadsup50           : 'Spread kredytowy 50bp wzwyz ([CUR])',
        creditspreadsup50percent    : 'Spread kredytowy 50bp wzwyz',
        ctb                         : 'Kontrybucja benchmarku ([CUR])',
        ctbcur                      : 'Kontrybucja walutowa - benchmark ([CUR])',
        ctblocal                    : 'Kontrybucja - benchmark (w walucie instrumentu)',
        ctbreconcile                : 'Kontrybucja - rekoncyliacja benchmarka ([CUR])',
        ctp                         : 'Kontrybucja ([CUR])',
        ctpbutterfly                : 'Kontrybucja zmiana ksztaltu krzywej (butterfly)',
        ctpcarry                    : 'Kontrybucja carry',
        ctpcashflow                 : 'Kontrybucja z przeplywów gotówki ([CUR])',
        ctpcur                      : 'Waluta kontrybucja ([CUR])',
        ctplocal                    : 'Kontrybucja (w walucie instrumentu)',
        ctpother                    : 'Pozostala kontrybucja',
        ctpresidual                 : 'Kontrybucja rezydualna',
        ctprolldown                 : 'Kontrybucja wynikajaca ze zmiany terminu platnosci',
        ctpshift                    : 'Kontrybucja wynikajaca z przemieszczenia krzywej dochodowosci',
        ctpspeccarry                : 'Specjalna kontrybucja carry',
        ctpspread                   : 'Kontrybucja spreadu',
        ctpsystcarry                : 'Ogólna kontrybucja carry',
        ctptrading                  : 'Kontrybucja wynikajaca z obrotu instrumentami ([CUR])',
        ctptwist                    : 'Kontrybucja wynikajaca ze zmiany nachylenia krzywej dochodowosci',
        ctpyc                       : 'Kontrybucja krzywej dochodowosci',
        diversificationgrade        : 'Wspólczynnik dywersyfikacji',
        downsiderisk                : 'Ryzyko poniesienia straty',
        downsideriskannualised      : 'Zanualizowane ryzyko poniesienia straty',
        durwpend                    : 'Waga duracji na poczatku',
        durwpstart                  : 'Waga duracji pod koniec',
        ealloc                      : 'Efekt alokacji rynkowej',
        eallocc                     : 'Efekt alokacji walutowej ([CUR])',
        ealloclocal                 : 'Efekt alokacji rynkowej (w walucie instrumentu)',
        ecompoundc                  : 'Efekt naliczania walutowego ([CUR])',
        egalloc                     : 'Efekt alokacji rynkowej (geometryczny)',
        egallocc                    : 'Efekt alokacji walutowej (geometryczny) ([CUR])',
        egalloclocal                : 'Efekt alokacji rynkowej (geometryczny) w walucie instrumentu',
        egcompoundc                 : 'Efekt naliczania walutowego (geometryczny) ([CUR])',
        egselec                     : 'Efekt selecji (geometryczny)',
        egseleclocal                : 'Efekt selecji (geometryczny) w walucie instrumentu',
        egtimingc                   : 'Efekt timingu walutowego (geometryczny) ([CUR])',
        egtotal                     : 'Laczne efekty atrybucji (geometryczne) ([CUR])',
        egtotalc                    : 'Laczne efekty walutowe (geometryczne) ([CUR])',
        egtotallocal                : 'Laczne efekty rynkowe (geometryczne) w walucie instrumentu',
        egtotalmca                  : 'Laczne efekty atrybucji (geometryczne) ([CUR])',
        einter                      : 'Efekt interakcji',
        einterlocal                 : 'Efekt interakcji (w walucie instrumentu)',
        eselec                      : 'Efekt selekcji',
        eselecinter                 : 'Laczny efekt selekcji i interakcji',
        eselecinterlocal            : 'Laczny efekt selekcji i interakcji (w walucie instrumentu)',
        eseleclocal                 : 'Efekt selekcji (w walucie instrumentu)',
        etimingc                    : 'Efekt timingu walutowego ([CUR])',
        etotal                      : 'Laczne efekty atrybucji ([CUR])',
        etotalc                     : 'Laczne efekty rynkowe ([CUR])',
        etotallocal                 : 'Laczne efekty rynkowe (w walucie instrumentu)',
        etotalmca                   : 'Laczne efekty atrybucji ([CUR])',
        expectedshortfall           : 'Oczekiwana strata ([CUR])',
        expectedshortfallpercent    : '% Oczekiwanej strary',
        expectedupside              : 'Oczekiwany zysk ([CUR])',
        expectedupsidepercent       : '% Oczekiwanego zysku',
        expectedvolatility          : 'Oczekiwana zmiennosc ([CUR])',
        expectedvolatilitypercent   : '% Oczekiwanej zmiennosci',
        expostconditionalsharpe     : 'Warunkowy wskaznik Sharpe\'a ex-post',
        expostexpectedshortfall     : 'Oczekiwana strata ex-post',
        expostexpectedshortfallrel  : 'Relatywna oczekiwana strata ex-post',
        expostvar                   : 'Wartosc narazona na ryzyko (VaR) ex-post',
        expostvarrel                : 'Relatywna wartosc narazona na ryzyko (VaR) ex-post',
        fromdate                    : 'Od dnia',
        gainstolosses               : 'Zyski : Straty',
        gainstolossesgeometric      : 'Zyski : Straty (geometryczne)',
        grossexposureend            : 'Narazenie brutto pod koniec ([CUR])',
        grossexposurestart          : 'Narazenie brutto na poczatku ([CUR])',
        indexedreturnatend          : 'Indeksowna stopa zwrotu pod koniec',
        indexedreturnatstart        : 'Indeksowana stopa zwrotu na poczatku',
        inflationratesdown50        : 'Stopa inflacji 50bp w dól ([CUR])',
        inflationratesdown50percent : 'Stopa inflacji 50bp w dól',
        inflationratesdv01          : 'DV01 stopy inflacji ([CUR])',
        inflationratesdv01percent   : 'DV01 stopy inflacji',
        inflationratesup50          : 'Stopa inflacji 50bp wzwyz ([CUR])',
        inflationratesup50percent   : 'Stopa inflacji 50bp wzwyz',
        inforatiorel                : 'Wskaznik informacji (geometryczny)',
        inforatioxs                 : 'Wskaznik informacji',
        interestratesdown100        : 'Stopy procentowe 100bp w dól ([CUR])',
        interestratesdown100percent : 'Stopy procentowe 100bp w dól',
        interestratesdown50         : 'Stopy procentowe 50bp w dól ([CUR])',
        interestratesdown50percent  : 'Stopy procentowe 50bp w dól',
        interestratesdv01           : 'DV01 stóp procentowych ([CUR])',
        interestratesdv01percent    : 'DV01 stóp procentowych',
        interestratesup100          : 'Stopy procentowe 100bp wzwyz ([CUR])',
        interestratesup100percent   : 'Stopy procentowe 100bp wzwyz',
        interestratesup50           : 'Stopy procentowe 50bp wzwyz ([CUR])',
        interestratesup50percent    : 'Stopy procentowe 50bp wzwyz',
        jensensalpha                : 'Alfa Jensena',
        kurtosis                    : 'Kurtoza',
        leverage                    : 'Przecietne lewarowanie',
        leveragebeg                 : 'Lewarowanie na poczatku',
        leverageend                 : 'Lewarowania pod koniec',
        longexposureend             : 'Narazenie pozycji long pod koniec ([CUR])',
        longexposurestart           : 'Narazenie pozycji long na poczatku ([CUR])',
        marginales                  : 'Marginalna oczekiwana strata',
        marginaleu                  : 'Marginalny oczekiwany zysk',
        marginalpu                  : 'Marginalny potencjalny zysk',
        marginalvar                 : 'Marginalna wartosc narazona na ryzyko (VaR)',
        marginalvolatility          : 'Marginalna zmiennosc',
        marketvaluecomputableassets : 'Wartosc rynkowa dajacych sie wycenic instrumentów ([CUR])',
        maxloss                     : 'Maksymalna strata',
        maxlossrel                  : 'Relatywna maksymalna strata',
        mdpend                      : 'Zmodyfikowana duracja na poczatku',
        mdpstart                    : 'Zmodyfikowana duracja pod koniec',
        msquared                    : 'Wskaznik M²',
        msquaredann                 : 'Zanualizowany wskaznik M²',
        msquaredexcessann           : 'Zanualizowany wskaznik dodatkowego zwrotu M²',
        mvend                       : 'Wartosc rynkowa pod koniec ([CUR])',
        mvstart                     : 'Wartosc rynkowa na poczatku ([CUR])',
        netexposureend              : 'Narazenie netto pod koniec ([CUR])',
        netexposurestart            : 'Narazenie netto na poczatku ([CUR])',
        numberofsubperiods          : 'Ilosc [SUBPERIODS]',
        oneperiodhigh               : '[SUBPERIOD] najwyzszej stopy zwrotu',
        oneperiodlow                : '[SUBPERIOD] najnizszej stopy zwrotu',
        outstanding                 : 'Wartosc rynkowa ([CUR])',
        pandl                       : 'Zysk i strata ([CUR])',
        percentnegativeperiods      : '% ujemnych [SUBPERIODS]',
        percentnegativeperiodsrel   : 'Excess % of Negative [SUBPERIODS]',
        percentpositiveperiods      : '% dodatnich [SUBPERIODS]',
        percentpositiveperiodsrel   : 'Excess % of Positive [SUBPERIODS]',
        periodaverage               : '[SUBPERIOD] stopa zwrotu',
        periodinforatiorel          : '[SUBPERIOD] wskaznik informacji (geometryczny)',
        periodinforatioxs           : '[SUBPERIOD] wskaznik informacji',
        periodname                  : 'Przedzial czasu',
        periodsharpe                : '[SUBPERIOD] wskaznik Sharpe\'a',
        periodsharpegeo             : '[SUBPERIOD] wskaznik Sharpe\'a (geometryczny)',
        periodtrackerrrel           : '[SUBPERIOD] wskaznik odchylenia (geometryczny)',
        periodtrackerrxs            : '[SUBPERIOD] wskaznik odchylenia',
        periodtreynor               : '[SUBPERIOD] wskaznik Treynora',
        potentialupside             : 'Potencjalny zysk ([CUR])',
        potentialupsidepercent      : '% Potencjalnego zysku',
        ppresenceflag               : 'Instrument byl przez caly czas w portfelu',
        rb                          : 'Stopa zwrotu benchmarka ([CUR])',
        rbcur                       : 'Stopa zwrotu walutowego benchmarka ([CUR])',
        rblocal                     : 'Stopa zwrotu benchmarka (w walucie instrumentu)',
        recoveryperiod              : 'Ilosc dni regeneracji po maksymalnej stracie',
        recoveryperiodrel           : 'Ilosc dni regeneracji po maksymalnej relatywnej stracie',
        rel1periodhigh              : '[SUBPERIOD] najwyzszego relatywnego zwrotu',
        rel1periodlow               : '[SUBPERIOD] najnizszego relatywnego zwrotu',
        relannualaverage            : 'Zanualizowana stopa relatywnego zwrotu',
        relperiodaverage            : 'Relatywna stopa zwrotu (przecietny [SUBPERIOD])',
        relr                        : 'Relatywna stopa zwrotu ([CUR])',
        relreturnannifgtyr          : 'Relatywna stopa zwrotu (zanualizowana dla okresów dluzszych niz 1 rok)',
        relrgeom                    : 'Relatywna stopa zwrotu (geometryczna) ([CUR])',
        relrgeomlocal               : 'Relatywna stopa zwrotu (geometryczna) ([CUR]) w walucie instrumentu',
        relrlocal                   : 'Relatywna stopa zwrotu w walucie instrumentu',
        returnann                   : 'Zanualizowany [SUBPERIOD] stopa zwrotu',
        returnannifgtyr             : 'Stopa zwrotu (zanualizowana dla okresów dluzszych niz 1 rok)',
        riskfreereturnann           : 'Zanualizowana stopa zwrotu wolna od ryzyka',
        riskfreereturnout           : 'Stopa zwrotu wolna od ryzyka',
        riskfreereturnperiod        : 'Stopa zwrotu wolna od ryzyka na [SUBPERIOD]',
        riskweight                  : 'Waga narazona na ryzyko',
        rp                          : 'Stopa zwrotu ([CUR])',
        rpbutterfly                 : 'Stopa zwrotu wynikajaca ze zmiany ksztaltu krzywej (butterfly)',
        rpcarry                     : 'Stopa zwrotu carry',
        rpcur                       : 'Waluta stopy zwrotu ([CUR])',
        rplocal                     : 'Stopa zwrotu (w walucie instrumentu)',
        rpother                     : 'Pozostala stopa zwrotu',
        rpresidual                  : 'Rezydualna stopa zwrotu',
        rprolldown                  : 'Stopa zwrotu wynikajaca ze zmiany terminu platnosci',
        rpshift                     : 'Stopa zwrotu wynikajaca z przemieszczenia krzywej dochodowosci',
        rpspeccarry                 : 'Specjalna stopa zwrotu carry',
        rpspread                    : 'Kontrybucja spreadu',
        rpsystcarry                 : 'Ogólna stopa zwrotu carry',
        rptwist                     : 'Stopa zwrotu wynikajaca ze zmiany nachylenia krzywej dochodowosci',
        rpyc                        : 'Stopa zwrotu krzywej dochodowosci',
        rsquared                    : 'Wspólczynnik determinacji R²',
        segmentname                 : 'Nazwa segmentu',
        sharperatio                 : 'Wskaznik Sharpe\'a',
        sharperatiogeo              : 'Wskaznik Sharpe\'a (geometryczny)',
        shortexposureend            : 'Narazenie pozycji short pod koniec ([CUR])',
        shortexposurestart          : 'Narazenie pozycji short na poczatku ([CUR])',
        skewness                    : 'Wspólczynnik skosnosci',
        sortinoratio                : 'Wskaznik Sortino na [SUBPERIOD]',
        sortinoratioannualised      : 'Wskaznik Sortino',
        spreadpend                  : 'Poczatek spreadu',
        spreadpstart                : 'Koniec spreadu',
        standarderror               : 'Blad standardowy',
        stddevann                   : 'Zanualizowana zmiennosc',
        stddevperiod                : 'Zmiennosc na [SUBPERIOD]',
        stresstest10cash            : 'Test obciazeniowy 10 - wplyw gotówkowy',
        stresstest10percent         : 'Test obciazeniowy 10 - wplyw procentowy',
        stresstest1cash             : 'Test obciazeniowy 1 - wplyw gotówkowy',
        stresstest1percent          : 'Test obciazeniowy 1 - wplyw procentowy',
        stresstest2cash             : 'Test obciazeniowy 2 - wplyw gotówkowy',
        stresstest2percent          : 'Test obciazeniowy 2 - wplyw procentowy',
        stresstest3cash             : 'Test obciazeniowy 3 - wplyw gotówkowy',
        stresstest3percent          : 'Test obciazeniowy 3 - wplyw procentowy',
        stresstest4cash             : 'Test obciazeniowy 4 - wplyw gotówkowy',
        stresstest4percent          : 'Test obciazeniowy 4 - wplyw procentowy',
        stresstest5cash             : 'Test obciazeniowy 5 - wplyw gotówkowy',
        stresstest5percent          : 'Test obciazeniowy 5 - wplyw procentowy',
        stresstest6cash             : 'Test obciazeniowy 6 - wplyw gotówkowy',
        stresstest6percent          : 'Test obciazeniowy 6 - wplyw procentowy',
        stresstest7cash             : 'Test obciazeniowy 7 - wplyw gotówkowy',
        stresstest7percent          : 'Test obciazeniowy 7 - wplyw procentowy',
        stresstest8cash             : 'Test obciazeniowy 8 - wplyw gotówkowy',
        stresstest8percent          : 'Test obciazeniowy 8 - wplyw procentowy',
        stresstest9cash             : 'Test obciazeniowy 9 - wplyw gotówkowy',
        stresstest9percent          : 'Test obciazeniowy 9 - wplyw procentowy',
        testedbeta                  : 'Beta (testowana)',
        testedcorrelation           : 'Korelacja (testowana)',
        todate                      : 'do dnia obecnego',
        trackingerrorrel            : 'Wskaznik odchylenia',
        trackingerrorxs             : 'Wskaznik odchylenia',
        treynorratio                : 'Wskaznik Treynora',
        tstatbeta2                  : 'Statystyka testu (t-stat) bety',
        tstatcorrel2                : 'Statystyka testu (t-stat) korelacji',
        ttmpend                     : 'Termin platnosci na poczatku',
        ttmpstart                   : 'Termin platnosci pod koniec',
        valueatrisk                 : 'Wartosc narazona na ryzyko (VaR) ([CUR])',
        valueatriskpercent          : '% Wartosci narazone na ryzyko (VaR)',
        variance                    : 'Wariancja',
        wb                          : 'Przecietna waga w benchmarku',
        wbbeg                       : 'Waga w benchmarku na poczatku',
        wbegover                    : 'Przewazenie na poczatku',
        wbend                       : 'Waga w benchmarku pod koniec',
        wendover                    : 'Przewazenie pod koniec',
        wover                       : 'Przecietne przewazenie',
        wp                          : 'Przecietna waga',
        wpabsolute                  : 'Srednia waga absolutna',
        wpabsolutebeg               : 'Waga absolutna na poczatku',
        wpabsoluteend               : 'Waga absolutna pod koniec',
        wpbeg                       : 'Waga na poczatku',
        wpend                       : 'Waga na kóncu',
        wpgross                     : 'Srednia waga brutto',
        wpgrossbeg                  : 'Waga brutto na poczatku',
        wpgrossend                  : 'Waga brutto pod koniec',
        xs1periodhigh               : '[SUBPERIOD] najwyzszego relatywnego zwrotu',
        xs1periodlow                : '[SUBPERIOD] najnizszego relatywnego zwrotu',
        xsannualaverage             : 'Zanualizowana stopa relatywnego zwrotu',
        xsperiodaverage             : 'Relatywny zwrot na [SUBPERIOD]',
        xsreturnannifgtyr           : 'Relatywna stopa zwrotu (zanualizowana dla okresów dluzszych niz 1 rok)',
        ytmpend                     : 'Stopa rentownosci na poczatku',
        ytmpstart                   : 'Stopa rentownosci pod koniec'
    },

    // ------------------------------------------------------------------ | P |

    portfoliosAnalysisPage: {
        portfoliosAnalysisText      : 'Analiy portfela'
    },

    portfoliosPage: {
        portfoliosText              : 'Portfele'
    },

    // ------------------------------------------------------------------ | S |

    settingsPages: {
        settingsText                : 'Impostazioni',
        applicationSettingsText     : 'Ustawienia aplikacji',
        userPreferencesText         : 'Preferencje',
        languagesText               : 'Języki',
        autoLoginText               : 'Automatyczne logowanie',
        licenseText                 : 'Licencja',
        themesText                  : 'Motywy wizualne aplikacji',
        reloadText                  : 'Odśwież aplikację',
        analysisPageText            : 'Strona analiz',
        analysisPagesText           : 'Strony analiz',
        userPageText                : 'Strona użytkownika',
        userPagesText               : 'Strony użytkownika',
        defaultPagesText            : 'Strony domyślne',
        pageNameText                : 'Tytuł strony',
        saveText                    : 'Zapisz',
        resetText                   : 'Zresetuj',
        aboutText                   : 'Informacja',
        resetCurrentSettingsText    : 'Zresetuj obecne ustawienia',
        resetAllSettingsText        : 'Zresetuj wszystkie ustawienia'
    },

    shared: {
        backText                    : 'Cofnij',
        statProText                 : 'StatPro International SARL',
        versionText                 : 'Wersja',
        Monthly                     : 'Miesięczna',
        Weekly                      : 'Tygodniowa',
        Quarterly                   : 'Kwartalna'
    },

    // -------------------------- | END OF FILE | -------------------------- \\
    //                     A way to avoid missing comma                      \\

    eof                             : 'Arrivederci'
};