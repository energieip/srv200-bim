$(document).ready(function() {
    if ($.cookie(energieip.accessToken)) {
        getUserInfo();
    } else {
        window.location.href = energieip.loginPage;
    }
});


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
    if (elt != null){
        placeHolder = document.getElementById(elt);
    }
    placeHolder.appendChild(btn);
}

var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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
                var priviledge = response["priviledge"];
                displayDashboard(priviledge);
            },
            401: function (response) {
                window.location.href = energieip.loginPage;
            }
        },
    });
};

function displayDashboard(priviledge) {
    CreateButton("Logout", "images/logout.png", "top", "right", function () {
        window.location.href = 'logout.html';
    });

    if (['admin', 'maintainer'].includes(priviledge)){
        CreateButton("Maintenance", "images/toolbox.png", "dash", "left", function () {
            window.location.href = 'maintenance.html';
        });

        CreateButton("Statistics", "images/graph.jpg", "dash", null, function () {
            window.location.href = 'statistics.html';
        });

        CreateButton("Upload", "images/upload.png", "dash", null, function () {
           modal.style.display='block'
        });

        $("#upload").click(function() {
            var fd = new FormData();
            var files = $('#file')[0].files[0];
            fd.append('file',files);

            $.ajax({
                type: "POST",
                url: energieip.weblink + "map/upload",
                cache: false,
                credentials: 'include',
                data: fd,
                dataType: 'json',
                contentType: false,
                processData: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
               },
                statusCode: {
                    200: function (response) {
                        alert('file uploaded');
                    },
                    401: function (response) {
                        window.location.href = energieip.loginPage;
                    },
                    500: function(response){
                        alert('file not uploaded');
                    }
                },
            });
        });

    } else {
        CreateButton("View", "images/magnifier.png", "dash", "left", function () {
            window.location.href = 'supervision.html';
        });
    }
}
