/// <reference path="helper.js" />

$.jQTouch({
    icon: 'jqtouch.png',
    statusBar: 'black-translucent',
    preloadImages: []
});

// Some sample Javascript functions:
$(function () {
    var auth, url;
    now.name = 'Asa';

    $('#loginButton').click(function () {
        var userName, password;

        userName = $('#userNameTextbox').val();
        password = $('#passwordTextbox').val();

        doLogin(userName, password);
    });

    function doLogin(userName, password) {
        // alert(now.encodeBase64(userName + password));
        now.auth = userName + password;
        now.encodeBase64();

        url = 'https://revapidev.statpro.com/v1/service';
        auth = 'Basic ' + helper.Base64.encode(userName + ':' + password);

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'jsonp',
            beforeSend: function (req) {
                req.setRequestHeader('Authorization', auth);
            },
            success: function (body) {
                // Add code here...
                alert('body: ', body);
            },
            error: function (xhr, type) {
                alert(xhr);
            }
        });


        //        $.ajax({
        //            type: 'GET',
        //            url: now.webbAPI.URI,
        //            // data: { usr: userName, pw: password },
        //            // dataType: 'json',
        //            // async: true,
        //            beforeSend: function (req) {
        //                req.setRequestHeader('Authorization', auth);
        //            },
        //            success: function (body) {
        //                // Add code here...
        //                console.log('body: ', body);
        //            },
        //            error: function (xhr, type) {
        //                // Add code here...
        //            }
        //        })
        // alert(userName + ' - ' + password);
    }

    //    // jQuery
    //    $.ajax({
    //        url: url,
    //        method: 'GET',
    //        beforeSend: function (req) {
    //            req.setRequestHeader('Authorization', auth);
    //        }
    //    });
});
