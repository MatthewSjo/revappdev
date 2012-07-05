// ------------------------------------------
// FULL SCREEN MANAGER
// ------------------------------------------

WebAppLoader.addModule({ name: 'presentationManager', plugins: ['helper', 'device'], sharedModules: ['pageElements'], hasEvents: true }, function () {
    var presentationManager  = {},
        eventManager        = this.getEventManager(),
        output              = this.getConsole(),
        helper              = this.getPlugin('helper'),
        device              = this.getPlugin('device'),
        el                  = this.getSharedModule('pageElements'),
        fullScreen          = false;

    $(el.minimizeButton).on('click', function (e, info) {
        exitPresentationMode();
        e.preventDefault();
    });
    
    function enterPresentationMode(chartId) {
        fullScreen = true;
        turnView();

        $(el.fullScreenPage).show();
        $(el.fullScreenPage).animate({ opacity: 1 }, { duration: 750, easing: 'ease-out', complete: function () {
        }});

//        $('#testChart').append( $('#' + chartId) );
//        $('#' + chartId).css('-webkit-transform', 'scale(1)');
    }

    function exitPresentationMode() {
        fullScreen = false;
        $(el.fullScreenPage).animate({ opacity: 0 }, { duration: 750, easing: 'ease-out', complete: function () {
            $(el.fullScreenPage).css({ 'display': 'none' });
        }});
    }

    function isFullScreen() {
        return fullScreen;
    }

    // Private
    function turnView() {
        // ASA TODO: Use device.orientation()...
        var o         = Math.abs(window.orientation - 90),
            left      = '0',
            width     = '0',
            height    = '0',
            forceTurn = false;
        
        o = (o == 180) ? 0: o;
        
        if (o == 90) {
            width     = '1004px';
            height    = '768px';
            left      = '768px';
            forceTurn = true;
        } else {
            width     = '1024px';
            height    = '748px';
            left      = '0';
            forceTurn = false;
        }

        if (forceTurn) {
            $(el.turnIcon).animate({ opacity: 1 }, { duration: 250, easing: 'ease-out', complete: function () {
                $(el.fullScreenMask).css({ 'display': 'block' });
            }});
        } else {
            $(el.turnIcon).animate({ opacity: 0 }, { duration: 250, easing: 'ease-out', complete: function () {
                $(el.fullScreenMask).css({ 'display': 'none' });
            }});
        }

        $(el.fullScreenContainer).css({ 
            width: width,
            height: height,
            '-webkit-transform-origin': 'left top',
            '-webkit-transform': 'rotate('+ o +'deg)',
            left: left
        });
    }

    $('body').bind('turn', function(event, info){
        if (isFullScreen()) {
            turnView();
        }
    });

    presentationManager.enterPresentationMode = enterPresentationMode;
    presentationManager.exitPresentationMode = exitPresentationMode;
    presentationManager.isFullScreen = isFullScreen;

    return presentationManager;
});