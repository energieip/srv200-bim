{
    energieip.UpdateBlindNameCfg = function (driver) {
        var url = energieip.weblink + 'config/blind';
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

    energieip.UpdateBlindCfg = function (driver) {
        var url = energieip.weblink + 'config/blind';
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
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.ResetBlindCfg = function (driver) {
        var url = energieip.weblink + 'config/blind';
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

    energieip.SendBlindCmd = function (driver) {
        var url = energieip.weblink + 'command/blind';
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
            "blind1": parseInt(driver.controlBlind1),
            "blind2": parseInt(driver.controlBlind2),
            "slat1": parseInt(driver.controlSlat1),
            "slat2": parseInt(driver.controlSlat2),
        };
        xhr.send(JSON.stringify(content));
    }

    energieip.Blind = class blind extends energieip.Driver {
        get type() {
            return "energieip.Blind";
        }
 
        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-blind";
            
            this.deviceType = energieip.blindDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._spot.className = this.default_color;

            this._setpointElement = document.createElement('div');
            this._setpointElement.className = "xeogl-annotation-group";

            this._label.appendChild(this._setpointElement);
            this._label.appendChild(this._groupElement);
            
            this.statusDaisyChained = driverObj.driverProperties.status.daisyChainEnabled;
            this.statusDaisyChainedPos = driverObj.driverProperties.status.daisyChainPos;
            this.statusWindowStatus1 = driverObj.driverProperties.status.windowStatus1;
            this.statusWindowStatus2 = driverObj.driverProperties.status.windowStatus2;
            this.statusBlind1 = driverObj.driverProperties.status.blind1 || 0;
            this.statusBlind2 = driverObj.driverProperties.status.blind2 ||0;
            this.statusSlat1 = driverObj.driverProperties.status.slat1 || 0;
            this.statusSlat2 = driverObj.driverProperties.status.slat2 ||0;

            this.controlBlind1 = 0;
            this.controlBlind2 = 0;
            this.controlSlat1 = 0;
            this.controlSlat2 = 0;

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

            this.statusDaisyChained = false;
            this.statusDaisyChainedPos = 0;
            this.statusWindowStatus1 = false;
            this.statusWindowStatus2 = false;
            this.statusBlind1 = 0;
            this.statusBlind2 = 0;
            this.statusSlat1 = 0;
            this.statusSlat2 = 0;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);

            this.statusDaisyChained = driverObj.daisyChainEnabled;
            this.statusDaisyChainedPos = driverObj.daisyChainPos;
            this.statusWindowStatus1 = driverObj.windowStatus1;
            this.statusWindowStatus2 = driverObj.windowStatus2;
            this.statusBlind1 = driverObj.blind1||0;
            this.statusBlind2 = driverObj.blind2||0;
            this.statusSlat1 = driverObj.slat1||0;
            this.statusSlat2 = driverObj.slat2||0;
        }
    };

    energieip.BlindSupervision = class blindSupervision extends energieip.Blind {
        get type() {
            return "energieip.Blind";
        }

        init(driverObj) {
            super.init(driverObj);
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
        }
    };

    energieip.BlindMaintenance = class blindMaintenance extends energieip.Blind {
        get type() {
            return "energieip.Blind";
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
    };
}