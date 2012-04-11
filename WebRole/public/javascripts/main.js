var myScroll;

// Initialize jQTouch
var jQT = new $.jQTouch({
    addGlossToIcon: true,
    themeSelectionSelector: '#jqt #themes ul',
    useFastTouch: true,
    statusBar: 'default',
    preloadImages: [
		'img/loading.gif',
		'img/iTab-glossy.png',
		'img/pinstripes2.gif',
		'img/UIBack.png',
		'img/UIBackPressed.png'
		]
});

// Main functions:
Zepto(function ($) { //$(function () {
    
    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------
    
    function rebuildScroll(id) {
        if (myScroll) {
            myScroll.destroy();
            myScroll = null;
            //alert('destroy iscroll')
        }

        if ($('div#' + id + ' #wrapper').get(0)) {
            setTimeout(function () {
                myScroll = new iScroll($('div#' + id + ' #wrapper').get(0));
                //alert('New iscroll');
            }, 0);
        }
    }

    function showTabBar() {
        //$("div.container").show();
        $('#tabbar').show(); // If image gif
    }

    function hideTabBar() {
        //$("div.container").show();
        $('#tabbar').hide(); // If image gif
    }

    // ------------------------------------------
    // PAGE ANIMATION EVENTS
    // ------------------------------------------

    //    $(document).on('pageAnimationStart', '#login', function (e, info) {
    //        // $('#login').bind('pageAnimationEnd', function (e, info) {
    //        // rebuildScroll(e.target.id);
    //        // console.log('#login start:', e, info);
    //    }); //pageAnimationEnd

    $(document).on('pageAnimationEnd', '#dashboard', function (e, info) {
        //console.log('#dashboard:', e, info)
        if (info.direction == 'in') {
            // alert('portfolios loaded');
            $.ajax({
                url: '/dashboard',
                method: 'GET',
                success: function (body) {
                    // Add code here...
                    // alert(body);
                    rebuildScroll(e.target.id);
                    //$('#dashboard_body').html(body);
                    $('small#badge_portfolios').html(body).show();
                },
                error: function (xhr, type) {
                    alert(xhr);
                }
            });
        }
    });

    $(document).on('pageAnimationEnd', '#eula', function (e, info) {
        if (info.direction == 'in') {
            // alert('portfolios loaded');
            $.get('/eula', function (data) {
                rebuildScroll(e.target.id);
                $('#eula_body').html(data);
            });
        }
    });

    $(document).on('pageAnimationEnd', '#portfolios', function (e, info) {
        if (info.direction == 'in') {
            // alert('portfolios loaded');
            $.get('/portfolios', function (data) {
                rebuildScroll(e.target.id);
                $('#portfolios_body').html(data);
            });
        }
    });

    // ------------------------------------------
    // CLICK EVENTS
    // ------------------------------------------

    //$('#portfoliosButton').bind('click', function (e, info) {
    $('#portfoliosButton').click(function () {
        jQT.goTo($('#portfolios'));
        //        $.get('/portfolios', function (data) {
        //            rebuildScroll(e.target.id);
        //            $('#portfolios_body').html(data);
        //            
        //        });
    });

    $('#eulaButton').click(function () {
        jQT.goTo($('#eula'));
    });

    $(document).on('click', 'a#loginButton', function (e) {
        var userName, password;

        userName = $('#userNameTextbox').val();
        password = $('#passwordTextbox').val();

        // alert('doLogin(userName, password);');

        var uri = $(this).attr("href");
        // alert('Click on: ' + uri + ' was blocked!');
        $.post('/login', { usr: userName, pw: password }, function (body) {
            if (body.logged) {
                jQT.goTo($('#dashboard'));
            }
        }, "json")
        return false;
    });
});