$.jQTouch({
    icon: 'jqtouch.png',
    statusBar: 'black-translucent',
    preloadImages: []
});

// Some sample Javascript functions:
$(function () {
    var auth;

    $('#loginButton').click(function () {
        var userName, password;

        userName = $('#userNameTextbox').val();
        password = $('#passwordTextbox').val();

        doLogin(userName, password);
    });

    function doLogin(userName, password) {
        alert(now.encodeBase64(userName + password));

        $.ajax({
            type: 'POST',
            url: '/login',
            data: { usr: userName, pw: password },
            dataType: 'json',
            async: true,
            success: function (body) {
                // Add code here...
            },
            error: function (xhr, type) {
                // Add code here...
            }
        })
        // alert(userName + ' - ' + password);
    }
    
    // jQuery
    $.ajax({
        url: url,
        method: 'GET',
        beforeSend: function (req) {
            req.setRequestHeader('Authorization', auth);
        }
    });
});
