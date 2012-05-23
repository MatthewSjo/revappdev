// ------------------------------------------
// CHART SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'chartSettingsPage', plugins: ['helper'], sharedModules: ['settings', 'pageElements'], hasEvents: true }, function () {
    var chartSettingsPage    = {},
        output               = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        settings             = this.getSharedModule('settings'),
        el                   = this.getSharedModule('pageElements'),
        analysisId           = '';

    function create(charts) {
        for (var i = 0; i < charts.length; i++) {
            $(el.chartsSelectbox).append(
                $('<option>').attr('value', charts[i].chartId)
                    .html(charts[i].chartTitle)
                );
        }
    }

    function update(analysisPage) {
        // NOTA BENE: The current version of Zepto doesn't support
        // multiple selection based on array.
        
        // Reset the select box.
        // $(el.chartsSelectbox + ' > option').removeAttr('selected');
        $(el.chartsSelectbox).children('option:selected').removeAttr('selected');
        $(el.chartsSelectbox).attr('selectedIndex', '-1');

        for (var i = 0; i < analysisPage.charts.length; i++) {
            $(el.chartsSelectbox + ' [value="' + analysisPage.charts[i].chartId + '"]').attr('selected', 'selected');
        }

        $(el.analysisPageNameTextbox).val(analysisPage.name);
        analysisId = analysisPage.id;
    }
    
    function getSettings() {
        var settings = {
                name: '',
                id: '',
                order: new Date().getTime(),
                userDefined : true,
                charts: []
            }, 
            chartOrder = 1;

        settings.name = $(el.analysisPageNameTextbox).val();
        settings.id = analysisId;
        
        // $(el.chartsSelectbox + ' > option').each(function (chart){
        $(el.chartsSelectbox).children('option:selected').each(function (chart){
            settings.charts.push({
                chartId: $(this).val(),
                order: chartOrder
            });

            chartOrder += 1;
        });

        return settings;
    }

    $(el.saveChartSettings).on('click', function (){
        eventManager.raiseEvent('onSettingsChanged', getSettings());
    });

    chartSettingsPage.create = create;
    chartSettingsPage.update = update;
    chartSettingsPage.getSettings = getSettings;

    return chartSettingsPage;
});