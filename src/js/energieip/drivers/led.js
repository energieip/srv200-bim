{
    energieip.UpdateLedNameCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
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

    energieip.UpdateLedCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
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
            "isBleEnabled": driver.configBle,
            "group": parseInt(driver.configGroup),
            "watchdog": parseInt(driver.configWatchdog),
            "dumpFrequency": parseInt(driver.configDumpFrequency) * 1000,
            "thresoldHigh": parseInt(driver.configThresholdHigh),
            "thresoldLow": parseInt(driver.configThresholdLow),
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.ResetLedCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
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

    energieip.SendLedCmd = function (driver) {
        var url = energieip.weblink + 'command/led';
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
            "auto": driver.controlAuto,
            "setpoint": parseInt(driver.controlLight),
        };
        xhr.send(JSON.stringify(content));
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
            this.statusIMax = driverObj.driverProperties.status.iMax || 0;
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
            this.statusIMax = driverObj.iMax || 0;
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

            // this.configWatchdog = this.statusWatchdog;
            // this.configThresholdLow = this.statusThresholdLow;
            // this.configThresholdHigh = this.statusThresholdHigh;
            // this.controlLight = this.statusLight;
            // this.controlAuto = this.statusAuto;
        }

        removeEvent() {
            super.removeEvent();
            this.statusAuto = false;
            this.statusLight = 0;

            this.statusDevicePower = 0;
            this.statusPMax = 0;
            this.statusIMax = 0;
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

            // this.configWatchdog = this.statusWatchdog;
            // this.configThresholdLow = this.statusThresholdLow;
            // this.configThresholdHigh = this.statusThresholdHigh;
            // this.controlLight = this.statusLight;
            // this.controlAuto = this.statusAuto;
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
    };

    energieip.LedMaintenance = class ledMaintenance extends energieip.Led {
        get type() {
            return "energieip.Led";
        }

        init(driverObj) {
            super.init(driverObj);
            this._label.appendChild(this._macElement);
            this._label.appendChild(this._ipElement);

            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }
    };
}