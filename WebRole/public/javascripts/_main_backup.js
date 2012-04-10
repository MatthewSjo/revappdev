var jQT = new $.jQTouch({
    icon: 'jqtouch.png',
    statusBar: 'black-translucent',
    preloadImages: []
});
// execute JavaScript when the page DOM is ready
Zepto(function ($) {
    var wrap_portfolios;
    var wrap_eula;
    var wrap_test;

    // It's not necessary... try it a bit just to be sure...
    setTimeout(function () {
        wrap_portfolios = new iScroll('wrap_portfolios', {});
        wrap_eula = new iScroll('wrap_eula', {});
        wrap_test = new iScroll('wrap_test', {});
    }, 100);

    $('#portfolios')[0].addEventListener('touchmove', function (e) { e.preventDefault(); });
    $('#eula')[0].addEventListener('touchmove', function (e) { e.preventDefault(); });

    $('#loginButton').click(function () {
        var userName, password;

        userName = $('#userNameTextbox').val();
        password = $('#passwordTextbox').val();

        // alert('doLogin(userName, password);');
        gotoPage(userName, password);
    });

    $('#portfoliosButton').click(function () {
        $.get('/portfolios', function (data) {
            $('#portfolios_body').html(data);
            setTimeout(function () {
                wrap_portfolios.refresh();
                jQT.goTo($('#portfolios'));
            }, 0);
        });
    });

    $('#testButton').click(function () {
        $.get('/test', function (data) {
            $('#test_body').html(data);
            setTimeout(function () {
                wrap_test = new iScroll('scroll_test', {});
                wrap_test.refresh();
                jQT.goTo($('#test'));
            }, 0);
        });
    });

    $('#eulaButton').click(function () {
        $.get('/eula', function (data) {
            $('#eula_body').html(data);
            setTimeout(function () {
                wrap_eula.refresh();
                jQT.goTo($('#eula'));
            }, 0);

        });
    });

    $(document).on('click', '.defaultAnalysisLink', function (e) {
        var uri = $(this).attr("href");
        // alert('Click on: ' + uri + ' was blocked!');
        $.post('/defaultAnalysis', { uri: uri }, function (data) {
            $('#defaultAnalysis_body').html(data);
            jQT.goTo($('#defaultAnalysis'));
        })
        return false;
    });

    // Try: $('div').bind and then a big switch...
    $('#dashboard').bind('pageAnimationEnd', function (event, info) {
        // alert('portfolios loaded');
        $.ajax({
            url: '/dashboard',
            method: 'GET',
            success: function (body) {
                // Add code here...
                // alert(body);
                $('#dashboard_body').html(body);
            },
            error: function (xhr, type) {
                alert(xhr);
            }
        });
    });

    function gotoPage(userName, password) {
        $.ajax({
            type: 'POST',
            url: '/login',
            data: { usr: userName, pw: password },
            dataType: 'json',
            async: true,
            success: function (body) {
                // Add code here...
                if (body.logged) {
                    jQT.goTo($('#dashboard'));
                }
                // alert(body.name);
            },
            error: function (xhr, type) {
                // Add code here...
                alert('error');
            }
        });

    }
});

//$(function () {
//    alert(ciccio);

//});