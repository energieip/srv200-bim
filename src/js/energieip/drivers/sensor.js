{
    energieip.UpdateSensorNameCfg = function (dsensor) {
        var url = energieip.weblink + 'setup/sensor';
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

    energieip.Sensor = class sensor extends energieip.Driver {
        get type() {
            return "energieip.Sensor";
        }
 
        init(driverObj) {
            super.init(driverObj);

            this._spot.className = "xeogl-annotation-pin-sensor";

            this.deviceType = energieip.sensorDriver;
            this._typeElement.innerHTML = this.deviceType;

            this._temperatureElement = document.createElement('div');
            this._temperatureElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._temperatureElement);

            this._presenceElement = document.createElement('div');
            this._presenceElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._presenceElement);

            this._brightnessElement = document.createElement('div');
            this._brightnessElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._brightnessElement);

            this.statusTemperature = driverObj.driverProperties.status.temperature;
            this.statusBrightness = driverObj.driverProperties.status.brightness;
            this.statusPresence = driverObj.driverProperties.status.presence;
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
            this._temperatureElement.innerHTML = "Temperature: " + this._status_temperature + " °C";
            this.fire("temperature", this);
        }

        get statusTemperature() {
            return this._status_temperature;
        }

        set statusBrightness(val) {
            if (this._status_brigthness === val) {
                return;
            }
            this._status_brigthness = val;
            this._brightnessElement.innerHTML = "Brightness: " + this._status_brigthness + " Lux";
            this.fire("brigthness", this);
        }

        get statusBrightness() {
            return this._status_brigthness;
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
    };

    energieip.SensorSupervision = class sensorSupervision extends energieip.Sensor {
        get type() {
            return "energieip.Sensor";
        }

        init(driverObj) {
            super.init(driverObj);
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

            this.ifcModelName = driverObj.driverProperties.ifc.modelName;
            this.ifcUrl = driverObj.driverProperties.ifc.url;
            this.ifcVendor = driverObj.driverProperties.ifc.vendor;
        }
    };
}