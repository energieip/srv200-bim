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

            this.statusGroup = driverObj.driverProperties.status.group;
            this.statusMac = driverObj.driverProperties.status.mac;
            this.statusName = driverObj.driverProperties.status.friendlyName;
            this.statusError = driverObj.driverProperties.status.error;
            this.label = driverObj.label;
            this.statusIp = driverObj.driverProperties.status.ip;
            this.statusBle = driverObj.driverProperties.status.isBleEnabled;
            this.statusIsConfigured = driverObj.driverProperties.status.isConfigured;
            this.statusSoftwareVersion = driverObj.driverProperties.status.softwareVersion;
            this.statusHardwareVersion = driverObj.driverProperties.status.hardwareVersion;
            this.statusSwitchMac = driverObj.driverProperties.status.switchMac;
            this.statusDumpFrequency = driverObj.driverProperties.status.dumpFrequency / 1000;
            this.statusVoltageInput = driverObj.driverProperties.status.voltageInput;

            this.configName = this.statusName;
            this.configGroup = this.statusGroup.toString() || "0";
            this.configDumpFrequency = this.statusDumpFrequency;
            this.configBle = this.statusBle;
            
            if (driverObj.groupProperties.hasOwnProperty("setpointLeds")) {
                this.groupStatusLight = driverObj.groupProperties.setpointLeds;
            } else {
                this.groupStatusLight = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("setpointLedsFirstDay")) {
                this.groupStatusLightFirstDay = driverObj.groupProperties.setpointLedsFirstDay;
            } else {
                this.groupStatusLightFirstDay = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("friendlyName")) {
                this.groupStatusName = driverObj.groupProperties.friendlyName;
            } else {
                this.groupStatusName = "";
            }

            if (driverObj.groupProperties.hasOwnProperty("presence")) {
                this.groupStatusPresence = driverObj.groupProperties.presence;
            } else {
                this.groupStatusPresence = false;
            }

            if (driverObj.groupProperties.hasOwnProperty("auto")) {
                this.groupStatusAuto = driverObj.groupProperties.auto;
            } else {
                this.groupStatusAuto = false;
            }

            if (driverObj.groupProperties.hasOwnProperty("error")) {
                this.groupStatusError = driverObj.groupProperties.error;
            } else {
                this.groupStatusError = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("group")) {
                this.groupStatusGroup = driverObj.groupProperties.group;
            } else {
                this.groupStatusGroup = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("correctionInterval")) {
                this.groupStatusCorrectionInterval = driverObj.groupProperties.correctionInterval;
            } else {
                this.groupStatusCorrectionInterval = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("sensorRule")) {
                this.groupStatusSensorRule = driverObj.groupProperties.sensorRule;
            } else {
                this.groupStatusSensorRule = "average";
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStartManual")) {
                this.groupStatusSlopeStartManual = driverObj.groupProperties.slopeStartManual / 1000; //data in ms
            } else {
                this.groupStatusSlopeStartManual = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStopManual")) {
                this.groupStatusSlopeStopManual = driverObj.groupProperties.slopeStopManual / 1000; //data in ms
            } else {
                this.groupStatusSlopeStopManual = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStartAuto")) {
                this.groupStatusSlopeStartAuto = driverObj.groupProperties.slopeStartAuto / 1000; //data in ms
            } else {
                this.groupStatusSlopeStartAuto = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStopAuto")) {
                this.groupStatusSlopeStopAuto = driverObj.groupProperties.slopeStopAuto / 1000; //data in ms
            } else {
                this.groupStatusSlopeStopAuto = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("watchdog")) {
                this.groupStatusWatchdog = driverObj.groupProperties.watchdog;
            } else {
                this.groupStatusWatchdog = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("timeToAuto")) {
                this.groupStatusTimeToAuto = driverObj.groupProperties.timeToAuto;
            } else {
                this.groupStatusTimeToAuto = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("timeToLeave")) {
                this.groupStatusTimeToLeave = driverObj.groupProperties.timeToLeave;
            } else {
                this.groupStatusTimeToLeave = 0;
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
            this.groupConfigFirstDayOffset = 0;
            this.groupConfigSlopeStartManual = this.groupStatusSlopeStartManual;
            this.groupConfigSlopeStopManual = this.groupStatusSlopeStopManual;
            this.groupConfigSlopeStartAuto = this.groupStatusSlopeStartAuto;
            this.groupConfigSlopeStopAuto = this.groupStatusSlopeStopAuto;
            this.groupConfigCorrectionInterval = this.groupStatusCorrectionInterval;
            this.groupConfigSensorRule = this.groupStatusSensorRule;
            this.groupConfigRuleBrightness = this.groupStatusRuleBrightness;
            this.groupConfigRulePresence = this.groupStatusRulePresence;
            this.groupConfigWatchdog = this.groupStatusWatchdog;
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
            this.statusIsConfigured = driverObj.isConfigured;
            this.statusSoftwareVersion = driverObj.softwareVersion;
            this.statusHardwareVersion = driverObj.hardwareVersion;
            this.statusSwitchMac = driverObj.switchMac;
            this.statusDumpFrequency = driverObj.dumpFrequency / 1000;
            this.statusVoltageInput = driverObj.voltageInput;

            //Fix default value
            // this.configName = this.statusName;
            // this.configGroup = this.statusGroup;
            // this.configDumpFrequency = this.statusDumpFrequency;
            // this.configBle = this.statusBle;
            this.glyph = this.statusGroup;
        }

        removeEvent() {
            console.log("remove");
            this.statusGroup = 0;
            this.statusName = "";
            this.statusIp = "";
            this.statusError = 0;
            this.statusBle = false;
            this.statusIsConfigured = false;
            this.statusSoftwareVersion = 0;
            this.statusHardwareVersion = 0;
            this.statusSwitchMac = "";
            this.statusDumpFrequency = 0;
            this.statusVoltageInput = 0;

            //Fix default value
            // this.configName = this.statusName;
            // this.configGroup = this.statusGroup;
            // this.configDumpFrequency = this.statusDumpFrequency;
            // this.configBle = this.statusBle;
            this.glyph = this.statusGroup;
        }

        updateGroupEvent(grObj) {
            this.groupStatusLight = grObj.setpointLeds;
            this.groupStatusName = grObj.friendlyName;
            this.groupStatusPresence = grObj.presence;
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

            // this.groupControlLight = this.groupStatusLight;
            // this.groupControlAuto = this.groupStatusAuto;
            // this.groupConfigName = this.groupStatusName;
            // this.groupConfigSlopeStartManual = this.groupStatusSlopeStartManual;
            // this.groupConfigSlopeStopManual = this.groupStatusSlopeStopManual;
            // this.groupConfigSlopeStartAuto = this.groupStatusSlopeStartAuto;
            // this.groupConfigSlopeStopAuto = this.groupStatusSlopeStopAuto;
            // this.groupConfigCorrectionInterval = this.groupStatusCorrectionInterval;
            // this.groupConfigSensorRule = this.groupStatusSensorRule;
            // this.groupConfigRuleBrightness = this.groupStatusRuleBrightness;
            // this.groupConfigRulePresence = this.groupStatusRulePresence;
            // this.groupConfigWatchdog = this.groupStatusWatchdog;
        }
    };
}