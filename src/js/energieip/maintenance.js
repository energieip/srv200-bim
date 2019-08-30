Init(true);

function CreateButton(name, img, elt, pos, action){
    btn = document.createElement("input");
    btn.type = "image";
    btn.title = name;
    btn.src = img;
    btn.alt = name;
    if (pos != null){
        btn.style.float = pos;
    }
    btn.onclick = action;
    placeHolder = document.getElementById(elt);
    placeHolder.appendChild(btn);
}

function CreateText(content, elt, pos){
    lbl = document.createElement("p");
    lbl.innerHTML = content;
    lbl.id = "title";
    lbl.visibility = "visible";
    if (pos != null){
        lbl.style.float = pos;
    }
    placeHolder = document.getElementById(elt);
    placeHolder.appendChild(lbl);
}

CreateButton("Logout", "images/logout.png", "top", "right", function () {
    window.location.href = 'logout.html';
});

CreateButton("Dashboard", "images/home.jpeg", "top", "left", function () {
    window.location.href = 'dashboard.html';
});

if (Object.keys(window.maps).length > 1){
    CreateButton("Previous", "images/prev.png", "top", "left", function () {
        SwapMap(prev=true, null);
    });
}
CreateText("", "top", "left");
if (Object.keys(window.maps).length > 1){
    CreateButton("Next", "images/next.png", "top", "left", function () {
        SwapMap(null, next=true);
    });
}

CreateButton("Status", "images/magnifier-icon.png", "bottom", null, function () {
    Display("status");
});

CreateButton("Group Status", "images/magnifier-group.png", "bottom", null, function () {
    Display("statusGroup");
});

CreateButton("Control", "images/wrench.jpg", "bottom", null, function () {
    Display("control");
});

CreateButton("Group Control", "images/wrench-group.jpg", "bottom", null, function () {
    Display("controlGroup");
});

CreateButton("Configuration", "images/wheel.png", "bottom", null, function () {
    Display("configuration");
});

CreateButton("Group Configuration", "images/wheel-group.png", "bottom", null, function () {
    Display("configurationGroup");
});

CreateButton("Ifc", "images/info.png", "bottom", null, function () {
    Display("ifcInfo");
});

$(document).ready(function() {
    if ($.cookie(energieip.accessToken)!= null) {
        var entrance = window.index.toString();
        if (Object.keys(window.maps).length > 1){
            for (var storey in window.maps){
                var map = window.maps[storey];
                if (map["default"] == true){
                    entrance = storey;
                    window.index = parseInt(storey);
                }
            }
        }
        CreateView(window.maps[entrance]);
    } else {
        window.location.href = energieip.loginPage;
    }
});
