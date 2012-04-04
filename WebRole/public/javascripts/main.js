var jQT = new $.jQTouch({
    icon: 'jqtouch.png',
    statusBar: 'black-translucent',
    preloadImages: []
});

$(function () {
    $('#loginButton').click(function () {
        var userName, password;

        userName = $('#userNameTextbox').val();
        password = $('#passwordTextbox').val();

        // alert('doLogin(userName, password);');
        gotoPage(userName, password);
    });

    $('#portfoliosButton').click(function () {
        // alert('portfolios loaded');
        $.get('/portfolios', function (data) {
            $('#portfolios_body').html(data);
            jQT.goTo($('#portfolios'));
            //alert('Load was performed.');
        });
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