{
    energieip.UpdateLedCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
        var data = {
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
            "isBleEnabled": driver.configBle,
            "group": parseInt(driver.configGroup),
            "watchdog": parseInt(driver.configWatchdog),
            "dumpFrequency": parseInt(driver.configDumpFrequency) * 1000,
            "thresoldHigh": parseInt(driver.configThresholdHigh),
            "thresoldLow": parseInt(driver.configThresholdLow),
        };
        energieip.SendRequest(
            "POST", url, data, function(response){
                alert("success");
            },
            function(response){
                alert("Error" + response["message"]);
            }
        );
    }

    energieip.ResetLedCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
        var data = {
            "mac": driver.statusMac,
            "isConfigured": false,
        };
        energieip.SendRequest(
            "POST", url, data, function(response){
                alert("success");
            },
            function(response){
                alert("Error" + response["message"]);
            }
        );
    }

    energieip.SendLedCmd = function (driver) {
        var url = energieip.weblink + 'command/led';
        var data = {
            "mac": driver.statusMac,
            "auto": driver.controlAuto,
            "setpoint": parseInt(driver.controlLight),
        };
        energieip.SendRequest(
            "POST", url, data, function(response){
                alert("success");
            },
            function(response){
                alert("Error" + response["message"]);
            }
        );
    }

    energieip.Led = class led extends energieip.Driver {
        get type() {
            return "energieip.Led";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-led";
            
            this.deviceType = energieip.ledDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";

            this._label.appendChild(this._setpointElement);
            this._label.appendChild(this._groupElement);

            this.statusAuto = driverObj.driverProperties.status.auto;
            this.statusLight = driverObj.driverProperties.status.setpoint;
            
            this.statusDevicePower = driverObj.driverProperties.status.devicePower || 0;
            this.statusPMax = driverObj.driverProperties.status.pMax || 0;
            this.statusDaisyChained = driverObj.driverProperties.status.daisyChainEnabled || false;
            this.statusDaisyChainedPos = driverObj.driverProperties.status.daisyChainPos || 0;
            this.statusThresholdLow = driverObj.driverProperties.status.thresholdLow || 0;
            this.statusThresholdHigh = driverObj.driverProperties.status.thresholdHigh || 100;
            this.statusVoltageLed = driverObj.driverProperties.status.voltageLed || 0;
            this.statusEnergy = driverObj.driverProperties.status.energy || 0;
            this.statusDuration = driverObj.driverProperties.status.duration || 0;
            this.statusTimeToAuto = driverObj.driverProperties.status.timeToAuto || 0;
            this.statusLinePower = driverObj.driverProperties.status.linePower || 0;
            this.statusWatchdog = driverObj.driverProperties.status.watchdog || 0;

            this.configWatchdog = this.statusWatchdog.toString() || "0";
            this.configThresholdLow = this.statusThresholdLow;
            this.configThresholdHigh = this.statusThresholdHigh;

            this.controlLight = 0;
            this.controlAuto = false;

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

        set statusAuto(val) {
            if (this._status_auto === val) {
                return;
            }
            this._status_auto = val || false;
            this.fire("auto", this);
        }

        get statusAuto() {
            return this._status_auto;
        }

        set statusLight(val) {
            if (this._status_light === val) {
                return;
            }
            this._status_light = val || "0";
            this._setpointElement.innerHTML = "Light: " + this._status_light + " %";
            this.fire("setpoint", this);
        }

        get statusLight() {
            return this._status_light;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
            this.statusAuto = driverObj.auto;
            this.statusLight = driverObj.setpoint;

            this.statusDevicePower = driverObj.devicePower || 0;
            this.statusPMax = driverObj.pMax || 0;
            this.statusDaisyChained = driverObj.daisyChainEnabled || false;
            this.statusDaisyChainedPos = driverObj.daisyChainPos || 0;
            this.statusThresholdHigh = driverObj.thresholdHigh || 100;
            this.statusThresholdLow = driverObj.thresholdLow || 0;
            this.statusVoltageLed = driverObj.voltageLed || 0;
            this.statusDuration = driverObj.duration || 0;
            this.statusTimeToAuto = driverObj.timeToAuto || 0;
            this.statusEnergy = driverObj.energy || 0;
            this.statusLinePower = driverObj.linePower || 0;
            this.statusWatchdog = driverObj.watchdog || 0;
        }

        removeEvent() {
            super.removeEvent();
            this.statusAuto = false;
            this.statusLight = 0;

            this.statusDevicePower = 0;
            this.statusPMax = 0;
            this.statusDaisyChained = false;
            this.statusDaisyChainedPos = 0;
            this.statusThresholdHigh = 100;
            this.statusThresholdLow = 0;
            this.statusVoltageLed = 0;
            this.statusDuration = 0;
            this.statusTimeToAuto = 0;
            this.statusEnergy = 0;
            this.statusLinePower = 0;
            this.statusWatchdog = 0;
        }

        statusElement(gui){
            var status = gui.addFolder("LED Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusLight", 0, 100).name("Light (%)").listen();
            status.add(this, "statusAuto").name("Auto").listen();
            status.add(this, "statusGroup").name("Group").listen();
            return status;
        }
    };

    energieip.LedSupervision = class ledSupervision extends energieip.Led {
        get type() {
            return "energieip.Led";
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
        ifcInfo(gui){}

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.open();
        }

        controlElement(gui){
            var driver = this;
            var controlDr = gui.addFolder("LED Control");
            controlDr.add(this, "controlLight", 0, 100).name("Light (%)");
            controlDr.add(this, "controlAuto").name("Auto");
            controlDr.add({"OK":function(){ energieip.SendLedCmd(driver); }}, "OK").name("Apply");
            controlDr.open();
        }


        configElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }
    };

    energieip.LedMaintenance = class ledMaintenance extends energieip.Led {
        get type() {
            return "energieip.Led";
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
            status.add(this, "statusThresholdLow").name("Threshold Low (%)").listen();
            status.add(this, "statusThresholdHigh").name("Threshold High (%)").listen();
            status.add(this, "statusDaisyChained").name("Daisy Chained").listen();
            status.add(this, "statusDaisyChainedPos").name("Daisy Chain Position").listen();
            status.add(this, "statusDevicePower").name("Device Power (W)").listen();
            status.add(this, "statusVoltageLed").name("Voltage LED (V)").listen();
            status.add(this, "statusEnergy").name("Cumulative Energy (Wh)").listen();
            status.add(this, "statusLinePower").name("Line Power (W)").listen();
            status.add(this, "statusDuration").name("Light Duration (s)").listen();
            status.add(this, "statusPMax", 0, 100).name("PMax (W)").listen();
            status.add(this, "statusVoltageInput").name("Voltage Input (V)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusHardwareVersion").name("Hardware Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("LED Information");
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
            var driver = this;
            var controlDr = gui.addFolder("LED Control");
            controlDr.add(this, "controlLight", 0, 100).name("Light (%)");
            controlDr.add(this, "controlAuto").name("Auto");
            controlDr.add({"OK":function(){ energieip.SendLedCmd(driver); }}, "OK").name("Apply");
            controlDr.add({"reset": function() {
                if (confirm("Do you want to reset the LED configuration ?")) {
                    energieip.ResetLedCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var driver = this;
            var config = gui.addFolder("LED Configuration");
            config.add(this, "configName").name("Name");
            config.add(this, "configGroup").name("Group");
            config.add(this, "configBle").name("BLE");
            config.add(this, "configDumpFrequency").name("Refresh Frequency (s)");
            config.add(this, "configThresholdLow",  0, 100).name("Threshold Low (%)");
            config.add(this, "configThresholdHigh",  0, 100).name("Threshold High (%)");
            config.add(this, "configWatchdog").name("Watchdog");
            config.add({"OK":function(){ energieip.UpdateLedCfg(driver); }}, "OK").name("Apply");
            config.open();
        }

        groupConfigParam(gui){
            var driver = this;
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
            controlGr.add({"OK": function(){ console.log(driver);
                energieip.UpdateGroupCfg(driver); }}, "OK").name("Apply");
            controlGr.open();
        }
    };
}