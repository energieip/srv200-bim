$(document).ready(function() {
    if ($.cookie(energieip.accessToken)) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'login.html';
    }
});
