function CreateView(maintenance=false){
    var labels = '';
    var scene = new xeogl.Scene({
        transparent: true
    });

    xeogl.setDefaultScene(scene);

    var camera = scene.camera;
    var input = scene.input;

    var buf = [];

    // Logs text to the page
    function log(event, params) {

        var txt = event;
        if (params) {
            txt += ": " + JSON.stringify(params)
        }

        if (buf.indexOf(txt) >= 0) {
            return
        }

        buf.push(txt);

        if (buf.length > 30) {
            buf.shift();
        }
        document.getElementById("log").innerText = buf.join("\n");
    }

    function repartitionning() {
        var leds = [];
        var sensors = [];
        var blinds = [];
        var hvacs = [];
        for (var label in model.meshes){
            if (window.drivers.hasOwnProperty(label)){
                var d = window.drivers[label];
                if (model.meshes[label].selected === true) {
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
                if (maintenance == true && window.multipleSelection > 1) {
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
    var model = new xeogl.GLTFModel({
        id: "map",
        src: "maps/N8B_R3_mockup_V8_furnitures4.gltf",
        objectTree: true,
        //scale: [.6, .6, .6],
        scale: [2, 2, 2],
        handleNode: (function() {
            return function (nodeInfo, actions) {
                // console.log("=== " , nodeInfo);
                if (nodeInfo.name && nodeInfo.mesh !== undefined) {
                    var parse = nodeInfo.name.split("_");
                    parse.splice(0, 2);
                    var label = parse.join("_");
                    var count = (label.match(/_/g)||[]).length;
                    if (count > 1){
                        // console.log("=== label", label);
                        labels += label + ",";
                        actions.createObject = {
                            id: label,
                        };
                    }
                }
                return true;
            };
        })()
    });
    model.ghosted = false;


    //-----------------------------------------------------------------------------------------------------
    // Camera
    //-----------------------------------------------------------------------------------------------------

    camera.eye = [100, 50.6997528076172, -40.179931640625];
    // camera.look = [20,0,0];
    camera.up = [0,1,0];

    model.on("loaded", function () {
        scene.on("tick", function () { // Slowly orbit the camera

        });
        if (labels != "") {
            labels = labels.substring(0, labels.length - 1);
        }
        energieip.GetIfcDump(labels, function (ifcDrivers, groups){
            for (var lbl in model.meshes){
                var parse = lbl.split(".");
                parse.splice(0, 0);
                var label = parse[0];
                if (window.drivers.hasOwnProperty(label)){
                    continue
                }
                if (ifcDrivers.hasOwnProperty(label)){
                    var mesh = model.meshes[lbl];
                    var ifcModel = ifcDrivers[label];
                    var grStatus = {};
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
                    var driver = null;
                    var content = {
                        label: label,
                        mesh: mesh,
                        occludable: false,
                        glyph: groupID.toString(),
                        title: "",
                        desc: "",
                        driverProperties: ifcModel,
                        groupProperties: grStatus,
                        pinShown: true,
                        labelShown: false
                    };
                    switch (ifcModel["ifc"].deviceType) {
                        case energieip.sensorDriver:
                            if (maintenance === true) {
                                var driver = new energieip.SensorMaintenance(content);
                            } else {
                                var driver = new energieip.SensorSupervision(content);
                            }
                            break;
                        case energieip.ledDriver:
                            if (maintenance === true) {
                                var driver = new energieip.LedMaintenance(content);
                            } else {
                                var driver = new energieip.LedSupervision(content);
                            }
                            break;
                        case energieip.blindDriver:
                            if (maintenance === true) {
                                var driver = new energieip.BlindMaintenance(content);
                            } else {
                                var driver = new energieip.BlindSupervision(content);
                            }
                            break;
                        case energieip.hvacDriver:
                            if (maintenance === true) {
                                var driver = new energieip.HvacMaintenance(content);
                            } else {
                                var driver = new energieip.HvacSupervision(content);
                            }
                            break;
                        case energieip.switchDevice:
                            if (maintenance === true) {
                                var driver = new energieip.SwitchMaintenance(content);
                            } else {
                                var driver = new energieip.SwitchSupervision(content);
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
                        if (window.drivers.hasOwnProperty(elt.label)) {
                            if (i === "remove"){
                                window.drivers[elt.label].removeEvent();
                            } else {
                                window.drivers[elt.label].updateEvent(elt.led);
                            }
                        } else {
                            if (maintenance === true){
                                if (elt.label === ""){
                                    var type = eltType.slice(0, eltType.length-1);
                                    var msg = type + ": " + elt[type].friendlyName + " (IP: " + elt[type].ip + ", MAC: "+ elt[type].mac+ " ) appears but not referenced";
                                    log(msg);
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
                if (window.multipleSelection > 1 && maintenance === true){
                    repartitionning();
                }
            } else {
                cameraFlight.flyTo(mesh);
            }
        }
    });

    cameraControl.on("pickedNothing", function (hit) {
        cameraFlight.flyTo(model);
    });
}

function Init(){
    window.multipleSelection = 0;
    window.drivers = {};
    window.gui = null;
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