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

            // this.configBrightnessCorrectionFactor = this.statusBrightnessCorrectionFactor;
            // this.configThresholdPresence = this.statusThresholdPresence;
            // this.configTemperatureOffset = this.statusTemperatureOffset;
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

            // this.configBrightnessCorrectionFactor = this.statusBrightnessCorrectionFactor;
            // this.configThresholdPresence = this.statusThresholdPresence;
            // this.configTemperatureOffset = this.statusTemperatureOffset;
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
    };
}
