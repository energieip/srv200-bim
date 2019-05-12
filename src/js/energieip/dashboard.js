$(document).ready(function() {
    if ($.cookie(energieip.accessToken)) {
        getUserInfo();
    } else {
        window.location.href = 'login.html';
    }
});

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: energieip.weblink + "user/info",
        cache: false,
        credentials: 'include',
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
       },
        statusCode: {
            200: function (response) {
                var priviledges = response["priviledges"];
                displayDashboard(priviledges);
            },
            401: function (response) {
                window.location.href = 'login.html';
            }
        },
    });
};

function displayDashboard(priviledges) {
    logout = document.createElement("input");
    logout.type = "image";
    logout.title = "Logout";
    logout.src = "images/logout.png";
    logout.alt = "Logout";
    logout.style.float = "right";
    // logout.style.left = "100px";
    logout.onclick = function () {
        window.location.href = 'logout.html';
    };
    placeHolder = document.getElementById("top");
    placeHolder.appendChild(logout);

    
    if (priviledges.includes('admin')){
        maintenance = document.createElement("input");
        maintenance.type = "image";
        maintenance.title = "Maintenance";
        maintenance.src = "images/toolbox.png";
        maintenance.alt = "Maintenance";
        maintenance.onclick = function () {
            window.location.href = 'maintenance.html';
        };
        placeHolder = document.getElementById("dash");
        placeHolder.appendChild(maintenance);

        stats = document.createElement("input");
        stats.type = "image";
        stats.value = "Statistics";
        stats.src = "images/graph.jpg";
        stats.onclick = function () {
            window.location.href = 'statistics.html';
        };
        placeHolder = document.getElementById("dash");
        placeHolder.appendChild(stats);

    } else {
        view = document.createElement("input");
        view.type = "image";
        view.value = "View";
        view.src = "images/magnifier.png";
        view.onclick = function () {
            window.location.href = 'supervision.html';
        };
        placeHolder = document.getElementById("dash");
        placeHolder.appendChild(view);
    }
}
