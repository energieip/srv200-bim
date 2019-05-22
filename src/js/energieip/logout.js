$(document).ready(function() {
    if ($.cookie(energieip.accessToken)) {
        $.ajax({
            type: "POST",
            url: energieip.weblink + "user/logout",
            cache: false,
            dataType: 'json',
            credentials: 'include',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            statusCode: {
                200: function (response) {
                    window.location.href = 'index.html';
                },
                default: function (response) {
                   alert(response);
                },
            }
        });
    } else{
        window.location.href = 'index.html';
    }
});
