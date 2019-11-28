$(document).ready(function() {
    window.buttons = [];
    setBusy(true);
    if ($.cookie(energieip.accessToken)) {
        getUserInfo();
    } else {
        window.location.href = energieip.loginPage;
    }
});

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
var importDBBt = document.getElementById('importDB');
var commissioningBt = document.getElementById('commissioning');
var removeBt = document.getElementById('remove');
var replaceBt = document.getElementById('replace');
var qrcodeBt = document.getElementById('qrcode');
var spinner = document.getElementById('spinner');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == importDBBt) {
        importDBBt.style.display = "none";
    }
    if (event.target == commissioningBt) {
        commissioningBt.style.display = "none";
    }
    if (event.target == removeBt) {
        removeBt.style.display = "none";
    }
    if (event.target == replaceBt) {
        replaceBt.style.display = "none";
    }
    if (event.target == qrcodeBt) {
        qrcodeBt.style.display = "none";
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

function pollImportDB(){
    $.ajax({
        type: "GET",
        url: energieip.weblink + "maintenance/importDB/status",
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
                        setTimeout(pollImportDB, 2000);
                        break;
                    case "none":
                        break;
                    case "success":
                        setBusy(false);
                        alert("Database successfuly imported")
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

function pollExportDbDownload(){
    $.ajax({
        type: "GET",
        url: energieip.weblink + "maintenance/exportDB",
        cache: false,
        crossDomain: true,
        responseType: "blob",
        xhrFields: {
            withCredentials: true
        },
        statusCode: {
            200: function (response, textStatus, request) {
                window.location.href = energieip.weblink + "maintenance/exportDB";
                setBusy(false);
            },
            201: function (response) {
                setTimeout(pollExportDbDownload, 2000);
            },
            401: function (response) {
                window.location.href = energieip.loginPage;
            },
            500: function(response){
                alert('file not downloaded');
                setBusy(false);
            }
        },
    });
}

function displayDashboard(priviledge) {
    CreateButton("Home", "images/bouton-home.png", "top", "left", function () {
        window.location.href = 'dashboard.html';
    });
    CreateImage("EnergieIP", "images/logo-energieip.png", "top", "center");
    CreateButton("Logout", "images/bouton-logout.png", "top", "right", function () {
        window.location.href = 'login.html';
    });

    if (['admin', 'maintainer'].includes(priviledge)){
        CreateButton("Maintenance", "images/bouton-maintenance.png", "row1", "left", function () {
            window.location.href = 'maintenance.html';
        });

        CreateButton("Statistics", "images/bouton-statistics.png", "row1", "left", function () {
            window.location.href = 'statistics.html';
        });

        CreateButton("Upload IFC", "images/bouton-upload-ifc.png", "row1",  "left", function () {
           modal.style.display='block'
        });

        CreateButton("Installation Status", "images/bouton-installation-status.png", "row1",  "left", function () {
            window.location.href = energieip.weblink + "install/status";
        });

        CreateButton("Modbus Table", "images/bouton-modbus-table.png", "row1",  "left", function () {
            window.location.href = energieip.weblink + "install/modbusTable";
        });

        CreateButton("Cable stickers", "images/bouton-cable-stikers.png", "row1",  "left", function () {
            window.location.href = energieip.weblink + "install/stickers";
        });

        CreateButton("Database Export", "images/bouton-export-database.png", "row2",  "left", function () {
            setBusy(true);
            pollExportDbDownload();
        });

        CreateButton("Dabatase Import", "images/bouton-import-database.png", "row2",  "left", function () {
            importDBBt.style.display='block'
         });

        CreateButton("Commissioning", "images/bouton-commissioning.png", "row2",  "left", function () {
            commissioningBt.style.display='block'
        });

        CreateButton("Remove association", "images/bouton-remove-association.png", "row2",  "left", function () {
            removeBt.style.display='block'
        });

        CreateButton("Replace driver", "images/bouton-replace-driver.png", "row2",  "left", function () {
            replaceBt.style.display='block'
        });

        CreateButton("QRCode driver", "images/bouton-QRcode-driver.png", "row2",  "left", function () {
            qrcodeBt.style.display='block'
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

        $("#importDBForm").submit(function( event ) {
            importDBBt.style.display = "none";
            setBusy(true);
            // Stop form from submitting normally
            event.preventDefault();

            var fd = new FormData();
            var files = $('#fileDB')[0].files[0];
            fd.append('file',files);

            $.ajax({
                type: "POST",
                url: energieip.weblink + "maintenance/importDB",
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
                        pollImportDB();
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

        $("#commissioningForm").submit(function( event ) {
            commissioningBt.style.display = "none";
            setBusy(true);
            // Stop form from submitting normally
            event.preventDefault();

            var $form = $(this);
            var label = $form.find("input[name='label']").val();
            var type = $form.find("select[name='type']").val();
            var mac = $form.find("input[name='mac']").val();

            var regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
            var valid = regex.test(mac);
            if (valid != true) {
                alert("Invalid mac address format: "+ mac);
                setBusy(false);
                return;
            }

            var data = {
                "label": label,
                "device": type,
                "fullMac": mac
            };

            $.ajax({
                type: "POST",
                url: energieip.weblink + "commissioning/install",
                cache: false,
                credentials: 'include',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: false,
                processData: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
               },
                statusCode: {
                    200: function (response) {
                        alert('Success');
                        setBusy(false);
                    },
                    401: function (response) {
                        window.location.href = energieip.loginPage;
                    },
                    500: function(response){
                        var message = response.responseJSON.message;
                        alert('Commissioning failure: '+ message);
                        setBusy(false);
                    }
                },
            });
        });

        $("#removeForm").submit(function( event ) {
            removeBt.style.display = "none";
            setBusy(true);
            // Stop form from submitting normally
            event.preventDefault();

            var $form = $(this);
            var label = $form.find("input[name='label']").val();
            var type = $form.find("select[name='type']").val();

            var data = {
                "label": label,
                "device": type,
                "fullMac": ""
            };

            $.ajax({
                type: "POST",
                url: energieip.weblink + "commissioning/install",
                cache: false,
                credentials: 'include',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: false,
                processData: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
               },
                statusCode: {
                    200: function (response) {
                        alert('Success');
                        setBusy(false);
                    },
                    401: function (response) {
                        window.location.href = energieip.loginPage;
                    },
                    500: function(response){
                        var message = response.responseJSON.message;
                        alert('Removal failure: '+ message);
                        setBusy(false);
                    }
                },
            });
        });

        $("#replaceForm").submit(function( event ) {
            replaceBt.style.display = "none";
            setBusy(true);
            // Stop form from submitting normally
            event.preventDefault();

            var $form = $(this);
            var oldMac = $form.find("input[name='old']").val();
            var oldType = $form.find("select[name='oldType']").val();
            var newMac = $form.find("input[name='new']").val();
            var newType = $form.find("select[name='newType']").val();

            var regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
            var valid = regex.test(oldMac);
            if (valid != true) {
                alert("Invalid mac address format: "+ oldMac);
                setBusy(false);
                return;
            }

            var valid = regex.test(newMac);
            if (valid != true) {
                alert("Invalid mac address format: "+ newMac);
                setBusy(false);
                return;
            }

            if (newType != oldType){
                alert("Incompatible driver type");
                setBusy(false);
                return;
            }

            var data = {
                "oldFullMac": oldMac,
                "newFullMac": newMac
            };

            $.ajax({
                type: "POST",
                url: energieip.weblink + "maintenance/driver",
                cache: false,
                credentials: 'include',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: false,
                processData: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
               },
                statusCode: {
                    200: function (response) {
                        alert('Success');
                        setBusy(false);
                    },
                    401: function (response) {
                        window.location.href = energieip.loginPage;
                    },
                    500: function(response){
                        var message = response.responseJSON.message;
                        alert('Replace failure: '+ message);
                        setBusy(false);
                    }
                },
            });
        });

        $("#qrcodeForm").submit(function( event ) {
            qrcodeBt.style.display = "none";
            setBusy(true);
            // Stop form from submitting normally
            event.preventDefault();

            var $form = $(this);
            var mac = $form.find("input[name='mac']").val();
            var type = $form.find("select[name='type']").val();

            var regex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
            var valid = regex.test(mac);
            setBusy(false);
            if (valid != true) {
                alert("Invalid mac address format: "+ mac);
                return;
            }

            window.location.href = energieip.weblink + "install/qrcode?mac="+mac+"&device="+type;

        });
    } else {
        CreateButton("View", "images/bouton-supervision.png", "row1", "left", function () {
            window.location.href = 'supervision.html';
        });
    }
}
