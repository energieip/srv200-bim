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

function CreateImage(name, img, elt, pos) {
    logo = document.createElement("img");
    logo.title = name;
    logo.src = img;
    logo.alt = name;
    if (pos != null){
        logo.style.float = pos;
    }
    if (elt != null){
        placeHolder = document.getElementById(elt);
    }
    placeHolder.appendChild(logo);
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

CreateButton("Dashboard", "images/bouton-home.png", "top", "left", function () {
    window.location.href = 'dashboard.html';
});
CreateImage("EnergieIP", "images/logo-energieip.png", "top", "center");
CreateButton("Logout", "images/bouton-logout.png", "top", "right", function () {
    window.location.href = 'login.html';
});

if (Object.keys(window.maps).length > 1){
    CreateButton("Previous", "images/previous-floor.png", "floor", "left", function () {
        SwapMap(prev=true, null);
    });
}
CreateText("", "floor", "left");
if (Object.keys(window.maps).length > 1){
    CreateButton("Next", "images/next-floor.png", "floor", "left", function () {
        SwapMap(null, next=true);
    });
}

CreateButton("Status", "images/bouton-status.png", "controls", null, function () {
    Display("status");
});

CreateButton("Group Status", "images/bouton-group-status.png", "controls", null, function () {
    Display("statusGroup");
});

CreateButton("Control", "images/bouton-control.png", "controls", null, function () {
    Display("control");
});

CreateButton("Group Control", "images/bouton-group-control.png", "controls", null, function () {
    Display("controlGroup");
});

CreateButton("Configuration", "images/bouton-configuration.png", "controls", null, function () {
    Display("configuration");
});

CreateButton("Group Configuration", "images/bouton-group-configuration.png", "controls", null, function () {
    Display("configurationGroup");
});

CreateButton("Ifc", "images/bouton-IFC.png", "controls", null, function () {
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
