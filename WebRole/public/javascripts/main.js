var MobileApp = {}; // Main app namespace
var myScroll;

// Initialize jQTouch
var jQT = new $.jQTouch({
    addGlossToIcon: true,
    themeSelectionSelector: '#jqt #themes ul',
    useFastTouch: true,
    statusBar: 'default',
    preloadImages: [
            'images/login_background.png',
            'images/login_r.png'
		]
});

// Main functions:
Zepto(function ($) {

    // ------------------------------------------
    // MAIN ENTRY POINT
    // ------------------------------------------

    (function main() {
        // window.location = '/iPadLogin'; // console.log('logged');

        $.get('/isUserLoggedIn', function (data) {
            if (data && data.success && data.logged) {
            }
        }, "json");
    })();

    // ------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------

    function rebuildScroll(id) {
        if (myScroll) {
            myScroll.destroy();
            myScroll = null;
        }

        if ($('div#' + id + ' #wrapper').get(0)) {
            setTimeout(function () {
                myScroll = new iScroll($('div#' + id + ' #wrapper').get(0)); // , { hScrollbar: false, vScrollbar: true }
            }, 0);
        }
    }


    // ------------------------------------------
    // LOGIN PAGE
    // ------------------------------------------

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

    // ------------------------------------------
    // DASHBOARD PAGE
    // ------------------------------------------

    $(document).on('pageAnimationStart', '#dashboard', function (e, info) {
        // alert('start dashboard');
        window.location = '/iPadLogin';
    });

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
                    $('small#badge_portfolios').html(body).show();
                },
                error: function (xhr, type) {
                    alert(xhr);
                }
            });
        }
    });

    // ------------------------------------------
    // PORTFOLIOS PAGE
    // ------------------------------------------

    $(document).on('pageAnimationEnd', '#portfolios', function (e, info) {
        if (info.direction == 'in') {
            // alert('portfolios loaded');
            $.get('/portfolios', function (data) {
                rebuildScroll(e.target.id);
                $('#portfolios_body').html(data);
            });
        }
    });

    //$('#portfoliosButton').bind('click', function (e, info) {
    $('#portfoliosButton').click(function () {
        jQT.goTo($('#portfolios'));
        //        $.get('/portfolios', function (data) {
        //            rebuildScroll(e.target.id);
        //            $('#portfolios_body').html(data);
        //            
        //        });
    });

    // ------------------------------------------
    // EULA PAGE
    // ------------------------------------------

    $('#eulaButton').click(function () {
        jQT.goTo($('#eula'));
    });

    $(document).on('pageAnimationEnd', '#eula', function (e, info) {
        if (info.direction == 'in') {
            $.get('/eula', function (data) {
                rebuildScroll(e.target.id);
                $('#eula_body').html(data);
            }, 'xml');
        }
    });

    // ------------------------------------------
    // COMMON
    // ------------------------------------------

    $('.toolbar').click(function () {
        myScroll.scrollTo(0, 0, 200)
    });
});