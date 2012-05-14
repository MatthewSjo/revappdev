// ------------------------------------------
// ISCROLL
// ------------------------------------------

WebAppLoader.addModule({ name: 'scroll' }, function () {
    var scroll      = {},
        myScroll; // Please don't initialize myScroll.
    
    /* Use this for high compatibility (iDevice + Android)*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    
    function rebuildScroll(id, optionConfig) {
        var wrapper = 'div#' + id + ' #wrapper',
                options = optionConfig || {}; // { hScrollbar: false, vScrollbar: true }
        
        options.useTransform = false;
		options.onBeforeScrollStart = function (e) {
			    var target = e.target;
			    while (target.nodeType != 1) target = target.parentNode;

			    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
				    e.preventDefault();
		    };

        if (myScroll) {
            myScroll.destroy();
            myScroll = null;
        }

        if ($(wrapper).get(0)) {
            setTimeout(function () {
                myScroll = new iScroll($(wrapper).get(0), options);
            }, 25); // Usually timers should be set to a minimum of 25 milliseconds to work properly.
        }
    }

    function goUp() {
        try {
            myScroll.scrollTo(0, 0, 200);
        } catch (e) {

        }
    }

    scroll.rebuild = rebuildScroll;
    scroll.goUp = goUp;

    return scroll;
});