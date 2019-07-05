$(document).ready(function() {
    window.buttons = [];
    setBusy(true);
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
    window.buttons.push(btn);
}

var modal = document.getElementById('id01');
var spinner = document.getElementById('spinner');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function setBusy(value) {
    for (var i = 0; i < window.buttons.length; i++) {
        if (value === true) {
            window.buttons[i].style.display = 'none';
        } else {
            window.buttons[i].style.display = 'block';
        }
    }
    if (value === true) {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
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
                setBusy(false);
            },
            401: function (response) {
                window.location.href = energieip.loginPage;
            }
        },
    });
};

function pollUpload(){
    $.ajax({
        type: "GET",
        url: energieip.weblink + "map/upload/status",
        cache: false,
        credentials: 'include',
        dataType: 'json',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
       },
        statusCode: {
            200: function (response) {
                switch (response["status"]){
                    case "running":
                        setTimeout(pollUpload, 2000);
                        break;
                    case "none":
                        break;
                    case "success":
                        setBusy(false);
                        alert("File successfuly uploaded")
                        break;
                    case "failure":
                        setBusy(false);
                        alert("Error during file post-analysis")
                        break;
                }
            },
            401: function (response) {
                window.location.href = energieip.loginPage;
            },
            500: function(response){
                alert('file not uploaded');
                setBusy(false);
            }
        },
    });
}

function displayDashboard(priviledge) {
    CreateButton("Logout", "images/logout.png", "top", "right", function () {
        window.location.href = 'logout.html';
    });

    if (['admin', 'maintainer'].includes(priviledge)){
        CreateButton("Maintenance", "images/toolbox.png", "dash", "left", function () {
            window.location.href = 'maintenance.html';
        });

        CreateButton("Statistics", "images/graph.jpg", "dash", "left", function () {
            window.location.href = 'statistics.html';
        });

        CreateButton("Upload", "images/upload.png", "dash",  "left", function () {
           modal.style.display='block'
        });

        CreateButton("Installation Status", "images/download_xlsx.png", "dash",  "left", function () {
            window.location.href = energieip.weblink + "install/status";
        });

        CreateButton("Installation Status", "images/download-pdf.png", "dash",  "left", function () {
            window.location.href = energieip.weblink + "install/stickers";
        });

        $("#uploadForm").submit(function( event ) {
            modal.style.display = "none";
            setBusy(true);
            // Stop form from submitting normally
            event.preventDefault();

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
                        pollUpload();
                    },
                    401: function (response) {
                        window.location.href = energieip.loginPage;
                    },
                    500: function(response){
                        alert('file not uploaded');
                        setBusy(false);
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
