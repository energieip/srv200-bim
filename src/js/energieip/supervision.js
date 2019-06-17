Init(false);

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

CreateButton("Logout", "images/logout.png", "top", "right", function () {
    window.location.href = 'logout.html';
});

if (Object.keys(window.maps).length > 1){
    CreateButton("Previous", "images/prev.png", "top", null, function () {
        SwapMap(prev=true, null);
    });

    CreateButton("Next", "images/next.png", "top", null, function () {
        SwapMap(null, next=true);
    });
}

CreateButton("Dashboard", "images/home.jpeg", "top", "left", function () {
    window.location.href = 'dashboard.html';
});

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

$(document).ready(function() {
    if ($.cookie(energieip.accessToken)!= null) {
        CreateView(window.maps[window.index.toString()]);
    } else {
        window.location.href = energieip.loginPage;
    }
});
