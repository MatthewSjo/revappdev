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

    // Try: $('div').bind and then a big switch...
    $('#portfolios').bind('pageAnimationEnd', function (event, info) {
        // alert('portfolios loaded');
        $.ajax({
            url: '/portfolios',
            method: 'GET',
            success: function (body) {
                // Add code here...
                // alert(body);
                $('#portfolios_details').html(body);
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
                    jQT.goTo($('#portfolios'));
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