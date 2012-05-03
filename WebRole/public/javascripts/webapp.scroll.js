// ------------------------------------------
// ISCROLL
// ------------------------------------------

WebAppLoader.addModule({ name: 'scroll' }, function () {
    var myScroll, scroll = {};

    function rebuildScroll(id, optionConfig) {
        var wrapper = 'div#' + id + ' #wrapper',
                options = optionConfig || {}; // { hScrollbar: false, vScrollbar: true }

        if (myScroll) {
            myScroll.destroy();
            myScroll = null;
        }

        if ($(wrapper).get(0)) {
            setTimeout(function () {
                myScroll = new iScroll($(wrapper).get(0), options);
            }, 0);
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