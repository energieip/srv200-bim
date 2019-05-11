{
    energieip.UpdateSensorNameCfg = function (driver) {
        var url = energieip.weblink + 'config/sensor';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                switch (this.status) {
                    case 200:
                        alert("Success");
                        break;
                    case 500:
                        var obj = JSON.parse(xhr.responseText);
                        alert("Error: " + obj.message);
                        break;
                    default:
                        alert("Error");
                        break;
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.UpdateSensorCfg = function (driver) {
        var url = energieip.weblink + 'config/sensor';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                switch (this.status) {
                    case 200:
                        alert("Success");
                        break;
                    case 500:
                        var obj = JSON.parse(xhr.responseText);
                        alert("Error: " + obj.message);
                        break;
                    default:
                        alert("Error");
                        break;
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
            "group": parseInt(driver.configGroup),
            "isBleEnabled": driver.configBle,
            "dumpFrequency": parseInt(driver.configDumpFrequency) * 1000,
            "brightnessCorrectionFactor": parseInt(driver.configBrightnessCorrectionFactor),
            "thresholdPresence": parseInt(driver.configThresholdPresence),
            "temperatureOffset": parseInt(driver.configTemperatureOffset) * 10,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.ResetSensorCfg = function (driver) {
        var url = energieip.weblink + 'config/sensor';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    alert("Command successfull");
                } else {
                    alert("Command Error");
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
            "isConfigured": false,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.Sensor = class sensor extends energieip.Driver {
        get type() {
            return "energieip.Sensor";
        }

        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-sensor";

            this._spot.className = this.default_color;

            this.deviceType = energieip.sensorDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._temperatureElement = document.createElement('div');
            this._temperatureElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._temperatureElement);

            this._presenceElement = document.createElement('div');
            this._presenceElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._presenceElement);

            this._humidityElement = document.createElement('div');
            this._humidityElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._humidityElement);

            this._brightnessElement = document.createElement('div');
            this._brightnessElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._brightnessElement);
            this._label.appendChild(this._groupElement);

            this.statusTemperature = driverObj.driverProperties.status.temperature / 10; //value in 1/10 °C
            this.statusBrightness = driverObj.driverProperties.status.brightness;
            this.statusPresence = driverObj.driverProperties.status.presence;
            this.statusHumidity = driverObj.driverProperties.status.humidity / 10;

            this.statusBrightnessCorrectionFactor = driverObj.driverProperties.status.brightnessCorrectionFactor;
            this.statusBrightnessRaw = driverObj.driverProperties.status.brightnessRaw;
            this.statusTemperatureOffset = driverObj.driverProperties.status.temperatureOffset / 10; //value in 1/10 °C
            this.statusTemperatureRaw = driverObj.driverProperties.status.temperatureRaw / 10; //value in 1/10 °C
            this.statusThresholdPresence = driverObj.driverProperties.status.thresholdPresence;
            this.statusLastMovement = driverObj.driverProperties.status.lastMovement;

            this.configBrightnessCorrectionFactor = this.statusBrightnessCorrectionFactor;
            this.configThresholdPresence = this.statusThresholdPresence;
            this.configTemperatureOffset = this.statusTemperatureOffset;

            if (this.statusIp === "") {
                this._spot.className = this.not_available_color;
            } else {
                if (this.statusError != 0) {
                    this._spot.className = this.error_color;
                }
            }

            var update = function () {
                requestAnimationFrame(update);
            };
            update();
        }

        set statusTemperature(val) {
            if (this._status_temperature === val) {
                return;
            }
            this._status_temperature = val;
            this._temperatureElement.innerHTML = "Temperature: " + this._status_temperature + "°C";
            this.fire("temperature", this);
        }

        get statusTemperature() {
            return this._status_temperature;
        }

        set statusBrightness(val) {
            if (this._status_brightness === val) {
                return;
            }
            this._status_brightness = val;
            this._brightnessElement.innerHTML = "Brightness: " + this._status_brightness + " Lux";
            this.fire("brightness", this);
        }

        get statusBrightness() {
            return this._status_brightness;
        }

        set statusPresence(val) {
            if (this._status_presence === val) {
                return;
            }
            this._status_presence = val;
            this._presenceElement.innerHTML = "Presence: " + this._status_presence;
            this.fire("presence", this);
        }

        get statusPresence() {
            return this._status_presence;
        }

        /**
         * @param {any} val
         */
        set statusHumidity(val) {
            if (this._status_humidity === val) {
                return;
            }
            this._status_humidity = val;
            this._humidityElement.innerHTML = "Humidity: " + this._status_humidity + "%";
            this.fire("humidity", this);
        }

        get statusHumidity() {
            return this._status_humidity;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
            this.statusTemperature = driverObj.temperature / 10; //value in 1/10 °C
            this.statusBrightness = driverObj.brightness;
            this.statusPresence = driverObj.presence;
            this.statusHumidity = driverObj.humidity / 10;
            this.statusBrightnessCorrectionFactor = driverObj.brightnessCorrectionFactor;
            this.statusBrightnessRaw = driverObj.brightnessRaw;
            this.statusTemperatureOffset = driverObj.temperatureOffset / 10; //value in 1/10 °C
            this.statusTemperatureRaw = driverObj.temperatureRaw / 10; //value in 1/10 °C
            this.statusThresholdPresence = driverObj.thresholdPresence;
            this.statusLastMovement = driverObj.lastMovement;
        }

        removeEvent() {
            super.removeEvent();
            this.statusTemperature = 0;
            this.statusBrightness = 0;
            this.statusPresence = false;
            this.statusHumidity = 0;
            this.statusBrightnessCorrectionFactor = 0;
            this.statusBrightnessRaw = 0;
            this.statusTemperatureOffset = 0;
            this.statusTemperatureRaw = 0;
            this.statusThresholdPresence = 0;
            this.statusLastMovement = 0;
        }

        statusElement(gui){
            var status = gui.addFolder("Sensor Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusTemperature").name("Temperature (°C)").listen();
            status.add(this, "statusBrightness").name("Brightness (Lux)").listen();
            status.add(this, "statusPresence").name("Presence").listen();
            status.add(this, "statusHumidity", 0, 100).name("Humidity (%)").listen();
            status.add(this, "statusGroup").name("Group").listen();
            return status;
        }
    };

    energieip.SensorSupervision = class sensorSupervision extends energieip.Sensor {
        get type() {
            return "energieip.Sensor";
        }

        init(driverObj) {
            super.init(driverObj);
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }

        statusElement(gui){
           var status = super.statusElement(gui);
           status.open();
        }

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.open();
        }

        ifcInfo(gui){}

        controlElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        configElement(gui){
            var config = gui.addFolder("Sensor Configuration");
            config.add(this, "configName").name("Name");
            config.add({"OK":function(){ energieip.UpdateSensorNameCfg(this); }}, "OK").name("Apply");
            config.open();
        }
    };

    energieip.SensorMaintenance = class sensorMaintenance extends energieip.Sensor {
        get type() {
            return "energieip.Sensor";
        }

        init(driverObj) {
            super.init(driverObj);
            this._label.appendChild(this._macElement);
            this._label.appendChild(this._ipElement);
            this._label.appendChild(this._labelElement);

            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }

        statusElement(gui){
            var status = super.statusElement(gui);
            status.add(this, "statusGroup").name("Group").listen();
            status.add(this, "statusError").name("Error Status").listen();
            status.add(this, "label").name("Cable").listen();
            status.add(this, "statusBle").name("BLE").listen();
            status.add(this, "statusBleMode").name("BLE Mode").listen();
            status.add(this, "statusIBeaconUUID").name("iBeacon UUID").listen();
            status.add(this, "statusIBeaconMajor").name("iBeacon Major").listen();
            status.add(this, "statusIBeaconMinor").name("iBeacon Minor").listen();
            status.add(this, "statusIBeaconTxPower").name("iBeacon Tx Power").listen();
            status.add(this, "statusIsConfigured").name("Ready").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusBrightnessCorrectionFactor").name("Brightness Correction (x)").listen();
            status.add(this, "statusBrightnessRaw").name("Brightness Raw (Lux)").listen();
            status.add(this, "statusTemperatureOffset").name("Temperature Offset (°C)").listen();
            status.add(this, "statusTemperatureRaw").name("Temperature Raw (°C)").listen();
            status.add(this, "statusThresholdPresence").name("Threshold Presence (s)").listen();
            status.add(this, "statusLastMovement").name("Last Movement (s)").listen();
            status.add(this, "statusVoltageInput").name("Voltage Input (V)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusHardwareVersion").name("Hardware Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("Sensor Information");
            ifc.add(this, "ifcModelName").name("Model Name");
            ifc.add(this, "ifcUrl").name("URL");
            ifc.add(this, "ifcVendor").name("Vendor Name");
            ifc.open();
        }

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.add(this, "groupStatusError").name("Error Status").listen();
            status.add(this, "groupStatusCorrectionInterval").name("Correction Interval (s)").listen();
            status.add(this, "groupStatusSensorRule").name("Sensor Rule").listen();
            status.add(this, "groupStatusSlopeStartManual").name("Slope Start Manual (s)").listen();
            status.add(this, "groupStatusSlopeStopManual").name("Slope Stop Manual (s)").listen();
            status.add(this, "groupStatusSlopeStartAuto").name("Slope Start Auto (s)").listen();
            status.add(this, "groupStatusSlopeStopAuto").name("Slope Stop Auto (s)").listen();
            status.add(this, "groupStatusTimeToAuto").name("Time to Auto (s)").listen();
            status.add(this, "groupStatusTimeToLeave").name("Time to Leave (s)").listen();
            status.add(this, "groupStatusRulePresence").name("Rule Presence (s)").listen();
            status.add(this, "groupStatusRuleBrightness").name("Rule Brightness (Lux)").listen();
            status.add(this, "groupStatusFirstDayOffset").name("1st Day Offset (%)").listen();
            status.add(this, "groupStatusWatchdog").name("Watchdog (s)").listen();
            status.open();
        };

        controlElement(gui){
            var controlDr = gui.addFolder("Sensor Control");
            controlDr.add({"reset": function(){
                if (confirm("Do you want to reset the sensor configuration ?")) {
                    energieip.ResetSensorCfg(this);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var config = gui.addFolder("Sensor Configuration");
            config.add(this, "configName").name("Name");
            config.add(this, "configGroup").name("Group");
            config.add(this, "configBle").name("BLE");
            config.add(this, "configDumpFrequency").name("Refresh Frequency (s)");
            config.add(this, "configBrightnessCorrectionFactor").name("Brightness Correction (x)");
            config.add(this, "configTemperatureOffset").name("Temperature Offset (°C)");
            config.add(this, "configThresholdPresence").name("Threshold Presence (s)");
            config.add({"OK":function(){ energieip.UpdateSensorCfg(this); }}, "OK").name("Apply");
            config.open();
        }

        groupConfigParam(gui){
            var controlGr = gui.addFolder("Group Configuration");
            controlGr.add(this, "groupConfigName").name("Name");
            controlGr.add(this, "groupConfigSlopeStartManual").name("Slope Start Manual (s)");
            controlGr.add(this, "groupConfigSlopeStopManual").name("Slope Stop Manual (s)");
            controlGr.add(this, "groupConfigSlopeStartAuto").name("Slope Start Auto (s)");
            controlGr.add(this, "groupConfigSlopeStopAuto").name("Slope Stop Auto (s)");
            controlGr.add(this, "groupConfigCorrectionInterval").name("Correction Interval (s)");
            controlGr.add(this, "groupConfigSensorRule", ["average", "min", "max"]).name("Sensor Rule");
            controlGr.add(this, "groupConfigRulePresence").name("Rule Presence (s)");
            controlGr.add(this, "groupConfigRuleBrightness").name("Rule Brightness (Lux)");
            controlGr.add(this, "groupConfigFirstDayOffset").name("1st Day Offset (%)");
            controlGr.add(this, "groupConfigWatchdog").name("Watchdog (s)");
            controlGr.add({"OK": function(){ energieip.UpdateGroupCfg(this); }}, "OK").name("Apply");
            controlGr.open();
        }
    };
}
