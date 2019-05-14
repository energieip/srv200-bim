Init();

logout = document.createElement("input");
logout.type = "image";
logout.title = "Logout";
logout.src = "images/logout.png";
logout.alt = "Logout";
logout.style.float = "right";
logout.onclick = function () {
    window.location.href = 'logout.html';
};
placeHolder = document.getElementById("top");
placeHolder.appendChild(logout);

dashboard = document.createElement("input");
dashboard.type = "image";
dashboard.title = "Dashboard";
dashboard.src = "images/home.jpeg";
dashboard.alt = "Dashboard";
dashboard.style.float = "left";
dashboard.onclick = function () {
    window.location.href = 'dashboard.html';
};
placeHolder.appendChild(dashboard);


statusElt = document.createElement("input");
statusElt.type = "image";
statusElt.title = "Status";
statusElt.src = "images/magnifier-icon.png";
statusElt.alt = "Status";
statusElt.onclick = function () {
    Display("status");
};
placeHolder = document.getElementById("bottom");
placeHolder.appendChild(statusElt);

statusGr = document.createElement("input");
statusGr.type = "image";
statusGr.title = "Group Status";
statusGr.src = "images/magnifier-group.png";
statusGr.alt = "Group Status";
statusGr.onclick = function () {
    Display("statusGroup");
};
placeHolder.appendChild(statusGr);

controlElt = document.createElement("input");
controlElt.type = "image";
controlElt.title = "Control";
controlElt.src = "images/wrench.jpg";
controlElt.alt = "control";
controlElt.onclick = function () {
    Display("control");
};
placeHolder.appendChild(controlElt);

controlGr = document.createElement("input");
controlGr.type = "image";
controlGr.title = "Group Control";
controlGr.src = "images/wrench-group.jpg";
controlGr.alt = "Group Control";
controlGr.onclick = function () {
    Display("controlGroup");
};
placeHolder.appendChild(controlGr);

$(document).ready(function() {
    if ($.cookie(energieip.accessToken)!= null) {
        CreateView(false);
    } else {
        window.location.href = energieip.loginPage;
    }
});
