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

            this.statusTemperature = driverObj.driverProperties.status.temperature;
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