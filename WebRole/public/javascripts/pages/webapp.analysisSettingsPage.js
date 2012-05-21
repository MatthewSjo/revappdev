// ------------------------------------------
// ANALYSIS SETTINGS PAGE
// ------------------------------------------

WebAppLoader.addModule({ name: 'analysisSettingsPage', plugins: ['helper'], sharedModules: ['settings', 'pageElements'], hasEvents: true }, function () {
    var analysisSettingsPage = {}
    output                   = this.getConsole(),
        eventManager         = this.getEventManager(),
        helper               = this.getPlugin('helper'),
        settings             = this.getSharedModule('settings'),
        el                   = this.getSharedModule('pageElements');

    function create(analysisPages) {
        var analysisPage, isUserDefined, pageName, pageId, appendTo;

        for (var i = 0; i < analysisPages.length; i++) {
            analysisPage    = analysisPages[i];
            pageName        = analysisPage.name;
            pageId          = analysisPage.id;
            isUserDefined   = analysisPage.userDefined;
            appendTo        = (isUserDefined)
                ? el.listAnalysisSettingsUserPages
                : el.listAnalysisSettingsDefaultPages; 

            $(appendTo).append(
                $('<li>').attr('class', 'arrow').appned(
                    $('<a>').attr({'href': '#', 'data-link' : pageId })
                    .html(pageName)
                    .on('click', onAnalysisPageClick)
                )
            );
        }
    }

    analysisSettingsPage.create = create;

    return analysisSettingsPage;
});

/*
    $(
        '<li class="arrow">' + 
        '   <a href="#" data-link="' + link + '">' + title + '</a>' +
        '</li>'
    )
*/