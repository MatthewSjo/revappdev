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
        var username, password, token;

        // Obtain the username and password from the form.
        username = $('#userNameTextbox').val();
        password = $('#passwordTextbox').val();

        // Create a Base64 encoded token from the credentials.
        token = 'Basic ' + helper.Base64.encode(username + ':' + password);

        // Post the created token and the user's email to the authenticate action.
        $.post('/authenticate', { email: username, token: token }, function (response) {
            // If our response indicates that the user has been authenticated...
            if (response.authenticated) {
                // ...redirect to the default page.
                window.location = '/index';
            }
        }, 'json');

        return false;
    });

    // ------------------------------------------
    // DASHBOARD PAGE
    // ------------------------------------------

    $(document).on('pageAnimationStart', '#dashboard', function (e, info) {
        console.log('#dashboard start:', e, info);
    });

    $(document).on('pageAnimationEnd', '#dashboard', function (e, info) {
        console.log('#dashboard end:', e, info)
        if (info.direction == 'in') {
            /* 
            $.ajax({
                url: '/dashboard',
                method: 'GET',
                dataType: 'json',
                success: function (body) {
                    if (body.redirect) {
                        // window.location = body.url;
                    }
                    // Add code here...
                    // alert(body);
                    rebuildScroll(e.target.id);
                    $('small#badge_portfolios').html(body).show();
                },
                error: function (xhr, type) {
                    alert(xhr);
                }
            }); 
            */
        }
    });

    // ------------------------------------------
    // PORTFOLIOS PAGE
    // ------------------------------------------

    $(document).on('pageAnimationEnd', '#portfolios', function (e, info) {
        if (info.direction == 'in') {
            $.get('/portfolios', function (data) {
                rebuildScroll(e.target.id);
                $('#portfolios_body').html(data);
            });
        }
    });

    $('#portfoliosButton').click(function () {
        jQT.goTo($('#portfolios'));
    });

    // ------------------------------------------
    // DEFAULT ANALYSIS PAGE
    // ------------------------------------------

    $(document).on('click', '.defaultAnalysisLink', function (e) {
        var uri = $(this).attr("href");
        // alert('Click on: ' + uri + ' was blocked!');
        $.post('/portfolioAnalysis', { uri: uri }, function (data) {
            $('#portfolioAnalysis_body').html(data);
            jQT.goTo($('#portfolioAnalysis'));
        })
        return false;
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
        try {
            myScroll.scrollTo(0, 0, 200)
        } catch (e) {

        }
        
    });

    $(document).on('ajaxComplete', function (event, request, settings) {
        // Return false to cancel this request.
        var obj = {};
        try {
            obj = JSON.parse(request.response);
        } catch (e) {
    
        }
         
        console.log('ajaxComplete', event, request, settings, obj);
    });

});