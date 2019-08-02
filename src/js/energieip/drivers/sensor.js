{
    energieip.ResetSensorCfg = function (driver) {
        var url = energieip.weblink + 'config/sensor';
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

            this.controlBleMode = "remote";
            this.controlPtmMac = "";
            this.controlBleUUID = "";
            this.controlBleTxPower = "0";
            this.controlBleMajor = "0";
            this.controlBleMinor = "0";

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
        }

        statusElement(gui){
            var status = gui.addFolder("Sensor Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusTemperature").name("Temperature (°C)").listen();
            status.add(this, "statusBrightness").name("Brightness (Lux)").listen();
            status.add(this, "statusPresence").name("Presence").listen();
            status.add(this, "statusHumidity", 0, 100).name("Humidity (%)").listen();
            status.add(this, "statusGroup").name("Group").listen();
            return status;
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

        statusElement(gui){
           var status = super.statusElement(gui);
           status.open();
        }

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.open();
        }

        ifcInfo(gui){}

        controlElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        configElement(gui){
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
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
            this.ifcProductionYear = driverObj.driverProperties.ifc.productionYear;
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
            status.add(this, "statusPtmMac").name("Switch Power Mac").listen();
            status.add(this, "statusIBeaconUUID").name("iBeacon UUID").listen();
            status.add(this, "statusIBeaconMajor").name("iBeacon Major").listen();
            status.add(this, "statusIBeaconMinor").name("iBeacon Minor").listen();
            status.add(this, "statusIBeaconTxPower").name("iBeacon Tx Power").listen();
            status.add(this, "statusIsConfigured").name("Ready").listen();
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusBrightnessCorrectionFactor").name("Brightness Correction (x)").listen();
            status.add(this, "statusBrightnessRaw").name("Brightness Raw (Lux)").listen();
            status.add(this, "statusTemperatureOffset").name("Temperature Offset (°C)").listen();
            status.add(this, "statusTemperatureRaw").name("Temperature Raw (°C)").listen();
            status.add(this, "statusThresholdPresence").name("Threshold Presence (s)").listen();
            status.add(this, "statusLastMovement").name("Last Movement (s)").listen();
            status.add(this, "statusVoltageInput").name("Voltage Input (V)").listen();
            status.add(this, "statusSoftwareVersion").name("Software Version").listen();
            status.add(this, "statusHardwareVersion").name("Hardware Version").listen();
            status.add(this, "statusSwitchMac").name("Switch Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("Sensor Information");
            ifc.add(this, "ifcModelName").name("Model Name");
            ifc.add(this, "ifcUrl").name("URL");
            ifc.add(this, "ifcVendor").name("Vendor Name");
            ifc.add(this, "ifcProductionYear").name("Production Year");
            ifc.open();
        }

        statusGroupInfo(gui){
            var status = super.statusGroupInfo(gui);
            status.add(this, "groupStatusCeilingTemperature").name("Ceiling Temperature (°C)").listen();
            status.add(this, "groupStatusCeilingHumidity").name("Ceiling Hygrometry (%)").listen();
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
            var controlDr = gui.addFolder("Sensor Control");
            controlDr.add({"reset": function(){
                if (confirm("Do you want to reset the sensor configuration ?")) {
                    energieip.ResetSensorCfg(driver);
                }
            }}, "reset").name("Reset");
            controlDr.open();
        }

        configElement(gui){
            var driver = this;
            var url = energieip.weblink + 'config/sensor';
            var config = gui.addFolder("Sensor Configuration");
            var name = config.add(this, "configName").name("Name");
            name.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "friendlyName": value,
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var gr = config.add(this, "configGroup").name("Group");
            gr.onFinishChange(function (value) {
                if (driver.statusGroup.toString() !== value.toString()){
                    var data = {
                        "mac": driver.statusMac,
                        "label": driver.label,
                        "group": parseInt(value),
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
            });
            var ble = config.add(this, "configBle").name("BLE");
            ble.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "isBleEnabled": value,
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            
            var bleMode = config.add(this, "controlBleMode",  ['remote', 'ptm', 'iBeacon']).name("BLE Mode");
            bleMode.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "bleMode": value
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var ptmMac = config.add(this, "controlPtmMac").name("Switch Power Mac");
            ptmMac.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "mac_ptm": value.toString()
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var bleUUID = config.add(this, "controlBleUUID").name("iBeacon UUID");
            bleUUID.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconUUID": value.toString()
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var bleMajor = config.add(this, "controlBleMajor").name("iBeacon Major");
            bleMajor.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconMajor": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var bleMinor = config.add(this, "controlBleMinor").name("iBeacon Minor");
            bleMinor.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconMinor": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var bleTxPower = config.add(this, "controlBleTxPower").name("iBeacon Tx Power");
            bleTxPower.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "iBeaconTxPower": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var ref = config.add(this, "configDumpFrequency", 1).name("Refresh Frequency (s)");
            ref.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "dumpFrequency": parseInt(value) * 1000,
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var corr = config.add(this, "configBrightnessCorrectionFactor").name("Brightness Correction (x)");
            corr.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "brightnessCorrectionFactor": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var off = config.add(this, "configTemperatureOffset").name("Temperature Offset (°C)");
            off.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "thresholdPresence": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var pres = config.add(this, "configThresholdPresence").name("Threshold Presence (s)");
            pres.onFinishChange(function (value) {
                var data = {
                    "mac": driver.statusMac,
                    "label": driver.label,
                    "temperatureOffset": parseInt(value) * 10,
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            config.open();
        }

        groupConfigParam(gui){
            var driver = this;
            var url = energieip.weblink + 'config/group';
            var controlGr = gui.addFolder("Group Configuration");
            var name = controlGr.add(this, "groupConfigName").name("Name");
            name.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "friendlyName": value
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var startManual = controlGr.add(this, "groupConfigSlopeStartManual").name("Slope Start Manual (s)");
            startManual.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStartManual": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var stopManual = controlGr.add(this, "groupConfigSlopeStopManual").name("Slope Stop Manual (s)");
            stopManual.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStopManual": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var startAuto = controlGr.add(this, "groupConfigSlopeStartAuto").name("Slope Start Auto (s)");
            startAuto.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStartAuto": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var stopAuto = controlGr.add(this, "groupConfigSlopeStopAuto").name("Slope Stop Auto (s)");
            stopAuto.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "slopeStopAuto": parseInt(value) * 1000
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            
            var interval = controlGr.add(this, "groupConfigCorrectionInterval").name("Correction Interval (s)");
            interval.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "correctionInterval": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            var rule = controlGr.add(this, "groupConfigSensorRule", ["average", "min", "max"]).name("Sensor Rule");
            rule.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "sensorRule": value.toString()
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var pres = controlGr.add(this, "groupConfigRulePresence").name("Rule Presence (s)");
            pres.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "rulePresence": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            
            var bright = controlGr.add(this, "groupConfigRuleBrightness").name("Rule Brightness (Lux)");
            bright.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "ruleBrightness": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var offset = controlGr.add(this, "groupConfigFirstDayOffset").name("1st Day Offset (%)");
            offset.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "firstDayOffset": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });

            var watchdog = controlGr.add(this, "groupConfigWatchdog").name("Watchdog (s)");
            watchdog.onFinishChange(function (value) {
                var data = {
                    "group": parseInt(driver.statusGroup),
                    "watchdog": parseInt(value)
                };

                energieip.SendRequest(
                    "POST", url, data, function(response){
                        alert("success");
                    },
                    function(response){
                        alert("Error" + response["message"]);
                    }
                );
            });
            controlGr.open();
        }
    };
}
