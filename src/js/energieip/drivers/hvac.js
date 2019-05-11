{
    energieip.UpdateHvacNameCfg = function (driver) {
        var url = energieip.weblink + 'config/hvac';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE){
                switch (this.status) {
                    case 200:
                        alert("Success");
                        break;
                    case 500:
                        var obj = JSON.parse(xhr.responseText);
                        alert("Error: "+ obj.message);
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

    energieip.UpdateHvacCfg = function (driver) {
        var url = energieip.weblink + 'config/hvac';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE){
                switch (this.status) {
                    case 200:
                        alert("Success");
                        break;
                    case 500:
                        var obj = JSON.parse(xhr.responseText);
                        alert("Error: "+ obj.message);
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
            "dumpFrequency": parseInt(driver.configDumpFrequency) * 1000,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.ResetHvacCfg = function (driver) {
        var url = energieip.weblink + 'config/hvac';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                switch (this.status) {
                    case 200:
                        alert("Success");
                        break;
                    case 500:
                        var obj = JSON.parse(xhr.responseText);
                        alert("Error: "+ obj.message);
                        break;
                    default:
                        alert("Error");
                        break;
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
            "isConfigured": false,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.SendHvacCmd = function (driver) {
        var url = energieip.weblink + 'command/hvac';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE){
                switch (this.status) {
                    case 200:
                        alert("Success");
                        break;
                    case 500:
                        var obj = JSON.parse(xhr.responseText);
                        alert("Error: "+ obj.message);
                        break;
                    default:
                        alert("Error");
                        break;
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.Hvac = class hvac extends energieip.Driver {
        get type() {
            return "energieip.Hvac";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-hvac";
            
            this.deviceType = energieip.hvacDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";

            this._label.appendChild(this._groupElement);
            
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

        removeEvent() {
            super.removeEvent();

        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }

        statusElement(gui){
            var status = gui.addFolder("Hvacs Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusGroup").name("Group").listen();
            return status;
        }
    };

    energieip.HvacSupervision = class hvacSupervision extends energieip.Hvac {
        get type() {
            return "energieip.Hvac";
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
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        configElement(gui){
            var config = gui.addFolder("Driver Configuration");
            config.add(this, "configName").name("Name");
            config.add({"OK":function(){ energieip.UpdateHvacNameCfg(this); }}, "OK").name("Apply");
            config.open();
        }
    };

    energieip.HvacMaintenance = class hvacMaintenance extends energieip.Hvac {
        get type() {
            return "energieip.Hvac";
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
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusVoltageInput").name("Voltage Input (V)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusHardwareVersion").name("Hardware Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("HVAC Information");
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
            var controlDr = gui.addFolder("HVAC Control");
            controlDr.add({"reset": function(){
                if (confirm("Do you want to reset the HVAC configuration ?")) {
                    energieip.ResetHvacCfg(this);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var config = gui.addFolder("HVAC Configuration");
            config.add(this, "configName").name("Name");
            config.add(this, "configGroup").name("Group");
            config.add(this, "configDumpFrequency").name("Refresh Frequency (s)");
            config.add({"OK":function(){ energieip.UpdateHvacCfg(this); }}, "OK").name("Apply");
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