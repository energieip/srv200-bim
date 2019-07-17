{
    energieip.Driver = class driver extends xeogl.Annotation {
        get type() {
            return "energieip.Driver";
        }
 
        init(driverObj) {
            super.init(driverObj);

            this.default_color = "xeogl-annotation-pin";
            this.error_color = "xeogl-annotation-pin-error";
            this.not_available_color = "xeogl-annotation-pin-not-present";
            this.deviceType = energieip.driver;

            this._typeElement = document.createElement('div');
            this._typeElement.innerHTML = "Driver: " + this.deviceType;
            this._typeElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._typeElement);

            this._friendlyNameElement = document.createElement('div');
            this._friendlyNameElement.className = "xeogl-annotation-alias";
            this._label.appendChild(this._friendlyNameElement);

            this._groupElement = document.createElement('div');
            this._groupElement.className = "xeogl-annotation-group";

            this._ipElement = document.createElement('div');
            this._ipElement.className = "xeogl-annotation-group";

            this._macElement = document.createElement('div');
            this._macElement.className = "xeogl-annotation-mac";

            this._labelElement = document.createElement('div');
            this._labelElement.className = "xeogl-annotation-mac";

            this.statusMac = driverObj.driverProperties.status.mac||"";
            this.statusName = driverObj.driverProperties.status.friendlyName||"";
            this.statusError = driverObj.driverProperties.status.error||0;
            this.label = driverObj.driverProperties.ifc.label;
            this._labelElement.innerHTML = "Cable: " + this.label;
            this.statusIp = driverObj.driverProperties.status.ip||"";
            this.statusBle = driverObj.driverProperties.status.isBleEnabled||false;
            this.statusBleMode = driverObj.driverProperties.status.bleMode || "";
            this.statusIBeaconUUID = driverObj.driverProperties.status.iBeaconUUID || "";
            this.statusIBeaconMajor = driverObj.driverProperties.status.iBeaconMajor || 0;
            this.statusIBeaconMinor = driverObj.driverProperties.status.iBeaconMinor || 0;
            this.statusIBeaconTxPower = driverObj.driverProperties.status.iBeaconTxPower || "";
            this.statusIsConfigured = driverObj.driverProperties.status.isConfigured||false;
            this.statusSoftwareVersion = driverObj.driverProperties.status.softwareVersion||0;
            this.statusHardwareVersion = 0;
            if (driverObj.driverProperties.status.hasOwnProperty("hardwareVersion")) {
                this.statusHardwareVersion = driverObj.driverProperties.status.hardwareVersion||0;
            }
            this.statusSwitchMac = driverObj.driverProperties.status.switchMac ||"";
            this.statusDumpFrequency = driverObj.driverProperties.status.dumpFrequency / 1000;
            this.statusVoltageInput = 0;
            if (driverObj.driverProperties.status.hasOwnProperty("voltageInput")) {
                this.statusVoltageInput = driverObj.driverProperties.status.voltageInput || 0;
            }
            this.groupStatusLightFirstDay = 0;
            this.groupStatusLight = 0;
            this.groupStatusName = "";
            this.groupStatusPresence = false;
            this.groupStatusWindowsOpened = false;
            this.groupStatusBrightness = 0;
            this.groupStatusTemperature = 0;
            this.groupStatusHumidity = 0;
            this.groupStatusAuto = false;
            this.groupStatusError = 0;
            this.groupStatusGroup = 0;
            this.groupStatusCorrectionInterval = 0;
            this.groupStatusSensorRule = "average";
            this.groupStatusSlopeStartManual = 0;
            this.groupStatusSlopeStopManual = 0;
            this.groupStatusSlopeStartAuto = 0;
            this.groupStatusSlopeStopAuto = 0;
            this.groupStatusWatchdog = 0;
            this.groupStatusTimeToAuto = 0;
            this.groupStatusTimeToLeave = 0;
            this.groupStatusFirstDayOffset = 0;

            this.configName = this.statusName;
            this.configDumpFrequency = this.statusDumpFrequency.toString() || "1";
            this.configBle = this.statusBle;
            
            if (driverObj.groupProperties.hasOwnProperty("firstDayOffset")) {
                this.groupStatusFirstDayOffset = driverObj.groupProperties.firstDayOffset||0;
            }

            if (driverObj.groupProperties.hasOwnProperty("setpointLeds")) {
                this.groupStatusLight = driverObj.groupProperties.setpointLeds;
            }

            if (driverObj.groupProperties.hasOwnProperty("setpointLedsFirstDay")) {
                this.groupStatusLightFirstDay = driverObj.groupProperties.setpointLedsFirstDay;
            }

            if (driverObj.groupProperties.hasOwnProperty("friendlyName")) {
                this.groupStatusName = driverObj.groupProperties.friendlyName || "";
            }

            if (driverObj.groupProperties.hasOwnProperty("presence")) {
                this.groupStatusPresence = driverObj.groupProperties.presence || false;
            }

            if (driverObj.groupProperties.hasOwnProperty("windowsOpened")) {
                this.groupStatusWindowsOpened = driverObj.groupProperties.windowsOpened ||false;
            }

            if (driverObj.groupProperties.hasOwnProperty("temperature")) {
                this.groupStatusTemperature = driverObj.groupProperties.temperature/10;
            }

            if (driverObj.groupProperties.hasOwnProperty("humidity")) {
                this.groupStatusHumidity = driverObj.groupProperties.humidity/10;
            }

            if (driverObj.groupProperties.hasOwnProperty("brightness")) {
                this.groupStatusBrightness = driverObj.groupProperties.brightness||0;
            }

            if (driverObj.groupProperties.hasOwnProperty("auto")) {
                this.groupStatusAuto = driverObj.groupProperties.auto;
            }

            if (driverObj.groupProperties.hasOwnProperty("error")) {
                this.groupStatusError = driverObj.groupProperties.error;
            }

            if (driverObj.groupProperties.hasOwnProperty("group")) {
                this.groupStatusGroup = driverObj.groupProperties.group;
            }
            this.statusGroup = this.groupStatusGroup;
            this.configGroup = this.statusGroup.toString() || "0";

            if (driverObj.groupProperties.hasOwnProperty("correctionInterval")) {
                this.groupStatusCorrectionInterval = driverObj.groupProperties.correctionInterval;
            }

            if (driverObj.groupProperties.hasOwnProperty("sensorRule")) {
                this.groupStatusSensorRule = driverObj.groupProperties.sensorRule;
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStartManual")) {
                this.groupStatusSlopeStartManual = driverObj.groupProperties.slopeStartManual / 1000; //data in ms
            } 

            if (driverObj.groupProperties.hasOwnProperty("slopeStopManual")) {
                this.groupStatusSlopeStopManual = driverObj.groupProperties.slopeStopManual / 1000; //data in ms
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStartAuto")) {
                this.groupStatusSlopeStartAuto = driverObj.groupProperties.slopeStartAuto / 1000; //data in ms
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStopAuto")) {
                this.groupStatusSlopeStopAuto = driverObj.groupProperties.slopeStopAuto / 1000; //data in ms
            }

            if (driverObj.groupProperties.hasOwnProperty("watchdog")) {
                this.groupStatusWatchdog = driverObj.groupProperties.watchdog;
            }

            if (driverObj.groupProperties.hasOwnProperty("timeToAuto")) {
                this.groupStatusTimeToAuto = driverObj.groupProperties.timeToAuto;
            }

            if (driverObj.groupProperties.hasOwnProperty("timeToLeave")) {
                this.groupStatusTimeToLeave = driverObj.groupProperties.timeToLeave;
            }

            this.groupStatusRuleBrightness = 0;
            this.groupStatusRulePresence = 0;
            if (driverObj.groupProperties.hasOwnProperty("ruleBrightness")) {
                this.groupStatusRuleBrightness = driverObj.groupProperties.ruleBrightness || 0;
            }
            if (driverObj.groupProperties.hasOwnProperty("rulePresence")) {
                this.groupStatusRulePresence = driverObj.groupProperties.rulePresence || 0;
            }

            this.groupControlLight = this.groupStatusLight;
            this.groupControlLightFirstDay = this.groupStatusLightFirstDay;
            this.groupControlAuto = this.groupStatusAuto;
            this.groupControlBlinds = 0;
            this.groupControlBlindsSlats = 0;
            this.groupConfigName = this.groupStatusName;
            this.groupConfigFirstDayOffset = "0";
            this.groupConfigSlopeStartManual = this.groupStatusSlopeStartManual.toString();
            this.groupConfigSlopeStopManual = this.groupStatusSlopeStopManual.toString();
            this.groupConfigSlopeStartAuto = this.groupStatusSlopeStartAuto.toString();
            this.groupConfigSlopeStopAuto = this.groupStatusSlopeStopAuto.toString();
            this.groupConfigCorrectionInterval = this.groupStatusCorrectionInterval.toString();
            this.groupConfigSensorRule = this.groupStatusSensorRule.toString();
            this.groupConfigRuleBrightness = this.groupStatusRuleBrightness.toString();
            this.groupConfigRulePresence = this.groupStatusRulePresence.toString();
            this.groupConfigWatchdog = this.groupStatusWatchdog.toString();
            this.groupControlTemp = 0;
        }

        get deviceType() {
            return this._deviceType;
        }

        set deviceType(val) {
            this._deviceType = val;
        }

        set statusError(val) {
            if (this._status_error === val) {
                return;
            }
            this._status_error = val;
            if (this._status_error != 0) {
                this._spot.className = this.error_color;
            } else {
                this._spot.className = this.default_color;
            }
            this.fire("error", this);
        }

        get statusError() {
            return this._status_error;
        }

        set statusGroup(gr) {
            if (this._status_group === gr) {
                return;
            }
            this._status_group = gr || "0";
            this._groupElement.innerHTML = "Group: " +  this._status_group;
            this.fire("group", this);
        }

        get statusGroup() {
            return this._status_group;
        }

        set statusIp(val) {
            if (this._status_ip === val) {
                return;
            }
            this._status_ip = val || "";
            if (this._status_ip === "") {
                this._spot.className = this.not_available_color;
            } else {
                this._spot.className = this.default_color;
            }
            this._ipElement.innerHTML = "IP: " +  this._status_ip;
            this.fire("ip", this);
        }

        get statusIp() {
            return this._status_ip;
        }

        set statusIsConfigured(val) {
            if (this._status_isConfigured === val) {
                return;
            }
            this._status_isConfigured = val || false;
            if (this._status_isConfigured === false) {
                this._spot.className = this.not_available_color;
            } else {
                this._spot.className = this.default_color;
            }
            this.fire("isConfigured", this);
        }

        get statusIsConfigured() {
            return this._status_isConfigured;
        }

        set statusMac(mc) {
            if (this._status_mac === mc) {
                return;
            }
            this._status_mac = mc || "";
            this._macElement.innerHTML = "Mac: " + this._status_mac;
            this.fire("mac", this);
        }

        get statusMac() {
            return this._status_mac;
        }

        set statusName(fr) {
            if (this._statusName === fr) {
                return;
            }
            this._statusName = fr || "";
            this._friendlyNameElement.innerHTML = "Name: " + this._statusName;
            this.fire("friendlyName", this);
        }

        get statusName() {
            return this._statusName;
        }
    
        getJSON() {
            var json = super.getJSON();
            json.mac = this.mac;
            json.group = this._group;
            json.friendlyName = this._friendlyName;
            return json;
        }

        destroy() {
            super.destroy();
        }

        updateEvent(driverObj) {
            console.log("update", driverObj);
            this.statusGroup = driverObj.group;
            this.statusName = driverObj.friendlyName;
            this.statusIp = driverObj.ip;
            this.statusMac = driverObj.mac;
            this.statusError = driverObj.error;
            this.statusBle = driverObj.isBleEnabled;
            this.statusBleMode = driverObj.bleMode || "";
            this.statusIBeaconUUID = driverObj.iBeaconUUID || "";
            this.statusIBeaconMajor = driverObj.iBeaconMajor || 0;
            this.statusIBeaconMinor = driverObj.iBeaconMinor || 0;
            this.statusIBeaconTxPower = driverObj.iBeaconTxPower || "";
            this.statusIsConfigured = driverObj.isConfigured;
            this.statusSoftwareVersion = driverObj.softwareVersion;
            if (driverObj.hasOwnProperty("hardwareVersion")) {
                this.statusHardwareVersion = driverObj.hardwareVersion;
            }
            this.statusSwitchMac = driverObj.switchMac;
            this.statusDumpFrequency = driverObj.dumpFrequency / 1000;
            if (driverObj.hasOwnProperty("voltageInput")) {
                this.statusVoltageInput = driverObj.voltageInput;
            }
            this.glyph = this.statusGroup;
        }

        removeEvent() {
            console.log("remove");
            this.statusGroup = 0;
            this.statusName = "";
            this.statusIp = "";
            this.statusError = 0;
            this.statusBle = false;
            this.statusBleMode = "";
            this.statusIBeaconUUID = "";
            this.statusIBeaconMajor = 0;
            this.statusIBeaconMinor = 0;
            this.statusIBeaconTxPower = "";
            this.statusIsConfigured = false;
            this.statusSoftwareVersion = 0;
            this.statusHardwareVersion = 0;
            this.statusSwitchMac = "";
            this.statusDumpFrequency = 0;
            this.statusVoltageInput = 0;
            this.glyph = this.statusGroup;
        }

        updateGroupEvent(grObj) {
            this.groupStatusLight = grObj.setpointLeds;
            this.groupStatusName = grObj.friendlyName;
            this.groupStatusPresence = grObj.presence;
            this.groupStatusTemperature = grObj.temperature/10;
            this.groupStatusBrightness = grObj.brightness;
            this.groupStatusHumidity = grObj.humidity/10;
            this.groupStatusWindowsOpened = grObj.windowsOpened;
            this.groupStatusAuto = grObj.auto;
            this.groupStatusError = grObj.error;
            this.groupStatusGroup = grObj.group;
            this.groupStatusCorrectionInterval = grObj.correctionInterval;
            this.groupStatusSensorRule = grObj.sensorRule;
            this.groupStatusSlopeStartManual = grObj.slopeStartManual / 1000; //data in ms
            this.groupStatusSlopeStopManual = grObj.slopeStopManual / 1000; //data in ms
            this.groupStatusSlopeStartAuto = grObj.slopeStartAuto / 1000; //data in ms
            this.groupStatusSlopeStopAuto = grObj.slopeStopAuto / 1000; //data in ms
            this.groupStatusWatchdog = grObj.watchdog;
            this.groupStatusTimeToAuto = grObj.timeToAuto;
            this.groupStatusTimeToLeave = grObj.timeToLeave;
            if (grObj.hasOwnProperty("firstDayOffset")) {
                this.groupStatusFirstDayOffset = grObj.firstDayOffset || 0;
            }
            if (grObj.hasOwnProperty("setpointLedsFirstDay")) {
                this.groupStatusLightFirstDay = grObj.setpointLedsFirstDay || 0;
            } 
            if (grObj.hasOwnProperty("ruleBrightness")) {
                this.groupStatusRuleBrightness = grObj.ruleBrightness || 0;
            }
            if (grObj.hasOwnProperty("rulePresence")) {
                this.groupStatusRulePresence = grObj.rulePresence || 0;
            }
        }

        statusElement(gui){}
        ifcInfo(gui){
            
        }

        statusGroupInfo(gui){
            var grStatus = gui.addFolder("Group Status");
            grStatus.add(this, "groupStatusName").name("Name").listen();
            grStatus.add(this, "groupStatusGroup").name("Group").listen();
            grStatus.add(this, "groupStatusLight", 0, 100).name("Light (%)").listen();
            grStatus.add(this, "groupStatusLightFirstDay", 0, 100).name("1st Days Light (%)").listen();
            grStatus.add(this, "groupStatusPresence").name("Detection").listen();
            grStatus.add(this, "groupStatusWindowsOpened").name("Windows Opened").listen();
            grStatus.add(this, "groupStatusHumidity").name("Humidity (%)").listen();
            grStatus.add(this, "groupStatusTemperature").name("Temperature (°C)").listen();
            grStatus.add(this, "groupStatusBrightness").name("Brigthness (Lux)").listen();
            grStatus.add(this, "groupStatusAuto").name("Auto").listen();
            return grStatus
        }

        groupControlParam(gui){
            var driver = this;
            var url = energieip.weblink + 'command/group';
            var controlGr = gui.addFolder("Group Control");
            var light = controlGr.add(this, "groupControlLight", 0, 100).name("Light (%)");
            light.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "setpointLeds": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var auto = controlGr.add(this, "groupControlAuto").name("Auto");
            auto.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "auto": value
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var blds = controlGr.add(this, "groupControlBlinds", { Stop: 0, Up: 1, Down: 2 }).name("Blinds");
            blds.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "setpointBlinds": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var slats = controlGr.add(this, "groupControlBlindsSlats", 0,  180).step(30).name("Blinds Slats");
            slats.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "setpointSlats": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var temp = controlGr.add(this, "groupControlTemp", -2,  2).step(1).name("Temperature Shift (°C)");
            temp.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "setpointTempOffset": value
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            controlGr.open();
        }

        groupConfigParam(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }
    };
}