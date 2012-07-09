// ------------------------------------------
// ISCROLL
// ------------------------------------------

WebAppLoader.addModule({ name: 'scroll' }, function () {
    var scroll = {},
        myScroll,
        savedScrollPosition = [],
        lastXPosition = 0,
        lastYPosition = 0; // Please don't initialize myScroll.

    /* Use this for high compatibility (iDevice + Android)*/
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    function saveScrollPosition() {
        // TODO: Store positions and return an id to use with restoreScrollPosition.
        // savedScrollPosition[0] = {x: myScroll.x, y: myScroll.y};
        if (myScroll) {
            lastXPosition = myScroll.x;
            lastYPosition = myScroll.y;
        }
    }

    function restoreScrollPosition(offsetX, offsetY/* TODO: id*/) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        // If restoreScrollPosition has been called immediately after the rebuildScroll
        // method, we need deferring execution of the code to ensure that the myScroll object
        // exists.
        setTimeout(function () {
            try {
                myScroll.scrollTo(lastXPosition, lastYPosition);
            } catch (e) {

            }
        }, 100);
    }
    
    function scrollToElement(element, offset, time) {
        var top = 0,
            el  = null;
        
        try { el = $(element); } catch (e) {}
                
        if (!el) return;

        setTimeout(function () {
            try {
                top = (el.offset().top * -1) + offset || 0;
                top += myScroll.wrapperOffsetTop;
                myScroll.scrollTo(0, top, time + 100);
                // myScroll.scrollToElement(element, time);
            } catch (e) {

            }
        }, 100);
    }

    function scrollTo(x, y, time) {
        setTimeout(function () {
            try {
                myScroll.scrollTo(x, y  - myScroll.wrapperOffsetTop, time || 1000, true);
            } catch (e) {

            }
        }, 100);
    }
    
    function rebuildScroll(id, optionConfig) {
        var wrapper = 'div#' + id + ' #wrapper',
            options = optionConfig || {}; // { hScrollbar: false, vScrollbar: true }

        options.useTransform = false;
        options.onBeforeScrollStart = function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                e.preventDefault();
            }
        };

        // Remove comments from these options if you want to activate the snap.
        // options.snap = 'hr';
        // options.momentum = true;
        // options.hScroll = true;
        // options.vScroll = true;
        // options.zoom = true;
        
//        options.snap = true;
//        options.momentum = false;
//        options.hScrollbar = false;
//        options.vScrollbar = false;
        
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
    scroll.saveScrollPosition = saveScrollPosition;
    scroll.restoreScrollPosition = restoreScrollPosition;
    scroll.scrollToElement = scrollToElement;
    scroll.scrollTo = scrollTo;

    return scroll;
});