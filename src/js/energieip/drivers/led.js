{
    energieip.UpdateLedNameCfg = function (dled) {
        var url = energieip.weblink + 'setup/led';
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
            "mac": dled.statusMac,
            "friendlyName": dled.configName,
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.SendLedCmd = function (dled) {
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
            "mac": dled.statusMac,
            "auto": dled.controlAuto,
            "setpoint": parseInt(dled.controlLight),
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
            this._typeElement.innerHTML = this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";

            this._label.appendChild(this._setpointElement);

            this.statusAuto = driverObj.driverProperties.status.auto;
            this.statusLight = driverObj.driverProperties.status.setpoint;
            this.statusError = driverObj.driverProperties.status.error;

            this.controlLight = 0;
            this.controlAuto = false;

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
            this._setpointElement.innerHTML = "Percentage: " + this._status_light + " %";
            this.fire("setpoint", this);
        }

        get statusLight() {
            return this._status_light;
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
            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
        }
    };
}