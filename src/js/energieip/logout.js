$(document).ready(function() {
    if ($.cookie(energieip.accessToken)) {
        $.removeCookie(energieip.accessToken, { path: '/' });
    }
    window.location.href = 'index.html';
});
