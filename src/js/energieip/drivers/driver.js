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
            this.statusDumpFrequency = driverObj.driverProperties.status.dumpFrequency;
            this.statusVoltageInput = driverObj.driverProperties.status.voltageInput;

            this.configName = "";

            this.groupControlLight = 0;
            this.groupControlAuto = false
            this.groupConfigName = "";
            
            if (driverObj.groupProperties.hasOwnProperty("setpointLeds")) {
                this.groupStatusLight = driverObj.groupProperties.setpointLeds;
            } else {
                this.groupStatusLight = 0;
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

            if (driverObj.groupProperties.hasOwnProperty("slopeStart")) {
                this.groupStatusSlopeStart = driverObj.groupProperties.slopeStart;
            } else {
                this.groupStatusSlopeStart = 0;
            }

            if (driverObj.groupProperties.hasOwnProperty("slopeStop")) {
                this.groupStatusSlopeStop = driverObj.groupProperties.slopeStop;
            } else {
                this.groupStatusSlopeStop = 0;
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
            if (driverObj.groupProperties.hasOwnProperty("groupRules")) {
                if (driverObj.groupProperties.groupRules.hasOwnProperty("brightness")) {
                    this.groupStatusRuleBrightness = driverObj.groupProperties.groupRules.brightness || 0;
                }
                if (driverObj.groupProperties.groupRules.hasOwnProperty("presence")) {
                    this.groupStatusRulePresence = driverObj.groupProperties.groupRules.presence || 0;
                }
            }
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
            this.statusDumpFrequency = driverObj.dumpFrequency;
            this.statusVoltageInput = driverObj.voltageInput;
        }

        updateGroupEvent(grObj) {
            console.log("update group", grObj);
            this.groupStatusLight = grObj.setpointLeds;
            this.groupStatusName = grObj.friendlyName;
            this.groupStatusPresence = grObj.presence;
            this.groupStatusAuto = grObj.auto;
            this.groupStatusError = grObj.error;
            this.groupStatusGroup = grObj.group;
            this.groupStatusCorrectionInterval = grObj.correctionInterval;
            this.groupStatusSensorRule = grObj.sensorRule;
            this.groupStatusSlopeStart = grObj.slopeStart;
            this.groupStatusSlopeStop = grObj.slopeStop;
            this.groupStatusWatchdog = grObj.watchdog;
            this.groupStatusTimeToAuto = grObj.timeToAuto;
            this.groupStatusTimeToLeave = grObj.timeToLeave;
            if (grObj.groupRules.hasOwnProperty("brightness")) {
                this.groupStatusRuleBrightness = grObj.groupRules.brightness || 0;
            }
            if (grObj.groupRules.hasOwnProperty("presence")) {
                this.groupStatusRulePresence = grObj.groupRules.presence || 0;
            }
        }
    };
}