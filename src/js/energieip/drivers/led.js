{
    energieip.UpdateLedNameCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE){
                if (this.status === 200) {
                    alert("Command successfull");
                } else{
                    alert("Command Error");
                }
            }
        }
        var content = {
            "mac": driver.statusMac,
            "friendlyName": driver.configName,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.RestLedCfg = function (driver) {
        var url = energieip.weblink + 'config/led';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE){
                if (this.status === 200) {
                    alert("Command successfull");
                } else{
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

    energieip.SendLedCmd = function (driver) {
        var url = energieip.weblink + 'command/led';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE){
                if (this.status === 200) {
                    alert("Command successfull");
                } else{
                    alert("Command Error");
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
            this._status_auto = val;
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
        }
    };

    energieip.LedSupervision = class ledSupervision extends energieip.Led {
        get type() {
            return "energieip.Led";
        }

        init(driverObj) {
            super.init(driverObj);
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

            this.statusDevicePower = driverObj.driverProperties.status.devicePower;
            this.statusIMax = driverObj.driverProperties.status.iMax;
            this.statusDaisyChained = driverObj.driverProperties.status.daisyChainEnabled;
            this.statusDaisyChainedPos = driverObj.driverProperties.status.daisyChainPos;
            this.statusThresholdLow = driverObj.driverProperties.status.thresholdLow;
            this.statusThresholdHigh = driverObj.driverProperties.status.thresholdHigh;
            this.statusVoltageLed = driverObj.driverProperties.status.voltageLed;
            this.statusEnergy = driverObj.driverProperties.status.energy;
            this.statusDuration = driverObj.driverProperties.status.duration;
            this.statusTimeToAuto = driverObj.driverProperties.status.timeToAuto;
            this.statusLinePower = driverObj.driverProperties.status.linePower;
            this.statusWatchdog = driverObj.driverProperties.status.watchdog;

            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
            this.statusDevicePower = driverObj.devicePower;
            this.statusIMax = driverObj.iMax;
            this.statusDaisyChained = driverObj.daisyChainEnabled;
            this.statusDaisyChainedPos = driverObj.daisyChainPos;
            this.statusThresholdHigh = driverObj.thresholdHigh;
            this.statusVoltageLed = driverObj.voltageLed;
            this.statusDuration = driverObj.duration;
            this.statusTimeToAuto = driverObj.timeToAuto;
            this.statusEnergy = driverObj.energy;
            this.statusLinePower = driverObj.linePower;
            this.statusWatchdog = driverObj.watchdog;
        }
    };
}