{
    energieip.Nanosense = class nano extends energieip.Driver {
        get type() {
            return "energieip.Nanosense";
        }

        init(driverObj) {
            super.init(driverObj);
            this.default_color = "xeogl-annotation-pin-sensor";

            this._spot.className = this.default_color;

            this.deviceType = energieip.nanoDriver;
            this._typeElement.innerHTML = "Driver: " + this.deviceType;

            this._temperatureElement = document.createElement('div');
            this._temperatureElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._temperatureElement);

            this._hygrometryElement = document.createElement('div');
            this._hygrometryElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._hygrometryElement);

            this._co2Element = document.createElement('div');
            this._co2Element.className = "xeogl-annotation-group";
            this._label.appendChild(this._co2Element);

            this._covElement = document.createElement('div');
            this._covElement.className = "xeogl-annotation-group";
            this._label.appendChild(this._covElement);
            this._label.appendChild(this._groupElement);

            this.statusTemperature = parseFloat(driverObj.driverProperties.status.temperature / 10).toFixed(1); //value in 1/10 °C
            this.statusHygrometry = parseFloat(driverObj.driverProperties.status.hygrometry / 10).toFixed(1); //value in 1/10 %
            this.statusCO2 = parseFloat(driverObj.driverProperties.status.co2 / 10).toFixed(1);
            this.statusCOV = parseFloat(driverObj.driverProperties.status.cov / 10).toFixed(1);
            this.statusCluster = driverObj.driverProperties.status.cluster||0;

            if (this.statusMac === "") {
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

        set statusHygrometry(val) {
            if (this._status_hygrometry === val) {
                return;
            }
            this._status_hygrometry = val;
            this._hygrometryElement.innerHTML = "Hygrometry: " + this._status_hygrometry + " %";
            this.fire("hygrometry", this);
        }

        get statusHygrometry() {
            return this._status_hygrometry;
        }

        set statusCO2(val) {
            if (this._status_co2 === val) {
                return;
            }
            this._status_co2 = val;
            this._co2Element.innerHTML = "CO2: " + this._status_co2 + " ppm";
            this.fire("co2", this);
        }

        get statusCO2() {
            return this._status_co2;
        }

        set statusCOV(val) {
            if (this._status_cov === val) {
                return;
            }
            this._status_cov = val;
            this._covElement.innerHTML = "COV: " + this._status_cov + " ppm";
            this.fire("cov", this);
        }

        get statusCOV() {
            return this._status_co2;
        }

        set statusIsConfigured(val) {
            val = true;
            if (this._status_isConfigured === val) {
                return;
            }
            this._status_isConfigured = val || false;
            if (this._status_isConfigured === false) {
                this._spot.className = this.not_available_color;
            } else {
                this._spot.className = this.default_color;
            }
            this.fire("isConfigured", this);
        }

        get statusIsConfigured() {
            return this._status_isConfigured;
        }

        updateEvent(driverObj) {
            super.updateEvent(driverObj);
            this.statusTemperature = parseFloat(driverObj.temperature / 10).toFixed(1); //value in 1/10 °C
            this.statusHygrometry = parseFloat(driverObj.hygrometry / 10).toFixed(1); //value in 1/10 %
            this.statusCO2 = parseFloat(driverObj.co2 / 10).toFixed(1); //value in 1/10 ppm
            this.statusCOV = parseFloat(driverObj.cov / 10).toFixed(1); //value in 1/10 ppm
            this.statusCluster = driverObj.cluster;
        }

        removeEvent() {
            super.removeEvent();
            this.statusTemperature = 0; //value in 1/10 °C
            this.statusHygrometry = 0; //value in 1/10 %
            this.statusCO2 = 0; //value in 1/10 ppm
            this.statusCOV = 0; //value in 1/10 ppm
            this.statusCluster = 0;
        }

        statusElement(gui){
            var status = gui.addFolder("Nanosense Status");
            status.add(this, "statusName").name("Name").listen();
            status.add(this, "statusTemperature").name("Temperature (°C)").listen();
            status.add(this, "statusCOV").name("COV (ppm)").listen();
            status.add(this, "statusCO2").name("CO2 (ppm)").listen();
            status.add(this, "statusHygrometry", 0, 100).name("Hygrometry (%)").listen();
            status.add(this, "statusGroup").name("Group").listen();
            return status;
        }
    };

    energieip.NanosenseSupervision = class nanoSupervision extends energieip.Nanosense {
        get type() {
            return "energieip.Nanosense";
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

    energieip.NanosenseMaintenance = class nanoMaintenance extends energieip.Nanosense {
        get type() {
            return "energieip.Nanosense";
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
            status.add(this, "statusIp").name("IP").listen();
            status.add(this, "statusCluster").name("Cluster").listen();
            status.add(this, "statusMac").name("Mac address").listen();
            status.add(this, "statusDumpFrequency").name("Refresh Frequency (s)").listen();
            status.open();
        }

        ifcInfo(gui){
            var ifc = gui.addFolder("Nanosense Information");
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
            if (gui != null){
                document.getElementById('dat-gui-container').removeChild(gui.domElement);
                gui.destroy();
                window.gui = null;
            }
        }

        configElement(gui){
            var driver = this;
            var url = energieip.weblink + 'config/nanosense';
            var config = gui.addFolder("Nanosense Configuration");
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
