// ------------------------------------------
// CHARTS MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartComponents', plugins: ['helper'], sharedModules: ['chartManager', 'localizationManager'],
    dataObjects: ['charts'], hasEvents: true, isShared: true
}, function () {

    var chartComponents  = {},
        output           = this.getConsole(),
        eventManager     = this.getEventManager(),
        helper           = this.getPlugin('helper'),
        chartManager     = this.getSharedModule('chartManager'),
        lang             = this.getSharedModule('localizationManager').getLanguage() || {},
        createdCharts    = {},
        chartsDataObject = this.getDataObject('charts'),
        chartsData       = null;

    chartsDataObject.define({
        // ------------------------------------------
        // BAR CHARTS
        // ------------------------------------------

        'performance_bar': {
            chartId: 'performance_bar',
            title: lang.chart.performanceBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['rp'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }
        },
        'risk_bar': {
            chartId: 'risk_bar',
            title: lang.chart.riskBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wp', 'contributionvar'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Return' }
            }
        },
        'allocation_bar': {
            chartId: 'allocation_bar',
            title: lang.chart.allocationbarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wover'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Excess Weight %' }
            }
        },
        'contribution_bar': {
            chartId: 'contribution_bar',
            title: lang.chart.contributionBarTitle,
            chartType: 'BarChart',
            include: 'securities',
            measures: ['ctp'],
            includeMeasuresFor: ['securities'],
            options: {
                hAxis: { title: 'Contribution' }
            }
        },
        'attribution_bar': {
            chartId: 'attribution_bar',
            title: lang.chart.attributionBarTitle,
            chartType: 'BarChart',
            include: 'childSegments',
            measures: ['wendover', 'etotal'],
            includeMeasuresFor: ['childSegments']
        },
        'fixedIncomeContribution_bar': {
            chartId: 'fixedIncomeContribution_bar',
            title: lang.chart.fixedIncomeContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpyc', 'ctpspread', 'ctpcur'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#FF6600', '#CC0000', '#FFCC00']
            }
        },
        'carryContribution_bar': {
            chartId: 'carryContribution_bar',
            title: lang.chart.carryContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpsystcarry', 'ctpspeccarry'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336600', '#990000']
            }
        },
        'yieldCurveContribution_bar': {
            chartId: 'yieldCurveContribution_bar',
            title: lang.chart.yieldCurveContributionBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ctpshift', 'ctptwist', 'ctpbutterfly', 'ctprolldown'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#CD66CD', '#339900', '#FF9900', '#660000']
            }
        },
        'riskNumbers_bar': {
            chartId: 'riskNumbers_bar',
            title: lang.chart.riskNumbersBarTitle,
            chartType: 'BarChart',
            include: 'none',
            measures: ['ytmpend', 'mdpend'],
            includeMeasuresFor: ['segment'],
            options: {
                chartArea: { left: 10, width: '60%', height: '80%' },
                colors: ['#336699', '#530066']
            }
        },

        // ------------------------------------------
        // BUBBLE CHARTS
        // ------------------------------------------

        'performance_bubble': {
            chartId: 'performance_bubble',
            title: lang.chart.performanceBubbleTitle,
            chartType: 'BubbleChart',
            include: 'childSegments',
            measures: ['stddevann', 'returnannifgtyr', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: 'Annualized Volatility' },
                vAxis: { title: 'Annualized Return' }
            }
        },
        'risk_bubble': {
            chartId: 'risk_bubble',
            title: lang.chart.riskBubbleTitle,
            chartType: 'BubbleChart',
            include: 'childSegments',
            measures: ['valueatriskpercent', 'rp', 'wpabsolute'],
            includeMeasuresFor: ['childSegments'],
            options: {
                hAxis: { title: '% Value at Risk' },
                vAxis: { title: 'Return' }
            }
        },

        // ------------------------------------------
        // COLUMN CHARTS
        // ------------------------------------------

        'contribution_column': {
            chartId: 'contribution_column',
            title: lang.chart.contributionColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['ctp', 'ctb'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Return %' }
            }
        },
        'interestRatesExposure_column': {
            chartId: 'interestRatesExposure_column',
            title: lang.chart.interestRatesExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['interestratesdown100percent', 'interestratesdown50percent', 'interestratesup50percent', 'interestratesup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }
        },
        'creditSpreadsExposure_column': {
            chartId: 'creditSpreadsExposure_column',
            title: lang.chart.creditSpreadsExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['creditspreadsdown100percent', 'creditspreadsdown50percent', 'creditspreadsup50percent', 'creditspreadsup100percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#CC0000', '#CD66CD', '#FFCC00', '#3399CC']
            }
        },
        'dv01Exposure_column': {
            chartId: 'dv01Exposure_column',
            title: lang.chart.dv01ExposureColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'],
            includeMeasuresFor: ['childSegments'],
            options: {
                vAxis: { title: 'Exposure %' },
                colors: ['#3399CC', '#336699', '#003366']
            }
        },
        'attribution_column': {
            chartId: 'attribution_column',
            title: lang.chart.attributionColumnTitle,
            chartType: 'ColumnChart',
            include: 'childSegments',
            measures: ['etotal', 'ealloc', 'eselecinter'],
            includeMeasuresFor: ['childSegments'],
            options: {
                colors: ['#003366', '#FF6600', '#990066']
            }
        },

        // ------------------------------------------
        // PIE CHARTS
        // ------------------------------------------

        'allocation_pie': {
            chartId: 'allocation_pie',
            title: lang.chart.allocationPieTitle,
            chartType: 'PieChart',
            include: 'childSegments',
            measures: ['wpabsoluteend'],
            includeMeasuresFor: ['childSegments']
        },
        'contribution_pie': {
            chartId: 'contribution_pie',
            title: lang.chart.contributionPieTitle,
            chartType: 'PieChart',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: false,
            measures: ['wpabsoluteend', 'ctp'],
            includeMeasuresFor: ['childSegments']
        },
        'risk_pie': {
            chartId: 'risk_pie',
            title: lang.chart.riskPietitle,
            chartType: 'PieChart',
            include: 'childSegments',
            isHeatMap: true,
            isGradientReversed: true,
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['childSegments']
        },

        // ------------------------------------------
        // GRIDS
        // ------------------------------------------

        'performance_grid': {
            chartId: 'performance_grid',
            title: lang.chart.performanceGridTitle,
            chartType: 'Table',
            include: 'none',
            measures: [
                'rp', 'returnann', 'stddevann', 'relr',
                'periodaverage', 'oneperiodhigh', 'oneperiodlow',
                'maxloss', 'percentpositiveperiods', 'correlation',
                'alpha', 'beta', 'rsquared', 'sharperatio',
                'treynorratio', 'inforatioxs'
            ],
            includeMeasuresFor: ['segment']
        },
        'attribution_grid': {
            chartId: 'attribution_grid',
            title: lang.chart.attributionGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ctp', 'ctb', 'ealloclocal', 'eselecinterlocal', 'etotalc', 'etotalmca'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncome_grid': {
            chartId: 'fixedIncome_grid',
            title: lang.chart.fixedIncomeGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ttmpend', 'ytmpend', 'mdpend', 'durwpend', 'spreadpend'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeContribution_grid': {
            chartId: 'fixedIncomeContribution_grid',
            title: lang.chart.fixedIncomeContributionGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'ctp', 'ctpyc', 'ctpcarry', 'ctpspread', 'ctpcur', 'ctpother', 'ctpresidual'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'fixedIncomeExposure_grid': {
            chartId: 'fixedIncomeExposure_grid',
            title: lang.chart.fixedIncomeExposureGridTitle,
            chartType: 'Table',
            include: 'childSegments',
            measures: [
                'wpend', 'interestratesdv01percent', 'creditspreadsdv01percent', 'inflationratesdv01percent'
            ],
            includeMeasuresFor: ['segment', 'childSegments']
        },
        'performanceTopTen_grid': {
            chartId: 'performanceTopTen_grid',
            title: lang.chart.performanceTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'wpend-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'contributionTopTen_grid': {
            chartId: 'contributionTopTen_grid',
            title: lang.chart.contributionTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'rp', 'ctp'],
            oData: { orderby: 'ctp-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },
        'riskTopTen_grid': {
            chartId: 'riskTopTen_grid',
            title: lang.chart.riskTopTenGridTitle,
            chartType: 'Table',
            include: 'securities',
            measures: ['wpend', 'expectedshortfallpercent', 'valueatriskpercent', 'expectedvolatilitypercent'],
            oData: { orderby: 'valueatriskpercent-Earliest desc', top: 10 },
            includeMeasuresFor: ['securities']
        },

        // ------------------------------------------
        // TREE MAP CHARTS
        // ------------------------------------------

        'performance_treemap': {
            chartId: 'performance_treemap',
            title: lang.chart.performanceTreemapTitle,
            chartType: 'TreeMap',
            include: 'securities',
            measures: ['wpabsoluteend', 'rp'],
            includeMeasuresFor: ['segment', 'securities']
        },
        'risk_treemap': {
            chartId: 'risk_treemap',
            title: lang.chart.riskTreemapTitle,
            chartType: 'TreeMap',
            include: 'childSegments',
            measures: ['wpabsoluteend', 'contributionvar'],
            includeMeasuresFor: ['segment', 'childSegments']
        },

        // ------------------------------------------
        // LINE CHARTS
        // ------------------------------------------

        'performance_line': {
            chartId: 'performance_line',
            title: lang.chart.performanceLineTitle,
            chartType: 'LineChart',
            measures: ['rp', 'rb'],
            seriesType: 'cumulativeIndexed'
        },

        // ------------------------------------------
        // CHART GROUPS
        // ------------------------------------------

        'fi_contribution_group': {
            chartId: 'fi_contribution_group',
            title: lang.chart.fixedIncomeContributionsGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'fixedIncomeContribution_bar',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'carryContribution_bar',
                width: '50%',
                height: '100%'

            }, {
                chartId: 'yieldCurveContribution_bar',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'riskNumbers_bar',
                width: '50%',
                height: '100%'
            }]
        },
        'fi_exposures_group': {
            chartId: 'fi_exposures_group',
            title: lang.chart.fixedIncomeExposuresGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'interestRatesExposure_column',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'creditSpreadsExposure_column',
                width: '50%',
                height: '100%'
            }, {
                chartId: 'dv01Exposure_column',
                width: '50%',
                height: '100%'
            }]
        },
        'fi_gridRiskNumber_group': {
            chartId: 'fi_gridRiskNumber_group',
            title: lang.chart.fixedIncomeRiskNumbersGroupTitle,
            chartType: 'Group',
            charts: [{
                chartId: 'fixedIncome_grid',
                width: '100%',
                height: '100%'
            }, {
                chartId: 'fixedIncomeContribution_grid',
                width: '100%',
                height: '100%'
            }]
        }
    });

    chartsData = chartsDataObject.getData();

    // Public
    function load(chartsToLoad) {
        var chartToLoad, chartId, newRequest = true;

        for (var i = 0; i < chartsToLoad.length; i++) {
            chartId = chartsToLoad[i].chartId;

            // If the chart has been created...
            if (createdCharts[chartId]) {
                // Use it else...
                chartToLoad = createdCharts[chartId];
            } else {
                // Create a new chart and return it.
                chartToLoad = chartManager.create(chartsData[chartId]);
                createdCharts[chartId] = chartToLoad;
            }

            chartManager.load(chartToLoad, newRequest);

            // Change the status of newRequest only if a valid chart has been loaded.
            if (chartToLoad) {
                newRequest = false;
            }
        }
    }

    function setTimePeriod(charts, timePeriod) {
        $.each(charts, function (index, chart) {
            var config;

            // Assign our time period to different objects depending if the chart 
            // has already been created or not; the chart config if it's not yet 
            // created, or add it to the actual chart object if it is.
            config = createdCharts[chart.chartId] || chartsData[chart.chartId];
            config.timePeriods = timePeriod.code;
            config.startDate = timePeriod.startDate;
            config.endDate = timePeriod.endDate;
        });
    }

    function render(charts, renderTo) {
        var chartsToLoad = [],
            htmlToAppend = '';

        function openAnalysisSection(chartId, chartTitle) {
            htmlToAppend = '';
            htmlToAppend +=
                '<hr class = "snapper" style="visibility: hidden;" data-chartId="' + chartId + '" />' +
                '<div class="analysisSummarySection">' +
                '    <div class="analysisComponentContainer">' +
                '       <div class="analysisComponentHeader">' +
                '           <h2>' + chartTitle + '</h2>' +
                '           <div class="analysisComponentFullScreenButton" data-chartId="' + chartId + '"></div>' +
                '       </div>';
        }
        
        function addChartToAnalysisSection(chartToAdd, containerClass) {
            htmlToAppend +=
                '        <div id="' + chartToAdd.chartId + '" class="' + containerClass + '"></div>';
        }

        function addChartToGroup(chartToAdd) {
            htmlToAppend +=
                '        <div id="' + chartToAdd.chartId +
                '" class="halfSizeChart" style="width: ' + chartToAdd.width + ';' +
                'height: ' + chartToAdd.height + ';"></div>';
        }

        function closeAnalysisSection() {
            htmlToAppend +=
                '        <div style="clear: both;"></div>' +
                '    </div>' +
                '</div>';
        }

        function appendHtmlToAnalysisSection() {
            $(renderTo).append($(htmlToAppend));
        }

        function addChartToChartsToRender(chartToAdd) {
            var chartsToRender = [],
                isGroup        = false,
                containerClass;

            // Exit if the chart to add doesn't exist.
            if (!chartToAdd) {
                output.log('addChartToChartsToRender: Skipped empty chart');
                return;
            }

            // Extract the charts to render if the current chart is a group.
            if (chartToAdd.chartType === 'Group') {
                chartsToRender = chartToAdd.charts;
                isGroup = true;
            } else {
                chartsToRender.push(chartToAdd);
            }

            if (isGroup) {
                openAnalysisSection(chartToAdd.chartId, chartToAdd.title);
            }

            // Define a wrapper DIV class for the chart container depending on
            // the chart type. If the chart is a table, it sets its own height,
            // so an explicit class defining height is not required.
            containerClass = (chartToAdd.chartType === 'Table') ? '' : 'chartContainer';

            // Create the chart containers according to the chart types.
            for (var i = 0; i < chartsToRender.length; i++) {
                chart = chartsData[chartsToRender[i].chartId] || null;

                // Add current chart to the list of charts to load.
                chartsToLoad.push(chart);

                if (chart) {
                    if (isGroup) {
                        addChartToGroup(chartsToRender[i]);
                    } else {
                        openAnalysisSection(chart.chartId, chart.title);
                        addChartToAnalysisSection(chartsToRender[i], containerClass);
                        closeAnalysisSection();
                        appendHtmlToAnalysisSection();
                    }
                }
            }

            if (isGroup) {
                closeAnalysisSection();
                appendHtmlToAnalysisSection();
            }
        }

        for (var i = 0; i < charts.length; i++) {
            addChartToChartsToRender(chartsData[charts[i].chartId] || null);
        }

        load(chartsToLoad);
    }

    // TODO: Investigate...
    chartManager.on('onAnalysisLoaded', function () {
        eventManager.raiseEvent('onAllChartsLoaded');
    });

    chartManager.on('onAnalysisLoading', function (chartCount, chartTotal) {
        eventManager.raiseEvent('onChartsLoading', chartCount, chartTotal);
    });

    chartComponents.load = load;
    chartComponents.render = render;
    chartComponents.setTimePeriod = setTimePeriod;

    return chartComponents;
});