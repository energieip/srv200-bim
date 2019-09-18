function CreateView(map){
    var labels = '';

    window.scene = new xeogl.Scene({
        canvas: "myCanvas",
        transparent: true
    });

    xeogl.setDefaultScene(window.scene);

    var camera = window.scene.camera;
    var input = window.scene.input;

    var buf = {};

    // Logs text to the page
    function log(action, mac, params) {
        if (action  ===  "remove") {
            if (mac in buf) {
                delete buf[mac];
            }
        } else {
            buf[mac] = params;
        }
      
        document.getElementById("log").innerText = Object.values(buf).join("\n");
    }

    function repartitionning() {
        var leds = [];
        var sensors = [];
        var blinds = [];
        var hvacs = [];
        var nanos = [];
        for (var label in window.model.meshes){
            if (window.drivers.hasOwnProperty(label)){
                var d = window.drivers[label];
                if (window.model.meshes[label].selected === true) {
                    switch (d.deviceType){
                        case energieip.ledDriver:
                            leds.push(d.statusMac);
                            break;
                        case energieip.sensorDriver:
                            sensors.push(d.statusMac);
                            break;
                        case energieip.blindDriver:
                            blinds.push(d.statusMac);
                            break;
                        case energieip.hvacDriver:
                            hvacs.push(d.statusMac);
                            break;
                        case energieip.nanoDriver:
                            nanos.push(d.statusMac);
                            break;
                    }
                }
            }
        }
        CreateGui();

        class GroupMenu {
            get type() {
                return "energieip.Group";
            }
            constructor(sensors, leds, blinds) {
                this.group = 0;
                this.sensors = sensors;
                this.leds = leds;
                this.nanos = nanos;
                this.blinds = blinds;
                this.hvacs = hvacs;
                this.slopeStartManual = 10;
                this.slopeStopManual = 10;
                this.slopeStartAuto = 10;
                this.slopeStopAuto = 10;
                this.sensorRule = "average";
                this.correctionInterval = 1;
                this.name = "Group " + this.group;
                this.auto = false;
                this.rulePresence = 60;
                this.ruleBrightness = 400;
                this.watchdog = 3600;
                var update = function () {
                    requestAnimationFrame(update);
                };
                update();
            }
        };
        var menuGroup = new GroupMenu(sensors, leds, blinds);
        console.log("get menu ", menuGroup);

        var groupCfg = window.gui.addFolder("Create group");
        groupCfg.add(menuGroup, "group").name("Group");
        groupCfg.add(menuGroup, "name").name("Name");
        groupCfg.add(menuGroup, "slopeStartManual").name("Slope Start Manual (s)");
        groupCfg.add(menuGroup, "slopeStopManual").name("Slope Stop Manual (s)");
        groupCfg.add(menuGroup, "slopeStartAuto").name("Slope Start Auto (s)");
        groupCfg.add(menuGroup, "slopeStopAuto").name("Slope Stop Auto (s)");
        groupCfg.add(menuGroup, "correctionInterval").name("Correction Interval (s)");
        groupCfg.add(menuGroup, "sensorRule", ["average", "min", "max"]).name("Sensor Rule");
        groupCfg.add(menuGroup, "rulePresence").name("Rule Presence (s)");
        groupCfg.add(menuGroup, "ruleBrightness").name("Rule Brightness (Lux)");
        groupCfg.add({"OK":function(){ energieip.CreateGroup(menuGroup); }}, "OK").name("Apply");
        groupCfg.open();

    }

    function flyTo() {
        for (var label in window.drivers) {
            var driver = window.drivers[label];
            var selected = driver.id === this.id;
            if (selected) {
                if (window.mode == true && window.multipleSelection > 1) {
                    continue
                }
                if (window.gui != null){
                    document.getElementById('dat-gui-container').removeChild(window.gui.domElement);
                    window.gui.destroy();
                    window.gui = null;
                }
            }
            driver.labelShown = selected;
        }
    }

    //---------------------------------------------------
    // Load the model
    //---------------------------------------------------

    var title = document.getElementById("title");
    if (title != null){
        title.innerHTML = map["name"];
    }
    window.model = new xeogl.GLTFModel({
        id: "map",
        src: map["filepath"],
        objectTree: true,
        // scale: [.1, .1, .1],
        //  rotation: [90, 0, 0],
        
        // scale: [2, 2, 2],
        // position: [0, 0, -200],
        handleNode: (function() {
            return function (nodeInfo, actions) {
                if (nodeInfo.name && nodeInfo.mesh !== undefined) {
                    var label = nodeInfo.name;
                    var upperLabel = label.toUpperCase();
                    if (upperLabel.indexOf("MOBILIER") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("MUR") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("ARC") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("ESCALIER") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("DALLE") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("POTEAU") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("FENETRE") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("PLAFOND") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("PORTE") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("PANNEAU") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("CHASSIS") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("INT") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("COULISSANTE") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("U-FERS") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("HEB") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("EG") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("CTA") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("GROUPE") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("EBA") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("STRUCTURE") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("OUTPUT") !== -1) {
                        return true
                    }
                    if (upperLabel.indexOf("PROFIL") !== -1) {
                        return true
                    }
                    labels += label + ",";
                    actions.createObject = {
                        id: label,
                    };
                }
                return true;
            };
        })()
    });
    window.model.ghosted = false;

    //-----------------------------------------------------------------------------------------------------
    // Camera
    //-----------------------------------------------------------------------------------------------------

    camera.eye = [0, 0, 175];
    camera.look = [0, -100, 0];
    camera.up = [0,1,0];

    window.model.on("loaded", function () {
        window.scene.on("tick", function () { // Slowly orbit the camera

        });
        if (labels != "") {
            labels = labels.substring(0, labels.length - 1);
        }
        energieip.GetIfcDump(labels, function (ifcDrivers, groups){
            for (var lbl in window.model.meshes){
                var parse = lbl.split(".");
                parse.splice(0, 0);
                var label = parse[0];
                if (window.drivers.hasOwnProperty(label)){
                    continue
                }
                if (ifcDrivers.hasOwnProperty(label)){
                    var mesh = window.model.meshes[lbl];
                    var ifcModel = ifcDrivers[label];
                    var grStatus = {};
        
                    var driver = null;
                    var content = {
                        label: label,
                        mesh: mesh,
                        occludable: false,
                        title: "",
                        desc: "",
                        driverProperties: ifcModel,
                        pinShown: true,
                        labelShown: false
                    };
                    if ((ifcModel["ifc"].deviceType === energieip.switchDevice) || (ifcModel["ifc"].deviceType === energieip.wagoDevice)){
                        var cluster = ifcModel["status"].cluster || 0;
                        if (cluster === 0){
                            cluster = ifcModel["config"].cluster || 0;
                        }
                        content.glyph = cluster.toString();
                    } else {
                        var groupID = ifcModel["status"].group || 0;
                        if (groupID === 0){
                            groupID = ifcModel["config"].group || 0;
                        }
                        if (groups.hasOwnProperty(groupID)){
                            if (groups[groupID]["status"].group === groupID){
                                grStatus = groups[groupID]["status"];
                            } else{
                                grStatus = groups[groupID]["config"];
                            }
                        }
                        content.glyph = groupID.toString();
                        content.groupProperties = grStatus;
                    }
                    switch (ifcModel["ifc"].deviceType) {
                        case energieip.sensorDriver:
                            if (window.mode === true) {
                                var driver = new energieip.SensorMaintenance(content);
                            } else {
                                var driver = new energieip.SensorSupervision(content);
                            }
                            break;
                        case energieip.ledDriver:
                            if (window.mode === true) {
                                var driver = new energieip.LedMaintenance(content);
                            } else {
                                var driver = new energieip.LedSupervision(content);
                            }
                            break;
                        case energieip.blindDriver:
                            if (window.mode === true) {
                                var driver = new energieip.BlindMaintenance(content);
                            } else {
                                var driver = new energieip.BlindSupervision(content);
                            }
                            break;
                        case energieip.hvacDriver:
                            if (window.mode === true) {
                                var driver = new energieip.HvacMaintenance(content);
                            } else {
                                var driver = new energieip.HvacSupervision(content);
                            }
                            break;
                        case energieip.switchDevice:
                            if (window.mode === true) {
                                var driver = new energieip.SwitchMaintenance(content);
                            } else {
                                var driver = new energieip.SwitchSupervision(content);
                            }
                            break;
                        case energieip.wagoDevice:
                            if (window.mode === true) {
                                var driver = new energieip.WagoMaintenance(content);
                            } else {
                                var driver = new energieip.WagoSupervision(content);
                            }
                            break;
                        case energieip.nanoDriver:
                            if (window.mode === true) {
                                var driver = new energieip.NanosenseMaintenance(content);
                            } else {
                                var driver = new energieip.NanosenseSupervision(content);
                            }
                            break;
                        default:
                            console.log("Received type", ifcModel["ifc"].deviceType);
                            break;
                    }
                    if (driver != null){
                        driver.on("pinClicked", flyTo);
                        window.drivers[label] = driver;
                    }
                }
            }
        });

        energieip.Notifications(function(evt) {
            for (var i  in evt) {
                for(var eltType in evt[i]){
                    if (eltType === "groups"){
                        for (var group in evt[i].groups){
                            for (var d in window.drivers) {
                                var gr = evt[i].groups[group];
                                if (window.drivers[d].statusGroup != gr.group) {
                                    continue
                                }
                                window.drivers[d].updateGroupEvent(gr);
                            }
                        }
                        continue
                    }
                    for (var dr in evt[i][eltType]){
                        var elt = evt[i][eltType][dr];
                        type = eltType.slice(0, -1);
                        if (window.drivers.hasOwnProperty(elt.label)) {
                            if (i === "remove"){
                                window.drivers[elt.label].removeEvent();
                            } else {
                                window.drivers[elt.label].updateEvent(elt[type]);
                            }
                        } else {
                            if (window.mode === true){
                                if (elt.label === ""){
                                    var msg = type + ": " + elt[type].friendlyName + " (IP: " + elt[type].ip + ", MAC: "+ elt[type].mac+ " ) appears but not referenced";
                                    log(i, elt[type].mac, msg);
                                }
                            }
                        }
                    }
                }
            }

            for (var d in window.drivers){
                if (window.drivers[d].labelShown === true){
                    //refresh left menu
                    if (window.gui != null) {
                        for (var i = 0; i < Object.keys(window.gui.__folders).length; i++) {
                            var key = Object.keys(window.gui.__folders)[i];
                            for (var j = 0; j < window.gui.__folders[key].__controllers.length; j++ ) {
                                window.gui.__folders[key].__controllers[j].updateDisplay();
                            }
                        }
                    }
                }
            }
        });
    });

    //----------------------------
    // Controls
    //----------------------------
    var cameraControl = new xeogl.CameraControl({
    //        panToPointer: true,
    //        pivoting: true
            firstPerson: true,
    });

    var cameraFlight = new xeogl.CameraFlightAnimation();

    cameraControl.on("hoverEnter", function (hit) {
        if (window.drivers.hasOwnProperty(hit.mesh.id)){
            window.drivers[hit.mesh.id].labelShown = true;
            hit.mesh.highlighted = true;
        }
    });

    cameraControl.on("hoverOut", function (hit) {
        if (window.drivers.hasOwnProperty(hit.mesh.id)){
            window.drivers[hit.mesh.id].labelShown = false;
            hit.mesh.highlighted = false;
        }
    });

    cameraControl.on("picked", function (hit) {
        var mesh = hit.mesh;
        if (window.drivers.hasOwnProperty(hit.mesh.id)){
            if (input.keyDown[input.KEY_SHIFT]) {
                mesh.selected = !mesh.selected;
                mesh.highlighted = !mesh.selected;
                if (mesh.selected) {
                    window.multipleSelection += 1;
                } else {
                    window.multipleSelection -= 1;
                }
                if (window.multipleSelection > 1 && window.mode === true){
                    repartitionning();
                }
            } else {
                cameraFlight.flyTo(mesh);
            }
        }
    });

    cameraControl.on("pickedNothing", function (hit) {
        cameraFlight.flyTo(window.model);
    });
}

function Init(maintenance){
    window.multipleSelection = 0;
    window.drivers = {};
    window.gui = null;
    window.index = 0;
    window.maps = {};
    window.scene = null;
    window.model = null;
    window.mode = maintenance;
    $.ajax({
        dataType: "json",
        url: 'maps/maps.json',
        async: false,
        success: function(data) {
            window.maps = data;
        }
    });
}

function SwapMap(prev, next){
    var previous = window.index;
    if ((prev == null) && (next == null)) {
        return;
    }
    if (prev != null) {
        window.index -= 1;
        if (window.index < 0){
            window.index = Object.keys(window.maps).length -1;
        }
    } else {
        window.index += 1;
        if (window.index >= Object.keys(window.maps).length) {
            window.index = 0;
        }
    }

    if (previous == window.index){
        //no change same map
        return;
    }
   
    window.multipleSelection = 0;
    if (window.gui != null){
        window.gui.destroy();
        window.gui = null;
    }

    for (var lbl in window.drivers){
        window.drivers[lbl].pinShown = false;
        window.drivers[lbl].labelShown = false;
        window.drivers[lbl].destroy();
        window.drivers[lbl] = null;
    }
    window.model.clear();
    window.model.destroy();
    window.scene.clear();
    
    // window.scene.destroy();
    // window.scene = null;

    // var canvas = document.getElementById("myCanvas");
    // canvas.parentNode.removeChild(canvas);
    window.drivers = {};
    CreateView(window.maps[window.index.toString()]);
}


function CreateGui(){
    if (window.gui != null){
        document.getElementById('dat-gui-container').removeChild(window.gui.domElement);
        window.gui.destroy();
    }
    window.gui = new dat.GUI({autoPlace: false, top: 0, width: 400});
    document.getElementById('dat-gui-container').appendChild(window.gui.domElement);
}

function Display(info){
    for (var label in window.drivers) {
        var driver = window.drivers[label];
        if (driver.labelShown === true){
            CreateGui();
            switch (info){
                case "ifc":
                    driver.ifcInfo(window.gui);
                    break;
                case "status":
                    driver.statusElement(window.gui);
                    break;
                case "statusGroup":
                    driver.statusGroupInfo(window.gui);
                    break;
                case "control":
                    driver.controlElement(window.gui);
                    break;
                case "controlGroup":
                    driver.groupControlParam(window.gui);
                    break;
                case "configuration":
                    driver.configElement(window.gui);
                    break;
                case "configurationGroup":
                    driver.groupConfigParam(window.gui);
                    break;
                case "ifcInfo":
                    driver.ifcInfo(window.gui);
                    break;
            }
        }
    }
}