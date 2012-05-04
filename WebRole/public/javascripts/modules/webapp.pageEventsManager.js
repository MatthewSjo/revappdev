// ------------------------------------------
// EVENT PAGE MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'pageEventsManager', plugins: ['helper'], sharedModules: ['pageElements'], hasEvents: true }, function () {
    var pageEventsManager   = {},
        eventManager        = this.loader.eventManager || {},
        output              = this.loader.output || {},
        helper              = this.loader.plugins.helper || {},
        el                  = this.loader.shared.pageElements || {};

    $('div[data-pageEvents]').each(function () {
        var eventHandler = '';

        switch ($(this).attr("data-pageEvents")) {
            case 'start':
                $(this).on('pageAnimationStart', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'Start');
                    }
                });
                break;

            case 'end':
                $(this).on('pageAnimationEnd', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'End');
                    }
                });
                break;

            case 'both':
                $(this).on('pageAnimationStart', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'Start');
                    }
                });

                $(this).on('pageAnimationEnd', function (e, info) {
                    if (info.direction === 'in') {
                        eventManager.raiseEvent('on' + helper.capitaliseFirstLetter(this.id) + 'End');
                    }
                });
                break;

            case 'none':
                break;

            default:
        }
    });

    // ------------------------------------------
    // GLOBAL AJAX EVENTS
    // ------------------------------------------

    // Global Ajax Call
    $(document).on('ajaxStart', onAjaxStart);
    $(document).on('ajaxComplete', onAjaxComplete);

    function onAjaxStart(event, request, settings) {
        $(el.loadingMask).show();
        output.log('ajaxStart', event, request, settings);
    }

    function onAjaxComplete(event, request, settings) {
        $(el.loadingMask).css("display", "none");
        // Return false to cancel this request.
        var obj = {};
        try {
            obj = JSON.parse(request.response);
        } catch (e) {

        }

        output.log('ajaxComplete', event, request, settings, obj);
    }

    return pageEventsManager;
});