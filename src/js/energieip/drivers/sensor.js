{
    energieip.UpdateSensorCfg = function (dsensor) {
        var url = energieip.weblink + 'setup/sensor';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            }
        }
        var content = {
            "mac": dsensor.mac,
            "group": parseInt(dsensor.group),
            "friendlyName": dsensor.friendlyName,
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
            
            this._deviceType = "Sensor";
            this._typeElement.innerHTML = this._deviceType;

            this._temperatureElement = document.createElement('div');
            this._temperatureElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._temperatureElement);

            this.temperature = driverObj.temperature
        }

        set temperature(val) {
            if (this._temperature === val) {
                return;
            }
            this._temperature = val;
            this._temperatureElement.innerHTML = "Temperature: " + this._temperature + " °C";
            this.fire("temperature", this);
        }

        get temperature() {
            return this._temperature;
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
        }
    };
}